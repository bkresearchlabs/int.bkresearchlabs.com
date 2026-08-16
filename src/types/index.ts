import { AiMasterControlSettings } from './ai';

export type UserRole = 'customer' | 'employee' | 'security_admin' | 'admin' | 'owner';

export type NavLayoutOption =
  | 'grid_deck'      // 1. All Functions Visible Grid Deck
  | 'sidebar_drawer' // 2. Left Vertical Sidebar Rail / Drawer
  | 'command_hub'    // 3. Categorized Command Hub Megamenu
  | 'floating_dock'  // 4. Floating Glass Pill Dock
  | 'minimal_strip'  // 5. Minimal Compact Text Strip
  | 'windows_11'     // OS Layout 1: Windows 11 Desktop
  | 'macos_apple'    // OS Layout 2: macOS Apple Sonoma Desktop
  | 'linux_ubuntu'   // OS Layout 3: Linux Ubuntu GNOME Desktop
  | 'cyberpunk_os'   // OS Layout 4: Cyberpunk Terminal HUD
  | 'enterprise_workbench' // OS Layout 5: Enterprise Workbench OS
  | 'playstation_xmb' // Gaming Console 1: PlayStation 5 XMB Horizon
  | 'xbox_dashboard' // Gaming Console 2: Xbox Series X Blade & Tile
  | 'nintendo_switch' // Gaming Console 3: Nintendo Switch Home Ribbon
  | 'steam_deck'     // Gaming Console 4: Steam Deck OS Portal
  | 'arcade_cabinet'; // Gaming Console 5: Retro Arcade Cabinet HUD

export interface UserProfile {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  username?: string;
  email: string;
  recovery_email?: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'disabled';
  auth_provider?: 'password' | 'google' | 'sso';
  google_id?: string;
  google_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFile {
  id: string;
  product_id: string;
  storage_path: string;
  file_name: string;
  file_type: 'pdf' | 'coa' | 'manual' | 'msds' | 'other';
  file_size?: string;
  description?: string;
  customer_accessible: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  inventory_quantity: number;
  inventory_tracking_enabled: boolean;
  category_id: string;
  category_name?: string;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  requires_age_verification: boolean;
  requires_acknowledgment: boolean;
  acknowledgment_text?: string;
  geographic_restrictions?: string[]; // e.g. ["CA", "NY"]
  shipping_enabled: boolean;
  disclaimer?: string;
  images: string[];
  files?: ProductFile[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SaveForLaterItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

export interface CartItem {
  id: string;
  cart_id?: string;
  product_id: string;
  product: Product;
  quantity: number;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'failed';
export type PaymentStatus = 'unpaid' | 'paid' | 'authorized' | 'refunded' | 'failed';
export type FulfillmentStatus = 'unfulfilled' | 'fulfilled' | 'processing' | 'shipped' | 'delivered' | 'returned';

export interface OrderItemSnapshot {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  sku_snapshot: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  image_snapshot?: string;
}

export interface TrackingHistoryEntry {
  id: string;
  tracking_number: string;
  carrier: string;
  status: OrderStatus;
  updated_at: string;
  updated_by_role?: string;
  updated_by_name?: string;
  note?: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  subtotal: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  payment_reference?: string;
  tracking_number?: string;
  carrier?: string;
  tracking_history?: TrackingHistoryEntry[];
  items: OrderItemSnapshot[];
  acknowledgments_accepted: boolean;
  age_verified_at_checkout: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase?: number;
  active: boolean;
  usage_count: number;
  max_uses?: number;
  expires_at?: string;
}

export interface CustomerDashboardFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface CustomerDashboardSettings {
  welcome_message: string;
  announcement_enabled: boolean;
  announcement_text: string;
  support_email: string;
  support_phone: string;
  support_hours: string;
  show_quick_reorder: boolean;
  show_coa_vault: boolean;
  show_rewards_tier: boolean;
  show_saved_items: boolean;
  show_address_book: boolean;
  show_support_portal: boolean;
  show_security_tab: boolean;
  custom_faq_items?: CustomerDashboardFaqItem[];
}

export interface ElementSpacing {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  gap?: number;
  maxWidth?: number;
  borderRadius?: number;
}

export interface AppSpacingConfig {
  global_container: ElementSpacing;
  hero_section: ElementSpacing;
  announcement_bar: ElementSpacing;
  header_nav: ElementSpacing;
  category_grid: ElementSpacing;
  product_grid: ElementSpacing;
  product_card: ElementSpacing;
  guarantees_banner: ElementSpacing;
  footer_section: ElementSpacing;
  product_quick_view?: ElementSpacing;
}

export interface GoogleVoiceConfig {
  enabled: boolean;
  phone_number: string;
  account_email: string;
  forwarding_number: string;
  call_recording_enabled: boolean;
  voicemail_transcription: boolean;
  sms_order_updates_enabled: boolean;
  sms_dispatch_notifications_enabled: boolean;
  click_to_call_storefront_widget: boolean;
  business_hours: {
    start: string;
    end: string;
    timezone: string;
    auto_responder_msg: string;
  };
  webhook_url?: string;
  status: 'connected' | 'pending' | 'disconnected';
  test_call_history?: {
    id: string;
    caller: string;
    duration: string;
    type: 'inbound' | 'outbound' | 'sms';
    timestamp: string;
    status: string;
  }[];
}

export interface GoogleWorkspaceConfig {
  enabled: boolean;
  domain: string;
  admin_email: string;
  service_account_email: string;
  gmail_api_sync: boolean;
  spf_verified: boolean;
  dkim_verified: boolean;
  dmarc_verified: boolean;
  inboxes: {
    id: string;
    department: string;
    email: string;
    alias: string;
    active: boolean;
    unread_count: number;
  }[];
  auto_bcc_orders_email: string;
}

export interface GoogleMerchantConfig {
  enabled: boolean;
  merchant_id: string;
  feed_url: string;
  auto_sync_interval_hours: number;
  target_country: string;
  target_currency: string;
  content_api_status: 'connected' | 'needs_auth' | 'syncing' | 'error';
  include_out_of_stock: boolean;
  product_condition: 'new' | 'refurbished' | 'used';
  age_group_filter: 'adult' | 'all';
  custom_label_0: string;
  custom_label_1: string;
  last_synced_at?: string;
  total_products_synced?: number;
}

export interface GoogleAnalyticsConfig {
  enabled: boolean;
  measurement_id: string;
  gtm_container_id: string;
  enhanced_ecommerce: boolean;
  anonymize_ip: boolean;
  debug_mode: boolean;
  track_coa_downloads: boolean;
  track_outbound_links: boolean;
  user_id_tracking: boolean;
}

export interface GoogleAdsConfig {
  enabled: boolean;
  conversion_id: string;
  conversion_label: string;
  enhanced_conversions: boolean;
  remarketing_tag: boolean;
  currency_code: string;
}

export interface GoogleSearchConsoleConfig {
  enabled: boolean;
  verification_token: string;
  sitemap_url: string;
  googlebot_indexing: boolean;
  canonical_domain: string;
  rich_snippets_enabled: boolean;
}

export interface GoogleMapsConfig {
  enabled: boolean;
  api_key: string;
  places_autocomplete_checkout: boolean;
  address_validation_api: boolean;
  store_locator_lat: number;
  store_locator_lng: number;
  store_locator_zoom: number;
  warehouse_address: string;
}

export interface GoogleDriveConfig {
  enabled: boolean;
  backup_invoices: boolean;
  backup_coas: boolean;
  shared_drive_id: string;
  folder_path: string;
  last_backup_at?: string;
  storage_used_mb?: number;
}

export interface GoogleBusinessProfileConfig {
  enabled: boolean;
  account_id: string;
  location_id: string;
  show_reviews_badge: boolean;
  auto_request_review_after_delivery: boolean;
  rating: number;
  review_count: number;
  reviews_url: string;
}

export interface PageTranslationRule {
  page_id?: string;
  page_slug: string;
  page_title: string;
  translate_enabled: boolean; // false = keep original laboratory-defined language (notranslate)
  preserve_scientific_blocks?: boolean; // true = keep chemical specs, CAS, purity numbers locked
  category?: 'general' | 'scientific' | 'legal' | 'protocol' | 'product_descriptions' | 'cms_page';
  notes?: string;
}

export interface ProductDescriptionTranslationConfig {
  auto_translate_overview: boolean; // Translate general descriptive paragraphs
  preserve_chemical_nomenclature: boolean; // Keep IUPAC, CAS, Mol Formula in original ('notranslate')
  preserve_coa_specifications: boolean; // Keep HPLC, NMR, purity percentages untouched
  preserve_legal_disclaimers: boolean; // Keep "For laboratory research only" disclaimers untouched
  preserve_handling_protocols: boolean; // Keep temperature/storage protocol notation untouched
  excluded_product_ids: string[]; // Specific products to keep 100% in original laboratory language
}

export interface GoogleTranslateConfig {
  enabled: boolean;
  api_key?: string;
  project_id?: string;
  default_source_language: string;
  target_languages: string[];
  auto_translate_widget_enabled: boolean;
  widget_layout: 'custom_dropdown' | 'simple_dropdown' | 'horizontal_flags' | 'floating_badge';
  enable_cloud_api_proxy: boolean;
  hide_google_branding: boolean;
  prevent_layout_shift: boolean;
  auto_detect_user_language: boolean;
  persist_language_choice: boolean;
  enable_seo_hreflang: boolean;
  excluded_selectors: string[];
  translation_cache_enabled: boolean;
  status: 'connected' | 'unconfigured' | 'testing' | 'error';
  last_tested_at?: string;
  total_translations_count?: number;
  page_translation_rules?: PageTranslationRule[];
  product_description_rules?: ProductDescriptionTranslationConfig;
}

export interface GoogleServicesConfig {
  voice: GoogleVoiceConfig;
  workspace: GoogleWorkspaceConfig;
  merchant: GoogleMerchantConfig;
  analytics: GoogleAnalyticsConfig;
  ads: GoogleAdsConfig;
  search_console: GoogleSearchConsoleConfig;
  maps: GoogleMapsConfig;
  drive: GoogleDriveConfig;
  business_profile: GoogleBusinessProfileConfig;
  auth: GoogleAuthSettings;
  translate?: GoogleTranslateConfig;
}

export interface GoogleAuthSettings {
  enabled: boolean;
  client_id: string;
  client_secret?: string;
  one_tap_enabled: boolean;
  auto_login_domain_match: boolean;
  allowed_domains: string; // e.g. "bkresearchlabs.com, harvard.edu, gmail.com" or empty for all
  default_user_role: UserRole;
  button_theme: 'outline' | 'filled_blue' | 'filled_black' | 'icon_only';
  button_shape: 'pill' | 'rectangular' | 'circle';
  button_text: 'signin_with' | 'signup_with' | 'continue_with';
  auto_approve_new_users: boolean;
  last_configured_at?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: 'general' | 'scientific' | 'legal' | 'protocol';
  show_in_header: boolean;
  show_in_footer: boolean;
  header_nav_mode: 'default' | 'popup' | 'page';
  status: 'published' | 'draft';
  meta_title?: string;
  meta_description?: string;
  author?: string;
  views_count?: number;
  sort_order: number;
  translate_enabled?: boolean; // false = keep in original laboratory-defined language (notranslate)
  preserve_scientific_blocks?: boolean; // true = keep chemical formulas & CAS numbers in original language
  original_language?: string; // default 'en'
  created_at: string;
  updated_at: string;
}

export type NavItemDisplayMode = 'default' | 'popup' | 'page';

export interface NavigationMenuItemConfig {
  id: string;
  label: string;
  enabled: boolean;
  mode: NavItemDisplayMode;
  order: number;
}

export interface NavigationConfig {
  global_mode: 'popup' | 'page';
  header_layout: 'standard' | 'pill_float' | 'minimal_clean' | 'enterprise_bar';
  show_home_link: boolean;
  show_qr_app_button: boolean;
  show_lang_selector: boolean;
  show_device_selector: boolean;
  show_search_button: boolean;
  menu_items: Record<string, NavigationMenuItemConfig>;
}

export type ThemePreset = 'lab_emerald' | 'scientific_slate' | 'midnight_obsidian' | 'nordic_light' | 'cyberpunk_neon';

export interface ThemeConfig {
  preset: ThemePreset;
  primary_color: string;
  accent_color: string;
  background_mode: 'dark_obsidian' | 'laboratory_teal' | 'slate_dark' | 'clean_light';
  border_radius_style: 'sharp' | 'subtle' | 'rounded' | 'pill';
  font_family_pair: 'serif_display' | 'sans_modern' | 'mono_tech';
  card_glass_effect: boolean;
  high_contrast_mode: boolean;
}

export interface StoreProfileConfig {
  legal_business_name: string;
  dba_name: string;
  tax_id_ein: string;
  support_phone: string;
  order_notification_email: string;
  support_email: string;
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  timezone: string;
  business_hours: string;
  favicon_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  social_links: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    discord?: string;
    github?: string;
    facebook?: string;
  };
}

export interface SupabaseCloudConfig {
  project_url: string;
  anon_key: string;
  service_role_key?: string;
  project_id: string;
  sync_mode: 'cloud_first' | 'local_storage_fallback' | 'offline_only';
  last_tested_at?: string;
  connection_status: 'connected' | 'needs_migration' | 'error' | 'unconfigured';
  storage_buckets: {
    product_images: boolean;
    coas_and_documents: boolean;
    app_releases: boolean;
    office_files: boolean;
  };
}

export interface StoreOnboardingConfig {
  completed_steps: string[];
  dismissed: boolean;
  setup_completed_at?: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  primary_color: string;
  logo_url?: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  age_gate_enabled: boolean;
  age_gate_min_age: number;
  age_gate_title: string;
  age_gate_message: string;
  currency: string;
  currency_symbol: string;
  tax_rate_percentage: number;
  free_shipping_threshold: number;
  standard_shipping_fee: number;
  maintenance_mode: boolean;
  default_language: string;
  supported_languages: string[];
  store_profile?: StoreProfileConfig;
  supabase_config?: SupabaseCloudConfig;
  store_onboarding?: StoreOnboardingConfig;
  customer_dashboard?: CustomerDashboardSettings;
  spacing_config?: AppSpacingConfig;
  google_auth?: GoogleAuthSettings;
  google_services?: GoogleServicesConfig;
  theme_config?: ThemeConfig;
  navigation_config?: NavigationConfig;
  popups_config?: PopupsConfig;
  ota_sync_settings?: OtaSyncSettings;
  seo_config?: SeoGlobalConfig;
  ai_master_control?: AiMasterControlSettings;
}

export * from './ai';

export interface SeoItemMeta {
  meta_title?: string;
  meta_description?: string;
  focus_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: 'website' | 'article' | 'product' | 'product.group';
  twitter_card?: 'summary' | 'summary_large_image';
  canonical_url?: string;
  robots_index?: 'index' | 'noindex';
  robots_follow?: 'follow' | 'nofollow';
  structured_data_custom?: string;
  last_updated?: string;
}

export interface SitemapCustomUrl {
  id: string;
  url: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  enabled: boolean;
  notes?: string;
}

export interface SitemapSubmissionLog {
  id: string;
  engine: 'google' | 'bing' | 'yandex' | 'indexnow' | 'all';
  status_code: number;
  status_text: string;
  urls_submitted: number;
  timestamp: string;
  response_msg?: string;
}

export interface SitemapConfig {
  include_homepage: boolean;
  include_products: boolean;
  include_categories: boolean;
  include_pages: boolean;
  include_core_routes: boolean;
  include_images: boolean;
  auto_exclude_noindex: boolean;
  format_mode: 'formatted' | 'minified';
  default_priority_homepage: string;
  default_priority_products: string;
  default_priority_categories: string;
  default_priority_pages: string;
  default_priority_core: string;
  default_freq_homepage: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  default_freq_products: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  default_freq_categories: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  default_freq_pages: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  default_freq_core: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  custom_urls?: SitemapCustomUrl[];
  excluded_url_patterns?: string[];
  last_crawled_at?: string;
  submission_history?: SitemapSubmissionLog[];
}

export interface SeoGlobalConfig {
  site_title_template: string;
  default_meta_title: string;
  default_meta_description: string;
  default_focus_keywords: string[];
  default_og_image: string;
  default_og_type: 'website' | 'article' | 'product';
  twitter_site_handle: string;
  twitter_creator_handle: string;
  canonical_domain: string;
  auto_generate_social_cards: boolean;
  enable_json_ld_breadcrumbs: boolean;
  enable_json_ld_organization: boolean;
  enable_json_ld_product: boolean;
  google_site_verification: string;
  bing_site_verification: string;
  yandex_site_verification: string;
  pinterest_site_verification: string;
  robots_txt_content: string;
  enable_auto_sitemap: boolean;
  sitemap_ping_google: boolean;
  category_meta_overrides: Record<string, SeoItemMeta>;
  product_meta_overrides: Record<string, SeoItemMeta>;
  page_meta_overrides: Record<string, SeoItemMeta>;
  product_title_template: string;
  product_description_template: string;
  category_title_template: string;
  category_description_template: string;
  custom_head_tags?: string;
  last_audit_score?: number;
  last_audited_at?: string;
  sitemap_settings?: SitemapConfig;
}

export interface IndividualPopupDownloadableSettings {
  show_downloadables: boolean;
  section_title: string;
  section_subtitle: string;
  selected_downloadable_ids: string[];
  display_style: 'compact_list' | 'cards_grid' | 'featured_banner';
  allow_instant_download: boolean;
  show_file_size_and_version: boolean;
  show_access_rules: boolean;
  custom_badge_text?: string;
}

export interface ShopPopupConfig {
  title: string;
  subtitle: string;
  search_placeholder: string;
  all_compounds_badge: string;
  quick_view_button_text: string;
  add_to_cart_button_text: string;
  stock_badge_text: string;
  price_suffix: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface CategoriesPopupConfig {
  title: string;
  subtitle: string;
  view_compounds_cta: string;
  badge_text: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface SavedPopupConfig {
  title: string;
  subtitle: string;
  empty_title: string;
  empty_subtitle: string;
  empty_cta_text: string;
  quick_view_text: string;
  add_button_text: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface OrdersPopupConfig {
  title: string;
  subtitle: string;
  empty_title: string;
  empty_subtitle: string;
  coa_vault_banner_title: string;
  coa_vault_banner_text: string;
  coa_button_text: string;
  reorder_button_text: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface GuidePopupConfig {
  title: string;
  subtitle: string;
  helpdesk_banner_title: string;
  helpdesk_banner_text: string;
  support_hotline: string;
  support_email: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface QrPopupConfig {
  title: string;
  subtitle: string;
  camera_heading: string;
  camera_instructions: string;
  manual_lookup_heading: string;
  manual_lookup_placeholder: string;
  lookup_button_text: string;
  demo_sample_lot: string;
  purity_badge_text: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface IosPopupConfig {
  title: string;
  subtitle: string;
  ipa_download_title: string;
  ipa_download_button: string;
  ipa_file_size: string;
  ipa_version: string;
  ipa_badge: string;
  step1_title: string;
  step1_text: string;
  step2_title: string;
  step2_text: string;
  step3_title: string;
  step3_text: string;
  qr_code_instruction: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface AndroidPopupConfig {
  title: string;
  subtitle: string;
  apk_download_title: string;
  apk_download_button: string;
  apk_file_size: string;
  apk_version: string;
  apk_sha256: string;
  install_step_title: string;
  install_step_text: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface AgeGateModalConfig {
  title: string;
  subtitle: string;
  min_age: number;
  accept_button_text: string;
  decline_button_text: string;
  disclaimer_notice: string;
}

export interface MasterSearchModalConfig {
  title: string;
  placeholder: string;
  quick_filter_label: string;
  no_results_title: string;
  no_results_subtitle: string;
}

export interface ProductQuickViewConfig {
  quality_dossier_title: string;
  quality_dossier_subtitle: string;
  lot_sample_badge: string;
  download_coa_button_text: string;
  msds_button_text: string;
  volume_tier_title: string;
  add_to_cart_button_text: string;
  compliance_disclaimer: string;
  downloadables: IndividualPopupDownloadableSettings;
}

export interface PopupsConfig {
  shop: ShopPopupConfig;
  categories: CategoriesPopupConfig;
  'save-for-later': SavedPopupConfig;
  orders: OrdersPopupConfig;
  guide: GuidePopupConfig;
  qr: QrPopupConfig;
  ios: IosPopupConfig;
  android: AndroidPopupConfig;
  age_gate: AgeGateModalConfig;
  master_search: MasterSearchModalConfig;
  product_quick_view: ProductQuickViewConfig;
}

export type PaymentGatewayProvider = 'authorize_net' | 'stripe' | 'paypal' | 'bank_wire' | 'crypto' | 'apple_pay' | 'custom';

export interface AuthorizeNetSettings {
  api_login_id: string;
  transaction_key: string;
  public_client_key: string;
  mode: 'sandbox' | 'live';
  transaction_type: 'auth_capture' | 'auth_only';
  test_mode: boolean;
  supported_cards: string[]; // e.g. ['visa', 'mastercard', 'amex', 'discover']
}

export interface StripeSettings {
  publishable_key: string;
  secret_key: string;
  webhook_secret: string;
  mode: 'test' | 'live';
  supported_cards?: string[]; // e.g. ['visa', 'mastercard', 'amex', 'discover', 'jcb']
}

export interface PaypalSettings {
  client_id: string;
  client_secret: string;
  mode: 'sandbox' | 'live';
}

export interface BankWireSettings {
  bank_name: string;
  account_name: string;
  account_number: string;
  routing_number: string;
  swift_bic: string;
  bank_address: string;
  payment_instructions: string;
  require_po_reference: boolean;
}

export interface CryptoSettings {
  btc_wallet_address: string;
  eth_wallet_address: string;
  usdt_trc20_address: string;
  auto_calculate_usd: boolean;
}

export interface ApplePaySettings {
  merchant_id: string;
  domain_validation_status: 'verified' | 'pending';
  enable_express_button: boolean;
}

export interface CustomGatewayField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'checkbox';
  value: string;
  placeholder?: string;
  options?: string[];
}

export interface PaymentGateway {
  id: string;
  name: string;
  provider: PaymentGatewayProvider;
  description: string;
  icon_name: string;
  enabled: boolean;
  is_default?: boolean;
  display_order: number;
  test_mode: boolean;
  badge_text?: string;
  authorize_net?: AuthorizeNetSettings;
  stripe?: StripeSettings;
  paypal?: PaypalSettings;
  bank_wire?: BankWireSettings;
  crypto?: CryptoSettings;
  apple_pay?: ApplePaySettings;
  custom_fields?: CustomGatewayField[];
  created_at?: string;
  updated_at?: string;
}

export interface HomepageContent {
  hero_title: string;
  hero_subtitle: string;
  hero_primary_cta_label: string;
  hero_primary_cta_link: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_link: string;
  hero_image_url: string;
  announcement_bar_enabled: boolean;
  announcement_bar_text: string;
  featured_category_ids: string[];
  featured_product_ids: string[];
}

export interface AuditLog {
  id: string;
  admin_user_id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  role?: UserRole;
  is_security_admin_action?: boolean;
  supervisor_reviewed?: boolean;
  supervisor_reviewed_by?: string;
  supervisor_reviewed_at?: string;
  supervisor_status?: 'pending' | 'approved' | 'flagged';
  supervisor_notes?: string;
  ip_address?: string;
  created_at: string;
}

export type PurchaseOrderStatus = 'draft' | 'ordered' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  id: string;
  po_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_name: string;
  supplier_email?: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  total_amount: number;
  notes?: string;
  created_at: string;
  expected_delivery_date?: string;
  received_at?: string;
}

export type DeviceMode = 'web' | 'ios' | 'android';
export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'zh'
  | 'ar'
  | 'ru'
  | 'pt'
  | 'it'
  | 'ko'
  | 'nl'
  | 'pl'
  | 'tr'
  | 'hi'
  | 'vi'
  | 'sv'
  | 'el'
  | 'th'
  | 'he'
  | 'id'
  | 'cs'
  | 'da'
  | 'fi'
  | 'no'
  | 'uk'
  | string;

export type DownloadCategory = 'app' | 'coa' | 'software' | 'documentation' | 'dataset' | 'other';
export type DownloadPlatform = 'android' | 'ios' | 'windows' | 'macos' | 'linux' | 'all';
export type AssetAccessRule = 'public' | 'registered_only' | 'product_purchase_required' | 'admin_granted_only';

export interface DownloadableItem {
  id: string;
  title: string;
  filename: string;
  file_size: string;
  version: string;
  category: DownloadCategory;
  platform: DownloadPlatform;
  description: string;
  download_url: string;
  is_public: boolean;
  requires_auth: boolean;
  download_count: number;
  release_notes?: string;
  md5_hash?: string;
  access_rule?: AssetAccessRule;
  linked_product_ids?: string[]; // Product IDs that automatically grant access when bought
  assigned_user_ids?: string[]; // Registered user IDs manually granted access
  assigned_user_emails?: string[]; // Registered user emails manually granted access
  email_delivery_enabled?: boolean;
  email_sent_count?: number;
  created_at: string;
  updated_at: string;
}

export interface UserAssetGrant {
  id: string;
  user_id: string;
  user_email: string;
  user_name?: string;
  asset_id: string;
  asset_title: string;
  filename: string;
  granted_by: 'admin' | 'product_purchase' | 'system';
  granted_by_detail?: string; // e.g. "Order #BKRL-2026-98102 (TESAMORELIN 10mg)" or "Admin: bkresearchlabs@gmail.com"
  granted_at: string;
  expires_at?: string; // null = lifetime access
  download_count: number;
  max_downloads?: number; // null = unlimited
  last_downloaded_at?: string;
}

export interface AssetEmailLog {
  id: string;
  asset_id: string;
  asset_title: string;
  filename: string;
  recipient_email: string;
  recipient_name?: string;
  sent_by_user_id?: string;
  sent_by_email?: string;
  trigger_source: 'user_request' | 'admin_dispatch' | 'automatic_purchase';
  status: 'sent' | 'failed';
  details?: string;
  sent_at: string;
}

// --- REAL-TIME CUSTOMIZABLE COMMUNICATION & EMAIL SYSTEM TYPES ---
export type EmailProviderType = 'gmail' | 'smtp' | 'resend' | 'sendgrid' | 'postmark' | 'mailgun' | 'custom_webhook';
export type SmtpSecurity = 'tls' | 'ssl' | 'none';

export interface EmailProfile {
  id: string;
  name: string; // e.g. "Primary Gmail - Main Orders", "Customer Support - Resend API", "Technical & COA - Custom SMTP"
  is_default: boolean; // whether this is the active default company email profile
  company_email: string; // e.g. bkresearchlabs@gmail.com, support@bkresearchlabs.com, orders@bkresearchlabs.com
  sender_name: string; // e.g. "BK Research Labs", "BKRL Technical Team"
  reply_to_email?: string;
  provider_type: EmailProviderType;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_security?: SmtpSecurity;
  api_key?: string;
  webhook_url?: string;
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  last_tested_at?: string;
  last_error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailProviderConfig {
  provider_type: EmailProviderType;
  company_external_email: string; // e.g. bkresearchlabs@gmail.com, support@bkresearchlabs.com
  sender_name: string;
  reply_to_email: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_security?: SmtpSecurity;
  api_key?: string;
  webhook_url?: string;
  auto_verify_domain?: boolean;
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  last_tested_at?: string;
  last_error_message?: string;
}

export type NotificationTemplateType = 
  | 'order_confirmation'
  | 'shipping_details'
  | 'order_delivered'
  | 'tech_support'
  | 'customer_service'
  | 'low_stock_alert'
  | 'age_verification_notice'
  | 'executive_daily_digest'
  | 'custom';

export interface EmailNotificationRule {
  id: string;
  template_type: NotificationTemplateType;
  title: string;
  description: string;
  enabled: boolean;
  trigger_event: string;
  recipient_target: 'customer' | 'admin' | 'owner' | 'employee' | 'custom';
  custom_recipient_email?: string;
  assigned_profile_id?: string; // Specific profile override (or 'default' to use active default profile)
  subject: string;
  body_html: string;
  body_text: string;
  available_variables: string[];
  created_at: string;
  updated_at: string;
}

export interface InboundEmailReply {
  id: string;
  sender_email: string;
  sender_name: string;
  body: string;
  sent_at: string;
}

export interface InboundEmailMessage {
  id: string;
  ticket_number: string;
  sender_email: string;
  sender_name: string;
  recipient_email: string;
  subject: string;
  category: 'tech_support' | 'customer_service' | 'billing' | 'order_inquiry' | 'general';
  body: string;
  status: 'unread' | 'replied' | 'in_progress' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigned_role?: UserRole;
  received_at: string;
  updated_at: string;
  replies: InboundEmailReply[];
}

export interface EmailLog {
  id: string;
  direction: 'outgoing' | 'incoming';
  from_email: string;
  to_email: string;
  subject: string;
  template_type?: NotificationTemplateType;
  status: 'sent' | 'delivered' | 'failed' | 'queued' | 'received';
  details?: string;
  timestamp: string;
}

// --- SMS NOTIFICATION & GATEWAY SYSTEM TYPES ---
export type SmsProviderType = 'twilio' | 'telnyx' | 'plivo' | 'aws_sns' | 'messagebird' | 'custom_webhook';

export interface SmsProfile {
  id: string;
  name: string; // e.g. "Primary Twilio Toll-Free Route", "Telnyx Backup Direct", "AWS SNS Express"
  is_default: boolean;
  provider_type: SmsProviderType;
  account_sid?: string;
  auth_token?: string;
  from_phone_number: string; // e.g. +1 (800) 555-0199 or BKRESEARCH
  messaging_service_sid?: string;
  api_key?: string;
  webhook_url?: string;
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  last_tested_at?: string;
  last_error_message?: string;
  created_at: string;
  updated_at: string;
}

export type SmsNotificationTemplateType =
  | 'order_confirmation_sms'
  | 'shipping_dispatch_sms'
  | 'order_delivered_sms'
  | 'asset_unlocked_sms'
  | 'security_code_sms'
  | 'low_stock_sms'
  | 'marketing_alert_sms'
  | 'custom_sms';

export interface SmsNotificationRule {
  id: string;
  template_type: SmsNotificationTemplateType;
  title: string;
  description: string;
  enabled: boolean;
  trigger_event: string;
  recipient_target: 'customer' | 'admin' | 'owner' | 'custom_phone';
  custom_recipient_phone?: string;
  assigned_sms_profile_id?: string; // Specific SMS profile override (or 'default' to use active SMS profile)
  message_body: string;
  available_variables: string[];
  created_at: string;
  updated_at: string;
}

export interface SmsLog {
  id: string;
  direction: 'outgoing' | 'incoming';
  from_phone: string;
  to_phone: string;
  message_body: string;
  template_type?: SmsNotificationTemplateType;
  provider_used: string;
  segment_count: number;
  status: 'sent' | 'delivered' | 'failed' | 'queued' | 'received';
  details?: string;
  timestamp: string;
}

export interface CommunicationSystemState {
  active_profile_id: string;
  profiles: EmailProfile[];
  provider_config: EmailProviderConfig;
  notification_rules: EmailNotificationRule[];
  inbound_messages: InboundEmailMessage[];
  email_logs: EmailLog[];
  auto_responder_enabled: boolean;
  auto_responder_subject: string;
  auto_responder_body: string;
  forward_inbound_to_owner: boolean;
  // SMS Notification System Extension
  active_sms_profile_id?: string;
  sms_profiles?: SmsProfile[];
  sms_notification_rules?: SmsNotificationRule[];
  sms_logs?: SmsLog[];
  sms_notifications_enabled?: boolean;
}

// --- REAL-TIME OTA (OVER-THE-AIR) APP & INSTRUCTION MANUAL AUTO-SYNC TYPES ---
export type ConnectedPlatformType = 'ios' | 'android' | 'web' | 'tablet' | 'terminal';

export interface ConnectedDevice {
  id: string;
  name: string; // e.g. "iOS Mobile Client (iPhone 16 Pro Max)"
  platform: ConnectedPlatformType;
  device_model: string;
  ip_address: string;
  status: 'online' | 'syncing' | 'offline' | 'updating';
  app_version: string;
  bundle_hash: string;
  last_heartbeat: string;
  last_synced_at: string;
  auto_update_enabled: boolean;
  battery_level?: number;
  sync_latency_ms?: number;
  location?: string;
  active_route?: string;
}

export type OtaChangeCategory =
  | 'design_theme'
  | 'spacing_layout'
  | 'feature_added'
  | 'feature_removed'
  | 'popup_config'
  | 'custom_page'
  | 'payment_gateway'
  | 'catalog_update'
  | 'manual_compiled'
  | 'manual_broadcast';

export interface OtaReleaseEntry {
  id: string;
  version: string; // e.g. "v4.3.2"
  category: OtaChangeCategory;
  title: string;
  description: string;
  affected_targets: ('ios' | 'android' | 'web' | 'manual')[];
  timestamp: string;
  author_name: string;
  author_email: string;
  broadcast_status: 'dispatched' | 'confirmed' | 'pending';
  synced_device_count: number;
  checksum: string;
  payload_summary?: Record<string, any>;
}

export interface OtaSyncSettings {
  auto_update_ios_enabled: boolean;
  auto_update_android_enabled: boolean;
  auto_update_manual_enabled: boolean;
  realtime_broadcast_enabled: boolean;
  auto_increment_version: boolean;
  client_live_toast_enabled: boolean;
  sound_effects_enabled: boolean;
  current_system_version: string;
  last_ota_broadcast_at: string;
  last_manual_compiled_at: string;
  active_channel_name: string;
  device_fleet: ConnectedDevice[];
  release_history: OtaReleaseEntry[];
}

export interface DynamicManualItem {
  id: string;
  title: string;
  category: string;
  module_type: 'core' | 'design' | 'page' | 'gateway' | 'popup' | 'catalog' | 'sync' | 'security';
  description: string;
  procedures: string[];
  last_auto_updated: string;
  status: 'active' | 'synced' | 'legacy';
  keywords: string[];
}

export interface DynamicInstructionManualState {
  version: string;
  last_compiled_at: string;
  auto_sync_active: boolean;
  total_sections: number;
  total_procedures: number;
  custom_pages_count: number;
  active_gateways_count: number;
  sections: DynamicManualItem[];
}


