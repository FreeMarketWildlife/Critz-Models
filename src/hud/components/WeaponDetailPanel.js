import { deriveStatsList } from '../../data/weaponSchema.js';

const RARITY_TITLES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
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
    const stats = deriveStatsList(weapon);
    const specialEntries = Object.entries(weapon.special || {}).filter(([, value]) =>
      value !== null && value !== undefined && value !== ''
    );

    const statsMarkup = stats
      .map(
        (stat) => `
          <div class="stat">
            <span class="stat-label">${stat.label}</span>
            <span class="stat-value">${stat.value}</span>
          </div>
        `
      )
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
      ${stats.length ? `<div class="stat-grid">${statsMarkup}</div>` : ''}
      ${specialMarkup}
    `;

    if (this.footerElement) {
      this.footerElement.textContent = `Reference ID: ${weapon.id}`;
    }
  }

  renderEmpty() {
    if (this.contentElement) {
      this.contentElement.innerHTML =
        '<p class="description">Select a weapon to see its details.</p>';
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
