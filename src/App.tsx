/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Globe, Sun, Moon } from 'lucide-react';
import { OFFICIAL_ASP_LOGO_URL, StudioModuleId } from './types/studio';
import { DashboardHome } from './components/studio/DashboardHome';
import { NewsModule } from './modules/NewsModule';
import { BirthdayModule } from './modules/BirthdayModule';
import { AppreciationModule } from './modules/AppreciationModule';
import { AnnouncementModule } from './modules/AnnouncementModule';
import { BloodDonationModule } from './modules/BloodDonationModule';
import { Language, TRANSLATIONS } from './utils/translations';

const MODULE_META: Record<
  Exclude<StudioModuleId, 'dashboard'>,
  { labelBn: string; labelEn: string }
> = {
  news: { labelBn: 'ASP কানেক্ট নিউজ', labelEn: 'ASP Connect News' },
  birthday: { labelBn: 'জন্মদিন কার্ড', labelEn: 'Birthday Card' },
  appreciation: { labelBn: 'সম্মাননা পোস্ট', labelEn: 'Appreciation Post' },
  announcement: { labelBn: 'অফিশিয়াল বিজ্ঞপ্তি', labelEn: 'Announcement' },
  blood: { labelBn: 'রক্তদান কার্ড', labelEn: 'Blood Donation' },
};

export default function App() {
  const [activeModule, setActiveModule] = useState<StudioModuleId>('dashboard');
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const isDark = theme === 'dark';
  const t = TRANSLATIONS[language];

  // Keep <html> .dark class synchronized with theme state
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navModules: Exclude<StudioModuleId, 'dashboard'>[] = [
    'news',
    'birthday',
    'appreciation',
    'announcement',
    'blood',
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-rose-500 selection:text-white ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Unified Studio Top Bar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-6 py-3 transition-colors ${
          isDark
            ? 'bg-slate-950/90 border-slate-800/90 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Title / Home Button */}
          <div className="flex items-center gap-3 shrink-0">
            {activeModule !== 'dashboard' ? (
              <button
                type="button"
                onClick={() => setActiveModule('dashboard')}
                className={`inline-flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'text-slate-200 hover:text-rose-400'
                    : 'text-slate-800 hover:text-rose-600'
                }`}
              >
                <ArrowLeft className="w-4 h-4 text-rose-500" />
                <span>{language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveModule('dashboard')}
                className="inline-flex items-center gap-2.5 text-left cursor-pointer whitespace-nowrap shrink-0"
              >
                <img
                  src={OFFICIAL_ASP_LOGO_URL}
                  alt="ASP Logo"
                  className="w-8 h-8 rounded-lg bg-white object-contain p-0.5 border border-slate-200 dark:border-slate-700"
                />
                <span className="font-display text-base sm:text-lg font-extrabold tracking-tight">
                  ASP Photo Card Studio
                </span>
              </button>
            )}
          </div>

          {/* Zone 2: Clean Single-Line Module Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold">
            {navModules.map((modId) => {
              const isActive = activeModule === modId;
              const meta = MODULE_META[modId];
              return (
                <button
                  key={modId}
                  type="button"
                  onClick={() => setActiveModule(modId)}
                  className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-rose-500 text-rose-500'
                      : isDark
                      ? 'border-transparent text-slate-400 hover:text-slate-100'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? meta.labelBn : meta.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language & Theme Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleLanguage}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
              title="Switch Language (বাংলা / English)"
            >
              <Globe className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.toggleLanguage}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title={isDark ? t.whiteMode : t.darkMode}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-slate-300">{t.whiteMode}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="hidden sm:inline text-slate-700">{t.darkMode}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeModule === 'dashboard' ? (
          <DashboardHome
            onSelectModule={(m) => setActiveModule(m)}
            isDark={isDark}
            language={language}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5">
            {/* Active Module Context Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModule('dashboard')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'bn' ? 'হোম স্ক্রিনে ফিরুন' : 'Back to Dashboard'}</span>
                </button>
                <span className="text-slate-500 text-xs">/</span>
                <h1 className="font-display text-base sm:text-lg font-bold">
                  {language === 'bn'
                    ? MODULE_META[activeModule].labelBn
                    : MODULE_META[activeModule].labelEn}
                </h1>
              </div>

              {/* Mobile Horizontal Module Switcher */}
              <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {navModules.map((modId) => (
                  <button
                    key={modId}
                    type="button"
                    onClick={() => setActiveModule(modId)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border whitespace-nowrap shrink-0 cursor-pointer ${
                      activeModule === modId
                        ? 'bg-rose-600 text-white border-rose-600'
                        : isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-400'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {language === 'bn'
                      ? MODULE_META[modId].labelBn
                      : MODULE_META[modId].labelEn}
                  </button>
                ))}
              </div>
            </div>

            {activeModule === 'news' && <NewsModule isDark={isDark} language={language} />}
            {activeModule === 'birthday' && (
              <BirthdayModule isDark={isDark} language={language} />
            )}
            {activeModule === 'appreciation' && (
              <AppreciationModule isDark={isDark} language={language} />
            )}
            {activeModule === 'announcement' && (
              <AnnouncementModule isDark={isDark} language={language} />
            )}
            {activeModule === 'blood' && (
              <BloodDonationModule isDark={isDark} language={language} />
            )}
          </div>
        )}
      </main>

      {/* Studio Footer */}
      <footer
        className={`mt-auto border-t px-4 py-4 text-center text-xs transition-colors ${
          isDark
            ? 'border-slate-900 bg-slate-950/80 text-slate-500'
            : 'border-slate-200 bg-white/80 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold">ASP Photo Card Studio</span>
            <span className="mx-2">·</span>
            <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              {t.poweredBy}
            </span>
            <span className="mx-2">·</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              {t.developedBy}
            </span>
          </div>
          <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="font-bold text-rose-500">VISIT ASP2016.ORG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
