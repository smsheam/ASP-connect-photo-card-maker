import React, { useState } from 'react';
import { Edit3, Eye, RefreshCw } from 'lucide-react';
import { CardState } from '../types/card';
import {
  DEFAULT_CARD_STATE,
  SAMPLE_PRESETS,
  DEFAULT_HEADLINE_BN,
  DEFAULT_HEADLINE_EN,
  DEFAULT_DESCRIPTION_BN,
  DEFAULT_DESCRIPTION_EN,
} from '../components/SampleCards';
import { EditorPanel } from '../components/EditorPanel';
import { PreviewPanel } from '../components/PreviewPanel';
import { ReferenceModal } from '../components/ReferenceModal';
import { Language, TRANSLATIONS } from '../utils/translations';
import { getBengaliDate } from '../utils/dateUtils';

interface NewsModuleProps {
  isDark: boolean;
  language: Language;
}

export const NewsModule: React.FC<NewsModuleProps> = ({ isDark, language }) => {
  const [cardState, setCardState] = useState<CardState>(DEFAULT_CARD_STATE);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  const t = TRANSLATIONS[language];

  // Sync default sample text if still unchanged when toggling language
  React.useEffect(() => {
    setCardState((prev) => {
      if (language === 'en' && prev.headline === DEFAULT_HEADLINE_BN) {
        return {
          ...prev,
          headline: DEFAULT_HEADLINE_EN,
          highlightPhrase: 'Burichang and Brahmanpara',
          description: DEFAULT_DESCRIPTION_EN,
          dateText: new Date()
            .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            .toUpperCase(),
        };
      } else if (language === 'bn' && prev.headline === DEFAULT_HEADLINE_EN) {
        return {
          ...prev,
          headline: DEFAULT_HEADLINE_BN,
          highlightPhrase: 'বুড়িচং ও ব্রাহ্মণপাড়ায়',
          description: DEFAULT_DESCRIPTION_BN,
          dateText: getBengaliDate(),
        };
      }
      return prev;
    });
  }, [language]);

  const handleCardStateChange = (updates: Partial<CardState>) => {
    setCardState((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCardState((prev) => ({
        ...prev,
        ...preset.cardState,
      }));
    }
  };

  const handleReset = () => {
    setCardState(DEFAULT_CARD_STATE);
  };

  const categoryPresets = [
    { id: 'burichang-regional', key: 'বুড়িচং', dot: 'bg-rose-500' },
    { id: 'brahmanpara-regional', key: 'ব্রাহ্মণপাড়া', dot: 'bg-emerald-500' },
    { id: 'comilla-news', key: 'কুমিল্লা', dot: 'bg-purple-500' },
    { id: 'national-news', key: 'বাংলাদেশ', dot: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-4">
      {/* ASP Connect News Workspace Action Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800 shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.categoriesLabel}
          </span>
          {categoryPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                isDark
                  ? 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {t.categoryNames[preset.key] || preset.key}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
              isDark
                ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.reference}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
              isDark
                ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.reset}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div
        className={`lg:hidden flex items-center p-1 rounded-xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'editor'
              ? 'bg-rose-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-400'
              : 'text-slate-600'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t.tabContent}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'preview'
              ? 'bg-rose-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-400'
              : 'text-slate-600'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.previewTitle}</span>
        </button>
      </div>

      {/* Dual Column Workspace (Existing Generator Untouched) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div
          className={`lg:col-span-6 space-y-3 ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <EditorPanel
            cardState={cardState}
            onChange={handleCardStateChange}
            isDarkUI={isDark}
            language={language}
          />
        </div>

        <div
          className={`lg:col-span-6 lg:sticky lg:top-20 space-y-3 ${
            mobileTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <PreviewPanel
            cardState={cardState}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
            isDarkUI={isDark}
            language={language}
          />
        </div>
      </div>

      <ReferenceModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onApplyReferenceStyle={() => handleSelectPreset('burichang-regional')}
      />
    </div>
  );
};
