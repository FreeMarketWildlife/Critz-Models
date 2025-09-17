const SELECT_ID = 'critter-selector';
const SPIN_ID = 'critter-auto-spin';

export class CritterSelector {
  constructor({ element, critters = [], defaultCritterId = null, autoSpin = true, onCritterChange, onSpinToggle }) {
    this.element = element;
    this.critters = critters;
    this.activeCritterId = defaultCritterId;
    this.autoSpin = autoSpin;
    this.onCritterChange = onCritterChange;
    this.onSpinToggle = onSpinToggle;

    this.selectElement = null;
    this.spinInput = null;
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.element.classList.add('critter-controls');

    const title = document.createElement('div');
    title.className = 'critter-controls__title';
    title.textContent = 'Character Viewer';

    const subtitle = document.createElement('p');
    subtitle.className = 'critter-controls__subtitle';
    subtitle.textContent = 'Preview any critter on the stage.';

    const selectLabel = document.createElement('label');
    selectLabel.className = 'critter-controls__label';
    selectLabel.setAttribute('for', SELECT_ID);
    selectLabel.textContent = 'Critter';

    const select = document.createElement('select');
    select.id = SELECT_ID;
    select.className = 'critter-controls__select';
    select.disabled = this.critters.length === 0;

    const sortedCritters = [...this.critters].sort((a, b) => a.name.localeCompare(b.name));

    sortedCritters.forEach((critter) => {
      const option = document.createElement('option');
      option.value = critter.id;
      option.textContent = critter.name;
      if (critter.id === this.activeCritterId) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      const { value } = select;
      this.activeCritterId = value || null;
      this.onCritterChange?.(this.activeCritterId);
    });

    this.selectElement = select;

    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'critter-controls__field';
    selectWrapper.appendChild(selectLabel);
    selectWrapper.appendChild(select);

    const spinLabel = document.createElement('label');
    spinLabel.className = 'critter-controls__toggle';
    spinLabel.setAttribute('for', SPIN_ID);

    const spinInput = document.createElement('input');
    spinInput.type = 'checkbox';
    spinInput.id = SPIN_ID;
    spinInput.checked = this.autoSpin;
    spinInput.addEventListener('change', () => {
      this.autoSpin = Boolean(spinInput.checked);
      this.onSpinToggle?.(this.autoSpin);
    });

    this.spinInput = spinInput;

    const spinText = document.createElement('span');
    spinText.textContent = 'Auto-spin preview';

    spinLabel.appendChild(spinInput);
    spinLabel.appendChild(spinText);

    const instructions = document.createElement('p');
    instructions.className = 'critter-controls__instructions';
    instructions.textContent = 'Drag to orbit, scroll to zoom, right-click to pan.';

    if (this.critters.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'critter-controls__empty';
      emptyState.textContent = 'Critter library coming soon.';
      this.element.append(title, subtitle, emptyState, spinLabel, instructions);
      return;
    }

    this.element.append(title, subtitle, selectWrapper, spinLabel, instructions);
  }

  setCritter(critterId) {
    this.activeCritterId = critterId;
    if (this.selectElement) {
      this.selectElement.value = critterId ?? '';
    }
  }

  setAutoSpin(autoSpin) {
    this.autoSpin = Boolean(autoSpin);
    if (this.spinInput) {
      this.spinInput.checked = this.autoSpin;
    }
  }
}
