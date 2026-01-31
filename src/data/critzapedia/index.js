import { critters } from './critters/catalog.js';
import { sampleWeapons, weaponGlobals } from './weapons/catalog.js';
import { tools } from './tools/catalog.js';

export { critters } from './critters/catalog.js';
export { createEmptyCritter, normalizeCritter } from './critters/schema.js';
export { sampleWeapons, weaponGlobals } from './weapons/catalog.js';
export { createEmptyWeapon, normalizeWeapon } from '../weaponSchema.js';
export { tools } from './tools/catalog.js';
export { createEmptyTool, normalizeTool, TOOL_CATEGORIES } from './tools/schema.js';

export const critzapedia = {
  critters,
  weapons: sampleWeapons,
  weaponGlobals,
  tools,
};
