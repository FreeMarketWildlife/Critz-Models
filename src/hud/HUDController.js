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
      bus: this.bus,
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
    const changed = category !== this.activeCategory;
    this.activeCategory = category;
    this.weaponCategoryMenu?.setActiveCategory(category);
    if (changed) {
      this.activeWeaponId = null;
      this.weaponCategoryMenu?.setActiveWeapon(null);
      this.weaponDetailPanel.renderEmpty();
    }
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

  showCritterInfo(critter, { categoryLabel, editorState } = {}) {
    if (!critter) {
      this.weaponDetailPanel.renderEmpty();
      return;
    }

    this.activeWeaponId = null;
    this.weaponCategoryMenu?.setActiveWeapon(null);
    this.weaponDetailPanel.renderCritter(critter, { categoryLabel, editorState });
  }

  showCritterCategoryGuide({ categoryLabel, critterCount }) {
    this.activeWeaponId = null;
    this.weaponCategoryMenu?.setActiveWeapon(null);

    const normalizedCount = Number.isFinite(critterCount) ? critterCount : 0;
    const plural = normalizedCount === 1 ? '' : 's';

    this.weaponDetailPanel.renderPlaceholder({
      title: categoryLabel ? `${categoryLabel} Critters` : 'Critters',
      description:
        normalizedCount > 0
          ? `Select a critter box in the center unlock map to view its 3D preview and stats. ${normalizedCount} critter${plural} currently listed in this category.`
          : 'No critters are listed in this category yet. Awaiting Data Entry.',
      footer: 'Unlock rules are shown under the map',
    });
  }

  showWeaponCategoryGuide({ categoryLabel, weaponCount }) {
    this.activeWeaponId = null;
    this.weaponCategoryMenu?.setActiveWeapon(null);

    const normalizedCount = Number.isFinite(weaponCount) ? weaponCount : 0;
    const plural = normalizedCount === 1 ? '' : 's';

    this.weaponDetailPanel.renderPlaceholder({
      title: categoryLabel ? `${categoryLabel} Weapons & Tools` : 'Weapons & Tools',
      description:
        normalizedCount > 0
          ? `Select a weapon node in the center map to view its preview and stats. ${normalizedCount} weapon${plural} currently listed in this category.`
          : 'No weapons or tools are listed in this category yet. Awaiting Data Entry.',
      footer: 'Weapon tree data is active in the center window',
    });
  }
}
