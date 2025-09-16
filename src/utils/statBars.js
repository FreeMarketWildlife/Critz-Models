const ATTACK_SPEED_MAP = new Map(
  [
    ['very slow', 2],
    ['slow', 4],
    ['medium', 6],
    ['fast', 9],
    ['very fast', 12],
  ]
);

const clamp = (value, min = 0, max = 1) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const parseNumericValue = (input) => {
  if (typeof input === 'number') {
    return Number.isFinite(input) ? input : null;
  }

  if (typeof input !== 'string') {
    return null;
  }

  const sanitized = input.replace(/,/g, '');
  const match = sanitized.match(/-?\d*\.?\d+/);
  if (!match) {
    return null;
  }

  const parsed = parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseFireRateValue = (raw, { keyUsed }) => {
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }

  if (keyUsed === 'attackSpeed') {
    const mapped = ATTACK_SPEED_MAP.get(String(raw).trim().toLowerCase());
    return mapped ?? null;
  }

  return parseNumericValue(raw);
};

const formatDisplayValue = (raw) => {
  if (raw === null || raw === undefined || raw === '') {
    return '—';
  }

  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? String(raw) : '—';
  }

  return String(raw);
};

const pickStatSource = (weapon, keys) => {
  if (!weapon || !weapon.stats) {
    return { raw: null, keyUsed: null };
  }

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(weapon.stats, key)) continue;
    const value = weapon.stats[key];
    if (value !== null && value !== undefined && value !== '') {
      return { raw: value, keyUsed: key };
    }
  }

  return { raw: null, keyUsed: null };
};

const STAT_CONFIG = [
  {
    key: 'damage',
    label: 'Damage',
    pick: (weapon) => pickStatSource(weapon, ['damage']),
    parse: (raw) => parseNumericValue(raw),
  },
  {
    key: 'fireRate',
    label: 'Fire Rate',
    pick: (weapon) => pickStatSource(weapon, ['fireRate', 'attackSpeed']),
    parse: (raw, context) => parseFireRateValue(raw, context),
  },
  {
    key: 'ammo',
    label: 'Ammo',
    pick: (weapon) =>
      pickStatSource(weapon, [
        'magazineSize',
        'capacity',
        'quiverCapacity',
        'carryLimit',
        'heatCapacity',
      ]),
    parse: (raw) => parseNumericValue(raw),
  },
  {
    key: 'weight',
    label: 'Weight',
    pick: (weapon) => pickStatSource(weapon, ['weight']),
    parse: (raw) => parseNumericValue(raw),
  },
];

export const computeStatMeta = (weapons = []) => {
  const meta = {};

  if (!Array.isArray(weapons)) {
    return meta;
  }

  weapons.forEach((weapon) => {
    STAT_CONFIG.forEach((config) => {
      const { raw, keyUsed } = config.pick(weapon);
      if (raw === null || raw === undefined || raw === '') {
        return;
      }

      const numericValue = config.parse(raw, { weapon, keyUsed });
      if (numericValue === null || Number.isNaN(numericValue)) {
        return;
      }

      const currentMax = meta[config.key]?.max ?? 0;
      const nextMax = numericValue > currentMax ? numericValue : currentMax;
      meta[config.key] = { max: nextMax };
    });
  });

  return meta;
};

export const deriveWeaponStatBars = (weapon, meta = {}) =>
  STAT_CONFIG.map((config) => {
    const { raw, keyUsed } = config.pick(weapon);
    const hasValue = raw !== null && raw !== undefined && raw !== '';
    const numericValue = hasValue ? config.parse(raw, { weapon, keyUsed }) : null;

    const max = meta[config.key]?.max ?? null;
    const ratio =
      numericValue !== null && Number.isFinite(numericValue) && max && max > 0
        ? clamp(numericValue / max)
        : 0;
    const percentage = Math.round(ratio * 100);

    return {
      key: config.key,
      label: config.label,
      value: hasValue ? formatDisplayValue(raw) : '—',
      numericValue,
      ratio,
      percentage,
      hasValue,
    };
  });

export const STAT_BAR_KEYS = STAT_CONFIG.map((config) => config.key);
