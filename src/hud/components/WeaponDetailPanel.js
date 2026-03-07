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

const getUnlockRequirements = (critter) => {
  const unlock = critter?.unlock;
  if (!unlock) {
    return [];
  }

  if (Array.isArray(unlock.requirements)) {
    return unlock.requirements
      .filter((entry) => entry && entry.critterId && Number.isFinite(Number(entry.level)))
      .map((entry) => ({
        critterId: entry.critterId,
        level: Number(entry.level),
      }));
  }

  if (unlock.type === 'level' && unlock.critterId && Number.isFinite(Number(unlock.level))) {
    return [
      {
        critterId: unlock.critterId,
        level: Number(unlock.level),
      },
    ];
  }

  return [];
};

const formatUnlockText = (critter, prettifyLabel) => {
  const unlock = critter?.unlock;
  if (!unlock) {
    return 'Awaiting Data Entry';
  }

  if (typeof unlock.text === 'string' && unlock.text.trim()) {
    return unlock.text.trim();
  }

  if (unlock.type === 'starter') {
    return 'Starter critter: unlocked automatically.';
  }

  const requirements = getUnlockRequirements(critter);
  if (requirements.length) {
    const rules = requirements.map(
      (requirement) => `Level ${requirement.level} with ${prettifyLabel(requirement.critterId)}`
    );
    return `Reach ${rules.join(' and ')}.`;
  }

  return 'Awaiting Data Entry';
};

export class WeaponDetailPanel {
  constructor({ panelElement, rarityBadge, footerElement, bus = null }) {
    this.panelElement = panelElement;
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

  renderCritter(critter, { categoryLabel, editorState } = {}) {
    if (!critter) {
      this.renderEmpty();
      return;
    }

    this.clearCustomState();
    this.panelElement.classList.remove('is-empty');

    const stats = critter.stats ?? {};
    const rarity = critter.rarity || 'common';
    const rarityLabel = RARITY_TITLES[rarity] || this.prettify(rarity);
    const unlockText = formatUnlockText(critter, (value) => this.prettify(value));
    const category = categoryLabel || this.prettify(critter.category || 'Critters');
    const bonus = stats.bonus || 'Awaiting Data Entry';
    const defaultEditorState = {
      textScale: 100,
      hue: 145,
      saturation: 88,
      lightness: 52,
      inputHue: null,
      inputSaturation: null,
      inputLightness: null,
      inputWidth: 3,
    };
    const resolvedEditorState = {
      ...defaultEditorState,
      ...(editorState || {}),
    };
    const inputEnabled =
      Number.isFinite(resolvedEditorState.inputHue) || Number.isFinite(resolvedEditorState.outputHue);
    const inputHueValue = inputEnabled
      ? Number.isFinite(Number(resolvedEditorState.inputHue))
        ? Number(resolvedEditorState.inputHue)
        : Number(resolvedEditorState.outputHue)
      : Number(resolvedEditorState.hue);
    const inputSaturationValue = inputEnabled
      ? Number.isFinite(Number(resolvedEditorState.inputSaturation))
        ? Number(resolvedEditorState.inputSaturation)
        : Number.isFinite(Number(resolvedEditorState.outputSaturation))
          ? Number(resolvedEditorState.outputSaturation)
        : Number(resolvedEditorState.saturation)
      : Number(resolvedEditorState.saturation);
    const inputLightnessValue = inputEnabled
      ? Number.isFinite(Number(resolvedEditorState.inputLightness))
        ? Number(resolvedEditorState.inputLightness)
        : Number.isFinite(Number(resolvedEditorState.outputLightness))
          ? Number(resolvedEditorState.outputLightness)
        : Number(resolvedEditorState.lightness)
      : Number(resolvedEditorState.lightness);
    const inputWidthValue = Number.isFinite(Number(resolvedEditorState.inputWidth))
      ? Number(resolvedEditorState.inputWidth)
      : Number.isFinite(Number(resolvedEditorState.outputWidth))
        ? Number(resolvedEditorState.outputWidth)
        : defaultEditorState.inputWidth;

    if (this.rarityBadge) {
      this.rarityBadge.textContent = rarityLabel;
      this.rarityBadge.className = '';
      this.rarityBadge.classList.add('rarity-badge', `rarity-${rarity}`);
    }

    if (this.contentElement) {
      this.contentElement.innerHTML = `
        <article class="critter-detail">
          <h3>${critter.name || 'Critter'}</h3>
          <p class="description">Unlock path and stats for this critter.</p>
          <dl class="critter-detail__meta">
            <div><dt>Category</dt><dd>${category}</dd></div>
            <div><dt>Rarity Tier</dt><dd>${rarityLabel}</dd></div>
            <div><dt>Unlock Rule</dt><dd>${unlockText}</dd></div>
          </dl>
          <dl class="critter-detail__stats">
            <div><dt>Health</dt><dd>${formatCritterStat(stats.health)}</dd></div>
            <div><dt>Speed</dt><dd>${formatCritterStat(stats.speed)}</dd></div>
            <div><dt>Stamina</dt><dd>${formatCritterStat(stats.stamina)}</dd></div>
          </dl>
          <div class="special-section critter-detail__bonus">
            <h4>Ability</h4>
            <p class="description">${bonus}</p>
          </div>
          <details class="critter-editor">
            <summary>Critter Box Editor</summary>
            <div class="critter-editor__body">
              <label class="critter-editor__field">
                <span>Text Scale</span>
                <input data-role="editor-text-scale" type="range" min="65" max="220" step="1" value="${Math.round(Number(resolvedEditorState.textScale) || defaultEditorState.textScale)}" />
              </label>
              <label class="critter-editor__field">
                <span>Box Hue</span>
                <input data-role="editor-hue" type="range" min="0" max="360" step="1" value="${Math.round(Number(resolvedEditorState.hue) || defaultEditorState.hue)}" />
              </label>
              <label class="critter-editor__field">
                <span>Box Saturation</span>
                <input data-role="editor-saturation" type="range" min="10" max="100" step="1" value="${Math.round(Number(resolvedEditorState.saturation) || defaultEditorState.saturation)}" />
              </label>
              <label class="critter-editor__field">
                <span>Box Lightness</span>
                <input data-role="editor-lightness" type="range" min="14" max="84" step="1" value="${Math.round(Number(resolvedEditorState.lightness) || defaultEditorState.lightness)}" />
              </label>
              <label class="critter-editor__toggle">
                <input data-role="editor-input-enabled" type="checkbox" ${inputEnabled ? 'checked' : ''} />
                <span>Custom Incoming Line Color</span>
              </label>
              <label class="critter-editor__field">
                <span>Incoming Hue</span>
                <input data-role="editor-input-hue" type="range" min="0" max="360" step="1" value="${Math.round(inputHueValue)}" ${inputEnabled ? '' : 'disabled'} />
              </label>
              <label class="critter-editor__field">
                <span>Incoming Saturation</span>
                <input data-role="editor-input-saturation" type="range" min="10" max="100" step="1" value="${Math.round(inputSaturationValue)}" ${inputEnabled ? '' : 'disabled'} />
              </label>
              <label class="critter-editor__field">
                <span>Incoming Lightness</span>
                <input data-role="editor-input-lightness" type="range" min="14" max="84" step="1" value="${Math.round(inputLightnessValue)}" ${inputEnabled ? '' : 'disabled'} />
              </label>
              <label class="critter-editor__field">
                <span>Incoming Width</span>
                <input data-role="editor-input-width" type="range" min="1" max="10" step="1" value="${Math.round(inputWidthValue)}" />
              </label>
              <div class="critter-editor__actions">
                <button type="button" data-action="editor-reset">Reset</button>
              </div>
            </div>
          </details>
        </article>
      `;

      const textScaleInput = this.contentElement.querySelector('[data-role="editor-text-scale"]');
      const hueInput = this.contentElement.querySelector('[data-role="editor-hue"]');
      const saturationInput = this.contentElement.querySelector('[data-role="editor-saturation"]');
      const lightnessInput = this.contentElement.querySelector('[data-role="editor-lightness"]');
      const inputEnabledInput = this.contentElement.querySelector('[data-role="editor-input-enabled"]');
      const inputHueInput = this.contentElement.querySelector('[data-role="editor-input-hue"]');
      const inputSaturationInput = this.contentElement.querySelector(
        '[data-role="editor-input-saturation"]'
      );
      const inputLightnessInput = this.contentElement.querySelector(
        '[data-role="editor-input-lightness"]'
      );
      const inputWidthInput = this.contentElement.querySelector('[data-role="editor-input-width"]');
      const resetButton = this.contentElement.querySelector('[data-action="editor-reset"]');

      const emitEditorUpdate = () => {
        const inputHue = inputEnabledInput.checked ? Number(inputHueInput.value) : null;
        const inputSaturation = inputEnabledInput.checked ? Number(inputSaturationInput.value) : null;
        const inputLightness = inputEnabledInput.checked ? Number(inputLightnessInput.value) : null;
        this.bus?.emit?.('critter:editor-changed', {
          critterId: critter.id,
          textScale: Number(textScaleInput.value),
          hue: Number(hueInput.value),
          saturation: Number(saturationInput.value),
          lightness: Number(lightnessInput.value),
          inputHue,
          inputSaturation,
          inputLightness,
          inputWidth: Number(inputWidthInput.value),
        });
      };

      textScaleInput?.addEventListener('input', emitEditorUpdate);
      hueInput?.addEventListener('input', emitEditorUpdate);
      saturationInput?.addEventListener('input', emitEditorUpdate);
      lightnessInput?.addEventListener('input', emitEditorUpdate);
      inputHueInput?.addEventListener('input', emitEditorUpdate);
      inputSaturationInput?.addEventListener('input', emitEditorUpdate);
      inputLightnessInput?.addEventListener('input', emitEditorUpdate);
      inputWidthInput?.addEventListener('input', emitEditorUpdate);
      inputEnabledInput?.addEventListener('change', () => {
        inputHueInput.disabled = !inputEnabledInput.checked;
        inputSaturationInput.disabled = !inputEnabledInput.checked;
        inputLightnessInput.disabled = !inputEnabledInput.checked;
        emitEditorUpdate();
      });
      resetButton?.addEventListener('click', () => {
        this.bus?.emit?.('critter:editor-reset', {
          critterId: critter.id,
        });
        textScaleInput.value = String(defaultEditorState.textScale);
        hueInput.value = String(defaultEditorState.hue);
        saturationInput.value = String(defaultEditorState.saturation);
        lightnessInput.value = String(defaultEditorState.lightness);
        inputEnabledInput.checked = false;
        inputHueInput.value = String(defaultEditorState.hue);
        inputHueInput.disabled = true;
        inputSaturationInput.value = String(defaultEditorState.saturation);
        inputSaturationInput.disabled = true;
        inputLightnessInput.value = String(defaultEditorState.lightness);
        inputLightnessInput.disabled = true;
        inputWidthInput.value = String(defaultEditorState.inputWidth);
      });
    }

    if (this.footerElement) {
      this.footerElement.textContent = `Critter ID: ${critter.id}`;
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
    if (this.customClassName) {
      this.panelElement.classList.remove(this.customClassName);
      this.customClassName = null;
    }
  }
}
