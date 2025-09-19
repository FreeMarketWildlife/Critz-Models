import { deriveStatsList } from '../../data/weaponSchema.js';

const SPECIAL_HEADING_BY_CATEGORY = {
  melee: 'Ability',
};

const DEFAULT_SPECIAL_HEADING = 'Details';

const createDefinitionListMarkup = (entries) => {
  if (!entries.length) {
    return '';
  }

  const items = entries
    .map(({ label, value }) => `<dt>${label}</dt><dd>${value}</dd>`)
    .join('');

  return `<dl class="definition-list">${items}</dl>`;
};

const extractSpecialEntries = (special = {}) =>
  Object.entries(special)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => ({
      label: prettify(key),
      value,
    }));

const prettify = (value) =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/^\w/, (char) => char.toUpperCase());

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
    const label = prettify(rarity);
    this.rarityBadge.textContent = label;
    this.rarityBadge.className = '';
    this.rarityBadge.classList.add('rarity-badge', `rarity-${rarity}`);
  }

  renderContent(weapon) {
    const statsEntries = deriveStatsList(weapon);
    const statsMarkup = createDefinitionListMarkup(statsEntries);

    const specialEntries = extractSpecialEntries(weapon.special);
    const specialHeading = SPECIAL_HEADING_BY_CATEGORY[weapon.category] || DEFAULT_SPECIAL_HEADING;
    const specialMarkup = specialEntries.length
      ? `
          <div class="special-section">
            <h4>${specialHeading}</h4>
            ${createDefinitionListMarkup(specialEntries)}
          </div>
        `
      : '';

    const descriptionMarkup = weapon.description
      ? `<p class="description">${weapon.description}</p>`
      : '';

    this.contentElement.innerHTML = `
      <h3>${weapon.name}</h3>
      ${descriptionMarkup}
      ${statsMarkup}
      ${specialMarkup}
    `;

    if (this.footerElement) {
      this.footerElement.textContent = '';
    }
  }

  renderEmpty() {
    if (this.contentElement) {
      this.contentElement.innerHTML =
        '<p class="description">Pick a tool to see its details.</p>';
    }

    if (this.rarityBadge) {
      this.rarityBadge.textContent = '';
      this.rarityBadge.className = 'rarity-badge';
    }

    if (this.footerElement) {
      this.footerElement.textContent = '';
    }

    this.panelElement.classList.add('is-empty');
  }
}
