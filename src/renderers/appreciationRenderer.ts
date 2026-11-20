import { AppreciationCardState, OFFICIAL_ASP_LOGO_URL } from '../types/studio';
import {
  BENGALI_STACK,
  drawPortraitWithOutline,
  drawRoundedBox,
  drawStudioBottomCaption,
  drawStudioGrid,
  drawStudioLogoWatermark,
  drawStudioTopBar,
  getStudioDimensions,
  isColorLight,
  loadStudioImage,
  wrapPlainParagraphs,
  wrapRichParagraphs,
} from '../utils/canvasShared';

export async function renderAppreciationCard(
  canvas: HTMLCanvasElement,
  state: AppreciationCardState
): Promise<void> {
  const { width, height } = getStudioDimensions(state.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Single layout: White bottom text panel + colored top portrait zone
  await renderReferenceSplitAppreciation(ctx, width, height, state);
}

/**
 * Reference Split Layout (Matches image_d4ea5434.png):
 * - Top ~61% customizable backdrop (color + optional blurred photo + grid + watermark + dual emblems + centered portrait)
 * - Bottom ~39% solid clean customizable panel (default #FFFFFF) with large bold centered headline (default size 30 -> 60px on 1080px), highlighted phrase, optional secondary message, and "বিস্তারিত ক্যাপশনে"
 */
async function renderReferenceSplitAppreciation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: AppreciationCardState
) {
  const s = width / 1080;
  const s540 = width / 540;
  const topBg = state.backgroundColor || '#1E3A8A';
  const bottomBg = state.bottomPanelColor || '#FFFFFF';
  const isTopLight = isColorLight(topBg);
  const isBottomLight = isColorLight(bottomBg);
  const hlColor = state.highlightColor || '#2563EB';
  const splitY = Math.round(height * 0.61);

  // 1. TOP ZONE BACKGROUND
  ctx.fillStyle = topBg;
  ctx.fillRect(0, 0, width, splitY);

  // Optional blurred backdrop photo in top zone
  if (state.topBackgroundImageUrl) {
    try {
      const bgImg = await loadStudioImage(state.topBackgroundImageUrl);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, splitY);
      ctx.clip();

      const overscan = 1.1;
      const imgAspect = bgImg.naturalWidth / (bgImg.naturalHeight || 1);
      const boxAspect = width / splitY;
      let dw = width * overscan;
      let dh = splitY * overscan;
      if (imgAspect > boxAspect) {
        dh = splitY * overscan;
        dw = dh * imgAspect;
      } else {
        dw = width * overscan;
        dh = dw / imgAspect;
      }
      ctx.filter = `blur(${Math.round((state.topBgBlur ?? 6) * s)}px)`;
      ctx.drawImage(bgImg, (width - dw) / 2, (splitY - dh) / 2, dw, dh);

      // Tint overlay with topBg so portrait & emblems remain legible
      ctx.filter = 'none';
      ctx.fillStyle = topBg;
      ctx.globalAlpha = 0.45;
      ctx.fillRect(0, 0, width, splitY);
      ctx.restore();
    } catch (e) {
      console.warn('Appreciation top bg image failed:', e);
    }
  } else {
    // Center vertical spotlight column matching reference graphic depth
    ctx.save();
    const colW = Math.round(width * 0.46);
    const colGrad = ctx.createLinearGradient(0, 0, 0, splitY);
    colGrad.addColorStop(0, isTopLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.09)');
    colGrad.addColorStop(1, isTopLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.16)');
    ctx.fillStyle = colGrad;
    ctx.fillRect((width - colW) / 2, 0, colW, splitY);
    ctx.restore();
  }

  // Optional Grid Overlay clipped to top zone
  if (state.showGrid) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, splitY);
    ctx.clip();
    drawStudioGrid(ctx, width, splitY, isTopLight, state.gridOpacity);
    ctx.restore();
  }

  // Optional Large Background Logo Watermark in top zone
  if (state.showLogoWatermark && state.logoUrl) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, splitY);
    ctx.clip();
    await drawStudioLogoWatermark(
      ctx,
      width,
      splitY,
      state.logoUrl,
      state.logoWatermarkOpacity ?? 0.1,
      state.logoWatermarkScale ?? 1.0,
      0.52
    );
    ctx.restore();
  }

  // Optional Dual Circular Shoulder Emblems behind portrait (faithful to reference image_d4ea5434.png)
  if (state.showDualShoulderEmblems) {
    await drawDualShoulderEmblems(ctx, width, splitY, s, state.logoUrl || OFFICIAL_ASP_LOGO_URL);
  }

  // 2. CENTERED PORTRAIT IN TOP ZONE (rising cleanly from splitY)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, splitY);
  ctx.clip();

  if (state.memberPhotoUrl) {
    try {
      const img = await loadStudioImage(state.memberPhotoUrl);
      const zoom = state.photoZoom || 1.0;
      const panX = ((state.photoOffsetX || 0) / 100) * (width * 0.28);
      const panY = ((state.photoOffsetY || 0) / 100) * (splitY * 0.25);

      if (state.photoStyle === 'transparent-cutout') {
        const targetH = splitY * 0.88 * zoom;
        const imgAspect = img.naturalWidth / (img.naturalHeight || 1);
        const drawW = targetH * imgAspect;
        const drawH = targetH;
        const dx = (width - drawW) / 2 + panX;
        const dy = splitY - drawH + Math.round(8 * s) + panY;

        drawPortraitWithOutline(
          ctx,
          img,
          dx,
          dy,
          drawW,
          drawH,
          state.showPhotoRing,
          hlColor,
          Math.round(8 * s)
        );
      } else {
        const boxW = Math.round(430 * s);
        const boxH = Math.round(splitY * 0.78);
        const boxX = (width - boxW) / 2;
        const boxY = splitY - boxH - Math.round(28 * s);

        if (state.showPhotoRing) {
          ctx.strokeStyle = hlColor;
          ctx.lineWidth = Math.round(5 * s);
          drawRoundedBox(
            ctx,
            boxX - Math.round(4 * s),
            boxY - Math.round(4 * s),
            boxW + Math.round(8 * s),
            boxH + Math.round(8 * s),
            26 * s
          );
          ctx.stroke();
        }

        drawRoundedBox(ctx, boxX, boxY, boxW, boxH, 22 * s);
        ctx.clip();

        const imgAspect = img.naturalWidth / (img.naturalHeight || 1);
        const boxAspect = boxW / boxH;
        let dw = boxW;
        let dh = boxH;
        if (imgAspect > boxAspect) {
          dh = boxH * zoom;
          dw = dh * imgAspect;
        } else {
          dw = boxW * zoom;
          dh = dw / imgAspect;
        }
        ctx.drawImage(img, boxX + (boxW - dw) / 2 + panX, boxY + (boxH - dh) / 2 + panY, dw, dh);
      }
    } catch (e) {
      console.warn('Appreciation portrait load warning:', e);
    }
  } else {
    // Clean visual upload prompt guide
    const boxW = Math.round(420 * s);
    const boxH = Math.round(splitY * 0.72);
    const boxX = (width - boxW) / 2;
    const boxY = splitY - boxH - Math.round(24 * s);
    ctx.fillStyle = isTopLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.08)';
    drawRoundedBox(ctx, boxX, boxY, boxW, boxH, 24 * s);
    ctx.fill();
    ctx.strokeStyle = isTopLight ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.28)';
    ctx.setLineDash([10 * s, 8 * s]);
    ctx.lineWidth = 2.5 * s;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = isTopLight ? '#334155' : '#E2E8F0';
    ctx.font = `600 ${Math.round(24 * s)}px ${BENGALI_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('সদস্যের ছবি আপলোড করুন', width / 2, boxY + boxH / 2);
  }
  ctx.restore();

  // 3. TOP BAR IN TOP ZONE (ASP Logo Top-Left + Bangla Date Top-Right)
  await drawStudioTopBar(ctx, width, height, {
    logoUrl: state.logoUrl,
    logoSize: state.logoSize,
    showLogo: state.showLogo,
    dateText: state.dateText,
    showDate: state.showDate,
    isLight: isTopLight,
  });

  // 4. BOTTOM SOLID PANEL (Clean white or custom color matching reference)
  ctx.fillStyle = bottomBg;
  ctx.fillRect(0, splitY, width, height - splitY);

  // Crisp subtle top border line between photo zone and white panel
  ctx.fillStyle = isBottomLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(0, splitY, width, Math.max(1, Math.round(2 * s)));

  const marginX = Math.round(64 * s);
  const maxContentW = width - marginX * 2;
  const fontFam = state.fontFamily || 'Hind Siliguri';
  const baseTextColor = state.textColor || (isBottomLight ? '#0F172A' : '#FFFFFF');

  // Compute vertical block inside bottom panel cleanly
  const panelTopSafe = splitY + Math.round(34 * s);
  const panelBottomSafe = height - (state.showCaption ? Math.round(84 * s) : Math.round(36 * s));
  const panelAvailH = panelBottomSafe - panelTopSafe;

  // Headline uses 540px scale so default headlineSize=30 renders at bold 60px on 1080px canvas!
  const hSize = Math.round((state.headlineSize || 30) * s540);
  const hLineH = Math.round(hSize * 1.28);

  ctx.save();
  ctx.font = `800 ${hSize}px '${fontFam}', ${BENGALI_STACK}`;
  const headlineLines = state.headline
    ? wrapRichParagraphs(ctx, state.headline, state.highlightPhrase || '', maxContentW)
    : [];

  const kickerH = state.kickerLabel ? Math.round(34 * s) : 0;
  const nameH = state.memberName ? Math.round(42 * s) : 0;
  const desigH = state.memberDesignation ? Math.round(30 * s) : 0;
  const metaGap = kickerH || nameH || desigH ? Math.round(14 * s) : 0;

  let headH = 0;
  for (const line of headlineLines) {
    headH += line.tokens.length === 0 ? Math.round(hLineH * 0.45) : hLineH;
  }

  const subSize = Math.round((state.secondaryMessageSize || 18) * s * 1.35);
  const subLineH = Math.round(subSize * 1.38);
  ctx.font = `500 ${subSize}px '${fontFam}', ${BENGALI_STACK}`;
  const subLines = state.secondaryMessage
    ? wrapPlainParagraphs(ctx, state.secondaryMessage, maxContentW)
    : [];
  const subGap = subLines.length > 0 && headlineLines.length > 0 ? Math.round(18 * s) : 0;
  const subH = subLines.length * subLineH;

  const totalBlockH = kickerH + nameH + desigH + metaGap + headH + subGap + subH;
  let currentY = panelTopSafe + Math.max(0, (panelAvailH - totalBlockH) / 2);

  // Optional Kicker / Name / Designation
  if (state.kickerLabel) {
    ctx.font = `700 ${Math.round(22 * s)}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.fillStyle = hlColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(state.kickerLabel, width / 2, currentY);
    currentY += kickerH;
  }

  if (state.memberName) {
    ctx.font = `800 ${Math.round(30 * s)}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.fillStyle = hlColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(state.memberName, width / 2, currentY);
    currentY += nameH;
  }

  if (state.memberDesignation) {
    ctx.font = `600 ${Math.round(21 * s)}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.fillStyle = isBottomLight ? '#475569' : '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(state.memberDesignation, width / 2, currentY);
    currentY += desigH;
  }

  currentY += metaGap;

  // Prominent Centered Headline with Highlighted Phrase
  if (headlineLines.length > 0) {
    ctx.font = `800 ${hSize}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    const spaceW = ctx.measureText(' ').width;

    for (const line of headlineLines) {
      if (line.tokens.length === 0) {
        currentY += Math.round(hLineH * 0.45);
        continue;
      }
      let cursorX = (width - line.totalWidth) / 2;
      for (const tok of line.tokens) {
        if (tok.isHighlighted && state.highlightStyle === 'pill') {
          const padX = Math.round(12 * s);
          const padY = Math.round(4 * s);
          ctx.fillStyle = hlColor;
          drawRoundedBox(
            ctx,
            cursorX - padX / 2,
            currentY - padY,
            tok.width + padX,
            hSize + padY * 2,
            8 * s
          );
          ctx.fill();
          ctx.fillStyle = isColorLight(hlColor) ? '#0F172A' : '#FFFFFF';
          ctx.fillText(tok.text, cursorX, currentY);
        } else {
          ctx.fillStyle = tok.isHighlighted ? hlColor : baseTextColor;
          ctx.fillText(tok.text, cursorX, currentY);
        }
        cursorX += tok.width + spaceW;
      }
      currentY += hLineH;
    }
  }

  // Secondary Message / Attribution
  if (subLines.length > 0) {
    currentY += subGap;
    ctx.font = `500 ${subSize}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.fillStyle = isBottomLight ? '#475569' : '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const sLine of subLines) {
      if (currentY + subLineH <= panelBottomSafe + Math.round(10 * s)) {
        ctx.fillText(sLine, width / 2, currentY);
        currentY += subLineH;
      }
    }
  }
  ctx.restore();

  // 5. Bottom-Left "বিস্তারিত ক্যাপশনে" (Kept for Appreciation Post per user request)
  drawStudioBottomCaption(ctx, width, height, {
    captionText: state.captionText,
    showCaption: state.showCaption,
    isLight: isBottomLight,
  });
}

async function drawDualShoulderEmblems(
  ctx: CanvasRenderingContext2D,
  width: number,
  splitY: number,
  s: number,
  logoUrl: string
) {
  const cy = splitY * 0.56;
  const r = Math.round(145 * s);
  const leftCx = width * 0.5 - Math.round(165 * s);
  const rightCx = width * 0.5 + Math.round(165 * s);

  ctx.save();
  // Left white seal disc (matches reference left emblem)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
  ctx.shadowBlur = 18 * s;
  ctx.beginPath();
  ctx.arc(leftCx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.arc(leftCx, cy, r - 12 * s, 0, Math.PI * 2);
  ctx.stroke();

  // Right gold-rimmed seal disc (matches reference right emblem)
  ctx.fillStyle = '#0F2A6B';
  ctx.beginPath();
  ctx.arc(rightCx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 10 * s;
  ctx.beginPath();
  ctx.arc(rightCx, cy, r - 6 * s, 0, Math.PI * 2);
  ctx.stroke();

  // Draw subtle ASP emblem inside both circles if available
  try {
    const logo = await loadStudioImage(logoUrl);
    const lSize = r * 1.25;
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.85;
    ctx.drawImage(logo, leftCx - lSize / 2, cy - lSize / 2, lSize, lSize);
    ctx.globalAlpha = 0.28;
    ctx.drawImage(logo, rightCx - lSize / 2, cy - lSize / 2, lSize, lSize);
  } catch {
    // Graceful skip
  }
  ctx.restore();
}

/**
 * Secondary Full-Backdrop Layout Option
 */
async function renderFullBackdropAppreciation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: AppreciationCardState
) {
  const s = width / 1080;
  const s540 = width / 540;
  const bg = state.backgroundColor || '#0F172A';
  const isLight = isColorLight(bg);
  const hlColor = state.highlightColor || (isLight ? '#DC2626' : '#FACC15');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  const glow = ctx.createRadialGradient(
    width * 0.5,
    height * 0.34,
    width * 0.04,
    width * 0.5,
    height * 0.36,
    width * 0.52
  );
  glow.addColorStop(0, isLight ? 'rgba(220,38,38,0.06)' : 'rgba(255,255,255,0.08)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  if (state.showLogoWatermark && state.logoUrl) {
    await drawStudioLogoWatermark(
      ctx,
      width,
      height,
      state.logoUrl,
      state.logoWatermarkOpacity ?? 0.1,
      state.logoWatermarkScale ?? 1.0,
      0.5
    );
  }

  if (state.showGrid) {
    drawStudioGrid(ctx, width, height, isLight, state.gridOpacity);
  }

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

  let currentY = Math.round(146 * s);
  if (state.kickerLabel) {
    ctx.save();
    ctx.font = `700 ${Math.round(24 * s)}px '${state.fontFamily || 'Hind Siliguri'}', ${BENGALI_STACK}`;
    ctx.fillStyle = hlColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(state.kickerLabel, width / 2, currentY);
    ctx.restore();
    currentY += Math.round(42 * s);
  }

  const photoAreaH = Math.round(height * 0.42);
  const photoBoxW = Math.round(460 * s);
  const photoBoxH = photoAreaH;
  const photoBoxX = (width - photoBoxW) / 2;
  const photoBoxY = currentY;

  if (state.memberPhotoUrl) {
    try {
      const img = await loadStudioImage(state.memberPhotoUrl);
      const zoom = state.photoZoom || 1.0;
      const panX = ((state.photoOffsetX || 0) / 100) * (width * 0.28);
      const panY = ((state.photoOffsetY || 0) / 100) * (height * 0.2);

      if (state.photoStyle === 'transparent-cutout') {
        const imgAspect = img.naturalWidth / (img.naturalHeight || 1);
        const drawH = photoBoxH * zoom;
        const drawW = drawH * imgAspect;
        const dx = (width - drawW) / 2 + panX;
        const dy = photoBoxY + (photoBoxH - drawH) / 2 + panY;

        drawPortraitWithOutline(
          ctx,
          img,
          dx,
          dy,
          drawW,
          drawH,
          state.showPhotoRing,
          hlColor,
          Math.round(8 * s)
        );
      } else {
        ctx.save();
        if (state.showPhotoRing) {
          ctx.strokeStyle = hlColor;
          ctx.lineWidth = Math.round(5 * s);
          drawRoundedBox(
            ctx,
            photoBoxX - Math.round(4 * s),
            photoBoxY - Math.round(4 * s),
            photoBoxW + Math.round(8 * s),
            photoBoxH + Math.round(8 * s),
            28 * s
          );
          ctx.stroke();
        }
        drawRoundedBox(ctx, photoBoxX, photoBoxY, photoBoxW, photoBoxH, 24 * s);
        ctx.clip();

        const imgAspect = img.naturalWidth / (img.naturalHeight || 1);
        const boxAspect = photoBoxW / photoBoxH;
        let drawW = photoBoxW;
        let drawH = photoBoxH;
        if (imgAspect > boxAspect) {
          drawH = photoBoxH * zoom;
          drawW = drawH * imgAspect;
        } else {
          drawW = photoBoxW * zoom;
          drawH = drawW / imgAspect;
        }
        ctx.drawImage(
          img,
          photoBoxX + (photoBoxW - drawW) / 2 + panX,
          photoBoxY + (photoBoxH - drawH) / 2 + panY,
          drawW,
          drawH
        );
        ctx.restore();
      }
    } catch (e) {
      console.warn('Appreciation photo warning:', e);
    }
  }

  currentY = photoBoxY + photoBoxH + Math.round(24 * s);

  if (state.memberName) {
    ctx.save();
    ctx.font = `800 ${Math.round(32 * s)}px '${state.fontFamily || 'Hind Siliguri'}', ${BENGALI_STACK}`;
    ctx.fillStyle = hlColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(state.memberName, width / 2, currentY);
    ctx.restore();
    currentY += Math.round(42 * s);
  }

  if (state.memberDesignation) {
    ctx.save();
    ctx.font = `600 ${Math.round(22 * s)}px '${state.fontFamily || 'Hind Siliguri'}', ${BENGALI_STACK}`;
    ctx.fillStyle = isLight ? '#475569' : '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(state.memberDesignation, width / 2, currentY);
    ctx.restore();
    currentY += Math.round(38 * s);
  }

  const contentMarginX = Math.round(72 * s);
  const maxContentW = width - contentMarginX * 2;
  const fontFam = state.fontFamily || 'Hind Siliguri';
  const baseTextColor = isLight ? '#0F172A' : '#FFFFFF';

  if (state.headline) {
    ctx.save();
    const hSize = Math.round((state.headlineSize || 30) * s540);
    ctx.font = `800 ${hSize}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.textBaseline = 'top';
    const lines = wrapRichParagraphs(ctx, state.headline, state.highlightPhrase || '', maxContentW);
    const spaceW = ctx.measureText(' ').width;
    const lineH = Math.round(hSize * 1.32);

    for (const line of lines) {
      if (line.tokens.length === 0) {
        currentY += Math.round(lineH * 0.45);
        continue;
      }
      let cursorX = (width - line.totalWidth) / 2;
      for (const tok of line.tokens) {
        ctx.fillStyle = tok.isHighlighted ? hlColor : baseTextColor;
        ctx.fillText(tok.text, cursorX, currentY);
        cursorX += tok.width + spaceW;
      }
      currentY += lineH;
    }
    ctx.restore();
  }

  const bottomSafe = height - Math.round(92 * s);
  if (state.secondaryMessage && currentY + Math.round(24 * s) < bottomSafe) {
    currentY += Math.round(14 * s);
    ctx.save();
    const subSize = Math.round((state.secondaryMessageSize || 18) * s * 1.35);
    ctx.font = `500 ${subSize}px '${fontFam}', ${BENGALI_STACK}`;
    ctx.fillStyle = isLight ? '#475569' : '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const subLines = wrapPlainParagraphs(ctx, state.secondaryMessage, maxContentW);
    const subLineH = Math.round(subSize * 1.4);
    for (const sLine of subLines) {
      if (currentY + subLineH <= bottomSafe) {
        ctx.fillText(sLine, width / 2, currentY);
        currentY += subLineH;
      }
    }
    ctx.restore();
  }
}
