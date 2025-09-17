import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { critters, findCritterById } from '../data/critters.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { createEventBus } from '../utils/eventBus.js';

export class WeaponDisplayApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.eventBus = createEventBus();
    this.sceneManager = null;
    this.hudController = null;
    this.critterSelector = null;

    this.weapons = sampleWeapons;
    this.weaponMap = new Map();
    this.categories = ['primary', 'secondary', 'melee', 'utility'];
    this.activeCategory = 'primary';
    this.activeWeapon = null;
    this.critters = critters;
    this.activeCritterId = null;
    this.autoSpinEnabled = true;
  }

  init() {
    const layout = this.buildLayout();
    this.indexWeapons();
    this.registerEventHandlers();

    this.critterSelector = new CritterSelector({
      container: layout.critterSelectorElement,
      critters: this.critters,
      defaultCritterId: this.activeCritterId,
      autoSpinEnabled: this.autoSpinEnabled,
      onSelect: (critterId) => this.handleCritterSelection(critterId),
      onSpinToggle: (enabled) => this.handleAutoSpinToggle(enabled),
      onResetView: () => this.sceneManager?.resetFocus(),
    });
    this.critterSelector.render();

    this.sceneManager = new SceneManager(layout.stageElement);
    this.sceneManager.init();
    this.sceneManager.setAutoSpin(this.autoSpinEnabled);

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
      if (!this.activeCritterId) {
        this.sceneManager.loadWeapon(defaultWeapon);
      }
    }

    if (this.activeCritterId) {
      const critter = findCritterById(this.activeCritterId);
      if (critter) {
        this.sceneManager.loadCritter(critter);
      }
    }
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <div class="hud-brand">Crtiz Armory</div>
        <nav class="hud-nav" aria-label="Weapon categories">
          <div data-component="critter-selector"></div>
          <h2>Categories</h2>
          <ul class="nav-tabs" data-component="nav-tabs"></ul>
        </nav>
        <section class="panel hud-panel hud-list" data-component="weapon-list">
          <div class="panel-header">
            <span>Arsenal</span>
            <span data-role="list-context"></span>
          </div>
          <div class="weapon-cards" data-role="weapon-cards"></div>
          <div class="panel-footer" data-role="list-footer">Choose a category to see its gear.</div>
        </section>
        <section class="panel hud-panel hud-detail" data-component="weapon-detail">
          <div class="panel-header">
            <span>Equipment Info</span>
            <span data-role="rarity-badge"></span>
          </div>
          <div class="detail-content" data-role="detail-content">
            <p class="description">Pick a tool to see its details.</p>
          </div>
          <div class="panel-footer" data-role="detail-footer">Awaiting selection</div>
        </section>
        <section class="stage" data-component="stage"></section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      navTabsElement: this.root.querySelector('[data-component="nav-tabs"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
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
      if (!this.activeCritterId) {
        this.sceneManager.loadWeapon(weapon);
      }
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

  handleCritterSelection(critterId) {
    const nextId = critterId || null;
    this.activeCritterId = nextId;
    this.critterSelector?.setSelectedCritter(nextId);

    if (!nextId) {
      if (this.activeWeapon) {
        this.sceneManager.loadWeapon(this.activeWeapon);
      } else {
        this.sceneManager.clearStageModel();
      }
      return;
    }

    const critter = findCritterById(nextId);
    if (!critter) {
      console.warn(`Critter with id "${nextId}" was not found.`);
      return;
    }

    this.sceneManager.loadCritter(critter);
  }

  handleAutoSpinToggle(enabled) {
    this.autoSpinEnabled = enabled;
    this.sceneManager.setAutoSpin(enabled);
    this.critterSelector?.setAutoSpinState(enabled);
  }
}
