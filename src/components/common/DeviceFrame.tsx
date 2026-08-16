import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, Zap, CheckCircle2, Radio, X } from 'lucide-react';
import { DeviceMode } from '../../types';
import { useTranslation } from '../../lib/i18n';

interface DeviceFrameProps {
  deviceMode: DeviceMode;
  onDeviceChange: (mode: DeviceMode) => void;
  children: React.ReactNode;
  userRole?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ deviceMode, onDeviceChange, children, userRole }) => {
  const { t } = useTranslation();
  const [otaToast, setOtaToast] = useState<{ title: string; version: string } | null>(null);
  const [showDiagModal, setShowDiagModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('9:41');

  const isStaff = userRole === 'owner' || userRole === 'admin' || userRole === 'employee';

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Listen for OTA live events
    const handleOtaEvent = (e: any) => {
      const detail = e.detail;
      if (detail && detail.release) {
        setOtaToast({
          title: detail.release.title || 'Live Design & Feature Patch',
          version: detail.version || 'v4.4.0'
        });

        setTimeout(() => {
          setOtaToast(null);
        }, 4500);
      }
    };

    window.addEventListener('bkrl_ota_event', handleOtaEvent);
    return () => {
      window.removeEventListener('bkrl_ota_event', handleOtaEvent);
    };
  }, []);

  if (deviceMode === 'web') {
    return <div className="min-h-screen bg-white text-slate-900">{children}</div>;
  }

  const isIos = deviceMode === 'ios';

  return (
    <div className="min-h-screen bg-slate-900 py-6 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center font-sans">
      {/* Device Mode Floating Switcher Toolbar */}
      <div className="mb-6 bg-slate-800/90 border border-slate-700 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs text-slate-300">
        <span className="font-semibold text-slate-400 mr-1">{t('View Mode:')}</span>
        <button
          onClick={() => onDeviceChange('web')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            deviceMode === 'web' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:bg-slate-700'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{t('Web Desktop')}</span>
        </button>
        <button
          onClick={() => onDeviceChange('ios')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            deviceMode === 'ios' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:bg-slate-700'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{t('iOS App')}</span>
        </button>
        <button
          onClick={() => onDeviceChange('android')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            deviceMode === 'android' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:bg-slate-700'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{t('Android App')}</span>
        </button>

        {/* Live OTA Status indicator in Toolbar (Staff Only) */}
        {isStaff && (
          <button
            onClick={() => setShowDiagModal(true)}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold flex items-center gap-1 hover:bg-emerald-500/30 transition-all cursor-pointer"
            title={t('Fleet Diagnostics')}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{t('OTA Synced')}</span>
          </button>
        )}
      </div>

      {/* Mobile Device Frame Chassis */}
      <div
        className={`w-full max-w-[420px] bg-white rounded-[48px] shadow-2xl border-[10px] ${
          isIos ? 'border-slate-800' : 'border-slate-800'
        } overflow-hidden relative flex flex-col h-[860px] transform transition-all duration-300`}
      >
        {/* Status Bar */}
        <div className="bg-[#002b29] text-white px-6 pt-3 pb-1.5 flex items-center justify-between text-[11px] font-semibold tracking-tight select-none shrink-0 z-30 relative">
          <span>{currentTime}</span>

          {/* iOS Dynamic Island / Notch */}
          {isIos ? (
            <div className={`transition-all duration-300 mx-auto ${otaToast ? 'w-48 bg-slate-950 border border-emerald-400 px-2 py-0.5 rounded-full flex items-center justify-center gap-1.5' : 'w-24 h-4 bg-black rounded-full'}`}>
              {otaToast ? (
                <span className="text-[9px] text-emerald-300 font-mono font-bold flex items-center gap-1 animate-pulse">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  {t('Live Patch:')} {otaToast.version}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="w-3 h-3 bg-slate-900 rounded-full mx-auto" />
          )}

          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Live In-App OTA Banner Toast on Mobile Screen */}
        {otaToast && (
          <div className="absolute top-12 left-4 right-4 z-50 bg-slate-950/95 border border-emerald-400 text-white p-3 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-emerald-300 font-mono flex items-center gap-1.5">
                    <span>⚡ {t('Over-The-Air Update Synced')}</span>
                    <span className="text-[9px] bg-emerald-500/30 px-1 rounded">{otaToast.version}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 line-clamp-1">{t(otaToast.title)}</p>
                </div>
              </div>
              <button
                onClick={() => setOtaToast(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Device Content Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white text-slate-900 scrollbar-none">
          {children}
        </div>

        {/* Bottom Hardware Navigation Bar */}
        {isIos ? (
          <div className="bg-white py-2 flex justify-center shrink-0 border-t border-slate-100 z-30">
            <div className="w-32 h-1 bg-slate-800 rounded-full" />
          </div>
        ) : (
          <div className="bg-slate-900 py-2.5 px-8 flex justify-between items-center text-slate-400 shrink-0 z-30">
            <button className="text-xs hover:text-white">◀</button>
            <button className="w-3 h-3 border-2 border-slate-400 rounded-full hover:border-white" />
            <button className="w-3.5 h-3.5 border-2 border-slate-400 rounded-sm hover:border-white" />
          </div>
        )}
      </div>

      {/* Device Diagnostics Modal */}
      {showDiagModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold">{t('Connected Client Telemetry')}</h3>
              </div>
              <button
                onClick={() => setShowDiagModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-slate-950 p-3.5 rounded-2xl border border-white/5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>{t('Platform:')}</span>
                <span className="text-emerald-300 font-bold">{isIos ? t('Apple iOS Mobile App') : t('Google Android Mobile App')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('OTA Bus Channel:')}</span>
                <span className="text-slate-200">bkrl_realtime_fleet_channel</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('Latency:')}</span>
                <span className="text-sky-300">~12ms</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('Auto-Update Policy:')}</span>
                <span className="text-emerald-400 font-bold">{t('Active & Hot-Patching')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('Connection Status:')}</span>
                <span className="text-emerald-400 font-bold">● {t('Connected & Online')}</span>
              </div>
            </div>

            <button
              onClick={() => setShowDiagModal(false)}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              {t('Close Diagnostics')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
