import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Share2,
  X,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { CardState } from '../types/card';
import { renderCardToCanvas, getDimensionsForRatio } from '../utils/canvasRenderer';

interface PreviewPanelProps {
  cardState: CardState;
  isExporting: boolean;
  setIsExporting: (val: boolean) => void;
  isDarkUI: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  cardState,
  isExporting,
  setIsExporting,
  isDarkUI,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [mobileModalUrl, setMobileModalUrl] = useState<string | null>(null);

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

  // Mobile-Optimized Download & Native Share
  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      await renderCardToCanvas(canvas, cardState);

      const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const extension = exportFormat === 'jpeg' ? 'jpg' : 'png';
      const cleanTitle = (cardState.headline || 'asp-connect')
        .slice(0, 30)
        .replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_');
      const filename = `asp-connect-${cleanTitle}-${Date.now()}.${extension}`;

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsExporting(false);
          return;
        }

        const dataUrl = canvas.toDataURL(mimeType, 0.95);

        // 1. If mobile device supports Web Share API with files, try native share/save to photos
        const file = new File([blob], filename, { type: mimeType });
        const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'ASP কানেক্ট ফটো কার্ড',
              text: cardState.headline,
            });
            setIsExporting(false);
            return;
          } catch (shareErr) {
            // User may have cancelled or share sheet closed, proceed to fallback
            console.log('Share dismissed or failed, using download fallback:', shareErr);
          }
        }

        // 2. Direct browser download trigger
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
        } catch (downloadErr) {
          console.warn('Standard download link failed:', downloadErr);
        }

        // 3. Always show mobile friendly save modal for phone users
        if (isMobile) {
          setMobileModalUrl(dataUrl);
        }

        setIsExporting(false);
      }, mimeType, 0.95);

    } catch (err) {
      console.error('Download error:', err);
      setIsExporting(false);
    }
  };

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
          console.warn('Clipboard write failed, opening image modal:', err);
          // Fallback on mobile: open modal for easy save
          setMobileModalUrl(canvas.toDataURL('image/png'));
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const barBg = isDarkUI ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs';
  const stageBg = isDarkUI ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100/80 border-slate-200';
  const btnSecondary = isDarkUI 
    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800' 
    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs';

  return (
    <div className="flex flex-col h-full space-y-3.5">
      
      {/* Top minimal bar */}
      <div className={`flex items-center justify-between text-xs rounded-xl px-4 py-2.5 border ${barBg}`}>
        <div className="flex items-center gap-2">
          <span className="font-bold">লাইভ ফটো কার্ড</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {width} × {height} ({cardState.aspectRatio})
          </span>
        </div>

        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as any)}
          className={`border rounded-md px-2 py-1 text-[11px] font-medium focus:outline-none ${
            isDarkUI ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
          }`}
        >
          <option value="png">PNG (এইচডি)</option>
          <option value="jpeg">JPEG</option>
        </select>
      </div>

      {/* Preview Stage */}
      <div className={`flex-1 min-h-[380px] lg:min-h-[500px] flex items-center justify-center rounded-2xl p-3 lg:p-6 overflow-hidden border ${stageBg}`}>
        <div
          className="relative transition-all duration-300 flex items-center justify-center max-w-full max-h-full"
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
              maxHeight: 'min(65vh, 520px)',
              maxWidth: '100%',
              width: 'auto',
              height: 'auto',
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${btnSecondary}`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">কপি সম্পন্ন!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>ক্লিপবোর্ডে কপি</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] rounded-xl text-xs font-bold text-white shadow-sm transition-all disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'তৈরি হচ্ছে...' : 'কার্ড ডাউনলোড করুন'}</span>
        </button>
      </div>

      {/* Mobile Tip */}
      <div className="text-[11px] text-center text-slate-400 bg-slate-900/60 border border-slate-800/80 rounded-lg py-2 px-3 flex items-center justify-center gap-1.5">
        <Smartphone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        <span>মোবাইলে ডাউনলোড না হলে "কার্ড ডাউনলোড করুন" চাপলে সরাসরি ফটো সেভ করার উইন্ডো আসবে</span>
      </div>

      {/* Mobile Save Modal (Guaranteed 100% working on all phones) */}
      {mobileModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full max-h-[92vh] flex flex-col p-4 shadow-2xl space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  মোবাইলে সেভ করুন (Save to Phone)
                </h3>
              </div>
              <button
                onClick={() => setMobileModalUrl(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl text-left text-xs text-rose-200">
              <p className="font-bold flex items-center gap-1">
                👉 ছবিটিতে ১-২ সেকেন্ড চেপে ধরে রাখুন (Long Press):
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                তারপর <strong>"Save Image"</strong> বা <strong>"Download Image"</strong> নির্বাচন করলে সরাসরি আপনার ফোনের গ্যালারি/ফটোসে সেভ হয়ে যাবে।
              </p>
            </div>

            {/* High-res Image Tag for Long-Press Save */}
            <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
              <img
                src={mobileModalUrl}
                alt="ASP Connect Photo Card"
                className="max-h-[50vh] w-auto object-contain rounded-lg shadow-lg cursor-pointer select-auto"
              />
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={mobileModalUrl}
                download={`asp-connect-${Date.now()}.${exportFormat === 'jpeg' ? 'jpg' : 'png'}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold text-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>পুনরায় ডাউনলোড</span>
              </a>

              <button
                onClick={() => setMobileModalUrl(null)}
                className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold text-center"
              >
                সম্পন্ন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
