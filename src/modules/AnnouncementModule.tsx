import React, { useRef, useState } from 'react';
import {
  Megaphone,
  Layers,
  Palette,
  Edit3,
  Eye,
  Upload,
  Trash2,
  RefreshCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Grid,
  Square,
} from 'lucide-react';
import {
  AnnouncementBackgroundMode,
  AnnouncementCardState,
  DEFAULT_ANNOUNCEMENT_STATE,
  StudioFontFamily,
} from '../types/studio';
import { renderAnnouncementCard } from '../renderers/announcementRenderer';
import { StudioPreviewExport } from '../components/studio/StudioPreviewExport';
import {
  AspectRatioBar,
  BackgroundGridControls,
  BrandingCommonControls,
  useStudioStyles,
} from '../components/studio/SharedControls';
import { Language } from '../utils/translations';

interface AnnouncementModuleProps {
  isDark: boolean;
  language: Language;
}

export const AnnouncementModule: React.FC<AnnouncementModuleProps> = ({ isDark, language }) => {
  const [state, setState] = useState<AnnouncementCardState>(DEFAULT_ANNOUNCEMENT_STATE);
  const [activeTab, setActiveTab] = useState<'text' | 'background' | 'branding'>('text');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const bgImageRef = useRef<HTMLInputElement>(null);

  const { panelBg, subBg, inputBg, textMuted, textTitle } = useStudioStyles(isDark);

  const update = (updates: Partial<AnnouncementCardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      update({
        backgroundImageUrl: URL.createObjectURL(file),
        backgroundMode: 'blurred-image',
      });
    }
  };

  const handleBgModeSelect = (mode: AnnouncementBackgroundMode) => {
    if (mode === 'solid-grid') {
      update({ backgroundMode: mode, showGrid: true });
    } else if (mode === 'solid-clean') {
      update({ backgroundMode: mode, showGrid: false });
    } else {
      update({ backgroundMode: mode });
    }
  };

  const fonts: { id: StudioFontFamily; label: string }[] = [
    { id: 'Hind Siliguri', label: 'Hind Siliguri' },
    { id: 'Noto Sans Bengali', label: 'Noto Sans Bengali' },
    { id: 'Tiro Bangla', label: 'Tiro Bangla (Serif)' },
    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
    { id: 'Merriweather', label: 'Merriweather' },
  ];

  return (
    <div className="space-y-4">
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
          <span>{language === 'bn' ? 'এডিটর' : 'Editor'}</span>
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
          <span>{language === 'bn' ? 'প্রিভিউ ও ডাউনলোড' : 'Preview & Export'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div
          className={`lg:col-span-6 space-y-3 ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className={`border rounded-2xl overflow-hidden shadow-lg ${panelBg}`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${subBg}`}>
              <span className={`text-xs font-bold ${textTitle}`}>
                {language === 'bn' ? 'অফিশিয়াল বিজ্ঞপ্তি ও ঘোষণা কার্ড' : 'Announcement Card Maker'}
              </span>
              <button
                type="button"
                onClick={() => setState(DEFAULT_ANNOUNCEMENT_STATE)}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            </div>

            <AspectRatioBar
              aspectRatio={state.aspectRatio}
              onChange={(r) => update({ aspectRatio: r })}
              isDarkUI={isDark}
              language={language}
            />

            {/* 3 Tabs */}
            <div className={`flex border-b p-1.5 gap-1 text-xs ${subBg}`}>
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'text' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বিজ্ঞপ্তির লেখা' : 'Announcement Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('background')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'background' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ব্যাকগ্রাউন্ড ধরন' : 'Background Mode'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('branding')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'branding' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লোগো ও তারিখ' : 'Branding & Date'}</span>
              </button>
            </div>

            {/* Tab 1: Announcement Text & Typography */}
            {activeTab === 'text' && (
              <div className="p-4 sm:p-5 space-y-4">
                <div className={`p-3 rounded-xl border space-y-2 ${subBg}`}>
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-semibold ${textTitle}`}>
                      {language === 'bn' ? 'ঘোষণা ব্যাজ / শিরোনাম ট্যাগ' : 'Announcement Label'}
                    </label>
                    <button
                      type="button"
                      onClick={() => update({ showBadge: !state.showBadge })}
                      className="text-[11px] text-rose-500 hover:underline font-semibold cursor-pointer"
                    >
                      {state.showBadge ? (language === 'bn' ? 'লুকান' : 'Hide') : language === 'bn' ? 'দেখান' : 'Show'}
                    </button>
                  </div>
                  {state.showBadge && (
                    <input
                      type="text"
                      value={state.badgeLabel}
                      onChange={(e) => update({ badgeLabel: e.target.value })}
                      placeholder="জরুরি বিজ্ঞপ্তি / OFFICIAL ANNOUNCEMENT"
                      className={`w-full border rounded-lg px-3 py-1.5 text-xs font-bold ${inputBg}`}
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold block ${textTitle}`}>
                    {language === 'bn' ? 'মূল ঘোষণা / শিরোনাম' : 'Announcement Headline'}
                  </label>
                  <textarea
                    rows={2}
                    value={state.announcementTitle}
                    onChange={(e) => update({ announcementTitle: e.target.value })}
                    placeholder={
                      language === 'bn'
                        ? 'ঘোষণার মূল শিরোনাম লিখুন...'
                        : 'Enter primary announcement headline...'
                    }
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm font-bengali ${inputBg}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold block ${textTitle}`}>
                    {language === 'bn' ? 'বিস্তারিত বার্তা / বিবরণ' : 'Announcement Details'}
                  </label>
                  <textarea
                    rows={4}
                    value={state.announcementBody}
                    onChange={(e) => update({ announcementBody: e.target.value })}
                    placeholder={
                      language === 'bn'
                        ? 'ঘোষণার বিস্তারিত তথ্য লিখুন...'
                        : 'Enter announcement text...'
                    }
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs leading-relaxed font-bengali ${inputBg}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold block ${textTitle}`}>
                    {language === 'bn' ? 'নিচের সহায়ক নোট (ঐচ্ছিক)' : 'Footer Sub-Note (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={state.footerSubNote}
                    onChange={(e) => update({ footerSubNote: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs font-bengali ${inputBg}`}
                  />
                </div>

                {/* Alignment & Auto-fit Sizing */}
                <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${textTitle}`}>
                      {language === 'bn' ? 'অ্যালাইনমেন্ট ও ফন্ট' : 'Alignment & Font'}
                    </span>
                    <div className="flex gap-1">
                      {[
                        { id: 'left' as const, icon: AlignLeft },
                        { id: 'center' as const, icon: AlignCenter },
                        { id: 'right' as const, icon: AlignRight },
                      ].map((al) => {
                        const Icon = al.icon;
                        return (
                          <button
                            key={al.id}
                            type="button"
                            onClick={() => update({ textAlignment: al.id })}
                            className={`p-1.5 rounded-lg border cursor-pointer ${
                              state.textAlignment === al.id
                                ? 'bg-rose-600 text-white border-rose-600'
                                : isDark
                                ? 'bg-slate-900 border-slate-700 text-slate-400'
                                : 'bg-white border-slate-300 text-slate-600'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {fonts.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => update({ fontFamily: f.id })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer ${
                          state.fontFamily === f.id
                            ? 'bg-rose-600 text-white border-rose-600'
                            : isDark
                            ? 'bg-slate-900 border-slate-700 text-slate-300'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Individual Size Sliders for Every Text Element */}
                  <div className="pt-2 border-t border-slate-500/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${textTitle}`}>
                        {language === 'bn'
                          ? 'সব টেক্সটের সাইজ ও পজিশন কন্ট্রোল'
                          : 'All Text Sizes & Position Controls'}
                      </span>
                      <button
                        type="button"
                        onClick={() => update({ autoFitText: !state.autoFitText })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                          state.autoFitText
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : isDark
                            ? 'bg-slate-900 border-slate-700 text-slate-400'
                            : 'bg-white border-slate-300 text-slate-600'
                        }`}
                      >
                        {state.autoFitText ? 'AUTO SIZE ON' : 'CUSTOM SIZE'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={textMuted}>
                            {language === 'bn' ? 'ব্যাজ / ট্যাগ সাইজ' : 'Badge Font Size'}
                          </span>
                          <span className="font-mono text-rose-500 font-bold">
                            {state.badgeFontSize}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="14"
                          max="40"
                          value={state.badgeFontSize}
                          onChange={(e) =>
                            update({ badgeFontSize: Number(e.target.value), autoFitText: false })
                          }
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={textMuted}>
                            {language === 'bn' ? 'শিরোনাম সাইজ' : 'Headline Size'}
                          </span>
                          <span className="font-mono text-rose-500 font-bold">
                            {state.titleFontSize}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="22"
                          max="76"
                          value={state.titleFontSize}
                          onChange={(e) =>
                            update({ titleFontSize: Number(e.target.value), autoFitText: false })
                          }
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={textMuted}>
                            {language === 'bn' ? 'বিবরণ টেক্সট সাইজ' : 'Body Font Size'}
                          </span>
                          <span className="font-mono text-rose-500 font-bold">
                            {state.bodyFontSize}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="16"
                          max="48"
                          value={state.bodyFontSize}
                          onChange={(e) =>
                            update({ bodyFontSize: Number(e.target.value), autoFitText: false })
                          }
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={textMuted}>
                            {language === 'bn' ? 'নিচের নোট সাইজ' : 'Sub-Note Size'}
                          </span>
                          <span className="font-mono text-rose-500 font-bold">
                            {state.subNoteFontSize}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="14"
                          max="38"
                          value={state.subNoteFontSize}
                          onChange={(e) =>
                            update({ subNoteFontSize: Number(e.target.value), autoFitText: false })
                          }
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Vertical Anchor Position */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={textMuted}>
                          {language === 'bn' ? 'উল্লম্ব অবস্থান (Vertical)' : 'Vertical Anchor'}
                        </span>
                        {(state.textOffsetX !== 0 || state.textOffsetY !== 0) && (
                          <button
                            type="button"
                            onClick={() => update({ textOffsetX: 0, textOffsetY: 0 })}
                            className="text-rose-500 hover:underline font-semibold cursor-pointer"
                          >
                            {language === 'bn' ? 'পজিশন রিসেট' : 'Reset Position'}
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'top' as const, label: language === 'bn' ? 'উপরে' : 'Top' },
                          { id: 'center' as const, label: language === 'bn' ? 'মাঝখানে' : 'Center' },
                          { id: 'bottom' as const, label: language === 'bn' ? 'নিচে' : 'Bottom' },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() => update({ textVerticalPosition: pos.id })}
                            className={`py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                              state.textVerticalPosition === pos.id
                                ? 'bg-rose-600 text-white border-rose-600'
                                : isDark
                                ? 'bg-slate-900 border-slate-700 text-slate-400'
                                : 'bg-white border-slate-300 text-slate-600'
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fine X & Y Nudge Sliders */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={textMuted}>
                            {language === 'bn' ? 'ডানে/বামে (X)' : 'Position X'}
                          </span>
                          <span className="font-mono text-slate-400">{state.textOffsetX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="4"
                          value={state.textOffsetX}
                          onChange={(e) => update({ textOffsetX: Number(e.target.value) })}
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={textMuted}>
                            {language === 'bn' ? 'উপরে/নিচে (Y)' : 'Position Y'}
                          </span>
                          <span className="font-mono text-slate-400">{state.textOffsetY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-260"
                          max="260"
                          step="4"
                          value={state.textOffsetY}
                          onChange={(e) => update({ textOffsetY: Number(e.target.value) })}
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: 3 Background Options */}
            {activeTab === 'background' && (
              <div className="p-4 sm:p-5 space-y-4">
                <div className="space-y-2">
                  <label className={`text-xs font-bold block ${textTitle}`}>
                    {language === 'bn' ? 'ব্যাকগ্রাউন্ডের ধরন নির্বাচন করুন' : 'Select Background Mode'}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleBgModeSelect('blurred-image')}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        state.backgroundMode === 'blurred-image'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs font-bold">
                        {language === 'bn' ? 'ব্লার করা ছবি' : 'Blurred Image'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBgModeSelect('solid-grid')}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        state.backgroundMode === 'solid-grid'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                      <span className="text-xs font-bold">
                        {language === 'bn' ? 'রঙ + গ্রিড' : 'Solid + Grid'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBgModeSelect('solid-clean')}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        state.backgroundMode === 'solid-clean'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Square className="w-4 h-4" />
                      <span className="text-xs font-bold">
                        {language === 'bn' ? 'ক্লিন সলিড রঙ' : 'Solid Clean'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Controls for Blurred Image Mode */}
                {state.backgroundMode === 'blurred-image' ? (
                  <div className={`p-4 rounded-xl border space-y-3 ${subBg}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${textTitle}`}>
                        {language === 'bn' ? 'ব্যাকগ্রাউন্ড ছবি আপলোড' : 'Upload Background Photo'}
                      </span>
                      {state.backgroundImageUrl && (
                        <button
                          type="button"
                          onClick={() => update({ backgroundImageUrl: null })}
                          className="text-xs text-rose-500 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'মুছুন' : 'Clear'}</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={bgImageRef}
                      onChange={handleBgImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => bgImageRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {state.backgroundImageUrl
                          ? language === 'bn'
                            ? 'অন্য ছবি নির্বাচন করুন'
                            : 'Replace Background Photo'
                          : language === 'bn'
                          ? 'ছবি আপলোড করুন'
                          : 'Upload Background Photo'}
                      </span>
                    </button>

                    <div className="space-y-2.5 pt-1">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={textTitle}>
                            {language === 'bn' ? 'ব্লার মাত্রা (Blur Intensity)' : 'Blur Intensity'}
                          </span>
                          <span className="font-mono text-rose-500 font-bold">
                            {state.blurIntensity}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={state.blurIntensity}
                          onChange={(e) => update({ blurIntensity: Number(e.target.value) })}
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={textTitle}>
                            {language === 'bn' ? 'ডার্ক স্ক্রিম ওভারলে' : 'Contrast Dark Overlay'}
                          </span>
                          <span className="font-mono text-slate-400">
                            {Math.round(state.scrimOpacity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.15"
                          max="0.85"
                          step="0.05"
                          value={state.scrimOpacity}
                          onChange={(e) => update({ scrimOpacity: Number(e.target.value) })}
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <BackgroundGridControls
                    backgroundColor={state.backgroundColor}
                    showGrid={state.backgroundMode === 'solid-grid' ? true : state.showGrid}
                    gridOpacity={state.gridOpacity}
                    onUpdate={(u) => {
                      if (u.showGrid !== undefined) {
                        update({
                          ...u,
                          backgroundMode: u.showGrid ? 'solid-grid' : 'solid-clean',
                        });
                      } else {
                        update(u);
                      }
                    }}
                    isDarkUI={isDark}
                    language={language}
                    hideGridToggle={false}
                  />
                )}

                {/* Accent color */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${subBg}`}>
                  <span className={`text-xs font-semibold ${textTitle}`}>
                    {language === 'bn' ? 'হাইলাইট / ব্যাজ কালার' : 'Badge & Accent Color'}
                  </span>
                  <div className="flex items-center gap-2">
                    {['#FACC15', '#EF4444', '#38BDF8', '#10B981', '#FFFFFF'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update({ accentColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border border-black/30 cursor-pointer ${
                          state.accentColor === c ? 'ring-2 ring-rose-500 scale-110' : ''
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={state.accentColor}
                      onChange={(e) => update({ accentColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Common Branding, Date & Caption */}
            {activeTab === 'branding' && (
              <div className="p-4 sm:p-5">
                <BrandingCommonControls
                  state={state}
                  onUpdate={update}
                  isDarkUI={isDark}
                  language={language}
                  hideCaptionControl={true}
                  fixedLogoSize={400}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Preview & HD Export */}
        <div
          className={`lg:col-span-6 lg:sticky lg:top-20 ${
            mobileTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <StudioPreviewExport
            state={state}
            aspectRatio={state.aspectRatio}
            renderFn={renderAnnouncementCard}
            filenamePrefix="asp-announcement"
            titleText={language === 'bn' ? 'লাইভ বিজ্ঞপ্তি কার্ড' : 'Announcement Card Preview'}
            isDarkUI={isDark}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};
