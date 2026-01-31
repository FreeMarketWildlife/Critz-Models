export const createEmptyCritter = () => ({
  id: '',
  name: '',
  description: '',
  species: '',
  role: '',
  habitat: '',
  rarity: 'common',
  modelPath: '',
  preview: {
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  },
  scale: 1,
  offset: { x: 0, y: 0, z: 0 },
  defaultAnimationId: '',
  stats: {
    health: 0,
    speed: 0,
    stamina: 0,
    bonus: '',
  },
  abilities: [],
  animations: [],
  tags: [],
  lore: '',
  notes: '',
});

export const normalizeCritter = (critter) => ({
  ...createEmptyCritter(),
  ...critter,
  preview: {
    ...createEmptyCritter().preview,
    ...(critter.preview || {}),
  },
  stats: {
    ...createEmptyCritter().stats,
    ...(critter.stats || {}),
  },
  abilities: Array.isArray(critter.abilities) ? critter.abilities : [],
  animations: Array.isArray(critter.animations) ? critter.animations : [],
  tags: Array.isArray(critter.tags) ? critter.tags : [],
});
