/**
 * ASCII decoration fields.
 *
 * Every ornament on the site is drawn the way the hero wave is: a continuous
 * intensity field sampled once per character cell and quantised through one
 * shared ramp. Holding solid forms and line art to the same field model is what
 * makes a blob, a contour and a route diagram read as one system rather than
 * three unrelated drawings.
 *
 * These render at build time — the output is static <pre> text, not a canvas.
 * Nothing here may use Math.random(): the same input must always produce the
 * same markup or every build would churn the HTML.
 */

export const ASCII_RAMP = ' .:-=+*#%@';

/**
 * Monospace advance width ÷ line height at the decor type settings: a 0.6em
 * advance plus 0.08em letter-spacing over a 0.88 line-height. Circles drawn in
 * grid units come out as ellipses without it, so every decor block has to keep
 * those two CSS values in step with this constant.
 */
const CELL_RATIO = (0.6 + 0.08) / 0.88;

export interface FieldContext {
  /** Physical width ÷ height of the rendered block. Multiply x-deltas by it to keep circles round. */
  aspect: number;
  columns: number;
  rows: number;
}

/** Samples an intensity in 0..1. `x` and `y` span the grid as 0..1. */
export type Field = (x: number, y: number, ctx: FieldContext) => number;

/**
 * Snaps an axis-aligned coordinate onto the nearest cell centre. Without this a
 * horizontal rule lands between two rows and renders as two half-lit ones,
 * which reads as a glitch rather than a drawn line.
 */
const snap = (value: number, steps: number) => Math.round(value * (steps - 1)) / (steps - 1);

/** `[amplitude, frequency, phase]` — a harmonic that warps a radius by angle. */
export type Wobble = readonly [number, number, number];

export interface RenderOptions {
  /** Speckle depth, matching the wave's texture. 0 renders flat fills. */
  grain?: number;
  /** Feathers the outer edges of the grid so shapes don't butt against the box. */
  edgeFade?: number;
}

/**
 * Samples `fields` into a character grid. Fields compose by brightest-wins,
 * which keeps overlapping ornaments legible instead of summing into mush.
 */
export function render(columns: number, rows: number, fields: Field[], options: RenderOptions = {}): string {
  const { grain = 0.18, edgeFade = 0 } = options;
  const ctx: FieldContext = { aspect: (columns / rows) * CELL_RATIO, columns, rows };
  const lastColumn = Math.max(1, columns - 1);
  const lastRow = Math.max(1, rows - 1);
  let text = '';

  for (let row = 0; row < rows; row += 1) {
    const y = row / lastRow;
    for (let column = 0; column < columns; column += 1) {
      const x = column / lastColumn;

      let value = 0;
      for (const field of fields) {
        const sample = field(x, y, ctx);
        if (sample > value) value = sample;
      }

      if (value > 0) {
        // Deterministic speckle — the same term the wave uses, so the textures match.
        value *= 1 - grain + grain * (0.5 + 0.5 * Math.sin(column * 1.73 + row * 2.31));
        if (edgeFade > 0) {
          const fade = Math.sin(Math.PI * x) * Math.sin(Math.PI * y);
          value *= 1 - edgeFade + edgeFade * Math.pow(Math.max(0, fade), 0.35);
        }
      }

      const index = Math.min(ASCII_RAMP.length - 1, Math.max(0, Math.floor(value * ASCII_RAMP.length)));
      text += ASCII_RAMP[index];
    }
    if (row < rows - 1) text += '\n';
  }

  return text;
}

/** Squared falloff shared by every stroke, so all line work feathers identically. */
const stroke = (distance: number, thickness: number) => {
  const d = distance / thickness;
  return Math.exp(-d * d);
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const radiusAt = (angle: number, radius: number, wobble: readonly Wobble[]) => {
  let value = radius;
  for (const [amplitude, frequency, phase] of wobble) {
    value += amplitude * Math.sin(angle * frequency + phase);
  }
  return value;
};

/** Organic closed form — the ASCII answer to the old SVG blobs. */
export function blob(options: {
  cx?: number;
  cy?: number;
  radius?: number;
  wobble?: readonly Wobble[];
  edge?: number;
  weight?: number;
}): Field {
  const { cx = 0.5, cy = 0.5, radius = 0.4, wobble = [], edge = 0.14, weight = 1 } = options;
  return (x, y, { aspect }) => {
    const dx = (x - cx) * aspect;
    const dy = y - cy;
    const limit = radiusAt(Math.atan2(dy, dx), radius, wobble);
    const depth = (limit - Math.hypot(dx, dy)) / edge;
    if (depth <= 0) return 0;
    return smoothstep(Math.min(1, depth)) * weight;
  };
}

export interface LineSpec {
  /** Rest height of the line, 0 at the top of the grid. */
  offset: number;
  amplitude: number;
  frequency: number;
  phase: number;
  thickness: number;
  weight?: number;
  /** Period of an on/off dash along x, in grid widths. Omit for a solid line. */
  dash?: number;
}

/** Flowing horizontal contours — the hero's landform lines. */
export function waveLines(lines: readonly LineSpec[]): Field {
  return (x, y) => {
    let value = 0;
    for (const line of lines) {
      const centre =
        line.offset +
        Math.sin(x * line.frequency + line.phase) * line.amplitude +
        Math.sin(x * line.frequency * 0.43 + line.phase * 1.7) * line.amplitude * 0.45;
      let sample = stroke(y - centre, line.thickness) * (line.weight ?? 1);
      if (line.dash) sample *= Math.sin((x / line.dash) * Math.PI * 2) > 0 ? 1 : 0;
      if (sample > value) value = sample;
    }
    return value;
  };
}

/** Concentric rings — gauges, signal rings, and (with wobble) topographic contours. */
export function rings(options: {
  cx?: number;
  cy?: number;
  radii: readonly number[];
  thickness?: number;
  wobble?: readonly Wobble[];
  weight?: number;
  /** Number of graduations around the ring; the gaps between them dim rather than vanish. */
  ticks?: number;
}): Field {
  const { cx = 0.5, cy = 0.5, radii, thickness = 0.016, wobble = [], weight = 1, ticks = 0 } = options;
  return (x, y, { aspect }) => {
    const dx = (x - cx) * aspect;
    const dy = y - cy;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    let value = 0;
    for (const radius of radii) {
      const sample = stroke(distance - radiusAt(angle, radius, wobble), thickness);
      if (sample > value) value = sample;
    }
    if (ticks > 0) value *= Math.sin(angle * ticks) > 0 ? 1 : 0.3;
    return value * weight;
  };
}

/** `[x1, y1, x2, y2]` in grid coordinates. */
export type Segment = readonly [number, number, number, number];

/** Straight runs — route diagrams, crosshairs, and the ruled lines on sheets. */
export function segments(list: readonly Segment[], thickness = 0.014, weight = 1): Field {
  return (x, y, { aspect, columns, rows }) => {
    const px = x * aspect;
    const py = y;
    let value = 0;
    for (const [x1, y1, x2, y2] of list) {
      // Axis-aligned runs snap onto a cell line; diagonals are left alone.
      const horizontal = y1 === y2;
      const vertical = x1 === x2;
      const ax = (vertical ? snap(x1, columns) : x1) * aspect;
      const ay = horizontal ? snap(y1, rows) : y1;
      const bx = (vertical ? snap(x2, columns) : x2) * aspect;
      const by = horizontal ? snap(y2, rows) : y2;
      const vx = bx - ax;
      const vy = by - ay;
      const lengthSq = vx * vx + vy * vy;
      const t = lengthSq === 0 ? 0 : Math.min(1, Math.max(0, ((px - ax) * vx + (py - ay) * vy) / lengthSq));
      const sample = stroke(Math.hypot(px - (ax + vx * t), py - (ay + vy * t)), thickness);
      if (sample > value) value = sample;
    }
    return value * weight;
  };
}

export interface BoxSpec {
  cx: number;
  cy: number;
  width: number;
  height: number;
  /** Radians, clockwise. */
  rotate?: number;
}

export interface SheetSpec extends BoxSpec {
  /** Ruled lines as `[y within the sheet, width as a fraction of the text column]`. */
  rules?: readonly (readonly [number, number])[];
}

/**
 * A pile of pages, drawn back to front. Unlike every other builder here these
 * composite in painter's order rather than brightest-wins: a sheet is opaque, so
 * it hides the one behind it. Without that the outlines read through each other
 * and the pile looks like tangled wireframe instead of a stack.
 */
export function sheets(list: readonly SheetSpec[], thickness = 0.016, weight = 1): Field {
  return (x, y, { aspect }) => {
    let value = 0;

    for (const sheet of list) {
      const angle = sheet.rotate ?? 0;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dx = (x - sheet.cx) * aspect;
      const dy = y - sheet.cy;
      const localX = dx * cos + dy * sin;
      const localY = -dx * sin + dy * cos;
      const halfWidth = (sheet.width * aspect) / 2;
      const halfHeight = sheet.height / 2;

      const qx = Math.abs(localX) - halfWidth;
      const qy = Math.abs(localY) - halfHeight;
      const distance = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
      // Outside this sheet's paper: leave whatever is already there showing.
      if (distance > thickness * 2) continue;

      let own = stroke(Math.abs(distance), thickness);
      const textStart = -halfWidth * 0.72;
      for (const [ruleY, ruleWidth] of sheet.rules ?? []) {
        if (localX < textStart || localX > textStart + ruleWidth * halfWidth * 1.44) continue;
        own = Math.max(own, stroke(localY - (ruleY - 0.5) * sheet.height, thickness * 0.85) * 0.72);
      }
      value = own * weight;
    }

    return value;
  };
}

/** Rectangle outlines — route nodes and other upright frames. */
export function boxes(list: readonly BoxSpec[], thickness = 0.014, weight = 1): Field {
  return (x, y, { aspect, columns, rows }) => {
    let value = 0;
    for (const box of list) {
      const angle = box.rotate ?? 0;
      // An upright box can sit exactly on the grid; a rotated one crosses cells anyway.
      const upright = angle === 0;
      const cx = upright ? snap(box.cx, columns) : box.cx;
      const cy = upright ? snap(box.cy, rows) : box.cy;
      const halfWidth = upright ? snap(box.width / 2, columns) : box.width / 2;
      const halfHeight = upright ? snap(box.height / 2, rows) : box.height / 2;

      const dx = (x - cx) * aspect;
      const dy = y - cy;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const localX = Math.abs(dx * cos + dy * sin) - halfWidth * aspect;
      const localY = Math.abs(-dx * sin + dy * cos) - halfHeight;
      // Signed distance to the rectangle; the absolute value gives its outline.
      const outside = Math.hypot(Math.max(localX, 0), Math.max(localY, 0));
      const inside = Math.min(Math.max(localX, localY), 0);
      const sample = stroke(Math.abs(outside + inside), thickness);
      if (sample > value) value = sample;
    }
    return value * weight;
  };
}
