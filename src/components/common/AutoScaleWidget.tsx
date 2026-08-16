import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Sparkles,
  Monitor,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { useAutoScale, AutoScaleMode } from '../../lib/autoScale';
import { useTranslation } from '../../lib/i18n';

interface AutoScaleWidgetProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-right';
}

export const AutoScaleWidget: React.FC<AutoScaleWidgetProps> = ({
  position = 'bottom-left'
}) => {
  const { t } = useTranslation();
  const {
    enabled,
    setEnabled,
    scaleMode,
    setScaleMode,
    scalePercent,
    manualPercent,
    setManualPercent,
    windowSize,
    zoomIn,
    zoomOut,
    resetScale,
  } = useAutoScale();

  const [isOpen, setIsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const presetPercentages = [70, 80, 85, 90, 100, 110, 125];

  const positionClasses = position === 'bottom-left'
    ? 'bottom-5 left-5'
    : position === 'top-right'
    ? 'top-20 right-5'
    : 'bottom-5 right-5';

  return (
    <>
      {/* Toast feedback */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/95 border border-emerald-500/40 text-white px-4 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Auto-Scale Widget Trigger */}
      <div className={`fixed ${positionClasses} z-[9990] select-none`}>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Auto Scale Settings"
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-105"
          >
            <div className="relative flex items-center justify-center">
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
              {enabled && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold tracking-tight">
              <span className="text-slate-400">{enabled ? (scaleMode === 'auto' ? 'Auto' : 'Scale') : 'Scale'}:</span>
              <span className={enabled ? 'text-emerald-400' : 'text-slate-500'}>
                {enabled ? `${scalePercent}%` : 'Off'}
              </span>
            </div>
            <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        ) : (
          /* Auto Scale Menu Popover */
          <div className="w-[320px] bg-slate-900/95 border border-slate-700/90 rounded-3xl p-5 shadow-2xl backdrop-blur-xl text-white space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Global Auto-Scale Engine</h4>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Viewport: {windowSize.width}px × {windowSize.height}px
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Global Master Enable Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div>
                <div className="text-xs font-bold text-slate-200">Auto-Scale to Screen</div>
                <div className="text-[10px] text-slate-400">Scale UI when window is resized</div>
              </div>
              <button
                onClick={() => {
                  setEnabled(!enabled);
                  showToast(!enabled ? 'Auto-Scale Enabled' : 'Auto-Scale Disabled');
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  enabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Scaling Mode Selector */}
            {enabled && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Scaling Strategy
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      setScaleMode('auto');
                      showToast('Mode: Dynamic Percentage Auto-Fit');
                    }}
                    className={`px-2 py-2 rounded-xl text-[11px] font-medium flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      scaleMode === 'auto'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto %</span>
                  </button>

                  <button
                    onClick={() => {
                      setScaleMode('fit-width');
                      showToast('Mode: Fit to Width');
                    }}
                    className={`px-2 py-2 rounded-xl text-[11px] font-medium flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      scaleMode === 'fit-width'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Fit Width</span>
                  </button>

                  <button
                    onClick={() => {
                      setScaleMode('manual');
                      showToast('Mode: Manual Custom %');
                    }}
                    className={`px-2 py-2 rounded-xl text-[11px] font-medium flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      scaleMode === 'manual'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Manual</span>
                  </button>
                </div>
              </div>
            )}

            {/* Preset Percentage Quick Buttons */}
            {enabled && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Quick Presets</span>
                  <span className="font-mono text-emerald-400 font-bold">{scalePercent}%</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {presetPercentages.map((pct) => (
                    <button
                      key={pct}
                      onClick={() => {
                        setScaleMode('manual');
                        setManualPercent(pct);
                        showToast(`Set Scale to ${pct}%`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        scalePercent === pct
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Slider & Stepper */}
            {enabled && (
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Custom Percentage:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <button
                      onClick={zoomOut}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Zoom out 5%"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center font-bold text-emerald-400 bg-slate-800/80 py-0.5 rounded border border-slate-700">
                      {scalePercent}%
                    </span>
                    <button
                      onClick={zoomIn}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Zoom in 5%"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="60"
                  max="140"
                  step="1"
                  value={scalePercent}
                  onChange={(e) => {
                    setScaleMode('manual');
                    setManualPercent(Number(e.target.value));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            )}

            {/* Anti-Overlap & Layout Safety Guarantee Indicator */}
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-2 text-[10px] text-emerald-200 leading-tight">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 font-semibold block">Anti-Overlap Guard: Active</strong>
                <span>Controls & typography preserve minimum tap target ratios and responsive wrapping on all window drags.</span>
              </div>
            </div>

            {/* Footer Reset button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => {
                  resetScale();
                  showToast('Reset Scale to 100% Auto Default');
                }}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
