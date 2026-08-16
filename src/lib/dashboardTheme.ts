export type DashboardThemeId =
  | 'emerald_dark'
  | 'midnight_slate'
  | 'royal_purple'
  | 'cyber_neon'
  | 'sunset_amber'
  | 'clean_light'
  | 'nordic_frost'
  | 'tokyo_night'
  | 'dracula_gothic'
  | 'catppuccin_mocha'
  | 'solarized_dark'
  | 'github_dark'
  | 'monokai_pro'
  | 'ps5_cosmic_blue'
  | 'xbox_velocity_green'
  | 'switch_neon_red_blue'
  | 'steam_neon_cyan'
  | 'retro_arcade_neon';

export interface ThemeConfig {
  id: DashboardThemeId;
  name: string;
  badge: string;
  description?: string;
  accentColor?: string;
  previewBg: string;
  previewAccent: string;
  bgClass: string;
  cardBgClass: string;
  textClass: string;
  accentBgClass: string;
  accentTextClass: string;
  borderClass: string;
  headerBgClass: string;
}

export type DashboardThemeConfig = ThemeConfig;

export const DASHBOARD_THEMES: ThemeConfig[] = [
  {
    id: 'emerald_dark',
    name: 'Emerald Research Dark (Default)',
    badge: 'Lab Classic',
    description: 'High-contrast dark slate canvas with vibrant chemical emerald highlights.',
    previewBg: 'bg-slate-950',
    previewAccent: 'bg-emerald-500',
    bgClass: 'bg-slate-950 text-white',
    cardBgClass: 'bg-slate-900 border-slate-800 text-slate-100',
    textClass: 'text-slate-100',
    accentBgClass: 'bg-emerald-500 text-slate-950',
    accentTextClass: 'text-emerald-400',
    borderClass: 'border-slate-800',
    headerBgClass: 'bg-slate-950/90 border-slate-800'
  },
  {
    id: 'midnight_slate',
    name: 'Midnight Deep Slate',
    badge: 'Dark Slate',
    description: 'Deep zinc navy tones paired with crisp electric blue indicators.',
    previewBg: 'bg-zinc-950',
    previewAccent: 'bg-blue-500',
    bgClass: 'bg-zinc-950 text-zinc-100',
    cardBgClass: 'bg-zinc-900 border-zinc-800 text-zinc-100',
    textClass: 'text-zinc-100',
    accentBgClass: 'bg-blue-600 text-white',
    accentTextClass: 'text-blue-400',
    borderClass: 'border-zinc-800',
    headerBgClass: 'bg-zinc-950/90 border-zinc-800'
  },
  {
    id: 'royal_purple',
    name: 'Royal Obsidian & Violet',
    badge: 'Luxury Dark',
    description: 'Ultra-luxurious dark obsidian with regal violet glass accents.',
    previewBg: 'bg-slate-950',
    previewAccent: 'bg-purple-500',
    bgClass: 'bg-slate-950 text-purple-100',
    cardBgClass: 'bg-slate-900/90 border-purple-900/40 text-purple-100',
    textClass: 'text-purple-100',
    accentBgClass: 'bg-purple-600 text-white',
    accentTextClass: 'text-purple-400',
    borderClass: 'border-purple-900/40',
    headerBgClass: 'bg-slate-950/90 border-purple-900/40'
  },
  {
    id: 'cyber_neon',
    name: 'Cyberpunk Matrix Neon',
    badge: 'High Contrast',
    description: 'High-density monospace console canvas with glowing cyan optics.',
    previewBg: 'bg-black',
    previewAccent: 'bg-cyan-400',
    bgClass: 'bg-black text-cyan-300 font-mono',
    cardBgClass: 'bg-zinc-950 border-cyan-800/60 text-cyan-200',
    textClass: 'text-cyan-300',
    accentBgClass: 'bg-cyan-400 text-black font-extrabold',
    accentTextClass: 'text-cyan-400',
    borderClass: 'border-cyan-800/60',
    headerBgClass: 'bg-black/95 border-cyan-800'
  },
  {
    id: 'sunset_amber',
    name: 'Executive Amber Warm Dark',
    badge: 'Gold Executive',
    description: 'Warm stone dark canvas with amber and warm gold executive accents.',
    previewBg: 'bg-stone-950',
    previewAccent: 'bg-amber-500',
    bgClass: 'bg-stone-950 text-amber-100',
    cardBgClass: 'bg-stone-900 border-amber-900/40 text-amber-100',
    textClass: 'text-amber-100',
    accentBgClass: 'bg-amber-500 text-stone-950 font-bold',
    accentTextClass: 'text-amber-400',
    borderClass: 'border-amber-900/40',
    headerBgClass: 'bg-stone-950/90 border-amber-900/40'
  },
  {
    id: 'clean_light',
    name: 'Clean Clinical Light',
    badge: 'High Density Light',
    description: 'Bright clinical white layout with crisp lab teal elements.',
    previewBg: 'bg-slate-50',
    previewAccent: 'bg-emerald-600',
    bgClass: 'bg-slate-100 text-slate-900',
    cardBgClass: 'bg-white border-slate-200 text-slate-900 shadow-sm',
    textClass: 'text-slate-900',
    accentBgClass: 'bg-emerald-700 text-white',
    accentTextClass: 'text-emerald-700',
    borderClass: 'border-slate-200',
    headerBgClass: 'bg-white/95 border-slate-200'
  },
  {
    id: 'nordic_frost',
    name: 'Nordic Blue Frost',
    badge: 'Cool Light',
    description: 'Cool glacial light background with serene sky blue accents.',
    previewBg: 'bg-sky-50',
    previewAccent: 'bg-sky-600',
    bgClass: 'bg-sky-50/50 text-slate-900',
    cardBgClass: 'bg-white border-sky-100 text-slate-900 shadow-xs',
    textClass: 'text-slate-900',
    accentBgClass: 'bg-sky-600 text-white',
    accentTextClass: 'text-sky-600',
    borderClass: 'border-sky-100',
    headerBgClass: 'bg-white/95 border-sky-100'
  },
  {
    id: 'tokyo_night',
    name: 'Tokyo Night Neon Dark',
    badge: 'Vibrant Synth',
    description: 'Vibrant neon pink and magenta synthwave dark workspace.',
    previewBg: 'bg-slate-950',
    previewAccent: 'bg-pink-500',
    bgClass: 'bg-slate-950 text-slate-100',
    cardBgClass: 'bg-slate-900 border-pink-900/30 text-slate-100',
    textClass: 'text-slate-100',
    accentBgClass: 'bg-pink-600 text-white',
    accentTextClass: 'text-pink-400',
    borderClass: 'border-pink-900/30',
    headerBgClass: 'bg-slate-950/90 border-pink-900/30'
  },
  {
    id: 'dracula_gothic',
    name: 'Dracula Gothic Purple',
    badge: 'Dracula',
    description: 'Iconic Dracula dark charcoal canvas with purple & soft pink highlights.',
    previewBg: 'bg-[#282a36]',
    previewAccent: 'bg-[#bd93f9]',
    bgClass: 'bg-[#282a36] text-[#f8f8f2]',
    cardBgClass: 'bg-[#343746] border-[#44475a] text-[#f8f8f2]',
    textClass: 'text-[#f8f8f2]',
    accentBgClass: 'bg-[#bd93f9] text-[#282a36] font-bold',
    accentTextClass: 'text-[#ff79c6]',
    borderClass: 'border-[#44475a]',
    headerBgClass: 'bg-[#282a36]/95 border-[#44475a]'
  },
  {
    id: 'catppuccin_mocha',
    name: 'Catppuccin Mocha Lavender',
    badge: 'Catppuccin',
    description: 'Soothing pastel mocha canvas with lavender, rosewater & mauve accents.',
    previewBg: 'bg-[#1e1e2e]',
    previewAccent: 'bg-[#cba6f7]',
    bgClass: 'bg-[#1e1e2e] text-[#cdd6f4]',
    cardBgClass: 'bg-[#181825] border-[#313244] text-[#cdd6f4]',
    textClass: 'text-[#cdd6f4]',
    accentBgClass: 'bg-[#cba6f7] text-[#11111b] font-bold',
    accentTextClass: 'text-[#f5c2e7]',
    borderClass: 'border-[#313244]',
    headerBgClass: 'bg-[#1e1e2e]/95 border-[#313244]'
  },
  {
    id: 'solarized_dark',
    name: 'Solarized Cyan & Amber',
    badge: 'Solarized',
    description: 'Classic Ethan Schoonover Solarized dark cyan base with amber gold accents.',
    previewBg: 'bg-[#002b36]',
    previewAccent: 'bg-[#2aa198]',
    bgClass: 'bg-[#002b36] text-[#93a1a1]',
    cardBgClass: 'bg-[#073642] border-[#586e75]/40 text-[#93a1a1]',
    textClass: 'text-[#93a1a1]',
    accentBgClass: 'bg-[#b58900] text-[#002b36] font-bold',
    accentTextClass: 'text-[#2aa198]',
    borderClass: 'border-[#586e75]/40',
    headerBgClass: 'bg-[#002b36]/95 border-[#586e75]/40'
  },
  {
    id: 'github_dark',
    name: 'GitHub Workspace Dark',
    badge: 'GitHub Dark',
    description: 'Official GitHub dark slate canvas with repository green & blue accents.',
    previewBg: 'bg-[#0d1117]',
    previewAccent: 'bg-[#238636]',
    bgClass: 'bg-[#0d1117] text-[#c9d1d9]',
    cardBgClass: 'bg-[#161b22] border-[#30363d] text-[#c9d1d9]',
    textClass: 'text-[#c9d1d9]',
    accentBgClass: 'bg-[#238636] text-white font-bold',
    accentTextClass: 'text-[#58a6ff]',
    borderClass: 'border-[#30363d]',
    headerBgClass: 'bg-[#0d1117]/95 border-[#30363d]'
  },
  {
    id: 'monokai_pro',
    name: 'Monokai Pro Obsidian',
    badge: 'Monokai Pro',
    description: 'Warm obsidian dark background with iconic Monokai magenta & gold accents.',
    previewBg: 'bg-[#2d2a2e]',
    previewAccent: 'bg-[#ffd866]',
    bgClass: 'bg-[#2d2a2e] text-[#fcfcfa]',
    cardBgClass: 'bg-[#221f22] border-[#403e41] text-[#fcfcfa]',
    textClass: 'text-[#fcfcfa]',
    accentBgClass: 'bg-[#ffd866] text-[#2d2a2e] font-bold',
    accentTextClass: 'text-[#ff6188]',
    borderClass: 'border-[#403e41]',
    headerBgClass: 'bg-[#2d2a2e]/95 border-[#403e41]'
  },
  {
    id: 'ps5_cosmic_blue',
    name: 'PlayStation Cosmic Blue',
    badge: 'PS5 Console',
    description: 'Sleek PlayStation 5 deep midnight blue canvas with glowing cobalt wave & white accents.',
    previewBg: 'bg-[#000814]',
    previewAccent: 'bg-[#0070d1]',
    bgClass: 'bg-[#000814] text-[#e0e6ed]',
    cardBgClass: 'bg-[#0a192f] border-[#0070d1]/40 text-[#e0e6ed]',
    textClass: 'text-[#e0e6ed]',
    accentBgClass: 'bg-[#0070d1] text-white font-bold shadow-lg shadow-blue-600/30',
    accentTextClass: 'text-[#38bdf8]',
    borderClass: 'border-[#0070d1]/40',
    headerBgClass: 'bg-[#000814]/95 border-[#0070d1]/40'
  },
  {
    id: 'xbox_velocity_green',
    name: 'Xbox Velocity Carbon',
    badge: 'Xbox Console',
    description: 'Dynamic Xbox Series X carbon black base with electric Velocity Green illumination.',
    previewBg: 'bg-[#0b0e0c]',
    previewAccent: 'bg-[#107c41]',
    bgClass: 'bg-[#0b0e0c] text-[#e3e8e5]',
    cardBgClass: 'bg-[#121a15] border-[#107c41]/40 text-[#e3e8e5]',
    textClass: 'text-[#e3e8e5]',
    accentBgClass: 'bg-[#107c41] text-white font-bold shadow-lg shadow-emerald-600/30',
    accentTextClass: 'text-[#4ade80]',
    borderClass: 'border-[#107c41]/40',
    headerBgClass: 'bg-[#0b0e0c]/95 border-[#107c41]/40'
  },
  {
    id: 'switch_neon_red_blue',
    name: 'Nintendo Joy-Con Switch',
    badge: 'Switch Console',
    description: 'Playful Nintendo Switch theme with iconic Neon Red & Electric Blue Joy-Con highlights.',
    previewBg: 'bg-[#0f172a]',
    previewAccent: 'bg-[#ff3c28]',
    bgClass: 'bg-[#0f172a] text-[#f1f5f9]',
    cardBgClass: 'bg-[#1e293b] border-[#ff3c28]/40 text-[#f1f5f9]',
    textClass: 'text-[#f1f5f9]',
    accentBgClass: 'bg-gradient-to-r from-[#ff3c28] to-[#00c3e3] text-white font-bold',
    accentTextClass: 'text-[#00c3e3]',
    borderClass: 'border-[#ff3c28]/40',
    headerBgClass: 'bg-[#0f172a]/95 border-[#00c3e3]/40'
  },
  {
    id: 'steam_neon_cyan',
    name: 'Steam Deck Cyber Cyan',
    badge: 'Steam Deck',
    description: 'Steam Deck gaming OS dark slate aesthetic with cyber cyan & warm orange status highlights.',
    previewBg: 'bg-[#171a21]',
    previewAccent: 'bg-[#66c0f4]',
    bgClass: 'bg-[#171a21] text-[#c6d4df]',
    cardBgClass: 'bg-[#1b2838] border-[#2a475e] text-[#c6d4df]',
    textClass: 'text-[#c6d4df]',
    accentBgClass: 'bg-[#66c0f4] text-[#171a21] font-bold',
    accentTextClass: 'text-[#66c0f4]',
    borderClass: 'border-[#2a475e]',
    headerBgClass: 'bg-[#171a21]/95 border-[#2a475e]'
  },
  {
    id: 'retro_arcade_neon',
    name: 'Retro Arcade 80s Synthwave',
    badge: 'Arcade Cabinet',
    description: 'Vibrant Neo-Geo arcade cabinet aesthetic with glowing magenta, cyan & gold marquees.',
    previewBg: 'bg-[#120024]',
    previewAccent: 'bg-[#ff007f]',
    bgClass: 'bg-[#120024] text-[#ffe6fd]',
    cardBgClass: 'bg-[#240046] border-[#ff007f]/50 text-[#ffe6fd]',
    textClass: 'text-[#ffe6fd]',
    accentBgClass: 'bg-gradient-to-r from-[#ff007f] to-[#7b2cbf] text-white font-bold',
    accentTextClass: 'text-[#00f5d4]',
    borderClass: 'border-[#ff007f]/50',
    headerBgClass: 'bg-[#120024]/95 border-[#ff007f]/50'
  }
];

export interface UserDashboardPreferences {
  layout: any;
  theme: DashboardThemeId;
}

export function getUserDashboardPreferences(userIdOrEmail: string): UserDashboardPreferences {
  const key = `bkrl_user_prefs_${userIdOrEmail}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading preferences:', e);
  }

  // Fallback check legacy layout keys
  let legacyAdminLayout: string | null = null;
  let legacyCustLayout: string | null = null;
  try {
    legacyAdminLayout = localStorage.getItem('bkrl_nav_layout_admin');
    legacyCustLayout = localStorage.getItem('bkrl_nav_layout_customer');
  } catch (e) {
    // ignore
  }

  return {
    layout: legacyAdminLayout || legacyCustLayout || 'floating_dock',
    theme: 'emerald_dark'
  };
}

export function saveUserDashboardPreferences(
  userIdOrEmail: string,
  prefs: UserDashboardPreferences
) {
  const key = `bkrl_user_prefs_${userIdOrEmail}`;
  try {
    localStorage.setItem(key, JSON.stringify(prefs));
    // Also update legacy keys for backwards compatibility
    localStorage.setItem('bkrl_nav_layout_admin', prefs.layout);
    localStorage.setItem('bkrl_nav_layout_customer', prefs.layout);
  } catch (e) {
    console.error('Error saving preferences:', e);
  }
}
