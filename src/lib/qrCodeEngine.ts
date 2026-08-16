import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {
  QRCodeType,
  QRErrorCorrectionLevel,
  QRDesignConfig,
  QRVCardData,
  QRWifiData,
  QREmailData,
  QRPhoneData,
  QRSmsData,
  QRWhatsappData,
  QRGeoData,
  QREventData,
  QRCryptoData,
  QRProductCOAData,
  QRAppData,
  SavedQRCode,
  DecodedQRResult
} from '../types/qr';

// --------------------------------------------------------------------------
// DEFAULT PRESETS & INITIAL CONFIGS
// --------------------------------------------------------------------------

export const DEFAULT_QR_DESIGN: QRDesignConfig = {
  fgColor: '#0f172a',
  bgColor: '#ffffff',
  transparentBg: false,
  gradientType: 'none',
  gradientColor2: '#2563eb',
  dotStyle: 'rounded',
  cornerSquareStyle: 'extra-rounded',
  cornerDotStyle: 'dot',
  customCornerColor: false,
  cornerSquareColor: '#0f172a',
  cornerDotColor: '#2563eb',
  errorCorrectionLevel: 'H', // Default to High for maximum scanning reliability & logo support
  margin: 2,
  logo: {
    type: 'preset',
    presetId: 'bkr_flask',
    sizeRatio: 0.22,
    clearZoneMargin: 6,
    bgShape: 'circle',
    bgColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0'
  },
  frame: {
    style: 'bottom-badge',
    text: 'SCAN TO VERIFY',
    subText: 'BK RESEARCH LABS',
    color: '#0f172a',
    textColor: '#ffffff'
  }
};

export const QR_LOGO_PRESETS: { id: string; label: string; category: string; svg: string }[] = [
  {
    id: 'bkr_flask',
    label: 'BK Lab Flask',
    category: 'Scientific',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`
  },
  {
    id: 'dna_helix',
    label: 'DNA Helix',
    category: 'Scientific',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 12.5 1 1"/><path d="m16.5 10.5 1 1"/><path d="m10 16 1 1"/></svg>`
  },
  {
    id: 'shield_check',
    label: 'COA Shield',
    category: 'Security',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`
  },
  {
    id: 'atom_chem',
    label: 'Atomic Core',
    category: 'Scientific',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 8.3c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>`
  },
  {
    id: 'wifi_signal',
    label: 'Wi-Fi Signal',
    category: 'Tech',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg>`
  },
  {
    id: 'contact_user',
    label: 'vCard Contact',
    category: 'Communication',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    id: 'crypto_btc',
    label: 'Bitcoin BTC',
    category: 'Payment',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.866c4.372.771 5.574-5.344 1.201-6.115m-1.201 6.115L7.076 11.15m5.908 1.042-.348 1.97m1.549-8.087-.348 1.97M9.07 3.65l-.348 1.97M6.728 5.62l9.04 1.594M5.86 18.047l2.33-13.228"/></svg>`
  },
  {
    id: 'crypto_eth',
    label: 'Ethereum ETH',
    category: 'Payment',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12 12 2l6 10-6 3.5L6 12Z"/><path d="m6 13.5 6 8.5 6-8.5-6 3.5-6-3.5Z"/></svg>`
  },
  {
    id: 'mail_envelope',
    label: 'Email Inbox',
    category: 'Communication',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
  },
  {
    id: 'phone_call',
    label: 'Phone Call',
    category: 'Communication',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  },
  {
    id: 'geo_pin',
    label: 'Location Pin',
    category: 'Navigation',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
  },
  {
    id: 'star_badge',
    label: 'VIP Star',
    category: 'General',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  }
];

// Initial Seed Library
export const INITIAL_SAVED_QR_CODES: SavedQRCode[] = [
  {
    id: 'qr-bkr-store-official',
    title: 'BK Research Official Web Store',
    description: 'Direct link to analytical standards catalog & store portal',
    category: 'Marketing',
    type: 'url',
    payload: {
      url: 'https://bkresearchlabs.com',
      addUtm: true,
      utmSource: 'qr_print',
      utmMedium: 'packaging',
      utmCampaign: 'catalog_launch'
    },
    rawText: 'https://bkresearchlabs.com?utm_source=qr_print&utm_medium=packaging&utm_campaign=catalog_launch',
    design: {
      ...DEFAULT_QR_DESIGN,
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      frame: {
        style: 'bottom-badge',
        text: 'SCAN TO SHOP',
        subText: 'BKRESEARCHLABS.COM',
        color: '#0f172a',
        textColor: '#ffffff'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Store', 'Official', 'Homepage'],
    isFavorite: true
  },
  {
    id: 'qr-coa-batch-verifier',
    title: 'Batch COA 2026-X99 HPLC Verification',
    description: 'Instant HPLC purity & spectroscopy certificate verification',
    category: 'Quality & COA',
    type: 'product_coa',
    payload: {
      productId: 'prod-bpc157',
      productName: 'BPC-157 Lyophilized Peptide (5mg)',
      batchNumber: 'BKR-2026-9942A',
      purity: '99.42% (HPLC)',
      testedDate: '2026-06-12',
      verificationUrl: 'https://bkresearchlabs.com/verify?batch=BKR-2026-9942A',
      labDirector: 'Dr. A. Vance, Ph.D.'
    },
    rawText: 'https://bkresearchlabs.com/verify?batch=BKR-2026-9942A&product=BPC-157&purity=99.42',
    design: {
      ...DEFAULT_QR_DESIGN,
      fgColor: '#064e3b',
      bgColor: '#ffffff',
      dotStyle: 'classy',
      cornerSquareStyle: 'leaf',
      cornerDotStyle: 'diamond',
      customCornerColor: true,
      cornerSquareColor: '#047857',
      cornerDotColor: '#059669',
      logo: {
        type: 'preset',
        presetId: 'shield_check',
        sizeRatio: 0.24,
        clearZoneMargin: 6,
        bgShape: 'circle',
        bgColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#10b981'
      },
      frame: {
        style: 'bottom-badge',
        text: 'VERIFY LAB COA',
        subText: 'HPLC PURITY 99.42%',
        color: '#064e3b',
        textColor: '#ffffff'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['COA', 'Quality', 'HPLC', 'Batch'],
    isFavorite: true
  },
  {
    id: 'qr-lab-wifi-guest',
    title: 'BK Lab Guest High-Speed Wi-Fi',
    description: 'Secure WPA3 auto-connect profile for authorized visitors',
    category: 'Operations',
    type: 'wifi',
    payload: {
      ssid: 'BK-Research-SecureGuest',
      encryption: 'WPA',
      password: 'BKResearchLab2026!',
      hidden: false
    },
    rawText: 'WIFI:T:WPA;S:BK-Research-SecureGuest;P:BKResearchLab2026!;H:false;;',
    design: {
      ...DEFAULT_QR_DESIGN,
      fgColor: '#1e3a8a',
      bgColor: '#ffffff',
      dotStyle: 'dots',
      cornerSquareStyle: 'circle',
      cornerDotStyle: 'circle',
      logo: {
        type: 'preset',
        presetId: 'wifi_signal',
        sizeRatio: 0.22,
        clearZoneMargin: 6,
        bgShape: 'circle',
        bgColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#3b82f6'
      },
      frame: {
        style: 'bottom-banner',
        text: 'CONNECT TO GUEST WI-FI',
        subText: 'BK-Research-SecureGuest',
        color: '#1e3a8a',
        textColor: '#ffffff'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Wi-Fi', 'Guest', 'Office'],
    isFavorite: false
  },
  {
    id: 'qr-support-vcard',
    title: 'Senior Chemist & Support vCard',
    description: 'Digital contact card for technical inquiries & chemical logistics',
    category: 'Contact',
    type: 'vcard',
    payload: {
      firstName: 'Support',
      lastName: 'Desk',
      organization: 'BK Research Labs Inc.',
      title: 'Technical Support & Dispatch',
      workPhone: '+1 (800) 555-0199',
      cellPhone: '+1 (415) 555-0144',
      email: 'support@bkresearchlabs.com',
      url: 'https://bkresearchlabs.com',
      street: '100 Research Parkway, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'USA',
      notes: 'BK Research Official Support Desk'
    },
    rawText: `BEGIN:VCARD\nVERSION:3.0\nN:Desk;Support;;;\nFN:Support Desk\nORG:BK Research Labs Inc.\nTITLE:Technical Support & Dispatch\nTEL;TYPE=WORK,VOICE:+1 (800) 555-0199\nTEL;TYPE=CELL,VOICE:+1 (415) 555-0144\nEMAIL;TYPE=PREF,INTERNET:support@bkresearchlabs.com\nURL:https://bkresearchlabs.com\nADR;TYPE=WORK:;;100 Research Parkway, Suite 400;San Francisco;CA;94107;USA\nNOTE:BK Research Official Support Desk\nEND:VCARD`,
    design: {
      ...DEFAULT_QR_DESIGN,
      fgColor: '#312e81',
      bgColor: '#ffffff',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      logo: {
        type: 'preset',
        presetId: 'contact_user',
        sizeRatio: 0.22,
        clearZoneMargin: 6,
        bgShape: 'circle',
        bgColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#6366f1'
      },
      frame: {
        style: 'bottom-badge',
        text: 'SAVE CONTACT',
        subText: 'BK TECHNICAL DESK',
        color: '#312e81',
        textColor: '#ffffff'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Contact', 'vCard', 'Support'],
    isFavorite: false
  },
  {
    id: 'qr-btc-settlement',
    title: 'Corporate Bitcoin Cold Settlement',
    description: 'Direct blockchain invoice payment QR code',
    category: 'Payment',
    type: 'crypto',
    payload: {
      coin: 'BTC',
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      amount: '0.015',
      label: 'BK Research Invoice #10492',
      message: 'Payment for Analytical Synthesis Order'
    },
    rawText: 'bitcoin:bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq?amount=0.015&label=BK%20Research%20Invoice%20%2310492&message=Payment%20for%20Analytical%20Synthesis%20Order',
    design: {
      ...DEFAULT_QR_DESIGN,
      fgColor: '#78350f',
      bgColor: '#ffffff',
      dotStyle: 'diamond',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'diamond',
      logo: {
        type: 'preset',
        presetId: 'crypto_btc',
        sizeRatio: 0.24,
        clearZoneMargin: 6,
        bgShape: 'circle',
        bgColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#f59e0b'
      },
      frame: {
        style: 'bottom-badge',
        text: 'PAY WITH BITCOIN',
        subText: 'INVOICE #10492',
        color: '#78350f',
        textColor: '#ffffff'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Crypto', 'Bitcoin', 'Payment'],
    isFavorite: false
  }
];

// --------------------------------------------------------------------------
// STRING ENCODING HELPERS FOR QR TYPES
// --------------------------------------------------------------------------

export function buildQRString(type: QRCodeType, payload: any): string {
  if (!payload) return '';

  switch (type) {
    case 'url': {
      let url = (payload.url || '').trim();
      if (!url) return '';
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      if (payload.addUtm && (payload.utmSource || payload.utmCampaign)) {
        try {
          const u = new URL(url);
          if (payload.utmSource) u.searchParams.set('utm_source', payload.utmSource);
          if (payload.utmMedium) u.searchParams.set('utm_medium', payload.utmMedium);
          if (payload.utmCampaign) u.searchParams.set('utm_campaign', payload.utmCampaign);
          if (payload.utmTerm) u.searchParams.set('utm_term', payload.utmTerm);
          return u.toString();
        } catch {
          return url;
        }
      }
      return url;
    }

    case 'text':
      return payload.text || '';

    case 'vcard': {
      const d: QRVCardData = payload;
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${d.lastName || ''};${d.firstName || ''};;;`,
        `FN:${`${d.firstName || ''} ${d.lastName || ''}`.trim()}`,
        d.organization ? `ORG:${d.organization}` : '',
        d.title ? `TITLE:${d.title}` : '',
        d.workPhone ? `TEL;TYPE=WORK,VOICE:${d.workPhone}` : '',
        d.cellPhone ? `TEL;TYPE=CELL,VOICE:${d.cellPhone}` : '',
        d.email ? `EMAIL;TYPE=PREF,INTERNET:${d.email}` : '',
        d.url ? `URL:${d.url}` : '',
        (d.street || d.city || d.state || d.zip || d.country)
          ? `ADR;TYPE=WORK:;;${d.street || ''};${d.city || ''};${d.state || ''};${d.zip || ''};${d.country || ''}`
          : '',
        d.notes ? `NOTE:${d.notes}` : '',
        'END:VCARD'
      ].filter(Boolean);
      return lines.join('\n');
    }

    case 'wifi': {
      const d: QRWifiData = payload;
      const escape = (s: string) => (s || '').replace(/([\\;,:"])/g, '\\$1');
      const auth = d.encryption === 'nopass' ? 'nopass' : d.encryption || 'WPA';
      const hidden = d.hidden ? 'true' : 'false';
      return `WIFI:T:${auth};S:${escape(d.ssid || '')};P:${escape(d.password || '')};H:${hidden};;`;
    }

    case 'email': {
      const d: QREmailData = payload;
      if (!d.email) return '';
      const params = new URLSearchParams();
      if (d.cc) params.set('cc', d.cc);
      if (d.bcc) params.set('bcc', d.bcc);
      if (d.subject) params.set('subject', d.subject);
      if (d.body) params.set('body', d.body);
      const query = params.toString();
      return `mailto:${d.email}${query ? `?${query}` : ''}`;
    }

    case 'phone': {
      const d: QRPhoneData = payload;
      const num = (d.phoneNumber || '').trim();
      return num ? `tel:${num}` : '';
    }

    case 'sms': {
      const d: QRSmsData = payload;
      const num = (d.phoneNumber || '').trim();
      return `SMSTO:${num}:${d.message || ''}`;
    }

    case 'whatsapp': {
      const d: QRWhatsappData = payload;
      const num = `${d.countryCode || ''}${d.phoneNumber || ''}`.replace(/[^0-9]/g, '');
      const text = encodeURIComponent(d.message || '');
      return `https://wa.me/${num}${text ? `?text=${text}` : ''}`;
    }

    case 'geo': {
      const d: QRGeoData = payload;
      const lat = (d.latitude || '').trim();
      const lng = (d.longitude || '').trim();
      if (!lat || !lng) return '';
      if (d.openGoogleMaps) {
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      }
      return `geo:${lat},${lng}${d.label ? `?q=${encodeURIComponent(d.label)}` : ''}`;
    }

    case 'event': {
      const d: QREventData = payload;
      const formatDT = (date: string, time: string) => {
        if (!date) return '';
        const cleanDate = date.replace(/-/g, '');
        const cleanTime = (time || '00:00').replace(/:/g, '') + '00';
        return `${cleanDate}T${cleanTime}`;
      };
      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//BK Research Labs//QR Studio//EN',
        'BEGIN:VEVENT',
        `SUMMARY:${d.title || 'Meeting'}`,
        d.location ? `LOCATION:${d.location}` : '',
        d.description ? `DESCRIPTION:${d.description}` : '',
        d.startDate ? `DTSTART:${formatDT(d.startDate, d.startTime)}` : '',
        d.endDate ? `DTEND:${formatDT(d.endDate, d.endTime)}` : '',
        d.url ? `URL:${d.url}` : '',
        'END:VEVENT',
        'END:VCALENDAR'
      ].filter(Boolean);
      return lines.join('\n');
    }

    case 'crypto': {
      const d: QRCryptoData = payload;
      const addr = (d.address || '').trim();
      if (!addr) return '';
      if (d.coin === 'BTC') {
        const params = new URLSearchParams();
        if (d.amount) params.set('amount', d.amount);
        if (d.label) params.set('label', d.label);
        if (d.message) params.set('message', d.message);
        const q = params.toString();
        return `bitcoin:${addr}${q ? `?${q}` : ''}`;
      }
      if (d.coin === 'ETH') {
        return `ethereum:${addr}${d.amount ? `?value=${d.amount}` : ''}`;
      }
      if (d.coin === 'SOL') {
        return `solana:${addr}${d.amount ? `?amount=${d.amount}` : ''}`;
      }
      return `${d.coin.toLowerCase()}:${addr}`;
    }

    case 'product_coa': {
      const d: QRProductCOAData = payload;
      const base = (d.verificationUrl || 'https://bkresearchlabs.com/verify').trim();
      const params = new URLSearchParams();
      if (d.batchNumber) params.set('batch', d.batchNumber);
      if (d.productId) params.set('product', d.productId);
      if (d.purity) params.set('purity', d.purity);
      return `${base}?${params.toString()}`;
    }

    case 'app': {
      const d: QRAppData = payload;
      if (d.platform === 'ios') return d.iosUrl || '';
      if (d.platform === 'android') return d.androidUrl || '';
      return d.iosUrl || d.androidUrl || '';
    }

    default:
      return String(payload || '');
  }
}

// --------------------------------------------------------------------------
// PARSE STRING INTO STRUCTURED DECODED OBJECT
// --------------------------------------------------------------------------

export function parseQRString(raw: string): {
  type: QRCodeType;
  parsed: any;
  displayTitle: string;
} {
  const text = (raw || '').trim();

  // 1. Wi-Fi
  if (text.startsWith('WIFI:')) {
    const typeMatch = text.match(/T:([^;]*);/);
    const ssidMatch = text.match(/S:([^;]*);/);
    const passMatch = text.match(/P:([^;]*);/);
    const hiddenMatch = text.match(/H:([^;]*);/);
    return {
      type: 'wifi',
      displayTitle: `Wi-Fi: ${ssidMatch ? ssidMatch[1] : 'Unknown Network'}`,
      parsed: {
        ssid: ssidMatch ? ssidMatch[1].replace(/\\([\\;,:"])/g, '$1') : '',
        encryption: typeMatch ? typeMatch[1] : 'WPA',
        password: passMatch ? passMatch[1].replace(/\\([\\;,:"])/g, '$1') : '',
        hidden: hiddenMatch ? hiddenMatch[1].toLowerCase() === 'true' : false
      }
    };
  }

  // 2. vCard
  if (text.includes('BEGIN:VCARD')) {
    const fnMatch = text.match(/FN:(.+)/i);
    const orgMatch = text.match(/ORG:(.+)/i);
    const titleMatch = text.match(/TITLE:(.+)/i);
    const telWorkMatch = text.match(/TEL;TYPE=.*WORK.*:(.+)/i) || text.match(/TEL;.*:(.+)/i);
    const emailMatch = text.match(/EMAIL.*:(.+)/i);
    const urlMatch = text.match(/URL.*:(.+)/i);
    return {
      type: 'vcard',
      displayTitle: `Contact: ${fnMatch ? fnMatch[1].trim() : 'Digital Business Card'}`,
      parsed: {
        fullName: fnMatch ? fnMatch[1].trim() : '',
        organization: orgMatch ? orgMatch[1].trim() : '',
        title: titleMatch ? titleMatch[1].trim() : '',
        phone: telWorkMatch ? telWorkMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : '',
        url: urlMatch ? urlMatch[1].trim() : ''
      }
    };
  }

  // 3. Email
  if (text.startsWith('mailto:')) {
    const parts = text.substring(7).split('?');
    const email = parts[0];
    const params = new URLSearchParams(parts[1] || '');
    return {
      type: 'email',
      displayTitle: `Email: ${email}`,
      parsed: {
        email,
        subject: params.get('subject') || '',
        body: params.get('body') || ''
      }
    };
  }

  // 4. Phone
  if (text.startsWith('tel:')) {
    const num = text.substring(4);
    return {
      type: 'phone',
      displayTitle: `Phone: ${num}`,
      parsed: { phoneNumber: num }
    };
  }

  // 5. SMS
  if (text.startsWith('SMSTO:')) {
    const parts = text.substring(6).split(':');
    return {
      type: 'sms',
      displayTitle: `SMS to ${parts[0]}`,
      parsed: {
        phoneNumber: parts[0] || '',
        message: parts.slice(1).join(':') || ''
      }
    };
  }

  // 6. WhatsApp
  if (text.includes('wa.me/')) {
    return {
      type: 'whatsapp',
      displayTitle: 'WhatsApp Direct Chat',
      parsed: { url: text }
    };
  }

  // 7. Geo Location
  if (text.startsWith('geo:')) {
    const coords = text.substring(4).split('?')[0].split(',');
    return {
      type: 'geo',
      displayTitle: `GPS: ${coords[0]}, ${coords[1]}`,
      parsed: {
        latitude: coords[0] || '',
        longitude: coords[1] || ''
      }
    };
  }

  // 8. Crypto
  if (text.startsWith('bitcoin:') || text.startsWith('ethereum:') || text.startsWith('solana:')) {
    const colonIdx = text.indexOf(':');
    const coin = text.substring(0, colonIdx).toUpperCase();
    const rest = text.substring(colonIdx + 1);
    const addr = rest.split('?')[0];
    return {
      type: 'crypto',
      displayTitle: `${coin} Payment: ${addr.substring(0, 10)}...`,
      parsed: { coin, address: addr, fullUri: text }
    };
  }

  // 9. COA & Product Verification Link
  if (text.includes('verify') && text.includes('batch=')) {
    return {
      type: 'product_coa',
      displayTitle: 'BK Research COA Batch Verification',
      parsed: { url: text }
    };
  }

  // 10. URL
  if (/^https?:\/\//i.test(text)) {
    return {
      type: 'url',
      displayTitle: `URL: ${text}`,
      parsed: { url: text }
    };
  }

  // Default: Plain text
  return {
    type: 'text',
    displayTitle: text.length > 30 ? text.substring(0, 30) + '...' : text,
    parsed: { text }
  };
}

// --------------------------------------------------------------------------
// MATRIX CORNER DETECTION HELPER
// --------------------------------------------------------------------------

function isCornerSquare(row: number, col: number, size: number): boolean {
  // Top-Left (7x7)
  if (row < 7 && col < 7) return true;
  // Top-Right (7x7)
  if (row < 7 && col >= size - 7) return true;
  // Bottom-Left (7x7)
  if (row >= size - 7 && col < 7) return true;
  return false;
}

function isCornerDot(row: number, col: number, size: number): boolean {
  // Inner 3x3 of Top-Left: row 2..4, col 2..4
  if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
  // Inner 3x3 of Top-Right: row 2..4, col size-5..size-3
  if (row >= 2 && row <= 4 && col >= size - 5 && col <= size - 3) return true;
  // Inner 3x3 of Bottom-Left: row size-5..size-3, col 2..4
  if (row >= size - 5 && row <= size - 3 && col >= 2 && col <= 4) return true;
  return false;
}

// --------------------------------------------------------------------------
// ADVANCED CANVAS RENDERING ENGINE
// --------------------------------------------------------------------------

export interface RenderCanvasOptions {
  canvas: HTMLCanvasElement;
  text: string;
  design: QRDesignConfig;
  resolution?: number; // e.g. 1024
  includeFrame?: boolean;
}

export async function renderQRToCanvas(options: RenderCanvasOptions): Promise<void> {
  const { canvas, text, design, resolution = 1024, includeFrame = true } = options;
  if (!text) return;

  // 1. Generate QR Code Matrix using QRCode library
  const qrData = QRCode.create(text, {
    errorCorrectionLevel: design.errorCorrectionLevel || 'H'
  });

  const matrixSize = qrData.modules.size;
  const marginModules = Math.max(0, design.margin ?? 2);
  const totalGridSize = matrixSize + marginModules * 2;

  // Set physical dimensions
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, resolution, resolution);

  // Determine frame space
  const hasFrame = includeFrame && design.frame && design.frame.style !== 'none';
  let qrTop = 0;
  let qrLeft = 0;
  let qrWidth = resolution;
  let qrHeight = resolution;
  let frameHeight = 0;

  if (hasFrame) {
    if (design.frame.style === 'bottom-badge' || design.frame.style === 'bottom-banner') {
      frameHeight = resolution * 0.16;
      qrHeight = resolution - frameHeight;
      qrWidth = qrHeight; // keep square
      qrLeft = (resolution - qrWidth) / 2;
      qrTop = resolution * 0.03;
    } else if (design.frame.style === 'top-banner') {
      frameHeight = resolution * 0.16;
      qrTop = frameHeight + resolution * 0.03;
      qrHeight = resolution - frameHeight - resolution * 0.04;
      qrWidth = qrHeight;
      qrLeft = (resolution - qrWidth) / 2;
    } else if (design.frame.style === 'polaroid') {
      frameHeight = resolution * 0.22;
      qrTop = resolution * 0.04;
      qrHeight = resolution - frameHeight - resolution * 0.06;
      qrWidth = qrHeight;
      qrLeft = (resolution - qrWidth) / 2;
    }
  }

  // Draw Overall Frame Background if enabled
  if (hasFrame) {
    if (!design.transparentBg) {
      ctx.fillStyle = design.bgColor || '#ffffff';
      ctx.fillRect(0, 0, resolution, resolution);
    }

    // Frame Banner Background
    const frameColor = design.frame.color || '#0f172a';
    const textColor = design.frame.textColor || '#ffffff';

    ctx.save();
    if (design.frame.style === 'bottom-badge') {
      // Rounded bottom pill badge
      const pillWidth = resolution * 0.88;
      const pillHeight = frameHeight * 0.72;
      const pillX = (resolution - pillWidth) / 2;
      const pillY = resolution - pillHeight - resolution * 0.03;
      const radius = pillHeight / 2;

      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, radius);
      ctx.fill();

      // Typography
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.round(pillHeight * 0.42)}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(design.frame.text.toUpperCase(), resolution / 2, pillY + pillHeight * (design.frame.subText ? 0.38 : 0.5));

      if (design.frame.subText) {
        ctx.font = `600 ${Math.round(pillHeight * 0.24)}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = textColor + 'cc';
        ctx.fillText(design.frame.subText.toUpperCase(), resolution / 2, pillY + pillHeight * 0.75);
      }
    } else if (design.frame.style === 'bottom-banner') {
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, resolution - frameHeight, resolution, frameHeight);

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.round(frameHeight * 0.38)}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(design.frame.text.toUpperCase(), resolution / 2, resolution - frameHeight * (design.frame.subText ? 0.62 : 0.5));

      if (design.frame.subText) {
        ctx.font = `500 ${Math.round(frameHeight * 0.22)}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = textColor + 'cc';
        ctx.fillText(design.frame.subText.toUpperCase(), resolution / 2, resolution - frameHeight * 0.28);
      }
    } else if (design.frame.style === 'top-banner') {
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, resolution, frameHeight);

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.round(frameHeight * 0.38)}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(design.frame.text.toUpperCase(), resolution / 2, frameHeight * (design.frame.subText ? 0.38 : 0.5));

      if (design.frame.subText) {
        ctx.font = `500 ${Math.round(frameHeight * 0.22)}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = textColor + 'cc';
        ctx.fillText(design.frame.subText.toUpperCase(), resolution / 2, frameHeight * 0.72);
      }
    } else if (design.frame.style === 'polaroid') {
      // Polaroid bottom signature area
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.round(frameHeight * 0.3)}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(design.frame.text, resolution / 2, resolution - frameHeight * 0.6);

      if (design.frame.subText) {
        ctx.font = `500 ${Math.round(frameHeight * 0.2)}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = '#64748b';
        ctx.fillText(design.frame.subText, resolution / 2, resolution - frameHeight * 0.3);
      }
    }
    ctx.restore();
  } else {
    // No frame: Draw base background
    if (!design.transparentBg) {
      ctx.fillStyle = design.bgColor || '#ffffff';
      ctx.fillRect(0, 0, resolution, resolution);
    }
  }

  // 2. Setup Coordinate Math for QR grid
  const cellSize = qrWidth / totalGridSize;
  const startX = qrLeft + marginModules * cellSize;
  const startY = qrTop + marginModules * cellSize;

  // Create Gradient if configured
  let bodyFillStyle: string | CanvasGradient = design.fgColor || '#0f172a';
  if (design.gradientType && design.gradientType !== 'none') {
    let grad: CanvasGradient;
    if (design.gradientType === 'linear-x') {
      grad = ctx.createLinearGradient(qrLeft, qrTop, qrLeft + qrWidth, qrTop);
    } else if (design.gradientType === 'linear-y') {
      grad = ctx.createLinearGradient(qrLeft, qrTop, qrLeft, qrTop + qrHeight);
    } else if (design.gradientType === 'linear-diag') {
      grad = ctx.createLinearGradient(qrLeft, qrTop, qrLeft + qrWidth, qrTop + qrHeight);
    } else {
      grad = ctx.createRadialGradient(
        qrLeft + qrWidth / 2,
        qrTop + qrHeight / 2,
        0,
        qrLeft + qrWidth / 2,
        qrTop + qrHeight / 2,
        qrWidth / 1.4
      );
    }
    grad.addColorStop(0, design.fgColor || '#0f172a');
    grad.addColorStop(1, design.gradientColor2 || '#2563eb');
    bodyFillStyle = grad;
  }

  // 3. Draw Body Dots (skipping 7x7 corner finder zones if custom corners are drawn)
  ctx.save();
  ctx.fillStyle = bodyFillStyle;

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      const isDark = qrData.modules.get(r, c);
      if (!isDark) continue;

      const isCorner = isCornerSquare(r, c, matrixSize);
      if (isCorner) {
        // Skip corner modules because we draw crisp vector corner eyes separately
        continue;
      }

      const x = startX + c * cellSize;
      const y = startY + r * cellSize;
      const dotStyle = design.dotStyle || 'rounded';

      drawModuleDot(ctx, x, y, cellSize, dotStyle);
    }
  }
  ctx.restore();

  // 4. Draw Custom Styled Corner Eyes (Top-Left, Top-Right, Bottom-Left)
  const cornerSquareColor = design.customCornerColor
    ? (design.cornerSquareColor || design.fgColor)
    : design.fgColor;
  const cornerDotColor = design.customCornerColor
    ? (design.cornerDotColor || design.fgColor)
    : design.fgColor;

  drawCornerEye(
    ctx,
    startX,
    startY,
    cellSize,
    design.cornerSquareStyle,
    design.cornerDotStyle,
    cornerSquareColor,
    cornerDotColor,
    'top-left'
  );

  drawCornerEye(
    ctx,
    startX + (matrixSize - 7) * cellSize,
    startY,
    cellSize,
    design.cornerSquareStyle,
    design.cornerDotStyle,
    cornerSquareColor,
    cornerDotColor,
    'top-right'
  );

  drawCornerEye(
    ctx,
    startX,
    startY + (matrixSize - 7) * cellSize,
    cellSize,
    design.cornerSquareStyle,
    design.cornerDotStyle,
    cornerSquareColor,
    cornerDotColor,
    'bottom-left'
  );

  // 5. Draw Logo / Badge (if enabled)
  if (design.logo && design.logo.type !== 'none') {
    const logoRatio = Math.min(0.32, Math.max(0.12, design.logo.sizeRatio || 0.22));
    const logoPixelSize = qrWidth * logoRatio;
    const centerX = qrLeft + qrWidth / 2;
    const centerY = qrTop + qrHeight / 2;

    const clearMargin = design.logo.clearZoneMargin ?? 6;
    const bgPixelSize = logoPixelSize + clearMargin * 2;

    // Draw Clear Zone Background (Circle or Rounded Square)
    ctx.save();
    const bgShape = design.logo.bgShape || 'circle';
    const logoBgColor = design.logo.bgColor || '#ffffff';

    if (bgShape !== 'none') {
      ctx.fillStyle = logoBgColor;
      ctx.beginPath();
      if (bgShape === 'circle') {
        ctx.arc(centerX, centerY, bgPixelSize / 2, 0, Math.PI * 2);
      } else if (bgShape === 'square') {
        ctx.rect(centerX - bgPixelSize / 2, centerY - bgPixelSize / 2, bgPixelSize, bgPixelSize);
      } else {
        // rounded
        ctx.roundRect(
          centerX - bgPixelSize / 2,
          centerY - bgPixelSize / 2,
          bgPixelSize,
          bgPixelSize,
          bgPixelSize * 0.24
        );
      }
      ctx.fill();

      // Border around logo badge
      if (design.logo.borderWidth && design.logo.borderColor) {
        ctx.lineWidth = design.logo.borderWidth * (resolution / 512);
        ctx.strokeStyle = design.logo.borderColor;
        ctx.stroke();
      }
    }

    // Render Logo Content (SVG preset or Custom Image URL)
    if (design.logo.type === 'preset' && design.logo.presetId) {
      const preset = QR_LOGO_PRESETS.find((p) => p.id === design.logo.presetId);
      if (preset) {
        const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(preset.svg)}`;
        await drawImageOnCanvas(ctx, svgUrl, centerX - logoPixelSize / 2, centerY - logoPixelSize / 2, logoPixelSize, logoPixelSize);
      }
    } else if (design.logo.type === 'custom' && design.logo.customUrl) {
      await drawImageOnCanvas(ctx, design.logo.customUrl, centerX - logoPixelSize / 2, centerY - logoPixelSize / 2, logoPixelSize, logoPixelSize);
    }

    ctx.restore();
  }
}

// --------------------------------------------------------------------------
// MODULE DOT SHAPE RENDERERS
// --------------------------------------------------------------------------

function drawModuleDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: string
) {
  const pad = size * 0.06;
  const innerSize = size - pad * 2;
  const innerX = x + pad;
  const innerY = y + pad;

  ctx.beginPath();

  switch (style) {
    case 'dots': {
      const radius = innerSize / 2;
      ctx.arc(x + size / 2, y + size / 2, radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rounded': {
      const r = innerSize * 0.35;
      ctx.roundRect(innerX, innerY, innerSize, innerSize, r);
      ctx.fill();
      break;
    }
    case 'diamond': {
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.moveTo(cx, innerY);
      ctx.lineTo(innerX + innerSize, cy);
      ctx.lineTo(cx, innerY + innerSize);
      ctx.lineTo(innerX, cy);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'classy': {
      const r = innerSize * 0.48;
      ctx.roundRect(innerX, innerY, innerSize, innerSize, [r, 0, r, 0]);
      ctx.fill();
      break;
    }
    case 'fluid': {
      const r = innerSize * 0.48;
      ctx.roundRect(innerX, innerY, innerSize, innerSize, [0, r, 0, r]);
      ctx.fill();
      break;
    }
    case 'square':
    default:
      ctx.rect(x, y, size, size);
      ctx.fill();
      break;
  }
}

// --------------------------------------------------------------------------
// CORNER FINDER EYE RENDERER
// --------------------------------------------------------------------------

function drawCornerEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  squareStyle: string,
  dotStyle: string,
  outerColor: string,
  innerColor: string,
  position: 'top-left' | 'top-right' | 'bottom-left'
) {
  const outerWidth = cellSize * 7;
  const ringThickness = cellSize;

  // 1. Draw Outer Frame (7x7 modules)
  ctx.save();
  ctx.fillStyle = outerColor;

  if (squareStyle === 'circle') {
    // Circular Ring
    const radius = outerWidth / 2;
    const cx = x + radius;
    const cy = y + radius;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.arc(cx, cy, radius - ringThickness, 0, Math.PI * 2, true);
    ctx.fill();
  } else if (squareStyle === 'extra-rounded') {
    // Very Rounded Outer Box
    const r = outerWidth * 0.32;
    ctx.beginPath();
    ctx.roundRect(x, y, outerWidth, outerWidth, r);
    ctx.roundRect(
      x + ringThickness,
      y + ringThickness,
      outerWidth - ringThickness * 2,
      outerWidth - ringThickness * 2,
      r * 0.6
    );
    ctx.fill('evenodd');
  } else if (squareStyle === 'leaf') {
    // Leaf / Teardrop shape with oriented corners
    let radii: [number, number, number, number] = [outerWidth * 0.5, 0, outerWidth * 0.5, 0];
    if (position === 'top-right') radii = [0, outerWidth * 0.5, 0, outerWidth * 0.5];
    if (position === 'bottom-left') radii = [0, outerWidth * 0.5, 0, outerWidth * 0.5];

    ctx.beginPath();
    ctx.roundRect(x, y, outerWidth, outerWidth, radii);
    ctx.roundRect(
      x + ringThickness,
      y + ringThickness,
      outerWidth - ringThickness * 2,
      outerWidth - ringThickness * 2,
      [radii[0] * 0.5, radii[1] * 0.5, radii[2] * 0.5, radii[3] * 0.5]
    );
    ctx.fill('evenodd');
  } else if (squareStyle === 'rounded') {
    const r = outerWidth * 0.18;
    ctx.beginPath();
    ctx.roundRect(x, y, outerWidth, outerWidth, r);
    ctx.roundRect(
      x + ringThickness,
      y + ringThickness,
      outerWidth - ringThickness * 2,
      outerWidth - ringThickness * 2,
      r * 0.5
    );
    ctx.fill('evenodd');
  } else {
    // Standard Sharp Square
    ctx.beginPath();
    ctx.rect(x, y, outerWidth, outerWidth);
    ctx.rect(
      x + ringThickness,
      y + ringThickness,
      outerWidth - ringThickness * 2,
      outerWidth - ringThickness * 2
    );
    ctx.fill('evenodd');
  }
  ctx.restore();

  // 2. Draw Inner Eye Dot (3x3 modules in center)
  const innerDotX = x + cellSize * 2;
  const innerDotY = y + cellSize * 2;
  const innerDotWidth = cellSize * 3;

  ctx.save();
  ctx.fillStyle = innerColor;
  ctx.beginPath();

  if (dotStyle === 'circle' || dotStyle === 'dot') {
    const cx = innerDotX + innerDotWidth / 2;
    const cy = innerDotY + innerDotWidth / 2;
    ctx.arc(cx, cy, innerDotWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (dotStyle === 'diamond') {
    const cx = innerDotX + innerDotWidth / 2;
    const cy = innerDotY + innerDotWidth / 2;
    ctx.moveTo(cx, innerDotY);
    ctx.lineTo(innerDotX + innerDotWidth, cy);
    ctx.lineTo(cx, innerDotY + innerDotWidth);
    ctx.lineTo(innerDotX, cy);
    ctx.closePath();
    ctx.fill();
  } else {
    // Rounded / Square
    const r = innerDotWidth * 0.25;
    ctx.roundRect(innerDotX, innerDotY, innerDotWidth, innerDotWidth, r);
    ctx.fill();
  }
  ctx.restore();
}

// --------------------------------------------------------------------------
// IMAGE HELPER
// --------------------------------------------------------------------------

function drawImageOnCanvas(
  ctx: CanvasRenderingContext2D,
  src: string,
  x: number,
  y: number,
  w: number,
  h: number
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, x, y, w, h);
      resolve();
    };
    img.onerror = () => {
      resolve(); // ignore failed image loads gracefully
    };
    img.src = src;
  });
}

// --------------------------------------------------------------------------
// SCAN & DECODE FROM IMAGE ELEMENT OR CANVAS
// --------------------------------------------------------------------------

export function decodeQRFromImageData(imageData: ImageData): DecodedQRResult | null {
  try {
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    });

    if (code && code.data) {
      const parsed = parseQRString(code.data);
      return {
        rawText: code.data,
        detectedType: parsed.type,
        parsedData: parsed.parsed,
        timestamp: new Date().toISOString(),
        dimensions: { width: imageData.width, height: imageData.height }
      };
    }
    return null;
  } catch (err) {
    console.error('QR Decode error:', err);
    return null;
  }
}

export async function decodeQRFromFile(file: File): Promise<DecodedQRResult | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const result = decodeQRFromImageData(imageData);
        resolve(result);
      };
      img.onerror = () => resolve(null);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// --------------------------------------------------------------------------
// HIGH-RES EXPORT HELPERS (SVG, PNG, PDF)
// --------------------------------------------------------------------------

export async function exportQRCodeAsDataUrl(
  text: string,
  design: QRDesignConfig,
  format: 'png' | 'jpeg' = 'png',
  resolution: number = 1024
): Promise<string> {
  const canvas = document.createElement('canvas');
  await renderQRToCanvas({
    canvas,
    text,
    design,
    resolution,
    includeFrame: true
  });
  return canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
}

export function downloadDataUrlFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
