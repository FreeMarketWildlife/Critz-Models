const DEFAULT_CATEGORY_LABELS = {
  reptiles: 'Reptiles',
  amphibians: 'Amphibians',
  mammals: 'Mammals',
  birds: 'Birds',
  insects: 'Insects',
};

export class CritterSelector {
  constructor({ element, critters = [], categories = [], bus }) {
    this.element = element;
    this.critters = critters;
    this.categories = categories;
    this.bus = bus;
    this.activeId = null;
    this.buttons = new Map();
  }

  render(defaultId, { autoSelect = true } = {}) {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.buttons.clear();
    this.element.setAttribute('role', 'radiogroup');
    this.element.classList.add('critter-selector');

    const grouped = this.groupCrittersByCategory();

    grouped.forEach(({ id, label, critters }) => {
      const section = document.createElement('details');
      section.className = 'critter-category nav-subsection';

      const heading = document.createElement('summary');
      heading.className = 'critter-category__title';
      heading.textContent = label;
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'critter-category__list';
      list.dataset.scroll = 'nav-subsection';

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

    const initialId = defaultId || (autoSelect ? this.critters[0]?.id || null : null);
    if (initialId && autoSelect) {
      this.selectCritter(initialId, { emit: false });
    }
  }

  groupCrittersByCategory() {
    const categoryOrder = this.categories.length
      ? this.categories
      : Object.keys(DEFAULT_CATEGORY_LABELS).map((id) => ({
          id,
          label: DEFAULT_CATEGORY_LABELS[id],
        }));

    const bucketed = new Map();
    categoryOrder.forEach((category) => {
      bucketed.set(category.id, {
        id: category.id,
        label: category.label || DEFAULT_CATEGORY_LABELS[category.id] || category.id,
        critters: [],
      });
    });

    this.critters.forEach((critter) => {
      const categoryId = critter.category || 'other';
      if (!bucketed.has(categoryId)) {
        bucketed.set(categoryId, {
          id: categoryId,
          label: DEFAULT_CATEGORY_LABELS[categoryId] || categoryId,
          critters: [],
        });
      }
      bucketed.get(categoryId).critters.push(critter);
    });

    return Array.from(bucketed.values()).filter((group) => group.critters.length > 0);
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
