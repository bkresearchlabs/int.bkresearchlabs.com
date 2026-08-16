import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldAlert, CheckCircle } from 'lucide-react';
import { UserProfile, SiteSettings } from '../../types';
import { api } from '../../lib/supabase';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useTranslation } from '../../lib/i18n';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  settings?: SiteSettings | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, settings }) => {
  const { t } = useTranslation();
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: isOpen,
    onClose
  });

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const googleAuthSettings = settings?.google_auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!email) {
        setError('Please enter a valid email address.');
        return;
      }
      try {
        const newUser = await api.saveUser({
          first_name: firstName || 'Research',
          last_name: lastName || 'Customer',
          email,
          role: 'customer',
          status: 'active'
        });
        api.setCurrentUser(newUser);
        onSuccess(newUser);
        onClose();
      } catch (err) {
        setError('Failed to create account. Please try again.');
      }
    } else {
      if (!email || !password) {
        setError('Please enter both your email/username and password.');
        return;
      }
      const user = await api.signInWithPassword(email, password);
      if (user) {
        onSuccess(user);
        onClose();
      } else {
        setError('Invalid email, username, or password. Please try again.');
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-[#0a0f0e] text-slate-200 rounded-sm shadow-2xl border border-white/10 max-w-md w-full overflow-hidden pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#050807] border-b border-white/10 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-sans font-light text-base">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>{mode === 'signin' ? t('auth.signin_title') : t('auth.register_title')}</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('auth.tab_signin')}
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('auth.tab_register')}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-sm text-xs font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In SSO Block */}
          <div className="space-y-3">
            <GoogleSignInButton
              googleSettings={googleAuthSettings}
              onSuccess={(user) => {
                onSuccess(user);
                onClose();
              }}
              onError={(err) => setError(err)}
              text={mode === 'signin' ? t('auth.google_signin') : t('auth.google_signup')}
            />

            <div className="relative flex items-center justify-center my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-3 bg-[#0a0f0e] text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                {t('auth.or_password')}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('auth.first_name')}</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('auth.last_name')}</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('auth.email_user')}</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. bkresearchlabs@gmail.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-none text-xs uppercase tracking-widest transition-all shadow-md mt-2 cursor-pointer"
            >
              {mode === 'signin' ? t('auth.btn_signin') : t('auth.btn_register')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
