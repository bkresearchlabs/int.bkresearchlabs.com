import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  RefreshCw, 
  AlertTriangle,
  Lock,
  CheckCircle
} from 'lucide-react';
import { UserAccountSecurity } from '../../types/security';
import { securityApi } from '../../lib/securityApi';

interface BackupCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSec: UserAccountSecurity;
  userEmail: string;
  onCodesRegenerated: (updatedSec: UserAccountSecurity) => void;
}

export const BackupCodesModal: React.FC<BackupCodesModalProps> = ({
  isOpen,
  onClose,
  userSec,
  userEmail,
  onCodesRegenerated
}) => {
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [regenSuccessMsg, setRegenSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const codes = userSec.backup_codes || [];

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDownloadCodes = () => {
    const content = `BK RESEARCH LABS - MULTI-FACTOR AUTHENTICATION BACKUP CODES
Account: ${userEmail}
Generated: ${new Date().toUTCString()}
Keep these one-time emergency codes in a safe place (password manager or physical vault).
Each code can only be used once if you lose access to your primary authenticator app.

${codes.map((c, i) => `${i + 1}. ${c}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bkrl-mfa-backup-codes-${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintCodes = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>BK Research Labs MFA Backup Codes - ${userEmail}</title>
            <style>
              body { font-family: monospace; padding: 40px; color: #000; line-height: 1.6; }
              h1 { font-family: sans-serif; font-size: 18px; margin-bottom: 4px; }
              .meta { font-size: 12px; color: #555; margin-bottom: 24px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 400px; }
              .code { padding: 8px 12px; border: 1px dashed #999; font-size: 14px; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>BK Research Labs — Multi-Factor Recovery Codes</h1>
            <div class="meta">Account: ${userEmail} | Date: ${new Date().toLocaleString()}</div>
            <p>Treat these codes like your master password. Each code grants one-time emergency access.</p>
            <div class="grid">
              ${codes.map(c => `<div class="code">${c}</div>`).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleRegenerateCodes = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const newCodes = securityApi.generateBackupRecoveryCodes(8);
      const updatedSec: UserAccountSecurity = {
        ...userSec,
        backup_codes: newCodes,
        backup_codes_remaining: newCodes.length,
        last_security_audit_at: new Date().toISOString()
      };
      securityApi.saveUserAccountSecurity(updatedSec);
      onCodesRegenerated(updatedSec);
      setIsRegenerating(false);
      setConfirmRegenerate(false);
      setRegenSuccessMsg(true);
      setTimeout(() => setRegenSuccessMsg(false), 3000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#002b29] text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-400/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Emergency Vault</div>
              <h2 className="text-lg font-serif font-bold">MFA Backup Recovery Codes</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">

          {regenSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ New backup recovery codes generated and saved securely.</span>
            </div>
          )}

          <div className="text-xs text-slate-600 space-y-1">
            <p>
              Recovery codes allow you to sign in if you lose access to your phone or hardware key. Each code can be used <span className="font-bold">only once</span>.
            </p>
            <p className="text-slate-400 text-[11px]">
              Remaining active codes: <span className="font-bold text-slate-700">{userSec.backup_codes_remaining || codes.length} of {codes.length}</span>
            </p>
          </div>

          {/* Codes Grid */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-2.5 font-mono text-sm font-bold tracking-wider">
              {codes.map((code, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-emerald-300 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-sans">{idx + 1}.</span>
                  <span>{code}</span>
                </div>
              ))}
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyAllCodes}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCodes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodes ? 'Copied' : 'Copy All'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCodes}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download (.txt)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintCodes}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Regenerate Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Need new recovery codes?</h4>
                <p className="text-[11px] text-slate-500">Generating new codes will immediately invalidate all existing ones.</p>
              </div>

              {!confirmRegenerate ? (
                <button
                  type="button"
                  onClick={() => setConfirmRegenerate(true)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Regenerate
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmRegenerate(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateCodes}
                    disabled={isRegenerating}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isRegenerating && <RefreshCw className="w-3 h-3 animate-spin" />}
                    <span>Confirm & Replace</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
