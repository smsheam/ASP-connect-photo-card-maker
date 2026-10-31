import { CardState, AspectRatio } from '../types/card';
import { drawCanvasLogo } from '../components/LogoVector';

export interface Dimension {
  width: number;
  height: number;
}

export function getDimensionsForRatio(ratio: AspectRatio): Dimension {
  switch (ratio) {
    case '1:1':
      return { width: 1080, height: 1080 }; // 1:1 Square (Primary Default)
    case '3:4':
      return { width: 1080, height: 1440 }; // 3:4 portrait
    case '4:3':
      return { width: 1200, height: 900 };
    case '16:9':
      return { width: 1280, height: 720 };
    default:
      return { width: 1080, height: 1080 };
  }
}

export function isLightBackground(hex: string): boolean {
  if (!hex) return false;
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180;
  }
  return false;
}

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
 * Main render function with updated exact font sizes:
 * - Headline default 24 size (12 words)
 * - Description fixed 15 size (70 words)
 * - Date white text, no background, size 14
 * - Category size 14
 * - Visit asp2016.org size 12
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

  const scale = width / 540;

  const isLight = isLightBackground(state.themeBackground);
  const bgColor = state.themeBackground || (isLight ? '#FFFFFF' : '#0B132B');

  // 1. Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Content height allocation: default 44% to give generous breathing room for 70 words
  const contentRatio = state.contentHeightRatio ?? 0.44;
  const contentHeight = Math.round(height * contentRatio);
  const photoHeight = height - contentHeight;

  // 2. Draw user photo
  if (state.photoUrl) {
    try {
      const img = await loadImage(state.photoUrl);
      ctx.save();
      
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

      // Seamless bottom gradient scrim at boundary matching the card background
      ctx.save();
      const scrimHeight = Math.min(180, photoHeight * 0.35);
      const scrimY = photoHeight - scrimHeight;
      const grad = ctx.createLinearGradient(0, scrimY, 0, photoHeight);
      
      if (isLight) {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.85)');
        grad.addColorStop(1, bgColor);
      } else {
        grad.addColorStop(0, 'rgba(11, 19, 43, 0)');
        grad.addColorStop(0.7, 'rgba(11, 19, 43, 0.85)');
        grad.addColorStop(1, bgColor);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, scrimY, width, scrimHeight + 2);
      ctx.restore();

      if (state.scrimDarkness > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${state.scrimDarkness / 100})`;
        ctx.fillRect(0, 0, width, photoHeight);
      }
    } catch (e) {
      console.warn('Could not load card photo:', e);
      ctx.fillStyle = isLight ? '#F1F5F9' : '#1E293B';
      ctx.fillRect(0, 0, width, photoHeight);
      ctx.fillStyle = isLight ? '#64748B' : '#94A3B8';
      ctx.font = `600 24px ${BENGALI_FONT_STACK}`;
      ctx.textAlign = 'center';
      ctx.fillText('ছবি নির্বাচন করুন (Upload Photo)', width / 2, photoHeight / 2);
    }
  }

  // 3. Top dark scrim for Logo & Date contrast
  ctx.save();
  const topGrad = ctx.createLinearGradient(0, 0, 0, 140);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
  topGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 140);
  ctx.restore();

  // 4. Logo in Top-Left Corner
  const logoScale = (state.logoSize / 100) * (width / 1080);
  const logoMarginX = 46;
  const logoMarginY = 64;

  const effectiveLogoVariant = state.logoVariant || 'white-red';

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
        const targetH = 44 * logoScale;
        const targetW = targetH * lAspect;

        ctx.drawImage(logoImg, logoMarginX, logoMarginY - 32, targetW, targetH);
        ctx.restore();
      } catch {
        drawCanvasLogo(ctx, logoMarginX, logoMarginY, logoScale, effectiveLogoVariant);
      }
    } else {
      drawCanvasLogo(ctx, logoMarginX, logoMarginY, logoScale, effectiveLogoVariant);
    }
  } else {
    drawCanvasLogo(ctx, logoMarginX, logoMarginY, logoScale, effectiveLogoVariant);
  }

  // 5. Date Stamp in Top-Right Corner (Requirement 3: date is in white text, no background, size 14)
  if (state.showDate && state.dateText) {
    ctx.save();
    const dateFontSize = Math.round(14 * scale); // Exact Size 14
    ctx.font = `700 ${dateFontSize}px ${BENGALI_FONT_STACK}`;
    ctx.fillStyle = '#FFFFFF'; // Pure White
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 1;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.dateText, width - logoMarginX, logoMarginY - Math.round(10 * scale));
    ctx.restore();
  }

  // 6. CONTENT AREA
  const contentPaddingX = 46;
  const availableContentWidth = width - contentPaddingX * 2;
  
  let currentY = photoHeight + Math.round(18 * scale);

  // Requirement 4: Category size 14
  if (state.showCategory && state.category) {
    ctx.save();
    const categoryFontSize = Math.round(14 * scale); // Exact Size 14
    ctx.font = `800 ${categoryFontSize}px ${BENGALI_FONT_STACK}`;
    
    const catText = state.category.toUpperCase();
    const catMetrics = ctx.measureText(catText);
    const catPaddingX = Math.round(12 * scale);
    const catPaddingY = Math.round(5 * scale);
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

    // Subtle accent line
    ctx.fillStyle = catColor;
    ctx.fillRect(contentPaddingX, currentY + catH + Math.round(6 * scale), catW + Math.round(16 * scale), Math.round(2.5 * scale));

    ctx.restore();
    currentY += catH + Math.round(16 * scale);
  }

  // Requirement 1: Headline in 12 words (default 24 size, can be changed 14-26)
  if (state.headline) {
    ctx.save();
    const headlineFontSize = state.headlineFontSize || 24; // Default 24 size
    const headlineSize = Math.round(headlineFontSize * scale);
    const fontFam = state.fontFamily || 'Hind Siliguri';
    ctx.font = `800 ${headlineSize}px '${fontFam}', ${BENGALI_FONT_STACK}`;
    ctx.textBaseline = 'top';

    const spaceWidth = ctx.measureText(' ').width;
    const lineHeight = Math.round(headlineSize * 1.30);

    const lines = wrapTextWithHighlight(
      ctx,
      state.headline,
      state.highlightPhrase || '',
      availableContentWidth
    );

    const baseHeadlineColor = isLight ? '#0F172A' : '#FFFFFF';
    
    let defaultHighlight = isLight ? '#DC2626' : '#FACC15';
    let chosenHighlight = state.highlightColor || defaultHighlight;
    if (isLight && chosenHighlight.toUpperCase() === '#FACC15') {
      chosenHighlight = '#DC2626';
    }

    if (!isLight) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
    }

    for (const line of lines) {
      let cursorX = contentPaddingX;

      if (state.textAlignment === 'center') {
        cursorX = (width - line.totalWidth) / 2;
      }

      for (let i = 0; i < line.tokens.length; i++) {
        const token = line.tokens[i];
        ctx.fillStyle = token.isHighlighted ? chosenHighlight : baseHeadlineColor;
        ctx.fillText(token.text, cursorX, currentY);
        cursorX += token.width + spaceWidth;
      }

      currentY += lineHeight;
    }
    ctx.restore();
  }

  // Requirement 2: Description in 70 words (fixed 15 size)
  if (state.showDescription && state.description) {
    currentY += Math.round(8 * scale);
    ctx.save();
    const descFontSize = Math.round(15 * scale); // Fixed 15 size
    ctx.font = `400 ${descFontSize}px ${BENGALI_FONT_STACK}`;
    ctx.fillStyle = isLight ? '#334155' : '#CBD5E1';
    ctx.textBaseline = 'top';

    const descLineHeight = Math.round(descFontSize * 1.38);
    const descWords = state.description.split(/\s+/);
    let descLine = '';

    // Calculate maximum available Y before footer
    const footerY = height - Math.round(38 * (height / 1080));
    const maxDescY = footerY - Math.round(20 * scale);

    for (const word of descWords) {
      const testLine = descLine ? `${descLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > availableContentWidth && descLine) {
        if (currentY + descLineHeight <= maxDescY) {
          ctx.fillText(descLine, contentPaddingX, currentY);
          currentY += descLineHeight;
          descLine = word;
        } else {
          ctx.fillText(descLine + '...', contentPaddingX, currentY);
          descLine = '';
          break;
        }
      } else {
        descLine = testLine;
      }
    }
    if (descLine && currentY <= maxDescY) {
      ctx.fillText(descLine, contentPaddingX, currentY);
    }
    ctx.restore();
  }

  // Requirement 5: Visit asp2016.org size 12
  if (state.showFooter) {
    ctx.save();
    const footerY = height - Math.round(38 * (height / 1080));

    // Hairline divider
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(contentPaddingX, footerY - 12);
    ctx.lineTo(width - contentPaddingX, footerY - 12);
    ctx.stroke();

    const footerFontSize = Math.round(12 * scale); // Exact Size 12!
    ctx.textBaseline = 'middle';

    const callout = state.footerCallout || 'VISIT ASP2016.ORG';
    const iconSize = Math.round(16 * (width / 1080));
    const iconX = contentPaddingX;
    const iconY = footerY - iconSize / 2;
    
    ctx.fillStyle = '#EF4444';
    drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, 3);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(iconX + 3.5, iconY + 8);
    ctx.lineTo(iconX + 6.5, iconY + 11.5);
    ctx.lineTo(iconX + 12.5, iconY + 4.5);
    ctx.stroke();

    ctx.fillStyle = isLight ? '#0F172A' : '#F8FAFC';
    ctx.font = `800 ${footerFontSize}px ${LATIN_FONT_STACK}`;
    ctx.textAlign = 'left';
    ctx.fillText(callout, iconX + iconSize + 9, footerY);

    ctx.restore();
  }
}
