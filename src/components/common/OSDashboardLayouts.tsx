import React, { useState, useEffect } from 'react';
import {
  Monitor, Laptop, Terminal, Tv, AppWindow, Search, Grid,
  Maximize2, Minimize2, X, Wifi, Battery, Volume2, Settings,
  Sliders, Crown, Shield, User, LogOut, ChevronRight, ChevronLeft, Sparkles,
  Command, Palette, Layers, Layout, Clock, Bell, Circle,
  Gamepad2, Gamepad, Zap, Disc, Flame, Trophy, Play, Coins, Cpu, Activity,
  PanelLeft, LayoutList
} from 'lucide-react';
import { NavLayoutOption } from '../../types';
import { DashboardThemeConfig, DashboardThemeId } from '../../lib/dashboardTheme';
import { DiscreteThemeSwitcherWidget } from './DiscreteThemeSwitcherWidget';

export interface DashboardTabItem {
  id: string;
  label: string;
  category?: string;
  icon: any;
  description?: string;
  tags?: string[];
  sensitivity?: 'CRITICAL' | 'HIGH' | 'OPERATIONAL' | 'INTERNAL' | 'PUBLIC' | 'SYSTEM' | string;
  badge?: string;
}

interface OSDashboardLayoutProps {
  layoutOption: NavLayoutOption;
  tabs: DashboardTabItem[];
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  children: React.ReactNode;
  themeConfig: DashboardThemeConfig;
  userRole?: string;
  userEmail?: string;
  onOpenThemeCustomizer: () => void;
  onResetDefaultScreen?: () => void;
  onSelectTheme?: (themeId: DashboardThemeId) => void;
  onSelectLayout?: (layout: NavLayoutOption) => void;
  onExitPortal?: () => void;
}

export const OSDashboardLayouts: React.FC<OSDashboardLayoutProps> = ({
  layoutOption,
  tabs,
  currentTab,
  onSelectTab,
  children,
  themeConfig,
  userRole = 'user',
  userEmail = 'user@bkresearchlabs.com',
  onOpenThemeCustomizer,
  onResetDefaultScreen,
  onSelectTheme,
  onSelectLayout,
  onExitPortal
}) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [startSearch, setStartSearch] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isMaximized, setIsMaximized] = useState(true);
  const [crtOverlayEnabled, setCrtOverlayEnabled] = useState(true);
  const [arcadeCredits, setArcadeCredits] = useState(4);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTabObj = tabs.find(t => t.id === currentTab) || tabs[0];
  const CurrentIcon = currentTabObj.icon;

  const filteredStartTabs = startSearch.trim()
    ? tabs.filter(t => t.label.toLowerCase().includes(startSearch.toLowerCase()) || (t.description && t.description.toLowerCase().includes(startSearch.toLowerCase())))
    : tabs;

  const isStaff = userRole === 'admin' || userRole === 'owner' || userRole === 'employee';

  const switcherWidget = isStaff ? (
    <DiscreteThemeSwitcherWidget
      currentLayout={layoutOption}
      currentTheme={themeConfig.id}
      onSelectTheme={onSelectTheme}
      onSelectLayout={onSelectLayout}
      onResetDefaultScreen={onResetDefaultScreen || onOpenThemeCustomizer}
      onOpenThemeCustomizer={onOpenThemeCustomizer}
    />
  ) : null;

  /* =========================================================================
     1. WINDOWS 11 DESKTOP OS LAYOUT
     ========================================================================= */
  if (layoutOption === 'windows_11') {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${themeConfig.bgClass} relative overflow-hidden transition-all duration-300`}>
        {/* Windows 11 Desktop Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-indigo-900/20 pointer-events-none" />

        {/* Windows 11 Top Bar / Breadcrumb Strip */}
        <div className={`px-4 py-2 border-b ${themeConfig.borderClass} ${themeConfig.headerBgClass} flex items-center justify-between text-xs backdrop-blur-md z-20`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-blue-400">
              <AppWindow className="w-4 h-4" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Windows 11 Pro Lab OS</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2 text-slate-300">
              <CurrentIcon className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold">{currentTabObj.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenThemeCustomizer}
              className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-[11px] flex items-center gap-1.5 transition-all"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme & Layout</span>
            </button>
            {onExitPortal && (
              <button
                onClick={onExitPortal}
                className="p-1 rounded bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                title="Exit Portal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Windows Window Container */}
        <div className="flex-1 p-3 sm:p-5 relative z-10 flex flex-col">
          <div className={`flex-1 rounded-2xl border ${themeConfig.borderClass} ${themeConfig.cardBgClass} overflow-hidden flex flex-col shadow-2xl transition-all`}>
            {/* Window Title Bar */}
            <div className={`px-4 py-2.5 border-b ${themeConfig.borderClass} bg-slate-900/80 backdrop-blur-md flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                  <CurrentIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">{currentTabObj.label}</span>
                {currentTabObj.category && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                    {currentTabObj.category}
                  </span>
                )}
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Minimize">
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsMaximized(!isMaximized)} className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Maximize">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                {onExitPortal && (
                  <button onClick={onExitPortal} className="p-1.5 rounded hover:bg-rose-600 text-slate-400 hover:text-white transition-colors" title="Close Window">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Window Content */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>

        {/* Windows 11 Start Menu Popup */}
        {startMenuOpen && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-2xl p-5 space-y-4 animate-fadeIn">
            {/* Search Input in Start Menu */}
            <div className="relative">
              <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Type to search dashboard apps & features..."
                value={startSearch}
                onChange={(e) => setStartSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Pinned Apps Header */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Pinned Dashboard Apps ({tabs.length})</span>
              <span className="text-[10px] text-blue-400 uppercase font-mono">Windows 11 Launcher</span>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
              {filteredStartTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setStartMenuOpen(false);
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-500/20'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-blue-400" />
                    <span className="text-[11px] font-bold leading-tight line-clamp-1">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Profile Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30">
                  {userRole[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">{userEmail}</div>
                  <div className="text-[9px] font-mono text-blue-400 uppercase">{userRole} profile</div>
                </div>
              </div>

              <button
                onClick={onOpenThemeCustomizer}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            </div>
          </div>
        )}

        {/* Windows 11 Centered Taskbar */}
        <div className={`sticky bottom-0 z-40 px-4 py-2 border-t ${themeConfig.borderClass} bg-slate-950/90 backdrop-blur-2xl flex items-center justify-between`}>
          <div className="w-24 text-[10px] font-mono text-slate-500 hidden sm:block">
            Win 11 Build 22H2
          </div>

          {/* Centered Taskbar Items */}
          <div className="flex items-center justify-center gap-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl px-3 py-1.5 shadow-2xl">
            {/* Start Menu Button */}
            <button
              onClick={() => setStartMenuOpen(!startMenuOpen)}
              className={`p-2 rounded-xl transition-all ${
                startMenuOpen ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-blue-400'
              }`}
              title="Windows Start Menu"
            >
              <Grid className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-slate-800 mx-1" />

            {/* Taskbar Pinned Tab Icons */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-xl py-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setStartMenuOpen(false);
                    }}
                    className={`relative p-2 rounded-xl transition-all flex items-center gap-1.5 group ${
                      isActive
                        ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40'
                        : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                    title={tab.label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className={`text-[11px] hidden lg:inline whitespace-nowrap ${isActive ? 'font-bold text-white' : ''}`}>
                      {tab.label}
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-blue-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Tray Clock & Quick Settings */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <button onClick={onOpenThemeCustomizer} className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-blue-400" title="OS Settings">
              <Settings className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <Battery className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-right font-mono text-[11px] text-slate-300 font-bold">
              {currentTime || '12:00 PM'}
            </div>
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     2. macOS APPLE GLASS OS LAYOUT
     ========================================================================= */
  if (layoutOption === 'macos_apple') {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${themeConfig.bgClass} relative overflow-hidden transition-all duration-300`}>
        {/* Top macOS Menu Bar */}
        <div className={`px-4 py-1.5 border-b ${themeConfig.borderClass} ${themeConfig.headerBgClass} flex items-center justify-between text-xs backdrop-blur-xl z-40 sticky top-0`}>
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-sky-400 font-bold text-sm" title="Apple Menu">
              
            </button>
            <span className="font-bold text-white text-xs tracking-tight">BK Research Labs OS</span>

            <div className="hidden md:flex items-center gap-3 text-slate-300 text-[11px]">
              <button className="hover:text-white font-medium">File</button>
              <button className="hover:text-white font-medium">Edit</button>
              <button className="hover:text-white font-medium">View</button>
              <button onClick={onOpenThemeCustomizer} className="hover:text-sky-400 font-bold text-sky-400">
                Theme & Layout
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono border border-sky-500/30 uppercase">
              {userRole}
            </span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-mono text-[11px] font-bold text-slate-200">{currentTime || '12:00 PM'}</span>
          </div>
        </div>

        {/* macOS Window Frame */}
        <div className="flex-1 p-3 sm:p-6 z-10 flex flex-col">
          <div className={`flex-1 rounded-2xl border ${themeConfig.borderClass} ${themeConfig.cardBgClass} overflow-hidden flex flex-col shadow-2xl transition-all`}>
            {/* macOS Title Bar with Traffic Lights */}
            <div className={`px-4 py-3 border-b ${themeConfig.borderClass} bg-slate-900/90 backdrop-blur-xl flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                {/* Traffic Light Buttons */}
                <div className="flex items-center gap-1.5 mr-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm cursor-pointer" onClick={onExitPortal} title="Close" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm cursor-pointer" title="Minimize" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm cursor-pointer" title="Expand" />
                </div>

                <div className="flex items-center gap-2">
                  <CurrentIcon className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white">{currentTabObj.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenThemeCustomizer}
                  className="px-3 py-1 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 text-[11px] font-bold transition-all"
                >
                  Theme Settings
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>

        {/* Floating macOS Dock */}
        <div className="sticky bottom-4 z-40 flex justify-center px-4">
          <div className="px-4 py-2.5 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-2xl flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative p-3 rounded-2xl transition-all duration-200 group hover:-translate-y-2 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 font-bold scale-105'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-sky-300 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     3. LINUX UBUNTU / GNOME OS LAYOUT
     ========================================================================= */
  if (layoutOption === 'linux_ubuntu') {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${themeConfig.bgClass} relative overflow-hidden transition-all duration-300`}>
        {/* Top GNOME Bar */}
        <div className={`px-4 py-1.5 border-b ${themeConfig.borderClass} ${themeConfig.headerBgClass} flex items-center justify-between text-xs z-40 sticky top-0`}>
          <div className="flex items-center gap-3">
            <button className="px-2.5 py-0.5 rounded bg-orange-600 text-white font-bold text-[11px] hover:bg-orange-500">
              Activities
            </button>
            <span className="text-slate-300 font-bold font-mono text-xs">Ubuntu 22.04 LTS</span>
          </div>

          <div className="font-mono text-xs text-stone-200 font-bold">
            {currentTime || '12:00 PM'}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button onClick={onOpenThemeCustomizer} className="text-orange-400 hover:underline text-[11px] font-bold">
              Preferences
            </button>
            <Wifi className="w-3.5 h-3.5 text-stone-300" />
            <Battery className="w-3.5 h-3.5 text-stone-300" />
          </div>
        </div>

        {/* Main Body with Left Vertical Ubuntu Dock */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Yaru Dock */}
          <div className="w-16 bg-stone-900 border-r border-stone-800 flex flex-col items-center py-4 gap-3 z-30 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative p-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-400 rounded-r" />
                  )}
                </button>
              );
            })}

            <div className="mt-auto pt-2 border-t border-stone-800">
              <button onClick={onOpenThemeCustomizer} className="p-3 rounded-2xl text-stone-400 hover:text-orange-400 hover:bg-stone-800" title="System Settings">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Window Workspace */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col">
            <div className={`flex-1 rounded-2xl border ${themeConfig.borderClass} ${themeConfig.cardBgClass} overflow-hidden flex flex-col shadow-2xl`}>
              {/* Terminal Style Header */}
              <div className="px-4 py-2.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2 text-orange-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>user@bkrl-lab:~$ ./run_tab --active={currentTab}</span>
                </div>

                <div className="flex items-center gap-2 text-stone-400">
                  <button onClick={onOpenThemeCustomizer} className="hover:text-white text-[11px]">
                    [Settings]
                  </button>
                  {onExitPortal && (
                    <button onClick={onExitPortal} className="hover:text-rose-400 text-[11px]">
                      [Exit]
                    </button>
                  )}
                </div>
              </div>

              {/* Main Tab Content */}
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     4. CYBERPUNK SCI-FI HUD OS LAYOUT
     ========================================================================= */
  if (layoutOption === 'cyberpunk_os') {
    return (
      <div className={`min-h-screen flex flex-col justify-between bg-black text-cyan-300 relative overflow-hidden transition-all duration-300`}>
        {/* Cyberpunk HUD Header */}
        <div className="p-4 border-b border-cyan-500/50 bg-slate-950/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs z-30">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_0_10px_#00f0ff]">
              HUD MATRIX OS v3.8
            </div>
            <div className="font-mono text-cyan-400 text-xs hidden sm:block">
              SYS STATUS: <span className="text-emerald-400 font-bold">OPTIMAL (99.8%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentTime || '23:42:00'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenThemeCustomizer}
              className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400/50 text-[11px] font-mono uppercase font-bold"
            >
              [Theme_Config]
            </button>
          </div>
        </div>

        {/* Cyberpunk Navigation Strip */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-cyan-500/30 flex items-center gap-2 overflow-x-auto z-20">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-2 border transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_12px_#00f0ff] font-black'
                    : 'bg-black/80 text-cyan-400 border-cyan-500/30 hover:border-cyan-400 hover:text-white'
                }`}
              >
                <span>[{String(idx + 1).padStart(2, '0')}]</span>
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {/* Tactical HUD Window Container */}
        <div className="flex-1 p-4 sm:p-6 z-10 flex flex-col">
          <div className="flex-1 rounded-2xl border border-cyan-500/40 bg-slate-950/90 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden relative">
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     6. PLAYSTATION 5 XMB HORIZON CONSOLE LAYOUT
     ========================================================================= */
  if (layoutOption === 'playstation_xmb') {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${themeConfig.bgClass} relative overflow-hidden transition-all duration-300 font-sans`}>
        {/* Particle/Wave Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-black pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top PlayStation Bar */}
        <div className={`px-6 py-3 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center justify-between text-xs backdrop-blur-md z-20`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${themeConfig.accentBgClass} flex items-center gap-2 shadow-lg`}>
              <Gamepad2 className="w-4 h-4" />
              <span className="font-mono tracking-wider font-extrabold">PS5 OS</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 opacity-80 text-[11px]">
              <span className={`px-2 py-0.5 rounded ${themeConfig.accentBgClass} font-mono font-bold`}>ONLINE</span>
              <span>•</span>
              <span className="font-medium">{userEmail}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30 font-bold text-[11px]">
              <Trophy className="w-3.5 h-3.5" />
              <span>2,480 PTS</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime}</span>
            </div>
            <button
              onClick={onOpenThemeCustomizer}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title="Console Settings & Theme Customizer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* XMB Horizontal Category Ribbon */}
        <div className={`px-6 py-4 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center gap-3 overflow-x-auto z-10 scrollbar-none`}>
          <div className={`text-[10px] font-extrabold uppercase tracking-widest ${themeConfig.accentTextClass} px-2`}>Navigation Deck:</div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? `${themeConfig.accentBgClass} scale-105 border-white/20 shadow-lg`
                    : `${themeConfig.cardBgClass} border-white/10 opacity-80 hover:opacity-100`
                }`}
              >
                <div className="p-1.5 rounded-xl bg-white/10">
                  <Icon className="w-4 h-4" />
                </div>
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* PS5 Stage View Container */}
        <div className="flex-1 p-4 sm:p-6 z-10 flex flex-col overflow-hidden">
          <div className={`flex-1 rounded-3xl border ${themeConfig.borderClass} ${themeConfig.cardBgClass} backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden relative`}>
            {/* PS Controller Button Action Header */}
            <div className={`px-6 py-3 border-b ${themeConfig.borderClass} ${themeConfig.headerBgClass} flex flex-wrap items-center justify-between gap-3 text-xs`}>
              <div className="flex items-center gap-2 font-extrabold">
                <CurrentIcon className="w-4 h-4" />
                <span className="text-sm">{currentTabObj.label}</span>
                {currentTabObj.description && (
                  <span className="text-xs opacity-70 font-normal hidden md:inline">
                    — {currentTabObj.description}
                  </span>
                )}
              </div>

              {/* PlayStation Button Glyphs Prompt Bar */}
              <div className={`flex items-center gap-3 text-[11px] font-bold px-3 py-1.5 rounded-xl border ${themeConfig.borderClass} bg-black/30`}>
                <span className="flex items-center gap-1"><span className="text-emerald-400 font-black">△</span> Quick Settings</span>
                <span className="flex items-center gap-1"><span className="text-red-400 font-black">◯</span> Back</span>
                <span className="flex items-center gap-1"><span className="text-blue-400 font-black">✕</span> Select</span>
                <span className="flex items-center gap-1"><span className="text-pink-400 font-black">⬜</span> Options</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     7. XBOX SERIES X BLADE & TILE DASHBOARD
     ========================================================================= */
  if (layoutOption === 'xbox_dashboard') {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${themeConfig.bgClass} relative overflow-hidden transition-all duration-300 font-sans`}>
        {/* Xbox Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Xbox Top Header Bar */}
        <div className={`px-6 py-3 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center justify-between text-xs z-20 backdrop-blur-md`}>
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full ${themeConfig.accentBgClass} flex items-center justify-center font-black shadow-lg`}>
              <Gamepad className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm">XBOX DASHBOARD</span>
              <span className={`px-2 py-0.5 rounded ${themeConfig.accentBgClass} text-[10px] font-mono font-bold opacity-90`}>SERIES X</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className={`flex items-center gap-1 ${themeConfig.accentTextClass} bg-black/40 px-2.5 py-1 rounded-lg border ${themeConfig.borderClass} font-mono`}>
              <span className="font-black">125,480</span>
              <span className="text-[10px] font-black">G</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime}</span>
            </div>
            <button
              onClick={onOpenThemeCustomizer}
              className={`px-3 py-1.5 rounded-lg ${themeConfig.accentBgClass} font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xbox Guide</span>
            </button>
          </div>
        </div>

        {/* Xbox Blade Tab Ribbon */}
        <div className={`px-6 py-3 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center gap-2 overflow-x-auto z-10`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? `${themeConfig.accentBgClass} border-white/20 shadow-lg font-extrabold scale-105`
                    : `${themeConfig.cardBgClass} border-white/10 opacity-80 hover:opacity-100`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Xbox Active Content Container */}
        <div className="flex-1 p-4 sm:p-6 z-10 flex flex-col">
          <div className={`flex-1 rounded-2xl border ${themeConfig.borderClass} ${themeConfig.cardBgClass} shadow-2xl flex flex-col overflow-hidden relative`}>
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Xbox Controller Prompts Bar */}
            <div className={`px-6 py-2 ${themeConfig.headerBgClass} border-t ${themeConfig.borderClass} flex items-center justify-between text-[11px] font-bold opacity-90`}>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center font-black text-[10px]">A</span> Select</span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-[10px]">B</span> Back</span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-[10px]">X</span> Options</span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-[10px]">Y</span> Search</span>
              </div>
              <span className={`text-[10px] ${themeConfig.accentTextClass} font-mono hidden sm:inline uppercase`}>NETWORK ONLINE</span>
            </div>
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     8. NINTENDO SWITCH HOME RIBBON
     ========================================================================= */
  if (layoutOption === 'nintendo_switch') {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${themeConfig.bgClass} relative overflow-hidden transition-all duration-300 font-sans`}>
        {/* Top Nintendo Header Bar */}
        <div className={`px-6 py-3 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center justify-between text-xs z-20`}>
          <div className="flex items-center gap-3">
            {/* Joy-Cons Icon */}
            <div className="flex items-center gap-1 bg-gradient-to-r from-[#ff3c28] to-[#00c3e3] p-1.5 rounded-xl text-white font-extrabold shadow-md">
              <Zap className="w-4 h-4 fill-white" />
              <span className="text-xs font-mono font-black tracking-tighter">SWITCH OS</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white text-white font-black flex items-center justify-center text-[10px]">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold">{userEmail.split('@')[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">100%</span>
            </div>
            <div className="font-mono font-bold">
              {currentTime}
            </div>
            <button
              onClick={onOpenThemeCustomizer}
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-md cursor-pointer"
              title="Switch Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nintendo Switch Horizontal Games / Tabs Carousel */}
        <div className={`px-6 py-4 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center gap-3 overflow-x-auto z-10`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group flex-shrink-0 w-36 sm:w-44 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? `${themeConfig.cardBgClass} border-red-500 shadow-xl scale-105 ring-2 ring-red-400`
                    : `${themeConfig.cardBgClass} opacity-70 hover:opacity-100 border-white/10`
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-red-500 text-white' : 'bg-slate-800 text-cyan-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black uppercase">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold truncate">{tab.label}</div>
                  <div className="text-[10px] opacity-70 truncate mt-0.5">{tab.category || 'System Function'}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Stage View */}
        <div className="flex-1 p-4 sm:p-6 z-10 flex flex-col">
          <div className={`flex-1 rounded-2xl border ${themeConfig.borderClass} ${themeConfig.cardBgClass} shadow-2xl flex flex-col overflow-hidden`}>
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     9. STEAM DECK OS / BIG PICTURE PORTAL
     ========================================================================= */
  if (layoutOption === 'steam_deck') {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${themeConfig.bgClass} relative overflow-hidden transition-all duration-300 font-sans`}>
        {/* Steam Deck Top Header */}
        <div className={`px-6 py-2.5 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center justify-between text-xs z-20`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${themeConfig.accentBgClass} font-black flex items-center gap-1.5 shadow-md`}>
              <Disc className="w-4 h-4" />
              <span className="font-mono text-xs tracking-wider">STEAM DECK OS</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] opacity-80">
              <span className="px-2 py-0.5 rounded bg-black/30 font-bold">PROTON 8.0</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1"><Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" /> VERIFIED DECK</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className={`flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg border ${themeConfig.borderClass} font-mono text-[11px]`}>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>FPS: 60 | CPU: 24%</span>
            </div>
            <div className="font-mono">{currentTime}</div>
            <button
              onClick={onOpenThemeCustomizer}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title="Steam Menu & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Steam Deck Main Workspace Body with Left Vertical Rail */}
        <div className="flex-1 flex overflow-hidden z-10">
          {/* Left Steam Rail */}
          <div className={`w-56 ${themeConfig.headerBgClass} border-r ${themeConfig.borderClass} p-3 flex flex-col gap-1.5 overflow-y-auto`}>
            <div className={`text-[10px] font-extrabold uppercase tracking-widest ${themeConfig.accentTextClass} px-2 py-1`}>
              DECK CATEGORIES
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer border ${
                    isActive
                      ? `${themeConfig.accentBgClass} border-white/20 font-black shadow-lg`
                      : `${themeConfig.cardBgClass} border-transparent opacity-80 hover:opacity-100`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Main Content */}
          <div className={`flex-1 p-4 sm:p-6 overflow-y-auto ${themeConfig.cardBgClass}`}>
            {children}
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     10. RETRO ARCADE NEO-GEO CABINET HUD
     ========================================================================= */
  if (layoutOption === 'arcade_cabinet') {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${themeConfig.bgClass} relative overflow-hidden transition-all duration-300 font-mono ${crtOverlayEnabled ? 'shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]' : ''}`}>
        {/* Optional CRT Scanlines Effect Overlay */}
        {crtOverlayEnabled && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-30 opacity-60" />
        )}

        {/* Arcade Top Marquee */}
        <div className={`px-6 py-3 ${themeConfig.headerBgClass} border-b-4 ${themeConfig.borderClass} flex items-center justify-between text-xs z-20 shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[#ff007f] to-[#ffb703] text-black font-black flex items-center gap-2 shadow-[0_0_15px_#ff007f]">
              <Flame className="w-5 h-5 text-black animate-bounce" />
              <span className="tracking-widest uppercase text-sm font-black">NEO-GEO ARCADE</span>
            </div>

            {/* Coin Insert Button */}
            <button
              onClick={() => setArcadeCredits(prev => prev + 1)}
              className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs flex items-center gap-1.5 border-2 border-black shadow-[0_0_10px_#facc15] transition-transform active:scale-95 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>INSERT 25¢ (CREDITS: {arcadeCredits})</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-black">
            <div className="flex items-center gap-2 text-yellow-300 font-mono bg-black/60 px-3 py-1 rounded border border-yellow-400/50">
              <span>HIGH SCORE:</span>
              <span className="text-white text-sm">999,990</span>
            </div>

            <button
              onClick={() => setCrtOverlayEnabled(!crtOverlayEnabled)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold border cursor-pointer ${crtOverlayEnabled ? 'bg-cyan-500 text-black border-cyan-300' : 'bg-slate-900 text-slate-400 border-slate-700'}`}
            >
              CRT SCANLINES: {crtOverlayEnabled ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={onOpenThemeCustomizer}
              className="p-1.5 rounded bg-[#ff007f] hover:bg-pink-600 text-white cursor-pointer"
              title="Arcade Cabinet Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Retro Tabs Ribbon */}
        <div className={`px-6 py-3 ${themeConfig.headerBgClass} border-b-2 ${themeConfig.borderClass} flex items-center gap-2 overflow-x-auto z-10`}>
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-black flex items-center gap-2 border-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? `${themeConfig.accentBgClass} border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-105`
                    : `${themeConfig.cardBgClass} border-white/20 opacity-80 hover:opacity-100`
                }`}
              >
                <span>P{idx + 1}</span>
                <Icon className="w-4 h-4" />
                <span>{tab.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {/* Arcade Stage Screen Container */}
        <div className="flex-1 p-4 sm:p-6 z-10 flex flex-col">
          <div className={`flex-1 rounded-2xl border-4 ${themeConfig.borderClass} ${themeConfig.cardBgClass} shadow-2xl flex flex-col overflow-hidden relative`}>
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Arcade Joystick & 4 Color Buttons Footer */}
            <div className={`px-6 py-3 ${themeConfig.headerBgClass} border-t-2 ${themeConfig.borderClass} flex flex-wrap items-center justify-between gap-3 text-xs font-black`}>
              <div className="flex items-center gap-2 text-yellow-300">
                <Gamepad2 className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span>READY PLAYER ONE — PRESS START</span>
              </div>

              {/* 4 Arcade Push Buttons */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-white shadow-md text-xs">A</span>
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-md text-xs">B</span>
                <span className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center border-2 border-black shadow-md text-xs">C</span>
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-md text-xs">D</span>
              </div>
            </div>
          </div>
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     11. SIDEBAR DRAWER LAYOUT
     ========================================================================= */
  if (layoutOption === 'sidebar_drawer') {
    return (
      <div className={`min-h-screen flex ${themeConfig.bgClass} transition-all duration-300`}>
        {/* Left Sidebar Rail */}
        <div className={`w-64 ${themeConfig.headerBgClass} border-r ${themeConfig.borderClass} p-4 flex flex-col justify-between z-20 shrink-0`}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className={`p-2 rounded-xl ${themeConfig.accentBgClass}`}>
                <PanelLeft className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm">Sidebar Portal</div>
                <div className="text-[10px] opacity-70 uppercase font-mono">{userRole} view</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className={`text-[10px] font-extrabold uppercase tracking-widest ${themeConfig.accentTextClass} px-2 py-1`}>Navigation Rail</div>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all text-left cursor-pointer border ${
                      isActive
                        ? `${themeConfig.accentBgClass} border-white/20 shadow-md font-extrabold`
                        : `${themeConfig.cardBgClass} opacity-80 hover:opacity-100 border-transparent`
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <button
              onClick={onOpenThemeCustomizer}
              className={`w-full py-2 px-3 rounded-xl ${themeConfig.accentBgClass} font-bold text-xs flex items-center justify-center gap-2`}
            >
              <Palette className="w-4 h-4" />
              <span>Theme Customizer</span>
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     12. COMMAND HUB MEGAMENU LAYOUT
     ========================================================================= */
  if (layoutOption === 'command_hub') {
    return (
      <div className={`min-h-screen flex flex-col ${themeConfig.bgClass} transition-all duration-300`}>
        {/* Top Megamenu Ribbon */}
        <div className={`px-6 py-4 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} z-20 space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${themeConfig.accentBgClass}`}>
                <Command className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight">Megamenu Command Hub</span>
            </div>
            <button
              onClick={onOpenThemeCustomizer}
              className={`px-3 py-1.5 rounded-xl ${themeConfig.accentBgClass} font-bold text-xs flex items-center gap-1.5`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all whitespace-nowrap ${
                    isActive
                      ? `${themeConfig.accentBgClass} font-extrabold shadow-md`
                      : `${themeConfig.cardBgClass} opacity-80 hover:opacity-100 border-white/10`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     13. FLOATING GLASS PILL DOCK LAYOUT
     ========================================================================= */
  if (layoutOption === 'floating_dock') {
    return (
      <div className={`min-h-screen flex flex-col ${themeConfig.bgClass} relative transition-all duration-300`}>
        {/* Top Header Bar with Ambient Controls */}
        <div className={`px-4 sm:px-6 py-2.5 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center justify-between text-xs z-20 backdrop-blur-md`}>
          <div className="flex items-center gap-2 font-bold">
            <div className={`p-1.5 rounded-xl ${themeConfig.accentBgClass}`}>
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">Floating Glass Pill Dock</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${themeConfig.accentBgClass} opacity-90 hidden sm:inline`}>
              {userRole}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-slate-300 font-bold">{currentTime}</span>
            </div>
            <button
              onClick={onOpenThemeCustomizer}
              className={`px-3 py-1.5 rounded-xl ${themeConfig.accentBgClass} font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
            {onExitPortal && (
              <button
                onClick={onExitPortal}
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors cursor-pointer"
                title="Exit"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Top Floating Glass Pill Navigation Bar - Single Row, No Scrolling, Description Below */}
        <div className="py-2.5 px-3 sm:px-6 flex justify-center z-40 sticky top-0 backdrop-blur-md bg-black/25 overflow-visible">
          <div className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-950/95 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl flex flex-nowrap items-center justify-center gap-1 sm:gap-1.5 md:gap-2 max-w-full overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <div key={tab.id} className="relative group flex flex-col items-center shrink-0">
                  <button
                    onClick={() => onSelectTab(tab.id)}
                    aria-label={tab.label}
                    className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center shrink-0 ${
                      isActive
                        ? `${themeConfig.accentBgClass} scale-110 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40`
                        : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full absolute -top-0.5 right-0.5 animate-pulse" />
                    )}
                  </button>

                  {/* Hover Span Out Label & Description Card Below Icon Outside the Pill */}
                  <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 flex flex-col items-center w-56 sm:w-64 max-w-xs shadow-2xl">
                    {/* Caret Arrow pointing up to icon */}
                    <div className="w-2.5 h-2.5 rotate-45 bg-[#05110d] border-t border-l border-emerald-500/60 -mb-1.5 z-10" />
                    {/* Tooltip Card Body */}
                    <div className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110d]/95 text-white border border-emerald-500/50 shadow-2xl backdrop-blur-2xl text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-emerald-300">
                        <span className="truncate">{tab.label}</span>
                        {tab.category && (
                          <span className="text-[9px] text-slate-400 font-mono font-normal">
                            • {tab.category}
                          </span>
                        )}
                      </div>
                      {tab.description && (
                        <p className="text-[11px] text-slate-200 leading-snug font-normal text-center">
                          {tab.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto z-10">
          {children}
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     14. MINIMAL COMPACT STRIP LAYOUT
     ========================================================================= */
  if (layoutOption === 'minimal_strip') {
    return (
      <div className={`min-h-screen flex flex-col ${themeConfig.bgClass} transition-all duration-300`}>
        <div className={`px-4 py-2 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center justify-between text-xs`}>
          <div className="flex items-center gap-2 font-bold font-mono text-xs">
            <LayoutList className="w-4 h-4 text-emerald-400" />
            <span>MINIMAL TEXT STRIP OS</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    isActive
                      ? `${themeConfig.accentBgClass} font-extrabold`
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <button onClick={onOpenThemeCustomizer} className="p-1 rounded bg-white/10 hover:bg-white/20">
            <Palette className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>

        {switcherWidget}
      </div>
    );
  }

  /* =========================================================================
     15. ENTERPRISE OS MULTI-TAB WORKBENCH (FALLBACK)
     ========================================================================= */
  return (
    <div className={`min-h-screen flex flex-col ${themeConfig.bgClass} transition-all duration-300 relative`}>
      {/* Action Ribbon Header */}
      <div className={`px-4 py-3 border-b ${themeConfig.borderClass} ${themeConfig.headerBgClass} flex flex-wrap items-center justify-between gap-3 text-xs`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${themeConfig.accentBgClass}`}>
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm">Enterprise Workbench Portal</div>
            <div className="text-[10px] opacity-70 font-mono">Role: {userRole.toUpperCase()}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenThemeCustomizer}
            className={`px-3 py-1.5 rounded-xl ${themeConfig.accentBgClass} font-bold text-xs flex items-center gap-1.5 shadow-md`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Layout Customizer</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Ribbon */}
      <div className={`px-4 py-2 ${themeConfig.headerBgClass} border-b ${themeConfig.borderClass} flex items-center gap-2 overflow-x-auto`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all whitespace-nowrap ${
                isActive
                  ? `${themeConfig.accentBgClass} border-white/20 shadow-md font-extrabold`
                  : `${themeConfig.cardBgClass} border-white/10 opacity-80 hover:opacity-100`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
        {children}
      </div>

      {switcherWidget}
    </div>
  );
};
