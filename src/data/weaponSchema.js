export const WEAPON_CATEGORIES = ['primary', 'secondary', 'melee', 'utility'];

export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const STAT_LABELS = {
  damage: 'Damage',
  fireRate: 'Fire Rate',
  attackSpeed: 'Attack Speed',
  reloadSpeed: 'Reload Speed',
  magazineSize: 'Magazine Size',
  capacity: 'Capacity',
  pouchCapacity: 'Pouch Capacity',
  projectileType: 'Projectile',
  projectileVelocity: 'Bolt Velocity',
  drawSpeed: 'Draw Speed',
  chargeTime: 'Charge Time',
  staminaCost: 'Stamina Cost',
  cooldown: 'Cooldown',
  range: 'Effective Range',
  splashRadius: 'Splash Radius',
  blastRadius: 'Blast Radius',
  burnDuration: 'Burn Duration',
  fuelCapacity: 'Fuel Capacity',
  heatCapacity: 'Heat Capacity',
  cooldownRate: 'Vent Rate',
  overheatPenalty: 'Overheat Downtime',
  scopeStability: 'Scope Stability',
  handling: 'Handling',
  weight: 'Weight (Speed Penalty)',
  quiverCapacity: 'Quiver Capacity',
  shieldStrength: 'Shield Strength',
  blockStrength: 'Block Strength',
  throwDamage: 'Throw Damage',
  abilityCooldown: 'Ability Cooldown',
  charges: 'Charges',
  fuseTime: 'Fuse Time',
  radius: 'Effect Radius',
  triggerRadius: 'Trigger Radius',
  paralyzeTime: 'Paralysis Duration',
  frictionModifier: 'Friction Modifier',
  resourceYield: 'Resource Yield',
  dropCount: 'Drops',
  knockbackForce: 'Knockback Force',
  duration: 'Duration',
};

export const DEFAULT_STATS_ORDER = [
  'damage',
  'fireRate',
  'attackSpeed',
  'staminaCost',
  'reloadSpeed',
  'magazineSize',
  'capacity',
  'pouchCapacity',
  'projectileType',
  'projectileVelocity',
  'drawSpeed',
  'chargeTime',
  'heatCapacity',
  'cooldownRate',
  'overheatPenalty',
  'fuelCapacity',
  'cooldown',
  'range',
  'splashRadius',
  'blastRadius',
  'burnDuration',
  'quiverCapacity',
  'abilityCooldown',
  'shieldStrength',
  'blockStrength',
  'throwDamage',
  'duration',
  'charges',
  'fuseTime',
  'radius',
  'triggerRadius',
  'paralyzeTime',
  'resourceYield',
  'dropCount',
  'knockbackForce',
  'frictionModifier',
  'weight',
  'handling',
  'scopeStability',
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
