import React, { useEffect, useRef, useState } from 'react';
import { Download, Copy, Check, X, Smartphone } from 'lucide-react';
import { StudioAspectRatio } from '../../types/studio';
import { getStudioDimensions } from '../../utils/canvasShared';
import { Language, TRANSLATIONS } from '../../utils/translations';

interface StudioPreviewExportProps<T> {
  state: T;
  aspectRatio: StudioAspectRatio;
  renderFn: (canvas: HTMLCanvasElement, state: T) => Promise<void>;
  filenamePrefix: string;
  titleText: string;
  isDarkUI: boolean;
  language: Language;
}

export function StudioPreviewExport<T>({
  state,
  aspectRatio,
  renderFn,
  filenamePrefix,
  titleText,
  isDarkUI,
  language,
}: StudioPreviewExportProps<T>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [mobileModalUrl, setMobileModalUrl] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderFn(canvas, state).catch((err) => {
      if (!cancelled) console.error('Studio canvas render error:', err);
    });

    return () => {
      cancelled = true;
    };
  }, [state, renderFn]);

  const { width, height } = getStudioDimensions(aspectRatio);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      await renderFn(canvas, state);

      const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const extension = exportFormat === 'jpeg' ? 'jpg' : 'png';
      const filename = `${filenamePrefix}-${Date.now()}.${extension}`;

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setIsExporting(false);
            return;
          }

          const dataUrl = canvas.toDataURL(mimeType, 1.0);
          const file = new File([blob], filename, { type: mimeType });
          const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
            navigator.userAgent
          );

          if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: titleText,
              });
              setIsExporting(false);
              return;
            } catch {
              // fallback to direct download & modal
            }
          }

          try {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = blobUrl;
            link.rel = 'noopener';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
          } catch (err) {
            console.warn('Direct download failed:', err);
          }

          if (isMobile) {
            setMobileModalUrl(dataUrl);
          }
          setIsExporting(false);
        },
        mimeType,
        1.0
      );
    } catch (err) {
      console.error('Studio download error:', err);
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      await renderFn(canvas, state);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          setMobileModalUrl(canvas.toDataURL('image/png', 1.0));
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy error:', err);
    }
  };

  const barBg = isDarkUI
    ? 'bg-slate-900 border-slate-800 text-slate-300'
    : 'bg-white border-slate-200 text-slate-700 shadow-xs';
  const stageBg = isDarkUI
    ? 'bg-slate-950/70 border-slate-800'
    : 'bg-slate-100/80 border-slate-200';
  const btnSecondary = isDarkUI
    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs';

  return (
    <div className="flex flex-col h-full space-y-3.5">
      {/* Top Preview Metadata & Format Selector */}
      <div
        className={`flex items-center justify-between text-xs rounded-xl px-4 py-2.5 border ${barBg}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold truncate">{titleText}</span>
          <span className="text-slate-400 font-mono tabular-nums text-[11px] hidden sm:inline shrink-0">
            {width} × {height} · {aspectRatio}
          </span>
        </div>

        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'png' | 'jpeg')}
          aria-label="Export Format"
          className={`border rounded-md px-2 py-1 text-[11px] font-medium focus:outline-none ${
            isDarkUI
              ? 'bg-slate-950 border-slate-800 text-slate-300'
              : 'bg-white border-slate-300 text-slate-700'
          }`}
        >
          <option value="png">PNG (HD)</option>
          <option value="jpeg">JPEG</option>
        </select>
      </div>

      {/* Live Canvas Stage */}
      <div
        className={`flex-1 min-h-[380px] lg:min-h-[520px] flex items-center justify-center rounded-2xl p-3 lg:p-6 overflow-hidden border ${stageBg}`}
      >
        <div
          className="relative transition-all duration-200 flex items-center justify-center max-w-full max-h-full"
          style={{
            filter: isDarkUI
              ? 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.7))'
              : 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.12))',
          }}
        >
          <canvas
            ref={canvasRef}
            className="rounded-xl object-contain border border-black/10 dark:border-white/10"
            style={{
              maxHeight: 'min(66vh, 540px)',
              maxWidth: '100%',
              width: 'auto',
              height: 'auto',
            }}
          />
        </div>
      </div>

      {/* Copy & Direct PNG Download Actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer whitespace-nowrap ${btnSecondary}`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">
                {t.copiedSuccess}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>{t.copyClipboard}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? t.creating : t.downloadButton}</span>
        </button>
      </div>

      {/* Mobile Direct Save Modal */}
      {mobileModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Smartphone className="w-4 h-4 text-rose-500" />
                <span>{t.saveToPhone}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileModalUrl(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex flex-col items-center space-y-3 bg-slate-950">
              <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-center leading-relaxed">
                {t.longPressTip}
              </p>
              <img
                src={mobileModalUrl}
                alt="ASP Studio Card Preview"
                className="w-full rounded-xl border border-slate-700 shadow-lg"
              />
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <a
                href={mobileModalUrl}
                download={`${filenamePrefix}.png`}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl text-center"
              >
                {t.downloadAgain}
              </a>
              <button
                type="button"
                onClick={() => setMobileModalUrl(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                {t.done}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
