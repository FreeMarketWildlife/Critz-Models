import { deriveStatsList } from '../../data/weaponSchema.js';
import {
  getPassiveAbility,
  getCritterPassiveId,
} from '../../data/critzapedia/passives/catalog.js';
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
  extinct: 'Extinct',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
  mythical: 'Mythical',
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

const formatCritterStat = (value) => (value === null || value === undefined || value === '' ? '--' : value);

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildCritterPassiveMarkup = (passive) => {
  return `
    <dl class="critter-detail__passive">
      <div>
      <dt>Passive</dt>
      <dd>${
        passive
          ? createTooltipMarkup(escapeHtml(passive.name), passive.effect)
          : formatCritterStat('')
      }</dd>
      </div>
    </dl>
  `;
};

export class WeaponDetailPanel {
  constructor({ panelElement, rarityBadge, footerElement, bus = null }) {
    this.panelElement = panelElement;
    this.inspectorElement = panelElement.closest('[data-component="inspector"]');
    this.contentElement = panelElement.querySelector('[data-role="detail-content"]');
    this.rarityBadge = rarityBadge;
    this.footerElement = footerElement;
    this.bus = bus;
    this.customClassName = null;
  }

  render(weapon) {
    if (!weapon) {
      this.renderEmpty();
      return;
    }

    this.clearCustomState();
    this.panelElement.classList.remove('is-empty');
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

  renderCritter(critter) {
    if (!critter) {
      this.renderEmpty();
      return;
    }

    this.clearCustomState();
    this.panelElement.classList.remove('is-empty');
    this.panelElement.classList.add('panel--critter-intel');
    this.inspectorElement?.classList.add('inspector--critter-intel');
    this.customClassName = 'panel--critter-intel';

    const stats = critter.stats ?? {};
    const rarity = critter.rarity || 'common';
    const rarityLabel = RARITY_TITLES[rarity] || this.prettify(rarity);
    const passive = getPassiveAbility(getCritterPassiveId(critter));
    const passiveMarkup = buildCritterPassiveMarkup(passive);

    if (this.rarityBadge) {
      this.rarityBadge.textContent = '';
      this.rarityBadge.className = 'rarity-badge';
    }

    if (this.contentElement) {
      this.contentElement.innerHTML = `
        <article class="critter-detail">
          <header class="critter-detail__headline">
            <h3>${escapeHtml(critter.name || 'Critter')}</h3>
            <span class="rarity-badge rarity-${escapeHtml(rarity)} critter-detail__rarity">${escapeHtml(rarityLabel)}</span>
          </header>
          <dl class="critter-detail__stats">
            <div><dt>Health</dt><dd>${formatCritterStat(stats.health)}</dd></div>
            <div><dt>Speed</dt><dd>${formatCritterStat(stats.speed)}</dd></div>
            <div><dt>Stamina</dt><dd>${formatCritterStat(stats.stamina)}</dd></div>
          </dl>
          ${passiveMarkup}
        </article>
      `;
    }

    if (this.footerElement) {
      this.footerElement.textContent = '';
    }
  }

  renderEmpty() {
    this.clearCustomState();
    if (this.contentElement) {
      this.contentElement.innerHTML =
        '<p class="description">Pick a critter or library entry to see details.</p>';
    }

    if (this.rarityBadge) {
      this.rarityBadge.textContent = '';
      this.rarityBadge.className = 'rarity-badge';
    }

    if (this.footerElement) {
      this.footerElement.textContent = 'Awaiting selection';
    }

    this.panelElement.classList.add('is-empty');
  }

  renderPlaceholder({ title, description, footer }) {
    this.clearCustomState();
    if (this.contentElement) {
      this.contentElement.innerHTML = `
        <h3>${title}</h3>
        <p class="description">${description}</p>
      `;
    }

    if (this.rarityBadge) {
      this.rarityBadge.textContent = '';
      this.rarityBadge.className = 'rarity-badge';
    }

    if (this.footerElement) {
      this.footerElement.textContent = footer || 'Info coming soon';
    }

    this.panelElement.classList.remove('is-empty');
  }

  prettify(value) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
  }

  renderCustom({ title, footer, className }) {
    this.clearCustomState();
    if (className) {
      this.panelElement.classList.add(className);
      this.customClassName = className;
    }

    if (this.contentElement) {
      this.contentElement.innerHTML = '';
      if (title) {
        const heading = document.createElement('h3');
        heading.textContent = title;
        this.contentElement.appendChild(heading);
      }
      const body = document.createElement('div');
      body.className = 'minigame-body';
      this.contentElement.appendChild(body);
      if (this.rarityBadge) {
        this.rarityBadge.textContent = '';
        this.rarityBadge.className = 'rarity-badge';
      }
      if (this.footerElement) {
        this.footerElement.textContent = footer || '';
      }
      this.panelElement.classList.remove('is-empty');
      return body;
    }
    return null;
  }

  clearCustomState() {
    this.inspectorElement?.classList.remove('inspector--critter-intel');
    if (this.customClassName) {
      this.panelElement.classList.remove(this.customClassName);
      this.customClassName = null;
    }
  }
}
