/**
 * Google Translate & Localization Integration Library
 * Provides hybrid client-side Google Translate Element injection,
 * cookie-based auto-translation synchronization, SEO hreflang header management,
 * and backend Google Cloud Translation API proxy calling.
 */

import { SiteSettings, CustomPage, PageTranslationRule, ProductDescriptionTranslationConfig } from '../types';

export interface GoogleLanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  popular?: boolean;
}

export const GOOGLE_SUPPORTED_LANGUAGES: GoogleLanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', dir: 'ltr', popular: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr', popular: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', popular: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr', popular: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr', popular: true },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr', popular: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl', popular: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr', popular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr', popular: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr', popular: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr', popular: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr', popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr', popular: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', dir: 'ltr' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', dir: 'ltr' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', dir: 'ltr' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr' },
  { code: 'fil', name: 'Filipino', nativeName: 'Tagalog', flag: '🇵🇭', dir: 'ltr' }
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
    __googleTranslateInitialized?: boolean;
    __googleTranslateLoading?: boolean;
  }
}

// In-memory translation cache to save requests
const translationCache = new Map<string, string>();

/**
 * Retrieves the language info object for a given language code
 */
export function getLanguageInfo(code: string): GoogleLanguageInfo {
  const norm = (code || 'en').toLowerCase().split('-')[0];
  const found = GOOGLE_SUPPORTED_LANGUAGES.find(l => l.code === norm || l.code === code);
  return found || {
    code,
    name: code.toUpperCase(),
    nativeName: code.toUpperCase(),
    flag: '🌐',
    dir: code === 'ar' || code === 'he' || code === 'fa' || code === 'ur' ? 'rtl' : 'ltr'
  };
}

/**
 * Sets the Google Translate cookie (googtrans) with cross-subdomain and root path scope
 */
export function setGoogleTranslateCookie(targetLang: string) {
  try {
    const lang = (targetLang || 'en').toLowerCase();
    const cookieVal = lang === 'en' ? '' : `/auto/${lang}`;
    const expires = lang === 'en' ? 'Thu, 01 Jan 1970 00:00:00 UTC' : new Date(Date.now() + 365 * 86400000).toUTCString();

    const host = window.location.hostname;
    const isLocalhost = host === 'localhost' || host === '127.0.0.1';

    // Set for root path
    document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/; SameSite=Lax`;

    // Also set /en/${lang} format used by some widget variations
    if (lang !== 'en') {
      document.cookie = `googtrans=/en/${lang}; expires=${expires}; path=/; SameSite=Lax`;
    }

    if (!isLocalhost && host.includes('.')) {
      // Set for domain root
      const rootDomain = host.split('.').slice(-2).join('.');
      document.cookie = `googtrans=${cookieVal}; expires=${expires}; domain=.${rootDomain}; path=/; SameSite=Lax`;
    }

    localStorage.setItem('bkrl_user_language', lang);
    localStorage.setItem('googtrans', `/auto/${lang}`);
  } catch (e) {
    console.warn('Could not set Google Translate cookie:', e);
  }
}

/**
 * Retrieves the currently selected language from localStorage or cookies
 */
export function getSavedLanguage(): string {
  try {
    const stored = localStorage.getItem('bkrl_user_language');
    if (stored) return stored.toLowerCase();

    // Check googtrans cookie
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (match && match[1]) {
      const parts = match[1].split('/');
      const code = parts[parts.length - 1];
      if (code && code !== 'en' && code !== 'auto') {
        return code.toLowerCase();
      }
    }
  } catch (e) {}
  return 'en';
}

/**
 * Injects anti-branding and anti-layout-shift (anti-CLS) styles for Google Translate
 */
export function injectGoogleTranslateStyles() {
  if (typeof document === 'undefined') return;
  const styleId = 'google-translate-anti-branding-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    /* ==========================================================================
       GOOGLE TRANSLATE ANTI-BRANDING & ZERO-CLS FIXES
       Prevents layout shift, banner insertion, tooltips and frame shifts
       ========================================================================== */
    
    /* Lock body position so Google Translate never pushes content down by 40px */
    body {
      top: 0 !important;
      position: static !important;
      min-height: 100vh !important;
    }

    /* Completely hide top banner iframe and attribution bars */
    .goog-te-banner-frame,
    .goog-te-banner-frame.skiptranslate,
    iframe.goog-te-banner-frame,
    .goog-te-gadget-icon,
    #goog-gt-tt,
    .goog-te-balloon-frame,
    .goog-tooltip,
    .goog-tooltip:hover,
    .goog-text-highlight {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      border: 0 !important;
      pointer-events: none !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    /* Hide raw default gadget UI container */
    #google_translate_element {
      display: none !important;
    }

    .goog-te-gadget {
      font-size: 0px !important;
      color: transparent !important;
    }

    .goog-te-gadget .goog-te-combo {
      display: none !important;
    }

    /* Prevent text highlight flicker during dynamic DOM mutations */
    font[style*="background-color"] {
      background-color: transparent !important;
      box-shadow: none !important;
    }

    /* Scientific Exclusion Class Protection */
    .notranslate,
    [translate="no"] {
      -webkit-user-select: text;
      user-select: text;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initializes Google Translate Element Widget asynchronously
 */
export function initGoogleTranslateWidget(containerId = 'google_translate_element', onReady?: () => void) {
  if (typeof window === 'undefined') return;

  injectGoogleTranslateStyles();

  // Ensure hidden container exists in DOM
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  // Define global init callback
  window.googleTranslateElementInit = () => {
    try {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: GOOGLE_SUPPORTED_LANGUAGES.map(l => l.code).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          containerId
        );
        window.__googleTranslateInitialized = true;
        window.__googleTranslateLoading = false;
        onReady?.();
      }
    } catch (err) {
      console.warn('Google Translate Element initialization notice:', err);
    }
  };

  // If already loaded, trigger callback
  if (window.google && window.google.translate) {
    window.googleTranslateElementInit();
    return;
  }

  // Asynchronously inject script once
  if (!document.getElementById('google-translate-sdk-script')) {
    window.__googleTranslateLoading = true;
    const script = document.createElement('script');
    script.id = 'google-translate-sdk-script';
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.onerror = () => {
      window.__googleTranslateLoading = false;
      console.warn('Google Translate SDK script failed to load (offline or ad-blocker). Using API/Dictionary fallback.');
    };
    document.body.appendChild(script);
  }
}

/**
 * Changes active language on page via Google Translate widget combo or cookie reload
 */
export function changeGoogleTranslateLanguage(targetLang: string) {
  const lang = (targetLang || 'en').toLowerCase();
  setGoogleTranslateCookie(lang);

  // Update document attributes for accessibility & SEO
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr';

  // Synchronize SEO hreflang tags
  syncSeoHreflangTags(lang);

  // Try to find the Google Translate hidden select box in DOM
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // If widget combo is not found, dispatch event
    try {
      window.dispatchEvent(new CustomEvent('bkrl_google_translate_change', { detail: { language: lang } }));
    } catch (e) {}
  }
}

/**
 * Synchronizes <link rel="alternate" hreflang="..."> tags in document head according to Google SEO guidelines
 */
export function syncSeoHreflangTags(currentLang = 'en', baseUrl?: string) {
  if (typeof document === 'undefined') return;

  const url = baseUrl || (window.location.origin + window.location.pathname);

  // Remove existing dynamic hreflang tags
  document.querySelectorAll('link[data-bkr-hreflang]').forEach(el => el.remove());

  // Add x-default hreflang pointing to canonical english
  const xDefault = document.createElement('link');
  xDefault.rel = 'alternate';
  xDefault.hreflang = 'x-default';
  xDefault.href = `${url}?lang=en`;
  xDefault.setAttribute('data-bkr-hreflang', 'true');
  document.head.appendChild(xDefault);

  // Add hreflang for top international languages
  const topCodes = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ar', 'ru', 'pt', 'it', 'ko', 'nl', 'hi'];
  topCodes.forEach(code => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = code;
    link.href = `${url}?lang=${code}`;
    link.setAttribute('data-bkr-hreflang', 'true');
    document.head.appendChild(link);
  });
}

/**
 * Automatically applies .notranslate and translate="no" to scientific, chemical, and brand identifiers
 */
export function applyNoTranslateExclusions() {
  if (typeof document === 'undefined') return;

  // Protect brand identifiers
  document.querySelectorAll('.brand-name, .brand-logo, [data-brand]').forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });

  // Protect CAS Numbers (e.g. CAS: 137525-51-0)
  document.querySelectorAll('.cas-number, [data-cas]').forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });

  // Protect Chemical Formulas, HPLC batch serials, and SHA-256 hashes
  document.querySelectorAll('.chemical-formula, .batch-code, .sha256-hash, .currency-amount').forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });
}

/**
 * Programmatic translation API via backend `/api/translate`
 */
export async function translateTextViaApi(
  text: string,
  targetLang: string,
  sourceLang = 'en'
): Promise<{ translatedText: string; engine: string }> {
  if (!text || !text.trim() || targetLang === sourceLang) {
    return { translatedText: text, engine: 'bypass' };
  }

  const cacheKey = `${sourceLang}:${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return { translatedText: translationCache.get(cacheKey)!, engine: 'cache' };
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.translatedText || text;
    translationCache.set(cacheKey, result);
    return { translatedText: result, engine: data.engine || 'google_cloud' };
  } catch (err) {
    console.warn('Backend translation proxy notice:', err);
    return { translatedText: text, engine: 'fallback_original' };
  }
}

/**
 * Programmatic batch translation API via backend `/api/translate`
 */
export async function translateBatchViaApi(
  texts: string[],
  targetLang: string,
  sourceLang = 'en'
): Promise<{ translatedTexts: string[]; engine: string }> {
  if (!texts || texts.length === 0 || targetLang === sourceLang) {
    return { translatedTexts: texts, engine: 'bypass' };
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texts,
        targetLang,
        sourceLang
      })
    });

    if (!response.ok) {
      throw new Error(`Batch translation API error status: ${response.status}`);
    }

    const data = await response.json();
    return { translatedTexts: data.translatedTexts || texts, engine: data.engine || 'google_cloud' };
  } catch (err) {
    console.warn('Backend batch translation proxy notice:', err);
    return { translatedTexts: texts, engine: 'fallback_original' };
  }
}

/**
 * Standard default page-level translation rules for laboratory content preservation
 */
export const DEFAULT_PAGE_TRANSLATION_RULES: PageTranslationRule[] = [
  {
    page_slug: 'coa-verification',
    page_title: 'HPLC & LC-MS CoA Verification Portal',
    translate_enabled: false, // Keep original scientific laboratory language
    preserve_scientific_blocks: true,
    category: 'scientific',
    notes: 'Preserves analytical chromatograms, molecular weights, and purity benchmarks.'
  },
  {
    page_slug: 'peptide-handling-guide',
    page_title: 'Cold-Chain & Reconstitution Protocols',
    translate_enabled: false, // Keep laboratory precision
    preserve_scientific_blocks: true,
    category: 'protocol',
    notes: 'Maintains exact cryogenic temperature guidelines and molarity formulas.'
  },
  {
    page_slug: 'research-use-only-disclaimer',
    page_title: 'RUO Compliance & Statutory Notice',
    translate_enabled: false, // Keep exact legal language
    preserve_scientific_blocks: true,
    category: 'legal',
    notes: 'Prevents translation distortion of mandatory 21 CFR regulatory language.'
  },
  {
    page_slug: 'quality-assurance',
    page_title: 'ISO 9001 & ISO 17025 Quality Standards',
    translate_enabled: true,
    preserve_scientific_blocks: true,
    category: 'scientific',
    notes: 'Translates overview text while preserving specific ISO clauses and CAS references.'
  },
  {
    page_slug: 'about-bk-research-labs',
    page_title: 'About BK Research Labs',
    translate_enabled: true,
    preserve_scientific_blocks: false,
    category: 'general',
    notes: 'Standard public company introduction.'
  }
];

export const DEFAULT_PRODUCT_DESCRIPTION_RULES: ProductDescriptionTranslationConfig = {
  auto_translate_overview: true,
  preserve_chemical_nomenclature: true,
  preserve_coa_specifications: true,
  preserve_legal_disclaimers: true,
  preserve_handling_protocols: true,
  excluded_product_ids: []
};

/**
 * Checks whether a specific custom CMS page should be auto-translated or kept in original laboratory language
 */
export function isPageTranslationEnabled(
  pageSlug: string,
  settings?: SiteSettings | null,
  page?: CustomPage | null
): boolean {
  // If page itself has explicit translate_enabled flag defined
  if (page && typeof page.translate_enabled === 'boolean') {
    return page.translate_enabled;
  }

  // Check global Google Translate configuration rules
  const rules = settings?.google_services?.translate?.page_translation_rules;
  if (rules && rules.length > 0) {
    const matched = rules.find(r => r.page_slug === pageSlug || (page?.id && r.page_id === page.id));
    if (matched && typeof matched.translate_enabled === 'boolean') {
      return matched.translate_enabled;
    }
  }

  // Fallback to default rule table
  const defaultRule = DEFAULT_PAGE_TRANSLATION_RULES.find(r => r.page_slug === pageSlug);
  if (defaultRule) {
    return defaultRule.translate_enabled;
  }

  // Default to true (auto-translate)
  return true;
}

/**
 * Checks whether a specific product description block or specification should be protected from automated translation
 */
export function shouldPreserveProductBlock(
  blockType: 'chemical_nomenclature' | 'coa_specifications' | 'legal_disclaimers' | 'handling_protocols' | 'overview',
  productId?: string,
  settings?: SiteSettings | null
): boolean {
  const rules = settings?.google_services?.translate?.product_description_rules || DEFAULT_PRODUCT_DESCRIPTION_RULES;

  // Check if product is globally excluded from translation
  if (productId && rules.excluded_product_ids?.includes(productId)) {
    return true; // Preserve 100% of this product in original laboratory language
  }

  switch (blockType) {
    case 'overview':
      return !rules.auto_translate_overview;
    case 'chemical_nomenclature':
      return rules.preserve_chemical_nomenclature ?? true;
    case 'coa_specifications':
      return rules.preserve_coa_specifications ?? true;
    case 'legal_disclaimers':
      return rules.preserve_legal_disclaimers ?? true;
    case 'handling_protocols':
      return rules.preserve_handling_protocols ?? true;
    default:
      return false;
  }
}

