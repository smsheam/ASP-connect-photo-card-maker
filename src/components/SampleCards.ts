import { CardState, PresetCard } from '../types/card';
import { getBengaliDate } from '../utils/dateUtils';

export const DEFAULT_SAMPLE_PHOTO = '/assets/asp_sample_photo.jpg';

// Standard 12-word headline for ASP Connect
export const DEFAULT_HEADLINE_BN = 'বুড়িচং ও ব্রাহ্মণপাড়ায় তরুণ শিক্ষার্থীদের উচ্চশিক্ষায় উদ্বুদ্ধ করতে বিশেষ ক্যারিয়ার সেমিনার সম্পন্ন';
export const DEFAULT_HEADLINE_EN = 'Special career counseling seminar organized for students in Burichang and Brahmanpara regions';

// Standard 70-word description for ASP Connect
export const DEFAULT_DESCRIPTION_BN = 'অ্যাসোসিয়েশন ফর স্টুডেন্টস প্রগ্রেস (এএসপি)-এর উদ্যোগে আয়োজিত এই বিশেষ দিকনির্দেশনামূলক ক্যারিয়ার সেমিনারে দুই উপজেলার বিভিন্ন শিক্ষাপ্রতিষ্ঠানের বিপুল সংখ্যক শিক্ষার্থী স্বতঃস্ফূর্তভাবে অংশগ্রহণ করেন। উক্ত অনুষ্ঠানে প্রধান অতিথি হিসেবে উপস্থিত বিশিষ্ট শিক্ষাবিদ ও ক্যারিয়ার বিশেষজ্ঞরা উচ্চশিক্ষা, মেধা অন্বেষণ, জাতীয় ও আন্তর্জাতিক স্কলারশিপ এবং আধুনিক তথ্যপ্রযুক্তির সর্বোত্তম ব্যবহারের ওপর গুরুত্বপূর্ণ দিকনির্দেশনা ও পরামর্শ প্রদান করেন। এছাড়া কৃতি শিক্ষার্থীদের মাঝে শিক্ষাবৃত্তি ও সম্মাননা সনদ বিতরণ করা হয়, যা তরুণ সমাজকে মানবিক গুণাবলিসম্পন্ন নেতৃত্ব হিসেবে গড়ে তুলতে অনুপ্রেরণা যোগাবে।';

export const DEFAULT_DESCRIPTION_EN = 'Organized by Association for Students Progress (ASP), this specialized career guidance seminar witnessed spontaneous participation from numerous ambitious students across educational institutions in both regions. Prominent educationists and career counselors delivered invaluable advice on higher education opportunities, talent discovery, national and international scholarships, and modern technological skills. Merit scholarships and certificates were awarded to exemplary students, inspiring the youth to emerge as compassionate, skilled leaders for tomorrow.';

export const DEFAULT_CARD_STATE: CardState = {
  photoUrl: DEFAULT_SAMPLE_PHOTO,
  imageZoom: 1.0,
  imagePanX: 0,
  imagePanY: 0,
  imageBrightness: 100,
  imageContrast: 105,
  scrimDarkness: 0,
  contentHeightRatio: 0.44, // 44% content space gives balanced fit for 12-word headline & 70-word description

  headline: DEFAULT_HEADLINE_BN,
  headlineFontSize: 24, // Requirement: default 24 size, can be changed 14-26
  highlightPhrase: 'বুড়িচং ও ব্রাহ্মণপাড়ায়',
  highlightColor: '#FACC15', // News Yellow
  description: DEFAULT_DESCRIPTION_BN,
  descriptionFontSize: 15, // Requirement: fixed 15 size
  showDescription: true,

  category: 'বুড়িচং',
  categoryColor: '#DC2626',
  showCategory: true,

  portalName: 'ASP কানেক্ট',
  organizationName: "Association for Students' Progress - ASP",
  showPoweredBy: false, // Requirement: removed powered by from top of card
  logoSource: 'vector-brand',
  logoVariant: 'white-red',
  customLogoUrl: null,
  logoSize: 100,

  dateText: getBengaliDate(),
  dateMode: 'bn-standard',
  dateFontSize: 14, // Requirement: date size 14, white text, no background
  showDate: true,

  footerCallout: 'VISIT ASP2016.ORG', // Requirement: size 12
  showFooter: true,

  aspectRatio: '1:1', // Default ratio 1*1
  layoutStyle: 'standard-split',
  themeBackground: '#0B132B',
  fontFamily: 'Hind Siliguri',
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
      headline: 'বুড়িচংয়ে তরুণ শিক্ষার্থীদের উচ্চশিক্ষায় উদ্বুদ্ধ করতে বিশেষ ক্যারিয়ার গাইডেন্স সেমিনার সফলভাবে সম্পন্ন',
      headlineFontSize: 24,
      descriptionFontSize: 15,
      highlightPhrase: 'বুড়িচংয়ে তরুণ',
      highlightColor: '#FACC15',
      description: 'অ্যাসোসিয়েশন ফর স্টুডেন্টস প্রগ্রেস (এএসপি)-এর আয়োজনে বুড়িচং উপজেলার বিভিন্ন স্কুল ও কলেজের শিক্ষার্থীদের নিয়ে ক্যারিয়ার সচেতনতা শীর্ষক কর্মশালা অনুষ্ঠিত হয়েছে। এতে শীর্ষ বিশ্ববিদ্যালয়ের শিক্ষক ও গবেষকবৃন্দ শিক্ষার্থীদের উচ্চশিক্ষা এবং ভবিষ্যৎ কর্মক্ষেত্রের চ্যালেঞ্জ মোকাবেলায় সময়োপযোগী দিকনির্দেশনা প্রদান করেন। উপস্থিত তরুণ শিক্ষার্থীরা উন্মুক্ত প্রশ্নোত্তর পর্বে স্বতঃস্ফূর্তভাবে অংশ নেন এবং বৃত্তি সংক্রান্ত নানাবিধ তথ্য সংগ্রহ করে নতুন উদ্যমে এগিয়ে চলার প্রত্যয় ব্যক্ত করেন।',
      footerCallout: 'VISIT ASP2016.ORG',
      aspectRatio: '1:1',
      contentHeightRatio: 0.44,
      showPoweredBy: false,
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
      headline: 'ব্রাহ্মণপাড়ায় দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে শিক্ষাবৃত্তি এবং সম্মাননা সনদ বিতরণ সম্পন্ন',
      headlineFontSize: 24,
      descriptionFontSize: 15,
      highlightPhrase: 'শিক্ষাবৃত্তি এবং সম্মাননা',
      highlightColor: '#FACC15',
      description: 'শিক্ষার্থীদের পড়াশোনায় উৎসাহ প্রদান এবং আর্থিক প্রতিবন্ধকতা নিরসনের লক্ষ্যে ব্রাহ্মণপাড়া উপজেলার শতাধিক মেধাবী শিক্ষার্থীর হাতে শিক্ষাবৃত্তি ও এককালীন আর্থিক সহায়তা তুলে দিয়েছে এএসপি। অনুষ্ঠানে স্থানীয় বিশিষ্ট শিক্ষানুরাগী ও সমাজসেবকগণ উপস্থিত ছিলেন। বক্তারা বলেন, প্রতিকূল পরিবেশ সত্ত্বেও শিক্ষার্থীদের অধ্যাবসায় আগামী দিনের সমৃদ্ধ বাংলাদেশ বিনির্মাণে গুরুত্বপূর্ণ ভূমিকা রাখবে। সহায়তাপ্রাপ্ত শিক্ষার্থীরা আয়োজকদের প্রতি গভীর কৃতজ্ঞতা প্রকাশ করে সততার সাথে পথচলার অঙ্গীকার করেন।',
      footerCallout: 'VISIT ASP2016.ORG',
      aspectRatio: '1:1',
      contentHeightRatio: 0.44,
      showPoweredBy: false,
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
      headline: 'কুমিল্লায় শিক্ষার্থীদের মেধা অন্বেষণ উৎসবের বর্ণাঢ্য সূচনা, অংশ নিচ্ছে সহস্রাধিক তরুণ শিক্ষার্থী',
      headlineFontSize: 24,
      descriptionFontSize: 15,
      highlightPhrase: 'মেধা অন্বেষণ উৎসবের',
      highlightColor: '#FACC15',
      description: 'কুমিল্লা জেলার বিভিন্ন প্রান্ত থেকে আসা তরুণ প্রতিভাদের অংশগ্রহণে অনুষ্ঠিত হচ্ছে জমকালো মেধা উৎসব। সৃজনশীল মেধার সঠিক মূল্যায়ন ও বিকাশের উদ্দেশ্যে আয়োজিত এ আয়োজনে সাধারণ জ্ঞান, বিজ্ঞান প্রজেক্ট ও কুইজ প্রতিযোগিতার আয়োজন করা হয়। বিজয়ী দল ও সেরা প্রতিযোগীদের হাতে ক্রেস্ট ও নগদ শিক্ষাবৃত্তি তুলে দেওয়া হয়। উৎসবমুখর পরিবেশে শিক্ষার্থীরা তাদের সৃষ্টিশীল ভাবনার প্রকাশ ঘটিয়ে নতুন উদ্ভাবনে আত্মনিয়োগের প্রত্যয় পুনর্ব্যক্ত করেন।',
      footerCallout: 'VISIT ASP2016.ORG',
      aspectRatio: '1:1',
      contentHeightRatio: 0.44,
      showPoweredBy: false,
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
      headline: 'সারাদেশে নতুন শিক্ষাবর্ষে ডিজিটাল শিক্ষা ও মেধা বিকাশ প্রকল্পের দেশব্যাপী সম্প্রসারণ ঘোষণা',
      headlineFontSize: 24,
      descriptionFontSize: 15,
      highlightPhrase: 'ডিজিটাল শিক্ষা ও মেধা',
      highlightColor: '#38BDF8',
      description: 'দেশের প্রত্যন্ত অঞ্চলের প্রতিটি শিক্ষার্থীর দ্বারে আধুনিক প্রযুক্তিভিত্তিক শিক্ষা পৌঁছে দেওয়ার প্রত্যয়ে বিশেষ জাতীয় কার্যক্রম গ্রহণ করা হয়েছে। এই উদ্যোগের আওতায় ডিজিটাল ল্যাব স্থাপন, অনলাইন মেন্টরশিপ এবং বিনামূল্যে পাঠ্য উপকরণ সরবরাহের ব্যবস্থা রাখা হয়েছে। সংশ্লিষ্ট প্রতিনিধিরা জানান, চতুর্থ শিল্পবিপ্লবের সাথে সামঞ্জস্য রেখে তরুণদের কারিগরি দক্ষতা ও নেতৃত্বের গুণাবলী অর্জনে এই প্রকল্প দীর্ঘমেয়াদী ইতিবাচক প্রভাব ফেলবে এবং বৈষম্যহীন শিক্ষাব্যবস্থা সুদৃঢ় করবে।',
      footerCallout: 'VISIT ASP2016.ORG',
      aspectRatio: '1:1',
      contentHeightRatio: 0.44,
      showPoweredBy: false,
    },
  },
];
