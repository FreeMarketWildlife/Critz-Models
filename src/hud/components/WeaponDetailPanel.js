import { deriveStatsList } from '../../data/weaponSchema.js';

const TOOLTIP_TEXT = {
  splash:
    'Damage is highest at the point of impact, and falls off sharply the further away from the impact it is',
  aoe: 'There is an Area of Effect (a defined zone or radius) applying whatever damage or effects.',
  fire: 'Ignites targets for 3 seconds dealing 10 damage per second. Gas can be lit by fire.',
  rpm: 'Rounds per Minute',
  overheat:
    'Weapons that have Overheat do not use Ammo, instead they are limited by a heat meter that rises with each shot fired and dissipates between shots. X/Y means that each shot costs X, and Y is the max of the heat meter. When a weapon overheats, it must wait until it\'s at 0/Y to fire again.',
  gas: 'Gas deals 5 damage for 5 seconds. Gas can be lit by fire.',
  lightning: 'Paralyzes Enemy Units for 0.5s every 1s',
  ice: 'All Units Have 50% Less Friction',
};

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const escapeAttribute = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const buildTooltipPattern = (keywords) => {
  if (!keywords.length) {
    return null;
  }

  return new RegExp(
    `\\b(${keywords.map((key) => escapeRegExp(key)).join('|')})\\b`,
    'gi'
  );
};

const TOOLTIP_PATTERN = buildTooltipPattern(Object.keys(TOOLTIP_TEXT));
const LABEL_TOOLTIP_PATTERN = buildTooltipPattern(
  Object.keys(TOOLTIP_TEXT).filter((key) => key !== 'fire')
);

const applyTooltips = (content, pattern = TOOLTIP_PATTERN) => {
  if (typeof content !== 'string' || !content || !pattern) {
    return content;
  }

  return content.replace(pattern, (match) => {
    const tooltip = TOOLTIP_TEXT[match.toLowerCase()];

    if (!tooltip) {
      return match;
    }

    return `<span class="has-tooltip" title="${escapeAttribute(tooltip)}">${match}</span>`;
  });
};

const RARITY_TITLES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

const buildStatsMarkup = (weapon) => {
  if (!weapon) {
    return '';
  }

  const stats = deriveStatsList(weapon);
  if (!stats.length) {
    return '';
  }

  const rows = stats
    .map(({ label, value }) => {
      const labelMarkup = applyTooltips(label, LABEL_TOOLTIP_PATTERN);
      const valueMarkup = typeof value === 'string' ? applyTooltips(value) : value;
      return `<dt>${labelMarkup}</dt><dd>${valueMarkup}</dd>`;
    })
    .join('');

  return `<dl class="stat-list">${rows}</dl>`;
};

const buildSpecialMarkup = (weapon, prettify) => {
  const entries = Object.entries(weapon.special || {}).filter(([, value]) =>
    value !== null && value !== undefined && value !== ''
  );

  if (!entries.length) {
    return '';
  }

  const items = entries
    .map(([key, value]) => {
      const keyLabel = applyTooltips(prettify(key));
      const valueMarkup = typeof value === 'string' ? applyTooltips(value) : value;
      return `<li><span class="special-key">${keyLabel}:</span> ${valueMarkup}</li>`;
    })
    .join('');

  return `
    <div class="special-section">
      <h4>Special Properties</h4>
      <ul class="special-list">${items}</ul>
    </div>
  `;
};

export class WeaponDetailPanel {
  constructor({ panelElement, rarityBadge, footerElement }) {
    this.panelElement = panelElement;
    this.contentElement = panelElement.querySelector('[data-role="detail-content"]');
    this.rarityBadge = rarityBadge;
    this.footerElement = footerElement;
  }

  render(weapon) {
    if (!weapon) {
      this.renderEmpty();
      return;
    }

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
    const statsMarkup = buildStatsMarkup(weapon);
    const specialMarkup = buildSpecialMarkup(weapon, (value) => this.prettify(value));

    const descriptionMarkup = applyTooltips(weapon.description || '');

    this.contentElement.innerHTML = `
      <h3>${weapon.name}</h3>
      <p class="description">${descriptionMarkup}</p>
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
        '<p class="description">Pick a tool to see its story and statistics.</p>';
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

  prettify(value) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
  }
}
