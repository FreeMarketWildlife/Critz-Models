import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { critters } from '../data/critters.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { CritterAnimationPanel } from '../hud/components/CritterAnimationPanel.js';
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

    this.critters = critters;
    this.critterMap = new Map();
    this.critterSelector = null;
    this.critterAnimationPanel = null;
    this.activeCritter = null;
    this.activeAnimationId = null;
    this.currentCritterSelectionToken = null;
    this.critterLoadPromise = Promise.resolve();
  }

  init() {
    const layout = this.buildLayout();
    this.indexWeapons();
    this.indexCritters();
    this.registerEventHandlers();

    this.sceneManager = new SceneManager(layout.stageElement);
    this.sceneManager.init();

    this.critterSelector = new CritterSelector({
      element: layout.critterSelectorElement,
      onSelect: (critterId) => {
        void this.handleCritterSelection(critterId);
      },
    });
    this.critterSelector.setCritters(this.critters);

    this.critterAnimationPanel = new CritterAnimationPanel({
      container: layout.critterControlsElement,
      onAnimationSelect: (animationId) => {
        void this.handleAnimationSelect(animationId);
      },
      onResetCamera: () => this.sceneManager.resetCamera(),
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

    const defaultCritter = this.critters[0] ?? null;
    if (defaultCritter) {
      void this.selectCritter(defaultCritter.id);
    } else {
      this.critterAnimationPanel.setCritter(null);
    }
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <div class="hud-brand">Crtiz Armory</div>
        <nav class="hud-nav" aria-label="Companion selection and weapon categories">
          <section class="nav-section nav-companion" data-component="critter-selector">
            <h2>Companion</h2>
            <div class="critter-options" data-role="critter-options"></div>
          </section>
          <section class="nav-section nav-categories">
            <h2>Categories</h2>
            <ul class="nav-tabs" data-component="nav-tabs"></ul>
          </section>
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
          <div class="stage-overlay" data-component="critter-controls">
            <div class="stage-overlay-card">
              <div class="stage-overlay-header">
                <div class="stage-overlay-titles">
                  <span class="stage-overlay-title" data-role="critter-label">Select a companion</span>
                  <span class="stage-overlay-tagline" data-role="critter-tagline"></span>
                </div>
                <button type="button" class="stage-overlay-reset" data-role="reset-camera">Reset view</button>
              </div>
              <label class="stage-overlay-field">
                <span class="stage-overlay-field-label">Animation</span>
                <select data-role="animation-select" disabled>
                  <option value="">Select an animation</option>
                </select>
              </label>
              <p class="stage-overlay-hint">Drag to orbit • Scroll to zoom</p>
            </div>
          </div>
        </section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
      critterControlsElement: this.root.querySelector('[data-component="critter-controls"]'),
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

  async handleCritterSelection(critterId) {
    await this.selectCritter(critterId);
  }

  async selectCritter(critterId) {
    const critter = this.critterMap.get(critterId);
    if (!critter) {
      console.warn(`Critter with id "${critterId}" was not found.`);
      return;
    }

    this.activeCritter = critter;
    this.critterSelector?.setActive(critterId);
    this.critterAnimationPanel?.setCritter(critter);

    const defaultAnimationId = this.resolveDefaultAnimation(critter);
    this.activeAnimationId = defaultAnimationId;
    if (defaultAnimationId) {
      this.critterAnimationPanel?.setActiveAnimation(defaultAnimationId);
    }

    const selectionToken = Symbol('critter-selection');
    this.currentCritterSelectionToken = selectionToken;

    try {
      const loadPromise = this.sceneManager.loadCritter(critter);
      this.critterLoadPromise = loadPromise;
      await loadPromise;
      if (this.currentCritterSelectionToken !== selectionToken) {
        return;
      }
      if (this.activeAnimationId) {
        const animation = this.getAnimationDescriptor(critter.id, this.activeAnimationId);
        if (animation) {
          await this.sceneManager.playCritterAnimation(critter, animation);
        }
      }
    } catch (error) {
      console.error(`Failed to load critter "${critterId}".`, error);
    }
  }

  resolveDefaultAnimation(critter) {
    if (!critter) return null;
    if (critter.defaultAnimationId) {
      const defaultAnimation = this.getAnimationDescriptor(critter.id, critter.defaultAnimationId);
      if (defaultAnimation) {
        return defaultAnimation.id;
      }
    }
    return critter.animations?.[0]?.id ?? null;
  }

  getAnimationDescriptor(critterId, animationId) {
    const critter = this.critterMap.get(critterId);
    if (!critter || !Array.isArray(critter.animations)) {
      return null;
    }
    return critter.animations.find((animation) => animation.id === animationId) ?? null;
  }

  async handleAnimationSelect(animationId) {
    if (!this.activeCritter || !animationId) {
      return;
    }

    const animation = this.getAnimationDescriptor(this.activeCritter.id, animationId);
    if (!animation) {
      console.warn(`Animation with id "${animationId}" was not found for critter "${this.activeCritter.id}".`);
      return;
    }

    this.activeAnimationId = animationId;
    this.critterAnimationPanel?.setActiveAnimation(animationId);

    const selectionToken = this.currentCritterSelectionToken;
    try {
      await this.critterLoadPromise;
      if (selectionToken && selectionToken !== this.currentCritterSelectionToken) {
        return;
      }
      await this.sceneManager.playCritterAnimation(this.activeCritter, animation);
    } catch (error) {
      console.error(`Failed to play animation "${animationId}".`, error);
    }
  }
}
