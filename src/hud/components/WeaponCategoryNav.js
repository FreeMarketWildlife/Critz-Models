const DEFAULT_CATEGORY_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  melee: 'Melee',
  utility: 'Utility',
};

export class WeaponCategoryNav {
  constructor({ element, categories = [], weaponsByCategory = {}, onSelect }) {
    this.element = element;
    this.categories = categories;
    this.weaponsByCategory = weaponsByCategory;
    this.onSelect = onSelect;
    this.buttons = new Map();
    this.activeWeaponId = null;
  }

  setWeaponsByCategory(weaponsByCategory) {
    this.weaponsByCategory = weaponsByCategory;
    this.render();
  }

  render() {
    if (!this.element) return;
    this.element.innerHTML = '';
    this.buttons.clear();

    this.categories.forEach((category) => {
      const details = document.createElement('details');
      details.className = 'nav-category';

      const summary = document.createElement('summary');
      summary.className = 'nav-category__title';
      summary.textContent = DEFAULT_CATEGORY_LABELS[category] || this.prettify(category);
      details.appendChild(summary);

      const list = document.createElement('div');
      list.className = 'nav-category__list';

      const weapons = this.weaponsByCategory[category] || [];
      if (!weapons.length) {
        const empty = document.createElement('p');
        empty.className = 'nav-empty';
        empty.textContent = 'No gear catalogued yet.';
        list.appendChild(empty);
      } else {
        weapons.forEach((weapon) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'nav-button';
          button.textContent = weapon.name;
          button.dataset.weaponId = weapon.id;
          button.addEventListener('click', () => this.handleSelection(weapon.id));
          button.addEventListener('keyup', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              this.handleSelection(weapon.id);
            }
          });
          list.appendChild(button);
          this.buttons.set(weapon.id, button);
        });
      }

      details.appendChild(list);
      this.element.appendChild(details);
    });

    this.setActiveWeapon(this.activeWeaponId);
  }

  handleSelection(weaponId) {
    if (this.activeWeaponId === weaponId) return;
    this.setActiveWeapon(weaponId);
    this.onSelect?.(weaponId);
  }

  setActiveWeapon(weaponId) {
    this.activeWeaponId = weaponId;
    this.buttons.forEach((button, id) => {
      const isActive = id === weaponId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  prettify(value) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
  }
}
