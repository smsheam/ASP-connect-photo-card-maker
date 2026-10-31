/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CardState } from './types/card';
import { 
  DEFAULT_CARD_STATE, 
  SAMPLE_PRESETS,
  DEFAULT_HEADLINE_BN,
  DEFAULT_HEADLINE_EN,
  DEFAULT_DESCRIPTION_BN,
  DEFAULT_DESCRIPTION_EN
} from './components/SampleCards';
import { Header } from './components/Header';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { ReferenceModal } from './components/ReferenceModal';
import { Edit3, Eye } from 'lucide-react';
import { Language, TRANSLATIONS } from './utils/translations';
import { getBengaliDate } from './utils/dateUtils';

export default function App() {
  const [cardState, setCardState] = useState<CardState>(DEFAULT_CARD_STATE);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const t = TRANSLATIONS[language];
  const isDark = theme === 'dark';

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

  const handleToggleLanguage = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);

    // If card still has default text, offer seamless switch to corresponding language
    setCardState((prev) => {
      if (nextLang === 'en' && prev.headline === DEFAULT_HEADLINE_BN) {
        return {
          ...prev,
          headline: DEFAULT_HEADLINE_EN,
          highlightPhrase: 'Burichang and Brahmanpara',
          description: DEFAULT_DESCRIPTION_EN,
          dateText: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
        };
      } else if (nextLang === 'bn' && prev.headline === DEFAULT_HEADLINE_EN) {
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
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleApplyReferenceStyle = () => {
    handleSelectPreset('burichang-regional');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-rose-500 selection:text-white ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header with Language & Theme Switches */}
      <Header
        onExport={() => {
          const downloadBtn = document.querySelector('button[title="' + t.downloadHd + '"]') as HTMLButtonElement;
          if (downloadBtn) {
            downloadBtn.click();
          } else {
            setMobileTab('preview');
          }
        }}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onToggleCompare={() => setIsCompareOpen(true)}
        isExporting={isExporting}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Mobile Tab Toggle */}
        <div className={`lg:hidden flex items-center p-1 rounded-xl mb-4 border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              mobileTab === 'editor'
                ? 'bg-rose-600 text-white shadow-sm'
                : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.tabContent}</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              mobileTab === 'preview'
                ? 'bg-rose-600 text-white shadow-sm'
                : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.previewTitle}</span>
          </button>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Editor Controls */}
          <div className={`lg:col-span-6 space-y-3 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="pb-1">
              <h1 className="text-base font-bold flex items-center gap-2 flex-wrap">
                <span>{t.appTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-medium">
                  {t.ratioSquare}
                </span>
              </h1>
            </div>

            <EditorPanel
              cardState={cardState}
              onChange={handleCardStateChange}
              isDarkUI={isDark}
              language={language}
            />
          </div>

          {/* Right Column: Live Preview & Export Panel */}
          <div className={`lg:col-span-6 lg:sticky lg:top-20 space-y-3 ${mobileTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
            <PreviewPanel
              cardState={cardState}
              isExporting={isExporting}
              setIsExporting={setIsExporting}
              isDarkUI={isDark}
              language={language}
            />
          </div>

        </div>
      </main>

      {/* Reference comparison modal */}
      <ReferenceModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onApplyReferenceStyle={handleApplyReferenceStyle}
      />

      {/* Footer */}
      <footer className={`mt-auto border-t px-4 py-4 text-center text-xs transition-colors ${
        isDark 
          ? 'border-slate-900 bg-slate-950/80 text-slate-500' 
          : 'border-slate-200 bg-white/80 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>{t.portalName} © {new Date().getFullYear()}</span>
            <span className="mx-2">·</span>
            <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{t.poweredBy}</span>
            <span className="mx-2">·</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">{t.developedBy}</span>
          </div>
          <div className={`flex items-center gap-3 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>1:1 Default</span>
            <span>·</span>
            <span>বুড়িচং · ব্রাহ্মণপাড়া · কুমিল্লা · বাংলাদেশ</span>
            <span>·</span>
            <span className="font-bold text-rose-500">VISIT ASP2016.ORG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
