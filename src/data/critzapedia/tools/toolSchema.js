export const TOOL_CATEGORIES = ['utility', 'support', 'movement', 'trap'];

export const TOOL_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const createEmptyTool = () => ({
  id: '',
  name: '',
  category: TOOL_CATEGORIES[0],
  rarity: TOOL_RARITIES[0],
  description: '',
  modelPath: null,
  stats: {},
  special: {},
});

export const normalizeTool = (tool) => ({
  ...createEmptyTool(),
  ...tool,
  stats: {
    ...(tool.stats || {}),
  },
  special: {
    ...(tool.special || {}),
  },
});
