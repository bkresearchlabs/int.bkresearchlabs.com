import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { SiteSettings } from '../../types';
import { useTranslation } from '../../lib/i18n';

interface AgeGateProps {
  isOpen?: boolean;
  settings?: SiteSettings;
  onVerify: () => void;
  minAge?: number;
}

export const AgeGate: React.FC<AgeGateProps> = ({ isOpen = true, settings, onVerify, minAge: propMinAge }) => {
  const { t } = useTranslation();
  const [under21Blocked, setUnder21Blocked] = useState(false);

  if (!isOpen) return null;

  const minAge = settings?.age_gate_min_age ?? propMinAge ?? 21;
  const title = settings?.age_gate_title || t('age_gate.title');
  const message = settings?.age_gate_message || t('age_gate.message');

  if (under21Blocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white font-serif">{t('age_gate.restricted_title')}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('age_gate.restricted_desc', { age: minAge })}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setUnder21Blocked(false)}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {t('age_gate.back_btn')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="max-w-lg w-full bg-[#0a0f0e] border border-white/10 rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-[#050807] p-8 border-b border-white/10 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-sm bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
              {t('age_gate.badge')}
            </span>
          </div>
          <h2 className="text-2xl font-sans font-light text-white mb-2">
            {title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-8 space-y-6 bg-[#0a0f0e]">
          <div className="bg-amber-950/30 border border-amber-900/50 rounded-sm p-4 flex gap-3 text-amber-200 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {t('age_gate.verify_notice', { age: minAge })}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onVerify}
              className="flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-widest font-bold rounded-none shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>{t('age_gate.confirm_over', { age: minAge })}</span>
            </button>

            <button
              onClick={() => setUnder21Blocked(true)}
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs uppercase tracking-wider font-bold rounded-none transition-colors cursor-pointer"
            >
              {t('age_gate.confirm_under', { age: minAge })}
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-500 font-mono">
            {t('age_gate.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};
