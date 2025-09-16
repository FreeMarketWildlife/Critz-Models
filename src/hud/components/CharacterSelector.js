export class CharacterSelector {
  constructor({
    container,
    critters = [],
    defaultCritterId = '',
    autoSpin = true,
    onCritterChange,
    onAutoSpinChange,
    onResetView,
  }) {
    this.container = container;
    this.critters = critters;
    this.defaultCritterId = defaultCritterId;
    this.autoSpin = autoSpin;
    this.onCritterChange = onCritterChange;
    this.onAutoSpinChange = onAutoSpinChange;
    this.onResetView = onResetView;

    this.selectElement = null;
    this.spinToggle = null;
    this.resetButton = null;
  }

  init() {
    if (!this.container) return;

    this.selectElement = this.container.querySelector('[data-role="character-select"]');
    this.spinToggle = this.container.querySelector('[data-role="toggle-spin"]');
    this.resetButton = this.container.querySelector('[data-action="reset-view"]');

    this.renderOptions();
    this.setSelectedCritter(this.defaultCritterId);
    this.setAutoSpin(this.autoSpin);

    this.selectElement?.addEventListener('change', (event) => {
      const value = event.target.value;
      this.onCritterChange?.(value);
    });

    this.spinToggle?.addEventListener('change', (event) => {
      const enabled = Boolean(event.target.checked);
      this.autoSpin = enabled;
      this.onAutoSpinChange?.(enabled);
    });

    this.resetButton?.addEventListener('click', () => {
      this.onResetView?.();
    });
  }

  renderOptions() {
    if (!this.selectElement) return;
    this.selectElement.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Active weapon preview';
    this.selectElement.appendChild(placeholder);

    const sortedCritters = [...this.critters].sort((a, b) => {
      const nameA = a.name?.toLowerCase?.() ?? '';
      const nameB = b.name?.toLowerCase?.() ?? '';
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    sortedCritters.forEach((critter) => {
      const option = document.createElement('option');
      option.value = critter.id;
      option.textContent = critter.name || critter.id;
      option.dataset.faction = critter.faction ?? '';
      if (critter.blurb) {
        option.title = critter.blurb;
      }
      this.selectElement.appendChild(option);
    });
  }

  setCritters(critters = []) {
    this.critters = critters;
    this.renderOptions();
  }

  setSelectedCritter(critterId = '') {
    if (this.selectElement) {
      this.selectElement.value = critterId ?? '';
    }
  }

  setAutoSpin(enabled) {
    this.autoSpin = Boolean(enabled);
    if (this.spinToggle) {
      this.spinToggle.checked = this.autoSpin;
    }
  }
}
