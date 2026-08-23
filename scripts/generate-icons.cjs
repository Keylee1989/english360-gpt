/**
 * Generate PWA icons as minimal valid PNG files.
 *
 * Run: node scripts/generate-icons.js
 *
 * Creates 192x192 and 512x512 icons with the E360 branding.
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function createPNG(width, height, pixels) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = createChunk("IHDR", ihdrData);

  // IDAT chunk (compressed pixel data)
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // filter type: none
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (1 + width * 4) + 1 + x * 4;
      raw[dstIdx] = pixels[srcIdx];     // R
      raw[dstIdx + 1] = pixels[srcIdx + 1]; // G
      raw[dstIdx + 2] = pixels[srcIdx + 2]; // B
      raw[dstIdx + 3] = pixels[srcIdx + 3]; // A
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idat = createChunk("IDAT", compressed);

  // IEND chunk
  const iend = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function generateIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);

  // Background: blue gradient (simplified as solid blue)
  const bgR = 30, bgG = 64, bgB = 175; // #1e40af

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Rounded rectangle background
      const cornerRadius = size * 0.15;
      const margin = size * 0.02;
      const inBounds = x >= margin && x < size - margin && y >= margin && y < size - margin;

      let isBackground = false;
      if (inBounds) {
        // Check corners
        const corners = [
          [margin + cornerRadius, margin + cornerRadius],
          [size - margin - cornerRadius, margin + cornerRadius],
          [margin + cornerRadius, size - margin - cornerRadius],
          [size - margin - cornerRadius, size - margin - cornerRadius],
        ];

        isBackground = true;
        for (const [cx, cy] of corners) {
          const dx = x - cx;
          const dy = y - cy;
          // If in a corner zone, check if inside the circle
          if (
            (x < margin + cornerRadius || x > size - margin - cornerRadius) &&
            (y < margin + cornerRadius || y > size - margin - cornerRadius)
          ) {
            if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
              isBackground = false;
            }
          }
        }
      }

      if (isBackground) {
        // Simple gradient: lighter at top-left, darker at bottom-right
        const t = (x + y) / (size * 2);
        pixels[idx] = Math.round(bgR + (20 - bgR) * t);
        pixels[idx + 1] = Math.round(bgG + (80 - bgG) * t);
        pixels[idx + 2] = Math.round(bgB + (220 - bgB) * t);
        pixels[idx + 3] = 255;

        // Draw "E" text area (white rectangle in upper-left area)
        const textArea = {
          x1: size * 0.15,
          y1: size * 0.2,
          x2: size * 0.45,
          y2: size * 0.65,
        };

        if (
          x >= textArea.x1 && x <= textArea.x2 &&
          y >= textArea.y1 && y <= textArea.y2
        ) {
          // E shape: three horizontal bars and one vertical bar
          const barHeight = size * 0.06;
          const vertWidth = size * 0.06;

          const inVertBar = x <= textArea.x1 + vertWidth;
          const inTopBar = y <= textArea.y1 + barHeight;
          const inMidBar = Math.abs(y - (textArea.y1 + textArea.y2) / 2) <= barHeight / 2;
          const inBotBar = y >= textArea.y2 - barHeight;

          if (inVertBar || inTopBar || inMidBar || inBotBar) {
            pixels[idx] = 255;
            pixels[idx + 1] = 255;
            pixels[idx + 2] = 255;
            pixels[idx + 3] = 255;
          }
        }

        // Draw "360" text area (white text in lower-right area)
        const numArea = {
          x1: size * 0.45,
          y1: size * 0.55,
          x2: size * 0.85,
          y2: size * 0.8,
        };

        if (
          x >= numArea.x1 && x <= numArea.x2 &&
          y >= numArea.y1 && y <= numArea.y2
        ) {
          // Simplified "360" - just draw a white bar
          const barHeight = size * 0.04;
          if (Math.abs(y - (numArea.y1 + numArea.y2) / 2) <= barHeight) {
            pixels[idx] = 255;
            pixels[idx + 1] = 255;
            pixels[idx + 2] = 255;
            pixels[idx + 3] = 220;
          }
        }
      } else {
        // Transparent
        pixels[idx] = 0;
        pixels[idx + 1] = 0;
        pixels[idx + 2] = 0;
        pixels[idx + 3] = 0;
      }
    }
  }

  return createPNG(size, size, pixels);
}

// Generate icons
const iconsDir = path.join(__dirname, "..", "public", "icons");

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const icon192 = generateIcon(192);
const icon512 = generateIcon(512);

fs.writeFileSync(path.join(iconsDir, "icon-192.png"), icon192);
fs.writeFileSync(path.join(iconsDir, "icon-512.png"), icon512);

// Also generate apple-touch-icon (180x180)
const icon180 = generateIcon(180);
fs.writeFileSync(path.join(iconsDir, "apple-touch-icon.png"), icon180);

console.log("✅ Generated icons:");
console.log("  - public/icons/icon-192.png");
console.log("  - public/icons/icon-512.png");
console.log("  - public/icons/apple-touch-icon.png");
