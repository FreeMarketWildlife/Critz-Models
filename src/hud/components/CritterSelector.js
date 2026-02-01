export class CritterSelector {
  constructor({ element, critters = [], sections = [], bus }) {
    this.element = element;
    this.critters = critters;
    this.sections = sections;
    this.bus = bus;
    this.activeId = null;
    this.buttons = new Map();
  }

  render(defaultId) {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.buttons.clear();
    this.element.setAttribute('role', 'radiogroup');
    this.element.classList.add('critter-selector');

    const critterMap = new Map(this.critters.map((critter) => [critter.id, critter]));

    if (this.sections.length > 0) {
      this.sections.forEach((section) => {
        const group = document.createElement('div');
        group.className = 'critter-group';

        const heading = document.createElement('h3');
        heading.className = 'critter-group-title';
        heading.textContent = section.label;
        group.appendChild(heading);

        const list = document.createElement('div');
        list.className = 'critter-group-list';

        section.critters.forEach((entry) => {
          const critter = critterMap.get(entry.id);
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'critter-button';
          button.textContent = entry.name ?? critter?.name ?? entry.id;
          button.setAttribute('role', 'radio');
          button.setAttribute('aria-pressed', 'false');
          button.setAttribute('aria-checked', 'false');

          if (critter) {
            button.dataset.critterId = critter.id;
            button.addEventListener('click', () => this.selectCritter(critter.id, { emit: true }));
            this.buttons.set(critter.id, button);
          } else {
            button.disabled = true;
            button.classList.add('critter-button--disabled');
            button.setAttribute('aria-disabled', 'true');
          }

          list.appendChild(button);
        });

        group.appendChild(list);
        this.element.appendChild(group);
      });
    } else {
      this.critters.forEach((critter) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'critter-button';
        button.dataset.critterId = critter.id;
        button.textContent = critter.name;
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-checked', 'false');
        button.addEventListener('click', () => this.selectCritter(critter.id, { emit: true }));
        this.element.appendChild(button);
        this.buttons.set(critter.id, button);
      });
    }

    const initialId = defaultId || this.critters[0]?.id || null;
    if (initialId) {
      this.selectCritter(initialId, { emit: false });
    }
  }

  selectCritter(id, { emit }) {
    if (!id || this.activeId === id) {
      if (emit && id) {
        this.bus?.emit?.('critter:selected', id);
      }
      return;
    }

    this.activeId = id;

    this.buttons.forEach((button, critterId) => {
      const isActive = critterId === id;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    if (emit) {
      this.bus?.emit?.('critter:selected', id);
    }
  }
}
