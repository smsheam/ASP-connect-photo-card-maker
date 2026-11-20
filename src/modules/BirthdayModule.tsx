import React, { useRef, useState } from 'react';
import {
  User,
  Sparkles,
  Palette,
  Edit3,
  Eye,
  Upload,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { BirthdayCardState, DEFAULT_BIRTHDAY_STATE } from '../types/studio';
import { renderBirthdayCard } from '../renderers/birthdayRenderer';
import { StudioPreviewExport } from '../components/studio/StudioPreviewExport';
import {
  AspectRatioBar,
  BackgroundGridControls,
  BrandingCommonControls,
  PhotoUploadPosition,
  useStudioStyles,
} from '../components/studio/SharedControls';
import { Language } from '../utils/translations';

interface BirthdayModuleProps {
  isDark: boolean;
  language: Language;
}

export const BirthdayModule: React.FC<BirthdayModuleProps> = ({ isDark, language }) => {
  const [state, setState] = useState<BirthdayCardState>(DEFAULT_BIRTHDAY_STATE);
  const [activeTab, setActiveTab] = useState<'member' | 'graphic' | 'style'>('member');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const hbGraphicRef = useRef<HTMLInputElement>(null);

  const { panelBg, subBg, inputBg, textMuted, textTitle } = useStudioStyles(isDark);

  const update = (updates: Partial<BirthdayCardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleHbGraphicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      update({ happyBirthdayGraphicUrl: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Tab Switch */}
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
        {/* Left Column: Birthday Editor */}
        <div
          className={`lg:col-span-6 space-y-3 ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className={`border rounded-2xl overflow-hidden shadow-lg ${panelBg}`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${subBg}`}>
              <span className={`text-xs font-bold ${textTitle}`}>
                {language === 'bn' ? 'জন্মদিনের শুভেচ্ছা কার্ড স্টুডিও' : 'Birthday Card Maker'}
              </span>
              <button
                type="button"
                onClick={() => setState(DEFAULT_BIRTHDAY_STATE)}
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
                { id: '4:5', label: '4:5 (Default)' },
                { id: '1:1', label: '1:1 Square' },
                { id: '3:4', label: '3:4 Portrait' },
              ]}
            />

            {/* 3 Tabs */}
            <div className={`flex border-b p-1.5 gap-1 text-xs ${subBg}`}>
              <button
                type="button"
                onClick={() => setActiveTab('member')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'member'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : `${textMuted}`
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সদস্য ও ছবি' : 'Member & Photo'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('graphic')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'graphic'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : `${textMuted}`
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বার্থডে গ্রাফিক' : 'Birthday Graphic'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'style'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : `${textMuted}`
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'কালার, গ্রিড ও লোগো' : 'Background & Logo'}</span>
              </button>
            </div>

            {/* Tab 1: Member Info & Portrait */}
            {activeTab === 'member' && (
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

                {/* Portrait Outline Toggle */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${subBg}`}>
                  <div>
                    <span className={`text-xs font-bold block ${textTitle}`}>
                      {language === 'bn' ? 'পোর্ট্রেট আউটলাইন বর্ডার' : 'Portrait Outline Glow'}
                    </span>
                    <span className={`text-[11px] ${textMuted}`}>
                      {language === 'bn' ? 'PNG ছবির চারপাশে রঙিন বর্ডার' : 'Signature cutout contour around PNG'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.outlineColor}
                      onChange={(e) => update({ outlineColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => update({ showOutlineGlow: !state.showOutlineGlow })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                        state.showOutlineGlow
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-400'
                          : 'bg-white border-slate-300 text-slate-600'
                      }`}
                    >
                      {state.showOutlineGlow ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* Member Name & Designation */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold block ${textTitle}`}>
                      {language === 'bn' ? 'সদস্যের নাম' : "Member's Full Name"}
                    </label>
                    <input
                      type="text"
                      value={state.memberName}
                      onChange={(e) => update({ memberName: e.target.value })}
                      placeholder="SAHADAT HOSSEN SAZID"
                      className={`w-full border rounded-xl px-3.5 py-2 text-sm font-semibold ${inputBg}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold block ${textTitle}`}>
                      {language === 'bn' ? 'পদবী / পরিচয়' : 'Designation'}
                    </label>
                    <input
                      type="text"
                      value={state.memberDesignation}
                      onChange={(e) => update({ memberDesignation: e.target.value })}
                      placeholder="Former General Secretary, ASP"
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Happy Birthday Graphic & Wish Typography */}
            {activeTab === 'graphic' && (
              <div className="p-4 sm:p-5 space-y-4">
                <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-bold block ${textTitle}`}>
                        {language === 'bn'
                          ? 'Happy Birthday PNG গ্রাফিক (ঐচ্ছিক)'
                          : 'Happy Birthday PNG Graphic (Optional)'}
                      </span>
                      <span className={`text-[11px] ${textMuted}`}>
                        {language === 'bn'
                          ? 'আপনার নিজস্ব PNG আপলোড করুন অথবা বিল্ট-ইন ডিজাইন ব্যবহার করুন'
                          : 'Upload transparent PNG graphic or use built-in calligraphy'}
                      </span>
                    </div>
                    {state.happyBirthdayGraphicUrl && (
                      <button
                        type="button"
                        onClick={() => update({ happyBirthdayGraphicUrl: null })}
                        className="text-xs text-rose-500 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'মুছুন' : 'Reset'}</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={hbGraphicRef}
                    onChange={handleHbGraphicUpload}
                    accept="image/png,image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => hbGraphicRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      {state.happyBirthdayGraphicUrl
                        ? language === 'bn'
                          ? 'অন্য বার্থডে PNG আপলোড'
                          : 'Replace Happy Birthday PNG'
                        : language === 'bn'
                        ? 'Happy Birthday PNG আপলোড করুন'
                        : 'Upload Happy Birthday PNG'}
                    </span>
                  </button>

                  {!state.happyBirthdayGraphicUrl && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="space-y-1">
                        <label className={`text-[11px] font-medium block ${textMuted}`}>
                          {language === 'bn' ? 'উপরের শব্দ' : 'Top Prefix'}
                        </label>
                        <input
                          type="text"
                          value={state.topWishPrefix}
                          onChange={(e) => update({ topWishPrefix: e.target.value })}
                          className={`w-full border rounded-lg px-2.5 py-1.5 text-xs ${inputBg}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`text-[11px] font-medium block ${textMuted}`}>
                          {language === 'bn' ? 'মূল ক্যালিগ্রাফি লেখা' : 'Main Script Word'}
                        </label>
                        <input
                          type="text"
                          value={state.mainScriptTitle}
                          onChange={(e) => update({ mainScriptTitle: e.target.value })}
                          className={`w-full border rounded-lg px-2.5 py-1.5 text-xs ${inputBg}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Side Wish Box */}
                <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-semibold ${textTitle}`}>
                      {language === 'bn' ? 'পাশের শুভেচ্ছা বার্তা' : 'Side Crosshair Wish Note'}
                    </label>
                    <button
                      type="button"
                      onClick={() => update({ showSideWish: !state.showSideWish })}
                      className="text-[11px] text-rose-500 hover:underline font-semibold cursor-pointer"
                    >
                      {state.showSideWish
                        ? language === 'bn'
                          ? 'লুকান'
                          : 'Hide'
                        : language === 'bn'
                        ? 'দেখান'
                        : 'Show'}
                    </button>
                  </div>
                  {state.showSideWish && (
                    <textarea
                      rows={3}
                      value={state.sideWishText}
                      onChange={(e) => update({ sideWishText: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 text-xs ${inputBg}`}
                    />
                  )}
                </div>

                {/* Accent Color */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${subBg}`}>
                  <span className={`text-xs font-semibold ${textTitle}`}>
                    {language === 'bn' ? 'অ্যাকসেন্ট কালার (নাম ও ডিজাইন)' : 'Accent Color (Name & Lines)'}
                  </span>
                  <div className="flex items-center gap-2">
                    {['#BADC58', '#FACC15', '#38BDF8', '#F472B6', '#FFFFFF'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update({ accentColor: c, outlineColor: c })}
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

            {/* Tab 3: Background, Grid, ASP Logo, Date & Caption */}
            {activeTab === 'style' && (
              <div className="p-4 sm:p-5 space-y-4">
                <div className={`p-3 rounded-xl border flex items-center justify-between ${subBg}`}>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-rose-500" />
                    <span className={`text-xs font-semibold ${textTitle}`}>
                      {language === 'bn' ? 'ব্যাকগ্রাউন্ডে হালকা ASP টেক্সট' : 'Subtle ASP Text Texture'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => update({ showWatermarkPattern: !state.showWatermarkPattern })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                      state.showWatermarkPattern
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-400'
                        : 'bg-white border-slate-300 text-slate-600'
                    }`}
                  >
                    {state.showWatermarkPattern ? 'ON' : 'OFF'}
                  </button>
                </div>

                <BackgroundGridControls
                  backgroundColor={state.backgroundColor}
                  showGrid={state.showGrid}
                  gridOpacity={state.gridOpacity}
                  onUpdate={update}
                  isDarkUI={isDark}
                  language={language}
                />

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

        {/* Right Column: Live Preview & HD PNG Export */}
        <div
          className={`lg:col-span-6 lg:sticky lg:top-20 ${
            mobileTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <StudioPreviewExport
            state={state}
            aspectRatio={state.aspectRatio}
            renderFn={renderBirthdayCard}
            filenamePrefix={`asp-birthday-${(state.memberName || 'member').slice(0, 20).replace(/\s+/g, '-')}`}
            titleText={language === 'bn' ? 'লাইভ জন্মদিন কার্ড' : 'Birthday Card Preview'}
            isDarkUI={isDark}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};
