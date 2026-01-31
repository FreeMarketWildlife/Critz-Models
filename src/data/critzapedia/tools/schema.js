export const TOOL_CATEGORIES = ['utility', 'crafting', 'movement', 'support', 'misc'];

export const createEmptyTool = () => ({
  id: '',
  name: '',
  category: TOOL_CATEGORIES[0],
  rarity: 'common',
  description: '',
  usage: '',
  modelPath: '',
  iconPath: '',
  stats: {},
  requirements: [],
  crafting: {},
  tags: [],
  lore: '',
  notes: '',
});

export const normalizeTool = (tool) => ({
  ...createEmptyTool(),
  ...tool,
  stats: {
    ...(tool.stats || {}),
  },
  requirements: Array.isArray(tool.requirements) ? tool.requirements : [],
  tags: Array.isArray(tool.tags) ? tool.tags : [],
});
