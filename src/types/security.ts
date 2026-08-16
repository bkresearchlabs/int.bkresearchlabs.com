import { UserRole } from './index';

export type TLSVersion = 'TLSv1.2' | 'TLSv1.3' | 'TLSv1.2_and_1.3';
export type CipherSuite = 'strict_modern' | 'recommended_pci' | 'maximum_compatibility';
export type WAFInspectionMode = 'active_blocking' | 'learning_mode' | 'detection_only';
export type DDoSProtectionTier = 'standard' | 'enterprise_anycast' | 'under_attack_mode';
export type DDoSChallengeMode = 'js_challenge' | 'interactive_captcha' | 'silent_behavioral';
export type SameSiteOption = 'Strict' | 'Lax' | 'None';
export type XFrameOptions = 'DENY' | 'SAMEORIGIN';
export type ReferrerPolicyOption = 'strict-origin-when-cross-origin' | 'no-referrer' | 'origin-when-cross-origin';
export type EncryptionAlgorithm = 'AES-256-GCM' | 'ChaCha20-Poly1305';
export type SecretsVaultProvider = 'vault_aws' | 'vault_hashicorp' | 'cloud_secret_manager' | 'embedded_encrypted_keystore';

export interface TransportNetworkSecurityConfig {
  // SSL / TLS
  ssl_enforced: boolean;
  min_tls_version: TLSVersion;
  cipher_suites: CipherSuite;
  enforce_https_redirect: boolean;
  ocsp_stapling: boolean;
  forward_secrecy: boolean;

  // HSTS
  hsts_enabled: boolean;
  hsts_max_age_seconds: number;
  hsts_include_subdomains: boolean;
  hsts_preload: boolean;

  // Layer 7 WAF
  waf_enabled: boolean;
  waf_inspection_mode: WAFInspectionMode;
  waf_sqli_protection: boolean;
  waf_xss_protection: boolean;
  waf_lfi_rfi_protection: boolean;
  waf_bad_bot_blocking: boolean;
  waf_geo_blocking_enabled: boolean;
  waf_blocked_countries: string[];
  waf_custom_ip_blacklist: string[];
  waf_custom_ip_whitelist: string[];

  // DDoS Mitigation
  ddos_mitigation_enabled: boolean;
  ddos_protection_tier: DDoSProtectionTier;
  ddos_rate_scrubbing_threshold_req_per_sec: number;
  ddos_challenge_mode: DDoSChallengeMode;
  ddos_auto_mitigate: boolean;

  // API Gateway & Rate Limiting
  api_rate_limiting_enabled: boolean;
  api_rate_limit_per_minute: number;
  api_burst_tolerance: number;
  api_graphql_max_depth: number;
  api_credential_stuffing_throttle_enabled: boolean;
}

export interface AuthSessionSecurityConfig {
  // MFA / 2FA
  mfa_enabled: boolean;
  mfa_enforce_for_roles: UserRole[];
  mfa_allowed_factors: ('totp' | 'webauthn_fido2' | 'email_otp' | 'sms_otp')[];
  mfa_grace_period_days: number;
  mfa_recovery_codes_count: number;

  // RBAC & Least Privilege
  rbac_strict_least_privilege: boolean;
  rbac_session_elevation_required: boolean;
  rbac_privilege_escalation_alerts: boolean;

  // Brute Force & Credential Stuffing
  brute_force_protection_enabled: boolean;
  brute_force_max_failed_attempts: number;
  brute_force_lockout_duration_minutes: number;
  brute_force_ip_reputation_blocking: boolean;
  brute_force_captcha_trigger_failures: number;

  // Cookies
  cookie_http_only: boolean;
  cookie_secure_flag: boolean;
  cookie_same_site: SameSiteOption;
  cookie_domain_scoping_strict: boolean;

  // Session Lifecycle
  session_inactivity_timeout_minutes: number;
  session_absolute_timeout_hours: number;
  session_rotate_token_on_privilege_change: boolean;
  session_terminate_on_browser_close: boolean;
  session_single_active_session_per_user: boolean;
}

export interface DataPrivacySecurityConfig {
  // Encryption at Rest
  encryption_at_rest_enabled: boolean;
  encryption_algorithm: EncryptionAlgorithm;
  field_level_encryption_pii: boolean;
  auto_key_rotation_days: number;
  active_key_fingerprint: string;

  // PCI-DSS Compliance
  pci_dss_compliance_mode: 'saq_a_tokenized' | 'saq_a_ep' | 'saq_d';
  pci_block_raw_pan_storage: boolean;
  pci_tokenize_all_card_data: boolean;
  pci_cvv_zero_retention_enforced: boolean;
  pci_compliance_certified: boolean;

  // Secrets & Key Management
  secrets_vault_provider: SecretsVaultProvider;
  secrets_auto_scan_code_leaks: boolean;
  secrets_key_rotation_enabled: boolean;
  secrets_last_vault_audit: string;

  // Data Minimization & PII Masking
  pii_mask_emails_in_logs: boolean;
  pii_mask_phones_in_logs: boolean;
  pii_mask_credit_cards_in_logs: boolean;
  pii_anonymize_analytics_ips: boolean;
  pii_gdpr_ccpa_export_enabled: boolean;
}

export interface MobileAppSecurityConfig {
  // SSL / TLS Pinning
  cert_pinning_enabled: boolean;
  cert_pinning_sha256_hashes: string[];
  cert_pinning_backup_hashes: string[];
  cert_pinning_allow_debug_fallback: boolean;

  // Secure Local Storage
  secure_storage_ios_keychain: boolean;
  secure_storage_android_encrypted_prefs: boolean;
  secure_storage_block_jailbroken_rooted: boolean;

  // Code Obfuscation & RASP
  r8_proguard_obfuscation_active: boolean;
  anti_tamper_rasp_active: boolean;
  anti_debugger_detection_active: boolean;
  root_jailbreak_auto_terminate: boolean;

  // Biometrics
  biometrics_enabled: boolean;
  biometrics_require_for_financial_actions: boolean;
  biometrics_allow_fallback_to_pin: boolean;
  biometrics_prompt_title: string;
}

export interface InfrastructureHardeningConfig {
  // SDLC / SAST / SCA
  automated_ci_cd_sast_enabled: boolean;
  dependency_cve_scanning_active: boolean;
  block_build_on_critical_cve: boolean;
  last_sast_scan_timestamp: string;

  // Input Validation & Output Encoding
  strict_server_sanitization: boolean;
  anti_bola_authorization_checks: boolean;
  html_entity_output_encoding: boolean;
  sql_parameterization_enforced: boolean;

  // HTTP Security Headers
  csp_enabled: boolean;
  csp_header_value: string;
  x_frame_options: XFrameOptions;
  x_content_type_options: 'nosniff';
  permissions_policy: string;
  referrer_policy: ReferrerPolicyOption;

  // Vulnerability Assessments & Pentests
  scheduled_pentest_interval_months: number;
  auto_vulnerability_scan_daily: boolean;
  last_pentest_grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  last_pentest_timestamp: string;
  open_vulnerabilities_count: number;
}

export interface LockedOutIPEntry {
  id: string;
  ip: string;
  failed_attempts: number;
  reason: string;
  locked_at: string;
  expires_at: string;
  country?: string;
  status: 'locked' | 'unlocked' | 'whitelisted';
  locked_by?: string;
}

export interface SecurityAdminActionLog {
  id: string;
  admin_id: string;
  admin_email: string;
  role: 'security_admin' | 'admin' | 'owner';
  action_type:
    | 'waf_config_changed'
    | 'waf_aggressive_deployed'
    | 'waf_aggressive_reverted'
    | 'rate_limit_adjusted'
    | 'ssl_enforced'
    | 'ip_locked'
    | 'ip_unlocked'
    | 'ip_whitelisted'
    | 'emergency_lockdown_toggled'
    | 'emergency_lockout_deployed'
    | 'emergency_lockout_reverted'
    | 'sessions_purged'
    | 'threat_quarantined'
    | 'preset_applied'
    | 'policy_updated'
    | 'keys_rotated'
    | 'penetration_test_run'
    | 'supervisor_review';
  action_title: string;
  description: string;
  target_module: string;
  timestamp: string;
  ip_address: string;
  before_value?: string;
  after_value?: string;
  supervisor_status: 'pending_review' | 'approved' | 'flagged';
  reviewed_by?: string;
  reviewed_at?: string;
  supervisor_notes?: string;
}

export interface GlobalSecuritySettings {
  id: string;
  is_emergency_lockdown_active: boolean;
  is_emergency_lockout_active?: boolean;
  is_waf_aggressive_mode?: boolean;
  emergency_lockout_reason?: string;
  emergency_lockout_deployed_at?: string;
  emergency_lockout_deployed_by?: string;
  waf_aggressive_deployed_at?: string;
  waf_aggressive_deployed_by?: string;
  active_preset: 'laboratory_strict' | 'pci_high_security' | 'balanced_ecommerce' | 'custom';
  updated_at: string;
  updated_by: string;

  // The 5 Pillars
  transport_network: TransportNetworkSecurityConfig;
  auth_session: AuthSessionSecurityConfig;
  data_privacy: DataPrivacySecurityConfig;
  mobile_app: MobileAppSecurityConfig;
  infrastructure: InfrastructureHardeningConfig;

  // Dynamic Lockouts & SecAdmin Activity Ledger
  locked_ips?: LockedOutIPEntry[];
  sec_admin_logs?: SecurityAdminActionLog[];
}

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ThreatCategory = 'sqli' | 'xss' | 'ddos' | 'brute_force' | 'bot_scraping' | 'lfi_rfi' | 'tamper_attempt' | 'pinning_mismatch';

export interface SecurityThreatEvent {
  id: string;
  timestamp: string;
  category: ThreatCategory;
  severity: ThreatSeverity;
  source_ip: string;
  country_code: string;
  endpoint: string;
  payload_sample: string;
  action_taken: 'blocked_by_waf' | 'rate_limited' | 'ip_locked_out' | 'challenge_issued' | 'logged_only';
  mitigated_by_rule: string;
}

export interface SecurityAuditItem {
  id: string;
  category: 'Transport & Network' | 'Auth & Session' | 'Data & Privacy' | 'Mobile Apps' | 'Infra & Hardening';
  title: string;
  description: string;
  compliance_standard: 'PCI-DSS v4.0' | 'OWASP Top 10' | 'SOC2 Type II' | 'NIST 800-53' | 'ISO 27001' | 'GDPR/CCPA';
  status: 'passed' | 'warning' | 'critical_failure' | 'in_progress';
  severity: ThreatSeverity;
  recommendation: string;
  is_automated_enforced: boolean;
}

// ============================================================================
// INDIVIDUAL USER ACCOUNT SECURITY & AUTHENTICATION DEVICE TYPES
// ============================================================================

export type HardwareKeyDeviceType =
  | 'yubikey_5_nfc'
  | 'yubikey_5_ci'
  | 'google_titan'
  | 'touch_id'
  | 'face_id'
  | 'windows_hello'
  | 'feitian_epass'
  | 'generic_fido2';

export type HardwareKeyTransport = 'usb' | 'nfc' | 'ble' | 'internal';

export interface RegisteredHardwareKey {
  id: string;
  name: string;
  device_type: HardwareKeyDeviceType;
  transport: HardwareKeyTransport;
  credential_id: string;
  public_key_algo: string; // e.g. "ES256 (ECDSA P-256)", "Ed25519", "RS256"
  aaguid?: string;
  created_at: string;
  last_authenticated_at: string;
  usage_count: number;
  is_backed_up: boolean;
  status: 'active' | 'suspended' | 'revoked';
}

export type DeviceSessionIcon = 'laptop' | 'smartphone' | 'tablet' | 'desktop';

export interface UserActiveSessionDevice {
  id: string;
  device_name: string;
  device_icon: DeviceSessionIcon;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  is_current_session: boolean;
  last_active_at: string;
  sign_in_method: 'password' | 'totp' | 'hardware_key' | 'google_sso';
  created_at: string;
  trusted_status: 'trusted' | 'new_device' | 'pending_verification';
}

export interface UserSecurityPreferences {
  require_mfa_every_login: boolean;
  remember_device_days: number;
  require_hardware_key_for_sensitive_ops: boolean;
  email_alerts_new_device: boolean;
  email_alerts_security_changes: boolean;
  auto_logout_inactivity_minutes: number;
}

export interface UserAccountSecurity {
  user_id: string;
  user_email: string;
  totp_enabled: boolean;
  totp_secret: string;
  totp_created_at?: string;
  totp_algorithm: 'SHA1' | 'SHA256';
  totp_digits: number;
  totp_period_seconds: number;
  backup_codes: string[];
  backup_codes_remaining: number;
  hardware_keys: RegisteredHardwareKey[];
  active_devices: UserActiveSessionDevice[];
  preferences: UserSecurityPreferences;
  last_security_audit_at: string;
}

