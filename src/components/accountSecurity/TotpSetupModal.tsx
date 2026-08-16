import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  Copy, 
  Check, 
  QrCode, 
  Key, 
  Download, 
  Printer, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle,
  RefreshCw,
  Lock
} from 'lucide-react';
import { securityApi } from '../../lib/securityApi';
import { UserAccountSecurity } from '../../types/security';

interface TotpSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userSec: UserAccountSecurity;
  onTotpActivated: (updatedSec: UserAccountSecurity) => void;
}

export const TotpSetupModal: React.FC<TotpSetupModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userSec,
  onTotpActivated
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [secret, setSecret] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  
  // Step 2 verification
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Step 3 recovery codes
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [confirmedSavedCodes, setConfirmedSavedCodes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setVerifyCode('');
      setVerifyError(null);
      setConfirmedSavedCodes(false);
      
      const newSecret = securityApi.generateBase32Secret(16);
      setSecret(newSecret);
      const uri = securityApi.buildTotpUri(userEmail || 'user@bkresearchlabs.com', newSecret);
      
      securityApi.generateTotpQrCodeDataUrl(uri).then(dataUrl => {
        setQrCodeDataUrl(dataUrl);
      });

      const codes = securityApi.generateBackupRecoveryCodes(8);
      setRecoveryCodes(codes);
    }
  }, [isOpen, userEmail]);

  if (!isOpen) return null;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const result = securityApi.verifyTotpToken(verifyCode, secret);
      if (result.valid) {
        setStep(3);
      } else {
        setVerifyError(result.reason || 'Invalid 6-digit authentication token. Please check your app.');
      }
    }, 400);
  };

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDownloadCodes = () => {
    const content = `BK RESEARCH LABS - MULTI-FACTOR AUTHENTICATION BACKUP CODES
Account: ${userEmail}
Generated: ${new Date().toUTCString()}
Keep these one-time emergency codes in a safe place (password manager or physical vault).
Each code can only be used once if you lose access to your primary authenticator app.

${recoveryCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')}
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
              ${recoveryCodes.map(c => `<div class="code">${c}</div>`).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleCompleteSetup = () => {
    const updatedSec: UserAccountSecurity = {
      ...userSec,
      totp_enabled: true,
      totp_secret: secret,
      totp_created_at: new Date().toISOString(),
      backup_codes: recoveryCodes,
      backup_codes_remaining: recoveryCodes.length,
      last_security_audit_at: new Date().toISOString()
    };
    securityApi.saveUserAccountSecurity(updatedSec);
    onTotpActivated(updatedSec);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#002b29] text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Security Provisioning</div>
              <h2 className="text-lg font-serif font-bold">Configure Authenticator App (TOTP)</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-emerald-800/60 text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-emerald-300' : 'text-emerald-800'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-emerald-400 text-slate-950' : step > 1 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-950 text-emerald-700'}`}>1</span>
              <span>Scan QR</span>
            </div>
            <div className="w-6 h-0.5 bg-emerald-800/60" />
            <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-emerald-300' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-emerald-400 text-slate-950' : step > 2 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-950 text-slate-500'}`}>2</span>
              <span>Verify Code</span>
            </div>
            <div className="w-6 h-0.5 bg-emerald-800/60" />
            <div className={`flex items-center gap-1.5 font-bold ${step === 3 ? 'text-emerald-300' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-950 text-slate-500'}`}>3</span>
              <span>Emergency Codes</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: SCAN QR CODE & SECRET */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Step 1: Scan with your Authenticator app</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Open your preferred TOTP app (Google Authenticator, Microsoft Authenticator, Apple Passwords, 1Password, or Authy) and scan this QR code.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="TOTP Setup QR Code"
                      className="w-44 h-44 rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 w-full">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Can&apos;t scan the QR code? Enter this manual setup key into your authenticator app:
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-300 flex items-center justify-between gap-2">
                    <div className="font-mono text-xs font-bold text-slate-900 tracking-wider select-all overflow-hidden text-ellipsis">
                      {showSecret ? secret : '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                        title={showSecret ? 'Hide secret' : 'Reveal secret'}
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleCopySecret}
                        className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSecret ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span className="text-[11px]">{copiedSecret ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-emerald-800">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Standard RFC 6238 TOTP Specs:</span>
                    </div>
                    <div className="text-slate-600">
                      Algorithm: <span className="font-mono font-bold">SHA-1</span> | Digits: <span className="font-mono font-bold">6</span> | Refresh: <span className="font-mono font-bold">30s</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Next: Enter 6-Digit Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VERIFY 6-DIGIT CODE */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Step 2: Verify Authenticator Code</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 6-digit verification code generated by your authenticator app to confirm proper synchronization.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>

                <div className="w-full max-w-xs text-center space-y-2">
                  <label className="block text-xs font-bold text-slate-700">6-Digit Verification Token</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={6}
                    placeholder="000000"
                    value={verifyCode}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setVerifyCode(val);
                      if (verifyError) setVerifyError(null);
                    }}
                    className="w-full text-center font-mono text-3xl font-bold tracking-[0.4em] py-3 px-4 bg-white border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-emerald-600 shadow-inner"
                  />
                  <p className="text-[10px] text-slate-400">Tokens refresh every 30 seconds</p>
                </div>

                {verifyError && (
                  <div className="w-full max-w-xs p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{verifyError}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  ← Back to QR Code
                </button>

                <button
                  type="submit"
                  disabled={verifyCode.length !== 6 || isVerifying}
                  className={`px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                    verifyCode.length === 6 && !isVerifying
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isVerifying && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>Verify & Proceed</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: EMERGENCY RECOVERY CODES */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <div className="font-bold">Save your emergency recovery codes!</div>
                  <p>
                    If you lose access to your authenticator device, these one-time codes are the only way to regain access to your account. Each code can be used exactly once.
                  </p>
                </div>
              </div>

              {/* Codes Grid */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-400">8 Emergency Backup Codes</span>
                  <span>10-character tokens</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 font-mono text-sm font-bold tracking-wider">
                  {recoveryCodes.map((code, idx) => (
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
                    <span>{copiedCodes ? 'Codes Copied!' : 'Copy All'}</span>
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

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedSavedCodes}
                  onChange={e => setConfirmedSavedCodes(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">
                  I have safely saved or printed these 8 recovery codes in a secure password manager or physical location.
                </span>
              </label>

              <div className="flex justify-end items-center pt-2">
                <button
                  type="button"
                  disabled={!confirmedSavedCodes}
                  onClick={handleCompleteSetup}
                  className={`px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                    confirmedSavedCodes
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Activate 2FA & Finish Setup</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
