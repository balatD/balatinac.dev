import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Annotate Markdown images with intrinsic dimensions and loading hints.
 *
 * Markdown `![alt](src)` emits a bare `<img src alt>`. Without `width`/`height`
 * the browser cannot reserve space, so every image shifts the layout as it
 * arrives, and without `loading` every image on a page is fetched eagerly. A
 * case study with seven screenshots would blow both the CLS and LCP budgets.
 *
 * Dimensions are read straight from the file in `public/` — these are static
 * assets, not `astro:assets` imports, so nothing else knows their size. The
 * first image in a document stays eager because it is the likely LCP element.
 */

/** Minimal WebP/PNG header reader. Returns null for anything it cannot parse. */
function readIntrinsicSize(absPath) {
  let buf;
  try {
    buf = readFileSync(absPath);
  } catch {
    return null;
  }

  // PNG: 8-byte signature, then an IHDR chunk carrying two big-endian uint32s.
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // WebP: "RIFF" .... "WEBP" then a chunk whose fourcc decides the encoding.
  if (buf.length >= 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const fourcc = buf.toString('ascii', 12, 16);

    if (fourcc === 'VP8 ') {
      // Lossy: 3-byte frame tag, 3-byte sync code, then 14-bit width/height.
      if (buf[23] !== 0x9d || buf[24] !== 0x01 || buf[25] !== 0x2a) return null;
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
      };
    }

    if (fourcc === 'VP8L') {
      // Lossless: 1-byte signature, then 14 bits width-1 and 14 bits height-1.
      if (buf[20] !== 0x2f) return null;
      const bits = buf.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }

    if (fourcc === 'VP8X') {
      // Extended: 24-bit little-endian canvas width-1 / height-1.
      return {
        width: (buf.readUIntLE(24, 3) & 0xffffff) + 1,
        height: (buf.readUIntLE(27, 3) & 0xffffff) + 1,
      };
    }
  }

  return null;
}

export default function rehypeProseImages({ publicDir = 'public' } = {}) {
  return (tree) => {
    let seen = 0;

    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        const props = (node.properties ??= {});
        const src = typeof props.src === 'string' ? props.src : '';

        // Only local assets served straight out of public/ can be measured.
        if (src.startsWith('/') && !src.startsWith('//')) {
          if (props.width == null && props.height == null) {
            const size = readIntrinsicSize(join(publicDir, src));
            if (size) {
              props.width = size.width;
              props.height = size.height;
            }
          }
        }

        props.decoding ??= 'async';
        // Keep the first image eager — it is the one most likely to be the LCP.
        if (props.loading == null && seen > 0) props.loading = 'lazy';
        seen += 1;
      }

      if (node.children) node.children.forEach(walk);
    };

    walk(tree);
  };
}
