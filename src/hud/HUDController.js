import { WeaponDetailPanel } from './components/WeaponDetailPanel.js';
import { WeaponCategoryMenu } from './components/WeaponCategoryMenu.js';
import { WEAPON_CATEGORIES } from '../data/weaponSchema.js';

const CATEGORY_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  melee: 'Melee',
  utility: 'Utility',
};

export class HUDController {
  constructor({ bus, categoryMenuElement, detailPanel, rarityBadge, detailFooter }) {
    this.bus = bus;
    this.categoryMenuElement = categoryMenuElement;
    this.detailPanelElement = detailPanel;

    this.weaponCategoryMenu = null;
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

    this.weaponCategoryMenu = new WeaponCategoryMenu({
      element: this.categoryMenuElement,
      categories: categories.map((category) => ({
        id: category,
        label: CATEGORY_LABELS[category] || this.prettify(category),
      })),
      weaponsByCategory: this.weaponsByCategory,
      activeCategory: this.activeCategory,
      activeWeaponId: this.activeWeaponId,
      onSelect: (weaponId) => this.handleWeaponSelection(weaponId),
      onCategorySelect: (category) => this.handleCategoryChange(category),
    });
    this.weaponCategoryMenu.render();

    this.weaponDetailPanel = new WeaponDetailPanel({
      panelElement: this.detailPanelElement,
      rarityBadge: this.rarityBadge,
      footerElement: this.detailFooter,
    });

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
    this.activeWeaponId = null;
    this.weaponCategoryMenu?.setActiveWeapon(null);
    this.weaponDetailPanel.renderEmpty();
    this.bus.emit('hud:category-changed', category);
  }

  handleWeaponSelection(weaponId) {
    this.selectWeapon(weaponId, { emit: true });
  }

  selectWeapon(weaponId, { emit }) {
    this.activeWeaponId = weaponId;
    this.weaponCategoryMenu?.setActiveWeapon(weaponId);
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

  showLibraryInfo({ title, description, footer }) {
    this.activeWeaponId = null;
    this.weaponCategoryMenu?.setActiveWeapon(null);
    this.weaponDetailPanel.renderPlaceholder({ title, description, footer });
  }

  clearInfo() {
    this.activeWeaponId = null;
    this.weaponCategoryMenu?.setActiveWeapon(null);
    this.weaponDetailPanel.renderEmpty();
  }

  showCustomPanel({ title, footer, className }) {
    this.activeWeaponId = null;
    this.weaponCategoryMenu?.setActiveWeapon(null);
    return this.weaponDetailPanel.renderCustom({ title, footer, className });
  }

  showCritterInfo(critter) {
    if (!critter) {
      this.weaponDetailPanel.renderEmpty();
      return;
    }

    const stats = critter.stats ?? {};
    const health = stats.health ?? '--';
    const speed = stats.speed ?? '--';
    const stamina = stats.stamina ?? '--';
    const bonus = stats.bonus ? `<br /><br />Bonus: ${stats.bonus}` : '';

    this.activeWeaponId = null;
    this.weaponCategoryMenu?.setActiveWeapon(null);
    this.weaponDetailPanel.renderPlaceholder({
      title: critter.name ?? 'Critter',
      description: `Health: ${health} · Speed: ${speed} · Stamina: ${stamina}${bonus}`,
      footer: `Critter ID: ${critter.id}`,
    });
  }
}
