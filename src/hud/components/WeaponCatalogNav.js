export class WeaponCatalogNav {
  constructor({ element, categories = [], weaponsByCategory = {}, onSelect }) {
    this.element = element;
    this.categories = categories;
    this.weaponsByCategory = weaponsByCategory;
    this.onSelect = onSelect;
    this.buttons = new Map();
    this.activeWeaponId = null;
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.buttons.clear();
    this.element.classList.add('catalog-selector');

    this.categories.forEach((category) => {
      const section = document.createElement('details');
      section.className = 'catalog-category';

      const heading = document.createElement('summary');
      heading.className = 'catalog-category__title';
      heading.textContent = category.label;
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'catalog-category__list';
      const weapons = this.weaponsByCategory[category.id] || [];

      if (weapons.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'nav-empty';
        emptyState.textContent = 'No gear catalogued yet.';
        list.appendChild(emptyState);
      } else {
        weapons.forEach((weapon) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'catalog-button';
          button.dataset.weaponId = weapon.id;
          button.textContent = weapon.name;
          button.setAttribute('role', 'button');
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

      section.appendChild(list);
      this.element.appendChild(section);
    });
  }

  handleSelection(weaponId) {
    if (this.activeWeaponId === weaponId) return;
    this.setActiveWeapon(weaponId);
    this.onSelect?.(weaponId);
  }

  setActiveWeapon(weaponId) {
    this.activeWeaponId = weaponId || null;
    this.buttons.forEach((button, id) => {
      const isActive = id === weaponId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
}
