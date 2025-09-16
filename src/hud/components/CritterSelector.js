export class CritterSelector {
  constructor({
    container,
    critters = [],
    defaultCritterId = null,
    autoSpinEnabled = true,
    onSelect,
    onSpinToggle,
    onResetView,
  }) {
    this.container = container;
    this.critters = critters;
    this.selectedCritterId = defaultCritterId;
    this.autoSpinEnabled = autoSpinEnabled;
    this.onSelect = onSelect;
    this.onSpinToggle = onSpinToggle;
    this.onResetView = onResetView;

    this.selectElement = null;
    this.spinToggleElement = null;
    this.selectId = `critter-select-${Math.random().toString(36).slice(2, 9)}`;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'critter-controls';

    const heading = document.createElement('label');
    heading.className = 'critter-controls__label';
    heading.textContent = 'Critters';
    heading.setAttribute('for', this.selectId);

    const helper = document.createElement('p');
    helper.className = 'critter-controls__helper';
    helper.id = `${this.selectId}-helper`;
    helper.textContent = 'Pick a character to preview them on the stage.';

    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'critter-controls__select-wrapper';

    this.selectElement = document.createElement('select');
    this.selectElement.className = 'critter-controls__select';
    this.selectElement.id = this.selectId;
    this.selectElement.setAttribute('aria-describedby', helper.id);
    this.selectElement.addEventListener('change', (event) => {
      const value = event.target.value || null;
      this.selectedCritterId = value;
      this.onSelect?.(value);
    });

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Show weapons only';
    this.selectElement.appendChild(placeholderOption);

    this.critters.forEach((critter) => {
      const option = document.createElement('option');
      option.value = critter.id;
      option.textContent = critter.name;
      this.selectElement.appendChild(option);
    });

    if (this.selectedCritterId) {
      this.selectElement.value = this.selectedCritterId;
    }

    if (this.critters.length === 0) {
      this.selectElement.disabled = true;
      helper.textContent = 'Critter roster is still loading. Weapons remain available in the meantime.';
    } else {
      this.selectElement.disabled = false;
    }

    selectWrapper.appendChild(this.selectElement);

    const actions = document.createElement('div');
    actions.className = 'critter-controls__actions';

    const spinLabel = document.createElement('label');
    spinLabel.className = 'critter-controls__spin-toggle';

    this.spinToggleElement = document.createElement('input');
    this.spinToggleElement.type = 'checkbox';
    this.spinToggleElement.checked = this.autoSpinEnabled;
    this.spinToggleElement.addEventListener('change', (event) => {
      const checked = event.target.checked;
      this.autoSpinEnabled = checked;
      this.onSpinToggle?.(checked);
    });

    const spinText = document.createElement('span');
    spinText.textContent = 'Spin model';

    spinLabel.appendChild(this.spinToggleElement);
    spinLabel.appendChild(spinText);

    actions.appendChild(spinLabel);

    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'critter-controls__reset';
    resetButton.textContent = 'Reset view';
    resetButton.addEventListener('click', () => this.onResetView?.());
    actions.appendChild(resetButton);

    wrapper.appendChild(heading);
    wrapper.appendChild(helper);
    wrapper.appendChild(selectWrapper);
    wrapper.appendChild(actions);

    this.container.appendChild(wrapper);
  }

  setSelectedCritter(critterId) {
    this.selectedCritterId = critterId;
    if (this.selectElement) {
      this.selectElement.value = critterId ?? '';
    }
  }

  setAutoSpinState(enabled) {
    this.autoSpinEnabled = enabled;
    if (this.spinToggleElement) {
      this.spinToggleElement.checked = enabled;
    }
  }

  setCritters(critters) {
    this.critters = critters;
    this.render();
  }
}
