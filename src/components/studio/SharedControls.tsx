import React, { useRef, useState } from 'react';
import {
  Grid,
  Palette,
  Upload,
  Check,
  Calendar,
  ZoomIn,
  Move,
  RotateCcw,
  Trash2,
  Type,
  Wand2,
  Loader2,
  Layers,
} from 'lucide-react';
import { CommonStudioCardProps, OFFICIAL_ASP_LOGO_URL, StudioAspectRatio } from '../../types/studio';
import { Language } from '../../utils/translations';
import { removePhotoBackground } from '../../utils/bgRemover';

export const STUDIO_BG_PRESETS = [
  { name: 'ASP Forest', color: '#0B3B24' },
  { name: 'ASP Navy', color: '#0B132B' },
  { name: 'Royal Blue', color: '#1E3A8A' },
  { name: 'Midnight Slate', color: '#0F172A' },
  { name: 'Deep Crimson', color: '#7F1D1D' },
  { name: 'Royal Indigo', color: '#1E1B4B' },
  { name: 'Blood Rose', color: '#FFF5F6' },
  { name: 'Clean White', color: '#FFFFFF' },
];

export function useStudioStyles(isDarkUI: boolean) {
  return {
    panelBg: isDarkUI
      ? 'bg-slate-900 border-slate-800 text-slate-100'
      : 'bg-white border-slate-200 text-slate-900 shadow-xs',
    subBg: isDarkUI
      ? 'bg-slate-950/60 border-slate-800'
      : 'bg-slate-50 border-slate-200',
    inputBg: isDarkUI
      ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none',
    textMuted: isDarkUI ? 'text-slate-400' : 'text-slate-600',
    textTitle: isDarkUI ? 'text-slate-200' : 'text-slate-800',
  };
}

interface AspectRatioBarProps {
  aspectRatio: StudioAspectRatio;
  onChange: (ratio: StudioAspectRatio) => void;
  isDarkUI: boolean;
  language: Language;
  ratios?: { id: StudioAspectRatio; label: string }[];
}

export const AspectRatioBar: React.FC<AspectRatioBarProps> = ({
  aspectRatio,
  onChange,
  isDarkUI,
  language,
  ratios,
}) => {
  const { subBg, textTitle } = useStudioStyles(isDarkUI);
  const options = ratios || [
    { id: '1:1' as StudioAspectRatio, label: '1:1' },
    { id: '4:5' as StudioAspectRatio, label: '4:5' },
    { id: '3:4' as StudioAspectRatio, label: '3:4' },
    { id: '4:3' as StudioAspectRatio, label: '4:3' },
  ];

  return (
    <div className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 text-xs ${subBg}`}>
      <span className={`font-semibold whitespace-nowrap ${textTitle}`}>
        {language === 'bn' ? 'কার্ডের অনুপাত:' : 'Aspect Ratio:'}
      </span>
      <div className="flex gap-1.5 flex-wrap justify-end">
        {options.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onChange(r.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
              aspectRatio === r.id
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
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
  );
};

interface BackgroundGridControlsProps {
  backgroundColor: string;
  showGrid: boolean;
  gridOpacity: number;
  onUpdate: (updates: Partial<CommonStudioCardProps>) => void;
  isDarkUI: boolean;
  language: Language;
  hideColorPicker?: boolean;
  hideGridToggle?: boolean;
}

export const BackgroundGridControls: React.FC<BackgroundGridControlsProps> = ({
  backgroundColor,
  showGrid,
  gridOpacity,
  onUpdate,
  isDarkUI,
  language,
  hideColorPicker = false,
  hideGridToggle = false,
}) => {
  const { subBg, inputBg, textMuted, textTitle } = useStudioStyles(isDarkUI);

  return (
    <div className="space-y-4">
      {!hideGridToggle && (
        <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <span className={`text-xs font-bold block ${textTitle}`}>
                  {language === 'bn' ? 'ব্যাকগ্রাউন্ড গ্রিড ওভারলে' : 'Background Grid Overlay'}
                </span>
                <span className={`text-[11px] ${textMuted}`}>
                  {language === 'bn'
                    ? 'কালার পরিবর্তন করলেও গ্রিড সেটিংস অটুট থাকবে'
                    : 'Subtle studio grid retained across color changes'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdate({ showGrid: !showGrid })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                showGrid
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : isDarkUI
                  ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              {showGrid
                ? language === 'bn'
                  ? 'গ্রিড চালু'
                  : 'Grid ON'
                : language === 'bn'
                ? 'গ্রিড বন্ধ'
                : 'Grid OFF'}
            </button>
          </div>

          {showGrid && (
            <div className="pt-2 border-t border-slate-500/15 space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className={textMuted}>
                  {language === 'bn' ? 'গ্রিডের স্বচ্ছতা' : 'Grid Opacity'}
                </span>
                <span className="font-mono tabular-nums text-slate-400">
                  {Math.round(gridOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.04"
                max="0.32"
                step="0.02"
                value={gridOpacity}
                onChange={(e) => onUpdate({ gridOpacity: Number(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {!hideColorPicker && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${textTitle}`}>
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>{language === 'bn' ? 'ব্যাকগ্রাউন্ড কালার' : 'Background Color'}</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">{backgroundColor}</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {STUDIO_BG_PRESETS.map((preset) => {
              const selected = backgroundColor.toUpperCase() === preset.color.toUpperCase();
              const lightChip = preset.color === '#FFFFFF' || preset.color === '#FFF5F6';
              return (
                <button
                  key={preset.color}
                  type="button"
                  title={preset.name}
                  onClick={() => onUpdate({ backgroundColor: preset.color })}
                  style={{ backgroundColor: preset.color }}
                  className={`h-9 rounded-xl border border-black/25 flex items-center justify-center transition-transform cursor-pointer ${
                    selected ? 'scale-105 ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-900' : 'hover:scale-105'
                  }`}
                >
                  {selected && (
                    <Check className={`w-4 h-4 ${lightChip ? 'text-slate-900' : 'text-white'}`} />
                  )}
                </button>
              );
            })}
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${subBg}`}>
            <span className={`text-xs font-medium ${textMuted}`}>
              {language === 'bn' ? 'কাস্টম হেক্স কালার:' : 'Custom Hex Color:'}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className={`w-24 text-xs font-mono font-bold px-2 py-1 rounded border ${inputBg}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface BrandingCommonControlsProps {
  state: CommonStudioCardProps;
  onUpdate: (updates: Partial<CommonStudioCardProps>) => void;
  isDarkUI: boolean;
  language: Language;
  hideCaptionControl?: boolean;
  fixedLogoSize?: number;
}

export const BrandingCommonControls: React.FC<BrandingCommonControlsProps> = ({
  state,
  onUpdate,
  isDarkUI,
  language,
  hideCaptionControl = false,
  fixedLogoSize,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { subBg, inputBg, textMuted, textTitle } = useStudioStyles(isDarkUI);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdate({ logoUrl: url, showLogo: true });
    }
  };

  return (
    <div className="space-y-3.5">
      {/* ASP Logo Upload & 200-400% Size */}
      <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img
              src={state.logoUrl}
              alt="ASP Logo"
              className="w-9 h-9 object-contain rounded-lg bg-white/90 p-0.5 border border-slate-300/40"
            />
            <div>
              <span className={`text-xs font-bold block ${textTitle}`}>
                {language === 'bn' ? 'ASP লোগো (উপরে-বামে)' : 'ASP Logo (Top-Left)'}
              </span>
              <span className={`text-[11px] ${textMuted}`}>
                {state.logoUrl === OFFICIAL_ASP_LOGO_URL
                  ? language === 'bn'
                    ? 'অফিশিয়াল ASP লোগো সংযুক্ত'
                    : 'Official ASP Logo Active'
                  : language === 'bn'
                  ? 'কাস্টম লোগো সংযুক্ত'
                  : 'Custom Logo Active'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onUpdate({ showLogo: !state.showLogo })}
            className="text-[11px] text-rose-500 hover:underline font-semibold cursor-pointer"
          >
            {state.showLogo
              ? language === 'bn'
                ? 'লুকান'
                : 'Hide'
              : language === 'bn'
              ? 'দেখান'
              : 'Show'}
          </button>
        </div>

        <input
          type="file"
          ref={logoInputRef}
          onChange={handleLogoUpload}
          accept="image/png,image/svg+xml,image/*"
          className="hidden"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নতুন লোগো আপলোড' : 'Upload ASP Logo PNG'}</span>
          </button>

          {state.logoUrl !== OFFICIAL_ASP_LOGO_URL && (
            <button
              type="button"
              onClick={() => onUpdate({ logoUrl: OFFICIAL_ASP_LOGO_URL })}
              className={`flex items-center gap-1 py-2 px-3 rounded-lg border text-xs font-semibold cursor-pointer ${
                isDarkUI
                  ? 'bg-slate-900 border-slate-700 text-slate-300'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অফিশিয়াল' : 'Reset'}</span>
            </button>
          )}
        </div>

        {/* Logo Size 400% Fixed OR Adjustable 200-400% */}
        {fixedLogoSize ? (
          <div className="flex justify-between text-xs items-center pt-1">
            <span className={textTitle}>
              {language === 'bn' ? 'লোগো সাইজ' : 'Logo Size'}
            </span>
            <span className="font-mono tabular-nums text-rose-500 font-bold">
              {fixedLogoSize}% (Fixed)
            </span>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs items-center">
              <span className={textTitle}>
                {language === 'bn' ? 'লোগো সাইজ (২০০% - ৪০০%)' : 'Logo Size (200% - 400%)'}
              </span>
              <span className="font-mono tabular-nums text-rose-500 font-bold">
                {state.logoSize}%
              </span>
            </div>
            <div className="flex gap-1.5">
              {[200, 250, 300, 350, 400].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onUpdate({ logoSize: sz })}
                  className={`flex-1 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                    state.logoSize === sz
                      ? 'bg-rose-600 text-white border-rose-600'
                      : isDarkUI
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  {sz}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="100"
              max="400"
              step="10"
              value={state.logoSize}
              onChange={(e) => onUpdate({ logoSize: Number(e.target.value) })}
              className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Large Background Logo Watermark Option */}
      <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <span className={`text-xs font-bold block ${textTitle}`}>
                {language === 'bn'
                  ? 'ব্যাকগ্রাউন্ডে বড় লোগো ওয়াটারমার্ক'
                  : 'Large Background Logo Watermark'}
              </span>
              <span className={`text-[11px] ${textMuted}`}>
                {language === 'bn'
                  ? 'কার্ডের পেছনে হালকা বড় লোগো জলছাপ'
                  : 'Subtle oversized ASP emblem behind content'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onUpdate({ showLogoWatermark: !state.showLogoWatermark })}
            className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
              state.showLogoWatermark
                ? 'bg-emerald-600 text-white border-emerald-500'
                : isDarkUI
                ? 'bg-slate-900 border-slate-700 text-slate-400'
                : 'bg-white border-slate-300 text-slate-600'
            }`}
          >
            {state.showLogoWatermark ? 'ON' : 'OFF'}
          </button>
        </div>

        {state.showLogoWatermark && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-500/15">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className={textMuted}>
                  {language === 'bn' ? 'ওয়াটারমার্ক স্বচ্ছতা' : 'Opacity'}
                </span>
                <span className="font-mono text-slate-400">
                  {Math.round((state.logoWatermarkOpacity ?? 0.08) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.03"
                max="0.25"
                step="0.01"
                value={state.logoWatermarkOpacity ?? 0.08}
                onChange={(e) => onUpdate({ logoWatermarkOpacity: Number(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className={textMuted}>
                  {language === 'bn' ? 'ওয়াটারমার্ক সাইজ' : 'Size Scale'}
                </span>
                <span className="font-mono text-slate-400">
                  {Math.round((state.logoWatermarkScale ?? 1.0) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={state.logoWatermarkScale ?? 1.0}
                onChange={(e) => onUpdate({ logoWatermarkScale: Number(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Top-Right Current Date (Bangla) */}
      <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
        <div className="flex items-center justify-between">
          <label className={`text-xs font-semibold flex items-center gap-1.5 ${textTitle}`}>
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>{language === 'bn' ? 'বাংলা তারিখ (উপরে-ডানে)' : 'Bangla Date (Top-Right)'}</span>
          </label>
          <button
            type="button"
            onClick={() => onUpdate({ showDate: !state.showDate })}
            className="text-[11px] text-rose-500 hover:underline font-semibold cursor-pointer"
          >
            {state.showDate ? (language === 'bn' ? 'লুকান' : 'Hide') : language === 'bn' ? 'দেখান' : 'Show'}
          </button>
        </div>
        {state.showDate && (
          <input
            type="text"
            value={state.dateText}
            onChange={(e) => onUpdate({ dateText: e.target.value })}
            className={`w-full border rounded-lg px-3 py-1.5 text-xs font-bengali ${inputBg}`}
          />
        )}
      </div>

      {/* Bottom-Left Caption Callout (Only shown where permitted, e.g. Appreciation Post) */}
      {!hideCaptionControl && (
        <div className={`p-3.5 rounded-xl border space-y-2 ${subBg}`}>
          <div className="flex items-center justify-between">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${textTitle}`}>
              <Type className="w-3.5 h-3.5 text-rose-500" />
              <span>
                {language === 'bn' ? 'নিচে-বামে লেখা' : 'Bottom-Left Callout'}
              </span>
            </label>
            <button
              type="button"
              onClick={() => onUpdate({ showCaption: !state.showCaption })}
              className="text-[11px] text-rose-500 hover:underline font-semibold cursor-pointer"
            >
              {state.showCaption
                ? language === 'bn'
                  ? 'লুকান'
                  : 'Hide'
                : language === 'bn'
                ? 'দেখান'
                : 'Show'}
            </button>
          </div>
          {state.showCaption && (
            <input
              type="text"
              value={state.captionText}
              onChange={(e) => onUpdate({ captionText: e.target.value })}
              placeholder="বিস্তারিত ক্যাপশনে"
              className={`w-full border rounded-lg px-3 py-1.5 text-xs font-bengali ${inputBg}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

interface PhotoUploadPositionProps {
  label: string;
  hint?: string;
  photoUrl: string | null;
  originalPhotoUrl?: string | null;
  zoom: number;
  offsetX: number;
  offsetY: number;
  onUpload: (processedUrl: string, originalUrl?: string) => void;
  onClear?: () => void;
  onChangeZoom: (z: number) => void;
  onChangeOffsetX: (x: number) => void;
  onChangeOffsetY: (y: number) => void;
  isDarkUI: boolean;
  language: Language;
  allowManualBgRemove?: boolean;
}

export const PhotoUploadPosition: React.FC<PhotoUploadPositionProps> = ({
  label,
  hint,
  photoUrl,
  originalPhotoUrl,
  zoom,
  offsetX,
  offsetY,
  onUpload,
  onClear,
  onChangeZoom,
  onChangeOffsetX,
  onChangeOffsetY,
  isDarkUI,
  language,
  allowManualBgRemove = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [removeProgress, setRemoveProgress] = useState<number>(0);
  const [removeStatus, setRemoveStatus] = useState<string>('');
  const { subBg, textMuted, textTitle } = useStudioStyles(isDarkUI);

  // Keep uploaded photo exactly as-is; user may optionally click Remove BG later
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const rawUrl = URL.createObjectURL(file);
    onUpload(rawUrl, rawUrl);
  };

  const handleManualRemoveBg = async () => {
    const targetSrc = originalPhotoUrl || photoUrl;
    if (!targetSrc) return;
    try {
      setIsRemoving(true);
      setRemoveProgress(10);
      setRemoveStatus(
        language === 'bn' ? 'ব্যাকগ্রাউন্ড আলাদা করা হচ্ছে...' : 'Removing background...'
      );
      const cutoutUrl = await removePhotoBackground(targetSrc, (pct, stage) => {
        setRemoveProgress(pct);
        setRemoveStatus(stage);
      });
      onUpload(cutoutUrl, targetSrc);
    } finally {
      setIsRemoving(false);
      setRemoveProgress(0);
    }
  };

  return (
    <div className={`p-3.5 rounded-xl border space-y-3 ${subBg}`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className={`text-xs font-bold block ${textTitle}`}>{label}</span>
          {hint && <span className={`text-[11px] ${textMuted}`}>{hint}</span>}
        </div>
        {photoUrl && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'মুছুন' : 'Clear'}</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleFile}
        accept="image/*"
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isRemoving}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
      >
        {isRemoving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>
              {removeStatus} ({removeProgress}%)
            </span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>
              {photoUrl
                ? language === 'bn'
                  ? 'অন্য ছবি নির্বাচন করুন'
                  : 'Replace Image'
                : language === 'bn'
                ? 'ছবি আপলোড করুন'
                : 'Upload Image'}
            </span>
          </>
        )}
      </button>

      {/* Optional manual background removal ONLY if user clicks it later */}
      {photoUrl && !isRemoving && allowManualBgRemove && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleManualRemoveBg}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-[11px] font-semibold cursor-pointer ${
              isDarkUI
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-rose-500'
                : 'bg-white border-slate-300 text-slate-700 hover:border-rose-500'
            }`}
          >
            <Wand2 className="w-3 h-3 text-rose-500" />
            <span>
              {language === 'bn'
                ? 'ব্যাকগ্রাউন্ড রিমুভ করুন (ঐচ্ছিক)'
                : 'Remove Background (Optional)'}
            </span>
          </button>

          {originalPhotoUrl && originalPhotoUrl !== photoUrl && (
            <button
              type="button"
              onClick={() => onUpload(originalPhotoUrl, originalPhotoUrl)}
              className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                isDarkUI
                  ? 'bg-slate-900 border-slate-700 text-slate-300'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'bn' ? 'আসল ছবি' : 'Original'}</span>
            </button>
          )}
        </div>
      )}

      {photoUrl && (
        <div className="space-y-2.5 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className={`flex items-center gap-1 ${textTitle}`}>
                <ZoomIn className="w-3.5 h-3.5 text-rose-500" />
                {language === 'bn' ? 'সাইজ / জুম' : 'Size / Zoom'}
              </span>
              <span className="font-mono tabular-nums text-slate-400">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="2.2"
              step="0.05"
              value={zoom}
              onChange={(e) => onChangeZoom(Number(e.target.value))}
              className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className={`flex items-center gap-1 ${textMuted}`}>
                  <Move className="w-3 h-3 text-rose-500" />
                  {language === 'bn' ? 'ডানে/বামে (X)' : 'Pan X'}
                </span>
                <span className="font-mono tabular-nums text-slate-400">{offsetX}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={offsetX}
                onChange={(e) => onChangeOffsetX(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className={`flex items-center gap-1 ${textMuted}`}>
                  <Move className="w-3 h-3 text-rose-500" />
                  {language === 'bn' ? 'উপরে/নিচে (Y)' : 'Pan Y'}
                </span>
                <span className="font-mono tabular-nums text-slate-400">{offsetY}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={offsetY}
                onChange={(e) => onChangeOffsetY(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
