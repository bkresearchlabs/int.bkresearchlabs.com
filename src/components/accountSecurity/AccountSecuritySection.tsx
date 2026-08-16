import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Fingerprint, 
  Laptop, 
  Tablet, 
  Globe, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Lock, 
  Unlock, 
  LogOut, 
  Sliders, 
  Bell, 
  Radio, 
  ShieldAlert, 
  Copy, 
  Zap, 
  Eye, 
  Usb, 
  Cpu, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  UserAccountSecurity, 
  RegisteredHardwareKey, 
  UserActiveSessionDevice,
  HardwareKeyDeviceType,
  HardwareKeyTransport
} from '../../types/security';
import { UserProfile } from '../../types';
import { securityApi } from '../../lib/securityApi';
import { TotpSetupModal } from './TotpSetupModal';
import { HardwareKeyEnrollModal } from './HardwareKeyEnrollModal';
import { HardwareKeyTestModal } from './HardwareKeyTestModal';
import { BackupCodesModal } from './BackupCodesModal';

interface AccountSecuritySectionProps {
  user?: UserProfile | null;
  userEmail?: string;
  userRole?: string;
  onSecurityUpdated?: (sec: UserAccountSecurity) => void;
  className?: string;
}

export const AccountSecuritySection: React.FC<AccountSecuritySectionProps> = ({
  user,
  userEmail = 'admin@bkresearchlabs.com',
  userRole = 'admin',
  onSecurityUpdated,
  className = ''
}) => {
  const effectiveEmail = user?.email || userEmail;
  const effectiveId = user?.id || user?.auth_user_id || effectiveEmail;
  const effectiveRole = user?.role || userRole;

  const [userSec, setUserSec] = useState<UserAccountSecurity>(() => {
    return securityApi.getUserAccountSecurity(effectiveId, effectiveEmail, effectiveRole);
  });

  const [activeTab, setActiveTab] = useState<'totp' | 'hardware_keys' | 'sessions' | 'preferences'>('totp');
  
  // Modals state
  const [isTotpModalOpen, setIsTotpModalOpen] = useState(false);
  const [isEnrollKeyModalOpen, setIsEnrollKeyModalOpen] = useState(false);
  const [testingKey, setTestingKey] = useState<RegisteredHardwareKey | null>(null);
  const [isBackupCodesModalOpen, setIsBackupCodesModalOpen] = useState(false);

  // Key inline edit state
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [editingKeyName, setEditingKeyName] = useState('');

  // Key remove confirm
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  // Disable TOTP confirm
  const [isDisablingTotp, setIsDisablingTotp] = useState(false);
  const [disableTotpConfirm, setDisableTotpConfirm] = useState(false);

  // Live test token simulator
  const [testTokenInput, setTestTokenInput] = useState('');
  const [testTokenResult, setTestTokenResult] = useState<{ checked: boolean; valid: boolean } | null>(null);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preferences save feedback
  const [prefSaved, setPrefSaved] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const loaded = securityApi.getUserAccountSecurity(effectiveId, effectiveEmail, effectiveRole);
    setUserSec(loaded);
  }, [effectiveId, effectiveEmail, effectiveRole]);

  const refreshState = (updated: UserAccountSecurity) => {
    setUserSec(updated);
    if (onSecurityUpdated) {
      onSecurityUpdated(updated);
    }
  };

  // --- ACTIONS ---

  const handleDisableTotp = () => {
    setIsDisablingTotp(true);
    setTimeout(() => {
      const updated: UserAccountSecurity = {
        ...userSec,
        totp_enabled: false,
        totp_created_at: undefined,
        last_security_audit_at: new Date().toISOString()
      };
      securityApi.saveUserAccountSecurity(updated);
      refreshState(updated);
      setIsDisablingTotp(false);
      setDisableTotpConfirm(false);
      showToast('Two-factor authentication (TOTP) has been disabled.');
    }, 400);
  };

  const handleTestToken = (e: React.FormEvent) => {
    e.preventDefault();
    const res = securityApi.verifyTotpToken(testTokenInput, userSec.totp_secret);
    setTestTokenResult({ checked: true, valid: res.valid });
  };

  const handleStartRenameKey = (key: RegisteredHardwareKey) => {
    setEditingKeyId(key.id);
    setEditingKeyName(key.name);
  };

  const handleSaveRenameKey = async (keyId: string) => {
    if (!editingKeyName.trim()) return;
    const updated = await securityApi.renameHardwareKey(userSec, keyId, editingKeyName);
    refreshState(updated);
    setEditingKeyId(null);
    showToast('Hardware key renamed successfully.');
  };

  const handleRemoveKey = async (keyId: string) => {
    const updated = await securityApi.removeHardwareKey(userSec, keyId);
    refreshState(updated);
    setDeletingKeyId(null);
    showToast('Hardware security key revoked and removed.');
  };

  const handleRevokeSession = async (deviceId: string) => {
    const updated = await securityApi.revokeDeviceSession(userSec, deviceId);
    refreshState(updated);
    showToast('Device session terminated and logged out.');
  };

  const handleRevokeAllOtherSessions = async () => {
    const updated = await securityApi.revokeAllOtherSessions(userSec);
    refreshState(updated);
    showToast('Signed out of all other remote active sessions.');
  };

  const handleSavePreferences = () => {
    securityApi.saveUserAccountSecurity(userSec);
    refreshState(userSec);
    setPrefSaved(true);
    showToast('Account security preferences updated successfully.');
    setTimeout(() => setPrefSaved(false), 2500);
  };

  const getDeviceIcon = (deviceType: HardwareKeyDeviceType) => {
    switch (deviceType) {
      case 'touch_id':
      case 'face_id':
        return Fingerprint;
      case 'windows_hello':
        return Cpu;
      case 'yubikey_5_nfc':
      case 'yubikey_5_ci':
      case 'google_titan':
      case 'feitian_epass':
      default:
        return Key;
    }
  };

  const getSessionIcon = (icon: string) => {
    switch (icon) {
      case 'smartphone':
        return Smartphone;
      case 'tablet':
        return Tablet;
      case 'laptop':
      default:
        return Laptop;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-slate-900 text-white rounded-2xl border border-emerald-500 shadow-xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP OVERVIEW CARD */}
      <div className="bg-gradient-to-r from-[#002b29] via-[#003835] to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Identity & Access Hardening
              </span>
              <span className="text-[10px] font-mono text-slate-400">RFC 6238 • FIDO2 • WebAuthn</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Account Security & MFA Center</h2>
            <p className="text-xs text-emerald-200/80 max-w-xl">
              Protect your laboratory portal account with multi-factor authentication (TOTP), physical FIDO2 hardware keys, and authorized session controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-left">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">MFA Status</div>
              <div className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
                {userSec.totp_enabled ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Active (Protected)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300">Not Enabled</span>
                  </>
                )}
              </div>
            </div>

            <div className="px-4 py-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-left">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Hardware Keys</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {userSec.hardware_keys.length} Registered
              </div>
            </div>

            <div className="px-4 py-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-left">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Active Sessions</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {userSec.active_devices.length} Authorized
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PILLAR NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('totp')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'totp'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Authenticator App (TOTP)</span>
          {userSec.totp_enabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hardware_keys')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'hardware_keys'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Hardware Keys & WebAuthn</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
            {userSec.hardware_keys.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Active Devices & Sessions</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
            {userSec.active_devices.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Login & Alert Policies</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. AUTHENTICATOR APP (TOTP) TAB */}
      {/* ===================================================================== */}
      {activeTab === 'totp' && (
        <div className="space-y-6">
          
          {/* Main Status & Configuration Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl ${userSec.totp_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-slate-900 text-lg">Time-based One-Time Password (TOTP)</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      userSec.totp_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {userSec.totp_enabled ? 'Active & Enforced' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Generate secure 6-digit authentication codes using Google Authenticator, Microsoft Authenticator, 1Password, or Apple Passwords.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {!userSec.totp_enabled ? (
                  <button
                    type="button"
                    onClick={() => setIsTotpModalOpen(true)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Set Up Authenticator App</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsTotpModalOpen(true)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reconfigure</span>
                    </button>

                    {!disableTotpConfirm ? (
                      <button
                        type="button"
                        onClick={() => setDisableTotpConfirm(true)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Disable</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-red-50 p-1.5 rounded-xl border border-red-200">
                        <span className="text-[11px] text-red-700 font-bold px-2">Are you sure?</span>
                        <button
                          type="button"
                          onClick={() => setDisableTotpConfirm(false)}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleDisableTotp}
                          disabled={isDisablingTotp}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          {isDisablingTotp && <RefreshCw className="w-3 h-3 animate-spin" />}
                          <span>Confirm</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* TOTP Telemetry Grid if Enabled */}
            {userSec.totp_enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Algorithm</div>
                  <div className="text-sm font-mono font-bold text-slate-900">{userSec.totp_algorithm}</div>
                  <div className="text-[10px] text-slate-500">HMAC-SHA-1 RFC 6238</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Token Length</div>
                  <div className="text-sm font-mono font-bold text-slate-900">{userSec.totp_digits} Digits</div>
                  <div className="text-[10px] text-slate-500">Numeric 0-9 Token</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time Window</div>
                  <div className="text-sm font-mono font-bold text-slate-900">{userSec.totp_period_seconds} Seconds</div>
                  <div className="text-[10px] text-slate-500">±1 Drift Tolerance</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Activated On</div>
                  <div className="text-sm font-bold text-slate-900">
                    {userSec.totp_created_at ? new Date(userSec.totp_created_at).toLocaleDateString() : 'Active'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">✓ Cryptographically Verified</div>
                </div>
              </div>
            )}

            {/* Emergency Recovery Codes Vault Banner */}
            {userSec.totp_enabled && (
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Emergency Backup Recovery Codes</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      You have <span className="text-amber-300 font-bold">{userSec.backup_codes_remaining || userSec.backup_codes.length} remaining</span> single-use recovery codes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBackupCodesModalOpen(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Recovery Codes</span>
                </button>
              </div>
            )}
          </div>

          {/* Real-Time Authenticator Code Test Simulator */}
          {userSec.totp_enabled && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-base">Test Authenticator Sync</h4>
                  <p className="text-xs text-slate-500">Test if your phone’s authenticator clock is properly synchronized with the server.</p>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-mono font-bold">
                  Time-Step: 30s
                </div>
              </div>

              <form onSubmit={handleTestToken} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={testTokenInput}
                  onChange={e => {
                    setTestTokenInput(e.target.value.replace(/\D/g, ''));
                    setTestTokenResult(null);
                  }}
                  className="w-full sm:w-64 font-mono font-bold text-center tracking-widest text-base py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  disabled={testTokenInput.length !== 6}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    testTokenInput.length === 6
                      ? 'bg-[#002b29] hover:bg-[#003d3a] text-white shadow-sm'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Validate Code</span>
                </button>
              </form>

              {testTokenResult && (
                <div className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  testTokenResult.valid
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {testTokenResult.valid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>✓ Synchronized! The authentication code is valid and recognized.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Invalid token. Please ensure your device clock is set to automatic network time.</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. HARDWARE KEYS & WEBAUTHN TAB */}
      {/* ===================================================================== */}
      {activeTab === 'hardware_keys' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Registered Hardware Security Keys</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    FIDO2 / WebAuthn Level 3
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Manage physical USB/NFC security keys (YubiKey, Titan) and device biometrics (Touch ID, Windows Hello).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEnrollKeyModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Security Key</span>
              </button>
            </div>

            {/* Keys List */}
            {userSec.hardware_keys.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-2xl mx-auto flex items-center justify-center">
                  <Key className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">No hardware keys enrolled yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add a physical YubiKey or Touch ID biometric authenticator for seamless, phishing-resistant security.
                </p>
                <button
                  type="button"
                  onClick={() => setIsEnrollKeyModalOpen(true)}
                  className="px-4 py-2 bg-[#002b29] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Add Your First Key
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userSec.hardware_keys.map(hkey => {
                  const DeviceIcon = getDeviceIcon(hkey.device_type);
                  const isEditing = editingKeyId === hkey.id;
                  const isDeleting = deletingKeyId === hkey.id;

                  return (
                    <div
                      key={hkey.id}
                      className="p-4 sm:p-5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="p-3 bg-white text-emerald-800 rounded-2xl border border-slate-200 shadow-xs shrink-0">
                          <DeviceIcon className="w-6 h-6" />
                        </div>

                        <div className="space-y-1">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingKeyName}
                                onChange={e => setEditingKeyName(e.target.value)}
                                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveRenameKey(hkey.id)}
                                className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingKeyId(null)}
                                className="p-1.5 text-slate-500 hover:text-slate-700 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm">{hkey.name}</h4>
                              <button
                                type="button"
                                onClick={() => handleStartRenameKey(hkey)}
                                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                title="Rename key"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                                {hkey.transport}
                              </span>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                            <span className="font-mono text-slate-600 font-bold">{hkey.public_key_algo}</span>
                            <span>Added: {new Date(hkey.created_at).toLocaleDateString()}</span>
                            <span>Last used: {new Date(hkey.last_authenticated_at).toLocaleDateString()}</span>
                            <span>Uses: <span className="font-mono font-bold text-slate-700">{hkey.usage_count}</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Key Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => setTestingKey(hkey)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
                        >
                          <Zap className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Test Assertion</span>
                        </button>

                        {!isDeleting ? (
                          <button
                            type="button"
                            onClick={() => setDeletingKeyId(hkey.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Remove key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
                            <span className="text-[10px] font-bold text-red-700 px-1.5">Revoke?</span>
                            <button
                              type="button"
                              onClick={() => setDeletingKeyId(null)}
                              className="px-2 py-0.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                            >
                              No
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveKey(hkey.id)}
                              className="px-2.5 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                            >
                              Yes, Revoke
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. ACTIVE SESSIONS & RECOGNIZED DEVICES TAB */}
      {/* ===================================================================== */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-lg">Active Recognized Devices & Sessions</h3>
                <p className="text-xs text-slate-500">
                  These browsers and devices are currently authenticated and logged into your account.
                </p>
              </div>

              {userSec.active_devices.filter(d => !d.is_current_session).length > 0 && (
                <button
                  type="button"
                  onClick={handleRevokeAllOtherSessions}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-red-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of All Other Devices</span>
                </button>
              )}
            </div>

            {/* Session Devices List */}
            <div className="space-y-3">
              {userSec.active_devices.map(device => {
                const Icon = getSessionIcon(device.device_icon);

                return (
                  <div
                    key={device.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      device.is_current_session
                        ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className={`p-3 rounded-2xl border shadow-xs shrink-0 ${
                        device.is_current_session ? 'bg-emerald-700 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{device.device_name}</h4>
                          {device.is_current_session && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>Current Session</span>
                            </span>
                          )}
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {device.browser}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{device.location}</span>
                          </span>
                          <span className="font-mono text-slate-600">IP: {device.ip_address}</span>
                          <span>OS: {device.os}</span>
                          <span>Auth: <span className="font-bold text-slate-700 uppercase">{device.sign_in_method}</span></span>
                          <span>Last active: {new Date(device.last_active_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    {!device.is_current_session && (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(device.id)}
                        className="px-3 py-1.5 bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 self-end md:self-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke Session</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. LOGIN & ALERT PREFERENCES TAB */}
      {/* ===================================================================== */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Sign-In Enforcement & Security Policies</h3>
                <p className="text-xs text-slate-500">
                  Configure session elevation, step-up authentication, and suspicious activity notifications.
                </p>
              </div>

              {prefSaved && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Saved!</span>
                </div>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {/* Toggle 1: Require MFA Every Login */}
              <label className="p-4 bg-slate-50 hover:bg-slate-100/60 rounded-2xl border border-slate-200 flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Enforce MFA Verification on Every Sign-In</div>
                  <p className="text-slate-500 mt-0.5">
                    Prompt for an authenticator code or hardware key on every single login attempt, ignoring browser cookies.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSec.preferences.require_mfa_every_login}
                  onChange={e => setUserSec({
                    ...userSec,
                    preferences: { ...userSec.preferences, require_mfa_every_login: e.target.checked }
                  })}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5"
                />
              </label>

              {/* Toggle 2: Require Hardware Key for High-Risk Operations */}
              <label className="p-4 bg-slate-50 hover:bg-slate-100/60 rounded-2xl border border-slate-200 flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Step-Up Hardware Key Touch for Sensitive Actions</div>
                  <p className="text-slate-500 mt-0.5">
                    Require physical tap on a FIDO2 key before executing high-risk actions (e.g. database downloads, chemical COA batch sign-off, or payment modifications).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSec.preferences.require_hardware_key_for_sensitive_ops}
                  onChange={e => setUserSec({
                    ...userSec,
                    preferences: { ...userSec.preferences, require_hardware_key_for_sensitive_ops: e.target.checked }
                  })}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5"
                />
              </label>

              {/* Toggle 3: Email Alerts for New Devices */}
              <label className="p-4 bg-slate-50 hover:bg-slate-100/60 rounded-2xl border border-slate-200 flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Email Security Alert on Unrecognized Device Sign-In</div>
                  <p className="text-slate-500 mt-0.5">
                    Dispatch an instant security alert with IP geolocation whenever an unrecognized browser or device accesses your account.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSec.preferences.email_alerts_new_device}
                  onChange={e => setUserSec({
                    ...userSec,
                    preferences: { ...userSec.preferences, email_alerts_new_device: e.target.checked }
                  })}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5"
                />
              </label>

              {/* Toggle 4: Email Alerts for Security Changes */}
              <label className="p-4 bg-slate-50 hover:bg-slate-100/60 rounded-2xl border border-slate-200 flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Email Notification for Key Enrolment or 2FA Changes</div>
                  <p className="text-slate-500 mt-0.5">
                    Send email verification when hardware security keys are added, renamed, or revoked.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSec.preferences.email_alerts_security_changes}
                  onChange={e => setUserSec({
                    ...userSec,
                    preferences: { ...userSec.preferences, email_alerts_security_changes: e.target.checked }
                  })}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5"
                />
              </label>

              {/* Session Inactivity Timeout */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-900 text-sm">Automatic Inactivity Session Timeout</label>
                <p className="text-slate-500">Automatically invalidate active browser session after period of no interaction.</p>
                <select
                  value={userSec.preferences.auto_logout_inactivity_minutes}
                  onChange={e => setUserSec({
                    ...userSec,
                    preferences: { ...userSec.preferences, auto_logout_inactivity_minutes: parseInt(e.target.value) }
                  })}
                  className="w-full sm:w-64 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={60}>1 Hour</option>
                  <option value={240}>4 Hours</option>
                  <option value={1440}>24 Hours</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-6 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Security Preferences</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* MODALS */}
      {/* ===================================================================== */}

      {/* TOTP Setup Wizard Modal */}
      <TotpSetupModal
        isOpen={isTotpModalOpen}
        onClose={() => setIsTotpModalOpen(false)}
        userEmail={effectiveEmail}
        userSec={userSec}
        onTotpActivated={(updated) => {
          refreshState(updated);
          showToast('Authenticator App (TOTP) activated successfully!');
        }}
      />

      {/* Hardware Key Enrollment Modal */}
      <HardwareKeyEnrollModal
        isOpen={isEnrollKeyModalOpen}
        onClose={() => setIsEnrollKeyModalOpen(false)}
        userSec={userSec}
        onKeyEnrolled={(updated, newKey) => {
          refreshState(updated);
          showToast(`Hardware key "${newKey.name}" registered successfully.`);
        }}
      />

      {/* Hardware Key Test Challenge Modal */}
      <HardwareKeyTestModal
        isOpen={!!testingKey}
        onClose={() => setTestingKey(null)}
        hardwareKey={testingKey}
        onTestComplete={(keyId) => {
          const updatedKeys = userSec.hardware_keys.map(k => {
            if (k.id === keyId) {
              return {
                ...k,
                usage_count: k.usage_count + 1,
                last_authenticated_at: new Date().toISOString()
              };
            }
            return k;
          });
          const updated: UserAccountSecurity = { ...userSec, hardware_keys: updatedKeys };
          securityApi.saveUserAccountSecurity(updated);
          refreshState(updated);
        }}
      />

      {/* Backup Recovery Codes Modal */}
      <BackupCodesModal
        isOpen={isBackupCodesModalOpen}
        onClose={() => setIsBackupCodesModalOpen(false)}
        userSec={userSec}
        userEmail={effectiveEmail}
        onCodesRegenerated={(updated) => {
          refreshState(updated);
          showToast('Emergency backup recovery codes refreshed.');
        }}
      />

    </div>
  );
};
