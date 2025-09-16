export const WEAPON_CATEGORIES = ['primary', 'secondary', 'melee', 'utility'];

export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const STAT_LABELS = {
  damage: 'Damage',
  directDamage: 'Direct Damage',
  impactDamage: 'Impact Damage',
  splashDamage: 'Splash Damage',
  damagePerSecond: 'Damage / Second',
  fireRate: 'Fire Rate',
  attackSpeed: 'Attack Speed',
  staminaCost: 'Stamina Cost',
  drawSpeed: 'Draw Speed',
  chargeTime: 'Charge Time',
  heatPerShot: 'Heat / Shot',
  overheatThreshold: 'Overheat Threshold',
  heatDissipation: 'Heat Dissipation',
  overheatCooldown: 'Overheat Cooldown',
  reloadSpeed: 'Reload Speed',
  magazineSize: 'Magazine Size',
  capacity: 'Reserve',
  quiverCapacity: 'Quiver Capacity',
  fuelCapacity: 'Fuel Capacity',
  carryLimit: 'Carry Limit',
  ammoRestored: 'Ammo Restored',
  healAmount: 'Healing',
  projectileType: 'Projectile',
  projectileVelocity: 'Bolt Speed',
  scopeZoom: 'Scope Zoom',
  range: 'Effective Range',
  blastRadius: 'Blast Radius',
  effectRadius: 'Effect Radius',
  poolRadius: 'Pool Radius',
  fieldRadius: 'Field Radius',
  triggerRadius: 'Trigger Radius',
  fuseTime: 'Fuse Time',
  deployTime: 'Deploy Time',
  armingTime: 'Arming Time',
  cooldown: 'Cooldown',
  igniteDuration: 'Ignite Duration',
  duration: 'Duration',
  paralyzeDuration: 'Paralyze Duration',
  frictionModifier: 'Friction Modifier',
  pushForce: 'Push Force',
  glideSpeed: 'Glide Speed',
  guardStrength: 'Guard Strength',
  shieldStrength: 'Shield Strength',
  reach: 'Reach',
  weight: 'Speed Penalty',
};

export const DEFAULT_STATS_ORDER = [
  'damage',
  'directDamage',
  'impactDamage',
  'splashDamage',
  'damagePerSecond',
  'fireRate',
  'attackSpeed',
  'staminaCost',
  'drawSpeed',
  'chargeTime',
  'heatPerShot',
  'overheatThreshold',
  'heatDissipation',
  'overheatCooldown',
  'reloadSpeed',
  'magazineSize',
  'capacity',
  'quiverCapacity',
  'fuelCapacity',
  'carryLimit',
  'ammoRestored',
  'healAmount',
  'cooldown',
  'fuseTime',
  'deployTime',
  'armingTime',
  'range',
  'projectileVelocity',
  'scopeZoom',
  'projectileType',
  'blastRadius',
  'effectRadius',
  'poolRadius',
  'fieldRadius',
  'triggerRadius',
  'igniteDuration',
  'duration',
  'paralyzeDuration',
  'frictionModifier',
  'pushForce',
  'glideSpeed',
  'reach',
  'guardStrength',
  'shieldStrength',
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
