import { getBengaliDate } from '../utils/dateUtils';

export type StudioModuleId =
  | 'dashboard'
  | 'news'
  | 'birthday'
  | 'appreciation'
  | 'announcement'
  | 'blood';

export type StudioAspectRatio = '1:1' | '4:5' | '3:4' | '4:3';

export type StudioFontFamily =
  | 'Hind Siliguri'
  | 'Noto Sans Bengali'
  | 'Tiro Bangla'
  | 'Plus Jakarta Sans'
  | 'Merriweather';

export const OFFICIAL_ASP_LOGO_URL = '/assets/aistudio/LOGO_PNG_bae8b78b.png';

export interface CommonStudioCardProps {
  aspectRatio: StudioAspectRatio;
  backgroundColor: string;
  showGrid: boolean;
  gridOpacity: number;
  logoUrl: string;
  logoSize: number; // 100 - 400 percent (default 200%)
  showLogo: boolean;
  showLogoWatermark: boolean; // Large background watermark
  logoWatermarkOpacity: number; // 0.03 - 0.25
  logoWatermarkScale: number; // 0.6 - 1.8
  dateText: string; // Always in Bangla by default
  showDate: boolean;
  captionText: string; // "বিস্তারিত ক্যাপশনে" (Used in Appreciation & ASP Connect)
  showCaption: boolean;
}

// ---------------------------------------------------------------------------
// 2. BIRTHDAY CARD MAKER STATE
// ---------------------------------------------------------------------------
export interface BirthdayCardState extends CommonStudioCardProps {
  memberPhotoUrl: string | null;
  originalMemberPhotoUrl: string | null;
  photoZoom: number;
  photoOffsetX: number;
  photoOffsetY: number;
  showOutlineGlow: boolean;
  outlineColor: string;
  showWatermarkPattern: boolean;

  happyBirthdayGraphicUrl: string | null;
  graphicScale: number;
  graphicOffsetY: number;

  topWishPrefix: string;
  mainScriptTitle: string;
  memberName: string;
  memberDesignation: string;
  sideWishText: string;
  showSideWish: boolean;
  accentColor: string;
  nameFontSize: number;
}

export const DEFAULT_BIRTHDAY_STATE: BirthdayCardState = {
  aspectRatio: '4:5',
  backgroundColor: '#0B3B24',
  showGrid: false,
  gridOpacity: 0.1,
  logoUrl: OFFICIAL_ASP_LOGO_URL,
  logoSize: 400,
  showLogo: true,
  showLogoWatermark: false,
  logoWatermarkOpacity: 0.08,
  logoWatermarkScale: 1.0,
  dateText: getBengaliDate(),
  showDate: true,
  captionText: '',
  showCaption: false, // Removed from Birthday per user request

  memberPhotoUrl: null,
  originalMemberPhotoUrl: null,
  photoZoom: 1.35, // 135% default
  photoOffsetX: 0,
  photoOffsetY: 0,
  showOutlineGlow: true,
  outlineColor: '#BADC58',
  showWatermarkPattern: true,

  happyBirthdayGraphicUrl: null,
  graphicScale: 1.1, // Fixed 110%
  graphicOffsetY: 43, // Fixed 43%

  topWishPrefix: 'HAPPY',
  mainScriptTitle: 'Birthday',
  memberName: 'SAHADAT HOSSEN SAZID',
  memberDesignation: 'Former General Secretary, ASP',
  sideWishText: 'ASP এর পক্ষ থেকে শুভেচ্ছা ও অভিনন্দন',
  showSideWish: true,
  accentColor: '#BADC58',
  nameFontSize: 60, // Fixed 60px
};

// ---------------------------------------------------------------------------
// 3. ANNOUNCEMENT CARD MAKER STATE
// ---------------------------------------------------------------------------
export type AnnouncementBackgroundMode = 'blurred-image' | 'solid-grid' | 'solid-clean';

export interface AnnouncementCardState extends CommonStudioCardProps {
  backgroundMode: AnnouncementBackgroundMode;
  backgroundImageUrl: string | null;
  blurIntensity: number;
  scrimOpacity: number;

  badgeLabel: string;
  showBadge: boolean;
  announcementTitle: string;
  announcementBody: string;
  footerSubNote: string;

  fontFamily: StudioFontFamily;
  textAlignment: 'left' | 'center' | 'right';
  textVerticalPosition: 'top' | 'center' | 'bottom';
  textOffsetX: number; // -160 to +160
  textOffsetY: number; // -260 to +260

  textColor: string;
  accentColor: string;

  autoFitText: boolean;
  badgeFontSize: number; // 14 - 40
  titleFontSize: number; // 22 - 76
  bodyFontSize: number; // 16 - 48
  subNoteFontSize: number; // 14 - 38
}

export const DEFAULT_ANNOUNCEMENT_STATE: AnnouncementCardState = {
  aspectRatio: '1:1',
  backgroundColor: '#0B132B',
  showGrid: true,
  gridOpacity: 0.12,
  logoUrl: OFFICIAL_ASP_LOGO_URL,
  logoSize: 400,
  showLogo: true,
  showLogoWatermark: true,
  logoWatermarkOpacity: 0.1,
  logoWatermarkScale: 1.5,
  dateText: getBengaliDate(),
  showDate: true,
  captionText: '',
  showCaption: false, // Removed from Announcement per user request

  backgroundMode: 'solid-grid',
  backgroundImageUrl: null,
  blurIntensity: 18,
  scrimOpacity: 0.55,

  badgeLabel: 'জরুরি বিজ্ঞপ্তি',
  showBadge: true,
  announcementTitle: 'এসএসসি ও এইচএসসি কৃতি শিক্ষার্থী সংবর্ধনা ২০২৬',
  announcementBody:
    'অ্যাসোসিয়েশন ফর স্টুডেন্টস প্রগ্রেস (এএসপি)-এর উদ্যোগে আগামী শুক্রবার সকাল ১০টায় বুড়িচং উপজেলা অডিটোরিয়ামে কৃতি শিক্ষার্থী সংবর্ধনা ও শিক্ষাবৃত্তি প্রদান অনুষ্ঠান অনুষ্ঠিত হবে।',
  footerSubNote: 'সংশ্লিষ্ট সকলকে যথাসময়ে উপস্থিত থাকার জন্য অনুরোধ করা হলো।',

  fontFamily: 'Hind Siliguri',
  textAlignment: 'center',
  textVerticalPosition: 'center',
  textOffsetX: 8,
  textOffsetY: -40,

  textColor: '#FFFFFF',
  accentColor: '#FACC15',

  autoFitText: false,
  badgeFontSize: 35,
  titleFontSize: 62,
  bodyFontSize: 36,
  subNoteFontSize: 30,
};

// ---------------------------------------------------------------------------
// 4. APPRECIATION POST CARD MAKER STATE (Matches uploaded reference image_d4ea5434.png)
// ---------------------------------------------------------------------------
export type AppreciationPhotoStyle = 'transparent-cutout' | 'framed-card';
export type AppreciationLayoutTemplate = 'reference-split' | 'full-backdrop';

export interface AppreciationCardState extends CommonStudioCardProps {
  layoutTemplate: AppreciationLayoutTemplate;
  bottomPanelColor: string; // Solid bottom panel color (default clean white #FFFFFF)
  topBackgroundImageUrl: string | null;
  topBgBlur: number;
  showDualShoulderEmblems: boolean;

  memberPhotoUrl: string | null;
  originalMemberPhotoUrl: string | null;
  photoStyle: AppreciationPhotoStyle;
  photoZoom: number;
  photoOffsetX: number;
  photoOffsetY: number;
  showPhotoRing: boolean;

  kickerLabel: string;
  memberName: string;
  memberDesignation: string;
  headline: string;
  highlightPhrase: string;
  highlightColor: string;
  highlightStyle: 'color' | 'pill';
  secondaryMessage: string;

  fontFamily: StudioFontFamily;
  textColor: string;
  headlineSize: number; // Default 30 (scalable 20 - 54)
  secondaryMessageSize: number; // Adjustable 16 - 32
}

export const DEFAULT_APPRECIATION_STATE: AppreciationCardState = {
  aspectRatio: '4:5',
  backgroundColor: '#1E3A8A', // Top backdrop blue
  bottomPanelColor: '#FFFFFF', // Clean white bottom panel
  showGrid: true,
  gridOpacity: 0.08,
  logoUrl: OFFICIAL_ASP_LOGO_URL,
  logoSize: 400, // ASP logo size 400%
  showLogo: true,
  showLogoWatermark: false,
  logoWatermarkOpacity: 0.1,
  logoWatermarkScale: 1.0,
  dateText: getBengaliDate(),
  showDate: true,
  captionText: 'বিস্তারিত ক্যাপশনে',
  showCaption: true, // Kept for Appreciation Post

  layoutTemplate: 'reference-split',
  topBackgroundImageUrl: null,
  topBgBlur: 6,
  showDualShoulderEmblems: false, // Removed dual shoulder emblem discs

  memberPhotoUrl: null,
  originalMemberPhotoUrl: null,
  photoStyle: 'transparent-cutout',
  photoZoom: 1.35, // 135% default
  photoOffsetX: 0,
  photoOffsetY: 0,
  showPhotoRing: false,

  kickerLabel: '',
  memberName: '',
  memberDesignation: '',
  headline:
    'এ.এস.পিয়ান মোহাম্মদ সালাহ বাংলাদেশ পুলিশে সাব-ইন্সপেক্টর হিসেবে যোগদান করায় ASP-র পক্ষ থেকে আন্তরিক অভিনন্দন ও শুভেচ্ছা।',
  highlightPhrase: 'ASP-র পক্ষ থেকে আন্তরিক অভিনন্দন ও শুভেচ্ছা',
  highlightColor: '#2563EB',
  highlightStyle: 'color',
  secondaryMessage: '',

  fontFamily: 'Hind Siliguri',
  textColor: '#0F172A',
  headlineSize: 30,
  secondaryMessageSize: 18,
};

// ---------------------------------------------------------------------------
// 5. BLOOD DONATION CARD MAKER STATE
// ---------------------------------------------------------------------------
export type BloodCardTemplate = 'thank-you' | 'blood-request';

export interface BloodDonationCardState extends CommonStudioCardProps {
  templateMode: BloodCardTemplate;
  donorPhotoUrl: string | null;
  originalDonorPhotoUrl: string | null;
  photoZoom: number;
  photoOffsetX: number;
  photoOffsetY: number;

  topTaglinePrefix: string;
  topTaglineHighlight: string;
  heroWordTop: string;
  heroWordScript: string;
  gratitudeLead: string;
  donorName: string;
  donorDesignation: string;
  bagCountText: string;
  bloodGroup: string;
  donationVerbText: string;
  donationTailText: string;
  subMessage: string; // "আপনার এক ফোঁটা লাল, কারো জীবনের নতুন সকাল।"
  bottomQuote: string;

  requestTitle: string;
  hospitalLocation: string;
  contactNumber: string;
  patientCondition: string;

  primaryColor: string;
  accentColor: string;
}

export const DEFAULT_BLOOD_DONATION_STATE: BloodDonationCardState = {
  aspectRatio: '1:1',
  backgroundColor: '#FFF5F6',
  showGrid: false,
  gridOpacity: 0.08,
  logoUrl: OFFICIAL_ASP_LOGO_URL,
  logoSize: 400,
  showLogo: true,
  showLogoWatermark: false,
  logoWatermarkOpacity: 0.08,
  logoWatermarkScale: 1.0,
  dateText: getBengaliDate(), // Date in Bangla
  showDate: true,
  captionText: '',
  showCaption: false, // Removed from Blood Donation per user request

  templateMode: 'thank-you',
  donorPhotoUrl: null,
  originalDonorPhotoUrl: null,
  photoZoom: 1.0,
  photoOffsetX: 0,
  photoOffsetY: 0,

  topTaglinePrefix: 'Blood Donation is',
  topTaglineHighlight: 'a gift of life...',
  heroWordTop: 'Thank',
  heroWordScript: 'You!',
  gratitudeLead: 'ASP extends its heartfelt gratitude to',
  donorName: 'Foysal Ahmmed Roman',
  donorDesignation: 'Former Vice-President, ASP',
  bagCountText: '1 bag',
  bloodGroup: 'A+',
  donationVerbText: 'for donating',
  donationTailText: 'today.',
  subMessage: 'আপনার এক ফোঁটা লাল, কারো জীবনের নতুন সকাল।',
  bottomQuote: "Together, let's keep spreading the spirit of humanity.",

  requestTitle: 'জরুরি রক্তের প্রয়োজন',
  hospitalLocation: 'কুমিল্লা মেডিকেল কলেজ হাসপাতাল',
  contactNumber: '01700-000000',
  patientCondition: 'জরুরি অপারেশনের জন্য',

  primaryColor: '#DC2626',
  accentColor: '#8B0000',
};
