export const WEAPON_CATEGORIES = ['primary', 'secondary', 'melee', 'utility'];

export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const STAT_LABELS = {
  damage: 'Damage',
  headshotDamage: 'Headshot Damage',
  splashDamage: 'Splash Damage',
  dotDamage: 'Damage over Time',
  dps: 'Damage per Second',
  fireRate: 'Fire Rate',
  ttkBody: 'Time to Kill (Body)',
  reloadSpeed: 'Reload Speed',
  magazineSize: 'Magazine Size',
  capacity: 'Capacity',
  projectileType: 'Projectile',
  projectileVelocity: 'Projectile Velocity',
  drawSpeed: 'Draw Speed',
  chargeTime: 'Charge Time',
  heatCapacity: 'Heat Capacity',
  heatDissipation: 'Heat Dissipation',
  staminaCost: 'Stamina Cost',
  cooldown: 'Cooldown',
  range: 'Effective Range',
  quiverCapacity: 'Quiver Capacity',
  shieldStrength: 'Shield Strength',
  attackSpeed: 'Attack Speed',
  abilityCooldown: 'Ability Cooldown',
  aoeRadius: 'Blast Radius',
  igniteDuration: 'Ignite Duration',
  igniteDps: 'Ignite DPS',
  statusEffect: 'Status Effect',
  effectDuration: 'Effect Duration',
  weight: 'Weight Penalty',
  staminaDrain: 'Stamina Drain',
  burstCount: 'Burst Count',
  carryLimit: 'Carry Limit',
  deployTime: 'Deploy Time',
  fuseTime: 'Fuse Time',
  armTime: 'Arm Time',
  poolDuration: 'Pool Duration',
  poolRadius: 'Pool Radius',
  duration: 'Duration',
  stunDuration: 'Stun Duration',
  shotsToKillBody: 'Shots to Kill (Body)',
  healAmount: 'Heal Amount',
  ammoRestock: 'Ammo Restock',
  glideSpeed: 'Glide Speed',
  frictionModifier: 'Friction Modifier',
  pushForce: 'Push Distance',
};

export const DEFAULT_STATS_ORDER = [
  'damage',
  'headshotDamage',
  'splashDamage',
  'dotDamage',
  'dps',
  'fireRate',
  'ttkBody',
  'shotsToKillBody',
  'statusEffect',
  'effectDuration',
  'drawSpeed',
  'chargeTime',
  'reloadSpeed',
  'heatCapacity',
  'heatDissipation',
  'magazineSize',
  'capacity',
  'quiverCapacity',
  'projectileType',
  'projectileVelocity',
  'staminaCost',
  'range',
  'aoeRadius',
  'igniteDps',
  'igniteDuration',
  'attackSpeed',
  'abilityCooldown',
  'weight',
  'staminaDrain',
  'burstCount',
  'carryLimit',
  'deployTime',
  'fuseTime',
  'armTime',
  'poolDuration',
  'poolRadius',
  'duration',
  'stunDuration',
  'healAmount',
  'ammoRestock',
  'glideSpeed',
  'frictionModifier',
  'pushForce',
  'shieldStrength',
  'cooldown',
];

export const createEmptyWeapon = () => ({
  id: '',
  name: '',
  category: WEAPON_CATEGORIES[0],
  rarity: RARITIES[0],
  description: '',
  modelPath: null,
  placeholderModelId: null,
  preview: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: null,
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
    rotation: {
      ...createEmptyWeapon().preview.rotation,
      ...(weapon.preview?.rotation || {}),
    },
    position: {
      ...createEmptyWeapon().preview.position,
      ...(weapon.preview?.position || {}),
    },
    scale:
      typeof weapon.preview?.scale === 'number' || typeof weapon.preview?.scale === 'object'
        ? weapon.preview.scale
        : createEmptyWeapon().preview.scale,
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
