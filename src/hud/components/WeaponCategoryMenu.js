export class WeaponCategoryMenu {
  constructor({
    element,
    categories = [],
    weaponsByCategory = {},
    activeCategory,
    activeWeaponId,
    onSelect,
    onCategorySelect,
  }) {
    this.element = element;
    this.categories = categories;
    this.weaponsByCategory = weaponsByCategory;
    this.activeCategory = activeCategory;
    this.activeWeaponId = activeWeaponId;
    this.onSelect = onSelect;
    this.onCategorySelect = onCategorySelect;
    this.buttons = new Map();
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.buttons.clear();
    this.element.classList.add('critter-selector');
    const list = document.createElement('div');
    list.className = 'critter-category-list';

    this.categories.forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'critter-button critter-button--folder';
      button.dataset.categoryId = category.id;
      button.textContent = category.label;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', category.id === this.activeCategory ? 'true' : 'false');
      button.addEventListener('click', () => this.handleCategorySelect(category.id));
      list.appendChild(button);
      this.buttons.set(category.id, button);
    });

    this.element.appendChild(list);
    this.setActiveCategory(this.activeCategory);
  }

  handleSelect(weaponId) {
    this.setActiveWeapon(weaponId);
    this.onSelect?.(weaponId);
  }

  handleCategorySelect(categoryId) {
    this.setActiveCategory(categoryId);
    this.onCategorySelect?.(categoryId);
  }

  setActiveWeapon(weaponId) {
    this.activeWeaponId = weaponId;
  }

  setActiveCategory(categoryId) {
    this.activeCategory = categoryId;
    this.buttons.forEach((button, id) => {
      const isActive = Boolean(categoryId) && id === categoryId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
}
