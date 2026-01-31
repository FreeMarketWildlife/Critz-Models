export { weapons, weaponGlobals, sampleWeapons } from './entries.js';
export * from './schema.js';

export const weaponTemplate = {
  id: '',
  name: '',
  category: 'primary',
  rarity: 'common',
  description: '',
  modelPath: null,
  preview: {
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  },
  stats: {},
  special: {},
};
