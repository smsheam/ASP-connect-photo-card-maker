export type AspectRatio = '1:1' | '3:4' | '4:3' | '16:9';

export type LayoutStyle = 'standard-split' | 'daily-times' | 'cinematic-overlay' | 'breaking-banner';

export type LogoSource = 'vector-brand' | 'uploaded-asset' | 'custom-upload';

export type LogoVariant = 'white-red' | 'mono-black' | 'mono-white' | 'gold-edition';

export type DateFormatMode = 'en-standard' | 'bn-standard' | 'custom';

export type CardType = 'photo' | 'text';

export type TextAlignment = 'left' | 'center' | 'right';

export type TextVerticalPosition = 'top' | 'center' | 'bottom';

export interface CardState {
  // Mode: Photo Card vs Text Card (No Photo)
  cardType?: CardType; // default 'photo'

  // Image (For Photo Card)
  photoUrl: string;
  imageZoom: number;
  imagePanX: number;
  imagePanY: number;
  imageBrightness: number;
  imageContrast: number;
  scrimDarkness: number;
  contentHeightRatio: number; // default 0.44
  
  // Content (Shared & Text Card)
  headline: string;
  headlineFontSize: number; // default 24, can be changed (14-26 for photo card)
  highlightPhrase: string;
  highlightColor: string;
  description: string;
  descriptionFontSize: number; // fixed 15
  showDescription: boolean;
  
  // Text Card Specific Settings
  textColor?: string; // default: '#FFFFFF'
  textCardFontSize?: number; // default 36, range: 20 - 72
  textPositionV?: TextVerticalPosition; // 'top' | 'center' | 'bottom'
  textVerticalOffset?: number; // -100 to 100
  showGridLines?: boolean; // background grid lines on/off
  gridOpacity?: number; // 0.05 to 0.40
  gridSpacing?: number; // grid mesh spacing in px
  
  // Category (For Photo Card; omitted in Text Card)
  category: string;
  categoryColor: string;
  showCategory: boolean;
  
  // Branding
  portalName: string; // 'ASP কানেক্ট'
  organizationName: string; // "Association for Students' Progress - ASP"
  showPoweredBy: boolean; // false
  logoSource: LogoSource;
  logoVariant: LogoVariant;
  customLogoUrl: string | null;
  logoSize: number;
  
  // Date
  dateText: string;
  dateMode: DateFormatMode;
  dateFontSize: number; // fixed 14 (white text, no background)
  showDate: boolean;
  
  // Footer
  footerCallout: string; // "VISIT ASP2016.ORG" (size 12)
  showFooter: boolean;
  
  // Design & Format
  aspectRatio: AspectRatio; // default: '1:1'
  layoutStyle: LayoutStyle;
  themeBackground: string; // '#0B132B'
  fontFamily: 'Hind Siliguri' | 'Noto Sans Bengali' | 'Tiro Bangla' | 'Plus Jakarta Sans' | 'Merriweather';
  textAlignment: TextAlignment;
}

export interface PresetCard {
  id: string;
  title: string;
  category: string;
  cardState: Partial<CardState>;
}
