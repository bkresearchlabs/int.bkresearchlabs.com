import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, Search, Check, ChevronDown, RotateCcw, Sparkles, X, Languages, ShieldCheck } from 'lucide-react';
import {
  GOOGLE_SUPPORTED_LANGUAGES,
  GoogleLanguageInfo,
  getLanguageInfo,
  changeGoogleTranslateLanguage,
  getSavedLanguage
} from '../../lib/googleTranslate';
import { useLanguage } from '../../lib/i18n';
import { LanguageCode } from '../../types';

interface GoogleLanguageSwitcherProps {
  currentLang?: LanguageCode;
  onSelectLang?: (lang: LanguageCode) => void;
  variant?: 'header' | 'footer' | 'minimal' | 'card';
  showLabel?: boolean;
  className?: string;
}

export const GoogleLanguageSwitcher: React.FC<GoogleLanguageSwitcherProps> = ({
  currentLang,
  onSelectLang,
  variant = 'header',
  showLabel = true,
  className = ''
}) => {
  const { language, setLanguage } = useLanguage();
  const activeCode = (currentLang || language || getSavedLanguage() || 'en') as string;
  const currentLangInfo = useMemo(() => getLanguageInfo(activeCode), [activeCode]);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelectLanguage = (langInfo: GoogleLanguageInfo) => {
    setIsTranslating(true);
    const code = langInfo.code as LanguageCode;

    if (onSelectLang) {
      onSelectLang(code);
    }
    setLanguage(code);
    changeGoogleTranslateLanguage(code);

    setTimeout(() => {
      setIsTranslating(false);
      setIsOpen(false);
    }, 250);
  };

  const handleResetToEnglish = () => {
    const enInfo = getLanguageInfo('en');
    handleSelectLanguage(enInfo);
  };

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return GOOGLE_SUPPORTED_LANGUAGES;
    }
    const q = searchQuery.toLowerCase().trim();
    return GOOGLE_SUPPORTED_LANGUAGES.filter(
      l =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const popularLanguages = useMemo(
    () => GOOGLE_SUPPORTED_LANGUAGES.filter(l => l.popular),
    []
  );

  return (
    <div
      ref={dropdownRef}
      id="google-language-switcher"
      className={`relative inline-block notranslate ${className}`}
      translate="no"
    >
      {/* Trigger Button */}
      {variant === 'minimal' ? (
        <button
          type="button"
          id="btn-google-lang-minimal"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Select language. Current: ${currentLangInfo.name}`}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
          title={`Language: ${currentLangInfo.nativeName} (${currentLangInfo.name})`}
        >
          <span className="text-base leading-none">{currentLangInfo.flag}</span>
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      ) : variant === 'footer' ? (
        <button
          type="button"
          id="btn-google-lang-footer"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-white/10 text-xs font-medium transition-all shadow-xs cursor-pointer"
        >
          <span className="text-base">{currentLangInfo.flag}</span>
          <span>{currentLangInfo.nativeName}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        /* Header Default Pill */
        <button
          type="button"
          id="header-language-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Change language. Current: ${currentLangInfo.name}`}
          className={`group px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
            isOpen
              ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md shadow-emerald-950/50'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40'
          }`}
          title={`Active Language: ${currentLangInfo.nativeName} (${currentLangInfo.name}) — Google Translate`}
        >
          <span className="text-sm leading-none">{currentLangInfo.flag}</span>
          <Globe className={`w-3.5 h-3.5 transition-colors ${isOpen || activeCode !== 'en' ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
          {showLabel && (
            <span className="font-mono uppercase tracking-wider text-[11px]">
              {currentLangInfo.code}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
        </button>
      )}

      {/* Popover Language Dropdown */}
      {isOpen && (
        <div
          id="google-lang-dropdown-menu"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#090e0d] border border-emerald-500/30 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="p-3.5 pb-2.5 border-b border-white/10 bg-emerald-950/30">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Languages className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Google Translate</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-mono">
                      Cloud AI
                    </span>
                  </h3>
                </div>
              </div>

              {activeCode !== 'en' && (
                <button
                  type="button"
                  onClick={handleResetToEnglish}
                  className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-emerald-300 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset to English</span>
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                id="input-search-language"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search 30+ languages (e.g. Spanish, 日本語, Arabic)..."
                className="w-full pl-9 pr-8 py-1.5 bg-black/40 border border-white/10 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Popular Languages Chips */}
          {!searchQuery && (
            <div className="p-3 pb-2 border-b border-white/5 bg-black/20">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                Popular Regional Languages
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularLanguages.map(lang => {
                  const isSelected = activeCode === lang.code;
                  return (
                    <button
                      key={`pop-${lang.code}`}
                      type="button"
                      onClick={() => handleSelectLanguage(lang)}
                      className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                      }`}
                    >
                      <span className="text-xs">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Language List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5 p-1">
            {filteredLanguages.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No matching languages found for "{searchQuery}"
              </div>
            ) : (
              filteredLanguages.map(lang => {
                const isSelected = activeCode === lang.code;
                return (
                  <button
                    key={lang.code}
                    id={`lang-option-${lang.code}`}
                    type="button"
                    onClick={() => handleSelectLanguage(lang)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg leading-none shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate flex items-center gap-1.5">
                          <span>{lang.nativeName}</span>
                          {lang.dir === 'rtl' && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                              RTL
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {lang.name} <span className="text-slate-500 font-mono text-[10px]">({lang.code})</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 px-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO 17025 Scientific terms preserved</span>
            </div>
            <div className="font-mono text-emerald-400 font-bold">
              {isTranslating ? 'Translating...' : `${GOOGLE_SUPPORTED_LANGUAGES.length} Languages`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
