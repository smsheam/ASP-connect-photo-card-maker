/**
 * Client-side Automatic Portrait Background Removal Utility
 * Uses @imgly/background-removal (ONNX/WASM) with progress tracking
 * and a fast Canvas edge-connected fallback if offline.
 */

export async function removePhotoBackground(
  imageInput: File | Blob | string,
  onProgress?: (percent: number, stage: string) => void
): Promise<string> {
  try {
    onProgress?.(10, 'AI মডেল লোড হচ্ছে...');
    const { removeBackground } = await import('@imgly/background-removal');

    const resultBlob = await removeBackground(imageInput, {
      model: 'isnet_fp16',
      output: {
        format: 'image/png',
        quality: 1.0,
      },
      progress: (_key: string, current: number, total: number) => {
        if (total > 0) {
          const pct = Math.min(95, Math.max(15, Math.round((current / total) * 100)));
          onProgress?.(pct, 'ব্যাকগ্রাউন্ড আলাদা করা হচ্ছে...');
        }
      },
    });

    onProgress?.(100, 'সম্পন্ন!');
    return URL.createObjectURL(resultBlob);
  } catch (primaryErr) {
    console.warn('Primary AI background removal failed, using smart edge fallback:', primaryErr);
    onProgress?.(60, 'স্মার্ট কাটআউট প্রসেসিং...');
    const fallbackUrl = await smartEdgeColorCutoutFallback(imageInput);
    onProgress?.(100, 'সম্পন্ন');
    return fallbackUrl;
  }
}

/**
 * Fallback edge-connected flood-fill background remover for uniform/studio backdrops
 * if WASM/CDN is blocked or offline.
 */
async function smartEdgeColorCutoutFallback(imageInput: File | Blob | string): Promise<string> {
  const srcUrl =
    typeof imageInput === 'string' ? imageInput : URL.createObjectURL(imageInput);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = srcUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return srcUrl;

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imgData;

  // Sample 4 corners to detect uniform studio background color
  const samples = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    (height * width - 1) * 4,
  ];
  let avgR = 0;
  let avgG = 0;
  let avgB = 0;
  for (const idx of samples) {
    avgR += data[idx];
    avgG += data[idx + 1];
    avgB += data[idx + 2];
  }
  avgR /= 4;
  avgG /= 4;
  avgB /= 4;

  // Flood-fill from outer border only (never erases inside the face/clothes)
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const threshold = 48;

  const isBg = (pIdx: number) => {
    const i = pIdx * 4;
    const dr = data[i] - avgR;
    const dg = data[i + 1] - avgG;
    const db = data[i + 2] - avgB;
    return Math.sqrt(dr * dr + dg * dg + db * db) < threshold;
  };

  for (let x = 0; x < width; x++) {
    queue[tail++] = x;
    queue[tail++] = (height - 1) * width + x;
  }
  for (let y = 1; y < height - 1; y++) {
    queue[tail++] = y * width;
    queue[tail++] = y * width + (width - 1);
  }

  while (head < tail) {
    const p = queue[head++];
    if (visited[p]) continue;
    visited[p] = 1;
    if (!isBg(p)) continue;

    data[p * 4 + 3] = 0; // transparent
    const x = p % width;
    const y = (p - x) / width;

    if (x > 0 && !visited[p - 1]) queue[tail++] = p - 1;
    if (x < width - 1 && !visited[p + 1]) queue[tail++] = p + 1;
    if (y > 0 && !visited[p - width]) queue[tail++] = p - width;
    if (y < height - 1 && !visited[p + width]) queue[tail++] = p + width;
  }

  ctx.putImageData(imgData, 0, 0);

  return await new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      } else {
        resolve(srcUrl);
      }
    }, 'image/png');
  });
}
