export const createEmptyCritter = () => ({
  id: '',
  name: '',
  modelPath: '',
  scale: 1,
  offset: { x: 0, y: 0, z: 0 },
  defaultAnimationId: '',
  stats: {},
  animations: [],
});

export const normalizeCritter = (critter) => ({
  ...createEmptyCritter(),
  ...critter,
  offset: {
    ...createEmptyCritter().offset,
    ...(critter.offset || {}),
  },
  stats: {
    ...(critter.stats || {}),
  },
  animations: Array.isArray(critter.animations) ? critter.animations : [],
});
