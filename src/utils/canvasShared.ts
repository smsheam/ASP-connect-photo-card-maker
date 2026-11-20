import { StudioAspectRatio } from '../types/studio';

export const BENGALI_STACK =
  "'Hind Siliguri', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Segoe UI', -apple-system, sans-serif";
export const DISPLAY_STACK =
  "'Outfit', 'Plus Jakarta Sans', 'Hind Siliguri', sans-serif";
export const CONDENSED_STACK =
  "'Barlow Condensed', 'Outfit', 'Hind Siliguri', sans-serif";
export const SCRIPT_STACK =
  "'Great Vibes', 'Merriweather', cursive, serif";
export const SERIF_STACK =
  "'Merriweather', 'Tiro Bangla', Georgia, serif";

export interface CanvasSize {
  width: number;
  height: number;
}

export function getStudioDimensions(ratio: StudioAspectRatio): CanvasSize {
  switch (ratio) {
    case '1:1':
      return { width: 1080, height: 1080 };
    case '4:5':
      return { width: 1080, height: 1350 };
    case '3:4':
      return { width: 1080, height: 1440 };
    case '4:3':
      return { width: 1200, height: 900 };
    default:
      return { width: 1080, height: 1080 };
  }
}

export function isColorLight(hex: string): boolean {
  if (!hex) return false;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance > 165;
}

const studioImageCache = new Map<string, HTMLImageElement>();

export function loadStudioImage(src: string): Promise<HTMLImageElement> {
  if (studioImageCache.has(src)) {
    const cached = studioImageCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith('http://') || src.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      studioImageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export function drawRoundedBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Shared Subtle Grid Overlay (independent of background color)
 */
export function drawStudioGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isLight: boolean,
  opacity: number = 0.1
) {
  ctx.save();
  const spacing = Math.round(72 * (width / 1080));
  const safeOpacity = Math.max(0.03, Math.min(0.4, opacity));

  ctx.strokeStyle = isLight
    ? `rgba(15, 23, 42, ${safeOpacity})`
    : `rgba(255, 255, 255, ${safeOpacity})`;
  ctx.lineWidth = Math.max(1, Math.round(1.2 * (width / 1080)));

  for (let x = spacing; x < width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = spacing; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Subtle intersection dots every 2nd grid line
  const dotSize = Math.max(2, Math.round(2.5 * (width / 1080)));
  ctx.fillStyle = isLight
    ? `rgba(15, 23, 42, ${safeOpacity * 1.6})`
    : `rgba(255, 255, 255, ${safeOpacity * 1.6})`;
  for (let x = spacing * 2; x < width; x += spacing * 2) {
    for (let y = spacing * 2; y < height; y += spacing * 2) {
      ctx.fillRect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize);
    }
  }
  ctx.restore();
}

/**
 * Shared Large Background Logo Watermark
 */
export async function drawStudioLogoWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  logoUrl: string,
  opacity: number = 0.08,
  scale: number = 1.0,
  centerYRatio: number = 0.5
) {
  if (!logoUrl) return;
  try {
    const logoImg = await loadStudioImage(logoUrl);
    const targetH = Math.round(Math.min(width, height) * 0.62 * (scale || 1.0));
    const aspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
    const targetW = Math.round(targetH * aspect);
    const dx = Math.round((width - targetW) / 2);
    const dy = Math.round(height * centerYRatio - targetH / 2);

    ctx.save();
    ctx.globalAlpha = Math.max(0.02, Math.min(0.4, opacity));
    ctx.drawImage(logoImg, dx, dy, targetW, targetH);
    ctx.restore();
  } catch (e) {
    console.warn('Could not draw logo watermark:', e);
  }
}

/**
 * Shared Top Bar: ASP Logo at top-left, Current Date at top-right
 */
export async function drawStudioTopBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: {
    logoUrl: string;
    logoSize: number;
    showLogo: boolean;
    dateText: string;
    showDate: boolean;
    isLight: boolean;
    dateColor?: string;
    margin?: number;
  }
) {
  const s = width / 1080;
  const margin = opts.margin ?? Math.round(52 * s);
  const topY = Math.round(42 * s);

  if (opts.showLogo && opts.logoUrl) {
    try {
      const logoImg = await loadStudioImage(opts.logoUrl);
      const scaleMult = (opts.logoSize || 400) / 100;
      const targetH = Math.round(52 * s * scaleMult);
      const aspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
      const targetW = Math.round(targetH * aspect);

      ctx.save();
      ctx.shadowColor = opts.isLight ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 12 * s;
      ctx.drawImage(logoImg, margin, topY, targetW, targetH);
      ctx.restore();
    } catch (e) {
      console.warn('Could not load ASP logo:', e);
    }
  }

  if (opts.showDate && opts.dateText) {
    ctx.save();
    const fontSize = Math.round(34 * s);
    ctx.font = `700 ${fontSize}px ${BENGALI_STACK}`;
    ctx.fillStyle = opts.dateColor || (opts.isLight ? '#1E293B' : '#FFFFFF');
    if (!opts.isLight) {
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 8 * s;
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.dateText, width - margin, topY + Math.round(38 * s));
    ctx.restore();
  }
}

/**
 * Shared Bottom-Left Caption indicator: "বিস্তারিত ক্যাপশনে"
 */
export function drawStudioBottomCaption(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: {
    captionText: string;
    showCaption: boolean;
    isLight: boolean;
    textColor?: string;
    margin?: number;
  }
) {
  if (!opts.showCaption || !opts.captionText) return;

  const s = width / 1080;
  const margin = opts.margin ?? Math.round(52 * s);
  const bottomY = height - Math.round(42 * s);

  ctx.save();
  const fontSize = Math.round(23 * s);
  ctx.font = `700 ${fontSize}px ${BENGALI_STACK}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  // Subtle accent bar / dot matching ASP visual language
  const barW = Math.round(6 * s);
  const barH = Math.round(24 * s);
  ctx.fillStyle = opts.isLight ? '#DC2626' : '#FACC15';
  drawRoundedBox(ctx, margin, bottomY - barH / 2, barW, barH, 3 * s);
  ctx.fill();

  ctx.fillStyle = opts.textColor || (opts.isLight ? '#0F172A' : '#F8FAFC');
  if (!opts.isLight) {
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 6 * s;
  }
  ctx.fillText(opts.captionText, margin + barW + Math.round(12 * s), bottomY);
  ctx.restore();
}

/**
 * Generates an offscreen silhouette outline for transparent PNG portraits
 * (matches the signature lime/neon border seen in Birthday_Post_Reference)
 */
export function drawPortraitWithOutline(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  showOutline: boolean,
  outlineColor: string,
  outlineThickness: number = 10
) {
  if (!showOutline) {
    ctx.drawImage(img, dx, dy, dw, dh);
    return;
  }

  // Offscreen buffer to paint silhouette safely without tinting main canvas
  const pad = outlineThickness * 2;
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.round(dw + pad * 2));
  off.height = Math.max(1, Math.round(dh + pad * 2));
  const octx = off.getContext('2d');

  if (!octx) {
    ctx.drawImage(img, dx, dy, dw, dh);
    return;
  }

  // Draw multi-angle offset silhouette for crisp uniform sticker border
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const ox = pad + Math.cos(angle) * outlineThickness;
    const oy = pad + Math.sin(angle) * outlineThickness;
    octx.drawImage(img, ox, oy, dw, dh);
  }

  octx.globalCompositeOperation = 'source-in';
  octx.fillStyle = outlineColor;
  octx.fillRect(0, 0, off.width, off.height);

  // Draw the solid colored outline onto main canvas, then portrait cleanly over top
  ctx.save();
  ctx.drawImage(off, dx - pad, dy - pad);
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

export interface RichWordToken {
  text: string;
  isHighlighted: boolean;
  width: number;
}

export interface RichWrappedLine {
  tokens: RichWordToken[];
  totalWidth: number;
}

export function wrapRichParagraphs(
  ctx: CanvasRenderingContext2D,
  text: string,
  highlightPhrase: string,
  maxWidth: number
): RichWrappedLine[] {
  const paragraphs = text.split('\n');
  const allLines: RichWrappedLine[] = [];
  const normHL = highlightPhrase.trim().toLowerCase();
  const spaceW = ctx.measureText(' ').width;

  for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
    const para = paragraphs[pIdx].trim();
    if (!para) {
      if (allLines.length > 0 && pIdx < paragraphs.length - 1) {
        allLines.push({ tokens: [], totalWidth: 0 });
      }
      continue;
    }

    const rawWords = para.split(/\s+/);
    const tokens: { text: string; isHighlighted: boolean }[] = [];

    if (normHL && para.toLowerCase().includes(normHL)) {
      const lowerPara = para.toLowerCase();
      const startIndex = lowerPara.indexOf(normHL);
      const endIndex = startIndex + normHL.length;
      let cursor = 0;

      for (const w of rawWords) {
        const wStart = lowerPara.indexOf(w.toLowerCase(), cursor);
        const wEnd = wStart + w.length;
        cursor = wEnd;
        const overlaps =
          (wStart >= startIndex && wStart < endIndex) ||
          (wEnd > startIndex && wEnd <= endIndex);
        tokens.push({ text: w, isHighlighted: overlaps });
      }
    } else {
      for (const w of rawWords) {
        tokens.push({ text: w, isHighlighted: false });
      }
    }

    let currentLine: RichWordToken[] = [];
    let currentWidth = 0;

    for (const tok of tokens) {
      const ww = ctx.measureText(tok.text).width;
      const added = currentLine.length === 0 ? ww : spaceW + ww;
      if (currentWidth + added > maxWidth && currentLine.length > 0) {
        allLines.push({ tokens: currentLine, totalWidth: currentWidth });
        currentLine = [{ ...tok, width: ww }];
        currentWidth = ww;
      } else {
        currentLine.push({ ...tok, width: ww });
        currentWidth += added;
      }
    }
    if (currentLine.length > 0) {
      allLines.push({ tokens: currentLine, totalWidth: currentWidth });
    }
  }

  return allLines;
}

export function wrapPlainParagraphs(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const clean = para.trim();
    if (!clean) continue;
    const words = clean.split(/\s+/);
    let current = '';
    for (const w of words) {
      const test = current ? `${current} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}
