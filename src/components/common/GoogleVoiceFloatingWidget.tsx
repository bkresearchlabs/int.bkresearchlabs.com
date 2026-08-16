import React, { useState } from 'react';
import { Phone, PhoneCall, MessageSquare, Clock, X, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';

interface GoogleVoiceFloatingWidgetProps {
  settings?: SiteSettings;
}

export const GoogleVoiceFloatingWidget: React.FC<GoogleVoiceFloatingWidgetProps> = ({ settings }) => {
  const voiceConfig = settings?.google_services?.voice;

  if (!voiceConfig?.enabled || !voiceConfig?.click_to_call_storefront_widget) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsText, setSmsText] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const phoneNumber = voiceConfig.phone_number || '+1 (800) 555-BKRL';
  const rawPhone = phoneNumber.replace(/[^0-9+]/g, '');

  const handleSendQuickSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsText.trim() || !customerPhone.trim()) return;
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
      setSmsText('');
      setCustomerPhone('');
      setIsOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Dialog Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-5 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">BKRL Google Voice Hotline</h4>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Laboratory Support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Direct Call Button */}
            <a
              href={`tel:${rawPhone}`}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <PhoneCall className="w-4 h-4" /> Call Now: {phoneNumber}
            </a>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-emerald-400" /> Operating Hours:
                </span>
                <span className="font-bold text-slate-200">
                  {voiceConfig.business_hours.start} – {voiceConfig.business_hours.end} ({voiceConfig.business_hours.timezone.split('/')[1] || 'ET'})
                </span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                Voicemails automatically transcribed and dispatched to analytical staff.
              </p>
            </div>

            {/* Quick SMS Box */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-cyan-400" />
                Send Instant SMS to Lab Specialists
              </span>

              {smsSent ? (
                <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-emerald-200">Inquiry Dispatched!</p>
                  <p className="text-[10px] text-emerald-300/80">A technician will SMS you back shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSendQuickSMS} className="space-y-2">
                  <input
                    type="tel"
                    required
                    placeholder="Your Mobile Phone Number..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <textarea
                    rows={2}
                    required
                    placeholder="Ask about purity certificates, lot verification, or orders..."
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Send Text Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full shadow-2xl shadow-emerald-950/70 border border-emerald-400/40 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Google Voice Support"
      >
        <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
      </button>
    </div>
  );
};
