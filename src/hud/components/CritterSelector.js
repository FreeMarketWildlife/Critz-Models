export class CritterSelector {
  constructor({
    element,
    critters = [],
    defaultCritterId = null,
    autoSpinEnabled = true,
    onSelect,
    onToggleSpin,
    onResetCamera,
  }) {
    this.element = element;
    this.critters = [...critters].sort((a, b) => a.name.localeCompare(b.name));
    this.defaultCritterId = defaultCritterId;
    this.autoSpinEnabled = Boolean(autoSpinEnabled);
    this.onSelect = onSelect;
    this.onToggleSpin = onToggleSpin;
    this.onResetCamera = onResetCamera;

    this.selectElement = null;
    this.spinButton = null;
    this.resetButton = null;
    this.selectId = `critter-select-${Math.random().toString(36).slice(2, 8)}`;
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.element.classList.add('critter-controls');

    const title = document.createElement('p');
    title.className = 'critter-controls__title';
    title.textContent = 'Characters';
    this.element.appendChild(title);

    const field = document.createElement('label');
    field.className = 'critter-controls__field';

    const fieldLabel = document.createElement('span');
    fieldLabel.className = 'critter-controls__label';
    fieldLabel.textContent = 'Roster';
    field.appendChild(fieldLabel);

    this.selectElement = document.createElement('select');
    this.selectElement.id = this.selectId;
    this.selectElement.className = 'critter-controls__select';
    this.populateOptions();
    this.selectElement.addEventListener('change', () => this.handleSelection());
    field.appendChild(this.selectElement);
    this.element.appendChild(field);

    const actions = document.createElement('div');
    actions.className = 'critter-controls__actions';

    this.spinButton = document.createElement('button');
    this.spinButton.type = 'button';
    this.spinButton.className = 'critter-controls__toggle';
    this.spinButton.setAttribute('aria-label', 'Toggle auto-spin');
    this.spinButton.title = 'Toggle character preview auto-spin';
    this.spinButton.addEventListener('click', () => this.toggleSpin());
    actions.appendChild(this.spinButton);

    this.resetButton = document.createElement('button');
    this.resetButton.type = 'button';
    this.resetButton.className = 'critter-controls__action';
    this.resetButton.textContent = 'Reset view';
    this.resetButton.title = 'Reset the camera to the default orbit position';
    this.resetButton.addEventListener('click', () => this.onResetCamera?.());
    actions.appendChild(this.resetButton);

    this.element.appendChild(actions);

    this.updateSpinButton();
  }

  populateOptions() {
    if (!this.selectElement) return;
    this.selectElement.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'None';
    this.selectElement.appendChild(placeholder);

    this.critters.forEach((critter) => {
      const option = document.createElement('option');
      option.value = critter.id;
      option.textContent = critter.name;
      this.selectElement.appendChild(option);
    });

    if (this.defaultCritterId) {
      const exists = this.critters.some((critter) => critter.id === this.defaultCritterId);
      if (exists) {
        this.selectElement.value = this.defaultCritterId;
      }
    }
  }

  handleSelection() {
    const value = this.selectElement?.value || '';
    const critterId = value === '' ? null : value;
    this.onSelect?.(critterId);
  }

  toggleSpin() {
    this.autoSpinEnabled = !this.autoSpinEnabled;
    this.updateSpinButton();
    this.onToggleSpin?.(this.autoSpinEnabled);
  }

  updateSpinButton() {
    if (!this.spinButton) return;
    const pressed = Boolean(this.autoSpinEnabled);
    this.spinButton.setAttribute('aria-pressed', pressed.toString());
    this.spinButton.textContent = pressed ? 'Auto-spin: On' : 'Auto-spin: Off';
  }

  setAutoSpin(enabled) {
    this.autoSpinEnabled = Boolean(enabled);
    this.updateSpinButton();
  }

  setCritter(critterId) {
    if (!this.selectElement) return;
    this.selectElement.value = critterId ?? '';
  }
}
