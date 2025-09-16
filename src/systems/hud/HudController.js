import { NavigationMenu } from '../../ui/components/NavigationMenu.js';
import { WeaponDetails } from '../../ui/components/WeaponDetails.js';
import { WeaponList } from '../../ui/components/WeaponList.js';

export class HudController {
  constructor(rootElement, { eventBus, statSchema }) {
    this.rootElement = rootElement;
    this.eventBus = eventBus;
    this.statSchema = statSchema;

    this.categories = [];

    this.hudElement = null;
    this.categoryDescriptionElement = null;
    this.categoryLoreElement = null;

    this.navigation = new NavigationMenu({ eventBus: this.eventBus });
    this.weaponList = new WeaponList({ eventBus: this.eventBus });
    this.weaponDetails = new WeaponDetails({ statSchema: this.statSchema });

    this.#mount();
    this.#registerEventHandlers();
  }

  setCategories(categories) {
    this.categories = categories;
    this.navigation.setCategories(categories);
  }

  #mount() {
    this.rootElement.innerHTML = '';

    this.hudElement = document.createElement('div');
    this.hudElement.className = 'hud';

    const topRow = document.createElement('div');
    topRow.className = 'hud__top';

    const brand = document.createElement('div');
    brand.className = 'hud__brand';
    brand.textContent = 'Crtiz';

    topRow.appendChild(brand);
    topRow.appendChild(this.navigation.getElement());

    const body = document.createElement('div');
    body.className = 'hud__body';

    const panels = document.createElement('div');
    panels.className = 'hud__panels';

    const listPanel = document.createElement('section');
    listPanel.className = 'hud__panel hud__panel--list';

    const listTitle = document.createElement('h3');
    listTitle.className = 'hud__panel-title';
    listTitle.textContent = 'Arsenal Index';

    this.categoryDescriptionElement = document.createElement('p');
    this.categoryDescriptionElement.className = 'hud__panel-description';

    listPanel.append(listTitle, this.categoryDescriptionElement, this.weaponList.getElement());

    const detailsPanel = document.createElement('section');
    detailsPanel.className = 'hud__panel hud__panel--details';

    const detailTitle = document.createElement('h3');
    detailTitle.className = 'hud__panel-title';
    detailTitle.textContent = 'Weapon Dossier';

    detailsPanel.append(detailTitle, this.weaponDetails.getElement());

    panels.append(listPanel, detailsPanel);

    this.categoryLoreElement = document.createElement('div');
    this.categoryLoreElement.className = 'footer-runes';

    body.append(panels, this.categoryLoreElement);

    this.hudElement.append(topRow, body);
    this.rootElement.appendChild(this.hudElement);
  }

  #registerEventHandlers() {
    this.eventBus.on('category:selected', ({ category }) => {
      if (!category) {
        return;
      }
      this.navigation.setActiveCategory(category.id);
      this.weaponList.setWeapons(category.weapons || []);
      this.weaponDetails.setEmptyState();
      this.#updateCategoryCopy(category);
      this.#applyTheme(category.theme);
    });

    this.eventBus.on('weapon:selected', ({ weapon, category }) => {
      if (!weapon) {
        this.weaponDetails.setEmptyState();
        return;
      }
      this.weaponList.setActiveWeapon(weapon.id);
      this.weaponDetails.update(weapon, category);
    });
  }

  #updateCategoryCopy(category) {
    this.categoryDescriptionElement.textContent = category.description || '';
    this.categoryLoreElement.textContent = category.lore || '';
  }

  #applyTheme(theme) {
    if (!theme) {
      this.hudElement.style.removeProperty('--color-accent');
      this.hudElement.style.removeProperty('--color-accent-strong');
      this.hudElement.style.removeProperty('--color-accent-soft');
      return;
    }

    const accent = theme.primaryColor || '#f7c77d';
    const accentStrong = theme.secondaryColor || accent;

    this.hudElement.style.setProperty('--color-accent', accent);
    this.hudElement.style.setProperty('--color-accent-strong', accentStrong);
    this.hudElement.style.setProperty('--color-accent-soft', this.#withAlpha(accent, 0.18));
  }

  #withAlpha(hex, alpha) {
    if (!hex || typeof hex !== 'string') {
      return `rgba(247, 199, 125, ${alpha})`;
    }

    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) {
      return `rgba(247, 199, 125, ${alpha})`;
    }

    const bigint = parseInt(normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
