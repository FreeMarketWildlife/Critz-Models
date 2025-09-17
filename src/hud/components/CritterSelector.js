export class CritterSelector {
  constructor({ element, critters = [], activeCritterId = null, onSelect }) {
    this.element = element;
    this.critters = critters;
    this.activeCritterId = activeCritterId;
    this.onSelect = onSelect;
    this.buttons = new Map();
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.buttons.clear();

    const list = document.createElement('div');
    list.className = 'critter-selector-buttons';

    this.critters.forEach((critter) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'critter-button';
      button.dataset.critterId = critter.id;
      button.textContent = critter.name;
      if (critter.accentColor) {
        button.style.setProperty('--critter-accent', critter.accentColor);
      }

      if (critter.id === this.activeCritterId) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.setAttribute('aria-pressed', 'false');
      }

      button.addEventListener('click', () => this.handleSelect(critter.id));
      button.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.handleSelect(critter.id);
        }
      });

      this.buttons.set(critter.id, button);
      list.appendChild(button);
    });

    this.element.appendChild(list);
  }

  handleSelect(critterId) {
    if (this.activeCritterId === critterId) return;
    this.setActive(critterId);
    this.onSelect?.(critterId);
  }

  setActive(critterId) {
    this.activeCritterId = critterId;
    this.buttons.forEach((button, id) => {
      const isActive = id === critterId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }
}
