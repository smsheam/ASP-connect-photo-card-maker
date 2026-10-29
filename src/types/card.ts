export type AspectRatio = '3:4' | '4:3' | '1:1' | '16:9';

export type LayoutStyle = 'standard-split' | 'daily-times' | 'cinematic-overlay' | 'breaking-banner';

export type LogoSource = 'vector-brand' | 'uploaded-asset' | 'custom-upload';

export type LogoVariant = 'white-red' | 'mono-white' | 'mono-black' | 'gold-edition';

export type DateFormatMode = 'en-standard' | 'bn-standard' | 'custom';

export interface CardState {
  // Image
  photoUrl: string;
  imageZoom: number; // 0.5 to 2.5
  imagePanX: number; // -100 to 100%
  imagePanY: number; // -100 to 100%
  imageBrightness: number; // 50 to 150
  imageContrast: number; // 50 to 150
  scrimDarkness: number; // 0 to 100%
  contentHeightRatio: number; // default 0.40 (40% headline & description space, 60% photo)
  
  // Content
  headline: string;
  highlightPhrase: string; // Words to highlight in yellow/red
  highlightColor: string; // '#FACC15' | '#EF4444' | '#38BDF8' | '#FFFFFF'
  description: string;
  showDescription: boolean;
  
  // Category
  category: string;
  categoryColor: string;
  showCategory: boolean;
  
  // Branding
  portalName: string; // 'ASP কানেক্ট'
  organizationName: string; // "Association Students' Progress (ASP)"
  showPoweredBy: boolean;
  logoSource: LogoSource;
  logoVariant: LogoVariant;
  customLogoUrl: string | null;
  logoSize: number; // 60 to 150%
  
  // Date
  dateText: string;
  dateMode: DateFormatMode;
  showDate: boolean;
  
  // Footer
  footerCallout: string; // "বিস্তারিত ক্যাপশনে"
  footerUrl: string; // "To learn More about ASP, Visit ASP2016.ORG"
  showFooter: boolean;
  
  // Design & Format
  aspectRatio: AspectRatio; // '3:4' default
  layoutStyle: LayoutStyle;
  themeBackground: string; // '#0B132B' (reference navy), '#0F172A', '#050505', '#1E1B4B'
  fontFamily: 'Hind Siliguri' | 'Noto Sans Bengali' | 'Tiro Bangla' | 'Plus Jakarta Sans' | 'Merriweather';
  headlineFontSize: number; // 32 to 64 px
  textAlignment: 'left' | 'center';
}

export interface PresetCard {
  id: string;
  title: string;
  category: string;
  cardState: Partial<CardState>;
}
