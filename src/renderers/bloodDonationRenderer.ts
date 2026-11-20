import { BloodDonationCardState } from '../types/studio';
import {
  BENGALI_STACK,
  DISPLAY_STACK,
  SCRIPT_STACK,
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

function drawBloodDropIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  fill: string,
  withHeartPulse: boolean = true
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.6);
  ctx.bezierCurveTo(
    cx + size * 0.52,
    cy - size * 0.05,
    cx + size * 0.52,
    cy + size * 0.45,
    cx,
    cy + size * 0.55
  );
  ctx.bezierCurveTo(
    cx - size * 0.52,
    cy + size * 0.45,
    cx - size * 0.52,
    cy - size * 0.05,
    cx,
    cy - size * 0.6
  );
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  if (withHeartPulse) {
    // Inner white heart silhouette
    const hs = size * 0.28;
    const hy = cy + size * 0.1;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(cx, hy + hs * 0.55);
    ctx.bezierCurveTo(cx - hs * 1.1, hy - hs * 0.1, cx - hs * 0.7, hy - hs * 0.9, cx, hy - hs * 0.35);
    ctx.bezierCurveTo(cx + hs * 0.7, hy - hs * 0.9, cx + hs * 1.1, hy - hs * 0.1, cx, hy + hs * 0.55);
    ctx.fill();

    // Inner red ECG heartbeat zig-zag
    ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(1.5, size * 0.045);
    ctx.beginPath();
    ctx.moveTo(cx - hs * 0.7, hy);
    ctx.lineTo(cx - hs * 0.25, hy);
    ctx.lineTo(cx - hs * 0.1, hy - hs * 0.32);
    ctx.lineTo(cx + hs * 0.1, hy + hs * 0.28);
    ctx.lineTo(cx + hs * 0.25, hy - hs * 0.12);
    ctx.lineTo(cx + hs * 0.7, hy);
    ctx.stroke();
  }

  ctx.restore();
}

export async function renderBloodDonationCard(
  canvas: HTMLCanvasElement,
  state: BloodDonationCardState
): Promise<void> {
  const { width, height } = getStudioDimensions(state.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const s = width / 1080;
  const bg = state.backgroundColor || '#FFF5F6';
  const isLight = isColorLight(bg);
  const primary = state.primaryColor || '#DC2626';
  const accent = state.accentColor || '#8B0000';

  // 1. Soft Background + Radial Gradient matching Blood_Donation_Post_Reference
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  const rad = ctx.createRadialGradient(
    width * 0.42,
    height * 0.46,
    width * 0.08,
    width * 0.5,
    height * 0.5,
    width * 0.75
  );
  if (isLight) {
    rad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    rad.addColorStop(0.65, 'rgba(254, 226, 226, 0.35)');
    rad.addColorStop(1, 'rgba(252, 165, 165, 0.32)');
  } else {
    rad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0.42)');
  }
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Optional Subtle Grid Overlay
  if (state.showGrid) {
    drawStudioGrid(ctx, width, height, isLight, state.gridOpacity);
  }

  // Optional Large Background Logo Watermark
  if (state.showLogoWatermark && state.logoUrl) {
    await drawStudioLogoWatermark(
      ctx,
      width,
      height,
      state.logoUrl,
      state.logoWatermarkOpacity ?? 0.08,
      state.logoWatermarkScale ?? 1.0,
      0.5
    );
  }

  // 2. Signature Crimson Organic Sweeping Waves (Top-Left & Bottom)
  ctx.save();
  // Top-left red corner wave
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width * 0.24, 0);
  ctx.bezierCurveTo(width * 0.14, height * 0.07, width * 0.07, height * 0.13, 0, height * 0.24);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = primary;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width * 0.32, 0);
  ctx.bezierCurveTo(width * 0.18, height * 0.09, width * 0.11, height * 0.18, 0, height * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Faint Decorative Heart + ECG in Top-Right + Droplets (matching reference)
  ctx.save();
  ctx.globalAlpha = isLight ? 0.24 : 0.16;
  const hcx = width - Math.round(98 * s);
  const hcy = Math.round(115 * s);
  const hSize = Math.round(74 * s);
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.moveTo(hcx, hcy + hSize * 0.55);
  ctx.bezierCurveTo(hcx - hSize * 1.15, hcy - hSize * 0.1, hcx - hSize * 0.7, hcy - hSize * 0.9, hcx, hcy - hSize * 0.35);
  ctx.bezierCurveTo(hcx + hSize * 0.7, hcy - hSize * 0.9, hcx + hSize * 1.15, hcy - hSize * 0.1, hcx, hcy + hSize * 0.55);
  ctx.fill();

  // Soft droplets on right & left edges
  drawBloodDropIcon(ctx, width - Math.round(40 * s), Math.round(240 * s), 34 * s, primary, false);
  drawBloodDropIcon(ctx, width - Math.round(64 * s), Math.round(290 * s), 22 * s, primary, false);
  drawBloodDropIcon(ctx, Math.round(42 * s), Math.round(480 * s), 48 * s, primary, false);
  ctx.restore();

  ctx.restore();

  // 3. Branch Rendering by Template Mode
  if (state.templateMode === 'thank-you') {
    await renderBloodThankYouLayout(ctx, width, height, s, state, isLight, primary, accent);
  } else {
    await renderBloodRequestLayout(ctx, width, height, s, state, isLight, primary, accent);
  }

  // 4. Bottom Crimson Wave Ribbon (anchored smoothly at bottom)
  ctx.save();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height - Math.round(52 * s));
  ctx.bezierCurveTo(
    width * 0.35,
    height - Math.round(12 * s),
    width * 0.7,
    height - Math.round(130 * s),
    width,
    height - Math.round(95 * s)
  );
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = primary;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(width * 0.32, height);
  ctx.bezierCurveTo(
    width * 0.6,
    height - Math.round(35 * s),
    width * 0.82,
    height - Math.round(80 * s),
    width,
    height - Math.round(50 * s)
  );
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 5. Shared Common Features: ASP Logo Top-Left, Date Top-Right, "বিস্তারিত ক্যাপশনে" Bottom-Left
  await drawStudioTopBar(ctx, width, height, {
    logoUrl: state.logoUrl,
    logoSize: state.logoSize,
    showLogo: state.showLogo,
    dateText: state.dateText,
    showDate: state.showDate,
    isLight,
    dateColor: isLight ? accent : '#FFFFFF',
    margin: Math.round(44 * s),
  });

  drawStudioBottomCaption(ctx, width, height, {
    captionText: state.captionText,
    showCaption: state.showCaption,
    isLight: false, // Over bottom dark crimson wave it always pops best in white
    textColor: '#FFFFFF',
    margin: Math.round(44 * s),
  });
}

async function renderBloodThankYouLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  s: number,
  state: BloodDonationCardState,
  isLight: boolean,
  primary: string,
  accent: string
) {
  const leftMargin = Math.round(54 * s);
  const leftColW = Math.round(width * 0.49);
  const inkPrimary = isLight ? '#1E293B' : '#F8FAFC';
  const inkMuted = isLight ? '#334155' : '#CBD5E1';

  // A. Right Column: Donor Photo
  if (state.donorPhotoUrl) {
    try {
      const img = await loadStudioImage(state.donorPhotoUrl);
      const zoom = state.photoZoom || 1.0;
      const targetH = height * 0.86 * zoom;
      const aspect = img.naturalWidth / (img.naturalHeight || 1);
      const drawW = targetH * aspect;
      const drawH = targetH;

      const panX = ((state.photoOffsetX || 0) / 100) * (width * 0.25);
      const panY = ((state.photoOffsetY || 0) / 100) * (height * 0.2);

      const dx = width * 0.51 + (width * 0.48 - drawW) / 2 + panX;
      const dy = height - drawH + Math.round(10 * s) + panY;

      ctx.save();
      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.warn('Donor portrait load error:', e);
    }
  } else {
    // Guide container on right
    ctx.save();
    const px = Math.round(width * 0.56);
    const py = Math.round(height * 0.22);
    const pw = Math.round(width * 0.38);
    const ph = Math.round(height * 0.62);
    ctx.fillStyle = isLight ? 'rgba(220,38,38,0.06)' : 'rgba(255,255,255,0.06)';
    drawRoundedBox(ctx, px, py, pw, ph, 28 * s);
    ctx.fill();
    ctx.strokeStyle = isLight ? 'rgba(220,38,38,0.28)' : 'rgba(255,255,255,0.25)';
    ctx.setLineDash([10 * s, 8 * s]);
    ctx.lineWidth = 2.5 * s;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = isLight ? '#991B1B' : '#E2E8F0';
    ctx.font = `600 ${Math.round(22 * s)}px ${BENGALI_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('রক্তদাতার ছবি আপলোড করুন', px + pw / 2, py + ph / 2);
    ctx.restore();
  }

  // B. Left Column Typography (Faithful to Blood_Donation_Post_Reference)
  let cy = Math.round(145 * s);

  // 1. Top Tagline + Blood Drop ECG Emblem
  ctx.save();
  ctx.font = `600 ${Math.round(28 * s)}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  ctx.fillStyle = inkPrimary;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(state.topTaglinePrefix || 'Blood Donation is', leftMargin + Math.round(28 * s), cy);

  // Second line: "a gift of" + red script "life..."
  const line2Y = cy + Math.round(34 * s);
  const giftLabel = 'a gift of ';
  ctx.font = `500 ${Math.round(28 * s)}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  const giftW = ctx.measureText(giftLabel).width;
  ctx.fillText(giftLabel, leftMargin + Math.round(28 * s), line2Y);

  ctx.font = `400 ${Math.round(52 * s)}px ${SCRIPT_STACK}`;
  ctx.fillStyle = primary;
  const lifeText = state.topTaglineHighlight || 'life...';
  ctx.fillText(lifeText, leftMargin + Math.round(28 * s) + giftW, line2Y - Math.round(10 * s));

  // Blood drop + heartbeat line next to tagline
  const dropX = leftMargin + Math.round(395 * s);
  const dropY = cy + Math.round(30 * s);
  ctx.strokeStyle = primary;
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(dropX - Math.round(110 * s), dropY);
  ctx.lineTo(dropX - Math.round(62 * s), dropY);
  ctx.lineTo(dropX - Math.round(50 * s), dropY - Math.round(24 * s));
  ctx.lineTo(dropX - Math.round(38 * s), dropY + Math.round(22 * s));
  ctx.lineTo(dropX - Math.round(26 * s), dropY);
  ctx.moveTo(dropX + Math.round(36 * s), dropY);
  ctx.lineTo(dropX + Math.round(56 * s), dropY);
  ctx.lineTo(dropX + Math.round(68 * s), dropY - Math.round(24 * s));
  ctx.lineTo(dropX + Math.round(80 * s), dropY + Math.round(22 * s));
  ctx.lineTo(dropX + Math.round(92 * s), dropY);
  ctx.lineTo(dropX + Math.round(145 * s), dropY);
  ctx.stroke();

  drawBloodDropIcon(ctx, dropX, dropY, 72 * s, primary, true);
  ctx.restore();

  cy += Math.round(110 * s);

  // 2. Hero "Thank You!" with 3 burst accents
  ctx.save();
  // 3 small crimson burst lines at top-left of Thank
  ctx.strokeStyle = primary;
  ctx.lineWidth = 6 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(leftMargin + Math.round(12 * s), cy - Math.round(12 * s));
  ctx.lineTo(leftMargin + Math.round(4 * s), cy - Math.round(34 * s));
  ctx.moveTo(leftMargin - Math.round(6 * s), cy + Math.round(8 * s));
  ctx.lineTo(leftMargin - Math.round(24 * s), cy - Math.round(6 * s));
  ctx.moveTo(leftMargin - Math.round(10 * s), cy + Math.round(28 * s));
  ctx.lineTo(leftMargin - Math.round(30 * s), cy + Math.round(24 * s));
  ctx.stroke();

  // "Thank"
  ctx.font = `900 ${Math.round(112 * s)}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  ctx.fillStyle = isLight ? accent : '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(state.heroWordTop || 'Thank', leftMargin + Math.round(22 * s), cy);

  // "You!" script
  cy += Math.round(78 * s);
  ctx.font = `400 ${Math.round(174 * s)}px ${SCRIPT_STACK}`;
  ctx.fillStyle = primary;
  ctx.fillText(state.heroWordScript || 'You!', leftMargin + Math.round(34 * s), cy);

  // Underline swash under You!
  ctx.strokeStyle = primary;
  ctx.lineWidth = 6 * s;
  ctx.beginPath();
  ctx.moveTo(leftMargin + Math.round(96 * s), cy + Math.round(166 * s));
  ctx.quadraticCurveTo(
    leftMargin + Math.round(250 * s),
    cy + Math.round(145 * s),
    leftMargin + Math.round(405 * s),
    cy + Math.round(162 * s)
  );
  ctx.stroke();
  ctx.restore();

  cy += Math.round(198 * s);

  // 3. Lead sentence: "ASP extends its heartfelt gratitude to"
  ctx.save();
  ctx.font = `600 ${Math.round(27 * s)}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  ctx.fillStyle = inkPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const colCenterX = leftMargin + leftColW / 2 - Math.round(14 * s);
  ctx.fillText(state.gratitudeLead || 'ASP extends its heartfelt gratitude to', colCenterX, cy);
  ctx.restore();

  cy += Math.round(44 * s);

  // 4. Donor Name Dark Crimson Pill Capsule
  if (state.donorName) {
    ctx.save();
    const pillW = Math.round(480 * s);
    const pillH = Math.round(62 * s);
    const pillX = colCenterX - pillW / 2;

    ctx.fillStyle = accent;
    drawRoundedBox(ctx, pillX, cy, pillW, pillH, pillH / 2);
    ctx.fill();

    ctx.font = `800 ${Math.round(34 * s)}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.donorName, colCenterX, cy + pillH / 2);
    ctx.restore();
    cy += Math.round(78 * s);
  }

  // 5. Designation with flanking horizontal lines
  if (state.donorDesignation) {
    ctx.save();
    ctx.font = `600 ${Math.round(25 * s)}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
    ctx.fillStyle = inkPrimary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const dText = state.donorDesignation;
    const dw = ctx.measureText(dText).width;
    ctx.fillText(dText, colCenterX, cy);

    ctx.strokeStyle = isLight ? accent : 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 2 * s;
    const lineLen = Math.max(24 * s, (Math.round(460 * s) - dw - Math.round(32 * s)) / 2);
    ctx.beginPath();
    ctx.moveTo(colCenterX - dw / 2 - Math.round(16 * s) - lineLen, cy);
    ctx.lineTo(colCenterX - dw / 2 - Math.round(16 * s), cy);
    ctx.moveTo(colCenterX + dw / 2 + Math.round(16 * s), cy);
    ctx.lineTo(colCenterX + dw / 2 + Math.round(16 * s) + lineLen, cy);
    ctx.stroke();
    ctx.restore();
    cy += Math.round(36 * s);
  }

  // 6. Donation Bag & Blood Group Statement
  ctx.save();
  ctx.textBaseline = 'top';
  const fSize = Math.round(34 * s);
  const l1Part1 = `${state.donationVerbText || 'for donating'} `;
  const l1Part2 = state.bagCountText || '1 bag';
  const l1Part3 = ' of';

  ctx.font = `500 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  const w1 = ctx.measureText(l1Part1).width;
  ctx.font = `800 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  const w2 = ctx.measureText(l1Part2).width;
  ctx.font = `500 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  const w3 = ctx.measureText(l1Part3).width;

  let lx = colCenterX - (w1 + w2 + w3) / 2;
  ctx.textAlign = 'left';
  ctx.fillStyle = inkPrimary;
  ctx.fillText(l1Part1, lx, cy);
  lx += w1;

  ctx.font = `800 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  ctx.fillStyle = primary;
  ctx.fillText(l1Part2, lx, cy);
  lx += w2;

  ctx.font = `500 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  ctx.fillStyle = inkPrimary;
  ctx.fillText(l1Part3, lx, cy);

  cy += Math.round(44 * s);

  // Second line: "A+ Blood today."
  const bGroupLabel = `${state.bloodGroup || 'A+'} Blood `;
  const tailLabel = state.donationTailText || 'today.';

  ctx.font = `800 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  const bw = ctx.measureText(bGroupLabel).width;
  ctx.font = `500 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  const tw = ctx.measureText(tailLabel).width;

  let bx = colCenterX - (bw + tw) / 2;
  ctx.font = `800 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  ctx.fillStyle = primary;
  ctx.fillText(bGroupLabel, bx, cy);
  bx += bw;

  ctx.font = `500 ${fSize}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
  ctx.fillStyle = inkPrimary;
  ctx.fillText(tailLabel, bx, cy);
  ctx.restore();

  cy += Math.round(58 * s);

  // 7. Inspirational Bangla / English Sub-message
  if (state.subMessage) {
    ctx.save();
    const isBanglaSub = /[\u0980-\u09FF]/.test(state.subMessage);
    ctx.font = isBanglaSub
      ? `600 ${Math.round(25 * s)}px ${BENGALI_STACK}`
      : `italic 500 ${Math.round(28 * s)}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
    ctx.fillStyle = inkMuted;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const subLines = wrapPlainParagraphs(ctx, state.subMessage, leftColW - Math.round(12 * s));
    for (const sl of subLines.slice(0, 3)) {
      ctx.fillText(sl, colCenterX, cy);
      cy += Math.round(34 * s);
    }
    ctx.restore();
  }

  // 8. Bottom Humanity Quote Soft Pill Banner
  if (state.bottomQuote) {
    ctx.save();
    const qW = Math.round(480 * s);
    const qH = Math.round(74 * s);
    const qX = colCenterX - qW / 2;
    const qY = height - Math.round(170 * s);

    ctx.fillStyle = isLight ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    drawRoundedBox(ctx, qX, qY, qW, qH, qH / 2);
    ctx.fill();

    ctx.font = `italic 600 ${Math.round(23 * s)}px ${DISPLAY_STACK}, ${BENGALI_STACK}`;
    ctx.fillStyle = isLight ? '#7F1D1D' : '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const qLines = wrapPlainParagraphs(ctx, state.bottomQuote, qW - Math.round(44 * s));
    if (qLines.length === 1) {
      ctx.fillText(qLines[0], colCenterX, qY + qH / 2);
    } else if (qLines.length >= 2) {
      ctx.fillText(qLines[0], colCenterX, qY + qH / 2 - Math.round(14 * s));
      ctx.fillText(qLines[1], colCenterX, qY + qH / 2 + Math.round(14 * s));
    }
    ctx.restore();
  }
}

async function renderBloodRequestLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  s: number,
  state: BloodDonationCardState,
  isLight: boolean,
  primary: string,
  accent: string
) {
  const marginX = Math.round(68 * s);
  const inkPrimary = isLight ? '#0F172A' : '#FFFFFF';
  const inkMuted = isLight ? '#334155' : '#CBD5E1';

  let cy = Math.round(165 * s);

  // Urgent Pill Header
  ctx.save();
  const titleText = (state.requestTitle || 'জরুরি রক্তের প্রয়োজন').toUpperCase();
  ctx.font = `800 ${Math.round(44 * s)}px ${BENGALI_STACK}`;
  ctx.fillStyle = primary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(titleText, width / 2, cy);
  ctx.restore();

  cy += Math.round(78 * s);

  // Big Blood Group Emblem in center
  ctx.save();
  const dropCx = width / 2;
  const dropCy = cy + Math.round(92 * s);
  drawBloodDropIcon(ctx, dropCx, dropCy, Math.round(210 * s), primary, false);

  ctx.font = `900 ${Math.round(72 * s)}px ${DISPLAY_STACK}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.bloodGroup || 'A+', dropCx, dropCy + Math.round(16 * s));
  ctx.restore();

  cy += Math.round(240 * s);

  // Detail Card Info Rows
  const cardW = width - marginX * 2;
  const rows = [
    { label: 'রক্তের পরিমাণ', value: state.bagCountText || '১ ব্যাগ' },
    { label: 'রোগীর বিবরণ', value: state.patientCondition || 'জরুরি অপারেশনের জন্য' },
    { label: 'হাসপাতাল / স্থান', value: state.hospitalLocation || 'কুমিল্লা মেডিকেল কলেজ হাসপাতাল' },
    { label: 'যোগাযোগ নম্বর', value: state.contactNumber || '01700-000000' },
  ];

  ctx.save();
  const rowH = Math.round(74 * s);
  for (const row of rows) {
    ctx.fillStyle = isLight ? 'rgba(220, 38, 38, 0.07)' : 'rgba(255, 255, 255, 0.07)';
    drawRoundedBox(ctx, marginX, cy, cardW, rowH, 16 * s);
    ctx.fill();

    ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.18)' : 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();

    ctx.font = `700 ${Math.round(23 * s)}px ${BENGALI_STACK}`;
    ctx.fillStyle = primary;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(row.label, marginX + Math.round(26 * s), cy + rowH / 2);

    ctx.font = `700 ${Math.round(26 * s)}px ${BENGALI_STACK}`;
    ctx.fillStyle = inkPrimary;
    ctx.textAlign = 'right';
    ctx.fillText(row.value, width - marginX - Math.round(26 * s), cy + rowH / 2);

    cy += rowH + Math.round(16 * s);
  }
  ctx.restore();

  // Sub-message quote
  if (state.subMessage && cy < height - Math.round(130 * s)) {
    ctx.save();
    ctx.font = `600 ${Math.round(23 * s)}px ${BENGALI_STACK}`;
    ctx.fillStyle = inkMuted;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(state.subMessage, width / 2, cy + Math.round(10 * s));
    ctx.restore();
  }
}
