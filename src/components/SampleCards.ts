import { CardState, PresetCard } from '../types/card';
import { getBengaliDate } from '../utils/dateUtils';

// New high quality ASP student conference sample photo
export const DEFAULT_SAMPLE_PHOTO = '/assets/asp_sample_photo.jpg';

export const DEFAULT_CARD_STATE: CardState = {
  photoUrl: DEFAULT_SAMPLE_PHOTO,
  imageZoom: 1.0,
  imagePanX: 0,
  imagePanY: 0,
  imageBrightness: 100,
  imageContrast: 105,
  scrimDarkness: 0,
  contentHeightRatio: 0.40, // 40% headline & description space (60% photo)

  headline: 'বুড়িচং ও ব্রাহ্মণপাড়ায় শিক্ষার্থীদের মেধা অন্বেষণ বৃত্তি পরীক্ষার প্রস্তুতি সম্পন্ন',
  highlightPhrase: 'বুড়িচং ও ব্রাহ্মণপাড়ায়',
  highlightColor: '#FACC15', // News Yellow
  description: 'অ্যাসোসিয়েশন স্টুডেন্টস প্রগ্রেস (ASP)-এর উদ্যোগে দুই উপজেলার বিভিন্ন শিক্ষা প্রতিষ্ঠানের সহস্রাধিক শিক্ষার্থী অংশ নিচ্ছে।',
  showDescription: true,

  category: 'বুড়িচং',
  categoryColor: '#DC2626',
  showCategory: true,

  portalName: 'ASP কানেক্ট',
  organizationName: "Association Students' Progress (ASP)",
  showPoweredBy: true,
  logoSource: 'vector-brand',
  logoVariant: 'white-red',
  customLogoUrl: null,
  logoSize: 100,

  dateText: getBengaliDate(),
  dateMode: 'bn-standard',
  showDate: true,

  footerCallout: 'বিস্তারিত ক্যাপশনে',
  footerUrl: 'To learn More about ASP, Visit ASP2016.ORG',
  showFooter: true,

  aspectRatio: '3:4', // 3*4 portrait
  layoutStyle: 'standard-split',
  themeBackground: '#0B132B',
  fontFamily: 'Hind Siliguri',
  headlineFontSize: 44,
  textAlignment: 'left',
};

export const SAMPLE_PRESETS: PresetCard[] = [
  {
    id: 'burichang-regional',
    title: 'বুড়িচং রিজিউন (শিক্ষা ও ক্যারিয়ার)',
    category: 'বুড়িচং',
    cardState: {
      photoUrl: DEFAULT_SAMPLE_PHOTO,
      category: 'বুড়িচং',
      categoryColor: '#DC2626',
      headline: 'বুড়িচংয়ে তরুণদের ক্যারিয়ার গাইডেন্স ও মেধা বিকাশ সেমিনার অনুষ্ঠিত',
      highlightPhrase: 'বুড়িচংয়ে তরুণদের',
      highlightColor: '#FACC15',
      description: 'উপজেলার শিক্ষার্থীদের উচ্চশিক্ষায় উদ্বুদ্ধ করতে বিশেষ দিকনির্দেশনা ও ক্যারিয়ার কাউন্সিলিং প্রদান করে এএসপি।',
      footerCallout: 'বিস্তারিত ক্যাপশনে',
      footerUrl: 'To learn More about ASP, Visit ASP2016.ORG',
      aspectRatio: '3:4',
      contentHeightRatio: 0.40,
      headlineFontSize: 44,
    },
  },
  {
    id: 'brahmanpara-regional',
    title: 'ব্রাহ্মণপাড়া রিজিউন (শিক্ষাবৃত্তি)',
    category: 'ব্রাহ্মণপাড়া',
    cardState: {
      photoUrl: DEFAULT_SAMPLE_PHOTO,
      category: 'ব্রাহ্মণপাড়া',
      categoryColor: '#059669',
      headline: 'ব্রাহ্মণপাড়ায় দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে শিক্ষাবৃত্তি বিতরণ',
      highlightPhrase: 'শিক্ষাবৃত্তি বিতরণ',
      highlightColor: '#FACC15',
      description: 'স্থানীয় গণ্যমান্য ব্যক্তিবর্গ ও এএসপি প্রতিনিধিদের উপস্থিতিতে শিক্ষার্থীদের হাতে এই সহায়তা তুলে দেওয়া হয়।',
      footerCallout: 'বিস্তারিত ক্যাপশনে',
      footerUrl: 'To learn More about ASP, Visit ASP2016.ORG',
      aspectRatio: '3:4',
      contentHeightRatio: 0.40,
      headlineFontSize: 44,
    },
  },
  {
    id: 'asp-central-news',
    title: 'ASP কেন্দ্রীয় সম্মেলন',
    category: 'বুড়িচং-ব্রাহ্মণপাড়া',
    cardState: {
      photoUrl: DEFAULT_SAMPLE_PHOTO,
      category: 'বুড়িচং-ব্রাহ্মণপাড়া',
      categoryColor: '#2563EB',
      headline: 'অ্যাসোসিয়েশন স্টুডেন্টস প্রগ্রেস (ASP)-এর বার্ষিক মেধা সম্মেলন ও পুনর্মিলনী',
      highlightPhrase: 'বার্ষিক মেধা সম্মেলন',
      highlightColor: '#38BDF8',
      description: 'বুড়িচং ও ব্রাহ্মণপাড়া অঞ্চলের প্রাক্তন ও বর্তমান শিক্ষার্থীদের অংশগ্রহণে আয়োজিত হতে যাচ্ছে মহা সম্মেলন।',
      footerCallout: 'বিস্তারিত ক্যাপশনে',
      footerUrl: 'To learn More about ASP, Visit ASP2016.ORG',
      aspectRatio: '3:4',
      contentHeightRatio: 0.40,
      headlineFontSize: 42,
    },
  },
];
