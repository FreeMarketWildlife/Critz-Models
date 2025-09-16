import { getGroupsForCategory, getStatDescriptor } from '../data/weaponSchema.js';
import { getCurrentCategory, getCurrentWeapon } from '../state/weaponState.js';
import { eventBus } from '../utils/eventBus.js';

export function initializeWeaponDetail(container) {
  function render() {
    const category = getCurrentCategory();
    const weapon = getCurrentWeapon();

    if (!category || !weapon) {
      container.innerHTML = '<p class="weapon-detail__placeholder">Select a weapon to reveal its story and statistics.</p>';
      return;
    }

    const statGroups = getGroupsForCategory(category.id);
    const statsMarkup = statGroups
      .map((group) => {
        const groupContent = group.fields
          .map((fieldKey) => createStatCard(weapon, fieldKey))
          .filter(Boolean)
          .join('');

        if (!groupContent) {
          return '';
        }

        return `
          <section class="weapon-detail__group">
            <h4 class="weapon-detail__group-title">${group.label}</h4>
            <div class="weapon-detail__stats-grid">${groupContent}</div>
          </section>
        `;
      })
      .filter(Boolean)
      .join('');

    const traitsMarkup = Array.isArray(weapon.traits) && weapon.traits.length
      ? `
        <section class="weapon-detail__group weapon-detail__group--traits">
          <h4 class="weapon-detail__group-title">Traits</h4>
          <ul class="weapon-detail__traits">
            ${weapon.traits.map((trait) => `<li>${trait}</li>`).join('')}
          </ul>
        </section>
      `
      : '';

    const loreMarkup = weapon.metadata?.lore
      ? `
        <section class="weapon-detail__lore">
          <h4 class="weapon-detail__group-title">Lore</h4>
          <p>${weapon.metadata.lore}</p>
        </section>
      `
      : '';

    container.innerHTML = `
      <header class="weapon-detail__header">
        <div>
          <h3 class="weapon-detail__name">${weapon.name}</h3>
          ${weapon.role ? `<span class="weapon-detail__role">${weapon.role}</span>` : ''}
        </div>
        ${weapon.metadata?.rarity ? `<span class="weapon-detail__rarity">${weapon.metadata.rarity}</span>` : ''}
      </header>
      ${weapon.metadata?.tagline ? `<p class="weapon-detail__tagline">${weapon.metadata.tagline}</p>` : ''}
      <div class="weapon-detail__stats">${statsMarkup || '<p class="weapon-detail__placeholder">Stat schema missing for this weapon.</p>'}</div>
      ${traitsMarkup}
      ${loreMarkup}
    `;
  }

  eventBus.on('category:changed', render);
  eventBus.on('weapon:changed', render);
  render();
}

function createStatCard(weapon, fieldKey) {
  const descriptor = getStatDescriptor(fieldKey);
  if (!descriptor) {
    return '';
  }

  const rawValue = resolveStatValue(weapon, fieldKey);
  if (rawValue == null || rawValue === '') {
    return '';
  }

  const formattedValue = formatStatValue(descriptor, rawValue);
  return `
    <div class="weapon-detail__stat-card">
      <div class="weapon-detail__stat-label">${descriptor.label}</div>
      <div class="weapon-detail__stat-value">${formattedValue}</div>
      ${descriptor.description ? `<div class="weapon-detail__stat-hint">${descriptor.description}</div>` : ''}
    </div>
  `;
}

function resolveStatValue(weapon, fieldKey) {
  if (weapon.stats && weapon.stats[fieldKey] != null) {
    return weapon.stats[fieldKey];
  }

  if (weapon.metadata && weapon.metadata[fieldKey] != null) {
    return weapon.metadata[fieldKey];
  }

  return null;
}

function formatStatValue(descriptor, value) {
  if (value == null) {
    return '—';
  }

  const normalized = normalizeValue(value);

  switch (descriptor.format) {
    case 'percentage':
      return `${formatNumber(normalized, 1)}${descriptor.suffix ?? '%'}`;
    case 'seconds':
      return `${formatNumber(normalized, 2)}${descriptor.suffix ?? ' s'}`;
    case 'perSecond':
      return `${formatNumber(normalized, 2)}${descriptor.suffix ?? ' /s'}`;
    case 'multiplier':
      return `${formatNumber(normalized, 2)}${descriptor.suffix ?? 'x'}`;
    case 'integer':
      return `${Math.round(Number(normalized)).toLocaleString()}${descriptor.suffix ?? ''}`;
    case 'string':
      return `${normalized}`;
    default:
      return `${formatNumber(normalized, 2)}${descriptor.suffix ?? ''}`;
  }
}

function normalizeValue(value) {
  if (typeof value === 'object' && value !== null) {
    if (typeof value.display !== 'undefined') {
      return value.display;
    }
    if (typeof value.base !== 'undefined') {
      return value.base;
    }
  }
  return value;
}

function formatNumber(value, maximumFractionDigits = 2) {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    return value;
  }

  const options = {
    minimumFractionDigits: numberValue % 1 === 0 ? 0 : 1,
    maximumFractionDigits,
  };
  return numberValue.toLocaleString(undefined, options);
}
