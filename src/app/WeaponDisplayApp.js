import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { createEventBus } from '../utils/eventBus.js';

export class WeaponDisplayApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.eventBus = createEventBus();
    this.sceneManager = null;
    this.hudController = null;

    this.weapons = sampleWeapons;
    this.weaponMap = new Map();
    this.categories = ['primary', 'secondary', 'melee', 'utility'];
    this.activeCategory = 'primary';
    this.activeWeapon = null;
  }

  init() {
    const layout = this.buildLayout();
    this.indexWeapons();
    this.registerEventHandlers();

    this.sceneManager = new SceneManager(layout.stageElement);
    this.sceneManager.init();

    this.hudController = new HUDController({
      bus: this.eventBus,
      navElement: layout.navTabsElement,
      listPanel: layout.weaponListPanel,
      detailPanel: layout.weaponDetailPanel,
      listContextLabel: layout.listContextLabel,
      listFooter: layout.listFooter,
      rarityBadge: layout.rarityBadge,
      detailFooter: layout.detailFooter,
    });

    const defaultWeapon = this.findDefaultWeapon();

    this.hudController.init({
      categories: this.categories,
      weaponsByCategory: this.groupWeaponsByCategory(),
      defaultCategory: this.activeCategory,
      defaultWeaponId: defaultWeapon ? defaultWeapon.id : null,
    });

    if (defaultWeapon) {
      this.activeWeapon = defaultWeapon;
      this.sceneManager.loadWeapon(defaultWeapon);
    }
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <div class="ambient-layers" aria-hidden="true">
          <div class="ambient ambient-canopy"></div>
          <div class="ambient ambient-dapple"></div>
          <div class="ambient ambient-haze"></div>
        </div>
        <header class="hud-brand">
          <div class="hud-brand-icon" aria-hidden="true"></div>
          <div class="hud-brand-copy">
            <span class="hud-brand-label">Crtiz Armory</span>
            <span class="hud-brand-subtitle">Sanctuary Arsenal</span>
          </div>
        </header>
        <nav class="hud-nav" aria-label="Weapon categories">
          <h2>Categories</h2>
          <ul class="nav-tabs" data-component="nav-tabs"></ul>
        </nav>
        <section class="panel hud-panel hud-list" data-component="weapon-list">
          <div class="panel-header">
            <span>Forest Arsenal</span>
            <span data-role="list-context"></span>
          </div>
          <div class="weapon-cards" data-role="weapon-cards"></div>
          <div class="panel-footer" data-role="list-footer">Select a path to explore its crafted gear.</div>
        </section>
        <section class="panel hud-panel hud-detail" data-component="weapon-detail">
          <div class="panel-header">
            <span>Artifact Lore</span>
            <span data-role="rarity-badge"></span>
          </div>
          <div class="detail-content" data-role="detail-content">
            <p class="description">Select a crafted artifact to reveal its story.</p>
          </div>
          <div class="panel-footer" data-role="detail-footer">Awaiting chosen artifact</div>
        </section>
        <section class="stage" data-component="stage"></section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      navTabsElement: this.root.querySelector('[data-component="nav-tabs"]'),
      weaponListPanel: this.root.querySelector('[data-component="weapon-list"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      listContextLabel: this.root.querySelector('[data-role="list-context"]'),
      listFooter: this.root.querySelector('[data-role="list-footer"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
    };
  }

  registerEventHandlers() {
    this.eventBus.on('hud:category-changed', (category) => {
      this.activeCategory = category;
    });

    this.eventBus.on('hud:weapon-selected', (weaponId) => {
      const weapon = this.weaponMap.get(weaponId);
      if (!weapon) {
        console.warn(`Weapon with id "${weaponId}" was not found.`);
        return;
      }
      this.activeWeapon = weapon;
      this.sceneManager.loadWeapon(weapon);
    });
  }

  indexWeapons() {
    this.weaponMap.clear();
    this.weapons.forEach((weapon) => {
      this.weaponMap.set(weapon.id, weapon);
    });
  }

  groupWeaponsByCategory() {
    return this.weapons.reduce((acc, weapon) => {
      const bucket = acc[weapon.category] || [];
      bucket.push(weapon);
      acc[weapon.category] = bucket;
      return acc;
    }, {});
  }

  findDefaultWeapon() {
    const byCategory = this.groupWeaponsByCategory();
    const defaultList = byCategory[this.activeCategory];
    return defaultList && defaultList.length > 0 ? defaultList[0] : null;
  }
}
