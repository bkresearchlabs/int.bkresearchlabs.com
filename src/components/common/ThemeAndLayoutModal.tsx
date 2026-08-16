import React, { useState } from 'react';
import {
  X, Check, SlidersHorizontal, Monitor, Palette, Sparkles, Layout,
  Crown, Shield, CheckCircle2, RefreshCw, Terminal, Layers, Grid,
  PanelLeft, Command, LayoutList, Tv, Laptop, Compass, AppWindow,
  Gamepad2, Gamepad, Zap, Flame, Disc
} from 'lucide-react';
import { NavLayoutOption } from '../../types';
import { DashboardThemeId, DASHBOARD_THEMES, DashboardThemeConfig } from '../../lib/dashboardTheme';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';

interface ThemeAndLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLayout: NavLayoutOption;
  currentTheme: DashboardThemeId;
  onSavePreferences: (layout: NavLayoutOption, theme: DashboardThemeId) => void;
  userRole?: string;
  userName?: string;
}

export const LAYOUT_OPTIONS_LIST: {
  id: NavLayoutOption;
  title: string;
  badge: string;
  category: 'Classic Layouts' | 'OS Desktop Layouts' | 'Gaming Console UIs';
  description: string;
  icon: any;
}[] = [
  {
    id: 'playstation_xmb',
    title: 'PlayStation 5 XMB Horizon',
    badge: 'Console OS',
    category: 'Gaming Console UIs',
    description: 'Horizontal sliding categories with vertical sub-option cards, ambient particle glow, and controller button glyphs (△ ◯ ✕ ⬜).',
    icon: Gamepad2
  },
  {
    id: 'xbox_dashboard',
    title: 'Xbox Series X Blade & Tile',
    badge: 'Console OS',
    category: 'Gaming Console UIs',
    description: 'Dynamic Xbox tile dashboard with hero spotlight, quick pins, system blade tabs, and Xbox button quick menu.',
    icon: Gamepad
  },
  {
    id: 'nintendo_switch',
    title: 'Nintendo Switch Home Ribbon',
    badge: 'Console OS',
    category: 'Gaming Console UIs',
    description: 'Clean horizontal game carousel ribbon with circular user avatars, Joy-Con indicator accents, and quick system icons.',
    icon: Zap
  },
  {
    id: 'steam_deck',
    title: 'Steam Deck OS / Big Picture',
    badge: 'Console OS',
    category: 'Gaming Console UIs',
    description: 'Steam Deck Library portal featuring hero game banners, quick performance stats overlay, and side-drawer navigation.',
    icon: Disc
  },
  {
    id: 'arcade_cabinet',
    title: 'Retro Arcade Neo-Geo Cabinet',
    badge: 'Console OS',
    category: 'Gaming Console UIs',
    description: '80s arcade cabinet marquee with pixel art headers, quarter insert trigger, CRT scanline toggle, and joystick arcade buttons.',
    icon: Flame
  },
  {
    id: 'windows_11',
    title: 'Windows 11 Desktop OS',
    badge: 'OS Layout',
    category: 'OS Desktop Layouts',
    description: 'Centered Taskbar at bottom, Start Menu flyout launcher, glass mica windows, and system tray status clock.',
    icon: AppWindow
  },
  {
    id: 'macos_apple',
    title: 'macOS Apple Glass OS',
    badge: 'OS Layout',
    category: 'OS Desktop Layouts',
    description: 'Top Apple menu bar (), bottom floating dock with bounce animation, and red/yellow/green traffic light window controls.',
    icon: Laptop
  },
  {
    id: 'linux_ubuntu',
    title: 'Linux GNOME Ubuntu OS',
    badge: 'OS Layout',
    category: 'OS Desktop Layouts',
    description: 'Top GNOME status bar, left vertical Yaru orange launcher dock, and terminal command line aesthetics.',
    icon: Terminal
  },
  {
    id: 'cyberpunk_os',
    title: 'Cyberpunk Sci-Fi HUD OS',
    badge: 'OS Layout',
    category: 'OS Desktop Layouts',
    description: 'Futuristic cyan/amber HUD, digital telemetry gauges, tactical corner brackets, and scanning matrix grid.',
    icon: Tv
  },
  {
    id: 'enterprise_workbench',
    title: 'Enterprise Multi-Tab OS',
    badge: 'OS Layout',
    category: 'OS Desktop Layouts',
    description: 'High-density multi-tab action ribbon, collapsible sidebar rail, and quick command breadcrumbs.',
    icon: Monitor
  },
  {
    id: 'grid_deck',
    title: 'Multi-Row Function Deck',
    badge: 'Classic',
    category: 'Classic Layouts',
    description: 'All functions visible in a multi-row grid deck simultaneously for maximum visibility.',
    icon: Grid
  },
  {
    id: 'sidebar_drawer',
    title: 'Scalable Sidebar Drawer',
    badge: 'Classic',
    category: 'Classic Layouts',
    description: 'Structured vertical sidebar rail on the left with search filter and scale toggles.',
    icon: PanelLeft
  },
  {
    id: 'command_hub',
    title: 'Categorized Megamenu Command Hub',
    badge: 'Classic',
    category: 'Classic Layouts',
    description: 'Grouped command category triggers that expand into rich megamenus.',
    icon: Command
  },
  {
    id: 'floating_dock',
    title: 'Floating Glass Pill Dock',
    badge: 'Classic',
    category: 'Classic Layouts',
    description: 'Elevated glass pill dock with rounded icons and glowing active indicators.',
    icon: Layers
  },
  {
    id: 'minimal_strip',
    title: 'Compact Text Strip',
    badge: 'Classic',
    category: 'Classic Layouts',
    description: 'High-density horizontal list with category tags and keyboard shortcuts.',
    icon: LayoutList
  }
];

export const ThemeAndLayoutModal: React.FC<ThemeAndLayoutModalProps> = ({
  isOpen,
  onClose,
  currentLayout,
  currentTheme,
  onSavePreferences,
  userRole = 'user',
  userName = 'User'
}) => {
  const [selectedLayout, setSelectedLayout] = useState<NavLayoutOption>(currentLayout);
  const [selectedTheme, setSelectedTheme] = useState<DashboardThemeId>(currentTheme);
  const [activeCategory, setActiveCategory] = useState<'layouts' | 'themes'>('layouts');
  const [saveToast, setSaveToast] = useState(false);
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: isOpen,
    onClose
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePreferences(selectedLayout, selectedTheme);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1200);
  };

  const activeThemeConfig = DASHBOARD_THEMES.find(t => t.id === selectedTheme) || DASHBOARD_THEMES[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Dashboard Theme & OS Layout Customizer</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {userRole.toUpperCase()} PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalize your dashboard look & layout. Your settings are saved to your account automatically.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (Layouts vs Themes) */}
        <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCategory('layouts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                activeCategory === 'layouts'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>1. Choose Dashboard Layout ({LAYOUT_OPTIONS_LIST.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('themes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                activeCategory === 'themes'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>2. Choose Color Theme ({DASHBOARD_THEMES.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            Selected: <strong className="text-emerald-400">{selectedLayout.toUpperCase()}</strong> + <strong className="text-purple-400">{activeThemeConfig.name}</strong>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950">
          {saveToast ? (
            <div className="py-12 text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Dashboard Preferences Saved!</h4>
              <p className="text-xs text-slate-400">
                Your custom layout ({selectedLayout}) and theme ({activeThemeConfig.name}) are now active and retained for all future logins.
              </p>
            </div>
          ) : activeCategory === 'layouts' ? (
            <div className="space-y-6">
              {/* Gaming Console UIs Group */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-cyan-400" />
                    <span>Modern Gaming Console System UIs</span>
                  </h4>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-500/30">
                    5 Gaming Console Layouts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {LAYOUT_OPTIONS_LIST.filter(l => l.category === 'Gaming Console UIs').map((layout) => {
                    const Icon = layout.icon;
                    const isSelected = selectedLayout === layout.id;

                    return (
                      <button
                        key={layout.id}
                        onClick={() => setSelectedLayout(layout.id)}
                        className={`p-4 rounded-2xl border text-left transition-all space-y-2 flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-400/40'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-800 text-cyan-400'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                              {layout.badge}
                            </span>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-cyan-300">{layout.title}</h5>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{layout.description}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px]">
                          <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                            {isSelected ? '✓ Selected Layout' : 'Click to Select'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* OS Layouts Group */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>Operating System (OS) Desktop Layouts</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                    5 New OS Layouts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {LAYOUT_OPTIONS_LIST.filter(l => l.category === 'OS Desktop Layouts').map((layout) => {
                    const Icon = layout.icon;
                    const isSelected = selectedLayout === layout.id;

                    return (
                      <button
                        key={layout.id}
                        onClick={() => setSelectedLayout(layout.id)}
                        className={`p-4 rounded-2xl border text-left transition-all space-y-2 flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/40'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-emerald-400'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                              {layout.badge}
                            </span>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-emerald-300">{layout.title}</h5>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{layout.description}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px]">
                          <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {isSelected ? '✓ Selected Layout' : 'Click to Select'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Classic Layouts Group */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  <span>Classic Web Navigation Layouts</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {LAYOUT_OPTIONS_LIST.filter(l => l.category === 'Classic Layouts').map((layout) => {
                    const Icon = layout.icon;
                    const isSelected = selectedLayout === layout.id;

                    return (
                      <button
                        key={layout.id}
                        onClick={() => setSelectedLayout(layout.id)}
                        className={`p-4 rounded-2xl border text-left transition-all space-y-2 flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-purple-950/60 border-purple-400 text-white shadow-lg shadow-purple-500/10 ring-2 ring-purple-400/40'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-purple-500 text-white font-black' : 'bg-slate-800 text-purple-400'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${isSelected ? 'bg-purple-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                              {layout.badge}
                            </span>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-purple-300">{layout.title}</h5>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{layout.description}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px]">
                          <span className={isSelected ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                            {isSelected ? '✓ Selected Layout' : 'Click to Select'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Theme Options Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>Choose Theme & Color Palette</span>
                </h4>
                <span className="text-xs text-slate-400">
                  Applies custom glass, border, and accent colors to your active layout.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DASHBOARD_THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.id;

                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-3 relative overflow-hidden group ${
                        isSelected
                          ? 'border-emerald-400 bg-slate-900 ring-2 ring-emerald-400/40 shadow-xl'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Color Preview Swatch */}
                      <div className={`h-12 w-full rounded-xl ${theme.previewBg} p-2 flex items-center justify-between border border-white/10 shadow-inner`}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.accentColor }} />
                          <span className="text-[10px] font-mono font-bold text-white/80 uppercase">{theme.id}</span>
                        </div>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div>
                        <h5 className="text-sm font-bold text-white group-hover:text-emerald-300">{theme.name}</h5>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{theme.description}</p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                        <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {isSelected ? '✓ Active Theme' : 'Apply Theme'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Preferences to My Account</span>
          </button>
        </div>

      </div>
    </div>
  );
};
