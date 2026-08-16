export type QRCodeType =
  | 'url'
  | 'text'
  | 'vcard'
  | 'wifi'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'geo'
  | 'event'
  | 'crypto'
  | 'product_coa'
  | 'app';

export type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRDotStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'fluid' | 'diamond';

export type QRCornerSquareStyle = 'square' | 'rounded' | 'circle' | 'leaf' | 'extra-rounded';

export type QRCornerDotStyle = 'square' | 'circle' | 'dot' | 'diamond';

export type QRGradientType = 'none' | 'linear-x' | 'linear-y' | 'linear-diag' | 'radial';

export type QRFrameStyle =
  | 'none'
  | 'bottom-badge'
  | 'bottom-banner'
  | 'top-banner'
  | 'polaroid'
  | 'phone'
  | 'badge-ribbon'
  | 'circular-badge';

export interface QRLogoConfig {
  type: 'none' | 'preset' | 'custom';
  presetId?: string;
  customUrl?: string;
  sizeRatio: number; // 0.12 to 0.32
  clearZoneMargin: number; // 2 to 12px
  bgShape: 'circle' | 'square' | 'rounded' | 'none';
  bgColor: string;
  borderWidth?: number;
  borderColor?: string;
}

export interface QRFrameConfig {
  style: QRFrameStyle;
  text: string;
  subText?: string;
  color: string;
  textColor: string;
  iconName?: string;
}

export interface QRDesignConfig {
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  gradientType: QRGradientType;
  gradientColor2: string;
  dotStyle: QRDotStyle;
  cornerSquareStyle: QRCornerSquareStyle;
  cornerDotStyle: QRCornerDotStyle;
  customCornerColor: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;
  errorCorrectionLevel: QRErrorCorrectionLevel;
  margin: number; // quiet zone in module count (0 to 6)
  logo: QRLogoConfig;
  frame: QRFrameConfig;
}

export interface QRVCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  workPhone: string;
  cellPhone?: string;
  email: string;
  url: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  notes?: string;
}

export interface QRWifiData {
  ssid: string;
  encryption: 'WPA' | 'WEP' | 'nopass' | 'WPA3';
  password: string;
  hidden: boolean;
}

export interface QREmailData {
  email: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

export interface QRPhoneData {
  phoneNumber: string;
}

export interface QRSmsData {
  phoneNumber: string;
  message: string;
}

export interface QRWhatsappData {
  countryCode: string;
  phoneNumber: string;
  message: string;
}

export interface QRGeoData {
  latitude: string;
  longitude: string;
  label?: string;
  openGoogleMaps?: boolean;
}

export interface QREventData {
  title: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  url?: string;
}

export interface QRCryptoData {
  coin: 'BTC' | 'ETH' | 'SOL' | 'USDC' | 'USDT';
  address: string;
  amount?: string;
  label?: string;
  message?: string;
}

export interface QRProductCOAData {
  productId: string;
  productName: string;
  batchNumber: string;
  purity: string;
  testedDate: string;
  verificationUrl: string;
  labDirector: string;
}

export interface QRAppData {
  appName: string;
  platform: 'all' | 'ios' | 'android';
  iosUrl: string;
  androidUrl: string;
}

export interface SavedQRCode {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: QRCodeType;
  payload: any;
  rawText: string;
  design: QRDesignConfig;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite?: boolean;
  thumbnailUrl?: string;
}

export interface QRBatchItem {
  id: string;
  label: string;
  type: QRCodeType;
  data: string;
  status: 'pending' | 'ready' | 'error';
  dataUrl?: string;
  svgString?: string;
  errorMessage?: string;
}

export interface DecodedQRResult {
  rawText: string;
  detectedType: QRCodeType;
  parsedData: any;
  timestamp: string;
  dimensions?: { width: number; height: number };
}
