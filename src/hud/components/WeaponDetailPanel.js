import { createStatBars } from './createStatBars.js';

const RARITY_TITLES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

export class WeaponDetailPanel {
  constructor({ panelElement, rarityBadge, footerElement, statNormalizer }) {
    this.panelElement = panelElement;
    this.contentElement = panelElement.querySelector('[data-role="detail-content"]');
    this.rarityBadge = rarityBadge;
    this.footerElement = footerElement;
    this.statNormalizer = statNormalizer || null;
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
    const stats = this.statNormalizer ? this.statNormalizer.getStats(weapon) : [];
    const specialEntries = Object.entries(weapon.special || {}).filter(([, value]) =>
      value !== null && value !== undefined && value !== ''
    );

    this.contentElement.innerHTML = '';

    const fragment = document.createDocumentFragment();

    const heading = document.createElement('h3');
    heading.textContent = weapon.name;
    fragment.appendChild(heading);

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = weapon.description;
    fragment.appendChild(description);

    const statBars = createStatBars(stats);
    if (statBars) {
      fragment.appendChild(statBars);
    }

    if (specialEntries.length) {
      const specialSection = document.createElement('div');
      specialSection.className = 'special-section';

      const specialHeading = document.createElement('h4');
      specialHeading.textContent = 'Special Properties';
      specialSection.appendChild(specialHeading);

      const list = document.createElement('ul');
      list.className = 'special-list';

      specialEntries.forEach(([key, value]) => {
        const item = document.createElement('li');
        const keyElement = document.createElement('span');
        keyElement.className = 'special-key';
        keyElement.textContent = `${this.prettify(key)}:`;
        item.appendChild(keyElement);
        item.append(document.createTextNode(` ${value}`));
        list.appendChild(item);
      });

      specialSection.appendChild(list);
      fragment.appendChild(specialSection);
    }

    this.contentElement.appendChild(fragment);

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
