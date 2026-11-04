import React, { useRef, useState } from 'react';
import {
  Upload,
  Sparkles,
  MapPin,
  ZoomIn,
  Move,
  Type,
  ImageIcon,
  Sliders,
  Calendar,
  Layers,
  FileText,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { CardState, AspectRatio, TextAlignment, TextVerticalPosition } from '../types/card';
import { Language, TRANSLATIONS } from '../utils/translations';

interface EditorPanelProps {
  cardState: CardState;
  onChange: (updates: Partial<CardState>) => void;
  isDarkUI: boolean;
  language: Language;
}

// Accurate word count function for Bengali and English
function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  cardState,
  onChange,
  isDarkUI,
  language,
}) => {
  const [photoTab, setPhotoTab] = useState<'content' | 'photo' | 'style'>('content');
  const [textTab, setTextTab] = useState<'text' | 'position' | 'background'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];

  const isTextCard = cardState.cardType === 'text';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ photoUrl: url, imagePanX: 0, imagePanY: 0, imageZoom: 1 });
    }
  };

  const contentSpacePercent = Math.round((cardState.contentHeightRatio ?? 0.44) * 100);

  // Six News categories for photo card
  const newsCategories = [
    { key: 'বুড়িচং', color: '#DC2626' },
    { key: 'ব্রাহ্মণপাড়া', color: '#059669' },
    { key: 'কুমিল্লা', color: '#7C3AED' },
    { key: 'বাংলাদেশ', color: '#2563EB' },
    { key: 'আন্তর্জাতিক', color: '#D97706' },
    { key: 'অন্যান্য', color: '#4B5563' },
  ];

  // Font family options
  const fontFamilies = [
    { id: 'Hind Siliguri', name: 'Hind Siliguri (হিন্দ শিলিগুড়ি - মডার্ন)' },
    { id: 'Noto Sans Bengali', name: 'Noto Sans Bengali (নোতো সান্স)' },
    { id: 'Tiro Bangla', name: 'Tiro Bangla (তিরো বাংলা - ক্লাসিক সেরিফ)' },
    { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (মডার্ন ল্যাটিন)' },
    { id: 'Merriweather', name: 'Merriweather (এলিগ্যান্ট সেরিফ)' },
  ];

  // Background color curated presets
  const bgPresets = [
    { name: 'ASP Navy', color: '#0B132B' },
    { name: 'Midnight', color: '#090D16' },
    { name: 'Pitch Black', color: '#000000' },
    { name: 'Crimson', color: '#7F1D1D' },
    { name: 'Royal Indigo', color: '#1E1B4B' },
    { name: 'Forest Green', color: '#064E3B' },
    { name: 'Deep Plum', color: '#3B0764' },
    { name: 'Warm Slate', color: '#1E293B' },
    { name: 'Clean White', color: '#FFFFFF' },
    { name: 'Warm Cream', color: '#F8F6F0' },
  ];

  // Text color curated presets
  const textColorPresets = [
    { name: 'Pure White', color: '#FFFFFF' },
    { name: 'News Yellow', color: '#FACC15' },
    { name: 'Soft Cream', color: '#F8FAFC' },
    { name: 'Crimson Red', color: '#EF4444' },
    { name: 'Sky Cyan', color: '#38BDF8' },
    { name: 'Emerald', color: '#10B981' },
    { name: 'Deep Slate', color: '#0F172A' },
  ];

  const panelBg = isDarkUI ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const subBg = isDarkUI ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200';
  const inputBg = isDarkUI 
    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-rose-500' 
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-rose-500';
  const textMuted = isDarkUI ? 'text-slate-400' : 'text-slate-600';
  const textTitle = isDarkUI ? 'text-slate-200' : 'text-slate-800';

  const currentHeadlineSize = cardState.headlineFontSize || 24; // Default 24
  const headlineWords = countWords(cardState.headline);
  const descriptionWords = countWords(cardState.description);
  const currentTextCardSize = cardState.textCardFontSize || 36;

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-lg transition-colors ${panelBg}`}>
      
      {/* 1. Template Mode Switcher: Photo Card vs Text Card (No Photo) */}
      <div className={`p-3 border-b ${subBg}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold ${textTitle} flex items-center gap-1.5`}>
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.cardTypeLabel}</span>
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            isTextCard 
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' 
              : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
          }`}>
            {isTextCard ? '📝 No Photo Style' : '📷 Standard Photo'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Option A: Photo Card (current format) */}
          <button
            type="button"
            onClick={() => onChange({ cardType: 'photo' })}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              !isTextCard
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-[1.01]'
                : isDarkUI
                ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t.cardTypePhoto}</span>
          </button>

          {/* Option B: Text Card (No photo, full card text, no category) */}
          <button
            type="button"
            onClick={() => {
              onChange({ 
                cardType: 'text',
                showCategory: false,
                textCardFontSize: cardState.textCardFontSize || 36,
                textPositionV: cardState.textPositionV || 'center',
                showGridLines: cardState.showGridLines !== undefined ? cardState.showGridLines : true,
              });
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isTextCard
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-[1.01]'
                : isDarkUI
                ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.cardTypeText}</span>
          </button>
        </div>
      </div>

      {/* 2. Aspect Ratio Selector (Supported across all cards) */}
      <div className={`px-4 py-2 border-b flex items-center justify-between gap-3 text-xs ${subBg}`}>
        <span className={`font-semibold ${textTitle}`}>{t.ratioLabel}</span>
        <div className="flex gap-1.5">
          {[
            { id: '1:1', label: t.ratioSquare },
            { id: '3:4', label: t.ratioPortrait },
            { id: '4:3', label: t.ratioLandscape },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onChange({ aspectRatio: r.id as AspectRatio })}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                cardState.aspectRatio === r.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : isDarkUI
                  ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE 1: TEXT CARD (NO PHOTO STYLE)                                       */}
      {/* ========================================================================= */}
      {isTextCard ? (
        <div>
          {/* 3 Tabs Navigation for Text Card */}
          <div className={`flex border-b p-1.5 gap-1 text-xs ${subBg}`}>
            <button
              onClick={() => setTextTab('text')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                textTab === 'text'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : `${textMuted} hover:${textTitle}`
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{t.tabTextMain}</span>
            </button>

            <button
              onClick={() => setTextTab('position')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                textTab === 'position'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : `${textMuted} hover:${textTitle}`
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{t.tabTextPosition}</span>
            </button>

            <button
              onClick={() => setTextTab('background')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                textTab === 'background'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : `${textMuted} hover:${textTitle}`
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{t.tabTextBackground}</span>
            </button>
          </div>

          {/* Text Tab 1: Text & Font */}
          {textTab === 'text' && (
            <div className="p-4 sm:p-5 space-y-4">
              
              {/* Main Headline / Quote (covers whole card) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle} flex items-center gap-1.5`}>
                    <Type className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.textMainLabel}</span>
                  </label>
                  <span className="text-[11px] font-mono text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded">
                    {headlineWords} শব্দ
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={cardState.headline}
                  onChange={(e) => onChange({ headline: e.target.value })}
                  placeholder={t.textMainPlaceholder}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm leading-relaxed transition-colors font-bengali ${inputBg}`}
                />
              </div>

              {/* Highlight phrase */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${subBg}`}>
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-medium ${textTitle} flex items-center gap-1.5`}>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{t.highlightTitle}</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {['#FACC15', '#EF4444', '#38BDF8', '#10B981'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onChange({ highlightColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-4 h-4 rounded-full border border-black/20 transition-transform ${
                          cardState.highlightColor === c ? 'scale-125 ring-2 ring-white ring-offset-1' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={cardState.highlightPhrase}
                  onChange={(e) => onChange({ highlightPhrase: e.target.value })}
                  placeholder={t.highlightPlaceholder}
                  className={`w-full border rounded-lg px-3 py-1.5 text-xs font-semibold text-yellow-400 ${inputBg}`}
                />
              </div>

              {/* Subtext / Description / Author Note */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle}`}>
                    {t.textSubLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => onChange({ showDescription: !cardState.showDescription })}
                    className="text-[11px] text-rose-500 hover:underline font-medium"
                  >
                    {cardState.showDescription ? t.hide : t.show}
                  </button>
                </div>
                {cardState.showDescription && (
                  <textarea
                    rows={2}
                    value={cardState.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder={t.textSubPlaceholder}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs leading-relaxed font-bengali ${inputBg}`}
                  />
                )}
              </div>

              {/* Font Family Selection */}
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold ${textTitle}`}>
                  {t.fontFamilyLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {fontFamilies.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onChange({ fontFamily: f.id as any })}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        cardState.fontFamily === f.id
                          ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                          : isDarkUI
                          ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle} flex items-center gap-1.5`}>
                    <Palette className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.textColorLabel}</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cardState.textColor || '#FFFFFF'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {textColorPresets.map((tc) => (
                    <button
                      key={tc.color}
                      type="button"
                      title={tc.name}
                      onClick={() => onChange({ textColor: tc.color })}
                      style={{ backgroundColor: tc.color }}
                      className={`w-7 h-7 rounded-xl border border-black/30 shadow-xs flex items-center justify-center transition-transform cursor-pointer ${
                        (cardState.textColor || '#FFFFFF').toUpperCase() === tc.color.toUpperCase()
                          ? 'scale-110 ring-2 ring-rose-500 ring-offset-2'
                          : 'hover:scale-105'
                      }`}
                    >
                      {(cardState.textColor || '#FFFFFF').toUpperCase() === tc.color.toUpperCase() && (
                        <Check className={`w-3.5 h-3.5 ${tc.color === '#FFFFFF' || tc.color === '#F8FAFC' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                  {/* Custom color picker */}
                  <label className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-xl cursor-pointer hover:border-slate-500">
                    <input
                      type="color"
                      value={cardState.textColor || '#FFFFFF'}
                      onChange={(e) => onChange({ textColor: e.target.value })}
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-[11px] text-slate-400">কাস্টম</span>
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* Text Tab 2: Size & Position */}
          {textTab === 'position' && (
            <div className="p-4 sm:p-5 space-y-4">
              
              {/* Text Font Size */}
              <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={textTitle}>{t.textSizeLabel}</span>
                  <span className="text-rose-500 font-bold font-mono text-sm">{currentTextCardSize}px</span>
                </div>

                {/* Preset size buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[24, 30, 36, 42, 48, 56, 64].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onChange({ textCardFontSize: sz })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        currentTextCardSize === sz
                          ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                          : isDarkUI
                          ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                          : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>

                {/* Fine slider */}
                <input
                  type="range"
                  min="20"
                  max="72"
                  step="1"
                  value={currentTextCardSize}
                  onChange={(e) => onChange({ textCardFontSize: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Text Horizontal Alignment */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                <label className={`block text-xs font-semibold ${textTitle}`}>
                  {t.textAlignLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'left' as TextAlignment, label: t.alignLeft, icon: AlignLeft },
                    { id: 'center' as TextAlignment, label: t.alignCenter, icon: AlignCenter },
                    { id: 'right' as TextAlignment, label: t.alignRight, icon: AlignRight },
                  ].map((align) => {
                    const Icon = align.icon;
                    const isSelected = (cardState.textAlignment || 'left') === align.id;
                    return (
                      <button
                        key={align.id}
                        type="button"
                        onClick={() => onChange({ textAlignment: align.id })}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : isDarkUI
                            ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                            : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{align.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Vertical Position */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                <label className={`block text-xs font-semibold ${textTitle}`}>
                  {t.textPositionVLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top' as TextVerticalPosition, label: t.posTop },
                    { id: 'center' as TextVerticalPosition, label: t.posCenter },
                    { id: 'bottom' as TextVerticalPosition, label: t.posBottom },
                  ].map((vPos) => {
                    const isSelected = (cardState.textPositionV || 'center') === vPos.id;
                    return (
                      <button
                        key={vPos.id}
                        type="button"
                        onClick={() => onChange({ textPositionV: vPos.id })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : isDarkUI
                            ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                            : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <span>{vPos.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical Fine-tune Nudge Slider */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className={`flex items-center gap-1.5 ${textTitle}`}>
                    <ArrowUpDown className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.verticalOffsetLabel}</span>
                  </span>
                  <span className="font-mono text-slate-400">{cardState.textVerticalOffset || 0}px</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  step="2"
                  value={cardState.textVerticalOffset || 0}
                  onChange={(e) => onChange({ textVerticalOffset: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

            </div>
          )}

          {/* Text Tab 3: Background & Grid */}
          {textTab === 'background' && (
            <div className="p-4 sm:p-5 space-y-4">
              
              {/* Requirement: Background grid line on/off */}
              <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-rose-500" />
                    <div>
                      <span className={`text-xs font-bold block ${textTitle}`}>{t.gridLinesLabel}</span>
                      <span className="text-[10px] text-slate-400">মডার্ন জ্যামিতিক আর্কিটেকচারাল গ্রিড</span>
                    </div>
                  </div>
                  
                  {/* Grid Toggle Button */}
                  <button
                    type="button"
                    onClick={() => onChange({ showGridLines: !(cardState.showGridLines !== false) })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      cardState.showGridLines !== false
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : isDarkUI
                        ? 'bg-slate-950 text-slate-400 border-slate-800'
                        : 'bg-white text-slate-500 border-slate-300'
                    }`}
                  >
                    {cardState.showGridLines !== false ? t.gridLinesOn : t.gridLinesOff}
                  </button>
                </div>

                {/* Grid Opacity Slider (when on) */}
                {cardState.showGridLines !== false && (
                  <div className="pt-2 border-t border-slate-800/40 space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={textMuted}>{t.gridOpacityLabel}</span>
                      <span className="font-mono text-slate-400">
                        {Math.round((cardState.gridOpacity ?? 0.12) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.35"
                      step="0.02"
                      value={cardState.gridOpacity ?? 0.12}
                      onChange={(e) => onChange({ gridOpacity: Number(e.target.value) })}
                      className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Requirement: Background color change */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle} flex items-center gap-1.5`}>
                    <Palette className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.bgColorLabel}</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cardState.themeBackground || '#0B132B'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {bgPresets.map((preset) => {
                    const isSelected = (cardState.themeBackground || '#0B132B').toUpperCase() === preset.color.toUpperCase();
                    return (
                      <button
                        key={preset.color}
                        type="button"
                        title={preset.name}
                        onClick={() => onChange({ themeBackground: preset.color })}
                        style={{ backgroundColor: preset.color }}
                        className={`h-9 rounded-xl border border-black/30 shadow-xs flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'scale-105 ring-2 ring-rose-500 ring-offset-2'
                            : 'hover:scale-105'
                        }`}
                      >
                        {isSelected && (
                          <Check className={`w-4 h-4 ${preset.color === '#FFFFFF' || preset.color === '#F8F6F0' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${subBg}`}>
                  <span className={`text-xs font-medium ${textMuted}`}>কাস্টম ব্যাকগ্রাউন্ড কালার হেক্স:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cardState.themeBackground || '#0B132B'}
                      onChange={(e) => onChange({ themeBackground: e.target.value })}
                      className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={cardState.themeBackground || '#0B132B'}
                      onChange={(e) => onChange({ themeBackground: e.target.value })}
                      className={`w-24 text-xs font-mono font-bold px-2 py-1 rounded border ${inputBg}`}
                    />
                  </div>
                </div>
              </div>

              {/* Date stamp in text card */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle} flex items-center gap-1.5`}>
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.dateLabel}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onChange({ showDate: !cardState.showDate })}
                    className="text-[11px] text-rose-500 hover:underline font-medium"
                  >
                    {cardState.showDate ? t.hide : t.show}
                  </button>
                </div>
                {cardState.showDate && (
                  <input
                    type="text"
                    value={cardState.dateText}
                    onChange={(e) => onChange({ dateText: e.target.value, dateMode: 'custom' })}
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs ${inputBg}`}
                  />
                )}
              </div>

              {/* Footer Callout */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                <div className="flex items-center justify-between">
                  <label className={`block text-xs font-semibold ${textTitle}`}>
                    {t.footerCalloutLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => onChange({ showFooter: !cardState.showFooter })}
                    className="text-[11px] text-rose-500 hover:underline font-medium"
                  >
                    {cardState.showFooter ? t.hide : t.show}
                  </button>
                </div>
                {cardState.showFooter && (
                  <input
                    type="text"
                    value={cardState.footerCallout}
                    onChange={(e) => onChange({ footerCallout: e.target.value })}
                    placeholder="VISIT ASP2016.ORG"
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-rose-500 ${inputBg}`}
                  />
                )}
              </div>

            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* CASE 2: PHOTO CARD (ORIGINAL FORMAT UNTOUCHED)                            */
        /* ========================================================================= */
        <div>
          {/* 3 Tabs Navigation for Photo Card */}
          <div className={`flex border-b p-1.5 gap-1 text-xs ${subBg}`}>
            <button
              onClick={() => setPhotoTab('content')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                photoTab === 'content'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : `${textMuted} hover:${textTitle}`
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{t.tabContent}</span>
            </button>

            <button
              onClick={() => setPhotoTab('photo')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                photoTab === 'photo'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : `${textMuted} hover:${textTitle}`
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{t.tabPhoto}</span>
            </button>

            <button
              onClick={() => setPhotoTab('style')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                photoTab === 'style'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : `${textMuted} hover:${textTitle}`
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.tabStyle}</span>
            </button>
          </div>

          {/* Photo Tab 1: Content (Headline 12 words / size 24, Description 70 words / fixed 15, Category size 14) */}
          {photoTab === 'content' && (
            <div className="p-4 sm:p-5 space-y-4">
              
              {/* Category selection (Size: 14) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle} flex items-center gap-1.5`}>
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.categoryTitle}</span>
                  </label>
                  <span className="text-[11px] text-rose-500 font-semibold font-mono bg-rose-500/10 px-2 py-0.5 rounded">
                    {t.categoryNames[cardState.category] || cardState.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newsCategories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => onChange({ 
                        category: cat.key, 
                        categoryColor: cat.color, 
                        showCategory: true 
                      })}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                        cardState.category === cat.key
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-[1.02]'
                          : isDarkUI
                          ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {t.categoryNames[cat.key] || cat.key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline (12 words, default size 24, changeable 14-26) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle}`}>
                    {t.headlineTitle}
                  </label>
                  
                  {/* Word Count Indicator: {count}/12 */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                      headlineWords === 12
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : headlineWords > 12
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.headlineWordCount.replace('{count}', String(headlineWords))}
                    </span>
                    <span className="text-[11px] font-mono text-rose-500 font-bold">
                      {currentHeadlineSize}px
                    </span>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={cardState.headline}
                  onChange={(e) => onChange({ headline: e.target.value })}
                  placeholder={t.headlinePlaceholder}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm leading-relaxed transition-colors font-bengali ${inputBg}`}
                />

                {/* Headline Font Size Selector (Buttons only, 16 to 26) */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${subBg}`}>
                  <span className={`font-medium ${textTitle}`}>
                    {t.headlineSizeLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[16, 18, 20, 22, 24, 26].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => onChange({ headlineFontSize: sz })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          currentHeadlineSize === sz
                            ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                            : isDarkUI
                            ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                            : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlight phrase */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${subBg}`}>
                <label className={`text-xs font-medium ${textTitle} flex items-center gap-1.5`}>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{t.highlightTitle}</span>
                </label>
                <input
                  type="text"
                  value={cardState.highlightPhrase}
                  onChange={(e) => onChange({ highlightPhrase: e.target.value })}
                  placeholder={t.highlightPlaceholder}
                  className={`w-full border rounded-lg px-3 py-1.5 text-xs font-semibold text-yellow-400 ${inputBg}`}
                />
              </div>

              {/* Short description (Must be in 70 words, Fixed size: 15) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle}`}>
                    {t.descriptionTitle}
                  </label>
                  
                  <div className="flex items-center gap-2">
                    {cardState.showDescription && (
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                        descriptionWords === 70
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : Math.abs(descriptionWords - 70) <= 5
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {t.descriptionWordCount.replace('{count}', String(descriptionWords))}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onChange({ showDescription: !cardState.showDescription })}
                      className="text-[11px] text-rose-500 hover:underline font-medium"
                    >
                      {cardState.showDescription ? t.hide : t.show}
                    </button>
                  </div>
                </div>

                {cardState.showDescription && (
                  <textarea
                    rows={4}
                    value={cardState.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder={t.descriptionPlaceholder}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs leading-relaxed font-bengali ${inputBg}`}
                  />
                )}
              </div>

            </div>
          )}

          {/* Photo Tab 2: Photo and Framing */}
          {photoTab === 'photo' && (
            <div className="p-4 sm:p-5 space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{t.uploadCustomPhoto}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ photoUrl: '/assets/asp_sample_photo.jpg', imageZoom: 1, imagePanX: 0, imagePanY: 0 })}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isDarkUI ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{t.useDefaultSeminarPhoto}</span>
                </button>
              </div>

              {/* Quick Zoom & Positioning Sliders */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className={`flex items-center gap-1 ${textTitle}`}>
                      <ZoomIn className="w-3.5 h-3.5 text-rose-500" /> {t.zoomLabel}
                    </span>
                    <span className={textMuted}>{Math.round(cardState.imageZoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="2.5"
                    step="0.05"
                    value={cardState.imageZoom}
                    onChange={(e) => onChange({ imageZoom: Number(e.target.value) })}
                    className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className={`flex items-center gap-1 ${textTitle}`}>
                      <Move className="w-3.5 h-3.5 text-rose-500" /> {t.panYLabel}
                    </span>
                    <span className={textMuted}>{cardState.imagePanY}%</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={cardState.imagePanY}
                    onChange={(e) => onChange({ imagePanY: Number(e.target.value) })}
                    className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Photo Tab 3: Space Allocation, Date & Footer */}
          {photoTab === 'style' && (
            <div className="p-4 sm:p-5 space-y-4">
              
              {/* Space Allocation Slider */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-1.5 ${textTitle}`}>
                    <Layers className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.spaceSliderTitle}</span>
                  </span>
                  <span className="text-rose-500 font-bold font-mono">{contentSpacePercent}%</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="55"
                  step="1"
                  value={contentSpacePercent}
                  onChange={(e) => onChange({ contentHeightRatio: Number(e.target.value) / 100 })}
                  className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{t.spacePhotoText.replace('{percent}', String(100 - contentSpacePercent))}</span>
                  <span>{t.spaceStandardText}</span>
                </div>
              </div>

              {/* Date stamp (White text, no background, size 14) */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold ${textTitle} flex items-center gap-1.5`}>
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.dateLabel}</span>
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ১৪px (White Text)
                  </span>
                </div>
                <input
                  type="text"
                  value={cardState.dateText}
                  onChange={(e) => onChange({ dateText: e.target.value, dateMode: 'custom' })}
                  className={`w-full border rounded-lg px-3 py-1.5 text-xs ${inputBg}`}
                />
                <p className="text-[10px] text-slate-400">
                  {t.dateWhiteNote}
                </p>
              </div>

              {/* Footer Callout: VISIT ASP2016.ORG (Size: 12) */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                <div className="flex items-center justify-between">
                  <label className={`block text-xs font-semibold ${textTitle}`}>
                    {t.footerCalloutLabel}
                  </label>
                  <span className="text-[11px] font-mono text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded">
                    ১২px
                  </span>
                </div>
                <input
                  type="text"
                  value={cardState.footerCallout}
                  onChange={(e) => onChange({ footerCallout: e.target.value })}
                  placeholder="VISIT ASP2016.ORG"
                  className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-rose-500 ${inputBg}`}
                />
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
