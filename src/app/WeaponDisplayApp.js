import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { createEventBus } from '../utils/eventBus.js';
import { critters } from '../data/critters.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { ViewportOverlay } from '../hud/components/ViewportOverlay.js';
import { RigControlPanel } from '../hud/components/RigControlPanel.js';

export class WeaponDisplayApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.eventBus = createEventBus();
    this.sceneManager = null;
    this.hudController = null;
    this.critterSelector = null;
    this.activeAnimationId = null;
    this.viewportOverlay = null;
    this.rigControlPanel = null;

    this.weapons = sampleWeapons;
    this.weaponMap = new Map();
    this.categories = ['primary', 'secondary', 'melee', 'utility'];
    this.activeCategory = 'primary';
    this.activeWeapon = null;

    this.critters = critters;
    this.critterMap = new Map();
    this.activeCritter = null;
  }

  init() {
    const layout = this.buildLayout();
    this.indexWeapons();
    this.indexCritters();
    this.registerEventHandlers();

    this.sceneManager = new SceneManager(layout.stageViewportElement, { bus: this.eventBus });
    this.sceneManager.init();

    this.viewportOverlay = new ViewportOverlay({
      container: layout.stageViewportElement,
      bus: this.eventBus,
    });
    this.viewportOverlay.init();

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
      this.sceneManager.applyRarityGlow(defaultWeapon.rarity);
    }

    this.critterSelector = new CritterSelector({
      element: layout.critterSelectorElement,
      critters: this.critters,
      bus: this.eventBus,
    });

    this.rigControlPanel = new RigControlPanel({
      container: layout.rigControlsElement,
      bus: this.eventBus,
    });
    this.rigControlPanel.init();

    const defaultCritter = this.findDefaultCritter();
    if (defaultCritter) {
      this.activeCritter = defaultCritter;
      this.activeAnimationId = this.resolveDefaultAnimation(defaultCritter);

      this.sceneManager.loadCritter(defaultCritter).then(() => {
        this.playActiveAnimation();
      });
    } else {
      this.activeAnimationId = null;
    }

    this.critterSelector.render(defaultCritter?.id);
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <div class="hud-brand">Critz Library</div>
        <nav class="hud-nav" aria-label="Interface options">
          <div class="nav-section nav-section--critters">
            <h2>Critters</h2>
            <div data-component="critter-selector"></div>
          </div>
          <div class="nav-section nav-section--categories">
            <h2>Arsenal</h2>
            <ul class="nav-tabs" data-component="nav-tabs"></ul>
          </div>
        </nav>
        <section class="panel hud-panel hud-list" data-component="weapon-list">
          <div class="panel-header">
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
          <div class="stage-toolbar" data-component="stage-toolbar">
            <div class="stage-tool-grid">
              <div class="stage-tool-panel stage-tool-panel--rig" data-component="rig-controls"></div>
            </div>
          </div>
          <div
            class="stage-viewport"
            data-role="stage-viewport"
            aria-label="Critter viewer"
            tabindex="0"
          ></div>
        </section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      stageViewportElement: this.root.querySelector('[data-role="stage-viewport"]'),
      navTabsElement: this.root.querySelector('[data-component="nav-tabs"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
      weaponListPanel: this.root.querySelector('[data-component="weapon-list"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      listContextLabel: this.root.querySelector('[data-role="list-context"]'),
      listFooter: this.root.querySelector('[data-role="list-footer"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      rigControlsElement: this.root.querySelector('[data-component="rig-controls"]'),
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
      this.sceneManager.applyRarityGlow(weapon.rarity);
    });

    this.eventBus.on('critter:selected', (critterId) => {
      const critter = this.critterMap.get(critterId);
      if (!critter || this.activeCritter?.id === critterId) {
        return;
      }

      this.activeCritter = critter;
      this.activeAnimationId = this.resolveDefaultAnimation(critter);

      this.sceneManager.loadCritter(critter).then(() => {
        this.playActiveAnimation();
      });
    });

    this.eventBus.on('rig:refresh-requested', () => {
      this.refreshActiveCritter();
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

  findDefaultCritter() {
    return this.critters[0] || null;
  }

  findAnimation(critter, animationId) {
    if (!critter || !animationId) {
      return null;
    }

    return critter.animations?.find((animation) => animation.id === animationId) || null;
  }

  resolveDefaultAnimation(critter) {
    if (!critter) {
      return null;
    }

    return critter.defaultAnimationId || critter.animations?.[0]?.id || null;
  }

  playActiveAnimation() {
    if (!this.sceneManager || !this.activeCritter) {
      return;
    }

    if (!this.activeAnimationId) {
      this.sceneManager.stopAnimation();
      return;
    }

    const animation = this.findAnimation(this.activeCritter, this.activeAnimationId);
    if (animation) {
      this.sceneManager.playAnimation(animation);
    } else {
      this.sceneManager.stopAnimation();
    }
  }

  refreshActiveCritter() {
    if (!this.activeCritter || !this.sceneManager) {
      return;
    }

    this.sceneManager.loadCritter(this.activeCritter).then(() => {
      this.playActiveAnimation();
    });
  }
}
