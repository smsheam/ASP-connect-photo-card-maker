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
} from 'lucide-react';
import { CardState, AspectRatio } from '../types/card';
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
  const [activeTab, setActiveTab] = useState<'content' | 'photo' | 'style'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ photoUrl: url, imagePanX: 0, imagePanY: 0, imageZoom: 1 });
    }
  };

  const contentSpacePercent = Math.round((cardState.contentHeightRatio ?? 0.44) * 100);

  // Six News categories
  const newsCategories = [
    { key: 'বুড়িচং', color: '#DC2626' },
    { key: 'ব্রাহ্মণপাড়া', color: '#059669' },
    { key: 'কুমিল্লা', color: '#7C3AED' },
    { key: 'বাংলাদেশ', color: '#2563EB' },
    { key: 'আন্তর্জাতিক', color: '#D97706' },
    { key: 'অন্যান্য', color: '#4B5563' },
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

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-lg transition-colors ${panelBg}`}>
      
      {/* Top Ratio Bar (Default 1:1) */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 text-xs ${subBg}`}>
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
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all ${
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

      {/* 3 Tabs Navigation */}
      <div className={`flex border-b p-1.5 gap-1 text-xs ${subBg}`}>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'content'
              ? 'bg-rose-600 text-white shadow-sm'
              : `${textMuted} hover:${textTitle}`
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>{t.tabContent}</span>
        </button>

        <button
          onClick={() => setActiveTab('photo')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'photo'
              ? 'bg-rose-600 text-white shadow-sm'
              : `${textMuted} hover:${textTitle}`
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{t.tabPhoto}</span>
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'style'
              ? 'bg-rose-600 text-white shadow-sm'
              : `${textMuted} hover:${textTitle}`
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t.tabStyle}</span>
        </button>
      </div>

      {/* Tab 1: Content (Headline 12 words / size 24, Description 70 words / fixed 15, Category size 14) */}
      {activeTab === 'content' && (
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
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold border transition-all ${
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

            {/* Headline Font Size Selector (Buttons only, no slider/knob) */}
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
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

      {/* Tab 2: Photo and Framing */}
      {activeTab === 'photo' && (
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
              className="flex items-center justify-center gap-2 p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>{t.uploadCustomPhoto}</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ photoUrl: '/assets/asp_sample_photo.jpg', imageZoom: 1, imagePanX: 0, imagePanY: 0 })}
              className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-xs font-semibold transition-all ${
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

      {/* Tab 3: Space Allocation, Date & Footer */}
      {activeTab === 'style' && (
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
  );
};
