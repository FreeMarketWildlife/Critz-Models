const DEFAULT_CATEGORY_LABELS = {
  reptiles: 'Reptiles',
  amphibians: 'Amphians',
  mammals: 'Mammals',
  birds: 'Birds',
  anthropods: 'Anthropods',
};

export class CritterSelector {
  constructor({ element, critters = [], categories = [], bus }) {
    this.element = element;
    this.critters = critters;
    this.categories = categories;
    this.bus = bus;
    this.activeCategoryId = null;
    this.buttons = new Map();
  }

  render(defaultCategoryId) {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.buttons.clear();
    this.element.setAttribute('role', 'listbox');
    this.element.classList.add('critter-selector');

    const categoryList = this.getCategoryList();
    const list = document.createElement('div');
    list.className = 'critter-category-list';

    categoryList.forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'critter-button critter-button--folder';
      button.dataset.categoryId = category.id;
      button.textContent = category.label;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', 'false');
      button.addEventListener('click', () => this.setActiveCategory(category.id, { emit: true }));
      list.appendChild(button);
      this.buttons.set(category.id, button);
    });

    this.element.appendChild(list);

    const initialId = defaultCategoryId || categoryList[0]?.id || null;
    if (initialId && this.buttons.has(initialId)) {
      this.setActiveCategory(initialId, { emit: false });
    }
  }

  getCategoryList() {
    const configuredCategories = this.categories.length
      ? this.categories
      : Object.keys(DEFAULT_CATEGORY_LABELS).map((id) => ({
          id,
          label: DEFAULT_CATEGORY_LABELS[id],
        }));

    const derivedIds = new Set(this.critters.map((critter) => critter.category).filter(Boolean));
    const configuredIds = new Set(configuredCategories.map((category) => category.id));

    const extras = Array.from(derivedIds)
      .filter((id) => !configuredIds.has(id))
      .map((id) => ({
        id,
        label: DEFAULT_CATEGORY_LABELS[id] || id,
      }));

    return [...configuredCategories, ...extras].map((category) => ({
      id: category.id,
      label: category.label || DEFAULT_CATEGORY_LABELS[category.id] || category.id,
    }));
  }

  setActiveCategory(categoryId, { emit = true } = {}) {
    if (!categoryId) {
      this.activeCategoryId = null;
      this.buttons.forEach((button) => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      });
      return;
    }

    if (!this.buttons.has(categoryId)) {
      return;
    }

    if (this.activeCategoryId === categoryId) {
      if (emit) {
        this.bus?.emit?.('critter:category-selected', categoryId);
      }
      return;
    }

    this.activeCategoryId = categoryId;

    this.buttons.forEach((button, id) => {
      const isActive = id === categoryId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (emit) {
      this.bus?.emit?.('critter:category-selected', categoryId);
    }
  }
}
