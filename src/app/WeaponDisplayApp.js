import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { sampleCritters } from '../data/sampleCritters.js';
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

    this.critters = sampleCritters;
    this.critterMap = new Map();
    this.activeCritter = null;
  }

  init() {
    const layout = this.buildLayout();
    this.indexWeapons();
    this.indexCritters();
    this.registerEventHandlers();

    this.sceneManager = new SceneManager(layout.stageElement);
    this.sceneManager.init();
    this.setupStageControls(layout);

    this.critterSelector = new CritterSelector({
      element: layout.critterSelectorElement,
      critters: this.critters,
      onSelect: (critterId) => this.handleCritterSelection(critterId),
    });

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
        <div class="hud-brand">Crtiz Armory</div>
        <nav class="hud-nav" aria-label="Weapon categories">
          <div class="critter-selector" data-component="critter-selector">
            <label for="critter-select">Critters</label>
            <div class="critter-selector-controls">
              <select id="critter-select" data-role="critter-select" aria-label="Select a critter"></select>
            </div>
            <p class="critter-selector-description" data-role="critter-description">
              View weapons on the stage or pick a critter to preview.
            </p>
          </div>
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
        <section class="stage" data-component="stage">
          <div class="stage-overlay" data-role="stage-overlay">
            <button
              type="button"
              class="stage-spin-toggle"
              data-role="toggle-spin"
              aria-pressed="true"
            >
              Pause Spin
            </button>
          </div>
        </section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      stageSpinToggle: this.root.querySelector('[data-role="toggle-spin"]'),
      navTabsElement: this.root.querySelector('[data-component="nav-tabs"]'),
      weaponListPanel: this.root.querySelector('[data-component="weapon-list"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      listContextLabel: this.root.querySelector('[data-role="list-context"]'),
      listFooter: this.root.querySelector('[data-role="list-footer"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
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
      if (!this.activeCritter) {
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

  indexCritters() {
    this.critterMap.clear();
    this.critters.forEach((critter) => {
      this.critterMap.set(critter.id, critter);
    });
  }

  setupStageControls(layout) {
    if (!layout.stageSpinToggle) return;
    const toggleButton = layout.stageSpinToggle;
    const updateLabel = (isSpinning) => {
      toggleButton.textContent = isSpinning ? 'Pause Spin' : 'Resume Spin';
      toggleButton.setAttribute('aria-pressed', String(isSpinning));
      toggleButton.setAttribute(
        'title',
        isSpinning ? 'Pause automatic rotation' : 'Resume automatic rotation'
      );
    };

    updateLabel(this.sceneManager?.isAutoRotating?.() ?? true);

    toggleButton.addEventListener('click', () => {
      if (!this.sceneManager) return;
      const nextState = !this.sceneManager.isAutoRotating();
      this.sceneManager.setAutoRotate(nextState);
      updateLabel(nextState);
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
      this.activeCritter = null;
      if (this.activeWeapon) {
        this.sceneManager.loadWeapon(this.activeWeapon);
      }
      return;
    }

    const critter = this.critterMap.get(critterId);
    if (!critter) {
      console.warn(`Critter with id "${critterId}" was not found.`);
      return;
    }

    this.activeCritter = critter;
    this.sceneManager.loadCritter(critter);
  }
}
