const BAR_DEFINITIONS = [
  {
    key: 'damage',
    label: 'Damage',
    extractor: (stats) => stats.damage,
  },
  {
    key: 'fireRate',
    label: 'Fire Rate',
    extractor: (stats) => stats.fireRate,
  },
  {
    key: 'ammo',
    label: 'Ammo',
    extractor: (stats) => {
      const ammoKeys = ['magazineSize', 'capacity', 'quiverCapacity', 'ammoRestock', 'carryLimit'];
      for (const key of ammoKeys) {
        if (isPresent(stats[key])) {
          return stats[key];
        }
      }
      return null;
    },
  },
  {
    key: 'weight',
    label: 'Weight',
    extractor: (stats) => stats.weight,
  },
];

const isPresent = (value) => value !== null && value !== undefined && value !== '';

const normalizeStatValue = (rawValue) => {
  if (!isPresent(rawValue)) {
    return {
      numericValue: 0,
      displayValue: 'N/A',
      hasValue: false,
    };
  }

  if (typeof rawValue === 'number') {
    return {
      numericValue: rawValue,
      displayValue: String(rawValue),
      hasValue: true,
    };
  }

  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    const numberMatch = trimmed.match(/-?\d+(?:\.\d+)?/);
    const numericValue = numberMatch ? parseFloat(numberMatch[0]) : 0;
    return {
      numericValue: Number.isNaN(numericValue) ? 0 : numericValue,
      displayValue: trimmed,
      hasValue: true,
    };
  }

  return {
    numericValue: 0,
    displayValue: 'N/A',
    hasValue: false,
  };
};

const extractStatEntries = (weapon = {}) => {
  const stats = weapon.stats || {};
  return BAR_DEFINITIONS.map((definition) => {
    const rawValue = definition.extractor(stats);
    const normalized = normalizeStatValue(rawValue);
    return {
      key: definition.key,
      label: definition.label,
      numericValue: normalized.numericValue,
      displayValue: normalized.displayValue,
      hasValue: normalized.hasValue,
    };
  });
};

export const createStatBarNormalizer = (weapons = []) => {
  const maxima = new Map(BAR_DEFINITIONS.map((definition) => [definition.key, 0]));
  const cache = new Map();

  const updateMaxima = (entries) => {
    entries.forEach((entry) => {
      const current = maxima.get(entry.key) || 0;
      if (entry.numericValue > current) {
        maxima.set(entry.key, entry.numericValue);
      }
    });
  };

  const registerWeapon = (weapon) => {
    if (!weapon) return [];
    const entries = extractStatEntries(weapon);
    cache.set(weapon.id, entries);
    updateMaxima(entries);
    return entries;
  };

  weapons.forEach(registerWeapon);

  const getStats = (weapon) => {
    if (!weapon) {
      return [];
    }
    const entries = cache.get(weapon.id) || registerWeapon(weapon);

    return entries.map((entry) => {
      const max = maxima.get(entry.key) || 0;
      const safeMax = max > 0 ? max : 1;
      const ratio = entry.hasValue ? entry.numericValue / safeMax : 0;
      const percentage = Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
      return {
        ...entry,
        percentage,
      };
    });
  };

  return {
    getStats,
  };
};

export const BAR_STAT_KEYS = BAR_DEFINITIONS.map((definition) => definition.key);
