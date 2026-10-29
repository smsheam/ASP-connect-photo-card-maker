import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Maximize2,
  Share2,
  FileImage,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { CardState } from '../types/card';
import { renderCardToCanvas, getDimensionsForRatio } from '../utils/canvasRenderer';

interface PreviewPanelProps {
  cardState: CardState;
  isExporting: boolean;
  setIsExporting: (val: boolean) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  cardState,
  isExporting,
  setIsExporting,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [zoomFit, setZoomFit] = useState(true);

  // Render to canvas whenever cardState changes
  useEffect(() => {
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderCardToCanvas(canvas, cardState).catch((err) => {
      if (!isCancelled) console.error('Canvas render error:', err);
    });

    return () => {
      isCancelled = true;
    };
  }, [cardState]);

  const { width, height } = getDimensionsForRatio(cardState.aspectRatio);

  // Download action
  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      // Ensure canvas is cleanly rendered
      await renderCardToCanvas(canvas, cardState);

      const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png';
      const extension = exportFormat === 'jpeg' ? 'jpg' : exportFormat;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsExporting(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const cleanTitle = (cardState.headline || 'asp-connect')
            .slice(0, 30)
            .replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_');
          link.download = `asp-connect-${cleanTitle}-${Date.now()}.${extension}`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsExporting(false);
        },
        mimeType,
        0.95
      );
    } catch (err) {
      console.error('Download error:', err);
      setIsExporting(false);
    }
  };

  // Copy to clipboard action for quick Facebook pasting
  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      await renderCardToCanvas(canvas, cardState);
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
        } catch (err) {
          console.warn('Clipboard write failed, fallback:', err);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top toolbar */}
      <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">লাইভ প্রিভিউ</span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-slate-400">
            {width} × {height} px ({cardState.aspectRatio})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
          >
            <option value="png">PNG (সর্বোচ্চ স্পষ্টতা)</option>
            <option value="jpeg">JPEG (কম সাইজ)</option>
            <option value="webp">WebP (আধুনিক)</option>
          </select>
        </div>
      </div>

      {/* Canvas container with sleek photo frame and shadow */}
      <div className="flex-1 min-h-[460px] lg:min-h-[600px] flex items-center justify-center bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 lg:p-6 overflow-hidden relative">
        <div
          className="relative transition-all duration-300 flex items-center justify-center max-w-full max-h-full"
          style={{
            filter: 'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.7))',
          }}
        >
          <canvas
            ref={canvasRef}
            className="rounded-lg object-contain border border-white/10"
            style={{
              maxHeight: 'min(72vh, 640px)',
              maxWidth: '100%',
              width: 'auto',
              height: 'auto',
            }}
          />
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">কপি সম্পন্ন! FB-তে পেস্ট করুন</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>ক্লিপবোর্ডে কপি করুন</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] rounded-xl text-xs font-bold text-white shadow-md shadow-rose-950 transition-all disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'তৈরি হচ্ছে...' : 'কার্ড ডাউনলোড (HD)'}</span>
        </button>
      </div>

      {/* Helper tips */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>💡 ফেসবুক পেজ ও গ্রুপে পোস্টের জন্য 4:5 পোর্ট্রেট সবচেয়ে বেশি ভিউ পায়</span>
        <span className="hidden sm:inline">স্বয়ংক্রিয়ভাবে ASP কানেক্ট ব্র্যান্ডিং যুক্ত</span>
      </div>
    </div>
  );
};
