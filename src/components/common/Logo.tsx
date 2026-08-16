import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  logoUrl?: string;
  siteName?: string;
}

export const BkrShieldIcon: React.FC<{ sizeClass?: string; isLight?: boolean }> = ({ 
  sizeClass = "w-12 h-12", 
  isLight = false 
}) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClass} shrink-0`}>
    <path
      d="M50 6L88 21C88 60 70 85 50 94C30 85 12 60 12 21L50 6Z"
      fill={isLight ? '#031b19' : '#011716'}
      stroke={isLight ? '#0f766e' : '#022c29'}
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path
      d="M50 15L79 27C79 57 64 77 50 85C36 77 21 57 21 27L50 15Z"
      fill="#ffffff"
      stroke="#06b6d4"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <text
      x="50"
      y="55"
      textAnchor="middle"
      fill="#090d16"
      fontSize="21"
      fontWeight="900"
      fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      letterSpacing="0.8"
    >
      BKR
    </text>
  </svg>
);

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'brand', 
  size = 'md', 
  showTagline = false,
  logoUrl,
  siteName = 'BK Research Labs',
}) => {
  const isLight = variant === 'light';
  const isDark = variant === 'dark';

  const iconSizeClass = size === 'sm' ? 'w-8 h-8 sm:w-9 sm:h-9' : size === 'lg' ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-10 h-10 sm:w-12 sm:h-12';
  
  // Calculate dynamic text size classes and font styling to auto-scale inside navigation bars
  const getTextSize = () => {
    if (size === 'sm') return 'text-base sm:text-lg';
    if (size === 'lg') return 'text-xl sm:text-2xl lg:text-3xl';
    // md default: auto scale responsively and scale down for long site names
    if (siteName.length > 20) return 'text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl';
    if (siteName.length > 14) return 'text-base xs:text-lg sm:text-xl md:text-2xl';
    return 'text-lg xs:text-xl sm:text-2xl';
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none group cursor-pointer max-w-full min-w-0">
      <div 
        className={`relative shrink-0 flex items-center justify-center rounded-2xl p-1.5 sm:p-2 transition-all duration-300 group-hover:scale-105 ${
          isLight
            ? 'bg-slate-900/50 border border-white/15 shadow-md'
            : isDark
            ? 'bg-[#002b29] border border-emerald-800/60 shadow-lg shadow-[#002b29]/50'
            : 'bg-[#002b29] border border-emerald-700/50 shadow-xl shadow-[#002b29]/60'
        }`}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className={`${iconSizeClass} object-contain rounded-xl`} />
        ) : (
          <BkrShieldIcon sizeClass={iconSizeClass} isLight={isLight} />
        )}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-cyan-400 shadow-sm shadow-cyan-300"></span>
        </span>
      </div>

      <div className="flex flex-col min-w-0 justify-center">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`font-black tracking-tight font-sans ${getTextSize()} text-white drop-shadow-sm whitespace-nowrap truncate`}>
            {siteName}
          </span>
        </div>
        {showTagline && (
          <span className={`text-[9px] sm:text-[10px] tracking-widest uppercase font-bold truncate ${
            isLight ? 'text-cyan-200/90' : 'text-slate-400'
          }`}>
            Analytical Compounds & Certified Standards
          </span>
        )}
      </div>
    </div>
  );
};

