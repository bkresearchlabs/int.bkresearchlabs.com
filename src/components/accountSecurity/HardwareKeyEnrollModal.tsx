import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Fingerprint, 
  ShieldCheck, 
  Usb, 
  Radio, 
  Cpu, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { 
  HardwareKeyDeviceType, 
  HardwareKeyTransport, 
  UserAccountSecurity, 
  RegisteredHardwareKey 
} from '../../types/security';
import { securityApi } from '../../lib/securityApi';

interface HardwareKeyEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSec: UserAccountSecurity;
  onKeyEnrolled: (updatedSec: UserAccountSecurity, newKey: RegisteredHardwareKey) => void;
}

const DEVICE_PRESETS: {
  type: HardwareKeyDeviceType;
  transport: HardwareKeyTransport;
  name: string;
  badge: string;
  description: string;
  icon: any;
}[] = [
  {
    type: 'yubikey_5_nfc',
    transport: 'usb',
    name: 'YubiKey 5 Series (USB-C / NFC)',
    badge: 'Enterprise Standard',
    description: 'Hardware security token with dual USB & contactless NFC CTAP2.1 support.',
    icon: Usb
  },
  {
    type: 'touch_id',
    transport: 'internal',
    name: 'Touch ID / Apple Secure Enclave',
    badge: 'Biometric Platform',
    description: 'Built-in biometric platform authenticator via Mac Touch ID or iOS Face ID.',
    icon: Fingerprint
  },
  {
    type: 'windows_hello',
    transport: 'internal',
    name: 'Windows Hello (TPM 2.0)',
    badge: 'Platform TPM',
    description: 'Hardware TPM security chip authentication with PIN or Facial Recognition.',
    icon: Cpu
  },
  {
    type: 'google_titan',
    transport: 'usb',
    name: 'Google Titan Security Key',
    badge: 'FIDO2 FIPS-140',
    description: 'Cryptographic hardware key with dedicated security processor.',
    icon: Key
  },
  {
    type: 'generic_fido2',
    transport: 'usb',
    name: 'Generic FIDO2 / WebAuthn Token',
    badge: 'Universal FIDO2',
    description: 'Any compliant FIDO2 / Passkey / U2F compatible hardware key.',
    icon: ShieldCheck
  }
];

export const HardwareKeyEnrollModal: React.FC<HardwareKeyEnrollModalProps> = ({
  isOpen,
  onClose,
  userSec,
  onKeyEnrolled
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPreset, setSelectedPreset] = useState<HardwareKeyDeviceType>('yubikey_5_nfc');
  const [keyName, setKeyName] = useState('Laboratory YubiKey 5C');
  const [transport, setTransport] = useState<HardwareKeyTransport>('usb');
  
  // Registration interactive state
  const [isRegistering, setIsRegistering] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState<string>('Waiting for hardware key activation...');
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<RegisteredHardwareKey | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof DEVICE_PRESETS[0]) => {
    setSelectedPreset(preset.type);
    setTransport(preset.transport);
    setKeyName(preset.name);
  };

  const handleStartRegistration = async () => {
    setStep(2);
    setIsRegistering(true);
    setEnrollError(null);
    setEnrollStatus('Initializing WebAuthn FIDO2 ceremony...');

    try {
      // Check if browser WebAuthn API is available
      if (typeof window !== 'undefined' && window.navigator && window.navigator.credentials) {
        setEnrollStatus('Insert your security key or touch your biometric sensor now...');
      }

      // Simulate the interactive touch / hardware verification ceremony
      await new Promise(r => setTimeout(r, 1400));
      setEnrollStatus('Verifying cryptographic attestation and registering public key...');
      await new Promise(r => setTimeout(r, 800));

      const { updatedSec, newKey } = await securityApi.enrollHardwareKey(userSec, {
        name: keyName,
        device_type: selectedPreset,
        transport: transport
      });

      setNewlyCreatedKey(newKey);
      setIsRegistering(false);
      setStep(3);
      onKeyEnrolled(updatedSec, newKey);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setIsRegistering(false);
      setEnrollError(err?.message || 'Hardware key enrollment timed out or was cancelled by user.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#002b29] text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">FIDO2 / WebAuthn Provisioning</div>
              <h2 className="text-lg font-serif font-bold">Register Hardware Security Key</h2>
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

          {/* STEP 1: SELECT DEVICE TYPE & NICKNAME */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Choose Your Hardware Key or Biometric Authenticator</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hardware keys provide phishing-resistant multi-factor authentication using asymmetric public-key cryptography.
                </p>
              </div>

              {/* Device Selector */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {DEVICE_PRESETS.map(preset => {
                  const Icon = preset.icon;
                  const isSelected = selectedPreset === preset.type;
                  return (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{preset.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{preset.description}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Nickname & Transport */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Key Nickname / Label</label>
                  <input
                    type="text"
                    required
                    value={keyName}
                    onChange={e => setKeyName(e.target.value)}
                    placeholder="e.g. Primary Lab YubiKey 5C NFC"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">A recognizable name to distinguish this device in your security settings.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Transport Interface</label>
                    <select
                      value={transport}
                      onChange={e => setTransport(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-medium"
                    >
                      <option value="usb">USB-A / USB-C</option>
                      <option value="nfc">NFC Contactless</option>
                      <option value="internal">Internal Platform (Touch ID/TPM)</option>
                      <option value="ble">Bluetooth LE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Compliance Standard</label>
                    <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-700">
                      FIDO2 / WebAuthn Level 3
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
                  onClick={handleStartRegistration}
                  className="px-6 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Continue to Key Enrollment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TOUCH / VERIFY HARDWARE CEREMONY */}
          {step === 2 && (
            <div className="space-y-6 text-center py-4">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-700 text-white flex items-center justify-center shadow-lg border-2 border-emerald-400">
                  <Key className="w-10 h-10 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="font-serif font-bold text-slate-900 text-base">Touch Your Security Key Now</h3>
                <p className="text-xs text-slate-600 font-medium">{enrollStatus}</p>
                <p className="text-[11px] text-slate-400">
                  If prompted by your browser, tap the gold disc or sensor on your USB key, or authenticate using your fingerprint/PIN.
                </p>
              </div>

              {enrollError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2 text-left">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{enrollError}</span>
                </div>
              )}

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleStartRegistration}
                  className="px-5 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Ceremony</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ENROLLMENT SUCCESS */}
          {step === 3 && newlyCreatedKey && (
            <div className="space-y-6">
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-emerald-950 text-base">Hardware Key Successfully Registered</h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your key is now cryptographically bound to your account and ready for multi-factor authentication.
                  </p>
                </div>
              </div>

              {/* Key Specs Card */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Credential Summary</span>
                  <span className="text-slate-400 font-mono text-[10px]">{new Date(newlyCreatedKey.created_at).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Device Name</span>
                    <span className="font-bold text-slate-200">{newlyCreatedKey.name}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Algorithm</span>
                    <span className="font-mono text-emerald-300 text-[11px]">{newlyCreatedKey.public_key_algo}</span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Credential ID</span>
                    <span className="font-mono text-slate-300 text-[11px] break-all">{newlyCreatedKey.credential_id}</span>
                  </div>
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
          )}

        </div>
      </div>
    </div>
  );
};
