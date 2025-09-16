export const WEAPON_CATEGORIES = ['primary', 'secondary', 'melee', 'utility'];

export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const STAT_LABELS = {
  damage: 'Damage',
  tickDamage: 'Tick Damage',
  fireRate: 'Fire Rate',
  reloadSpeed: 'Reload Speed',
  magazineSize: 'Magazine Size',
  capacity: 'Capacity',
  heatCapacity: 'Heat Capacity',
  heatDissipation: 'Heat Dissipation',
  projectileType: 'Projectile',
  drawSpeed: 'Draw Speed',
  chargeTime: 'Charge Time',
  staminaCost: 'Stamina Cost',
  cooldown: 'Cooldown',
  range: 'Effective Range',
  blastRadius: 'Blast Radius',
  splashRadius: 'Splash Radius',
  quiverCapacity: 'Quiver Capacity',
  coneLength: 'Cone Length',
  coneWidth: 'Cone Width',
  shieldStrength: 'Shield Strength',
  attackSpeed: 'Attack Speed',
  duration: 'Duration',
  effectRadius: 'Effect Radius',
  effectDuration: 'Effect Duration',
  burnDuration: 'Burn Duration',
  fuseTime: 'Fuse Time',
  armTime: 'Arm Time',
  weight: 'Weight Penalty',
  staggerForce: 'Stagger Force',
  ammoRestored: 'Ammo Restored',
  healAmount: 'Healing',
  deployTime: 'Deploy Time',
  slowAmount: 'Friction Shift',
  knockback: 'Knockback',
};

export const DEFAULT_STATS_ORDER = [
  'damage',
  'tickDamage',
  'fireRate',
  'reloadSpeed',
  'magazineSize',
  'capacity',
  'heatCapacity',
  'heatDissipation',
  'projectileType',
  'drawSpeed',
  'chargeTime',
  'staminaCost',
  'attackSpeed',
  'cooldown',
  'range',
  'blastRadius',
  'splashRadius',
  'quiverCapacity',
  'coneLength',
  'coneWidth',
  'shieldStrength',
  'duration',
  'effectRadius',
  'effectDuration',
  'burnDuration',
  'fuseTime',
  'armTime',
  'staggerForce',
  'ammoRestored',
  'healAmount',
  'deployTime',
  'slowAmount',
  'knockback',
  'weight',
];

export const createEmptyWeapon = () => ({
  id: '',
  name: '',
  category: WEAPON_CATEGORIES[0],
  rarity: RARITIES[0],
  description: '',
  modelPath: null,
  preview: {
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  },
  stats: {},
  special: {},
});

export const normalizeWeapon = (weapon) => ({
  ...createEmptyWeapon(),
  ...weapon,
  preview: {
    ...createEmptyWeapon().preview,
    ...(weapon.preview || {}),
  },
  stats: {
    ...(weapon.stats || {}),
  },
  special: {
    ...(weapon.special || {}),
  },
});

export const deriveStatsList = (weapon) => {
  const normalized = normalizeWeapon(weapon);
  const entries = Object.entries(normalized.stats).filter(([, value]) =>
    value !== null && value !== undefined && value !== ''
  );

  entries.sort((a, b) => {
    const indexA = DEFAULT_STATS_ORDER.indexOf(a[0]);
    const indexB = DEFAULT_STATS_ORDER.indexOf(b[0]);
    const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
    return safeA - safeB;
  });

  return entries.map(([key, value]) => ({
    key,
    label: STAT_LABELS[key] || prettify(key),
    value,
  }));
};

const prettify = (key) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/^\w/, (char) => char.toUpperCase());
