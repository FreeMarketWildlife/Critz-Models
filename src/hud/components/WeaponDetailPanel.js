const RARITY_TITLES = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

const AMMO_STAT_KEYS = ['ammo', 'magazineSize', 'carryLimit', 'quiverCapacity', 'capacity', 'heatCapacity'];

const STAT_BAR_DEFINITIONS = [
  {
    key: 'damage',
    label: 'Body Damage',
    getRaw: (stats) => stats.damage,
    max: 120,
  },
  {
    key: 'fireRate',
    label: 'Fire Rate',
    getRaw: (stats) => stats.fireRate,
    max: 10,
  },
  {
    key: 'magazine',
    label: 'Magazine / Charges',
    getRaw: (stats) => getAmmoStat(stats),
    max: 50,
  },
  {
    key: 'ttkBody',
    label: 'TTK (Body)',
    getRaw: (stats) => stats.ttkBody,
    getNumericValue: ({ parsed }) => (parsed && parsed > 0 ? 1 / parsed : null),
    max: 1,
  },
];

const MIN_NON_ZERO_BAR_WIDTH = 6;

function buildStatBarsMarkup(weapon) {
  if (!weapon) {
    return '';
  }

  const barData = collectStatBarData(weapon);
  if (!barData.length) {
    return '';
  }

  const barsMarkup = barData.map(createStatBarMarkup).join('');
  return `<div class="stat-grid">${barsMarkup}</div>`;
}

function collectStatBarData(weapon) {
  const stats = weapon?.stats || {};

  return STAT_BAR_DEFINITIONS.map((definition) => {
    const raw = definition.getRaw(stats);
    const display = formatDisplayValue(raw);
    const parsed = parseStatValue(raw);
    const numeric =
      typeof definition.getNumericValue === 'function'
        ? definition.getNumericValue({ stats, raw, parsed })
        : parsed;
    const hasValue = typeof numeric === 'number' && Number.isFinite(numeric);
    const baseMax = definition.max ?? 100;
    const safeMax = hasValue ? Math.max(baseMax, numeric) : baseMax;
    const ratio = hasValue && safeMax > 0 ? numeric / safeMax : 0;
    const percent = clamp(ratio * 100, 0, 100);
    const fill = hasValue && percent > 0 ? Math.max(percent, MIN_NON_ZERO_BAR_WIDTH) : 0;

    return {
      key: definition.key,
      label: definition.label,
      display,
      value: typeof parsed === 'number' && Number.isFinite(parsed) ? Number.parseFloat(parsed.toFixed(2)) : null,
      max: safeMax,
      hasValue,
      fill,
    };
  }).filter((stat) => stat.hasValue);
}

function createStatBarMarkup(stat) {
  const valueClass = stat.hasValue ? 'stat-bar-value' : 'stat-bar-value is-missing';
  const ariaValueNow = stat.hasValue ? stat.value : 0;
  const ariaValueText = stat.hasValue ? stat.display : 'Not available';
  const dataEmptyAttr = stat.hasValue ? '' : ' data-empty="true"';
  const fillStyle = ` style="--fill:${(stat.hasValue ? stat.fill : 0).toFixed(2)}"`;

  return `
    <div class="stat stat-bar" data-stat="${stat.key}">
      <div class="stat-bar-header">
        <span class="stat-label">${stat.label}</span>
        <span class="${valueClass}">${stat.display}</span>
      </div>
      <div class="stat-bar-track"${dataEmptyAttr} role="meter" aria-label="${stat.label}" aria-valuemin="0" aria-valuemax="${stat.max}" aria-valuenow="${ariaValueNow}" aria-valuetext="${ariaValueText}">
        <div class="stat-bar-fill"${fillStyle}></div>
      </div>
    </div>
  `;
}

function getAmmoStat(stats) {
  for (const key of AMMO_STAT_KEYS) {
    const value = stats?.[key];
    if (value !== null && value !== undefined && value !== '') {
      return value;
    }
  }
  return null;
}

function parseStatValue(raw) {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }

  if (typeof raw === 'string') {
    const match = raw.match(/-?\d+(?:\.\d+)?/);
    return match ? Number.parseFloat(match[0]) : null;
  }

  return null;
}

function formatDisplayValue(raw) {
  if (raw === null || raw === undefined || raw === '') {
    return '';
  }

  if (typeof raw === 'number') {
    return Number.isFinite(raw)
      ? Number(raw).toLocaleString(undefined, { maximumFractionDigits: 2 })
      : '';
  }

  return String(raw);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

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
    const statsMarkup = buildStatBarsMarkup(weapon);
    const specialEntries = Object.entries(weapon.special || {}).filter(([, value]) =>
      value !== null && value !== undefined && value !== ''
    );

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
