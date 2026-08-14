/**
 * The site's ornament vocabulary, composed from `ascii-art` fields.
 *
 * Each export is the finished character block for one decoration, built once at
 * module load (build time) and inlined into the markup. Grid sizes are chosen so
 * that columns ÷ rows roughly matches the shape's intended proportion — see
 * CELL_RATIO in ascii-art.ts for why the two are not the same number.
 */

import { blob, boxes, render, rings, segments, sheets, waveLines, type Segment } from './ascii-art';

/* ─── Hero ─── */

/** The large soft mass behind the headline. Deliberately dim — it is a ground, not a figure. */
export const heroBackForm = render(
  96,
  56,
  [
    blob({
      radius: 0.62,
      wobble: [
        [0.07, 3, 0.6],
        [0.04, 5, 2.1],
        [0.025, 2, 4.0],
      ],
      edge: 0.34,
      weight: 0.44,
    }),
  ],
  { grain: 0.22 },
);

export const heroAccentForm = render(
  60,
  40,
  [
    blob({
      radius: 0.56,
      wobble: [
        [0.08, 3, 2.2],
        [0.045, 4, 0.4],
      ],
      edge: 0.28,
      weight: 0.6,
    }),
  ],
  { grain: 0.2 },
);

/** Landform contours sweeping out of the hero's bottom-right corner. */
export const heroContour = render(
  112,
  34,
  [
    waveLines([
      { offset: 0.4, amplitude: 0.17, frequency: 4.2, phase: 0.4, thickness: 0.055, weight: 0.8 },
      { offset: 0.68, amplitude: 0.14, frequency: 3.4, phase: 2.1, thickness: 0.045, weight: 0.55, dash: 0.05 },
    ]),
  ],
  { grain: 0.16, edgeFade: 0.7 },
);

/**
 * Surveyor's gauge — a graduated ring with a crosshair through it. Deliberately
 * the coarsest grid on the site: it sits over the back form's texture, and a
 * finer ring dissolves into that noise instead of reading as an instrument.
 */
export const heroGauge = render(
  26,
  20,
  [
    rings({ radii: [0.4], thickness: 0.05, weight: 0.95, ticks: 20 }),
    rings({ radii: [0.24], thickness: 0.04, weight: 0.5 }),
    segments(
      [
        [0.14, 0.5, 0.86, 0.5],
        [0.5, 0.08, 0.5, 0.92],
      ],
      0.035,
      0.7,
    ),
  ],
  { grain: 0.1 },
);

/* ─── Section ornaments ─── */

/** About — nested topographic loops. */
export const sectionContours = render(
  56,
  34,
  [
    rings({
      radii: [0.2, 0.31, 0.42],
      thickness: 0.024,
      wobble: [
        [0.05, 3, 0.8],
        [0.028, 5, 2.4],
      ],
      weight: 0.95,
    }),
  ],
  { grain: 0.14, edgeFade: 0.35 },
);

/**
 * Work — a routed circuit with nodes. Coordinates carry over from the SVG this
 * replaced, so the diagram keeps its original rhythm.
 */
const routeLines: Segment[] = [
  [0.044, 0.775, 0.289, 0.775],
  [0.289, 0.775, 0.289, 0.475],
  [0.289, 0.475, 0.517, 0.475],
  [0.517, 0.475, 0.517, 0.217],
  [0.517, 0.217, 0.953, 0.217],
  [0.289, 0.775, 0.517, 0.775],
  [0.517, 0.775, 0.517, 0.929],
  [0.517, 0.929, 0.883, 0.929],
];

const routeNodes = [
  { cx: 0.289, cy: 0.775 },
  { cx: 0.517, cy: 0.475 },
  { cx: 0.517, cy: 0.217 },
  { cx: 0.883, cy: 0.929 },
  { cx: 0.953, cy: 0.217 },
];

export const sectionRoutes = render(
  60,
  34,
  [
    segments(routeLines, 0.02, 0.85),
    boxes(
      routeNodes.map((node) => ({ ...node, width: 0.05, height: 0.07 })),
      0.018,
      1,
    ),
  ],
  { grain: 0.14, edgeFade: 0.3 },
);

/** Writing — a stack of ruled sheets, back to front. */
export const sectionSheets = render(
  46,
  32,
  [
    sheets(
      [
        { cx: 0.36, cy: 0.6, width: 0.44, height: 0.56, rotate: -0.16 },
        { cx: 0.46, cy: 0.52, width: 0.44, height: 0.56, rotate: -0.07 },
        {
          cx: 0.58,
          cy: 0.44,
          width: 0.44,
          height: 0.56,
          rotate: 0.03,
          rules: [
            [0.26, 0.94],
            [0.42, 0.72],
            [0.58, 0.88],
            [0.74, 0.55],
          ],
        },
      ],
      0.018,
      0.95,
    ),
  ],
  { grain: 0.14, edgeFade: 0.3 },
);

/** Contact — a signal radiating from a point. */
export const sectionSignal = render(
  48,
  34,
  [
    rings({ radii: [0.16, 0.3, 0.44], thickness: 0.022, weight: 0.9 }),
    blob({ radius: 0.035, edge: 0.025, weight: 1 }),
  ],
  { grain: 0.12, edgeFade: 0.4 },
);

/* ─── Detail headers ─── */

/** Project headers — the routed circuit at larger scale, with waypoint nodes. */
export const detailRoutes = render(
  74,
  38,
  [
    segments(
      [
        [0.058, 0.794, 0.258, 0.794],
        [0.258, 0.794, 0.258, 0.553],
        [0.258, 0.553, 0.442, 0.553],
        [0.442, 0.553, 0.442, 0.276],
        [0.442, 0.276, 0.65, 0.276],
        [0.65, 0.276, 0.65, 0.459],
        [0.65, 0.459, 0.938, 0.459],
        [0.258, 0.794, 0.442, 0.794],
        [0.442, 0.794, 0.442, 0.906],
        [0.442, 0.906, 0.78, 0.906],
        [0.78, 0.906, 0.78, 0.659],
        [0.78, 0.659, 0.938, 0.659],
      ],
      0.017,
      0.85,
    ),
    boxes(
      [
        { cx: 0.258, cy: 0.553, width: 0.062, height: 0.094 },
        { cx: 0.442, cy: 0.276, width: 0.062, height: 0.094 },
        { cx: 0.65, cy: 0.459, width: 0.062, height: 0.094 },
      ],
      0.016,
      1,
    ),
    rings({ cx: 0.938, cy: 0.459, radii: [0.03], thickness: 0.014, weight: 1 }),
    rings({ cx: 0.938, cy: 0.659, radii: [0.03], thickness: 0.014, weight: 1 }),
  ],
  { grain: 0.14, edgeFade: 0.3 },
);

/** Blog headers — sheets with an arc sweeping out behind them. */
export const detailSheets = render(
  44,
  34,
  [
    rings({ cx: 0.88, cy: 0.92, radii: [0.4], thickness: 0.018, weight: 0.5, ticks: 34 }),
    sheets(
      [
        { cx: 0.4, cy: 0.56, width: 0.5, height: 0.62, rotate: -0.15 },
        {
          cx: 0.54,
          cy: 0.45,
          width: 0.5,
          height: 0.62,
          rotate: 0.05,
          rules: [
            [0.24, 0.96],
            [0.4, 0.7],
            [0.56, 0.9],
            [0.72, 0.6],
          ],
        },
      ],
      0.018,
      0.95,
    ),
  ],
  { grain: 0.14, edgeFade: 0.3 },
);
