export class CritterSelector {
  constructor({ element, critters = [], activeId = null, onSelect } = {}) {
    this.element = element;
    this.critters = critters;
    this.activeId = activeId;
    this.onSelect = onSelect;

    this.selectElement = this.element?.querySelector('[data-role="critter-select"]') || null;
    this.descriptionElement = this.element?.querySelector('[data-role="critter-description"]') || null;

    this.handleChange = this.handleChange.bind(this);
    this.attachEvents();
    this.renderOptions();
    this.setActive(this.activeId);
  }

  attachEvents() {
    if (!this.selectElement) return;
    this.selectElement.addEventListener('change', this.handleChange);
  }

  detachEvents() {
    if (!this.selectElement) return;
    this.selectElement.removeEventListener('change', this.handleChange);
  }

  handleChange(event) {
    const value = event.target.value;
    this.activeId = value || null;
    this.updateDescription();
    this.onSelect?.(this.activeId);
  }

  setCritters(critters = []) {
    this.critters = Array.isArray(critters) ? critters : [];
    this.renderOptions();
    this.setActive(this.activeId);
  }

  renderOptions() {
    if (!this.selectElement) return;
    const previousValue = this.selectElement.value;
    this.selectElement.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Weapons Only';
    this.selectElement.appendChild(placeholderOption);

    this.critters.forEach((critter) => {
      const option = document.createElement('option');
      option.value = critter.id;
      option.textContent = critter.name;
      option.dataset.faction = critter.faction || '';
      this.selectElement.appendChild(option);
    });

    if (previousValue) {
      this.selectElement.value = previousValue;
    }
  }

  setActive(critterId = null) {
    this.activeId = critterId || null;
    if (this.selectElement) {
      this.selectElement.value = this.activeId || '';
    }
    this.updateDescription();
  }

  updateDescription() {
    if (!this.descriptionElement) return;
    if (!this.activeId) {
      this.descriptionElement.textContent = 'View weapons on the stage or pick a critter to preview.';
      return;
    }

    const critter = this.critters.find((entry) => entry.id === this.activeId);
    if (!critter) {
      this.descriptionElement.textContent = 'Select a critter to preview it in the stage.';
      return;
    }

    const faction = critter.faction ? `${critter.faction} • ` : '';
    this.descriptionElement.textContent = `${faction}${critter.summary || 'Ready for inspection.'}`;
  }

  destroy() {
    this.detachEvents();
  }
}
