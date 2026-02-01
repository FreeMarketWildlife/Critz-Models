import { WeaponCatalogNav } from './components/WeaponCatalogNav.js';
import { WeaponDetailPanel } from './components/WeaponDetailPanel.js';
import { WEAPON_CATEGORIES } from '../data/weaponSchema.js';

const CATEGORY_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  melee: 'Melee',
  utility: 'Utility',
};

export class HUDController {
  constructor({
    bus,
    detailPanel,
    catalogElement,
    rarityBadge,
    detailFooter,
  }) {
    this.bus = bus;
    this.catalogElement = catalogElement;
    this.detailPanelElement = detailPanel;

    this.weaponCatalogNav = null;
    this.weaponDetailPanel = null;

    this.weaponsByCategory = {};
    this.weaponMap = new Map();

    this.activeCategory = WEAPON_CATEGORIES[0];
    this.activeWeaponId = null;
    this.rarityBadge = rarityBadge;
    this.detailFooter = detailFooter;
  }

  init({ categories, weaponsByCategory, defaultCategory, defaultWeaponId }) {
    this.weaponsByCategory = weaponsByCategory;
    this.activeCategory = defaultCategory || categories[0] || WEAPON_CATEGORIES[0];
    this.activeWeaponId = defaultWeaponId || null;
    this.buildWeaponIndex();

    this.weaponCatalogNav = new WeaponCatalogNav({
      element: this.catalogElement,
      categories: categories.map((category) => ({
        id: category,
        label: CATEGORY_LABELS[category] || this.prettify(category),
      })),
      weaponsByCategory: this.weaponsByCategory,
      onSelect: (weaponId) => this.handleWeaponSelection(weaponId),
    });
    this.weaponCatalogNav.render();

    this.weaponDetailPanel = new WeaponDetailPanel({
      panelElement: this.detailPanelElement,
      rarityBadge: this.rarityBadge,
      footerElement: this.detailFooter,
    });

    if (this.activeWeaponId) {
      this.selectWeapon(this.activeWeaponId, { emit: false });
    }

    this.bus.on('nav:info-selected', (payload) => {
      this.showPlaceholder(payload);
    });
  }

  buildWeaponIndex() {
    this.weaponMap.clear();
    Object.values(this.weaponsByCategory).forEach((list = []) => {
      list.forEach((weapon) => this.weaponMap.set(weapon.id, weapon));
    });
  }

  handleWeaponSelection(weaponId) {
    this.selectWeapon(weaponId, { emit: true });
  }

  selectWeapon(weaponId, { emit }) {
    this.activeWeaponId = weaponId;
    this.weaponCatalogNav.setActiveWeapon(weaponId);
    const weapon = this.weaponMap.get(weaponId) || null;
    this.weaponDetailPanel.render(weapon);

    if (weapon && emit) {
      this.activeCategory = weapon.category || this.activeCategory;
      this.bus.emit('hud:weapon-selected', weapon.id);
      if (weapon.category) {
        this.bus.emit('hud:category-changed', weapon.category);
      }
    } else if (!weapon) {
      this.activeWeaponId = null;
    }
  }

  showPlaceholder({ type, label } = {}) {
    this.activeWeaponId = null;
    this.weaponCatalogNav?.setActiveWeapon(null);

    const typeLabel = type === 'mode' ? 'Game Mode' : type === 'map' ? 'Map' : 'Entry';
    this.weaponDetailPanel.renderPlaceholder({
      title: label || 'Info',
      description: 'Info coming soon.',
      footer: `${typeLabel} details are on deck.`,
    });
  }

  prettify(value) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
  }
}
