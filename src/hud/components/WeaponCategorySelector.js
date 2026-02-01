const CATEGORY_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  melee: 'Melee',
  utility: 'Utility',
};

export class WeaponCategorySelector {
  constructor({ element, weaponsByCategory = {}, categories = [], onSelect }) {
    this.element = element;
    this.weaponsByCategory = weaponsByCategory;
    this.categories = categories;
    this.onSelect = onSelect;
    this.activeId = null;
    this.buttons = new Map();
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.buttons.clear();
    this.element.classList.add('critter-selector');

    const categoryList = this.categories.length
      ? this.categories
      : Object.keys(this.weaponsByCategory);

    categoryList.forEach((category) => {
      const weapons = this.weaponsByCategory[category] || [];
      if (!weapons.length) return;

      const section = document.createElement('details');
      section.className = 'critter-category';

      const heading = document.createElement('summary');
      heading.className = 'critter-category__title';
      heading.textContent = CATEGORY_LABELS[category] || this.prettify(category);
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'critter-category__list';

      weapons.forEach((weapon) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'critter-button';
        button.dataset.weaponId = weapon.id;
        button.textContent = weapon.name;
        button.setAttribute('role', 'button');
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => this.selectWeapon(weapon.id));
        list.appendChild(button);
        this.buttons.set(weapon.id, button);
      });

      section.appendChild(list);
      this.element.appendChild(section);
    });
  }

  selectWeapon(id) {
    if (!id) return;
    this.activeId = id;
    this.buttons.forEach((button, weaponId) => {
      const isActive = weaponId === id;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    this.onSelect?.(id);
  }

  clearSelection() {
    this.activeId = null;
    this.buttons.forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-pressed', 'false');
    });
  }

  prettify(value) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
  }
}
