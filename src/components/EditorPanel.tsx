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
} from 'lucide-react';
import { CardState, AspectRatio } from '../types/card';

interface EditorPanelProps {
  cardState: CardState;
  onChange: (updates: Partial<CardState>) => void;
  isDarkUI: boolean;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ cardState, onChange, isDarkUI }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'photo' | 'style'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ photoUrl: url, imagePanX: 0, imagePanY: 0, imageZoom: 1 });
    }
  };

  const contentSpacePercent = Math.round((cardState.contentHeightRatio ?? 0.40) * 100);

  // Categories requested: বুড়িচং, ব্রাহ্মণপাড়া, কুমিল্লা, বাংলাদেশ, আন্তর্জাতিক, অন্যান্য
  const newsCategories = [
    { name: 'বুড়িচং', color: '#DC2626' },
    { name: 'ব্রাহ্মণপাড়া', color: '#059669' },
    { name: 'কুমিল্লা', color: '#7C3AED' },
    { name: 'বাংলাদেশ', color: '#2563EB' },
    { name: 'আন্তর্জাতিক', color: '#D97706' },
    { name: 'অন্যান্য', color: '#4B5563' },
  ];

  const panelBg = isDarkUI ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const subBg = isDarkUI ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200';
  const inputBg = isDarkUI 
    ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-rose-500' 
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-rose-500';
  const textMuted = isDarkUI ? 'text-slate-400' : 'text-slate-600';
  const textTitle = isDarkUI ? 'text-slate-200' : 'text-slate-800';

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-lg transition-colors ${panelBg}`}>
      
      {/* Top Ratio Bar (Default 1:1) */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 text-xs ${subBg}`}>
        <span className={`font-semibold ${textTitle}`}>কার্ড রেশিও (১:১ ডিফল্ট):</span>
        <div className="flex gap-1.5">
          {[
            { id: '1:1', label: '১:১ স্কয়ার (ডিফল্ট)' },
            { id: '3:4', label: '৩:৪ পোর্ট্রেট' },
            { id: '4:3', label: '৪:৩' },
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
          <span>১. শিরোনাম ও ক্যাটাগরি</span>
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
          <span>২. ছবি ও ফ্রেমিং</span>
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
          <span>৩. স্পেস ও ফুটার</span>
        </button>
      </div>

      {/* Tab 1: Content (Headline, Highlight, Description, Categories: বুড়িচং, ব্রাহ্মণপাড়া, কুমিল্লা, বাংলাদেশ, আন্তর্জাতিক, অন্যান্য) */}
      {activeTab === 'content' && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* নিউজ ক্যাটাগরি */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold ${textTitle} flex items-center gap-1.5`}>
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>নিউজ ক্যাটাগরি নির্বাচন</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {newsCategories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => onChange({ category: cat.name, categoryColor: cat.color, showCategory: true })}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold border transition-all ${
                    cardState.category === cat.name
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-[1.02]'
                      : isDarkUI
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold ${textTitle}`}>
              সংবাদের মূল শিরোনাম
            </label>
            <textarea
              rows={2}
              value={cardState.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              placeholder="সংবাদের আকর্ষণীয় শিরোনাম লিখুন..."
              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm leading-relaxed transition-colors font-bengali ${inputBg}`}
            />
          </div>

          {/* Highlight words */}
          <div className={`p-3 rounded-xl border space-y-2 ${subBg}`}>
            <label className={`text-xs font-medium ${textTitle} flex items-center gap-1.5`}>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>হলুদ রঙে হাইলাইট করার শব্দ</span>
            </label>
            <input
              type="text"
              value={cardState.highlightPhrase}
              onChange={(e) => onChange({ highlightPhrase: e.target.value })}
              placeholder="যেমন: বুড়িচং ও ব্রাহ্মণপাড়ায়"
              className={`w-full border rounded-lg px-3 py-1.5 text-xs font-semibold text-yellow-400 ${inputBg}`}
            />
          </div>

          {/* Short description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold ${textTitle}`}>
                সংক্ষিপ্ত বিবরণ
              </label>
              <button
                type="button"
                onClick={() => onChange({ showDescription: !cardState.showDescription })}
                className="text-[11px] text-rose-500 hover:underline font-medium"
              >
                {cardState.showDescription ? 'লুকান' : 'যুক্ত করুন'}
              </button>
            </div>
            {cardState.showDescription && (
              <textarea
                rows={2}
                value={cardState.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="সংবাদের সংক্ষিপ্ত বিবরণ..."
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
              <span>নিজের ছবি আপলোড</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ photoUrl: '/assets/asp_sample_photo.jpg', imageZoom: 1, imagePanX: 0, imagePanY: 0 })}
              className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-xs font-semibold transition-all ${
                isDarkUI ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>ডিফল্ট সেমিনার ফটো</span>
            </button>
          </div>

          {/* Quick Zoom & Positioning Sliders */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className={`flex items-center gap-1 ${textTitle}`}>
                  <ZoomIn className="w-3.5 h-3.5 text-rose-500" /> ছবি জুম (Zoom)
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
                  <Move className="w-3.5 h-3.5 text-rose-500" /> উপরে/নিচে পজিশন (Vertical Pan)
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

      {/* Tab 3: Space Allocation & Footer (VISIT ASP2016.ORG) */}
      {activeTab === 'style' && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Space Allocation Slider */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={textTitle}>টেক্সট ও সংবাদের স্পেস</span>
              <span className="text-rose-500 font-bold font-mono">{contentSpacePercent}%</span>
            </div>
            <input
              type="range"
              min="25"
              max="55"
              step="5"
              value={contentSpacePercent}
              onChange={(e) => onChange({ contentHeightRatio: Number(e.target.value) / 100 })}
              className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>ছবি: {100 - contentSpacePercent}%</span>
              <span>নির্ধারিত: ৪০%</span>
            </div>
          </div>

          {/* Footer Callout: VISIT ASP2016.ORG */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>
              কার্ড ফুটার লেখা (Footer Callout)
            </label>
            <input
              type="text"
              value={cardState.footerCallout}
              onChange={(e) => onChange({ footerCallout: e.target.value })}
              placeholder="VISIT ASP2016.ORG"
              className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-rose-500 ${inputBg}`}
            />
          </div>

          {/* Date stamp */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${textTitle}`}>
              কোণার তারিখ (Date Stamp)
            </label>
            <input
              type="text"
              value={cardState.dateText}
              onChange={(e) => onChange({ dateText: e.target.value, dateMode: 'custom' })}
              className={`w-full border rounded-lg px-3 py-1.5 text-xs ${inputBg}`}
            />
          </div>

        </div>
      )}

    </div>
  );
};
