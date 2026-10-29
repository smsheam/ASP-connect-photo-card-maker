import React from 'react';
import { Download, RefreshCw, Eye } from 'lucide-react';
import { LogoVector } from './LogoVector';

interface HeaderProps {
  onExport: () => void;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
  onToggleCompare: () => void;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onExport,
  onSelectPreset,
  onReset,
  onToggleCompare,
  isExporting,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors text-slate-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Logo + Association for Students' Progress - ASP */}
        <div className="flex items-center gap-3 shrink-0">
          <LogoVector variant="white-red" size={0.65} />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[11px] font-semibold tracking-tight text-rose-400">
              Association for Students' Progress - ASP
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Developed by SMSHEAM
            </span>
          </div>
        </div>

        {/* Zone 2: Category Presets */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="text-slate-500 mr-1">ক্যাটাগরি:</span>
          <button
            onClick={() => onSelectPreset('burichang-regional')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap"
          >
            বুড়িচং
          </button>
          <button
            onClick={() => onSelectPreset('brahmanpara-regional')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap"
          >
            ব্রাহ্মণপাড়া
          </button>
          <button
            onClick={() => onSelectPreset('comilla-news')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap"
          >
            কুমিল্লা
          </button>
          <button
            onClick={() => onSelectPreset('national-news')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap"
          >
            বাংলাদেশ
          </button>
        </div>

        {/* Zone 3: Actions (Reset, Download) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          <button
            onClick={onToggleCompare}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
            title="রেফারেন্স তুলনা"
          >
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span>রেফারেন্স</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="রিসেট"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'তৈরি...' : 'ডাউনলোড (১:১)'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
