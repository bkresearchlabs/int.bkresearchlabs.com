export type OfficeDocType = 'document' | 'spreadsheet' | 'presentation' | 'business_card' | 'converter';

export type DocumentCategory = 
  | 'coa'
  | 'sop'
  | 'msds'
  | 'invoice'
  | 'contract'
  | 'scientific'
  | 'inventory'
  | 'financial'
  | 'marketing'
  | 'branding'
  | 'general';

export type DocumentStatus = 'draft' | 'in_review' | 'approved' | 'archived';

export type PageSize = 'letter' | 'a4' | 'legal';
export type PageOrientation = 'portrait' | 'landscape';
export type PageMargins = 'normal' | 'narrow' | 'wide';

// Business Card Types
export type BusinessCardSize = 'us_standard' | 'eu_standard' | 'square' | 'credit_card';
export type BusinessCardOrientation = 'landscape' | 'portrait';
export type BusinessCardCorner = 'sharp' | 'rounded_sm' | 'rounded_md' | 'rounded_lg' | 'leaf';
export type BusinessCardFinish = 'matte' | 'gloss' | 'linen' | 'gold_foil' | 'silver_foil' | 'carbon' | 'holographic';
export type BusinessCardTheme = 
  | 'obsidian_gold' 
  | 'clean_cyan' 
  | 'clinical_white' 
  | 'deep_emerald' 
  | 'titanium_slate' 
  | 'midnight_violet' 
  | 'crimson_noir' 
  | 'cyber_neon' 
  | 'classic_linen' 
  | 'custom';

export interface BusinessCardSideConfig {
  bgColor: string;
  bgGradient?: string;
  bgPattern?: 'none' | 'dots' | 'grid' | 'hex' | 'circuit' | 'lines' | 'waves';
  textColor: string;
  accentColor: string;
  secondaryTextColor: string;
  borderStyle?: 'none' | 'thin' | 'double' | 'dashed' | 'metallic_gold' | 'metallic_silver' | 'neon_glow';
  showLogo: boolean;
  logoIcon?: string; // 'flask' | 'atom' | 'dna' | 'shield' | 'crown' | 'star' | 'cross' | 'hex' | 'bkr_emblem' | 'building'
  logoCustomUrl?: string;
  logoSize?: number;
  showWatermark?: boolean;
  watermarkText?: string;
  watermarkOpacity?: number;
  layoutStyle: 'standard_split' | 'centered_minimal' | 'modern_column' | 'qr_hero' | 'executive_band' | 'badge_card';
}

export interface BusinessCardContact {
  fullName: string;
  credentials?: string;
  jobTitle: string;
  department?: string;
  companyName: string;
  tagline?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  address?: string;
  licenseNumber?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
    telegram?: string;
  };
}

export interface BusinessCardQRConfig {
  enabled: boolean;
  side: 'front' | 'back' | 'both';
  type: 'vcard' | 'url' | 'email' | 'phone' | 'custom';
  customData?: string;
  label?: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  includeFrame?: boolean;
}

export interface BusinessCardContent {
  size: BusinessCardSize;
  orientation: BusinessCardOrientation;
  corner: BusinessCardCorner;
  finish: BusinessCardFinish;
  theme: BusinessCardTheme;
  fontFamily: 'sans' | 'serif' | 'mono' | 'display' | 'luxury';
  contact: BusinessCardContact;
  qrConfig: BusinessCardQRConfig;
  front: BusinessCardSideConfig;
  back: BusinessCardSideConfig;
  notes?: string;
}

export interface OfficeDocument {
  id: string;
  title: string;
  type: OfficeDocType;
  category: DocumentCategory;
  status: DocumentStatus;
  version: string;
  author: string;
  authorEmail?: string;
  tags: string[];
  isFavorite?: boolean;
  linkedProductId?: string;
  linkedOrderId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Word Processor Document Payload
  docContent?: {
    htmlContent: string;
    markdownContent?: string;
    headerTitle?: string;
    footerNote?: string;
    pageSize?: PageSize;
    orientation?: PageOrientation;
    margins?: PageMargins;
    showLetterhead?: boolean;
    showPageNumbers?: boolean;
    watermarkText?: string;
    isoStandardCode?: string;
    signatureBlock?: {
      signerName: string;
      signerTitle: string;
      date: string;
      digitalHash: string;
      includeStamp: boolean;
    };
  };

  // Spreadsheet Payload
  spreadsheetContent?: {
    activeSheetIndex: number;
    sheets: SpreadsheetSheet[];
  };

  // Presentation Payload
  presentationContent?: {
    theme: 'dark' | 'light' | 'emerald' | 'cyan' | 'slate';
    slides: PresentationSlide[];
  };

  // Business Card Payload
  businessCardContent?: BusinessCardContent;
}

export interface SpreadsheetCell {
  value: string; // Raw input (e.g. "=SUM(B2:B5)" or "250" or "Compound A")
  computed?: string | number; // Evaluated result
  format?: 'text' | 'number' | 'currency' | 'percent' | 'scientific' | 'date';
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  bg?: string;
  textColor?: string;
}

export interface SpreadsheetSheet {
  id: string;
  name: string;
  rowCount: number;
  colCount: number;
  cells: Record<string, SpreadsheetCell>; // Key: "A1", "B4", etc.
  columnWidths?: Record<string, number>;
  selectedChartType?: 'none' | 'bar' | 'line' | 'pie';
  chartConfig?: {
    title: string;
    labelColumn: string; // e.g. "A"
    valueColumn: string; // e.g. "B"
    startRow: number;
    endRow: number;
  };
}

export interface PresentationSlide {
  id: string;
  layout: 'title' | 'split' | 'cards' | 'metrics' | 'specs' | 'quote' | 'table';
  title: string;
  subtitle?: string;
  bodyText?: string;
  bulletPoints?: string[];
  badge?: string;
  imageUrl?: string;
  cards?: Array<{ title: string; desc: string; icon?: string; stat?: string }>;
  metrics?: Array<{ label: string; value: string; sub?: string }>;
  specs?: Array<{ key: string; value: string }>;
  speakerNotes?: string;
  bgColor?: string;
}

export interface OfficeTemplate {
  id: string;
  title: string;
  description: string;
  type: OfficeDocType;
  category: DocumentCategory;
  badge: string;
  iconName: string;
  previewSnippet: string;
  documentData: Partial<OfficeDocument>;
}
