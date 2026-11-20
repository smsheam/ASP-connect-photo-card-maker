import { AnnouncementCardState } from '../types/studio';
import {
  BENGALI_STACK,
  drawRoundedBox,
  drawStudioBottomCaption,
  drawStudioGrid,
  drawStudioLogoWatermark,
  drawStudioTopBar,
  getStudioDimensions,
  isColorLight,
  loadStudioImage,
  wrapPlainParagraphs,
} from '../utils/canvasShared';

export async function renderAnnouncementCard(
  canvas: HTMLCanvasElement,
  state: AnnouncementCardState
): Promise<void> {
  const { width, height } = getStudioDimensions(state.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const s = width / 1080;
  const bg = state.backgroundColor || '#0B132B';
  const isImageMode = state.backgroundMode === 'blurred-image';
  const isLight = isImageMode ? false : isColorLight(bg);

  // 1. Background Layer
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  if (state.backgroundMode === 'blurred-image') {
    if (state.backgroundImageUrl) {
      try {
        const bgImg = await loadStudioImage(state.backgroundImageUrl);
        const imgAspect = bgImg.naturalWidth / (bgImg.naturalHeight || 1);
        const targetAspect = width / height;

        // Overscan by 12% so Gaussian blur edges don't bleed borders
        const overscan = 1.12;
        let drawW = width * overscan;
        let drawH = height * overscan;
        if (imgAspect > targetAspect) {
          drawH = height * overscan;
          drawW = drawH * imgAspect;
        } else {
          drawW = width * overscan;
          drawH = drawW / imgAspect;
        }

        const dx = (width - drawW) / 2;
        const dy = (height - drawH) / 2;

        ctx.save();
        ctx.filter = `blur(${Math.round((state.blurIntensity ?? 18) * s)}px)`;
        ctx.drawImage(bgImg, dx, dy, drawW, drawH);
        ctx.restore();
      } catch (e) {
        console.warn('Announcement background image failed:', e);
      }
    } else {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1E293B');
      grad.addColorStop(1, '#0F172A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Contrast Scrim Overlay for crisp 4.5:1+ legibility
    ctx.save();
    ctx.fillStyle = `rgba(5, 10, 24, ${state.scrimOpacity ?? 0.58})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    if (state.showGrid) {
      drawStudioGrid(ctx, width, height, false, state.gridOpacity);
    }
  } else if (state.backgroundMode === 'solid-grid' || state.showGrid) {
    if (state.backgroundMode !== 'solid-clean') {
      drawStudioGrid(ctx, width, height, isLight, state.gridOpacity);
    }
  }

  // 1b. Large Background Logo Watermark
  if (state.showLogoWatermark && state.logoUrl) {
    await drawStudioLogoWatermark(
      ctx,
      width,
      height,
      state.logoUrl,
      state.logoWatermarkOpacity ?? 0.08,
      state.logoWatermarkScale ?? 1.0,
      0.52
    );
  }

  // 2. Top Header & Optional Bottom-Left Caption
  await drawStudioTopBar(ctx, width, height, {
    logoUrl: state.logoUrl,
    logoSize: state.logoSize,
    showLogo: state.showLogo,
    dateText: state.dateText,
    showDate: state.showDate,
    isLight,
  });

  drawStudioBottomCaption(ctx, width, height, {
    captionText: state.captionText,
    showCaption: state.showCaption,
    isLight,
  });

  // 3. Announcement Content Layout (ALL text sizes & positions adjustable)
  const marginX = Math.round(92 * s);
  const maxContentW = width - marginX * 2;
  const topSafe = Math.round(170 * s);
  const bottomSafe = height - Math.round(96 * s);
  const availH = bottomSafe - topSafe;

  const fontFam = state.fontFamily || 'Hind Siliguri';
  const mainTextColor = isImageMode ? '#FFFFFF' : state.textColor || (isLight ? '#0F172A' : '#FFFFFF');
  const accentColor = state.accentColor || (isLight ? '#DC2626' : '#FACC15');

  const totalChars =
    (state.announcementTitle?.length || 0) + (state.announcementBody?.length || 0);

  let badgeFontBase = state.badgeFontSize || 22;
  let titleFontBase = state.titleFontSize || 44;
  let bodyFontBase = state.bodyFontSize || 26;
  let subFontBase = state.subNoteFontSize || 22;

  if (state.autoFitText) {
    if (totalChars <= 70) {
      titleFontBase = 56;
      bodyFontBase = 30;
    } else if (totalChars <= 140) {
      titleFontBase = 48;
      bodyFontBase = 28;
    } else if (totalChars <= 240) {
      titleFontBase = 40;
      bodyFontBase = 25;
    } else {
      titleFontBase = 34;
      bodyFontBase = 22;
    }
  }

  const badgeFontSize = Math.round(badgeFontBase * s);
  const titleSize = Math.round(titleFontBase * s);
  const bodySize = Math.round(bodyFontBase * s);
  const subSize = Math.round(subFontBase * s);

  const titleLineH = Math.round(titleSize * 1.32);
  const bodyLineH = Math.round(bodySize * 1.48);
  const subLineH = Math.round(subSize * 1.42);

  // Measure lines
  ctx.save();
  ctx.font = `800 ${titleSize}px '${fontFam}', ${BENGALI_STACK}`;
  const titleLines = state.announcementTitle
    ? wrapPlainParagraphs(ctx, state.announcementTitle, maxContentW)
    : [];

  ctx.font = `500 ${bodySize}px '${fontFam}', ${BENGALI_STACK}`;
  const bodyLines = state.announcementBody
    ? wrapPlainParagraphs(ctx, state.announcementBody, maxContentW)
    : [];

  ctx.font = `600 ${subSize}px '${fontFam}', ${BENGALI_STACK}`;
  const footerLines = state.footerSubNote
    ? wrapPlainParagraphs(ctx, state.footerSubNote, maxContentW)
    : [];

  const badgeH = state.showBadge && state.badgeLabel ? Math.round(badgeFontSize * 2.1) : 0;
  const badgeGap = badgeH > 0 ? Math.round(28 * s) : 0;
  const titleH = titleLines.length * titleLineH;
  const titleBodyGap = titleLines.length > 0 && bodyLines.length > 0 ? Math.round(28 * s) : 0;
  const bodyH = bodyLines.length * bodyLineH;
  const footerGap = footerLines.length > 0 ? Math.round(30 * s) : 0;
  const footerH = footerLines.length * subLineH;

  const totalBlockH = badgeH + badgeGap + titleH + titleBodyGap + bodyH + footerGap + footerH;

  // Vertical position anchor + manual Y offset
  let cursorY = topSafe + Math.max(0, (availH - totalBlockH) / 2);
  if (state.textVerticalPosition === 'top') {
    cursorY = topSafe + Math.round(18 * s);
  } else if (state.textVerticalPosition === 'bottom') {
    cursorY = Math.max(topSafe, bottomSafe - totalBlockH - Math.round(18 * s));
  }
  cursorY += Math.round((state.textOffsetY || 0) * s);

  // Horizontal anchor X + manual X offset
  const offsetX = Math.round((state.textOffsetX || 0) * s);
  let anchorX = width / 2 + offsetX;
  if (state.textAlignment === 'left') anchorX = marginX + offsetX;
  if (state.textAlignment === 'right') anchorX = width - marginX + offsetX;

  // A. Announcement Badge Banner
  if (state.showBadge && state.badgeLabel) {
    ctx.font = `800 ${badgeFontSize}px '${fontFam}', ${BENGALI_STACK}`;
    const bText = state.badgeLabel.toUpperCase();
    const bWidth = ctx.measureText(bText).width + Math.round(badgeFontSize * 2.0);
    const bHeight = badgeH;

    let bx = (width - bWidth) / 2 + offsetX;
    if (state.textAlignment === 'left') bx = marginX + offsetX;
    if (state.textAlignment === 'right') bx = width - marginX - bWidth + offsetX;

    ctx.fillStyle = accentColor;
    drawRoundedBox(ctx, bx, cursorY, bWidth, bHeight, 8 * s);
    ctx.fill();

    ctx.fillStyle = isColorLight(accentColor) ? '#0F172A' : '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bText, bx + bWidth / 2, cursorY + bHeight / 2);

    cursorY += bHeight + badgeGap;
  }

  // B. Main Announcement Title
  if (titleLines.length > 0) {
    ctx.font = `800 ${titleSize}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.fillStyle = mainTextColor;
    ctx.textAlign = state.textAlignment;
    ctx.textBaseline = 'top';
    if (!isLight || isImageMode) {
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 10 * s;
    }
    for (const line of titleLines) {
      ctx.fillText(line, anchorX, cursorY);
      cursorY += titleLineH;
    }
    ctx.shadowColor = 'transparent';
    cursorY += titleBodyGap;
  }

  // C. Accent Divider Rule
  if (titleLines.length > 0 && bodyLines.length > 0) {
    const ruleW = Math.round(96 * s);
    let rx = (width - ruleW) / 2 + offsetX;
    if (state.textAlignment === 'left') rx = marginX + offsetX;
    if (state.textAlignment === 'right') rx = width - marginX - ruleW + offsetX;
    ctx.fillStyle = accentColor;
    drawRoundedBox(
      ctx,
      rx,
      cursorY - Math.round(titleBodyGap / 2),
      ruleW,
      Math.round(4 * s),
      2 * s
    );
    ctx.fill();
  }

  // D. Announcement Body
  if (bodyLines.length > 0) {
    ctx.font = `500 ${bodySize}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.fillStyle = isImageMode ? '#F1F5F9' : isLight ? '#334155' : '#E2E8F0';
    ctx.textAlign = state.textAlignment;
    ctx.textBaseline = 'top';
    for (const line of bodyLines) {
      if (cursorY + bodyLineH <= height - Math.round(36 * s)) {
        ctx.fillText(line, anchorX, cursorY);
        cursorY += bodyLineH;
      }
    }
    cursorY += footerGap;
  }

  // E. Secondary Footer Sub-note
  if (footerLines.length > 0) {
    ctx.font = `600 ${subSize}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.fillStyle = accentColor;
    ctx.textAlign = state.textAlignment;
    ctx.textBaseline = 'top';
    for (const line of footerLines) {
      if (cursorY + subLineH <= height - Math.round(24 * s)) {
        ctx.fillText(line, anchorX, cursorY);
        cursorY += subLineH;
      }
    }
  }

  ctx.restore();
}
