export type Language = 'bn' | 'en';

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  portalName: string;
  developedBy: string;
  poweredBy: string;
  categoriesLabel: string;
  reference: string;
  reset: string;
  downloadHd: string;
  creating: string;
  ratioLabel: string;
  ratioSquare: string;
  ratioPortrait: string;
  ratioLandscape: string;
  tabContent: string;
  tabPhoto: string;
  tabStyle: string;
  categoryTitle: string;
  headlineTitle: string;
  headlineSizeLabel: string;
  headlineSizeSmall: string;
  headlineSizeStandard: string;
  headlineSizeLarge: string;
  headlineWordCount: string;
  headlinePlaceholder: string;
  highlightTitle: string;
  highlightPlaceholder: string;
  descriptionTitle: string;
  descriptionFixedNotice: string;
  descriptionWordCount: string;
  descriptionPlaceholder: string;
  hide: string;
  show: string;
  uploadCustomPhoto: string;
  useDefaultSeminarPhoto: string;
  zoomLabel: string;
  panYLabel: string;
  spaceSliderTitle: string;
  spacePhotoText: string;
  spaceStandardText: string;
  footerCalloutLabel: string;
  dateLabel: string;
  dateWhiteNote: string;
  previewTitle: string;
  copyClipboard: string;
  copiedSuccess: string;
  downloadButton: string;
  mobileTip: string;
  saveToPhone: string;
  longPressTip: string;
  downloadAgain: string;
  done: string;
  toggleLanguage: string;
  themeToggle: string;
  darkMode: string;
  whiteMode: string;
  categoryNames: {
    [key: string]: string;
  };
  sampleHeadlines: {
    [key: string]: string;
  };
  footerRights: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  bn: {
    appTitle: 'ASP কানেক্ট ফটো কার্ড স্টুডিও',
    appSubtitle: 'ফেসবুক ও সোশ্যাল মিডিয়ার জন্য প্রফেশনাল নিউজ ফটো কার্ড ক্রিয়েটর',
    portalName: 'ASP কানেক্ট',
    developedBy: 'Developed by SMSHEAM',
    poweredBy: "Association for Students' Progress - ASP",
    categoriesLabel: 'ক্যাটাগরি:',
    reference: 'রেফারেন্স',
    reset: 'রিসেট',
    downloadHd: 'ডাউনলোড (১:১)',
    creating: 'তৈরি হচ্ছে...',
    ratioLabel: 'কার্ড রেশিও (১:১ ডিফল্ট):',
    ratioSquare: '১:১ স্কয়ার (ডিফল্ট)',
    ratioPortrait: '৩:৪ পোর্ট্রেট',
    ratioLandscape: '৪:৩',
    tabContent: '১. শিরোনাম ও বিবরণ',
    tabPhoto: '২. ছবি ও ফ্রেমিং',
    tabStyle: '৩. স্পেস ও ফুটার',
    categoryTitle: 'নিউজ ক্যাটাগরি (সাইজ: ১৪)',
    headlineTitle: 'সংবাদের মূল শিরোনাম',
    headlineSizeLabel: 'শিরোনামের ফন্ট সাইজ',
    headlineSizeSmall: '১৪ (ছোট)',
    headlineSizeStandard: '২৪ (ডিফল্ট)',
    headlineSizeLarge: '২৬ (বড়)',
    headlineWordCount: 'শব্দ: {count}/১২',
    headlinePlaceholder: 'সংবাদের আকর্ষণীয় ১২ শব্দের শিরোনাম লিখুন...',
    highlightTitle: 'হলুদ রঙে হাইলাইট করার শব্দ',
    highlightPlaceholder: 'যেমন: বুড়িচং ও ব্রাহ্মণপাড়ায়',
    descriptionTitle: 'সংক্ষিপ্ত বিবরণ (ফিক্সড সাইজ: ১৫)',
    descriptionFixedNotice: 'নিউজকার্ড স্ট্যান্ডার্ডের জন্য বিবরণ সাইজ ১৫ ফিক্সড',
    descriptionWordCount: 'শব্দ: {count}/৭০',
    descriptionPlaceholder: 'সংবাদের বিস্তারিত ৭০ শব্দের বিবরণ এখানে লিখুন...',
    hide: 'লুকান',
    show: 'যুক্ত করুন',
    uploadCustomPhoto: 'নিজের ছবি আপলোড',
    useDefaultSeminarPhoto: 'ডিফল্ট সেমিনার ফটো',
    zoomLabel: 'ছবি জুম (Zoom)',
    panYLabel: 'উপরে/নিচে পজিশন (Vertical Pan)',
    spaceSliderTitle: 'টেক্সট ও সংবাদের স্পেস',
    spacePhotoText: 'ছবি: {percent}%',
    spaceStandardText: 'নির্ধারিত: ৪৪%',
    footerCalloutLabel: 'কার্ড ফুটার লেখা (সাইজ: ১২)',
    dateLabel: 'কোণার তারিখ (সাদা টেক্সট, সাইজ: ১৪)',
    dateWhiteNote: 'সাদা টেক্সট, ব্যাকগ্রাউন্ড ছাড়া (সাইজ ১৪)',
    previewTitle: 'লাইভ ফটো কার্ড',
    copyClipboard: 'ক্লিপবোর্ডে কপি',
    copiedSuccess: 'কপি সম্পন্ন! FB-তে পেস্ট করুন',
    downloadButton: 'কার্ড ডাউনলোড করুন',
    mobileTip: 'মোবাইলে ডাউনলোড না হলে "কার্ড ডাউনলোড করুন" চাপলে সরাসরি ফটো সেভ করার উইন্ডো আসবে',
    saveToPhone: 'মোবাইলে সেভ করুন (Save to Phone)',
    longPressTip: '👉 ছবিটিতে ১-২ সেকেন্ড চেপে ধরে রাখুন (Long Press), তারপর "Save Image" নির্বাচন করুন।',
    downloadAgain: 'পুনরায় ডাউনলোড',
    done: 'সম্পন্ন',
    toggleLanguage: 'English',
    themeToggle: 'থিম পরিবর্তন',
    darkMode: 'ডার্ক মোড',
    whiteMode: 'হোয়াইট মোড',
    categoryNames: {
      'বুড়িচং': 'বুড়িচং',
      'ব্রাহ্মণপাড়া': 'ব্রাহ্মণপাড়া',
      'কুমিল্লা': 'কুমিল্লা',
      'বাংলাদেশ': 'বাংলাদেশ',
      'আন্তর্জাতিক': 'আন্তর্জাতিক',
      'অন্যান্য': 'অন্যান্য',
    },
    sampleHeadlines: {
      'বুড়িচং': 'বুড়িচংয়ে তরুণ শিক্ষার্থীদের উচ্চশিক্ষায় উদ্বুদ্ধ করতে বিশেষ ক্যারিয়ার গাইডেন্স সেমিনার অনুষ্ঠিত',
      'ব্রাহ্মণপাড়া': 'ব্রাহ্মণপাড়ায় দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে শিক্ষাবৃত্তি এবং সম্মাননা সনদ বিতরণ সম্পন্ন',
      'কুমিল্লা': 'কুমিল্লায় শিক্ষার্থীদের মেধা অন্বেষণ উৎসবের সূচনা, অংশ নিচ্ছে সহস্রাধিক তরুণ শিক্ষার্থী',
      'বাংলাদেশ': 'সারাদেশে নতুন শিক্ষাবর্ষে ডিজিটাল শিক্ষা ও মেধা বিকাশ প্রকল্পের দেশব্যাপী সম্প্রসারণ ঘোষণা',
    },
    footerRights: 'ASP কানেক্ট © ২০২৬ · সর্বস্বত্ব সংরক্ষিত',
  },
  en: {
    appTitle: 'ASP Connect Photo Card Studio',
    appSubtitle: 'Professional news photo card creator for Facebook and social media',
    portalName: 'ASP Connect',
    developedBy: 'Developed by SMSHEAM',
    poweredBy: "Association for Students' Progress - ASP",
    categoriesLabel: 'Category:',
    reference: 'Reference',
    reset: 'Reset',
    downloadHd: 'Download (1:1)',
    creating: 'Generating...',
    ratioLabel: 'Card Ratio (1:1 Default):',
    ratioSquare: '1:1 Square (Default)',
    ratioPortrait: '3:4 Portrait',
    ratioLandscape: '4:3',
    tabContent: '1. Headline & Description',
    tabPhoto: '2. Photo & Framing',
    tabStyle: '3. Space & Footer',
    categoryTitle: 'News Category (Size: 14)',
    headlineTitle: 'News Headline',
    headlineSizeLabel: 'Headline Font Size',
    headlineSizeSmall: '14 (Small)',
    headlineSizeStandard: '24 (Default)',
    headlineSizeLarge: '26 (Large)',
    headlineWordCount: 'Words: {count}/12',
    headlinePlaceholder: 'Enter a concise 12-word news headline...',
    highlightTitle: 'Keyword to Highlight (Yellow)',
    highlightPlaceholder: 'e.g. Burichang and Brahmanpara',
    descriptionTitle: 'Short Description (Fixed Size: 15)',
    descriptionFixedNotice: 'Description font size 15 is fixed for optimal typography balance',
    descriptionWordCount: 'Words: {count}/70',
    descriptionPlaceholder: 'Enter approximately 70 words of news description...',
    hide: 'Hide',
    show: 'Add',
    uploadCustomPhoto: 'Upload Device Photo',
    useDefaultSeminarPhoto: 'Default Seminar Photo',
    zoomLabel: 'Photo Zoom',
    panYLabel: 'Vertical Framing (Pan Y)',
    spaceSliderTitle: 'Text Content Space',
    spacePhotoText: 'Photo: {percent}%',
    spaceStandardText: 'Standard: 44%',
    footerCalloutLabel: 'Footer Callout (Size: 12)',
    dateLabel: 'Corner Date (White Text, Size: 14)',
    dateWhiteNote: 'White text, no background box (Size 14)',
    previewTitle: 'Live Photo Card',
    copyClipboard: 'Copy to Clipboard',
    copiedSuccess: 'Copied! Ready to paste on FB',
    downloadButton: 'Download Card',
    mobileTip: 'On phone, tapping "Download Card" opens a direct save preview if browser download is blocked',
    saveToPhone: 'Save to Phone Gallery',
    longPressTip: '👉 Long-press on the image for 1-2 seconds and tap "Save Image".',
    downloadAgain: 'Download Again',
    done: 'Done',
    toggleLanguage: 'বাংলা',
    themeToggle: 'Switch Theme',
    darkMode: 'Dark Mode',
    whiteMode: 'White Mode',
    categoryNames: {
      'বুড়িচং': 'Burichang',
      'ব্রাহ্মণপাড়া': 'Brahmanpara',
      'কুমিল্লা': 'Comilla',
      'বাংলাদেশ': 'Bangladesh',
      'আন্তর্জাতিক': 'International',
      'অন্যান্য': 'Others',
    },
    sampleHeadlines: {
      'বুড়িচং': 'Special career guidance seminar organized for students in Burichang and Brahmanpara regions',
      'ব্রাহ্মণপাড়া': 'Merit scholarships and recognition certificates distributed among ambitious students in Brahmanpara',
      'কুমিল্লা': 'Talent search festival kicks off in Comilla with over a thousand students',
      'বাংলাদেশ': 'Digital education and talent development initiative expands nationwide in new academic year',
    },
    footerRights: 'ASP Connect © 2026 · All Rights Reserved',
  },
};
