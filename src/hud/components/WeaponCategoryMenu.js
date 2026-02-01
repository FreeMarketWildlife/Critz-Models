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

    this.categories.forEach((category) => {
      const section = document.createElement('details');
      section.className = 'critter-category';
      if (category.id === this.activeCategory) {
        section.open = true;
      }

      const heading = document.createElement('summary');
      heading.className = 'critter-category__title';
      heading.textContent = category.label;
      section.appendChild(heading);

      section.addEventListener('toggle', () => {
        if (section.open) {
          this.handleCategorySelect(category.id);
        }
      });

      const list = document.createElement('div');
      list.className = 'critter-category__list';

      const weapons = this.weaponsByCategory[category.id] || [];
      weapons.forEach((weapon) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'critter-button';
        button.dataset.weaponId = weapon.id;
        button.textContent = weapon.name;
        button.setAttribute('role', 'button');
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => this.handleSelect(weapon.id));
        list.appendChild(button);
        this.buttons.set(weapon.id, button);
      });

      section.appendChild(list);
      this.element.appendChild(section);
    });

    this.setActiveWeapon(this.activeWeaponId);
  }

  handleSelect(weaponId) {
    this.setActiveWeapon(weaponId);
    this.onSelect?.(weaponId);
  }

  handleCategorySelect(categoryId) {
    if (categoryId === this.activeCategory) return;
    this.activeCategory = categoryId;
    this.onCategorySelect?.(categoryId);
  }

  setActiveWeapon(weaponId) {
    this.activeWeaponId = weaponId;
    this.buttons.forEach((button, id) => {
      const isActive = id === weaponId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }
}
