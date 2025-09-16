import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { CharacterSelector } from '../hud/components/CharacterSelector.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { sampleCritters } from '../data/sampleCritters.js';
import { createEventBus } from '../utils/eventBus.js';

export class WeaponDisplayApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.eventBus = createEventBus();
    this.sceneManager = null;
    this.hudController = null;
    this.characterSelector = null;

    this.weapons = sampleWeapons;
    this.weaponMap = new Map();
    this.categories = ['primary', 'secondary', 'melee', 'utility'];
    this.activeCategory = 'primary';
    this.activeWeapon = null;

    this.critters = sampleCritters;
    this.activeCritterId = null;
    this.autoSpinEnabled = true;
  }

  init() {
    const layout = this.buildLayout();
    this.indexWeapons();
    this.registerEventHandlers();

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

    if (layout.characterSelector) {
      this.characterSelector = new CharacterSelector({
        container: layout.characterSelector,
        critters: this.critters,
        defaultCritterId: this.activeCritterId,
        autoSpin: this.autoSpinEnabled,
        onCritterChange: (critterId) => this.handleCritterSelection(critterId),
        onAutoSpinChange: (enabled) => this.handleAutoSpinToggle(enabled),
        onResetView: () => this.sceneManager?.resetView(),
      });
      this.characterSelector.init();
    }

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
      this.sceneManager.resetView();
    }
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <div class="hud-brand">Crtiz Armory</div>
        <nav class="hud-nav" aria-label="Weapon categories">
          <section class="character-selector" data-component="character-selector">
            <h2>Characters</h2>
            <label class="field">
              <span class="field-label">Display</span>
              <select data-role="character-select" aria-label="Select critter to preview"></select>
            </label>
            <div class="viewport-toggles">
              <label class="toggle">
                <input type="checkbox" data-role="toggle-spin" checked />
                <span>Auto spin</span>
              </label>
              <button type="button" data-action="reset-view">Reset view</button>
            </div>
          </section>
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
      weaponListPanel: this.root.querySelector('[data-component="weapon-list"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      listContextLabel: this.root.querySelector('[data-role="list-context"]'),
      listFooter: this.root.querySelector('[data-role="list-footer"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      characterSelector: this.root.querySelector('[data-component="character-selector"]'),
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
      if (this.activeCritterId) {
        this.activeCritterId = null;
        this.characterSelector?.setSelectedCritter('');
      }
      this.sceneManager.loadWeapon(weapon);
      this.sceneManager.resetView();
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
    if (!critterId) {
      this.activeCritterId = null;
      if (this.activeWeapon) {
        this.sceneManager.loadWeapon(this.activeWeapon);
      }
      this.sceneManager.resetView();
      return;
    }

    const critter = this.critters.find((entry) => entry.id === critterId);
    if (!critter) {
      console.warn(`Critter with id "${critterId}" was not found.`);
      return;
    }

    this.activeCritterId = critterId;
    this.sceneManager.loadCharacter(critter);
    this.sceneManager.resetView();
  }

  handleAutoSpinToggle(enabled) {
    this.autoSpinEnabled = Boolean(enabled);
    this.sceneManager.setAutoSpin(this.autoSpinEnabled);
  }
}
