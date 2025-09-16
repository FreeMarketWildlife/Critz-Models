export const CATEGORY_IDS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  MELEE: 'melee',
  UTILITY: 'utility',
};

export const categories = [
  {
    id: CATEGORY_IDS.PRIMARY,
    label: 'Primary',
    description: 'Bows, rifles, and heavy ordnance built for frontline engagements.',
  },
  {
    id: CATEGORY_IDS.SECONDARY,
    label: 'Secondary',
    description: 'Sidearms, spell foci, and quick-draw implements that complement primaries.',
  },
  {
    id: CATEGORY_IDS.MELEE,
    label: 'Melee',
    description: 'Blades, hammers, and arcane implements for close-quarters dominance.',
  },
  {
    id: CATEGORY_IDS.UTILITY,
    label: 'Utility',
    description: 'Shields, traps, deployables, and support tools for tactical advantages.',
  },
];

export const DEFAULT_CATEGORY_ID = CATEGORY_IDS.PRIMARY;

export function getCategoryById(id) {
  return categories.find((category) => category.id === id) || null;
}
