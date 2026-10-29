import { CardState, AspectRatio } from '../types/card';
import { drawCanvasLogo } from '../components/LogoVector';

export interface Dimension {
  width: number;
  height: number;
}

export function getDimensionsForRatio(ratio: AspectRatio): Dimension {
  switch (ratio) {
    case '3:4':
      return { width: 1080, height: 1440 }; // 3:4 portrait (Primary Default)
    case '4:3':
      return { width: 1200, height: 900 };
    case '1:1':
      return { width: 1080, height: 1080 };
    case '16:9':
      return { width: 1280, height: 720 };
    default:
      return { width: 1080, height: 1440 };
  }
}

// Fallback robust Bengali font stack for 100% offline support
const BENGALI_FONT_STACK = "'Hind Siliguri', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Siyam Rupali', 'Vrinda', 'Bangla Sangam MN', 'Segoe UI', -apple-system, sans-serif";
const LATIN_FONT_STACK = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const imageCache: Map<string, HTMLImageElement> = new Map();

export function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
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
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

interface WordToken {
  text: string;
  isHighlighted: boolean;
  width: number;
}

interface WrappedLine {
  tokens: WordToken[];
  totalWidth: number;
}

function wrapTextWithHighlight(
  ctx: CanvasRenderingContext2D,
  text: string,
  highlightPhrase: string,
  maxWidth: number
): WrappedLine[] {
  const cleanText = text.trim();
  if (!cleanText) return [];

  const rawWords = cleanText.split(/\s+/);
  const normalizedHighlight = highlightPhrase.trim().toLowerCase();

  const tokens: { text: string; isHighlighted: boolean }[] = [];
  
  if (normalizedHighlight && cleanText.toLowerCase().includes(normalizedHighlight)) {
    const lowerText = cleanText.toLowerCase();
    const startIndex = lowerText.indexOf(normalizedHighlight);
    const endIndex = startIndex + normalizedHighlight.length;

    let charCursor = 0;
    for (const w of rawWords) {
      const wordStart = lowerText.indexOf(w.toLowerCase(), charCursor);
      const wordEnd = wordStart + w.length;
      charCursor = wordEnd;

      const overlaps = (wordStart >= startIndex && wordStart < endIndex) || 
                       (wordEnd > startIndex && wordEnd <= endIndex);
      
      tokens.push({
        text: w,
        isHighlighted: overlaps,
      });
    }
  } else {
    for (const w of rawWords) {
      tokens.push({ text: w, isHighlighted: false });
    }
  }

  const spaceWidth = ctx.measureText(' ').width;
  const lines: WrappedLine[] = [];
  let currentTokens: WordToken[] = [];
  let currentLineWidth = 0;

  for (const token of tokens) {
    const wordWidth = ctx.measureText(token.text).width;
    const tokenWidthWithSpace = currentTokens.length === 0 ? wordWidth : spaceWidth + wordWidth;

    if (currentLineWidth + tokenWidthWithSpace > maxWidth && currentTokens.length > 0) {
      lines.push({ tokens: currentTokens, totalWidth: currentLineWidth });
      currentTokens = [{ ...token, width: wordWidth }];
      currentLineWidth = wordWidth;
    } else {
      currentTokens.push({ ...token, width: wordWidth });
      currentLineWidth += tokenWidthWithSpace;
    }
  }

  if (currentTokens.length > 0) {
    lines.push({ tokens: currentTokens, totalWidth: currentLineWidth });
  }

  return lines;
}

/**
 * Main render function that draws the 3:4 photo card with adjustable content space (default 40%)
 */
export async function renderCardToCanvas(
  canvas: HTMLCanvasElement,
  state: CardState
): Promise<void> {
  const { width, height } = getDimensionsForRatio(state.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Draw solid background
  ctx.fillStyle = state.themeBackground || '#0B132B';
  ctx.fillRect(0, 0, width, height);

  // Content height allocation: default 40% (0.40) or adjustable
  const contentRatio = state.contentHeightRatio ?? 0.40;
  const contentHeight = Math.round(height * contentRatio);
  const photoHeight = height - contentHeight;

  // 2. Draw user photo (occupies the top 60% or 1 - contentRatio)
  if (state.photoUrl) {
    try {
      const img = await loadImage(state.photoUrl);
      ctx.save();
      
      // Clip to photo region
      ctx.beginPath();
      ctx.rect(0, 0, width, photoHeight);
      ctx.clip();

      ctx.filter = `brightness(${state.imageBrightness}%) contrast(${state.imageContrast}%)`;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const targetAspect = width / photoHeight;
      let drawW = width;
      let drawH = photoHeight;

      if (imgAspect > targetAspect) {
        drawH = photoHeight * state.imageZoom;
        drawW = drawH * imgAspect;
      } else {
        drawW = width * state.imageZoom;
        drawH = drawW / imgAspect;
      }

      const panOffsetX = (state.imagePanX / 100) * (drawW - width);
      const panOffsetY = (state.imagePanY / 100) * (drawH - photoHeight);

      const drawX = (width - drawW) / 2 + panOffsetX;
      const drawY = (photoHeight - drawH) / 2 + panOffsetY;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // Seamless bottom gradient scrim at boundary
      ctx.save();
      const scrimHeight = Math.min(220, photoHeight * 0.4);
      const scrimY = photoHeight - scrimHeight;
      const grad = ctx.createLinearGradient(0, scrimY, 0, photoHeight);
      grad.addColorStop(0, 'rgba(11, 19, 43, 0)');
      grad.addColorStop(0.7, 'rgba(11, 19, 43, 0.8)');
      grad.addColorStop(1, state.themeBackground || '#0B132B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scrimY, width, scrimHeight + 2);
      ctx.restore();

      if (state.scrimDarkness > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${state.scrimDarkness / 100})`;
        ctx.fillRect(0, 0, width, photoHeight);
      }
    } catch (e) {
      console.warn('Could not load card photo:', e);
      const fallbackGrad = ctx.createLinearGradient(0, 0, 0, photoHeight);
      fallbackGrad.addColorStop(0, '#1E293B');
      fallbackGrad.addColorStop(1, '#0F172A');
      ctx.fillStyle = fallbackGrad;
      ctx.fillRect(0, 0, width, photoHeight);
      ctx.fillStyle = '#94A3B8';
      ctx.font = `600 24px ${BENGALI_FONT_STACK}`;
      ctx.textAlign = 'center';
      ctx.fillText('ছবি যুক্ত করুন (Upload Photo)', width / 2, photoHeight / 2);
    }
  }

  // 3. Top dark scrim for Logo & Date Stamp contrast
  ctx.save();
  const topGrad = ctx.createLinearGradient(0, 0, 0, 160);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
  topGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.35)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 160);
  ctx.restore();

  // 4. Logo in Top-Left Corner
  const logoScale = (state.logoSize / 100) * (width / 1080);
  const logoMarginX = 54;
  const logoMarginY = 72;

  if (state.logoSource === 'uploaded-asset' || state.logoSource === 'custom-upload') {
    const logoSrc = state.logoSource === 'uploaded-asset' 
      ? '/assets/aistudio/image_15d93372.png' 
      : state.customLogoUrl;

    if (logoSrc) {
      try {
        const logoImg = await loadImage(logoSrc);
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 10;
        
        const lAspect = logoImg.naturalWidth / logoImg.naturalHeight;
        const targetH = 50 * logoScale;
        const targetW = targetH * lAspect;

        ctx.drawImage(logoImg, logoMarginX, logoMarginY - 38, targetW, targetH);
        ctx.restore();
      } catch {
        drawCanvasLogo(ctx, logoMarginX, logoMarginY, logoScale, state.logoVariant);
      }
    } else {
      drawCanvasLogo(ctx, logoMarginX, logoMarginY, logoScale, state.logoVariant);
    }
  } else {
    drawCanvasLogo(ctx, logoMarginX, logoMarginY, logoScale, state.logoVariant);
  }

  // 5. Powered by Association Students' Progress (ASP)
  if (state.showPoweredBy) {
    ctx.save();
    const poweredFontSize = Math.round(13 * (width / 1080));
    ctx.font = `600 ${poweredFontSize}px ${LATIN_FONT_STACK}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 6;
    ctx.fillText("Powered by Association Students' Progress (ASP)", logoMarginX, logoMarginY + 26);
    ctx.restore();
  }

  // 6. Date Stamp in Top-Right Corner
  if (state.showDate && state.dateText) {
    ctx.save();
    const dateFontSize = Math.round(18 * (width / 1080));
    ctx.font = `700 ${dateFontSize}px ${BENGALI_FONT_STACK}`;
    
    const textMetrics = ctx.measureText(state.dateText);
    const paddingX = 18;
    const paddingY = 9;
    const pillWidth = textMetrics.width + paddingX * 2;
    const pillHeight = dateFontSize + paddingY * 2;
    const pillX = width - logoMarginX - pillWidth;
    const pillY = logoMarginY - 38;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.2;
    
    drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.dateText, pillX + paddingX, pillY + pillHeight / 2);
    ctx.restore();
  }

  // 7. CONTENT AREA: The 40% (or adjustable) space for headline, description, category, footer
  const contentPaddingX = 54;
  const availableContentWidth = width - contentPaddingX * 2;
  
  let currentY = photoHeight + 32;

  // Category Tag (বুড়িচং, ব্রাহ্মণপাড়া, etc.)
  if (state.showCategory && state.category) {
    ctx.save();
    const categoryFontSize = Math.round(18 * (width / 1080));
    ctx.font = `800 ${categoryFontSize}px ${BENGALI_FONT_STACK}`;
    
    const catText = state.category.toUpperCase();
    const catMetrics = ctx.measureText(catText);
    const catPaddingX = 14;
    const catPaddingY = 6;
    const catW = catMetrics.width + catPaddingX * 2;
    const catH = categoryFontSize + catPaddingY * 2;

    const catColor = state.categoryColor || '#DC2626';

    ctx.fillStyle = catColor;
    drawRoundedRect(ctx, contentPaddingX, currentY, catW, catH, 4);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(catText, contentPaddingX + catPaddingX, currentY + catH / 2);

    // Accent line next to badge
    ctx.fillStyle = catColor;
    ctx.fillRect(contentPaddingX, currentY + catH + 8, catW + 24, 2);

    ctx.restore();
    currentY += catH + 26;
  }

  // Headline in 40% content zone (ample space for 3-4 lines if needed)
  if (state.headline) {
    ctx.save();
    const headlineSize = Math.round((state.headlineFontSize || 44) * (width / 1080));
    const fontFam = state.fontFamily || 'Hind Siliguri';
    ctx.font = `800 ${headlineSize}px '${fontFam}', ${BENGALI_FONT_STACK}`;
    ctx.textBaseline = 'top';

    const spaceWidth = ctx.measureText(' ').width;
    const lineHeight = headlineSize * 1.34;

    const lines = wrapTextWithHighlight(
      ctx,
      state.headline,
      state.highlightPhrase || '',
      availableContentWidth
    );

    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    const maxLines = state.showDescription && state.description ? 3 : 5;
    const linesToDraw = lines.slice(0, maxLines);

    for (const line of linesToDraw) {
      let cursorX = contentPaddingX;

      if (state.textAlignment === 'center') {
        cursorX = (width - line.totalWidth) / 2;
      }

      for (let i = 0; i < line.tokens.length; i++) {
        const token = line.tokens[i];
        
        ctx.fillStyle = token.isHighlighted 
          ? (state.highlightColor || '#FACC15') 
          : '#FFFFFF';

        ctx.fillText(token.text, cursorX, currentY);
        cursorX += token.width + spaceWidth;
      }

      currentY += lineHeight;
    }
    ctx.restore();
  }

  // Short Description in 40% content zone
  if (state.showDescription && state.description) {
    currentY += 16;
    ctx.save();
    const descFontSize = Math.round(23 * (width / 1080));
    ctx.font = `400 ${descFontSize}px ${BENGALI_FONT_STACK}`;
    ctx.fillStyle = '#CBD5E1';
    ctx.textBaseline = 'top';

    const descLineHeight = descFontSize * 1.45;
    const descWords = state.description.split(/\s+/);
    let descLine = '';
    let descLinesCount = 0;

    for (const word of descWords) {
      const testLine = descLine ? `${descLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > availableContentWidth && descLine) {
        ctx.fillText(descLine, contentPaddingX, currentY);
        descLine = word;
        currentY += descLineHeight;
        descLinesCount++;
        if (descLinesCount >= 3) break;
      } else {
        descLine = testLine;
      }
    }
    if (descLine && descLinesCount < 3) {
      ctx.fillText(descLine, contentPaddingX, currentY);
    }
    ctx.restore();
  }

  // 8. Footer Bar
  if (state.showFooter) {
    ctx.save();
    const footerY = height - 54;

    // Hairline divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(contentPaddingX, footerY - 18);
    ctx.lineTo(width - contentPaddingX, footerY - 18);
    ctx.stroke();

    const footerFontSize = Math.round(18 * (width / 1080));
    ctx.textBaseline = 'middle';

    // Left: "✓ বিস্তারিত ক্যাপশনে"
    const callout = state.footerCallout || 'বিস্তারিত ক্যাপশনে';
    const iconSize = 22;
    const iconX = contentPaddingX;
    const iconY = footerY - iconSize / 2;
    
    ctx.fillStyle = '#EF4444';
    drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, 4);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(iconX + 5, iconY + 11);
    ctx.lineTo(iconX + 9, iconY + 16);
    ctx.lineTo(iconX + 17, iconY + 6);
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = `700 ${footerFontSize}px ${BENGALI_FONT_STACK}`;
    ctx.textAlign = 'left';
    ctx.fillText(callout, iconX + iconSize + 12, footerY);

    // Right: "To learn More about ASP, Visit ASP2016.ORG"
    const siteUrl = state.footerUrl || 'To learn More about ASP, Visit ASP2016.ORG';
    ctx.font = `700 ${footerFontSize}px ${LATIN_FONT_STACK}`;
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'right';
    ctx.fillText(siteUrl, width - contentPaddingX, footerY);

    ctx.restore();
  }
}
