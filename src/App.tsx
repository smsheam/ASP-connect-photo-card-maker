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
import { Edit3, Eye, Download, ShieldCheck } from 'lucide-react';

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
    handleSelectPreset('ref-flight-cancellation');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
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
                : 'text-slate-400 hover:text-slate-200'
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
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>প্রিভিউ ও ডাউনলোড (Export)</span>
          </button>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Editor Controls */}
          <div className={`lg:col-span-6 space-y-4 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between pb-1">
              <div>
                <h1 className="text-base font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                  <span>ASP কানেক্ট ফটো কার্ড ক্রিয়েটর</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-normal">
                    বুড়িচং · ব্রাহ্মণপাড়া
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Powered by <span className="text-slate-300 font-semibold">Association Students' Progress (ASP)</span>
                </p>
              </div>
            </div>

            <EditorPanel
              cardState={cardState}
              onChange={handleCardStateChange}
            />
          </div>

          {/* Right Column: Live Preview & Export Panel */}
          <div className={`lg:col-span-6 lg:sticky lg:top-24 space-y-4 ${mobileTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
            <PreviewPanel
              cardState={cardState}
              isExporting={isExporting}
              setIsExporting={setIsExporting}
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
            <span className="text-slate-400">Powered by Association Students' Progress (ASP)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>৩*৪ সাইজ (৪০% সংবাদ · ৬০% ছবি)</span>
            <span>·</span>
            <span>বুড়িচং ও ব্রাহ্মণপাড়া রিজিউন</span>
            <span>·</span>
            <span className="text-emerald-400">১০০% অফলাইনে প্রস্তুত</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
