import React from 'react';
import { Download, RefreshCw, Eye, WifiOff } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark + Powered by ASP + Developed by SMSHEAM */}
        <div className="flex items-center gap-3 shrink-0">
          <LogoVector variant="white-red" size={0.65} />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] text-slate-400 font-medium">
              Powered by Association Students' Progress (ASP)
            </span>
            <span className="text-[10px] text-rose-400 font-semibold tracking-wide">
              Developed by SMSHEAM
            </span>
          </div>
        </div>

        {/* Zone 2: Regional Presets */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-slate-500 mr-1">রিজিউন:</span>
          <button
            onClick={() => onSelectPreset('burichang-regional')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap shrink-0 font-bold"
          >
            📍 বুড়িচং
          </button>
          <button
            onClick={() => onSelectPreset('brahmanpara-regional')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap shrink-0 font-bold"
          >
            📍 ব্রাহ্মণপাড়া
          </button>
          <button
            onClick={() => onSelectPreset('asp-central-news')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            ASP কেন্দ্রীয়
          </button>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded">
            <WifiOff className="w-3 h-3" />
            <span>অফলাইন রেডী</span>
          </div>

          <button
            onClick={onToggleCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
            title="রেফারেন্স ডিজাইনের সাথে তুলনা করুন"
          >
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">রেফারেন্স</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
            title="রিসেট করুন"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] rounded-lg shadow-sm shadow-rose-950 transition-all whitespace-nowrap shrink-0 disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'তৈরি হচ্ছে...' : 'কার্ড ডাউনলোড (৩*৪)'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
