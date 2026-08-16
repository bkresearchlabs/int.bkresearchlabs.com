import React, { useState } from 'react';
import {
  Palette, RotateCcw, Sliders, Check, ChevronUp, ChevronDown, Sparkles,
  Monitor, AppWindow, Laptop, Terminal, Tv, Grid, PanelLeft, Command, Layers, LayoutList, X,
  Gamepad2, Gamepad, Zap, Disc, Flame
} from 'lucide-react';
import { NavLayoutOption } from '../../types';
import { DashboardThemeId, DASHBOARD_THEMES } from '../../lib/dashboardTheme';

interface DiscreteThemeSwitcherWidgetProps {
  currentLayout: NavLayoutOption;
  currentTheme: DashboardThemeId;
  onSelectTheme?: (themeId: DashboardThemeId) => void;
  onSelectLayout?: (layout: NavLayoutOption) => void;
  onResetDefaultScreen: () => void;
  onOpenThemeCustomizer: () => void;
  position?: 'bottom-right' | 'top-right' | 'bottom-left';
}

export const DiscreteThemeSwitcherWidget: React.FC<DiscreteThemeSwitcherWidgetProps> = ({
  currentLayout,
  currentTheme,
  onSelectTheme,
  onSelectLayout,
  onResetDefaultScreen,
  onOpenThemeCustomizer,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeThemeObj = DASHBOARD_THEMES.find(t => t.id === currentTheme) || DASHBOARD_THEMES[0];

  const positionClasses = position === 'top-right'
    ? 'top-4 right-4'
    : position === 'bottom-left'
    ? 'bottom-5 left-5'
    : 'bottom-5 right-5';

  const handleReset = () => {
    onResetDefaultScreen();
    setIsOpen(false);
    setToastMsg('Restored Default Screen & Theme (Floating Glass Pill + Emerald Dark)');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleQuickTheme = (themeId: DashboardThemeId) => {
    if (onSelectTheme) {
      onSelectTheme(themeId);
      setToastMsg(`Switched theme to ${DASHBOARD_THEMES.find(t => t.id === themeId)?.name}`);
      setTimeout(() => setToastMsg(null), 2500);
    } else {
      onOpenThemeCustomizer();
    }
  };

  const handleQuickLayout = (layout: NavLayoutOption) => {
    if (onSelectLayout) {
      onSelectLayout(layout);
      setToastMsg(`Switched layout to ${layout.toUpperCase()}`);
      setTimeout(() => setToastMsg(null), 2500);
    } else {
      onOpenThemeCustomizer();
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100000] px-4 py-2.5 bg-emerald-950 text-emerald-200 border border-emerald-500/50 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Discrete Floating Always-On-Top Container */}
      <div className={`fixed ${positionClasses} z-[99999] flex flex-col items-end gap-2`}>
        {/* Expanded Discrete Panel */}
        {isOpen && (
          <div className="w-80 sm:w-96 max-h-[85vh] overflow-y-auto bg-slate-950/95 border border-emerald-500/40 text-slate-100 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-150 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Theme & Layout Controls</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Current: {activeThemeObj.badge} ({currentLayout})
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Action 1: Return to Default Screen */}
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-3.5 bg-gradient-to-r from-emerald-900/80 to-teal-900/80 hover:from-emerald-800 hover:to-teal-800 border border-emerald-400/50 rounded-2xl text-xs font-bold text-emerald-100 flex items-center justify-between transition-all shadow-md group"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400 group-hover:-rotate-90 transition-transform duration-300" />
                <span>Return to Default Screen</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                1-Click
              </span>
            </button>

            {/* Main Action 2: Open Theme Customizer */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenThemeCustomizer();
              }}
              className="w-full py-2 px-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-slate-200 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Open Theme & OS Gallery...</span>
              </div>
              <span className="text-[10px] text-slate-400">10 Layouts</span>
            </button>

            {/* Quick Themes Swatch Row */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Quick Theme Switch ({DASHBOARD_THEMES.length})</span>
                <span className="text-[9px] text-emerald-400 lowercase font-normal">scroll to view all</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {DASHBOARD_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => handleQuickTheme(theme.id)}
                    title={theme.name}
                    className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      currentTheme === theme.id
                        ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-sm'
                        : 'border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${theme.previewAccent} shadow-xs`} />
                    <span className="truncate max-w-[60px]">{theme.badge.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Layout Swatch Row */}
            {onSelectLayout && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Quick OS / Console Switch</span>
                  <span className="text-[9px] text-cyan-400 lowercase font-normal">scroll to view all</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {[
                    { id: 'grid_deck', name: 'Default Deck', icon: Grid },
                    { id: 'playstation_xmb', name: 'PS5 XMB', icon: Gamepad2 },
                    { id: 'xbox_dashboard', name: 'Xbox Series', icon: Gamepad },
                    { id: 'nintendo_switch', name: 'Switch OS', icon: Zap },
                    { id: 'steam_deck', name: 'Steam Deck', icon: Disc },
                    { id: 'arcade_cabinet', name: 'Retro Arcade', icon: Flame },
                    { id: 'windows_11', name: 'Win 11 OS', icon: AppWindow },
                    { id: 'macos_apple', name: 'macOS', icon: Laptop },
                    { id: 'cyberpunk_os', name: 'Cyberpunk', icon: Tv },
                    { id: 'linux_ubuntu', name: 'Ubuntu OS', icon: Terminal },
                    { id: 'sidebar_drawer', name: 'Sidebar', icon: PanelLeft }
                  ].map(l => {
                    const Icon = l.icon;
                    return (
                      <button
                        key={l.id}
                        onClick={() => handleQuickLayout(l.id as NavLayoutOption)}
                        className={`p-1.5 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                          currentLayout === l.id
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                            : 'border-white/10 bg-slate-900/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span className="truncate max-w-[65px]">{l.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collapsed Pill Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group px-3 py-2 bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-white rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Theme & Screen Layout Controls (Click to expand or return to default)"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Palette className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-bold font-mono tracking-tight text-slate-200">
            Theme & Screen
          </span>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>
    </>
  );
};
