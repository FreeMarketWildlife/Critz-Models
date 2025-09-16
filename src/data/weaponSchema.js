import { CATEGORY_IDS } from '../config/categories.js';

const baseStatDescriptors = [
  { key: 'damage', label: 'Damage', format: 'integer' },
  { key: 'fireRate', label: 'Fire Rate', format: 'rate' },
  { key: 'reloadSpeed', label: 'Reload Speed', format: 'seconds' },
  { key: 'chargeTime', label: 'Charge Time', format: 'seconds' },
  { key: 'drawTime', label: 'Draw Time', format: 'seconds' },
  { key: 'critChance', label: 'Critical Chance', format: 'percentage' },
  { key: 'critMultiplier', label: 'Critical Multiplier', format: 'multiplier' },
  { key: 'statusChance', label: 'Status Chance', format: 'percentage' },
  { key: 'range', label: 'Effective Range', format: 'integer', suffix: 'm' },
  { key: 'element', label: 'Element', format: 'string' },
];

const categorySpecificDescriptors = {
  [CATEGORY_IDS.PRIMARY]: [
    { key: 'magazineSize', label: 'Magazine Size', format: 'integer' },
    { key: 'ammoReserve', label: 'Reserve Ammo', format: 'integer' },
    { key: 'burstCount', label: 'Burst Count', format: 'integer' },
    { key: 'quiverSize', label: 'Quiver Capacity', format: 'integer' },
  ],
  [CATEGORY_IDS.SECONDARY]: [
    { key: 'magazineSize', label: 'Magazine Size', format: 'integer' },
    { key: 'reloadSpeed', label: 'Reload Speed', format: 'seconds' },
    { key: 'altFire', label: 'Alt Fire', format: 'string' },
  ],
  [CATEGORY_IDS.MELEE]: [
    { key: 'swingSpeed', label: 'Swing Speed', format: 'rate' },
    { key: 'comboMultiplier', label: 'Combo Multiplier', format: 'multiplier' },
    { key: 'impactForce', label: 'Impact Force', format: 'integer' },
    { key: 'blockEfficiency', label: 'Block Efficiency', format: 'percentage' },
  ],
  [CATEGORY_IDS.UTILITY]: [
    { key: 'capacity', label: 'Capacity', format: 'integer' },
    { key: 'deployTime', label: 'Deploy Time', format: 'seconds' },
    { key: 'duration', label: 'Duration', format: 'seconds' },
    { key: 'cooldown', label: 'Cooldown', format: 'seconds' },
  ],
};

const labelOverrides = {
  quiverSize: 'Quiver Capacity',
  ammoReserve: 'Reserve Ammo',
  fireRate: 'Fire Rate',
};

function toTitleCase(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (match) => match.toUpperCase())
    .replace(/\s(\w)/g, (match) => match.toUpperCase());
}

function mergeDescriptors(categoryId) {
  const descriptors = [...baseStatDescriptors];
  const categoryDescriptors = categorySpecificDescriptors[categoryId] || [];

  categoryDescriptors.forEach((descriptor) => {
    if (!descriptors.find((item) => item.key === descriptor.key)) {
      descriptors.push(descriptor);
    }
  });

  return descriptors;
}

export const weaponSchema = {
  base: baseStatDescriptors,
  categories: categorySpecificDescriptors,
};

export function buildWeaponStatDescriptors(weapon) {
  if (!weapon) return [];
  const descriptors = mergeDescriptors(weapon.core.category);
  const collected = [];
  const stats = weapon.stats || {};

  descriptors.forEach((descriptor) => {
    const value = stats[descriptor.key];
    if (value === undefined || value === null || value === '') return;
    const label = descriptor.label || labelOverrides[descriptor.key] || toTitleCase(descriptor.key);
    collected.push({
      key: descriptor.key,
      label,
      value,
      format: descriptor.format || 'string',
      suffix: descriptor.suffix,
    });
  });

  // Capture any custom stats not defined yet so designers can experiment freely.
  Object.entries(stats).forEach(([key, value]) => {
    if (collected.find((item) => item.key === key)) return;
    if (value === undefined || value === null || value === '') return;
    collected.push({
      key,
      label: labelOverrides[key] || toTitleCase(key),
      value,
      format: typeof value === 'number' ? 'integer' : 'string',
    });
  });

  return collected;
}

export function formatStatValue(value, descriptor) {
  if (value === undefined || value === null) return '—';
  const { format, suffix } = descriptor;

  switch (format) {
    case 'percentage': {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) return String(value);
      return `${(numeric * 100).toFixed(1).replace(/\.0$/, '')}%`;
    }
    case 'seconds': {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) return String(value);
      return `${numeric.toFixed(2).replace(/\.00$/, '')}s`;
    }
    case 'rate': {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) return String(value);
      return `${numeric.toFixed(2).replace(/\.00$/, '')}/s`;
    }
    case 'multiplier': {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) return String(value);
      return `${numeric.toFixed(2).replace(/\.00$/, '')}x`;
    }
    case 'integer': {
      if (typeof value === 'number') {
        return Math.round(value).toString();
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? String(value) : Math.round(parsed).toString();
    }
    default:
      break;
  }

  const suffixText = suffix || '';
  return `${value}${suffixText}`.trim();
}
