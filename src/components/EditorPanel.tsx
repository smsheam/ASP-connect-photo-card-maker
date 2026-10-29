import React, { useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Type,
  Tag,
  Layers,
  Upload,
  Sparkles,
  MapPin,
  ZoomIn,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import { CardState, AspectRatio } from '../types/card';
import { getEnglishDate, getBengaliDate } from '../utils/dateUtils';

interface EditorPanelProps {
  cardState: CardState;
  onChange: (updates: Partial<CardState>) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ cardState, onChange }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'photo' | 'brand' | 'style'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customLogoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ photoUrl: url, imagePanX: 0, imagePanY: 0, imageZoom: 1 });
    }
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ customLogoUrl: url, logoSource: 'custom-upload' });
    }
  };

  const primaryRegions = [
    { name: 'বুড়িচং', color: '#DC2626' },
    { name: 'ব্রাহ্মণপাড়া', color: '#059669' },
    { name: 'বুড়িচং-ব্রাহ্মণপাড়া', color: '#2563EB' },
  ];

  const secondaryCategories = [
    'শিক্ষা ও মেধা',
    'যুব ও ক্যারিয়ার',
    'সামাজিক উন্নয়ন',
    'বাংলাদেশ',
    'আন্তর্জাতিক',
    'খেলাধুলা',
  ];

  const highlightColors = [
    { name: 'Yellow (Reference)', value: '#FACC15' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Sky Blue', value: '#38BDF8' },
    { name: 'Pure White', value: '#FFFFFF' },
  ];

  const backgroundThemes = [
    { name: 'রেফারেন্স নেভি', value: '#0B132B' },
    { name: 'ডিপ স্লেট', value: '#0F172A' },
    { name: 'পিচ ব্ল্যাক', value: '#050505' },
    { name: 'ডার্ক রয়েল', value: '#0F1E36' },
  ];

  const contentSpacePercent = Math.round((cardState.contentHeightRatio ?? 0.40) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Offline & Ratio Status Banner */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>১০০% অফলাইনে প্রস্তুত</span>
        </span>
        <span className="text-rose-400 font-bold font-mono">
          সাইজ: ৩*৪ (শিরোনাম ও বিবরণ: {contentSpacePercent}%)
        </span>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'content'
              ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>শিরোনাম ও রিজিউন</span>
        </button>

        <button
          onClick={() => setActiveTab('photo')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'photo'
              ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>ছবি ও পজিশন</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'brand'
              ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>ASP ব্র্যান্ডিং ও ফুটার</span>
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'style'
              ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>৩*৪ সাইজ ও স্পেস</span>
        </button>
      </div>

      {/* Tab 1: Content (Headline, Highlight, Description, Category/Region, Space Adjuster) */}
      {activeTab === 'content' && (
        <div className="p-5 space-y-5">
          {/* Adjustable Space Allocation: 40% Default */}
          <div className="bg-slate-950/70 border border-rose-500/30 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-rose-400" />
                <span>শিরোনাম ও বিবরণের স্পেস (Content Space)</span>
              </span>
              <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-mono">
                {contentSpacePercent}%
              </span>
            </div>

            <input
              type="range"
              min="25"
              max="55"
              step="5"
              value={contentSpacePercent}
              onChange={(e) => onChange({ contentHeightRatio: Number(e.target.value) / 100 })}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 pt-1">
              <span>ছবি: {100 - contentSpacePercent}%</span>
              <div className="flex gap-1.5">
                {[
                  { label: '৩৫%', val: 0.35 },
                  { label: '৪০% (নির্ধারিত)', val: 0.40 },
                  { label: '৪৫%', val: 0.45 },
                  { label: '৫০%', val: 0.50 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onChange({ contentHeightRatio: preset.val })}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      Math.abs((cardState.contentHeightRatio ?? 0.40) - preset.val) < 0.02
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category & Region Section (বুড়িচং ও ব্রাহ্মণপাড়া) */}
          <div className="space-y-2.5 bg-slate-950/60 border border-slate-800 p-3.5 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>রিজিউন ও ক্যাটাগরি (Region)</span>
              </label>
              <button
                type="button"
                onClick={() => onChange({ showCategory: !cardState.showCategory })}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  cardState.showCategory
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cardState.showCategory ? 'চালু' : 'বন্ধ'}
              </button>
            </div>

            {cardState.showCategory && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cardState.category}
                    onChange={(e) => onChange({ category: e.target.value })}
                    placeholder="যেমন: বুড়িচং বা ব্রাহ্মণপাড়া"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 uppercase font-bold focus:outline-none focus:border-rose-500/80"
                  />
                  <input
                    type="color"
                    value={cardState.categoryColor}
                    onChange={(e) => onChange({ categoryColor: e.target.value })}
                    className="w-9 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
                    title="ক্যাটাগরি কালার"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-slate-400 font-medium">প্রধান দুই রিজিউন:</div>
                  <div className="flex flex-wrap gap-2">
                    {primaryRegions.map((reg) => (
                      <button
                        key={reg.name}
                        type="button"
                        onClick={() => onChange({ category: reg.name, categoryColor: reg.color })}
                        className={`px-3 py-1.5 text-xs rounded-lg border font-bold transition-all ${
                          cardState.category === reg.name
                            ? 'bg-rose-600 text-white border-rose-500 shadow-sm shadow-rose-950 scale-[1.02]'
                            : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        📍 {reg.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {secondaryCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onChange({ category: cat })}
                      className={`px-2 py-1 text-[11px] rounded border transition-colors ${
                        cardState.category === cat
                          ? 'bg-slate-700 text-white border-slate-600 font-semibold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Headline input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                মূল শিরোনাম (Headline)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">৪০% স্পেসের মূল অংশ</span>
            </div>
            <textarea
              rows={3}
              value={cardState.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              placeholder="সংবাদের আকর্ষণীয় শিরোনামটি লিখুন..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500/80 transition-colors leading-relaxed font-bengali"
            />
          </div>

          {/* Highlight word phrase */}
          <div className="space-y-2.5 bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>হলুদ রঙে হাইলাইট করার অংশ</span>
              </label>
              <div className="flex items-center gap-1.5">
                {highlightColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onChange({ highlightColor: color.value })}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      cardState.highlightColor === color.value ? 'scale-110 shadow-sm shadow-white/30' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.value, borderColor: color.value === '#FFFFFF' ? '#64748B' : color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <input
              type="text"
              value={cardState.highlightPhrase}
              onChange={(e) => onChange({ highlightPhrase: e.target.value })}
              placeholder="যেমন: বুড়িচং ও ব্রাহ্মণপাড়ায়"
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-yellow-400 placeholder-slate-600 focus:outline-none focus:border-yellow-500/80"
            />
          </div>

          {/* Short description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                সংক্ষিপ্ত বিবরণ (Short Description)
              </label>
              <button
                type="button"
                onClick={() => onChange({ showDescription: !cardState.showDescription })}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  cardState.showDescription
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cardState.showDescription ? 'চালু আছে' : 'বন্ধ করুন'}
              </button>
            </div>
            {cardState.showDescription && (
              <textarea
                rows={2}
                value={cardState.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="প্রাসঙ্গিক ১-২ লাইনের বিবরণ..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500/80 transition-colors font-bengali"
              />
            )}
          </div>

          {/* Typography choices */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                ফন্ট ফ্যামিলি
              </label>
              <select
                value={cardState.fontFamily}
                onChange={(e) => onChange({ fontFamily: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500/80"
              >
                <option value="Hind Siliguri">হিন্দ শিলিগুড়ি (স্ট্যান্ডার্ড)</option>
                <option value="Noto Sans Bengali">নোটো সান্স বেঙ্গলি</option>
                <option value="Tiro Bangla">তিরো বাংলা (সেরিফ)</option>
                <option value="Merriweather">Merriweather (English Serif)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta (Modern)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                শিরোনাম সাইজ ({cardState.headlineFontSize}px)
              </label>
              <input
                type="range"
                min="32"
                max="56"
                step="2"
                value={cardState.headlineFontSize}
                onChange={(e) => onChange({ headlineFontSize: Number(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Photo and Framing */}
      {activeTab === 'photo' && (
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                সংবাদের ছবি (কার্ডের ৬০% অংশ জুড়ে থাকবে)
              </label>
              <span className="text-[11px] text-emerald-400 font-medium">অফলাইনে সংরক্ষিত</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-rose-500/60 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <Upload className="w-4 h-4 text-rose-400" />
                <span>ডিভাইস থেকে ছবি আপলোড</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ photoUrl: '/assets/asp_sample_photo.jpg', imageZoom: 1, imagePanX: 0, imagePanY: 0 })}
                className="flex items-center justify-center gap-2 p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>ASP সেমিনার ফটো ব্যবহার</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5" /> ছবি জুম (Zoom)
                </span>
                <span>{Math.round(cardState.imageZoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={cardState.imageZoom}
                onChange={(e) => onChange({ imageZoom: Number(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>উপরে/নিচে ফেস ফ্রেমিং (Vertical Pan)</span>
                <span>{cardState.imagePanY}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={cardState.imagePanY}
                onChange={(e) => onChange({ imagePanY: Number(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>বামে/ডানে সরানো (Horizontal Pan)</span>
                <span>{cardState.imagePanX}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={cardState.imagePanX}
                onChange={(e) => onChange({ imagePanX: Number(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Branding & Footer */}
      {activeTab === 'brand' && (
        <div className="p-5 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                নিউজপোর্টাল লোগো (ASP কানেক্ট)
              </label>
              <span className="text-[11px] text-rose-400 font-semibold">অটো ব্র্যান্ডেড</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ logoSource: 'vector-brand', logoVariant: 'white-red' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  cardState.logoSource === 'vector-brand' && cardState.logoVariant === 'white-red'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold text-xs text-white">
                  ASP <span className="text-rose-500">কানেক্ট</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">এইচডি ভেক্টর (সুপার ক্লিয়ার)</div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ logoSource: 'uploaded-asset' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  cardState.logoSource === 'uploaded-asset'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                  <img src="/assets/aistudio/image_15d93372.png" alt="Uploaded Logo" className="h-4 object-contain" />
                  <span>মূল ছবি লোগো</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">প্রদত্ত লোগো ফাইল</div>
              </button>
            </div>
          </div>

          {/* Powered by Association Students' Progress (ASP) */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span>সংগঠনের নাম (Powered by ASP)</span>
              </label>
              <button
                type="button"
                onClick={() => onChange({ showPoweredBy: !cardState.showPoweredBy })}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  cardState.showPoweredBy
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cardState.showPoweredBy ? 'চালু' : 'বন্ধ'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              "Powered by Association Students' Progress (ASP)"
            </p>
          </div>

          {/* Date stamp */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                কোণার তারিখ (Date Stamp)
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onChange({ dateText: getBengaliDate(), dateMode: 'bn-standard' })}
                  className={`text-[11px] px-2 py-0.5 rounded ${
                    cardState.dateMode === 'bn-standard' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ dateText: getEnglishDate(), dateMode: 'en-standard' })}
                  className={`text-[11px] px-2 py-0.5 rounded ${
                    cardState.dateMode === 'en-standard' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ইংরেজি
                </button>
              </div>
            </div>
            <input
              type="text"
              value={cardState.dateText}
              onChange={(e) => onChange({ dateText: e.target.value, dateMode: 'custom' })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500/80"
            />
          </div>

          {/* Footer Bar */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                কার্ড ফুটার (কলআউট ও ডোমেইন)
              </label>
              <button
                type="button"
                onClick={() => onChange({ showFooter: !cardState.showFooter })}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  cardState.showFooter
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cardState.showFooter ? 'চালু' : 'বন্ধ'}
              </button>
            </div>

            {cardState.showFooter && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1 font-medium">
                    বাম পাশের কলআউট:
                  </label>
                  <input
                    type="text"
                    value={cardState.footerCallout}
                    onChange={(e) => onChange({ footerCallout: e.target.value })}
                    placeholder="বিস্তারিত ক্যাপশনে"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500/80 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1 font-medium">
                    ডান পাশের ডোমেইন:
                  </label>
                  <input
                    type="text"
                    value={cardState.footerUrl}
                    onChange={(e) => onChange({ footerUrl: e.target.value })}
                    placeholder="To learn More about ASP, Visit ASP2016.ORG"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-rose-400 focus:outline-none focus:border-rose-500/80 font-mono font-bold"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: 3*4 Size & Layout Settings */}
      {activeTab === 'style' && (
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                কার্ড সাইজ / রেশিও
              </label>
              <span className="text-[11px] text-rose-400 font-bold">৩*৪ সাইজ নির্ধারিত</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ aspectRatio: '3:4' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  cardState.aspectRatio === '3:4'
                    ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/30'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold text-xs text-rose-300 flex items-center justify-between">
                  <span>৩*৪ সাইজ (3:4)</span>
                  <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded">নির্ধারিত</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">১০৮০ × ১৪৪০ পিক্সেল (ভার্টিক্যাল পোর্ট্রেট)</div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ aspectRatio: '4:3' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  cardState.aspectRatio === '4:3'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold text-xs text-slate-200">৪*৩ সাইজ</div>
                <div className="text-[11px] text-slate-400 mt-1">১২০০ × ৯০০ পিক্সেল (ল্যান্ডস্কেপ)</div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ aspectRatio: '1:1' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  cardState.aspectRatio === '1:1'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold text-xs text-slate-200">১:১ স্কয়ার</div>
                <div className="text-[11px] text-slate-400 mt-1">বর্গাকার ফেসবুক পোস্ট</div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ aspectRatio: '16:9' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  cardState.aspectRatio === '16:9'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold text-xs text-slate-200">১৬:৯ ওয়াইড</div>
                <div className="text-[11px] text-slate-400 mt-1">ইউটিউব ও ভিডিও থাম্বনেইল</div>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              কার্ড ব্যাকগ্রাউন্ড থিম
            </label>
            <div className="grid grid-cols-2 gap-2">
              {backgroundThemes.map((bg) => (
                <button
                  key={bg.value}
                  type="button"
                  onClick={() => onChange({ themeBackground: bg.value })}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-colors ${
                    cardState.themeBackground === bg.value
                      ? 'border-rose-500 bg-slate-800'
                      : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded border border-slate-700 shrink-0"
                    style={{ backgroundColor: bg.value }}
                  />
                  <span className="text-xs text-slate-200">{bg.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
