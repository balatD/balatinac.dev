import type { Lang } from './i18n';

/**
 * Build a lookup map from DE entries by matching filename.
 * DE entries from the separate 'blogDe'/'projectsDe' collection have IDs like 'de/why-astro-not-typo3'.
 * We strip the 'de/' prefix to match against EN entry IDs.
 */
export function buildDeMap<T extends { id: string }>(deEntries: T[]): Map<string, T> {
  return new Map(
    deEntries.map((e) => {
      const key = e.id.startsWith('de/') ? e.id.replace('de/', '') : e.id;
      return [key, e];
    })
  );
}

/**
 * Get display data for a content entry in the requested language.
 *
 * The EN entry and the DE map need separate type parameters: paired entries come
 * from two different collections ('projects' vs 'projectsDe'), so their literal
 * `collection` fields make them mutually unassignable.
 */
export function getLocalizedEntry<
  E extends { id: string; data: { title: string; description: string; urlSlug?: string } },
  D extends { data: { title: string; description: string; urlSlug?: string } },
>(
  enEntry: E,
  deMap: Map<string, D>,
  lang: Lang,
): { entry: E; title: string; description: string; slug: string } {
  const de = deMap.get(enEntry.id);
  if (lang === 'de' && de) {
    return {
      entry: enEntry,
      title: de.data.title,
      description: de.data.description,
      slug: de.data.urlSlug || enEntry.id,
    };
  }
  return {
    entry: enEntry,
    title: enEntry.data.title,
    description: enEntry.data.description,
    slug: enEntry.data.urlSlug || enEntry.id,
  };
}

/**
 * Get the DE slug for an EN entry. Falls back to the EN entry's id.
 */
export function getDeSlug<
  E extends { id: string },
  D extends { data: { urlSlug?: string } },
>(
  enEntry: E,
  deMap: Map<string, D>,
): string {
  const de = deMap.get(enEntry.id);
  return de?.data.urlSlug || enEntry.id;
}
