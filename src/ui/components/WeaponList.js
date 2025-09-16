export class WeaponList {
  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.element = document.createElement('div');
    this.element.className = 'weapon-list';
    this.items = new Map();
    this.emptyState = this.#createEmptyState();
    this.element.appendChild(this.emptyState);
  }

  getElement() {
    return this.element;
  }

  setWeapons(weapons = []) {
    this.element.innerHTML = '';
    this.items.clear();

    if (!weapons.length) {
      this.element.appendChild(this.emptyState);
      return;
    }

    weapons.forEach((weapon) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'weapon-list__item';

      const name = document.createElement('span');
      name.className = 'weapon-list__name';
      name.textContent = weapon.name;

      const type = document.createElement('span');
      type.className = 'weapon-list__type';
      type.textContent = weapon.role ? `${weapon.role}` : weapon.type;

      item.appendChild(name);
      item.appendChild(type);

      item.addEventListener('click', () => {
        this.eventBus.emit('weapon:requested', weapon.id);
      });

      this.items.set(weapon.id, item);
      this.element.appendChild(item);
    });
  }

  setActiveWeapon(weaponId) {
    this.items.forEach((item, id) => {
      item.classList.toggle('weapon-list__item--active', id === weaponId);
    });
  }

  #createEmptyState() {
    const paragraph = document.createElement('p');
    paragraph.className = 'hud__panel-description';
    paragraph.textContent = 'Weapons for this category will appear here.';
    return paragraph;
  }
}
