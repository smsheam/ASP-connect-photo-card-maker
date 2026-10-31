import React from 'react';
import { Download, RefreshCw, Eye, Sun, Moon, Globe } from 'lucide-react';
import { LogoVector } from './LogoVector';
import { Language, TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  onExport: () => void;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
  onToggleCompare: () => void;
  isExporting: boolean;
  language: Language;
  onToggleLanguage: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExport,
  onSelectPreset,
  onReset,
  onToggleCompare,
  isExporting,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
}) => {
  const t = TRANSLATIONS[language];
  const isDark = theme === 'dark';

  const categoryPresets = [
    { id: 'burichang-regional', key: 'বুড়িচং', color: 'text-rose-500' },
    { id: 'brahmanpara-regional', key: 'ব্রাহ্মণপাড়া', color: 'text-emerald-500' },
    { id: 'comilla-news', key: 'কুমিল্লা', color: 'text-purple-500' },
    { id: 'national-news', key: 'বাংলাদেশ', color: 'text-blue-500' },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-6 py-2.5 transition-colors ${
      isDark 
        ? 'bg-slate-950/90 border-slate-800/90 text-slate-100' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Zone 1: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <LogoVector variant={isDark ? 'white-red' : 'mono-black'} size={0.65} />
        </div>

        {/* Zone 2: Category Presets */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-medium">
          <span className={`mr-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.categoriesLabel}
          </span>
          {categoryPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <span className={preset.color}>● </span>
              {t.categoryNames[preset.key] || preset.key}
            </button>
          ))}
        </div>

        {/* Zone 3: Actions (Language, Theme, Reset, Download) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Dual-Language Toggle (Bangla ↔ English) */}
          <button
            onClick={onToggleLanguage}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Switch Language (বাংলা / English)"
          >
            <Globe className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.toggleLanguage}</span>
          </button>

          {/* Dual-Theme Toggle (Dark 🌙 ↔ White ☀️) */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-800 hover:border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title={isDark ? t.whiteMode : t.darkMode}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-slate-300 text-[11px]">{t.whiteMode}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline text-slate-700 text-[11px]">{t.darkMode}</span>
              </>
            )}
          </button>

          {/* Reference Modal Trigger */}
          <button
            onClick={onToggleCompare}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title={t.reference}
          >
            <Eye className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.reference}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className={`p-2 rounded-lg border transition-all ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
            }`}
            title={t.reset}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Direct Download Button */}
          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] rounded-xl shadow-sm transition-all whitespace-nowrap disabled:opacity-60"
            title={t.downloadHd}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? t.creating : t.downloadHd}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
