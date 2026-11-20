import React, { useRef, useState } from 'react';
import {
  Award,
  Image as ImageIcon,
  Palette,
  Edit3,
  Eye,
  RefreshCw,
  Sparkles,
  Upload,
  Trash2,
} from 'lucide-react';
import {
  AppreciationCardState,
  DEFAULT_APPRECIATION_STATE,
  StudioFontFamily,
} from '../types/studio';
import { renderAppreciationCard } from '../renderers/appreciationRenderer';
import { StudioPreviewExport } from '../components/studio/StudioPreviewExport';
import {
  AspectRatioBar,
  BackgroundGridControls,
  BrandingCommonControls,
  PhotoUploadPosition,
  useStudioStyles,
} from '../components/studio/SharedControls';
import { Language } from '../utils/translations';

interface AppreciationModuleProps {
  isDark: boolean;
  language: Language;
}

export const AppreciationModule: React.FC<AppreciationModuleProps> = ({ isDark, language }) => {
  const [state, setState] = useState<AppreciationCardState>(DEFAULT_APPRECIATION_STATE);
  const [activeTab, setActiveTab] = useState<'content' | 'photo' | 'style'>('content');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const topBgInputRef = useRef<HTMLInputElement>(null);

  const { panelBg, subBg, inputBg, textMuted, textTitle } = useStudioStyles(isDark);

  const update = (updates: Partial<AppreciationCardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleTopBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      update({ topBackgroundImageUrl: URL.createObjectURL(file) });
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
                {language === 'bn'
                  ? 'সম্মাননা ও কৃতজ্ঞতা কার্ড (Appreciation)'
                  : 'Appreciation Post Card Maker'}
              </span>
              <button
                type="button"
                onClick={() => setState(DEFAULT_APPRECIATION_STATE)}
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
              ratios={[
                { id: '4:5', label: '4:5 (Reference)' },
                { id: '1:1', label: '1:1 Square' },
                { id: '3:4', label: '3:4 Portrait' },
              ]}
            />

            {/* 3 Tabs */}
            <div className={`flex border-b p-1.5 gap-1 text-xs ${subBg}`}>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'content' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'শিরোনাম ও তথ্য' : 'Headline & Info'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'photo' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সদস্যের ছবি' : 'Portrait Photo'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'style' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'কালার, গ্রিড ও লোগো' : 'Colors & Logo'}</span>
              </button>
            </div>

            {/* Tab 1: Content & Highlight */}
            {activeTab === 'content' && (
              <div className="p-4 sm:p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold block ${textTitle}`}>
                    {language === 'bn' ? 'মূল সম্মাননা শিরোনাম' : 'Appreciation Headline'}
                  </label>
                  <textarea
                    rows={3}
                    value={state.headline}
                    onChange={(e) => update({ headline: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm font-bengali ${inputBg}`}
                  />
                  <input
                    type="range"
                    min="18"
                    max="48"
                    value={state.headlineSize}
                    onChange={(e) => update({ headlineSize: Number(e.target.value) })}
                    className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Highlight controls */}
                <div className={`p-3.5 rounded-xl border space-y-2.5 ${subBg}`}>
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-semibold flex items-center gap-1.5 ${textTitle}`}>
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>{language === 'bn' ? 'হাইলাইট করার অংশ' : 'Highlighted Phrase'}</span>
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => update({ highlightStyle: 'color' })}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${
                          state.highlightStyle === 'color'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : isDark
                            ? 'bg-slate-900 border-slate-700 text-slate-400'
                            : 'bg-white border-slate-300 text-slate-600'
                        }`}
                      >
                        {language === 'bn' ? 'টেক্সট কালার' : 'Color Text'}
                      </button>
                      <button
                        type="button"
                        onClick={() => update({ highlightStyle: 'pill' })}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${
                          state.highlightStyle === 'pill'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : isDark
                            ? 'bg-slate-900 border-slate-700 text-slate-400'
                            : 'bg-white border-slate-300 text-slate-600'
                        }`}
                      >
                        {language === 'bn' ? 'বক্স হাইলাইট' : 'Box Highlight'}
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={state.highlightPhrase}
                    onChange={(e) => update({ highlightPhrase: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs ${inputBg}`}
                  />
                  <div className="flex items-center gap-2 pt-1">
                    {['#2563EB', '#DC2626', '#059669', '#D97706', '#FACC15'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update({ highlightColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border border-black/30 cursor-pointer ${
                          state.highlightColor === c ? 'ring-2 ring-rose-500 scale-110' : ''
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={state.highlightColor}
                      onChange={(e) => update({ highlightColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>

                {/* Secondary message & size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-semibold ${textTitle}`}>
                      {language === 'bn' ? 'সহায়ক বার্তা / সোর্স (ঐচ্ছিক)' : 'Secondary Message'}
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {state.secondaryMessageSize}px
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={state.secondaryMessage}
                    onChange={(e) => update({ secondaryMessage: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs font-bengali ${inputBg}`}
                  />
                  <input
                    type="range"
                    min="12"
                    max="28"
                    value={state.secondaryMessageSize}
                    onChange={(e) => update({ secondaryMessageSize: Number(e.target.value) })}
                    className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                  />
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
                          ? 'bg-slate-950 border-slate-800 text-slate-300'
                          : 'bg-white border-slate-300 text-slate-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Member Photo & Backdrop */}
            {activeTab === 'photo' && (
              <div className="p-4 sm:p-5 space-y-4">
                <PhotoUploadPosition
                  label={language === 'bn' ? 'সদস্যের ছবি' : 'Member Photo'}
                  photoUrl={state.memberPhotoUrl}
                  originalPhotoUrl={state.originalMemberPhotoUrl}
                  zoom={state.photoZoom}
                  offsetX={state.photoOffsetX}
                  offsetY={state.photoOffsetY}
                  onUpload={(url, orig) =>
                    update({
                      memberPhotoUrl: url,
                      ...(orig ? { originalMemberPhotoUrl: orig } : {}),
                    })
                  }
                  onClear={() => update({ memberPhotoUrl: null, originalMemberPhotoUrl: null })}
                  onChangeZoom={(z) => update({ photoZoom: z })}
                  onChangeOffsetX={(x) => update({ photoOffsetX: x })}
                  onChangeOffsetY={(y) => update({ photoOffsetY: y })}
                  isDarkUI={isDark}
                  language={language}
                />

                <div className={`p-3 rounded-xl border flex items-center justify-between ${subBg}`}>
                  <span className={`text-xs font-semibold ${textTitle}`}>
                    {language === 'bn' ? 'ছবির বর্ডার / আউটলাইন' : 'Portrait Accent Outline'}
                  </span>
                  <button
                    type="button"
                    onClick={() => update({ showPhotoRing: !state.showPhotoRing })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                      state.showPhotoRing
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-400'
                        : 'bg-white border-slate-300 text-slate-600'
                    }`}
                  >
                    {state.showPhotoRing ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Optional blurred backdrop photo in top zone */}
                {state.layoutTemplate === 'reference-split' && (
                  <div className={`p-3.5 rounded-xl border space-y-2.5 ${subBg}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${textTitle}`}>
                        {language === 'bn'
                          ? 'উপরের ব্যাকগ্রাউন্ড ছবি (ঐচ্ছিক)'
                          : 'Top Backdrop Image (Optional)'}
                      </span>
                      {state.topBackgroundImageUrl && (
                        <button
                          type="button"
                          onClick={() => update({ topBackgroundImageUrl: null })}
                          className="text-xs text-rose-500 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'মুছুন' : 'Clear'}</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={topBgInputRef}
                      onChange={handleTopBgUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => topBgInputRef.current?.click()}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-rose-500'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-rose-500'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        {language === 'bn'
                          ? 'উপরের অংশে ব্যাকগ্রাউন্ড ছবি দিন'
                          : 'Upload Top Backdrop Photo'}
                      </span>
                    </button>

                    {state.topBackgroundImageUrl && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className={textMuted}>
                            {language === 'bn' ? 'ব্যাকগ্রাউন্ড ব্লার' : 'Backdrop Blur'}
                          </span>
                          <span className="font-mono text-slate-400">{state.topBgBlur}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="24"
                          value={state.topBgBlur}
                          onChange={(e) => update({ topBgBlur: Number(e.target.value) })}
                          className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Grid, Top & Bottom Panel Colors & Branding */}
            {activeTab === 'style' && (
              <div className="p-4 sm:p-5 space-y-4">
                <BackgroundGridControls
                  backgroundColor={state.backgroundColor}
                  showGrid={state.showGrid}
                  gridOpacity={state.gridOpacity}
                  onUpdate={update}
                  isDarkUI={isDark}
                  language={language}
                />

                {/* Bottom Panel Color & Main Text Color for Reference Split */}
                {state.layoutTemplate === 'reference-split' && (
                  <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${textTitle}`}>
                        {language === 'bn' ? 'নিচের টেক্সট প্যানেল কালার' : 'Bottom Panel Color'}
                      </span>
                      <div className="flex items-center gap-2">
                        {['#FFFFFF', '#F8FAFC', '#FFFBEB', '#0F172A'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() =>
                              update({
                                bottomPanelColor: c,
                                textColor: c === '#0F172A' ? '#FFFFFF' : '#0F172A',
                              })
                            }
                            style={{ backgroundColor: c }}
                            className={`w-5 h-5 rounded-full border border-black/30 cursor-pointer ${
                              state.bottomPanelColor.toUpperCase() === c ? 'ring-2 ring-rose-500 scale-110' : ''
                            }`}
                          />
                        ))}
                        <input
                          type="color"
                          value={state.bottomPanelColor}
                          onChange={(e) => update({ bottomPanelColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-500/15">
                      <span className={`text-xs font-semibold ${textTitle}`}>
                        {language === 'bn' ? 'শিরোনাম টেক্সট কালার' : 'Headline Text Color'}
                      </span>
                      <div className="flex items-center gap-2">
                        {['#0F172A', '#1E293B', '#FFFFFF', '#F8FAFC'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => update({ textColor: c })}
                            style={{ backgroundColor: c }}
                            className={`w-5 h-5 rounded-full border border-black/30 cursor-pointer ${
                              state.textColor.toUpperCase() === c ? 'ring-2 ring-rose-500 scale-110' : ''
                            }`}
                          />
                        ))}
                        <input
                          type="color"
                          value={state.textColor}
                          onChange={(e) => update({ textColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <BrandingCommonControls
                  state={state}
                  onUpdate={update}
                  isDarkUI={isDark}
                  language={language}
                  hideCaptionControl={false}
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
            renderFn={renderAppreciationCard}
            filenamePrefix="asp-appreciation"
            titleText={language === 'bn' ? 'লাইভ সম্মাননা কার্ড' : 'Appreciation Card Preview'}
            isDarkUI={isDark}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};
