export class CritterSelector {
  constructor({ element, critters = [], bus }) {
    this.element = element;
    this.critters = critters;
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

    const grouped = this.groupCrittersByCategory();
    grouped.forEach(({ label, critters }) => {
      const section = document.createElement('div');
      section.className = 'critter-group';

      const title = document.createElement('h3');
      title.className = 'critter-group-title';
      title.textContent = label;
      section.appendChild(title);

      const list = document.createElement('div');
      list.className = 'critter-group-list';
      critters.forEach((critter) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'critter-button';
        button.dataset.critterId = critter.id;
        button.textContent = critter.name;
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-checked', 'false');
        button.addEventListener('click', () => this.selectCritter(critter.id, { emit: true }));
        list.appendChild(button);
        this.buttons.set(critter.id, button);
      });

      section.appendChild(list);
      this.element.appendChild(section);
    });

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

  groupCrittersByCategory() {
    const order = ['reptiles', 'amphibians', 'mammals', 'birds', 'insects'];
    const labels = {
      reptiles: 'Reptiles',
      amphibians: 'Amphibians',
      mammals: 'Mammals',
      birds: 'Birds',
      insects: 'Insects',
    };

    const grouped = this.critters.reduce((acc, critter) => {
      const category = critter.category || 'other';
      const bucket = acc[category] || [];
      bucket.push(critter);
      acc[category] = bucket;
      return acc;
    }, {});

    Object.values(grouped).forEach((list) => {
      list.sort((a, b) => a.name.localeCompare(b.name));
    });

    const ordered = [];
    order.forEach((category) => {
      if (grouped[category]?.length) {
        ordered.push({ label: labels[category] || this.prettify(category), critters: grouped[category] });
        delete grouped[category];
      }
    });

    Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .forEach((category) => {
        ordered.push({ label: labels[category] || this.prettify(category), critters: grouped[category] });
      });

    return ordered;
  }

  prettify(value) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
  }
}
