import { deriveStatsList } from '../../data/weaponSchema.js';
import { applyKeywordTooltips, createTooltipMarkup } from '../../utils/keywordTooltips.js';

const buildAmmoTooltip = (value) => {
  const pair = parseStatPair(value);
  if (!pair) {
    return null;
  }

  const magazine = pluralize(pair.primary, 'round');
  const reserve = pluralize(pair.secondary, 'round');
  return `${magazine} per magazine; ${reserve} of extra ammo.`;
};

const buildOverheatTooltip = (value) => {
  const pair = parseStatPair(value);
  if (!pair) {
    return null;
  }

  return `Costs ${pair.primary} heat per shot; ${pair.secondary} maximum heat.`;
};

const parseStatPair = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();
  if (!text.includes('/')) {
    return null;
  }

  const [rawPrimary, rawSecondary] = text.split('/');
  if (rawSecondary === undefined) {
    return null;
  }

  const primary = rawPrimary.trim();
  const secondary = rawSecondary.trim();

  if (!primary || !secondary) {
    return null;
  }

  return { primary, secondary };
};

const pluralize = (value, singular, plural = `${singular}s`) => {
  const numericValue = Number(value);
  const useSingular = Number.isFinite(numericValue) ? Math.abs(numericValue) === 1 : false;
  return `${value} ${useSingular ? singular : plural}`;
};

const STAT_TOOLTIP_BUILDERS = {
  ammo: (value) => buildAmmoTooltip(value),
  ammoOverheat: (value) => buildOverheatTooltip(value),
  overheat: (value) => buildOverheatTooltip(value),
  drawSpeed: () => 'How fast this weapon or tool can be used after switching to it.',
};

const RARITY_TITLES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

const buildStatsMarkup = (weapon, decorate = (value) => value) => {
  if (!weapon) {
    return '';
  }

  const stats = deriveStatsList(weapon);
  if (!stats.length) {
    return '';
  }

  const rows = stats
    .map(({ key, label, value }) => `<dt>${decorate(label)}</dt><dd>${buildStatValueMarkup({ key, value, decorate })}</dd>`)
    .join('');

  return `<dl class="stat-list">${rows}</dl>`;
};

const buildSpecialMarkup = (weapon, prettify, decorate = (value) => value) => {
  const entries = Object.entries(weapon.special || {}).filter(([, value]) =>
    value !== null && value !== undefined && value !== ''
  );

  if (!entries.length) {
    return '';
  }

  const items = entries
    .map(
      ([key, value]) =>
        `<li><span class="special-key">${decorate(prettify(key))}:</span> ${decorate(value)}</li>`
    )
    .join('');

  return `
    <div class="special-section">
      <h4>Special Properties</h4>
      <ul class="special-list">${items}</ul>
    </div>
  `;
};

const buildStatValueMarkup = ({ key, value, decorate }) => {
  const decoratedValue = decorate(value);
  const tooltipBuilder = STAT_TOOLTIP_BUILDERS[key];

  if (!tooltipBuilder) {
    return decoratedValue;
  }

  const tooltipDescription = tooltipBuilder(value);
  if (!tooltipDescription) {
    return decoratedValue;
  }

  return createTooltipMarkup(decoratedValue, tooltipDescription);
};

export class WeaponDetailPanel {
  constructor({ panelElement, rarityBadge, footerElement, titleElement }) {
    this.panelElement = panelElement;
    this.contentElement = panelElement.querySelector('[data-role="detail-content"]');
    this.rarityBadge = rarityBadge;
    this.footerElement = footerElement;
    this.titleElement = titleElement;
  }

  renderWeapon(weapon) {
    if (!weapon) {
      this.renderEmpty();
      return;
    }

    this.panelElement.classList.remove('is-empty');
    this.setTitle('Equipment Info');
    this.renderHeader(weapon);
    this.renderContent(weapon);
  }

  renderHeader(weapon) {
    if (!this.rarityBadge) return;
    const rarity = weapon.rarity || 'common';
    const label = RARITY_TITLES[rarity] || rarity;
    this.rarityBadge.textContent = label;
    this.rarityBadge.className = '';
    this.rarityBadge.classList.add('rarity-badge', `rarity-${rarity}`);
  }

  renderContent(weapon) {
    const decorate = (value) => applyKeywordTooltips(value);
    const statsMarkup = buildStatsMarkup(weapon, decorate);
    const specialMarkup = buildSpecialMarkup(weapon, (value) => this.prettify(value), decorate);

    this.contentElement.innerHTML = `
      <h3>${weapon.name}</h3>
      <p class="description">${decorate(weapon.description)}</p>
      ${statsMarkup}
      ${specialMarkup}
    `;

    if (this.footerElement) {
      this.footerElement.textContent = `Catalog ID: ${weapon.id}`;
    }
  }

  renderEmpty() {
    if (this.contentElement) {
      this.contentElement.innerHTML =
        '<p class="description">Select a catalog entry to see its details.</p>';
    }

    if (this.rarityBadge) {
      this.rarityBadge.textContent = '';
      this.rarityBadge.className = 'rarity-badge';
    }

    if (this.footerElement) {
      this.footerElement.textContent = 'Awaiting selection';
    }

    this.panelElement.classList.add('is-empty');
    this.setTitle('Library Info');
  }

  renderPlaceholder(title, message = 'Info coming soon.') {
    this.panelElement.classList.remove('is-empty');
    this.setTitle('Library Info');

    if (this.contentElement) {
      this.contentElement.innerHTML = `
        <h3>${title}</h3>
        <p class="description">${message}</p>
      `;
    }

    if (this.rarityBadge) {
      this.rarityBadge.textContent = '';
      this.rarityBadge.className = 'rarity-badge';
    }

    if (this.footerElement) {
      this.footerElement.textContent = 'No details available yet.';
    }
  }

  setTitle(title) {
    if (this.titleElement) {
      this.titleElement.textContent = title;
    }
  }

  prettify(value) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
  }
}
