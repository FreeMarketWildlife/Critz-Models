import { deriveStatsList } from '../../data/weaponSchema.js';

const RARITY_TITLES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const TOOLTIP_KEYWORDS = [
  {
    term: 'Splash',
    description:
      'Damage is highest at the point of impact, and falls off sharply the further away from the impact it is',
  },
  {
    term: 'AOE',
    description:
      'There is an Area of Effect (a defined zone or radius) applying whatever damage or effects.',
  },
  {
    term: 'Fire',
    description:
      'Ignites targets for 3 seconds dealing 10 damage per second. Gas can be lit by fire.',
  },
  { term: 'RPM', description: 'Rounds per Minute' },
  {
    term: 'Overheat',
    description:
      'Weapons that have Overheat do not use Ammo, instead they are limited by a heat meter that rises with each shot fired and dissipates between shots. X/Y means that each shot costs X, and Y is the max of the heat meter. When a weapon overheats, it must wait until it\'s at 0/Y to fire again.',
  },
  {
    term: 'Gas',
    description: 'Gas deals 5 damage for 5 seconds. Gas can be lit by fire.',
  },
  { term: 'Lightning', description: 'Paralyzes Enemy Units for 0.5s every 1s' },
  { term: 'Ice', description: 'All Units Have 50% Less Friction' },
];

const TOOLTIP_LOOKUP = new Map(
  TOOLTIP_KEYWORDS.map((entry) => [entry.term.toLowerCase(), entry])
);

const TOOLTIP_PATTERN =
  TOOLTIP_KEYWORDS.length > 0
    ? new RegExp(
        `\\b(${TOOLTIP_KEYWORDS.map(({ term }) => escapeRegExp(term)).join('|')})\\b`,
        'gi'
      )
    : null;

const buildStatsMarkup = (weapon) => {
  if (!weapon) {
    return '';
  }

  const stats = deriveStatsList(weapon);
  if (!stats.length) {
    return '';
  }

  const rows = stats
    .map(({ label, value }) => `<dt>${label}</dt><dd>${value}</dd>`)
    .join('');

  return `<dl class="stat-list">${rows}</dl>`;
};

const normalizeSpecialValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number') {
    return `${value}`;
  }

  if (typeof value === 'boolean') {
    return value ? '' : 'No';
  }

  return String(value);
};

const formatSpecialEntry = (key, value, prettify) => {
  const label = prettify(key);
  const normalizedValue = normalizeSpecialValue(value);
  const shouldShowValue =
    normalizedValue !== '' && normalizedValue.toLowerCase() !== label.toLowerCase();

  const valueMarkup = shouldShowValue ? `: ${normalizedValue}` : '';

  return `<li><span class="special-key">${label}</span>${valueMarkup}</li>`;
};

const buildSpecialMarkup = (weapon, prettify) => {
  const entries = Object.entries(weapon.special || {}).filter(([, value]) =>
    value !== null && value !== undefined && value !== ''
  );

  if (!entries.length) {
    return '';
  }

  const items = entries
    .map(([key, value]) => formatSpecialEntry(key, value, prettify))
    .join('');

  return `
    <div class="special-section">
      <h4>Special Properties</h4>
      <ul class="special-list">${items}</ul>
    </div>
  `;
};

const applyKeywordTooltips = (container) => {
  if (!container || !TOOLTIP_PATTERN) {
    return;
  }

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue || !node.nodeValue.trim()) {
      continue;
    }

    const parentElement = node.parentElement;
    if (parentElement && parentElement.closest('.tooltip-trigger')) {
      continue;
    }

    TOOLTIP_PATTERN.lastIndex = 0;
    if (!TOOLTIP_PATTERN.test(node.nodeValue)) {
      continue;
    }

    TOOLTIP_PATTERN.lastIndex = 0;
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const textContent = textNode.nodeValue;
    const parent = textNode.parentNode;

    if (!parent) {
      return;
    }

    TOOLTIP_PATTERN.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = TOOLTIP_PATTERN.exec(textContent))) {
      const matchedText = match[0];
      const startIndex = match.index;

      if (startIndex > lastIndex) {
        fragment.appendChild(
          document.createTextNode(textContent.slice(lastIndex, startIndex))
        );
      }

      const tooltipDefinition = TOOLTIP_LOOKUP.get(matchedText.toLowerCase());

      if (tooltipDefinition) {
        const trigger = document.createElement('span');
        trigger.className = 'tooltip-trigger';
        trigger.setAttribute('data-tooltip', tooltipDefinition.description);
        trigger.setAttribute('tabindex', '0');
        trigger.textContent = matchedText;
        fragment.appendChild(trigger);
      } else {
        fragment.appendChild(document.createTextNode(matchedText));
      }

      lastIndex = startIndex + matchedText.length;
    }

    if (lastIndex < textContent.length) {
      fragment.appendChild(document.createTextNode(textContent.slice(lastIndex)));
    }

    parent.insertBefore(fragment, textNode);
    parent.removeChild(textNode);
    TOOLTIP_PATTERN.lastIndex = 0;
  });
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

    this.contentElement.innerHTML = `
      <h3>${weapon.name}</h3>
      <p class="description">${weapon.description}</p>
      ${statsMarkup}
      ${specialMarkup}
    `;

    applyKeywordTooltips(this.contentElement);

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
