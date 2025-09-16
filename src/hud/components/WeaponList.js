import { deriveStatsList } from '../../data/weaponSchema.js';

export class WeaponList {
  constructor({ panelElement, onSelect }) {
    this.panelElement = panelElement;
    this.cardsContainer = panelElement.querySelector('[data-role="weapon-cards"]');
    this.onSelect = onSelect;
    this.cards = new Map();
    this.weapons = [];
    this.activeWeaponId = null;
  }

  setWeapons(weapons, defaultWeaponId = null) {
    this.weapons = weapons;
    this.render();
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
      emptyState.textContent = 'No relics have been attuned for this wing yet.';
      this.cardsContainer.appendChild(emptyState);
      return;
    }

    this.weapons.forEach((weapon) => {
      const card = this.createCard(weapon);
      this.cardsContainer.appendChild(card);
      this.cards.set(weapon.id, card);
    });
  }

  createCard(weapon) {
    const card = document.createElement('article');
    card.className = 'weapon-card';
    card.tabIndex = 0;
    card.dataset.weaponId = weapon.id;

    const title = document.createElement('h3');
    title.textContent = weapon.name;
    card.appendChild(title);

    const stats = deriveStatsList(weapon);
    const weightStat = stats.find((stat) => stat.key === 'weight') || null;
    const rangeStat = stats.find((stat) => stat.key === 'range') || null;
    const coreStats = stats.filter(
      (stat) => stat.key !== 'weight' && stat.key !== 'range'
    );
    const summaryStats = [];

    coreStats.slice(0, 2).forEach((stat) => summaryStats.push(stat));

    if (rangeStat && summaryStats.length < 4) {
      summaryStats.push(rangeStat);
    }

    if (summaryStats.length < 3) {
      const extraStat = coreStats.slice(2).find((stat) => !summaryStats.includes(stat));
      if (extraStat) {
        summaryStats.push(extraStat);
      }
    }

    if (weightStat && summaryStats.length < 4) {
      summaryStats.push(weightStat);
    }

    while (summaryStats.length < 4) {
      const filler = stats.find((stat) => !summaryStats.includes(stat));
      if (!filler) {
        break;
      }
      summaryStats.push(filler);
    }

    if (summaryStats.length > 0) {
      const statList = document.createElement('dl');
      summaryStats.forEach(({ label, value }) => {
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value;
        statList.appendChild(dt);
        statList.appendChild(dd);
      });
      card.appendChild(statList);
    }

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
