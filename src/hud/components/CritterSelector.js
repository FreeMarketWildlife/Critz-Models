export class CritterSelector {
  constructor({ element, onSelect }) {
    this.element = element ?? null;
    this.onSelect = onSelect ?? null;
    this.optionsContainer = this.element?.querySelector('[data-role="critter-options"]') ?? this.element;
    this.critters = [];
    this.buttons = new Map();
    this.activeId = null;

    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  setCritters(critters = []) {
    this.critters = Array.isArray(critters) ? critters : [];
    this.render();
  }

  setActive(critterId) {
    this.activeId = critterId ?? null;
    this.buttons.forEach((button, id) => {
      const isActive = id === this.activeId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  render() {
    if (!this.optionsContainer) {
      console.warn('CritterSelector options container was not found.');
      return;
    }

    this.buttons.clear();
    this.optionsContainer.innerHTML = '';

    this.critters.forEach((critter) => {
      const button = this.createOptionButton(critter);
      this.optionsContainer.appendChild(button);
      this.buttons.set(critter.id, button);
    });

    if (this.activeId) {
      this.setActive(this.activeId);
    }
  }

  createOptionButton(critter) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'critter-card';
    button.dataset.critterId = critter.id;
    button.setAttribute('aria-pressed', 'false');

    const name = document.createElement('span');
    name.className = 'critter-card__name';
    name.textContent = critter.shortName || critter.name || critter.id;

    const tagline = document.createElement('span');
    tagline.className = 'critter-card__tagline';
    tagline.textContent = critter.tagline || '';

    button.appendChild(name);
    button.appendChild(tagline);

    button.addEventListener('click', this.handleOptionClick);

    return button;
  }

  handleOptionClick(event) {
    const button = event.currentTarget;
    const critterId = button?.dataset?.critterId;
    if (!critterId || critterId === this.activeId) {
      return;
    }

    this.onSelect?.(critterId);
  }
}
