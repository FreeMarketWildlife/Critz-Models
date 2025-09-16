export class CritterController {
  constructor({ bus, containerElement }) {
    this.bus = bus;
    this.container = containerElement;

    this.searchInput = null;
    this.selectElement = null;
    this.spinToggle = null;

    this.allCritters = [];
    this.filteredCritters = [];
    this.activeCritterId = null;
    this.autoRotateEnabled = true;
    this.suppressEmit = false;
  }

  init({ critters = [], defaultCritterId = null, autoRotateDefault = true } = {}) {
    if (!this.container) {
      console.warn('Critter selector container is missing.');
      return;
    }

    this.setCritters(critters);
    this.bindDomReferences();
    if (!this.selectElement || !this.spinToggle) {
      console.warn('Critter selector requires select and toggle elements.');
      return;
    }

    this.autoRotateEnabled = Boolean(autoRotateDefault);
    this.spinToggle.checked = this.autoRotateEnabled;

    this.registerDomListeners();

    this.suppressEmit = true;
    this.activeCritterId = this.resolveInitialCritterId(defaultCritterId);
    this.renderCritterOptions();
    this.suppressEmit = false;

    this.bus.emit('hud:auto-rotate-changed', this.autoRotateEnabled);
  }

  setCritters(critters = []) {
    this.allCritters = [...critters]
      .map((critter) => ({
        ...critter,
        _searchLabel: [
          critter.name,
          critter.subtitle || '',
          ...(critter.tags || []),
        ]
          .join(' ')
          .toLowerCase(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.filteredCritters = [...this.allCritters];
  }

  bindDomReferences() {
    this.searchInput = this.container.querySelector('[data-role="critter-search"]');
    this.selectElement = this.container.querySelector('[data-role="critter-select"]');
    this.spinToggle = this.container.querySelector('[data-role="critter-spin"]');
  }

  registerDomListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.handleSearchInput());
      this.searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const firstId = this.filteredCritters[0]?.id;
          if (firstId) {
            this.setActiveCritter(firstId, { emit: true });
          }
        }
      });
    }

    this.selectElement.addEventListener('change', () => this.handleSelectionChange());
    this.selectElement.addEventListener('dblclick', () => this.handleSelectionChange());
    this.selectElement.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.handleSelectionChange();
      }
    });

    this.spinToggle.addEventListener('change', () => this.handleSpinToggle());
  }

  resolveInitialCritterId(defaultCritterId) {
    if (defaultCritterId && this.allCritters.some((critter) => critter.id === defaultCritterId)) {
      return defaultCritterId;
    }
    return this.filteredCritters[0]?.id ?? null;
  }

  handleSearchInput() {
    const query = (this.searchInput?.value || '').trim().toLowerCase();
    if (!query) {
      this.filteredCritters = [...this.allCritters];
    } else {
      this.filteredCritters = this.allCritters.filter((critter) =>
        critter._searchLabel.includes(query),
      );
    }
    this.renderCritterOptions();
  }

  handleSelectionChange() {
    const critterId = this.selectElement.value;
    if (!critterId) return;
    this.setActiveCritter(critterId, { emit: true });
  }

  handleSpinToggle() {
    this.autoRotateEnabled = this.spinToggle.checked;
    this.bus.emit('hud:auto-rotate-changed', this.autoRotateEnabled);
  }

  renderCritterOptions() {
    if (!this.selectElement) return;

    const previousId = this.activeCritterId;

    this.selectElement.innerHTML = '';
    const fragment = document.createDocumentFragment();

    if (this.filteredCritters.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'No critters found';
      option.disabled = true;
      fragment.appendChild(option);
      this.selectElement.appendChild(fragment);
      this.selectElement.disabled = true;
      this.selectElement.value = '';
      return;
    }

    this.filteredCritters.forEach((critter) => {
      const option = document.createElement('option');
      option.value = critter.id;
      option.textContent = critter.name;
      option.dataset.critterId = critter.id;
      fragment.appendChild(option);
    });

    this.selectElement.appendChild(fragment);
    this.selectElement.disabled = false;

    const hasPrevious = this.filteredCritters.some((critter) => critter.id === previousId);
    if (hasPrevious) {
      this.selectElement.value = previousId;
    } else {
      const nextId = this.filteredCritters[0]?.id ?? null;
      if (nextId) {
        this.selectElement.value = nextId;
        this.setActiveCritter(nextId, { emit: true });
      }
    }
  }

  setActiveCritter(critterId, { emit = true } = {}) {
    if (!critterId) {
      this.activeCritterId = null;
      if (emit && !this.suppressEmit) {
        this.bus.emit('hud:critter-selected', null);
      }
      return;
    }

    if (critterId === this.activeCritterId) {
      return;
    }

    this.activeCritterId = critterId;
    if (this.selectElement && this.selectElement.value !== critterId) {
      this.selectElement.value = critterId;
    }

    if (emit && !this.suppressEmit) {
      this.bus.emit('hud:critter-selected', critterId);
    }
  }
}
