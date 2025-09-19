export const WEAPON_CATEGORIES = ['primary', 'secondary', 'melee', 'utility'];

export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const STAT_LABELS = {
  damage: 'Damage',
  effect: 'Effect',
  restores: 'Restores',
  fireMode: 'Fire Mode',
  rpm: 'RPM',
  ammo: 'Ammo',
  ammoOverheat: 'Ammo/Overheat',
  overheat: 'Overheat',
  cooldown: 'Cooldown',
  reloadSpeed: 'Reload Speed',
  drawSpeed: 'Draw',
  range: 'Range',
  stamina: 'Stamina',
  ability: 'Ability',
  abilityCooldown: 'Ability Cooldown',
  deploy: 'Deploy',
  capacity: 'Capacity',
  info: 'Info',
};

export const DEFAULT_STATS_ORDER = [
  'damage',
  'effect',
  'restores',
  'fireMode',
  'rpm',
  'ammo',
  'ammoOverheat',
  'overheat',
  'cooldown',
  'reloadSpeed',
  'drawSpeed',
  'range',
  'stamina',
  'ability',
  'abilityCooldown',
  'deploy',
  'capacity',
  'info',
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
