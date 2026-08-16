import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  Cpu, 
  FileCode, 
  Lock 
} from 'lucide-react';
import { RegisteredHardwareKey } from '../../types/security';
import { securityApi } from '../../lib/securityApi';

interface HardwareKeyTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  hardwareKey: RegisteredHardwareKey | null;
  onTestComplete?: (keyId: string) => void;
}

export const HardwareKeyTestModal: React.FC<HardwareKeyTestModalProps> = ({
  isOpen,
  onClose,
  hardwareKey,
  onTestComplete
}) => {
  const [status, setStatus] = useState<'prompt' | 'testing' | 'success' | 'failed'>('prompt');
  const [challengeResult, setChallengeResult] = useState<{
    latencyMs: number;
    signature: string;
    authTimestamp: string;
    counter: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('prompt');
      setChallengeResult(null);
    }
  }, [isOpen, hardwareKey]);

  if (!isOpen || !hardwareKey) return null;

  const handleStartChallenge = async () => {
    setStatus('testing');
    try {
      const res = await securityApi.testHardwareKeyChallenge(hardwareKey.id);
      setChallengeResult(res);
      setStatus('success');
      if (onTestComplete) {
        onTestComplete(hardwareKey.id);
      }
    } catch (e) {
      console.error('Challenge failed:', e);
      setStatus('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#002b29] text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Cryptographic Assertion</div>
              <h2 className="text-lg font-serif font-bold">Test Hardware Key Challenge</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* PROMPT STATE */}
          {status === 'prompt' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{hardwareKey.name}</span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {hardwareKey.public_key_algo}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono break-all">
                  ID: {hardwareKey.credential_id}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <p>
                  This test issues an authenticated challenge nonce to your physical key via WebAuthn CTAP2 protocol and validates the returned ECDSA signature against the stored public key.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartChallenge}
                  className="px-6 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Send Challenge & Touch Key</span>
                </button>
              </div>
            </div>
          )}

          {/* TESTING STATE */}
          {status === 'testing' && (
            <div className="space-y-6 text-center py-6">
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center border-2 border-emerald-400">
                  <Key className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Touch your physical key sensor...</h3>
                <p className="text-xs text-slate-500">Signing cryptographic challenge with asymmetric private key in Secure Enclave...</p>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === 'success' && challengeResult && (
            <div className="space-y-6">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Assertion Verified Successfully</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Signature validated in <span className="font-bold">{challengeResult.latencyMs} ms</span>. Key counter incremented to <span className="font-mono font-bold">#{challengeResult.counter}</span>.
                  </p>
                </div>
              </div>

              {/* Signature Telemetry */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-2 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1.5">
                  <span>Cryptographic Attestation Output</span>
                  <span className="text-emerald-400 font-mono">Status: PASS (200 OK)</span>
                </div>
                <div className="space-y-1.5 pt-1 font-mono text-[11px]">
                  <div className="text-slate-400">
                    Algorithm: <span className="text-slate-200">{hardwareKey.public_key_algo}</span>
                  </div>
                  <div className="text-slate-400">
                    Timestamp: <span className="text-slate-200">{new Date(challengeResult.authTimestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-400">
                    DER Signature:
                    <div className="text-emerald-300 break-all bg-slate-950 p-2 rounded-lg mt-1 text-[10px]">
                      {challengeResult.signature}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleStartChallenge}
                  className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Again</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* FAILED STATE */}
          {status === 'failed' && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl mx-auto flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Key Challenge Verification Failed</h3>
                <p className="text-xs text-slate-500">The hardware response timed out or the key was disconnected.</p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleStartChallenge}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Test</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
