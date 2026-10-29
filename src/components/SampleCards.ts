import { CardState, PresetCard } from '../types/card';
import { getBengaliDate } from '../utils/dateUtils';

export const DEFAULT_SAMPLE_PHOTO = '/assets/asp_sample_photo.jpg';

export const DEFAULT_CARD_STATE: CardState = {
  photoUrl: DEFAULT_SAMPLE_PHOTO,
  imageZoom: 1.0,
  imagePanX: 0,
  imagePanY: 0,
  imageBrightness: 100,
  imageContrast: 105,
  scrimDarkness: 0,
  contentHeightRatio: 0.40, // 40% headline & description space

  headline: 'বুড়িচং ও ব্রাহ্মণপাড়ায় শিক্ষার্থীদের মেধা অন্বেষণ বৃত্তি পরীক্ষার প্রস্তুতি সম্পন্ন',
  highlightPhrase: 'বুড়িচং ও ব্রাহ্মণপাড়ায়',
  highlightColor: '#FACC15', // News Yellow
  description: 'অ্যাসোসিয়েশন ফর স্টুডেন্টস প্রগ্রেস - ASP-এর উদ্যোগে দুই উপজেলার বিভিন্ন শিক্ষা প্রতিষ্ঠানের শিক্ষার্থীদের অংশগ্রগণ।',
  showDescription: true,

  category: 'বুড়িচং',
  categoryColor: '#DC2626',
  showCategory: true,

  portalName: 'ASP কানেক্ট',
  organizationName: "Association for Students' Progress - ASP",
  showPoweredBy: true,
  logoSource: 'vector-brand',
  logoVariant: 'white-red',
  customLogoUrl: null,
  logoSize: 100,

  dateText: getBengaliDate(),
  dateMode: 'bn-standard',
  showDate: true,

  footerCallout: 'VISIT ASP2016.ORG',
  showFooter: true,

  aspectRatio: '1:1', // 1*1 default ratio
  layoutStyle: 'standard-split',
  themeBackground: '#0B132B',
  fontFamily: 'Hind Siliguri',
  headlineFontSize: 42,
  textAlignment: 'left',
};

export const SAMPLE_PRESETS: PresetCard[] = [
  {
    id: 'burichang-regional',
    title: 'বুড়িচং সংবাদ',
    category: 'বুড়িচং',
    cardState: {
      photoUrl: DEFAULT_SAMPLE_PHOTO,
      category: 'বুড়িচং',
      categoryColor: '#DC2626',
      headline: 'বুড়িচংয়ে তরুণদের ক্যারিয়ার গাইডেন্স ও মেধা বিকাশ সেমিনার অনুষ্ঠিত',
      highlightPhrase: 'বুড়িচংয়ে তরুণদের',
      highlightColor: '#FACC15',
      description: 'উপজেলার শিক্ষার্থীদের উচ্চশিক্ষায় উদ্বুদ্ধ করতে বিশেষ দিকনির্দেশনা ও ক্যারিয়ার কাউন্সিলিং প্রদান করে এএসপি।',
      footerCallout: 'VISIT ASP2016.ORG',
      aspectRatio: '1:1',
      contentHeightRatio: 0.40,
      headlineFontSize: 42,
    },
  },
  {
    id: 'brahmanpara-regional',
    title: 'ব্রাহ্মণপাড়া সংবাদ',
    category: 'ব্রাহ্মণপাড়া',
    cardState: {
      photoUrl: DEFAULT_SAMPLE_PHOTO,
      category: 'ব্রাহ্মণপাড়া',
      categoryColor: '#059669',
      headline: 'ব্রাহ্মণপাড়ায় দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে শিক্ষাবৃত্তি বিতরণ সম্পন্ন',
      highlightPhrase: 'শিক্ষাবৃত্তি বিতরণ',
      highlightColor: '#FACC15',
      description: 'স্থানীয় গণ্যমান্য ব্যক্তিবর্গ ও এএসপি প্রতিনিধিদের উপস্থিতিতে শিক্ষার্থীদের হাতে সহায়তা তুলে দেওয়া হয়।',
      footerCallout: 'VISIT ASP2016.ORG',
      aspectRatio: '1:1',
      contentHeightRatio: 0.40,
      headlineFontSize: 42,
    },
  },
  {
    id: 'comilla-news',
    title: 'কুমিল্লা সংবাদ',
    category: 'কুমিল্লা',
    cardState: {
      photoUrl: DEFAULT_SAMPLE_PHOTO,
      category: 'কুমিল্লা',
      categoryColor: '#7C3AED',
      headline: 'কুমিল্লায় মেধা বিকাশ ও যুব উৎসবের উদ্বোধন, অংশ নিচ্ছে সহস্রাধিক শিক্ষার্থী',
      highlightPhrase: 'যুব উৎসবের উদ্বোধন',
      highlightColor: '#FACC15',
      description: 'জেলাভিত্তিক বিভিন্ন শিক্ষাপ্রতিষ্ঠানের শিক্ষার্থীদের অংশগ্রহণে বর্ণাঢ্য আয়োজনের সূচনা।',
      footerCallout: 'VISIT ASP2016.ORG',
      aspectRatio: '1:1',
      contentHeightRatio: 0.40,
      headlineFontSize: 42,
    },
  },
  {
    id: 'national-news',
    title: 'বাংলাদেশ সংবাদ',
    category: 'বাংলাদেশ',
    cardState: {
      photoUrl: DEFAULT_SAMPLE_PHOTO,
      category: 'বাংলাদেশ',
      categoryColor: '#2563EB',
      headline: 'সারাদেশে নতুন শিক্ষাবর্ষে ডিজিটাল শিক্ষা ও মেধা প্রকল্পের সম্প্রসারণ',
      highlightPhrase: 'ডিজিটাল শিক্ষা',
      highlightColor: '#38BDF8',
      description: 'শিক্ষার্থীদের আধুনিক তথ্যপ্রযুক্তি ও গবেষণায় দক্ষ করে তুলতে নেওয়া হচ্ছে বিশেষ কর্মপরিকল্পনা।',
      footerCallout: 'VISIT ASP2016.ORG',
      aspectRatio: '1:1',
      contentHeightRatio: 0.40,
      headlineFontSize: 40,
    },
  },
];
