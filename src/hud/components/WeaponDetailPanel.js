import { deriveWeaponStatBars } from '../../utils/statBars.js';

const RARITY_TITLES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

export class WeaponDetailPanel {
  constructor({ panelElement, rarityBadge, footerElement, statMeta = {} }) {
    this.panelElement = panelElement;
    this.contentElement = panelElement.querySelector('[data-role="detail-content"]');
    this.rarityBadge = rarityBadge;
    this.footerElement = footerElement;
    this.statMeta = statMeta;
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
    const stats = deriveWeaponStatBars(weapon, this.statMeta);
    const specialEntries = Object.entries(weapon.special || {}).filter(([, value]) =>
      value !== null && value !== undefined && value !== ''
    );

    const statsMarkup = stats
      .map((stat) => {
        const classes = ['stat-bar'];
        if (!stat.hasValue) {
          classes.push('stat-bar--empty');
        }

        const width = stat.hasValue ? stat.percentage : 0;
        const roundedWidth = Math.round(width);
        const accessibilityAttributes = stat.hasValue
          ? `role="progressbar" aria-label="${stat.label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${roundedWidth}"`
          : `role="progressbar" aria-label="${stat.label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="Not available"`;

        return `
          <div class="${classes.join(' ')}">
            <div class="stat-bar-header">
              <span class="stat-label">${stat.label}</span>
              <span class="stat-value">${stat.value}</span>
            </div>
            <div class="stat-bar-track" role="presentation">
              <div class="stat-bar-fill" style="--stat-bar-fill: ${width}%;" ${accessibilityAttributes}></div>
            </div>
          </div>
        `;
      })
      .join('');

    const specialMarkup = specialEntries.length
      ? `
        <div class="special-section">
          <h4>Special Properties</h4>
          <ul class="special-list">
            ${specialEntries
              .map(
                ([key, value]) =>
                  `<li><span class="special-key">${this.prettify(key)}:</span> ${value}</li>`
              )
              .join('')}
          </ul>
        </div>
      `
      : '';

    this.contentElement.innerHTML = `
      <h3>${weapon.name}</h3>
      <p class="description">${weapon.description}</p>
      ${stats.length ? `<div class="stat-bars">${statsMarkup}</div>` : ''}
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
