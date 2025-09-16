const ATTACK_SPEED_SCALE = {
  'very slow': 1.6,
  slow: 2.4,
  medium: 3.4,
  fast: 4.6,
  'very fast': 5.6,
};

const AMMO_PREFERENCE_ORDER = [
  'magazineSize',
  'quiverCapacity',
  'capacity',
  'heatCapacity',
  'carryLimit',
  'ammoRestock',
];

const STAT_BAR_CONFIG = [
  {
    key: 'damage',
    label: 'Damage',
    resolve: (weapon) => weapon?.stats?.damage ?? null,
  },
  {
    key: 'fireRate',
    label: 'Fire Rate',
    resolve: (weapon) => {
      const stats = weapon?.stats ?? {};
      if (hasValue(stats.fireRate)) {
        return stats.fireRate;
      }

      if (hasValue(stats.attackSpeed)) {
        const descriptor = String(stats.attackSpeed).trim();
        const normalized = descriptor.toLowerCase();
        const numericValue = ATTACK_SPEED_SCALE[normalized] ?? null;
        return {
          displayValue: descriptor,
          numericValue,
        };
      }

      return null;
    },
  },
  {
    key: 'ammo',
    label: 'Ammo',
    resolve: (weapon) => {
      const stats = weapon?.stats ?? {};
      for (const key of AMMO_PREFERENCE_ORDER) {
        if (hasValue(stats[key])) {
          return stats[key];
        }
      }
      return null;
    },
  },
  {
    key: 'weight',
    label: 'Weight',
    resolve: (weapon) => weapon?.stats?.weight ?? null,
  },
];

const hasValue = (value) => value !== null && value !== undefined && value !== '';

const toNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const match = value.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? Number.parseFloat(match[0]) : null;
  }

  return null;
};

const formatDisplayValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : '—';
  }

  return String(value);
};

const normalizeStatEntry = (resolved) => {
  if (resolved && typeof resolved === 'object' && !Array.isArray(resolved)) {
    const numericValue =
      typeof resolved.numericValue === 'number' && Number.isFinite(resolved.numericValue)
        ? resolved.numericValue
        : toNumber(resolved.value ?? resolved.displayValue ?? null);

    const displayValue = formatDisplayValue(
      resolved.displayValue ?? resolved.value ?? resolved.numericValue ?? null
    );

    return {
      displayValue,
      numericValue,
      hasValue: hasValue(resolved.value ?? resolved.displayValue ?? resolved.numericValue),
    };
  }

  const numericValue = toNumber(resolved);
  return {
    displayValue: formatDisplayValue(resolved),
    numericValue,
    hasValue: hasValue(resolved),
  };
};

export const createWeaponStatProfile = (weapon) =>
  STAT_BAR_CONFIG.map(({ key, label, resolve }) => {
    const entry = normalizeStatEntry(resolve(weapon));
    const hasNumeric = typeof entry.numericValue === 'number' && Number.isFinite(entry.numericValue);

    return {
      key,
      label,
      displayValue: entry.displayValue,
      numericValue: hasNumeric ? entry.numericValue : null,
      hasValue: entry.hasValue,
    };
  });

export const buildWeaponStatContext = (weapons = []) => {
  const profiles = new Map();
  const maxValues = STAT_BAR_CONFIG.reduce((acc, { key }) => {
    acc[key] = 0;
    return acc;
  }, {});

  weapons.forEach((weapon) => {
    const profile = createWeaponStatProfile(weapon);
    profiles.set(weapon.id, profile);

    profile.forEach(({ key, numericValue }) => {
      if (typeof numericValue === 'number' && Number.isFinite(numericValue)) {
        maxValues[key] = Math.max(maxValues[key], numericValue);
      }
    });
  });

  return { profiles, maxValues };
};

export const calculateStatPercent = (value, max) => {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    typeof max !== 'number' ||
    !Number.isFinite(max) ||
    max <= 0
  ) {
    return 0;
  }

  const ratio = value / max;
  return Math.max(0, Math.min(100, ratio * 100));
};

export const STAT_BAR_KEYS = STAT_BAR_CONFIG.map(({ key }) => key);

