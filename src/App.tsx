/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CardState } from './types/card';
import { DEFAULT_CARD_STATE, SAMPLE_PRESETS } from './components/SampleCards';
import { Header } from './components/Header';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { ReferenceModal } from './components/ReferenceModal';
import { Edit3, Eye } from 'lucide-react';

export default function App() {
  const [cardState, setCardState] = useState<CardState>(DEFAULT_CARD_STATE);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

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

  const handleApplyReferenceStyle = () => {
    handleSelectPreset('burichang-regional');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <Header
        onExport={() => {
          const downloadBtn = document.querySelector('button[title="কার্ড ডাউনলোড (HD)"]') as HTMLButtonElement;
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
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Mobile Tab Toggle */}
        <div className="lg:hidden flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl mb-4">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              mobileTab === 'editor'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>কার্ড এডিটর (Edit)</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              mobileTab === 'preview'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>প্রিভিউ ও ডাউনলোড (Export)</span>
          </button>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Minimal Editor Controls */}
          <div className={`lg:col-span-6 space-y-3 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="pb-1">
              <h1 className="text-base font-bold flex items-center gap-2 flex-wrap">
                <span>ASP কানেক্ট ফটো কার্ড ক্রিয়েটর</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-normal">
                  ১:১ স্কয়ার
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>Powered by <strong className="text-slate-200">Association for Students' Progress - ASP</strong></span>
                <span>·</span>
                <span className="text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded text-[11px]">
                  Developed by SMSHEAM
                </span>
              </p>
            </div>

            <EditorPanel
              cardState={cardState}
              onChange={handleCardStateChange}
              isDarkUI={true}
            />
          </div>

          {/* Right Column: Live Preview & Export Panel */}
          <div className={`lg:col-span-6 lg:sticky lg:top-24 space-y-3 ${mobileTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
            <PreviewPanel
              cardState={cardState}
              isExporting={isExporting}
              setIsExporting={setIsExporting}
              isDarkUI={true}
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
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>ASP কানেক্ট © {new Date().getFullYear()}</span>
            <span className="mx-2">·</span>
            <span className="text-slate-400 font-medium">Association for Students' Progress - ASP</span>
            <span className="mx-2">·</span>
            <span className="text-rose-400 font-semibold">Developed by SMSHEAM</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>১:১ স্কয়ার ডিফল্ট</span>
            <span>·</span>
            <span>বুড়িচং · ব্রাহ্মণপাড়া · কুমিল্লা · বাংলাদেশ</span>
            <span>·</span>
            <span>VISIT ASP2016.ORG</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
