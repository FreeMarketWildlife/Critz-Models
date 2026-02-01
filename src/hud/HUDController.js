import { WeaponDetailPanel } from './components/WeaponDetailPanel.js';
import { WeaponCategoryNav } from './components/WeaponCategoryNav.js';
import { NavButtonList } from './components/NavButtonList.js';

export class HUDController {
  constructor({
    bus,
    weaponNavElement,
    mapsNavElement,
    modesNavElement,
    detailPanel,
    rarityBadge,
    detailFooter,
    detailTitle,
  }) {
    this.bus = bus;
    this.weaponNavElement = weaponNavElement;
    this.mapsNavElement = mapsNavElement;
    this.modesNavElement = modesNavElement;
    this.detailPanelElement = detailPanel;

    this.weaponNavigation = null;
    this.mapsList = null;
    this.modesList = null;
    this.weaponDetailPanel = null;

    this.weaponsByCategory = {};
    this.weaponMap = new Map();
    this.rarityBadge = rarityBadge;
    this.detailFooter = detailFooter;
    this.detailTitle = detailTitle;
    this.activeContext = null;
  }

  init({ categories, weaponsByCategory, maps, modes }) {
    this.weaponsByCategory = weaponsByCategory;
    this.buildWeaponIndex();

    this.weaponNavigation = new WeaponCategoryNav({
      element: this.weaponNavElement,
      categories,
      weaponsByCategory,
      onSelect: (weaponId) => this.handleWeaponSelection(weaponId),
    });
    this.weaponNavigation.render();

    this.mapsList = new NavButtonList({
      element: this.mapsNavElement,
      items: maps,
      onSelect: (id) => this.handleLibrarySelection('map', id),
      emptyMessage: 'No maps have been catalogued yet.',
    });
    this.mapsList.render();

    this.modesList = new NavButtonList({
      element: this.modesNavElement,
      items: modes,
      onSelect: (id) => this.handleLibrarySelection('mode', id),
      emptyMessage: 'No game modes have been catalogued yet.',
    });
    this.modesList.render();

    this.weaponDetailPanel = new WeaponDetailPanel({
      panelElement: this.detailPanelElement,
      rarityBadge: this.rarityBadge,
      footerElement: this.detailFooter,
      titleElement: this.detailTitle,
    });

    this.weaponDetailPanel.renderEmpty();
  }

  buildWeaponIndex() {
    this.weaponMap.clear();
    Object.values(this.weaponsByCategory).forEach((list = []) => {
      list.forEach((weapon) => this.weaponMap.set(weapon.id, weapon));
    });
  }

  handleWeaponSelection(weaponId) {
    this.selectWeapon(weaponId, { emit: true });
    this.mapsList?.setActive(null);
    this.modesList?.setActive(null);
  }

  selectWeapon(weaponId, { emit }) {
    this.weaponNavigation.setActiveWeapon(weaponId);
    const weapon = this.weaponMap.get(weaponId) || null;
    this.weaponDetailPanel.renderWeapon(weapon);
    this.activeContext = weapon ? { type: 'weapon', id: weaponId } : null;

    if (weapon && emit) {
      this.bus.emit('hud:weapon-selected', weapon.id);
    }
  }

  handleLibrarySelection(type, id) {
    const source = type === 'map' ? this.mapsList : this.modesList;
    const items = type === 'map' ? this.mapsList?.items : this.modesList?.items;
    const entry = items?.find((item) => item.id === id);
    if (!entry) return;
    source?.setActive(id);
    this.weaponNavigation.setActiveWeapon(null);
    this.weaponDetailPanel.renderPlaceholder(entry.label ?? entry.name ?? entry.id);
    this.activeContext = { type, id };
  }
}
