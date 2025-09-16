import { NavigationTabs } from './components/NavigationTabs.js';
import { WeaponList } from './components/WeaponList.js';
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
    navElement,
    listPanel,
    detailPanel,
    listContextLabel,
    rarityBadge,
    detailFooter,
  }) {
    this.bus = bus;
    this.navElement = navElement;
    this.listPanel = listPanel;
    this.detailPanelElement = detailPanel;
    this.listContextLabel = listContextLabel;

    this.navigationTabs = null;
    this.weaponList = null;
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

    this.navigationTabs = new NavigationTabs({
      element: this.navElement,
      categories: categories.map((category) => ({
        id: category,
        label: CATEGORY_LABELS[category] || this.prettify(category),
      })),
      activeCategory: this.activeCategory,
      onSelect: (category) => this.handleCategoryChange(category),
    });
    this.navigationTabs.render();

    this.weaponList = new WeaponList({
      panelElement: this.listPanel,
      onSelect: (weaponId) => this.handleWeaponSelection(weaponId),
    });

    this.weaponDetailPanel = new WeaponDetailPanel({
      panelElement: this.detailPanelElement,
      rarityBadge: this.rarityBadge,
      footerElement: this.detailFooter,
    });

    this.refreshCategory(this.activeCategory, { announce: false });
    if (this.activeWeaponId) {
      this.selectWeapon(this.activeWeaponId, { emit: false });
    }
  }

  buildWeaponIndex() {
    this.weaponMap.clear();
    Object.values(this.weaponsByCategory).forEach((list = []) => {
      list.forEach((weapon) => this.weaponMap.set(weapon.id, weapon));
    });
  }

  handleCategoryChange(category) {
    if (category === this.activeCategory) return;
    this.activeCategory = category;
    this.refreshCategory(category, { announce: true });
  }

  refreshCategory(category, { announce }) {
    const weapons = this.weaponsByCategory[category] || [];
    this.listContextLabel.textContent = CATEGORY_LABELS[category] || this.prettify(category);
    this.navigationTabs.setActive(category);
    const defaultWeaponId = weapons[0]?.id ?? null;
    this.weaponList.setWeapons(weapons, defaultWeaponId);

    if (announce) {
      this.bus.emit('hud:category-changed', category);
    }

    if (weapons.length === 0) {
      this.selectWeapon(null, { emit: false });
      return;
    }

    const targetWeaponId = weapons.find((weapon) => weapon.id === this.activeWeaponId)?.id || defaultWeaponId;
    this.selectWeapon(targetWeaponId, { emit: false });
  }

  handleWeaponSelection(weaponId) {
    this.selectWeapon(weaponId, { emit: true });
  }

  selectWeapon(weaponId, { emit }) {
    this.activeWeaponId = weaponId;
    this.weaponList.setActiveWeapon(weaponId);
    const weapon = this.weaponMap.get(weaponId) || null;
    this.weaponDetailPanel.render(weapon);

    if (weapon && emit) {
      this.bus.emit('hud:weapon-selected', weapon.id);
    }
  }

  prettify(value) {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
  }
}
