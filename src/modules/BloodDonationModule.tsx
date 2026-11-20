import React, { useState } from 'react';
import {
  HeartHandshake,
  Droplet,
  Palette,
  Edit3,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  BloodCardTemplate,
  BloodDonationCardState,
  DEFAULT_BLOOD_DONATION_STATE,
} from '../types/studio';
import { renderBloodDonationCard } from '../renderers/bloodDonationRenderer';
import { StudioPreviewExport } from '../components/studio/StudioPreviewExport';
import {
  AspectRatioBar,
  BackgroundGridControls,
  BrandingCommonControls,
  PhotoUploadPosition,
  useStudioStyles,
} from '../components/studio/SharedControls';
import { Language } from '../utils/translations';
import { getBengaliDate } from '../utils/dateUtils';

interface BloodDonationModuleProps {
  isDark: boolean;
  language: Language;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const BloodDonationModule: React.FC<BloodDonationModuleProps> = ({ isDark, language }) => {
  const [state, setState] = useState<BloodDonationCardState>(DEFAULT_BLOOD_DONATION_STATE);
  const [activeTab, setActiveTab] = useState<'donor' | 'text' | 'style'>('donor');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  const { panelBg, subBg, inputBg, textMuted, textTitle } = useStudioStyles(isDark);

  const update = (updates: Partial<BloodDonationCardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const applyBanglaPreset = () => {
    update({
      topTaglinePrefix: 'রক্তদান হোক মানবতার',
      topTaglineHighlight: 'জীবন বাঁচানোর সেতু...',
      heroWordTop: 'আন্তরিক',
      heroWordScript: 'কৃতজ্ঞতা!',
      gratitudeLead: 'এএসপি-র পক্ষ থেকে আন্তরিক ধন্যবাদ ও কৃতজ্ঞতা',
      donationVerbText: 'আজ স্বেচ্ছায়',
      bagCountText: '১ ব্যাগ',
      donationTailText: 'রক্তদান করার জন্য।',
      subMessage: DEFAULT_BLOOD_DONATION_STATE.subMessage,
      bottomQuote: 'আসুন, মানবতার কল্যাণে নিয়মিত রক্তদানে এগিয়ে আসি।',
      dateText: getBengaliDate(),
    });
  };

  const applyEnglishReferencePreset = () => {
    update({
      ...DEFAULT_BLOOD_DONATION_STATE,
      donorPhotoUrl: state.donorPhotoUrl,
      originalDonorPhotoUrl: state.originalDonorPhotoUrl,
      dateText: getBengaliDate(),
    });
  };

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
                {language === 'bn' ? 'ASP রক্তদান কার্ড স্টুডিও' : 'ASP Blood Donation Card Maker'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={applyBanglaPreset}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                >
                  বাংলা টেমপ্লেট
                </button>
                <button
                  type="button"
                  onClick={applyEnglishReferencePreset}
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
            </div>

            {/* Template Switcher: Donor Thank You vs Urgent Blood Request */}
            <div className={`p-3 border-b ${subBg}`}>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'thank-you' as BloodCardTemplate,
                    label:
                      language === 'bn'
                        ? 'রক্তদাতা কৃতজ্ঞতা (Thank You)'
                        : 'Donor Gratitude (Thank You)',
                  },
                  {
                    id: 'blood-request' as BloodCardTemplate,
                    label:
                      language === 'bn'
                        ? 'জরুরি রক্তের আবেদন (Request)'
                        : 'Urgent Blood Request',
                  },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => update({ templateMode: tpl.id })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      state.templateMode === tpl.id
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : isDark
                        ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <AspectRatioBar
              aspectRatio={state.aspectRatio}
              onChange={(r) => update({ aspectRatio: r })}
              isDarkUI={isDark}
              language={language}
              ratios={[
                { id: '1:1', label: '1:1 (Reference)' },
                { id: '4:5', label: '4:5 Portrait' },
                { id: '3:4', label: '3:4 Portrait' },
              ]}
            />

            {/* 3 Tabs */}
            <div className={`flex border-b p-1.5 gap-1 text-xs ${subBg}`}>
              <button
                type="button"
                onClick={() => setActiveTab('donor')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'donor' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>
                  {state.templateMode === 'thank-you'
                    ? language === 'bn'
                      ? 'দাতার তথ্য ও ছবি'
                      : 'Donor & Photo'
                    : language === 'bn'
                    ? 'রোগী ও রক্তের গ্রুপ'
                    : 'Request Details'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'text' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বার্তা ও উক্তি' : 'Messages'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'style' ? 'bg-rose-600 text-white shadow-sm' : textMuted
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'কালার, গ্রিড ও লোগো' : 'Style & Logo'}</span>
              </button>
            </div>

            {/* Tab 1: Donor & Blood Group OR Urgent Blood Request Details */}
            {activeTab === 'donor' && (
              <div className="p-4 sm:p-5 space-y-4">
                {/* Blood Group Pills (Interactive Selector) */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold block ${textTitle}`}>
                    {language === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন' : 'Blood Group'}
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => update({ bloodGroup: bg })}
                        className={`py-2 rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                          state.bloodGroup === bg
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : isDark
                            ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {state.templateMode === 'thank-you' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-xs font-semibold block ${textTitle}`}>
                          {language === 'bn' ? 'রক্তদাতার নাম' : 'Donor Name'}
                        </label>
                        <input
                          type="text"
                          value={state.donorName}
                          onChange={(e) => update({ donorName: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2 text-xs font-semibold ${inputBg}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`text-xs font-semibold block ${textTitle}`}>
                          {language === 'bn' ? 'পদবী / পরিচয়' : 'Designation'}
                        </label>
                        <input
                          type="text"
                          value={state.donorDesignation}
                          onChange={(e) => update({ donorDesignation: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2 text-xs ${inputBg}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={`text-xs font-semibold block ${textTitle}`}>
                        {language === 'bn' ? 'রক্তের পরিমাণ (ব্যাগ)' : 'Bags Donated'}
                      </label>
                      <input
                        type="text"
                        value={state.bagCountText}
                        onChange={(e) => update({ bagCountText: e.target.value })}
                        placeholder="1 bag / ১ ব্যাগ"
                        className={`w-full border rounded-xl px-3 py-2 text-xs ${inputBg}`}
                      />
                    </div>

                    <PhotoUploadPosition
                      label={
                        language === 'bn'
                          ? 'রক্তদাতার ছবি (ডান পাশে প্রদর্শিত হবে)'
                          : 'Donor Portrait Photo (Right Side)'
                      }
                      hint={
                        language === 'bn'
                          ? 'রক্তের ব্যাগসহ ছবি বা PNG কাটআউট আপলোড করুন'
                          : 'Supports transparent PNG or standard donor portrait'
                      }
                      photoUrl={state.donorPhotoUrl}
                      originalPhotoUrl={state.originalDonorPhotoUrl}
                      zoom={state.photoZoom}
                      offsetX={state.photoOffsetX}
                      offsetY={state.photoOffsetY}
                      onUpload={(url, orig) =>
                        update({
                          donorPhotoUrl: url,
                          ...(orig ? { originalDonorPhotoUrl: orig } : {}),
                        })
                      }
                      onClear={() =>
                        update({ donorPhotoUrl: null, originalDonorPhotoUrl: null })
                      }
                      onChangeZoom={(z) => update({ photoZoom: z })}
                      onChangeOffsetX={(x) => update({ photoOffsetX: x })}
                      onChangeOffsetY={(y) => update({ photoOffsetY: y })}
                      isDarkUI={isDark}
                      language={language}
                    />
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={`text-xs font-semibold block ${textTitle}`}>
                        {language === 'bn' ? 'শিরোনাম' : 'Request Headline'}
                      </label>
                      <input
                        type="text"
                        value={state.requestTitle}
                        onChange={(e) => update({ requestTitle: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-bold ${inputBg}`}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-xs font-semibold block ${textTitle}`}>
                          {language === 'bn' ? 'রক্তের পরিমাণ' : 'Quantity Needed'}
                        </label>
                        <input
                          type="text"
                          value={state.bagCountText}
                          onChange={(e) => update({ bagCountText: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2 text-xs ${inputBg}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`text-xs font-semibold block ${textTitle}`}>
                          {language === 'bn' ? 'যোগাযোগ নম্বর' : 'Contact Number'}
                        </label>
                        <input
                          type="text"
                          value={state.contactNumber}
                          onChange={(e) => update({ contactNumber: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2 text-xs font-mono ${inputBg}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={`text-xs font-semibold block ${textTitle}`}>
                        {language === 'bn' ? 'রোগীর অবস্থা / সমস্যা' : 'Patient Condition'}
                      </label>
                      <input
                        type="text"
                        value={state.patientCondition}
                        onChange={(e) => update({ patientCondition: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs ${inputBg}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-xs font-semibold block ${textTitle}`}>
                        {language === 'bn' ? 'হাসপাতাল ও ঠিকানা' : 'Hospital / Location'}
                      </label>
                      <input
                        type="text"
                        value={state.hospitalLocation}
                        onChange={(e) => update({ hospitalLocation: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs ${inputBg}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Editable Bangla & English Copy */}
            {activeTab === 'text' && (
              <div className="p-4 sm:p-5 space-y-3">
                {state.templateMode === 'thank-you' && (
                  <>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className={`text-xs font-semibold block ${textTitle}`}>
                          {language === 'bn' ? 'উপরের লাইন' : 'Top Tagline'}
                        </label>
                        <input
                          type="text"
                          value={state.topTaglinePrefix}
                          onChange={(e) => update({ topTaglinePrefix: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs ${inputBg}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`text-xs font-semibold block ${textTitle}`}>
                          {language === 'bn' ? 'লাল স্ক্রিপ্ট অংশ' : 'Highlight Script'}
                        </label>
                        <input
                          type="text"
                          value={state.topTaglineHighlight}
                          onChange={(e) => update({ topTaglineHighlight: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs ${inputBg}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className={`text-xs font-semibold block ${textTitle}`}>
                          {language === 'bn' ? 'হিরো শব্দ ১' : 'Hero Word 1'}
                        </label>
                        <input
                          type="text"
                          value={state.heroWordTop}
                          onChange={(e) => update({ heroWordTop: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs font-bold ${inputBg}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`text-xs font-semibold block ${textTitle}`}>
                          {language === 'bn' ? 'হিরো স্ক্রিপ্ট ২' : 'Hero Script 2'}
                        </label>
                        <input
                          type="text"
                          value={state.heroWordScript}
                          onChange={(e) => update({ heroWordScript: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs font-bold ${inputBg}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={`text-xs font-semibold block ${textTitle}`}>
                        {language === 'bn' ? 'কৃতজ্ঞতা ভূমিকা লাইন' : 'Gratitude Lead Text'}
                      </label>
                      <input
                        type="text"
                        value={state.gratitudeLead}
                        onChange={(e) => update({ gratitudeLead: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-1.5 text-xs ${inputBg}`}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className={`text-xs font-semibold block ${textTitle}`}>
                    {language === 'bn' ? 'অনুপ্রেরণামূলক বার্তা' : 'Inspiring Sub-Message'}
                  </label>
                  <input
                    type="text"
                    value={state.subMessage}
                    onChange={(e) => update({ subMessage: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs ${inputBg}`}
                  />
                </div>

                {state.templateMode === 'thank-you' && (
                  <div className="space-y-1">
                    <label className={`text-xs font-semibold block ${textTitle}`}>
                      {language === 'bn' ? 'নিচের মানবিক উক্তি ব্যানার' : 'Bottom Humanity Quote'}
                    </label>
                    <textarea
                      rows={2}
                      value={state.bottomQuote}
                      onChange={(e) => update({ bottomQuote: e.target.value })}
                      className={`w-full border rounded-xl px-3 py-2 text-xs ${inputBg}`}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Background Color, Grid & Common Branding */}
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

                <div className={`p-3 rounded-xl border flex items-center justify-between ${subBg}`}>
                  <span className={`text-xs font-semibold ${textTitle}`}>
                    {language === 'bn' ? 'রক্তদান থিম কালার' : 'Crimson Theme Accent'}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.primaryColor}
                      onChange={(e) => update({ primaryColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="color"
                      value={state.accentColor}
                      onChange={(e) => update({ accentColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>

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
            renderFn={renderBloodDonationCard}
            filenamePrefix={`asp-blood-${state.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}
            titleText={
              language === 'bn' ? 'লাইভ রক্তদান কার্ড' : 'Blood Donation Card Preview'
            }
            isDarkUI={isDark}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};
