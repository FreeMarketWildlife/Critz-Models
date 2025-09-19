export class WeaponList {
  constructor({ panelElement, footerElement, onSelect }) {
    this.panelElement = panelElement;
    this.cardsContainer = panelElement.querySelector('[data-role="weapon-cards"]');
    this.footerElement = footerElement;
    this.onSelect = onSelect;
    this.cards = new Map();
    this.weapons = [];
    this.activeWeaponId = null;
  }

  setWeapons(weapons, defaultWeaponId = null) {
    this.weapons = weapons;
    this.render();
    this.updateFooter();
    if (defaultWeaponId) {
      this.setActiveWeapon(defaultWeaponId);
    }
  }

  render() {
    this.cardsContainer.innerHTML = '';
    this.cards.clear();

    if (!this.weapons || this.weapons.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'description';
      emptyState.textContent = 'Nothing is available in this category yet.';
      this.cardsContainer.appendChild(emptyState);
      return;
    }

    this.weapons.forEach((weapon) => {
      const card = this.createCard(weapon);
      this.cardsContainer.appendChild(card);
      this.cards.set(weapon.id, card);
    });
  }

  updateFooter() {
    if (!this.footerElement) return;
    const count = this.weapons?.length ?? 0;
    if (count === 0) {
      this.footerElement.textContent = 'No gear catalogued yet.';
      return;
    }
    this.footerElement.textContent = 'Browse the armory and pick your loadout.';
  }

  createCard(weapon) {
    const card = document.createElement('article');
    card.className = 'weapon-card';
    card.tabIndex = 0;
    card.dataset.weaponId = weapon.id;

    const title = document.createElement('h3');
    title.textContent = weapon.name;
    card.appendChild(title);

    card.addEventListener('click', () => this.handleSelection(weapon.id));
    card.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.handleSelection(weapon.id);
      }
    });

    return card;
  }

  handleSelection(weaponId) {
    if (this.activeWeaponId === weaponId) return;
    this.setActiveWeapon(weaponId);
    this.onSelect?.(weaponId);
  }

  setActiveWeapon(weaponId) {
    this.activeWeaponId = weaponId;
    this.cards.forEach((card, id) => {
      if (id === weaponId) {
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');
      } else {
        card.classList.remove('active');
        card.setAttribute('aria-selected', 'false');
      }
    });
  }
}
