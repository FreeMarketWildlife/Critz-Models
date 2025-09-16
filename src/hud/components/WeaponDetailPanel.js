import {
  createWeaponStatProfile,
  calculateStatPercent,
} from '../../utils/weaponStatBars.js';

const RARITY_TITLES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

export class WeaponDetailPanel {
  constructor({ panelElement, rarityBadge, footerElement, statContext }) {
    this.panelElement = panelElement;
    this.contentElement = panelElement.querySelector('[data-role="detail-content"]');
    this.rarityBadge = rarityBadge;
    this.footerElement = footerElement;
    this.statContext = statContext || { profiles: new Map(), maxValues: {} };
  }

  setStatContext(statContext) {
    if (!statContext) {
      this.statContext = { profiles: new Map(), maxValues: {} };
      return;
    }

    this.statContext = statContext;
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
    const stats = this.getStatProfile(weapon);
    const specialEntries = Object.entries(weapon.special || {}).filter(([, value]) =>
      value !== null && value !== undefined && value !== ''
    );

    const statsMarkup = this.renderStats(stats);

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
      ${statsMarkup}
      ${specialMarkup}
    `;

    if (this.footerElement) {
      this.footerElement.textContent = `Catalog ID: ${weapon.id}`;
    }
  }

  getStatProfile(weapon) {
    if (!weapon) return [];

    if (this.statContext?.profiles instanceof Map) {
      const cached = this.statContext.profiles.get(weapon.id);
      if (cached) {
        return cached;
      }
    }

    return createWeaponStatProfile(weapon);
  }

  renderStats(stats) {
    if (!stats || stats.length === 0) {
      return '';
    }

    const items = stats.map((stat) => this.renderStatBar(stat)).join('');
    return `<div class="stat-bar-list">${items}</div>`;
  }

  renderStatBar(stat) {
    const maxValues = this.statContext?.maxValues || {};
    const max = maxValues[stat.key] || 0;
    const percent = calculateStatPercent(stat.numericValue, max);
    const hasNumeric = typeof stat.numericValue === 'number' && Number.isFinite(stat.numericValue);
    const valueText = stat.displayValue ?? '—';
    const valueClasses = ['stat-value'];
    const progressClasses = ['stat-bar-track'];

    if (!hasNumeric) {
      progressClasses.push('is-empty');
    }

    if (!stat.hasValue) {
      valueClasses.push('is-empty');
    }

    const ariaNow = hasNumeric ? Math.round(percent) : 0;

    return `
      <div class="stat-bar">
        <div class="stat-header">
          <span class="stat-label">${stat.label}</span>
          <span class="${valueClasses.join(' ')}">${valueText}</span>
        </div>
        <div
          class="${progressClasses.join(' ')}"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${ariaNow}"
          aria-valuetext="${valueText}"
          aria-label="${stat.label}: ${valueText}"
        >
          <div class="stat-bar-fill" style="width: ${Math.round(percent)}%"></div>
        </div>
      </div>
    `;
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
