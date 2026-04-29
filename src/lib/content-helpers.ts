import type { CollectionEntry } from 'astro:content';

/**
 * Filter English entries (no de/ prefix in ID).
 */
export function getEnEntries<T extends { id: string }>(entries: T[]): T[] {
  return entries.filter((e) => !e.id.startsWith('de/'));
}

/**
 * Build a lookup map from DE entries: slug → entry.
 * DE entries have IDs like "de/multi-site-typo3-platform".
 */
export function getDeMap<T extends { id: string }>(entries: T[]): Map<string, T> {
  return new Map(
    entries
      .filter((e) => e.id.startsWith('de/'))
      .map((e) => [e.id.replace('de/', ''), e])
  );
}

/**
 * Get the DE translation for a given EN entry.
 */
export function getDe<T extends { id: string }>(
  deMap: Map<string, T>,
  enEntry: T
): T | undefined {
  return deMap.get(enEntry.id);
}
