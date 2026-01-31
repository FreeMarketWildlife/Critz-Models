import { normalizeTool } from './toolSchema.js';

const RAW_GLOBALS = {
  capacity_units: 'slots',
  time_unit: 's',
};

const RAW_TOOLS = [
  {
    name: 'Placeholder Tool',
    category: 'utility',
    rarity: 'common',
    description: 'Replace this with real Critzapedia tool entries.',
    stats: {
      cooldown: '1s',
      capacity: '1',
    },
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const sampleTools = RAW_TOOLS.map((tool) =>
  normalizeTool({
    id: slugify(tool.name),
    name: tool.name,
    category: tool.category,
    rarity: tool.rarity,
    description: tool.description,
    modelPath: tool.modelPath ?? null,
    stats: tool.stats,
    special: tool.special,
  })
);

export const toolGlobals = RAW_GLOBALS;
