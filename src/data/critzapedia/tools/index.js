export const toolCategories = ['utility', 'support', 'traversal', 'gadget', 'consumable'];

export const createEmptyTool = () => ({
  id: '',
  name: '',
  category: toolCategories[0],
  rarity: 'common',
  description: '',
  modelPath: null,
  stats: {},
  effects: [],
  notes: '',
});

export const tools = [];
