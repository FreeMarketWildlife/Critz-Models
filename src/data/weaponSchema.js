const STAT_DESCRIPTORS = {
  damage: {
    label: 'Damage',
    description: 'Base damage delivered with a single attack.',
    format: 'number',
  },
  impact: {
    label: 'Impact',
    description: 'Stagger potential against armored foes.',
    format: 'integer',
  },
  utilityEffect: {
    label: 'Utility Effect',
    description: 'Primary effect delivered when activated.',
    format: 'string',
  },
  fireRate: {
    label: 'Fire Rate',
    description: 'Attacks per second in sustained fire.',
    format: 'perSecond',
    suffix: ' /s',
  },
  burstCount: {
    label: 'Burst Count',
    description: 'Shots released per burst trigger pull.',
    format: 'integer',
  },
  projectileCount: {
    label: 'Projectile Count',
    description: 'Number of projectiles created per attack.',
    format: 'integer',
  },
  chargeTime: {
    label: 'Charge Time',
    description: 'Time required to charge before release.',
    format: 'seconds',
  },
  swingSpeed: {
    label: 'Swing Speed',
    description: 'Number of melee swings per second.',
    format: 'perSecond',
    suffix: ' /s',
  },
  cooldown: {
    label: 'Cooldown',
    description: 'Recharge time before the utility can be reused.',
    format: 'seconds',
  },
  duration: {
    label: 'Duration',
    description: 'How long the effect persists once activated.',
    format: 'seconds',
  },
  magazineSize: {
    label: 'Magazine Size',
    description: 'Rounds loaded before reload is required.',
    format: 'integer',
  },
  quiverCapacity: {
    label: 'Quiver Capacity',
    description: 'Arrows or bolts stored in a single quiver.',
    format: 'integer',
  },
  ammoCapacity: {
    label: 'Reserve Capacity',
    description: 'Total ammunition carried in reserve.',
    format: 'integer',
  },
  capacity: {
    label: 'Charge Capacity',
    description: 'Total number of uses stored in the device.',
    format: 'integer',
  },
  reloadSpeed: {
    label: 'Reload Speed',
    description: 'Time required to replenish the magazine or focus energy.',
    format: 'seconds',
  },
  drawStrength: {
    label: 'Draw Strength',
    description: 'Force needed to fully draw the bowstring.',
    format: 'integer',
    suffix: ' lbs',
  },
  range: {
    label: 'Effective Range',
    description: 'Optimal distance for peak effectiveness.',
    format: 'integer',
    suffix: ' m',
  },
  stability: {
    label: 'Stability',
    description: 'Resistance to recoil or casting flux.',
    format: 'percentage',
  },
  criticalChance: {
    label: 'Critical Chance',
    description: 'Likelihood of delivering amplified damage.',
    format: 'percentage',
  },
  criticalMultiplier: {
    label: 'Critical Multiplier',
    description: 'Bonus damage applied on a critical hit.',
    format: 'multiplier',
  },
  elementalType: {
    label: 'Elemental Imprint',
    description: 'Arcane element infused within the weapon.',
    format: 'string',
  },
  effectRadius: {
    label: 'Effect Radius',
    description: 'Area influenced when the utility detonates.',
    format: 'integer',
    suffix: ' m',
  },
  statusEffect: {
    label: 'Status Effect',
    description: 'Lingering effect applied to targets.',
    format: 'string',
  },
};

const STAT_GROUPS = [
  {
    id: 'core',
    label: 'Core Profile',
    fields: ['damage', 'impact', 'utilityEffect'],
  },
  {
    id: 'firing',
    label: 'Rhythm & Flow',
    fields: ['fireRate', 'burstCount', 'projectileCount', 'chargeTime', 'swingSpeed', 'cooldown', 'duration'],
  },
  {
    id: 'ammunition',
    label: 'Ammunition & Reserves',
    fields: ['magazineSize', 'quiverCapacity', 'ammoCapacity', 'capacity', 'reloadSpeed', 'drawStrength'],
  },
  {
    id: 'handling',
    label: 'Handling & Precision',
    fields: ['range', 'stability', 'criticalChance', 'criticalMultiplier'],
  },
  {
    id: 'affinity',
    label: 'Arcane Affinity',
    fields: ['elementalType', 'statusEffect', 'effectRadius'],
  },
];

const CATEGORY_GROUP_ORDER = {
  primary: ['core', 'firing', 'ammunition', 'handling', 'affinity'],
  secondary: ['core', 'firing', 'ammunition', 'handling', 'affinity'],
  melee: ['core', 'firing', 'handling', 'affinity'],
  utility: ['core', 'firing', 'ammunition', 'affinity'],
  default: ['core', 'firing', 'ammunition', 'handling', 'affinity'],
};

export function getStatDescriptor(fieldKey) {
  return STAT_DESCRIPTORS[fieldKey];
}

export function getGroupsForCategory(categoryId) {
  const order = CATEGORY_GROUP_ORDER[categoryId] ?? CATEGORY_GROUP_ORDER.default;
  return order
    .map((groupId) => {
      const group = STAT_GROUPS.find((entry) => entry.id === groupId);
      if (!group) {
        return null;
      }
      return {
        id: group.id,
        label: group.label,
        fields: [...group.fields],
      };
    })
    .filter(Boolean);
}

export const schema = {
  descriptors: STAT_DESCRIPTORS,
  groups: STAT_GROUPS,
  categoryOrder: CATEGORY_GROUP_ORDER,
};
