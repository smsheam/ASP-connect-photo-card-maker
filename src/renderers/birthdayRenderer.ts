import { BirthdayCardState } from '../types/studio';
import {
  BENGALI_STACK,
  CONDENSED_STACK,
  DISPLAY_STACK,
  SCRIPT_STACK,
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
} from '../utils/canvasShared';

export async function renderBirthdayCard(
  canvas: HTMLCanvasElement,
  state: BirthdayCardState
): Promise<void> {
  const { width, height } = getStudioDimensions(state.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const s = width / 1080;
  const bg = state.backgroundColor || '#0B3B24';
  const isLight = isColorLight(bg);
  const accent = state.accentColor || '#BADC58';

  // 1. Solid / Rich studio atmospheric background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle top-left & center studio glow matching Birthday_Post_Reference
  ctx.save();
  const rad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.36,
    width * 0.05,
    width * 0.5,
    height * 0.45,
    width * 0.75
  );
  if (isLight) {
    rad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  } else {
    rad.addColorStop(0, 'rgba(255, 255, 255, 0.10)');
    rad.addColorStop(0.55, 'rgba(255, 255, 255, 0.02)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0.42)');
  }
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // 2. Subtle repeating "ASP" background pattern (as seen in reference)
  if (state.showWatermarkPattern) {
    ctx.save();
    ctx.font = `900 ${Math.round(250 * s)}px ${DISPLAY_STACK}`;
    ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.045)' : 'rgba(255, 255, 255, 0.045)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ASP  ASP', width * 0.5, height * 0.2);
    ctx.fillText('ASP  ASP', width * 0.5, height * 0.42);
    ctx.restore();
  }

  // 2b. Optional Large Background Logo Watermark
  if (state.showLogoWatermark && state.logoUrl) {
    await drawStudioLogoWatermark(
      ctx,
      width,
      height,
      state.logoUrl,
      state.logoWatermarkOpacity ?? 0.08,
      state.logoWatermarkScale ?? 1.0,
      0.46
    );
  }

  // 3. Optional Subtle Grid Overlay
  if (state.showGrid) {
    drawStudioGrid(ctx, width, height, isLight, state.gridOpacity);
  }

  // 4. Member Portrait (Hero Subject centered in frame)
  const bottomFadeH = Math.round(height * 0.36);
  if (state.memberPhotoUrl) {
    try {
      const img = await loadStudioImage(state.memberPhotoUrl);
      const baseH = height * 0.78 * (state.photoZoom || 1);
      const imgAspect = img.naturalWidth / (img.naturalHeight || 1);
      const drawH = baseH;
      const drawW = drawH * imgAspect;

      const offsetX = ((state.photoOffsetX || 0) / 100) * (width * 0.4);
      const offsetY = ((state.photoOffsetY || 0) / 100) * (height * 0.3);

      const drawX = (width - drawW) / 2 + offsetX;
      const drawY = height * 0.12 + offsetY;

      drawPortraitWithOutline(
        ctx,
        img,
        drawX,
        drawY,
        drawW,
        drawH,
        state.showOutlineGlow,
        state.outlineColor || accent,
        Math.round(10 * s)
      );
    } catch (err) {
      console.warn('Birthday portrait load warning:', err);
    }
  } else {
    // Clean studio placeholder silhouette guide
    ctx.save();
    const boxW = Math.round(440 * s);
    const boxH = Math.round(520 * s);
    const boxX = (width - boxW) / 2;
    const boxY = Math.round(height * 0.16);
    ctx.strokeStyle = isLight ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.25)';
    ctx.setLineDash([12 * s, 10 * s]);
    ctx.lineWidth = 3 * s;
    drawRoundedBox(ctx, boxX, boxY, boxW, boxH, 32 * s);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = isLight ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.55)';
    ctx.font = `600 ${Math.round(24 * s)}px ${BENGALI_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('সদস্যের ছবি আপলোড করুন (PNG Portrait)', width / 2, boxY + boxH / 2);
    ctx.restore();
  }

  // 5. Lower Dark/Contrast Gradient Wash for Text Legibility
  ctx.save();
  const bottomGrad = ctx.createLinearGradient(0, height - bottomFadeH - Math.round(120 * s), 0, height);
  if (isLight) {
    bottomGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    bottomGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.78)');
    bottomGrad.addColorStop(1, bg);
  } else {
    bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    bottomGrad.addColorStop(0.48, 'rgba(3, 18, 10, 0.72)');
    bottomGrad.addColorStop(1, bg);
  }
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, height - bottomFadeH - Math.round(120 * s), width, bottomFadeH + Math.round(120 * s));
  ctx.restore();

  // 6. Side Wish Callout with Crosshair Accent (supports wrapped Bangla & English lines)
  if (state.showSideWish && state.sideWishText) {
    ctx.save();
    const wishX = width - Math.round(248 * s);
    const wishY = height * 0.54;
    const wishMaxW = Math.round(212 * s);

    // Signature thin L/crosshair rule
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5 * s;
    ctx.beginPath();
    ctx.moveTo(wishX - Math.round(28 * s), wishY - Math.round(8 * s));
    ctx.lineTo(width - Math.round(32 * s), wishY - Math.round(8 * s));
    ctx.moveTo(wishX - Math.round(14 * s), wishY - Math.round(28 * s));
    ctx.lineTo(wishX - Math.round(14 * s), wishY + Math.round(118 * s));
    ctx.stroke();

    ctx.font = `600 ${Math.round(23 * s)}px ${BENGALI_STACK}`;
    const wrappedWishLines = wrapPlainParagraphs(ctx, state.sideWishText, wishMaxW);
    ctx.fillStyle = isLight ? '#0F172A' : '#F8FAFC';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let cy = wishY + Math.round(8 * s);
    for (const line of wrappedWishLines) {
      ctx.fillText(line.trim(), wishX, cy);
      cy += Math.round(30 * s);
    }
    ctx.restore();
  }

  // 7. Happy Birthday Graphic (Uploaded Transparent PNG OR High-Craft Built-in Typography)
  const rawAnchorY = height * 0.74 + ((state.graphicOffsetY ?? 43) / 100) * (height * 0.2);
  const graphicAnchorY = Math.min(rawAnchorY, height - Math.round(210 * s));

  if (state.happyBirthdayGraphicUrl) {
    try {
      const hbImg = await loadStudioImage(state.happyBirthdayGraphicUrl);
      const scaleMult = state.graphicScale || 1.1;
      const targetW = Math.min(width * 0.78, Math.round(700 * s * scaleMult));
      const aspect = hbImg.naturalWidth / (hbImg.naturalHeight || 1);
      const targetH = targetW / aspect;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 18 * s;
      ctx.drawImage(hbImg, (width - targetW) / 2, graphicAnchorY - targetH * 0.65, targetW, targetH);
      ctx.restore();
    } catch {
      drawBuiltInBirthdayScript(ctx, width, graphicAnchorY, s, state, isLight, accent);
    }
  } else {
    drawBuiltInBirthdayScript(ctx, width, graphicAnchorY, s, state, isLight, accent);
  }

  // 8. Member Name (60px Fixed) & Designation
  const nameY = graphicAnchorY + Math.round(84 * s);
  const resolvedNameSize = state.nameFontSize || 60;
  if (state.memberName) {
    ctx.save();
    const nSize = Math.round(resolvedNameSize * s);
    ctx.font = `800 ${nSize}px ${CONDENSED_STACK}, ${BENGALI_STACK}`;
    ctx.fillStyle = accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if (!isLight) {
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 12 * s;
    }
    ctx.fillText(state.memberName.toUpperCase(), width / 2, nameY);
    ctx.restore();
  }

  if (state.memberDesignation) {
    ctx.save();
    const dSize = Math.round(26 * s);
    ctx.font = `600 ${dSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
    ctx.fillStyle = isLight ? '#1E293B' : '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if (!isLight) {
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 10 * s;
    }
    ctx.fillText(
      state.memberDesignation,
      width / 2,
      nameY + Math.round(resolvedNameSize * s + 8 * s)
    );
    ctx.restore();
  }

  // 9. Shared Common Elements: Top Bar (Logo 400% Top-Left + Date Top-Right)
  await drawStudioTopBar(ctx, width, height, {
    logoUrl: state.logoUrl,
    logoSize: state.logoSize || 400,
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
}

function drawBuiltInBirthdayScript(
  ctx: CanvasRenderingContext2D,
  width: number,
  anchorY: number,
  s: number,
  state: BirthdayCardState,
  isLight: boolean,
  accent: string
) {
  ctx.save();
  // "HAPPY" condensed uppercase in lime accent
  if (state.topWishPrefix) {
    ctx.font = `700 ${Math.round(48 * s)}px ${CONDENSED_STACK}`;
    ctx.fillStyle = accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 10 * s;
    ctx.fillText(state.topWishPrefix.toUpperCase(), width / 2 - Math.round(26 * s), anchorY - Math.round(78 * s));
  }

  // "Birthday" huge brush/calligraphy script
  if (state.mainScriptTitle) {
    const scaleMult = state.graphicScale || 1.0;
    ctx.font = `400 ${Math.round(176 * s * scaleMult)}px ${SCRIPT_STACK}`;
    ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.68)';
    ctx.shadowBlur = 18 * s;
    ctx.shadowOffsetY = 5 * s;
    ctx.fillText(state.mainScriptTitle, width / 2, anchorY - Math.round(10 * s));
  }
  ctx.restore();
}
