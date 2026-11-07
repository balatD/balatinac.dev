import type { Lang } from './i18n';
import { t } from './i18n';

export type ArtSlot = 'hero' | 'band' | 'figure';

/**
 * Character grid shared by every painting in a slot. The text files and colour
 * maps in public/ascii/<slot>/ are rendered to exactly this grid by
 * scripts/ascii-paintings.py, so swapping paintings never resizes the frame.
 */
export const SLOT_GRID: Record<ArtSlot, { cols: number; rows: number }> = {
  hero: { cols: 260, rows: 94 },
  band: { cols: 290, rows: 66 },
  figure: { cols: 110, rows: 78 },
};

interface Painting {
  id: string;
  artist: string;
  title: Record<Lang, string>;
  year: string;
  circa?: boolean;
  slots: ArtSlot[];
  /** Per slot: the first row of water that keeps rippling once the painting has resolved. */
  ripple?: Partial<Record<ArtSlot, number>>;
}

const PAINTINGS: Painting[] = [
  {
    id: 'wave',
    artist: 'Katsushika Hokusai',
    title: { en: 'The Great Wave off Kanagawa', de: 'Die große Welle vor Kanagawa' },
    year: '1831',
    circa: true,
    slots: ['hero', 'band'],
  },
  {
    id: 'adam',
    artist: 'Michelangelo',
    title: { en: 'The Creation of Adam', de: 'Die Erschaffung Adams' },
    year: '1512',
    circa: true,
    slots: ['hero', 'band'],
  },
  {
    id: 'hunters',
    artist: 'Pieter Bruegel',
    title: { en: 'Hunters in the Snow', de: 'Die Jäger im Schnee' },
    year: '1565',
    slots: ['hero', 'band'],
  },
  {
    id: 'sunrise',
    artist: 'Claude Monet',
    title: { en: 'Impression, Sunrise', de: 'Impression, Sonnenaufgang' },
    year: '1872',
    slots: ['hero'],
    ripple: { hero: 52 },
  },
  {
    id: 'starry',
    artist: 'Vincent van Gogh',
    title: { en: 'The Starry Night', de: 'Die Sternennacht' },
    year: '1889',
    slots: ['hero', 'band'],
  },
  {
    id: 'supper',
    artist: 'Leonardo da Vinci',
    title: { en: 'The Last Supper', de: 'Das Abendmahl' },
    year: '1498',
    circa: true,
    slots: ['band'],
  },
  {
    id: 'pearl',
    artist: 'Johannes Vermeer',
    title: { en: 'Girl with a Pearl Earring', de: 'Das Mädchen mit dem Perlenohrring' },
    year: '1665',
    circa: true,
    slots: ['figure'],
  },
  {
    id: 'wanderer',
    artist: 'Caspar David Friedrich',
    title: { en: 'Wanderer above the Sea of Fog', de: 'Der Wanderer über dem Nebelmeer' },
    year: '1818',
    circa: true,
    slots: ['figure'],
  },
  {
    id: 'vitruvian',
    artist: 'Leonardo da Vinci',
    title: { en: 'Vitruvian Man', de: 'Der vitruvianische Mensch' },
    year: '1490',
    circa: true,
    slots: ['figure'],
  },
  {
    id: 'monalisa',
    artist: 'Leonardo da Vinci',
    title: { en: 'Mona Lisa', de: 'Mona Lisa' },
    year: '1503',
    circa: true,
    slots: ['figure'],
  },
  {
    id: 'vgself',
    artist: 'Vincent van Gogh',
    title: { en: 'Self-Portrait', de: 'Selbstbildnis' },
    year: '1887',
    slots: ['figure'],
  },
  {
    id: 'durer',
    artist: 'Albrecht Dürer',
    title: { en: 'Self-Portrait', de: 'Selbstbildnis im Pelzrock' },
    year: '1500',
    slots: ['figure'],
  },
  {
    id: 'fuji',
    artist: 'Katsushika Hokusai',
    title: { en: 'Fine Wind, Clear Morning', de: 'Feiner Wind, klarer Morgen' },
    year: '1831',
    circa: true,
    slots: ['hero', 'band'],
  },
  {
    id: 'venus',
    artist: 'Sandro Botticelli',
    title: { en: 'The Birth of Venus', de: 'Die Geburt der Venus' },
    year: '1485',
    circa: true,
    slots: ['hero'],
  },
  {
    id: 'sunflowers',
    artist: 'Vincent van Gogh',
    title: { en: 'Sunflowers', de: 'Sonnenblumen' },
    year: '1888',
    slots: ['figure'],
  },
  {
    id: 'babel',
    artist: 'Pieter Bruegel',
    title: { en: 'The Tower of Babel', de: 'Der Turmbau zu Babel' },
    year: '1563',
    slots: ['hero', 'band'],
  },
  {
    id: 'seaofice',
    artist: 'Caspar David Friedrich',
    title: { en: 'The Sea of Ice', de: 'Das Eismeer' },
    year: '1824',
    circa: true,
    slots: ['hero', 'band'],
  },
  {
    id: 'moon',
    artist: 'Caspar David Friedrich',
    title: { en: 'Two Men Contemplating the Moon', de: 'Zwei Männer in Betrachtung des Mondes' },
    year: '1825',
    circa: true,
    slots: ['hero'],
  },
  {
    id: 'athens',
    artist: 'Raphael',
    title: { en: 'The School of Athens', de: 'Die Schule von Athen' },
    year: '1511',
    circa: true,
    slots: ['hero', 'band'],
  },
  {
    id: 'shower',
    artist: 'Utagawa Hiroshige',
    title: { en: 'Sudden Shower over Shin-Ōhashi Bridge', de: 'Plötzlicher Regen über der Shin-Ōhashi-Brücke' },
    year: '1857',
    slots: ['figure'],
  },
  {
    id: 'ermine',
    artist: 'Leonardo da Vinci',
    title: { en: 'Lady with an Ermine', de: 'Die Dame mit dem Hermelin' },
    year: '1490',
    circa: true,
    slots: ['figure'],
  },
  {
    id: 'hare',
    artist: 'Albrecht Dürer',
    title: { en: 'Young Hare', de: 'Feldhase' },
    year: '1502',
    slots: ['figure'],
  },
  {
    id: 'arnolfini',
    artist: 'Jan van Eyck',
    title: { en: 'The Arnolfini Portrait', de: 'Die Arnolfini-Hochzeit' },
    year: '1434',
    slots: ['figure'],
  },
  {
    id: 'whistler',
    artist: 'James McNeill Whistler',
    title: { en: 'Whistler’s Mother', de: 'Whistlers Mutter' },
    year: '1871',
    slots: ['figure'],
  },
  {
    id: 'gothic',
    artist: 'Grant Wood',
    title: { en: 'American Gothic', de: 'American Gothic' },
    year: '1930',
    slots: ['figure'],
  },
  {
    id: 'mondrian',
    artist: 'Piet Mondrian',
    title: { en: 'Composition with Red, Blue and Yellow', de: 'Komposition mit Rot, Blau und Gelb' },
    year: '1930',
    slots: ['figure'],
  },
  {
    id: 'milkmaid',
    artist: 'Johannes Vermeer',
    title: { en: 'The Milkmaid', de: 'Die Dienstmagd mit Milchkrug' },
    year: '1658',
    circa: true,
    slots: ['figure'],
  },
];

export interface ArtEntry {
  id: string;
  caption: string;
  ripple?: number;
}

/** Everything the client needs to draw any painting of a slot, captions already localised. */
export function artPool(slot: ArtSlot, lang: Lang): ArtEntry[] {
  return PAINTINGS.filter((p) => p.slots.includes(slot)).map((p) => ({
    id: p.id,
    caption: `${t('art.after', lang)} ${p.artist}, ${p.title[lang]}, ${p.circa ? `${t('art.circa', lang)} ` : ''}${p.year}`,
    ripple: p.ripple?.[slot],
  }));
}
