export { tools, toolGlobals } from './entries.js';

export const TOOL_CATEGORIES = ['utility', 'support', 'gadget'];
export const TOOL_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const toolTemplate = {
  id: '',
  name: '',
  category: TOOL_CATEGORIES[0],
  rarity: TOOL_RARITIES[0],
  description: '',
  modelPath: null,
  stats: {},
  special: {},
};
