import { LanguageCode } from '../types';
import { TRANSLATIONS, PHRASE_DICTIONARY, getTranslation } from './i18n';

export type UiElementType =
  | 'button'
  | 'heading'
  | 'input'
  | 'badge'
  | 'disclaimer'
  | 'tab'
  | 'modal'
  | 'label'
  | 'toast'
  | 'link'
  | 'card';

export type ComponentCategory =
  | 'storefront'
  | 'checkout'
  | 'customer_portal'
  | 'admin_system'
  | 'modals_popups';

export type TranslationAuditStatus =
  | 'localized'          // Direct key translation found in language dictionary
  | 'phrase_match'       // Found via phrase dictionary matching
  | 'missing_fallback'   // Missing in target language, falling back to English
  | 'untranslated_raw';  // Raw key or completely missing

export type AuditSeverity = 'CRITICAL_PATH' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface UiElementDefinition {
  id: string;
  name: string;
  type: UiElementType;
  key: string;
  defaultEn: string;
  domSelector?: string;
  severity: AuditSeverity;
  context: string;
  interpolations?: string[];
}

export interface UiComponentDefinition {
  id: string;
  name: string;
  filePath: string;
  category: ComponentCategory;
  description: string;
  elements: UiElementDefinition[];
}

export interface ElementAuditResult {
  elementId: string;
  elementName: string;
  componentId: string;
  componentName: string;
  componentCategory: ComponentCategory;
  filePath: string;
  type: UiElementType;
  key: string;
  defaultEn: string;
  translatedValue: string;
  status: TranslationAuditStatus;
  severity: AuditSeverity;
  domSelector?: string;
  context: string;
  matchType: 'direct_key' | 'phrase_dict' | 'fallback_en' | 'untranslated';
  direction: 'ltr' | 'rtl';
}

export interface ComponentAuditSummary {
  componentId: string;
  name: string;
  category: ComponentCategory;
  filePath: string;
  description: string;
  totalElements: number;
  localizedCount: number;
  missingCount: number;
  coveragePercentage: number;
  criticalPathCoveragePercentage: number;
  elements: ElementAuditResult[];
}

export interface MissingKeyAuditLogEntry {
  id: string;
  timestamp: string;
  key: string;
  componentId: string;
  componentName: string;
  elementName: string;
  filePath: string;
  severity: AuditSeverity;
  defaultEn: string;
  targetLang: LanguageCode;
  reason: string;
  suggestedTranslation?: string;
  resolutionStatus: 'unresolved' | 'resolved_session' | 'ignored';
  resolvedValue?: string;
}

export interface LanguageCoverageReport {
  language: LanguageCode;
  languageName: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
  totalComponents: number;
  totalElements: number;
  localizedElements: number;
  missingElements: number;
  coverageScore: number;
  criticalPathScore: number;
  categoryBreakdown: Record<ComponentCategory, { total: number; localized: number; percentage: number }>;
  components: ComponentAuditSummary[];
  missingAuditLogs: MissingKeyAuditLogEntry[];
  auditTimestamp: string;
}

export interface SupportedLanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  isDictBuiltIn: boolean;
}

export const SUPPORTED_LANGUAGES_REGISTRY: SupportedLanguageMeta[] = [
  { code: 'en', name: 'English (US)', nativeName: 'English', flag: '🇺🇸', direction: 'ltr', isDictBuiltIn: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', isDictBuiltIn: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr', isDictBuiltIn: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr', isDictBuiltIn: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr', isDictBuiltIn: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr', isDictBuiltIn: false },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', direction: 'ltr', isDictBuiltIn: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr', isDictBuiltIn: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', direction: 'ltr', isDictBuiltIn: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr', isDictBuiltIn: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', direction: 'ltr', isDictBuiltIn: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', direction: 'ltr', isDictBuiltIn: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', direction: 'ltr', isDictBuiltIn: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', direction: 'ltr', isDictBuiltIn: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr', isDictBuiltIn: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', direction: 'ltr', isDictBuiltIn: false },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', direction: 'ltr', isDictBuiltIn: false },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', direction: 'ltr', isDictBuiltIn: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', direction: 'ltr', isDictBuiltIn: false },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', direction: 'rtl', isDictBuiltIn: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', direction: 'ltr', isDictBuiltIn: false },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', direction: 'ltr', isDictBuiltIn: false },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', direction: 'ltr', isDictBuiltIn: false },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', direction: 'ltr', isDictBuiltIn: false },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', direction: 'ltr', isDictBuiltIn: false },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', direction: 'ltr', isDictBuiltIn: false },
];

export const APPLICATION_COMPONENTS_REGISTRY: UiComponentDefinition[] = [
  // 1. STOREFRONT COMPONENTS
  {
    id: 'Header',
    name: 'Header & Navigation Bar',
    filePath: 'src/components/common/Header.tsx',
    category: 'storefront',
    description: 'Top persistent navbar with primary links, search trigger, cart badge, language switcher, and authentication',
    elements: [
      { id: 'nav-home', name: 'Home Nav Link', type: 'link', key: 'nav.home', defaultEn: 'Home', domSelector: '#nav-link-home', severity: 'HIGH', context: 'Top navbar link to main storefront' },
      { id: 'nav-shop', name: 'Shop Nav Link', type: 'link', key: 'nav.shop', defaultEn: 'Shop', domSelector: '#nav-link-shop', severity: 'HIGH', context: 'Top navbar catalog browser' },
      { id: 'nav-categories', name: 'Categories Nav Link', type: 'link', key: 'nav.categories', defaultEn: 'Categories', domSelector: '#nav-link-categories', severity: 'MEDIUM', context: 'Top navbar categories modal' },
      { id: 'nav-sfl', name: 'Save for Later Nav Link', type: 'link', key: 'nav.save_for_later', defaultEn: 'Save for Later', domSelector: '#nav-link-sfl', severity: 'MEDIUM', context: 'Customer saved items list' },
      { id: 'nav-orders', name: 'Orders & COAs Nav Link', type: 'link', key: 'nav.orders', defaultEn: 'Orders & COAs', domSelector: '#nav-link-orders', severity: 'HIGH', context: 'Customer order history & COA vault' },
      { id: 'nav-guide', name: 'User Guide Nav Link', type: 'link', key: 'nav.guide', defaultEn: 'User Guide', domSelector: '#nav-link-guide', severity: 'LOW', context: 'Laboratory documentation guide' },
      { id: 'nav-search-input', name: 'Global Search Placeholder', type: 'input', key: 'nav.search_placeholder', defaultEn: 'Search products, COAs, categories, CAS...', domSelector: '#header-search-bar', severity: 'HIGH', context: 'Input search bar placeholder text' },
      { id: 'nav-cart-btn', name: 'Cart Drawer Button', type: 'button', key: 'nav.cart', defaultEn: 'Cart', domSelector: '#header-cart-btn', severity: 'CRITICAL_PATH', context: 'Header cart pill button with badge' },
      { id: 'nav-signin-btn', name: 'Sign In / Register Button', type: 'button', key: 'nav.sign_in', defaultEn: 'Sign In / Register', domSelector: '#header-signin-btn', severity: 'CRITICAL_PATH', context: 'Auth modal launcher' },
      { id: 'nav-admin-btn', name: 'Admin Portal Link', type: 'link', key: 'nav.admin_panel', defaultEn: 'Admin Portal', domSelector: '#header-admin-link', severity: 'MEDIUM', context: 'Direct staff gateway' },
      { id: 'nav-qr-app', name: 'Mobile Apps & QR Link', type: 'link', key: 'nav.qr_app', defaultEn: 'Mobile Apps & QR', domSelector: '#header-qr-btn', severity: 'LOW', context: 'Mobile release & QR popup' },
    ]
  },
  {
    id: 'HeroSection',
    name: 'Homepage Hero & ISO Guarantee Banner',
    filePath: 'src/App.tsx',
    category: 'storefront',
    description: 'Promotional research hero banner with purity statistics, ISO 17025 verification, and primary CTAs',
    elements: [
      { id: 'hero-badge', name: 'ISO 17025 Certification Badge', type: 'badge', key: 'hero.badge', defaultEn: 'ISO 17025 Certified Reference Standards', domSelector: '#hero-iso-badge', severity: 'HIGH', context: 'Upper eyebrow badge on hero banner' },
      { id: 'hero-title', name: 'Hero Main Headline', type: 'heading', key: 'hero.title', defaultEn: 'Precision Chemical Standards for In Vitro Laboratory Research', domSelector: '#hero-main-title', severity: 'HIGH', context: 'Main H1 hero display headline' },
      { id: 'hero-subtitle', name: 'Hero Research Subtitle', type: 'label', key: 'hero.subtitle', defaultEn: 'Dual-stage HPLC verified compounds, molecular standards, and analytical chemicals supplied directly to authorized research facilities worldwide.', domSelector: '#hero-subtitle', severity: 'HIGH', context: 'Descriptive mission statement paragraph' },
      { id: 'hero-cta-primary', name: 'Explore Catalog CTA Button', type: 'button', key: 'hero.primary_cta', defaultEn: 'Explore Research Catalog', domSelector: '#hero-primary-cta', severity: 'HIGH', context: 'Primary emerald CTA button' },
      { id: 'hero-cta-secondary', name: 'View Guarantees CTA Button', type: 'button', key: 'hero.secondary_cta', defaultEn: 'View Quality Guarantees', domSelector: '#hero-secondary-cta', severity: 'MEDIUM', context: 'Secondary outline CTA button' },
      { id: 'hero-stat-purity', name: 'HPLC Purity Stat Metric', type: 'badge', key: 'hero.stat_purity', defaultEn: '99.8%+ Purity', domSelector: '#hero-stat-purity-label', severity: 'MEDIUM', context: 'Key metric badge on hero card' },
      { id: 'hero-stat-shipping', name: 'Fast Priority Shipping Stat', type: 'badge', key: 'hero.stat_shipping', defaultEn: 'Fast Priority 1-3 Day', domSelector: '#hero-stat-shipping-label', severity: 'MEDIUM', context: 'Delivery guarantee metric' },
      { id: 'hero-stat-coa', name: 'Lot-Specific CoA Stat', type: 'badge', key: 'hero.stat_coa', defaultEn: 'Lot-Specific CoA', domSelector: '#hero-stat-coa-label', severity: 'MEDIUM', context: 'Certificate guarantee metric' },
    ]
  },
  {
    id: 'ProductCard',
    name: 'Product Card & Quick Actions',
    filePath: 'src/components/store/ProductCard.tsx',
    category: 'storefront',
    description: 'Catalog product card showing purity, CoA badge, SKU, quick view, save-for-later, and cart button',
    elements: [
      { id: 'card-featured-badge', name: 'Featured Standard Badge', type: 'badge', key: 'product.featured', defaultEn: 'Featured Standard', domSelector: '.product-badge-featured', severity: 'LOW', context: 'Badge on highlighted items' },
      { id: 'card-coa-badge', name: 'CoA Verified Badge', type: 'badge', key: 'product.coa_verified', defaultEn: 'CoA Verified', domSelector: '.product-badge-coa', severity: 'HIGH', context: 'Verification badge on catalog cards' },
      { id: 'card-quick-view', name: 'Quick View Button', type: 'button', key: 'product.quick_view', defaultEn: 'Quick View', domSelector: '.product-btn-quickview', severity: 'MEDIUM', context: 'Hover overlay quick view button' },
      { id: 'card-add-cart', name: 'Add to Cart Button', type: 'button', key: 'product.add_to_cart', defaultEn: 'Add to Cart', domSelector: '.product-btn-addcart', severity: 'CRITICAL_PATH', context: 'Direct cart placement button' },
      { id: 'card-sfl-btn', name: 'Save for Later Toggle', type: 'button', key: 'product.save_for_later', defaultEn: 'Save for Later', domSelector: '.product-btn-sfl', severity: 'MEDIUM', context: 'Bookmark heart icon button' },
      { id: 'card-in-stock', name: 'In Stock Pill', type: 'badge', key: 'product.in_stock', defaultEn: 'In Stock', domSelector: '.product-badge-stock', severity: 'HIGH', context: 'Available inventory status' },
      { id: 'card-out-of-stock', name: 'Out of Stock Pill', type: 'badge', key: 'product.out_of_stock', defaultEn: 'Out of Stock', domSelector: '.product-badge-outofstock', severity: 'HIGH', context: 'Unavailable inventory badge' },
      { id: 'card-age-required', name: '21+ Verification Required', type: 'badge', key: 'product.age_required', defaultEn: '21+ Required', domSelector: '.product-badge-age', severity: 'HIGH', context: 'Compliance restriction label' },
    ]
  },
  {
    id: 'ProductFilter',
    name: 'Product Catalog Filter & Sorter',
    filePath: 'src/components/store/ProductFilter.tsx',
    category: 'storefront',
    description: 'Catalog control bar with categories, sort dropdowns, in-stock toggle, and reset buttons',
    elements: [
      { id: 'filter-heading', name: 'Catalog Filters Title', type: 'heading', key: 'filter.title', defaultEn: 'Catalog Filters', domSelector: '#filter-header-title', severity: 'MEDIUM', context: 'Filter sidebar/bar title' },
      { id: 'filter-reset', name: 'Reset Filters Button', type: 'button', key: 'filter.reset', defaultEn: 'Reset Filters', domSelector: '#filter-reset-btn', severity: 'MEDIUM', context: 'Clear all active filters' },
      { id: 'filter-all-products', name: 'All Products Option', type: 'label', key: 'filter.all_products', defaultEn: 'All Products', domSelector: '#filter-category-all', severity: 'MEDIUM', context: 'Show complete unsegmented catalog' },
      { id: 'filter-sort-featured', name: 'Sort: Featured Standards', type: 'label', key: 'filter.sort_featured', defaultEn: 'Featured Standards', domSelector: '#sort-opt-featured', severity: 'LOW', context: 'Default catalog sort order' },
      { id: 'filter-sort-price-asc', name: 'Sort: Price Low to High', type: 'label', key: 'filter.sort_price_asc', defaultEn: 'Price: Low to High', domSelector: '#sort-opt-price-asc', severity: 'LOW', context: 'Ascending price order' },
      { id: 'filter-sort-price-desc', name: 'Sort: Price High to Low', type: 'label', key: 'filter.sort_price_desc', defaultEn: 'Price: High to Low', domSelector: '#sort-opt-price-desc', severity: 'LOW', context: 'Descending price order' },
      { id: 'filter-in-stock-only', name: 'In-Stock Only Filter Toggle', type: 'label', key: 'filter.in_stock_only', defaultEn: 'In-Stock Only', domSelector: '#filter-instock-toggle', severity: 'MEDIUM', context: 'Checkbox to filter available items' },
    ]
  },
  {
    id: 'ProductDetailsModal',
    name: 'Product Details & CoA Dossier Modal',
    filePath: 'src/components/store/ProductDetailsModal.tsx',
    category: 'storefront',
    description: 'Comprehensive chemical dossier modal with HPLC data, CAS number, compliance checkbox, and ordering',
    elements: [
      { id: 'details-specs-title', name: 'Chemical Specifications Heading', type: 'heading', key: 'details.chemical_specs', defaultEn: 'Chemical Specifications', domSelector: '#details-specs-heading', severity: 'HIGH', context: 'Header for CAS/Formula/Purity box' },
      { id: 'details-compliance-ack', name: 'Research Compliance Acknowledgment', type: 'disclaimer', key: 'details.compliance_ack', defaultEn: 'I confirm that this purchase is strictly intended for scientific laboratory research and in vitro testing.', domSelector: '#details-compliance-checkbox-label', severity: 'CRITICAL_PATH', context: 'Mandatory checkout checkbox' },
      { id: 'details-download-coa', name: 'Download Verified CoA Button', type: 'button', key: 'details.download_coa', defaultEn: 'Download Verified CoA', domSelector: '#details-coa-download-btn', severity: 'HIGH', context: 'Lot-specific PDF download link' },
      { id: 'details-add-cart-btn', name: 'Add to Research Order Button', type: 'button', key: 'details.add_cart_btn', defaultEn: 'Add to Research Order', domSelector: '#details-add-cart-btn', severity: 'CRITICAL_PATH', context: 'Primary order action in modal' },
      { id: 'details-disclaimer-title', name: 'Laboratory Use Only Heading', type: 'heading', key: 'details.disclaimer_title', defaultEn: 'Laboratory Research Use Only', domSelector: '#details-legal-title', severity: 'CRITICAL_PATH', context: 'Regulatory notice header' },
      { id: 'details-disclaimer-text', name: 'Laboratory Regulatory Notice Text', type: 'disclaimer', key: 'details.disclaimer_text', defaultEn: 'All chemical compounds and analytical reference materials supplied by BK Research Labs are intended strictly for in vitro laboratory analysis and research purposes. Not for human, veterinary, or household consumption.', domSelector: '#details-legal-notice', severity: 'CRITICAL_PATH', context: 'Full mandatory legal disclaimer' },
    ]
  },
  {
    id: 'CartDrawer',
    name: 'Cart Drawer & Express Shipping Meter',
    filePath: 'src/components/store/CartDrawer.tsx',
    category: 'storefront',
    description: 'Slide-out cart drawer with live subtotal calculation, threshold progress, and checkout gateway',
    elements: [
      { id: 'cart-title', name: 'Research Cart Title', type: 'heading', key: 'cart.title', defaultEn: 'Research Cart', domSelector: '#cart-drawer-title', severity: 'HIGH', context: 'Slide-out cart drawer header' },
      { id: 'cart-empty-title', name: 'Empty Cart Heading', type: 'heading', key: 'cart.empty_title', defaultEn: 'Your Cart is Empty', domSelector: '#cart-empty-state-title', severity: 'MEDIUM', context: 'Empty cart banner title' },
      { id: 'cart-free-shipping-qual', name: 'Free Express Shipping Qualified', type: 'badge', key: 'cart.free_shipping_qualified', defaultEn: '🎉 You qualify for FREE Express Shipping!', domSelector: '#cart-free-ship-banner', severity: 'MEDIUM', context: 'Shipping discount threshold achieved' },
      { id: 'cart-subtotal', name: 'Cart Subtotal Label', type: 'label', key: 'cart.subtotal', defaultEn: 'Subtotal', domSelector: '#cart-subtotal-label', severity: 'CRITICAL_PATH', context: 'Calculated items subtotal' },
      { id: 'cart-shipping', name: 'Estimated Shipping Label', type: 'label', key: 'cart.shipping', defaultEn: 'Estimated Shipping', domSelector: '#cart-shipping-label', severity: 'HIGH', context: 'Courier shipping cost estimate' },
      { id: 'cart-total', name: 'Total Order Amount Label', type: 'label', key: 'cart.total', defaultEn: 'Total', domSelector: '#cart-total-label', severity: 'CRITICAL_PATH', context: 'Final calculated order total' },
      { id: 'cart-checkout-btn', name: 'Proceed to Secure Checkout CTA', type: 'button', key: 'cart.checkout_btn', defaultEn: 'Proceed to Secure Checkout', domSelector: '#cart-checkout-btn', severity: 'CRITICAL_PATH', context: 'Primary trigger for checkout flow' },
      { id: 'cart-move-sfl', name: 'Move to Save for Later Action', type: 'button', key: 'cart.move_to_sfl', defaultEn: 'Save for Later', domSelector: '.cart-item-sfl-btn', severity: 'LOW', context: 'Item bookmark transfer' },
    ]
  },
  {
    id: 'SaveForLaterView',
    name: 'Save for Later & Bookmark Hub',
    filePath: 'src/components/store/SaveForLaterView.tsx',
    category: 'storefront',
    description: 'Customer saved items list with price tracking and 1-click cart transfer',
    elements: [
      { id: 'sfl-title', name: 'Save for Later Heading', type: 'heading', key: 'sfl.title', defaultEn: 'Save for Later', domSelector: '#sfl-view-title', severity: 'HIGH', context: 'Page header title' },
      { id: 'sfl-subtitle', name: 'Save for Later Subtitle', type: 'label', key: 'sfl.subtitle', defaultEn: 'Review saved research items, check current analytical pricing, and move products directly into your cart.', domSelector: '#sfl-view-desc', severity: 'MEDIUM', context: 'Descriptive subtitle' },
      { id: 'sfl-empty-title', name: 'Empty Saved Items Title', type: 'heading', key: 'sfl.empty_title', defaultEn: 'Your Save for Later list is empty', domSelector: '#sfl-empty-state', severity: 'LOW', context: 'Empty state illustration header' },
      { id: 'sfl-move-cart', name: 'Move to Cart Button', type: 'button', key: 'sfl.move_to_cart', defaultEn: 'Move to Cart', domSelector: '.sfl-move-cart-btn', severity: 'HIGH', context: 'Move bookmarked compound to cart' },
    ]
  },
  {
    id: 'AgeGate',
    name: 'Institutional 21+ Age Gate Modal',
    filePath: 'src/components/common/AgeGate.tsx',
    category: 'modals_popups',
    description: 'Mandatory legal compliance gate intercepting first-time visitors for institutional age verification',
    elements: [
      { id: 'agegate-title', name: 'Age Gate Verification Title', type: 'heading', key: 'agegate.title', defaultEn: 'Institutional Age Verification', domSelector: '#agegate-modal-title', severity: 'CRITICAL_PATH', context: 'Top verification dialog header' },
      { id: 'agegate-message', name: 'Age Gate Regulatory Notice', type: 'disclaimer', key: 'agegate.message', defaultEn: 'In compliance with chemical laboratory supply regulations, access to analytical reference standards requires verification of legal age.', domSelector: '#agegate-modal-msg', severity: 'CRITICAL_PATH', context: 'Mandatory age gate message' },
      { id: 'agegate-btn-over21', name: 'I am 21 or Older Button', type: 'button', key: 'agegate.btn_over21', defaultEn: 'I am 21 or older', domSelector: '#agegate-accept-btn', severity: 'CRITICAL_PATH', context: 'Verification accept button' },
      { id: 'agegate-btn-under21', name: 'I am Under 21 Button', type: 'button', key: 'agegate.btn_under21', defaultEn: 'I am under 21', domSelector: '#agegate-decline-btn', severity: 'CRITICAL_PATH', context: 'Verification decline button' },
      { id: 'agegate-restricted-title', name: 'Access Restricted Title', type: 'heading', key: 'agegate.restricted_title', defaultEn: 'Access Restricted', domSelector: '#agegate-lockout-title', severity: 'HIGH', context: 'Lockout screen header' },
    ]
  },
  {
    id: 'MasterSearchModal',
    name: 'Universal Search & CoA Finder Modal',
    filePath: 'src/components/common/MasterSearchModal.tsx',
    category: 'modals_popups',
    description: 'Instant search dialog indexing compounds, molecular formulas, CAS numbers, and PDF documents',
    elements: [
      { id: 'search-title', name: 'Search Modal Title', type: 'heading', key: 'search.title', defaultEn: 'Search Research Catalog', domSelector: '#search-modal-title', severity: 'HIGH', context: 'Dialog header' },
      { id: 'search-placeholder', name: 'Search Modal Input Placeholder', type: 'input', key: 'search.placeholder', defaultEn: 'Search compounds, CAS, formulas, categories, COAs...', domSelector: '#search-modal-input', severity: 'HIGH', context: 'Interactive search query bar' },
      { id: 'search-products-tab', name: 'Compounds & Standards Tab', type: 'tab', key: 'search.products_tab', defaultEn: 'Compounds & Standards', domSelector: '#search-tab-products', severity: 'MEDIUM', context: 'Search results segment' },
      { id: 'search-coa-tab', name: 'COA Documents Tab', type: 'tab', key: 'search.coa_tab', defaultEn: 'COA Documents', domSelector: '#search-tab-coa', severity: 'MEDIUM', context: 'Search results segment for COAs' },
      { id: 'search-no-results', name: 'No Results Found Message', type: 'label', key: 'search.no_results', defaultEn: 'No matching research items found.', domSelector: '#search-no-results-msg', severity: 'MEDIUM', context: 'Empty search state' },
    ]
  },
  {
    id: 'AuthModal',
    name: 'Institutional Auth & Google SSO Modal',
    filePath: 'src/components/common/AuthModal.tsx',
    category: 'modals_popups',
    description: 'Customer sign-in and registration dialog with Google One-Tap SSO and credentials login',
    elements: [
      { id: 'auth-signin-title', name: 'Sign In Dialog Title', type: 'heading', key: 'auth.signin_title', defaultEn: 'Sign In to BKRL Portal', domSelector: '#auth-signin-header', severity: 'HIGH', context: 'Sign in tab header' },
      { id: 'auth-register-title', name: 'Register Dialog Title', type: 'heading', key: 'auth.register_title', defaultEn: 'Register Institutional Account', domSelector: '#auth-register-header', severity: 'HIGH', context: 'Register tab header' },
      { id: 'auth-email-label', name: 'Email Address Field Label', type: 'label', key: 'auth.email', defaultEn: 'Email Address / Username', domSelector: '#auth-email-label', severity: 'HIGH', context: 'Form field label' },
      { id: 'auth-password-label', name: 'Password Field Label', type: 'label', key: 'auth.password', defaultEn: 'Account Password', domSelector: '#auth-password-label', severity: 'HIGH', context: 'Form field label' },
      { id: 'auth-signin-btn', name: 'Sign In Submit Button', type: 'button', key: 'auth.signin_btn', defaultEn: 'Sign In to Account', domSelector: '#auth-submit-signin', severity: 'CRITICAL_PATH', context: 'Login form submit' },
      { id: 'auth-register-btn', name: 'Create Account Submit Button', type: 'button', key: 'auth.register_btn', defaultEn: 'Create Institutional Account', domSelector: '#auth-submit-register', severity: 'CRITICAL_PATH', context: 'Registration form submit' },
      { id: 'auth-google-signin', name: 'Google SSO Sign In Button', type: 'button', key: 'auth.google_signin', defaultEn: 'Continue with Google', domSelector: '#auth-google-btn', severity: 'HIGH', context: 'OAuth SSO button' },
    ]
  },

  // 2. CHECKOUT & ORDER FLOW
  {
    id: 'CheckoutFlow',
    name: 'Multi-Step Checkout & Compliance Gate',
    filePath: 'src/components/checkout/CheckoutFlow.tsx',
    category: 'checkout',
    description: '4-step secure ordering pipeline: Shipping facility, institutional compliance review, payment processing, and order confirmation',
    elements: [
      { id: 'checkout-main-title', name: 'Checkout Screen Title', type: 'heading', key: 'checkout.title', defaultEn: 'Secure Research Order Checkout', domSelector: '#checkout-page-title', severity: 'CRITICAL_PATH', context: 'Main checkout page header' },
      { id: 'checkout-step-address', name: 'Step 1 Tab: Shipping Address', type: 'tab', key: 'checkout.step_address', defaultEn: 'Shipping Address', domSelector: '#checkout-step1-tab', severity: 'HIGH', context: 'Stepper navigation step 1' },
      { id: 'checkout-step-compliance', name: 'Step 2 Tab: Compliance Review', type: 'tab', key: 'checkout.step_compliance', defaultEn: 'Compliance Review', domSelector: '#checkout-step2-tab', severity: 'HIGH', context: 'Stepper navigation step 2' },
      { id: 'checkout-step-payment', name: 'Step 3 Tab: Payment Method', type: 'tab', key: 'checkout.step_payment', defaultEn: 'Payment Method', domSelector: '#checkout-step3-tab', severity: 'HIGH', context: 'Stepper navigation step 3' },
      { id: 'checkout-step-confirm', name: 'Step 4 Tab: Confirmation', type: 'tab', key: 'checkout.step_confirmation', defaultEn: 'Confirmation', domSelector: '#checkout-step4-tab', severity: 'HIGH', context: 'Stepper navigation step 4' },
      { id: 'checkout-facility-info', name: 'Facility & Delivery Heading', type: 'heading', key: 'checkout.facility_info', defaultEn: 'Facility & Delivery Address', domSelector: '#checkout-address-section-title', severity: 'HIGH', context: 'Address form header' },
      { id: 'checkout-first-name', name: 'First Name / Title Label', type: 'label', key: 'checkout.first_name', defaultEn: 'First Name / Title', domSelector: '#checkout-firstname-label', severity: 'HIGH', context: 'Form field label' },
      { id: 'checkout-last-name', name: 'Last Name Label', type: 'label', key: 'checkout.last_name', defaultEn: 'Last Name', domSelector: '#checkout-lastname-label', severity: 'HIGH', context: 'Form field label' },
      { id: 'checkout-address1', name: 'Address Line 1 Label', type: 'label', key: 'checkout.address1', defaultEn: 'Address Line 1 (Facility / Lab)', domSelector: '#checkout-addr1-label', severity: 'HIGH', context: 'Address line input' },
      { id: 'checkout-city', name: 'City Label', type: 'label', key: 'checkout.city', defaultEn: 'City', domSelector: '#checkout-city-label', severity: 'HIGH', context: 'City field' },
      { id: 'checkout-zip', name: 'Postal Code Label', type: 'label', key: 'checkout.zip', defaultEn: 'Postal Code', domSelector: '#checkout-zip-label', severity: 'HIGH', context: 'Zip/Postal code field' },
      { id: 'checkout-continue-comp', name: 'Proceed to Compliance Button', type: 'button', key: 'checkout.continue_to_compliance', defaultEn: 'Proceed to Compliance Review', domSelector: '#checkout-next-to-compliance-btn', severity: 'CRITICAL_PATH', context: 'Step 1 advance CTA' },
      { id: 'checkout-compliance-title', name: 'Compliance Review Heading', type: 'heading', key: 'checkout.compliance_title', defaultEn: 'Institutional Compliance & Verification', domSelector: '#checkout-comp-title', severity: 'CRITICAL_PATH', context: 'Step 2 section title' },
      { id: 'checkout-compliance-age', name: '21+ Age Certification Agreement', type: 'disclaimer', key: 'checkout.compliance_age', defaultEn: 'I certify that I am at least 21 years of age and authorized to purchase laboratory chemicals.', domSelector: '#checkout-comp-age-checkbox', severity: 'CRITICAL_PATH', context: 'Mandatory checkout checkbox' },
      { id: 'checkout-compliance-research', name: 'In Vitro Laboratory Use Agreement', type: 'disclaimer', key: 'checkout.compliance_research', defaultEn: 'I acknowledge and agree that all purchased substances are strictly for laboratory and scientific in vitro research.', domSelector: '#checkout-comp-research-checkbox', severity: 'CRITICAL_PATH', context: 'Mandatory checkout checkbox' },
      { id: 'checkout-compliance-ship', name: 'Authorized Research Facility Agreement', type: 'disclaimer', key: 'checkout.compliance_shipping', defaultEn: 'I confirm that the shipping destination is a verified laboratory, academic institution, or commercial research facility.', domSelector: '#checkout-comp-facility-checkbox', severity: 'CRITICAL_PATH', context: 'Mandatory facility destination checkbox' },
      { id: 'checkout-continue-pay', name: 'Proceed to Payment Method Button', type: 'button', key: 'checkout.continue_to_payment', defaultEn: 'Proceed to Payment Method', domSelector: '#checkout-next-to-payment-btn', severity: 'CRITICAL_PATH', context: 'Step 2 advance CTA' },
      { id: 'checkout-card-name', name: 'Name on Card Label', type: 'label', key: 'checkout.card_name', defaultEn: 'Name on Card', domSelector: '#checkout-cardname-label', severity: 'HIGH', context: 'Payment form label' },
      { id: 'checkout-card-number', name: 'Card Number Label', type: 'label', key: 'checkout.card_number', defaultEn: 'Card Number', domSelector: '#checkout-cardnumber-label', severity: 'HIGH', context: 'Payment form label' },
      { id: 'checkout-po-number', name: 'Institutional PO Number Field', type: 'label', key: 'checkout.po_number', defaultEn: 'Institutional PO Reference Number', domSelector: '#checkout-ponumber-label', severity: 'HIGH', context: 'Purchase Order number input' },
      { id: 'checkout-place-order', name: 'Authorize & Place Order Button', type: 'button', key: 'checkout.place_order', defaultEn: 'Authorize & Place Order', domSelector: '#checkout-submit-order-btn', severity: 'CRITICAL_PATH', context: 'Final transaction submission CTA' },
      { id: 'checkout-order-success', name: 'Order Confirmed Heading', type: 'heading', key: 'checkout.order_success', defaultEn: 'Order Confirmed & Authorized', domSelector: '#checkout-success-title', severity: 'HIGH', context: 'Step 4 receipt header' },
      { id: 'checkout-download-inv', name: 'Download Invoice Button', type: 'button', key: 'checkout.download_invoice', defaultEn: 'Download Laboratory Invoice', domSelector: '#checkout-download-invoice-btn', severity: 'HIGH', context: 'PDF invoice download action' },
    ]
  },

  // 3. CUSTOMER ACCOUNT PORTAL
  {
    id: 'CustomerDashboard',
    name: 'Customer Account & COA Vault Portal',
    filePath: 'src/components/customer/CustomerDashboard.tsx',
    category: 'customer_portal',
    description: 'Self-service dashboard for authenticated researchers with orders, COA downloads, address book, security, and support',
    elements: [
      { id: 'cust-welcome', name: 'Portal Welcome Greeting', type: 'heading', key: 'nav.account', defaultEn: 'My Account', domSelector: '#cust-portal-title', severity: 'HIGH', context: 'Dashboard top header' },
      { id: 'cust-tab-orders', name: 'Orders & COAs Tab', type: 'tab', key: 'nav.orders', defaultEn: 'Orders & COAs', domSelector: '#cust-tab-orders', severity: 'HIGH', context: 'Sidebar navigation tab' },
      { id: 'cust-tab-sfl', name: 'Saved Standards Tab', type: 'tab', key: 'nav.save_for_later', defaultEn: 'Save for Later', domSelector: '#cust-tab-sfl', severity: 'MEDIUM', context: 'Sidebar navigation tab' },
      { id: 'cust-signout-btn', name: 'Sign Out Button', type: 'button', key: 'nav.sign_out', defaultEn: 'Sign Out', domSelector: '#cust-signout-btn', severity: 'HIGH', context: 'Session termination action' },
    ]
  },

  // 4. ADMIN & GOVERNANCE SUITE
  {
    id: 'AdminHeader',
    name: 'Admin Portal Header & Command Hub',
    filePath: 'src/components/admin/AdminHeader.tsx',
    category: 'admin_system',
    description: 'Staff governance navbar with role switcher, layout presets, search commands, and tab routing',
    elements: [
      { id: 'admin-header-title', name: 'Admin Portal Brand Badge', type: 'badge', key: 'nav.admin_panel', defaultEn: 'Admin Portal', domSelector: '#admin-header-badge', severity: 'MEDIUM', context: 'Top admin navbar brand' },
      { id: 'admin-header-search', name: 'Command Search Input', type: 'input', key: 'nav.search', defaultEn: 'Search', domSelector: '#admin-command-search', severity: 'MEDIUM', context: 'Admin command palette' },
      { id: 'admin-header-close', name: 'Exit Admin Link', type: 'link', key: 'common.close', defaultEn: 'Close', domSelector: '#admin-exit-btn', severity: 'MEDIUM', context: 'Return to storefront link' },
    ]
  },
  {
    id: 'Footer',
    name: 'Global Storefront Footer',
    filePath: 'src/App.tsx',
    category: 'storefront',
    description: 'Bottom legal compliance footer with regulatory notices, quick links, and institutional copyright',
    elements: [
      { id: 'footer-brand-desc', name: 'Footer Brand Mission Description', type: 'label', key: 'footer.brand_desc', defaultEn: 'Precision chemical compounds and analytical reference standards for qualified research institutions worldwide.', domSelector: '#footer-brand-text', severity: 'MEDIUM', context: 'Brand footer description' },
      { id: 'footer-products-title', name: 'Footer Products Column Title', type: 'heading', key: 'footer.products_title', defaultEn: 'Research Products', domSelector: '#footer-col-products', severity: 'LOW', context: 'Footer column title' },
      { id: 'footer-account-title', name: 'Footer Account Column Title', type: 'heading', key: 'footer.account_title', defaultEn: 'Account & Compliance', domSelector: '#footer-col-account', severity: 'LOW', context: 'Footer column title' },
      { id: 'footer-user-guide', name: 'Footer User Guide Link', type: 'link', key: 'footer.user_guide', defaultEn: 'User Laboratory Guide', domSelector: '#footer-link-guide', severity: 'LOW', context: 'Guide footer link' },
      { id: 'footer-disclaimer-title', name: 'Regulatory Notice Footer Heading', type: 'heading', key: 'footer.disclaimer_title', defaultEn: 'Regulatory Notice', domSelector: '#footer-disclaimer-title', severity: 'HIGH', context: 'Regulatory notice header' },
      { id: 'footer-disclaimer-text', name: 'Footer Compliance Disclaimer', type: 'disclaimer', key: 'footer.disclaimer_text', defaultEn: 'All chemical standards are intended strictly for in vitro laboratory research and analytical calibration. Not for human or therapeutic use.', domSelector: '#footer-disclaimer-body', severity: 'CRITICAL_PATH', context: 'Mandatory bottom legal notice' },
      { id: 'footer-copyright', name: 'Footer Copyright Notice', type: 'label', key: 'footer.copyright', defaultEn: '© 2026 BK Research Labs. All chemical compounds are intended strictly for laboratory and scientific in vitro research.', domSelector: '#footer-copyright-text', severity: 'LOW', context: 'Bottom copyright line' },
    ]
  }
];

/**
 * Performs a comprehensive audit of all application components and UI elements
 * against a target language code, evaluating exact dictionary matches, phrase matches,
 * or fallback missing keys.
 */
export function auditApplicationTranslations(targetLang: LanguageCode): LanguageCoverageReport {
  const langMeta = SUPPORTED_LANGUAGES_REGISTRY.find(l => l.code === targetLang) || {
    code: targetLang,
    name: `Custom (${targetLang})`,
    nativeName: targetLang.toUpperCase(),
    flag: '🌐',
    direction: (targetLang === 'ar' || targetLang === 'he' || targetLang === 'fa' || targetLang === 'ur') ? 'rtl' : 'ltr',
    isDictBuiltIn: false
  };

  const isRTL = langMeta.direction === 'rtl';
  const targetDict = TRANSLATIONS[targetLang] || {};
  const phraseDict = PHRASE_DICTIONARY[targetLang] || {};

  let totalElementsCount = 0;
  let localizedElementsCount = 0;
  let missingElementsCount = 0;
  let criticalTotal = 0;
  let criticalLocalized = 0;

  const categoryBreakdown: Record<ComponentCategory, { total: number; localized: number; percentage: number }> = {
    storefront: { total: 0, localized: 0, percentage: 0 },
    checkout: { total: 0, localized: 0, percentage: 0 },
    customer_portal: { total: 0, localized: 0, percentage: 0 },
    admin_system: { total: 0, localized: 0, percentage: 0 },
    modals_popups: { total: 0, localized: 0, percentage: 0 },
  };

  const missingAuditLogs: MissingKeyAuditLogEntry[] = [];
  const auditedComponents: ComponentAuditSummary[] = [];

  // Iterate all registered components
  APPLICATION_COMPONENTS_REGISTRY.forEach(comp => {
    let compLocalizedCount = 0;
    let compMissingCount = 0;
    let compCriticalTotal = 0;
    let compCriticalLocalized = 0;

    const auditedElements: ElementAuditResult[] = comp.elements.map(elem => {
      totalElementsCount++;
      categoryBreakdown[comp.category].total++;
      if (elem.severity === 'CRITICAL_PATH') {
        criticalTotal++;
        compCriticalTotal++;
      }

      // Check translation resolution
      const rawTransVal = getTranslation(targetLang, elem.key);
      const enTransVal = getTranslation('en', elem.key) || elem.defaultEn;

      let status: TranslationAuditStatus = 'missing_fallback';
      let matchType: 'direct_key' | 'phrase_dict' | 'fallback_en' | 'untranslated' = 'fallback_en';

      if (targetLang === 'en') {
        status = 'localized';
        matchType = 'direct_key';
      } else if (targetDict[elem.key]) {
        // Exact direct key in target language dictionary
        status = 'localized';
        matchType = 'direct_key';
      } else if (phraseDict[elem.defaultEn.toLowerCase().trim()] || phraseDict[elem.key.toLowerCase().trim()]) {
        // Matched via phrase dictionary
        status = 'phrase_match';
        matchType = 'phrase_dict';
      } else if (rawTransVal && rawTransVal !== elem.key && rawTransVal !== enTransVal) {
        // Found via sub-schema or translation handler
        status = 'localized';
        matchType = 'direct_key';
      } else {
        // Missing in target language (falls back to English)
        status = 'missing_fallback';
        matchType = 'fallback_en';
      }

      if (status === 'localized' || status === 'phrase_match') {
        localizedElementsCount++;
        compLocalizedCount++;
        categoryBreakdown[comp.category].localized++;
        if (elem.severity === 'CRITICAL_PATH') {
          criticalLocalized++;
          compCriticalLocalized++;
        }
      } else {
        missingElementsCount++;
        compMissingCount++;

        // Add to missing audit log
        missingAuditLogs.push({
          id: `audit-${comp.id}-${elem.id}-${targetLang}`,
          timestamp: new Date().toISOString(),
          key: elem.key,
          componentId: comp.id,
          componentName: comp.name,
          elementName: elem.name,
          filePath: comp.filePath,
          severity: elem.severity,
          defaultEn: elem.defaultEn,
          targetLang,
          reason: targetDict[elem.key] ? 'Key exists but value is empty' : `Key '${elem.key}' not defined in TRANSLATIONS.${targetLang}`,
          suggestedTranslation: generateLaboratorySuggestedTranslation(elem.defaultEn, targetLang),
          resolutionStatus: 'unresolved'
        });
      }

      return {
        elementId: elem.id,
        elementName: elem.name,
        componentId: comp.id,
        componentName: comp.name,
        componentCategory: comp.category,
        filePath: comp.filePath,
        type: elem.type,
        key: elem.key,
        defaultEn: elem.defaultEn,
        translatedValue: rawTransVal || elem.defaultEn,
        status,
        severity: elem.severity,
        domSelector: elem.domSelector,
        context: elem.context,
        matchType,
        direction: isRTL ? 'rtl' : 'ltr'
      };
    });

    const compTotal = comp.elements.length;
    const compCoverage = compTotal > 0 ? Math.round((compLocalizedCount / compTotal) * 1000) / 10 : 100;
    const compCriticalCoverage = compCriticalTotal > 0 ? Math.round((compCriticalLocalized / compCriticalTotal) * 1000) / 10 : 100;

    auditedComponents.push({
      componentId: comp.id,
      name: comp.name,
      category: comp.category,
      filePath: comp.filePath,
      description: comp.description,
      totalElements: compTotal,
      localizedCount: compLocalizedCount,
      missingCount: compMissingCount,
      coveragePercentage: compCoverage,
      criticalPathCoveragePercentage: compCriticalCoverage,
      elements: auditedElements
    });
  });

  // Compute category breakdown percentages
  Object.keys(categoryBreakdown).forEach(k => {
    const cat = k as ComponentCategory;
    const total = categoryBreakdown[cat].total;
    const loc = categoryBreakdown[cat].localized;
    categoryBreakdown[cat].percentage = total > 0 ? Math.round((loc / total) * 1000) / 10 : 100;
  });

  const overallCoverage = totalElementsCount > 0 ? Math.round((localizedElementsCount / totalElementsCount) * 1000) / 10 : 100;
  const criticalCoverage = criticalTotal > 0 ? Math.round((criticalLocalized / criticalTotal) * 1000) / 10 : 100;

  return {
    language: targetLang,
    languageName: langMeta.name,
    nativeName: langMeta.nativeName,
    flag: langMeta.flag,
    isRTL,
    totalComponents: APPLICATION_COMPONENTS_REGISTRY.length,
    totalElements: totalElementsCount,
    localizedElements: localizedElementsCount,
    missingElements: missingElementsCount,
    coverageScore: overallCoverage,
    criticalPathScore: criticalCoverage,
    categoryBreakdown,
    components: auditedComponents,
    missingAuditLogs,
    auditTimestamp: new Date().toISOString()
  };
}

/**
 * Intelligent scientific & laboratory translation generator for missing keys
 */
export function generateLaboratorySuggestedTranslation(englishPhrase: string, targetLang: LanguageCode): string {
  const GLOSSARY_MAP: Record<string, Record<string, string>> = {
    es: {
      'Home': 'Inicio',
      'Shop': 'Tienda',
      'Categories': 'Categorías',
      'Save for Later': 'Guardar para más tarde',
      'Orders & COAs': 'Pedidos y Certificados de Análisis',
      'My Account': 'Mi Cuenta',
      'User Guide': 'Guía del Usuario',
      'Cart': 'Carrito',
      'Sign In / Register': 'Iniciar Sesión / Registrarse',
      'Sign Out': 'Cerrar Sesión',
      'Admin Portal': 'Portal de Administración',
      'Mobile Apps & QR': 'Aplicación Móvil y QR',
      'Search': 'Buscar',
      'Research Products': 'Productos de Investigación',
      'Add to Cart': 'Añadir al Carrito',
      'Proceed to Secure Checkout': 'Proceder al Pago Seguro',
      'In Stock': 'En Stock',
      'Out of Stock': 'Agotado',
      'Total': 'Total',
      'Subtotal': 'Subtotal',
      'Estimated Shipping': 'Envío Estimado',
      'Download Verified CoA': 'Descargar Certificado CoA Verificado',
      'I am 21 or older': 'Tengo 21 años o más',
      'I am under 21': 'Tengo menos de 21 años',
      'Shipping Address': 'Dirección de Envío',
      'Compliance Review': 'Revisión de Cumplimiento',
      'Payment Method': 'Método de Pago',
      'Confirmation': 'Confirmación',
      'Authorize & Place Order': 'Autorizar y Realizar Pedido',
      'Order Confirmed & Authorized': 'Pedido Confirmado y Autorizado',
      'Download Laboratory Invoice': 'Descargar Factura de Laboratorio'
    },
    fr: {
      'Home': 'Accueil',
      'Shop': 'Boutique',
      'Categories': 'Catégories',
      'Save for Later': 'Enregistrer pour plus tard',
      'Orders & COAs': 'Commandes et Certificats d\'Analyse',
      'My Account': 'Mon Compte',
      'User Guide': 'Guide d\'Utilisation',
      'Cart': 'Panier',
      'Sign In / Register': 'Connexion / Inscription',
      'Sign Out': 'Déconnexion',
      'Admin Portal': 'Portail d\'Administration',
      'Mobile Apps & QR': 'Applications Mobiles et QR',
      'Search': 'Rechercher',
      'Research Products': 'Produits de Recherche',
      'Add to Cart': 'Ajouter au Panier',
      'Proceed to Secure Checkout': 'Passer à la Caisse Sécurisée',
      'In Stock': 'En Stock',
      'Out of Stock': 'Épuisé',
      'Total': 'Total',
      'Subtotal': 'Sous-total',
      'Estimated Shipping': 'Frais de Port Estimés',
      'Download Verified CoA': 'Télécharger le Certificat CoA Vérifié',
      'I am 21 or older': 'J\'ai 21 ans ou plus',
      'I am under 21': 'J\'ai moins de 21 ans',
      'Shipping Address': 'Adresse de Livraison',
      'Compliance Review': 'Vérification de Conformité',
      'Payment Method': 'Mode de Paiement',
      'Confirmation': 'Confirmation',
      'Authorize & Place Order': 'Autoriser et Valider la Commande',
      'Order Confirmed & Authorized': 'Commande Confirmée et Autorisée',
      'Download Laboratory Invoice': 'Télécharger la Facture de Laboratoire'
    },
    de: {
      'Home': 'Startseite',
      'Shop': 'Katalog & Shop',
      'Categories': 'Kategorien',
      'Save for Later': 'Für später speichern',
      'Orders & COAs': 'Bestellungen & Analysezertifikate',
      'My Account': 'Mein Konto',
      'User Guide': 'Labor-Handbuch',
      'Cart': 'Warenkorb',
      'Sign In / Register': 'Anmelden / Registrieren',
      'Sign Out': 'Abmelden',
      'Admin Portal': 'Admin-Portal',
      'Mobile Apps & QR': 'Mobile Apps & QR-Codes',
      'Search': 'Suchen',
      'Research Products': 'Forschungsprodukte',
      'Add to Cart': 'In den Warenkorb',
      'Proceed to Secure Checkout': 'Zur sicheren Kasse',
      'In Stock': 'Vorrätig',
      'Out of Stock': 'Nicht vorrätig',
      'Total': 'Gesamtbetrag',
      'Subtotal': 'Zwischensumme',
      'Estimated Shipping': 'Geschätzter Versand',
      'Download Verified CoA': 'Geprüftes Analysezertifikat herunterladen',
      'I am 21 or older': 'Ich bin 21 Jahre oder älter',
      'I am under 21': 'Ich bin unter 21 Jahre',
      'Shipping Address': 'Lieferadresse',
      'Compliance Review': 'Konformitätsprüfung',
      'Payment Method': 'Zahlungsart',
      'Confirmation': 'Bestätigung',
      'Authorize & Place Order': 'Bestellung autorisieren & aufgeben',
      'Order Confirmed & Authorized': 'Bestellung bestätigt & autorisiert',
      'Download Laboratory Invoice': 'Labor-Rechnung herunterladen'
    },
    ja: {
      'Home': 'ホーム',
      'Shop': 'ショップ',
      'Categories': 'カテゴリー',
      'Save for Later': '後で保存',
      'Orders & COAs': '注文と分析証明書 (CoA)',
      'My Account': 'マイアカウント',
      'User Guide': '研究室ガイド',
      'Cart': 'カート',
      'Sign In / Register': 'サインイン / 新規登録',
      'Sign Out': 'サインアウト',
      'Admin Portal': '管理者ポータル',
      'Add to Cart': 'カートに追加',
      'Proceed to Secure Checkout': '安全な決済に進む',
      'In Stock': '在庫あり',
      'Out of Stock': '在庫切れ',
      'Total': '合計',
      'Subtotal': '小計',
      'Estimated Shipping': '推定送料',
      'Download Verified CoA': 'CoA分析証明書をダウンロード',
      'I am 21 or older': '21歳以上です',
      'I am under 21': '21歳未満です'
    },
    zh: {
      'Home': '首页',
      'Shop': '产品商城',
      'Categories': '研究分类',
      'Save for Later': '稍后保存',
      'Orders & COAs': '订单与分析证书 (CoA)',
      'My Account': '我的账户',
      'User Guide': '实验室使用手册',
      'Cart': '购物车',
      'Sign In / Register': '登录 / 注册',
      'Sign Out': '退出登录',
      'Admin Portal': '管理控制台',
      'Add to Cart': '加入购物车',
      'Proceed to Secure Checkout': '前往安全结账',
      'In Stock': '现货库存',
      'Out of Stock': '暂无库存',
      'Total': '总计',
      'Subtotal': '小计',
      'Estimated Shipping': '预计运费',
      'Download Verified CoA': '下载已验证分析证书',
      'I am 21 or older': '我已年满21岁',
      'I am under 21': '未满21岁'
    }
  };

  const langGlossary = GLOSSARY_MAP[targetLang];
  if (langGlossary && langGlossary[englishPhrase]) {
    return langGlossary[englishPhrase];
  }

  return `[${targetLang.toUpperCase()}] ${englishPhrase}`;
}
