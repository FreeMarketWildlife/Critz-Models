export class CritterSelector {
  constructor({ element, critters = [], activeCritterId = null, onSelect }) {
    this.element = element;
    this.critters = critters;
    this.activeCritterId = activeCritterId;
    this.onSelect = onSelect;
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = `
      <div class="critter-selector-grid">
        ${this.critters
          .map((critter) => this.createButtonMarkup(critter))
          .join('')}
      </div>
    `;

    this.element
      .querySelectorAll('[data-role="critter-button"]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const critterId = button.getAttribute('data-critter-id');
          this.setActive(critterId);
          if (typeof this.onSelect === 'function') {
            this.onSelect(critterId);
          }
        });
      });

    this.setActive(this.activeCritterId);
  }

  createButtonMarkup(critter) {
    const isActive = critter.id === this.activeCritterId;
    const activeClass = isActive ? ' is-active' : '';
    const ariaPressed = isActive ? 'true' : 'false';

    return `
      <button
        type="button"
        class="critter-button${activeClass}"
        data-role="critter-button"
        data-critter-id="${critter.id}"
        aria-pressed="${ariaPressed}"
      >
        <span class="critter-name">${critter.name}</span>
      </button>
    `;
  }

  setActive(critterId) {
    this.activeCritterId = critterId;
    if (!this.element) return;

    this.element
      .querySelectorAll('[data-role="critter-button"]')
      .forEach((button) => {
        const isMatch = button.getAttribute('data-critter-id') === critterId;
        button.classList.toggle('is-active', isMatch);
        button.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
  }
}

