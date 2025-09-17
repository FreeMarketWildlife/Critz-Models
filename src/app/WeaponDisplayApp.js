import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { critters } from '../data/critters.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { AnimationControls } from '../hud/components/AnimationControls.js';
import { createEventBus } from '../utils/eventBus.js';

export class WeaponDisplayApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.eventBus = createEventBus();
    this.sceneManager = null;
    this.hudController = null;
    this.critterSelector = null;
    this.animationControls = null;

    this.weapons = sampleWeapons;
    this.weaponMap = new Map();
    this.categories = ['primary', 'secondary', 'melee', 'utility'];
    this.activeCategory = 'primary';
    this.activeWeapon = null;

    this.critters = critters;
    this.critterMap = new Map();
    this.activeCritter = null;
    this.activeAnimationId = null;
  }

  init() {
    const layout = this.buildLayout();
    this.indexWeapons();
    this.indexCritters();
    this.registerEventHandlers();

    this.sceneManager = new SceneManager(layout.stageViewportElement);
    this.sceneManager.init();

    this.critterSelector = new CritterSelector({
      element: layout.critterSelectorElement,
      critters: this.critters,
      activeCritterId: this.activeCritter?.id ?? null,
      onSelect: (critterId) => {
        this.handleCritterSelection(critterId);
      },
    });
    this.critterSelector.render();

    this.animationControls = new AnimationControls({
      element: layout.animationControlsElement,
      onSelect: (animationId) => {
        this.handleAnimationSelection(animationId);
      },
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

    this.initializeCritters();
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <div class="hud-brand">Crtiz Armory</div>
        <nav class="hud-nav" aria-label="Armory navigation">
          <div class="nav-section" data-section="critters">
            <h2>Critters</h2>
            <div class="critter-selector" data-component="critter-selector"></div>
          </div>
          <div class="nav-section" data-section="categories">
            <h2>Categories</h2>
            <ul class="nav-tabs" data-component="nav-tabs"></ul>
          </div>
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
          <div class="stage-overlay">
            <div class="stage-toolbar" data-component="animation-controls"></div>
          </div>
          <div class="stage-viewport" data-role="stage-viewport"></div>
        </section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      stageViewportElement: this.root.querySelector('[data-role="stage-viewport"]'),
      navTabsElement: this.root.querySelector('[data-component="nav-tabs"]'),
      weaponListPanel: this.root.querySelector('[data-component="weapon-list"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      listContextLabel: this.root.querySelector('[data-role="list-context"]'),
      listFooter: this.root.querySelector('[data-role="list-footer"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
      animationControlsElement: this.root.querySelector('[data-component="animation-controls"]'),
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
    this.critters.forEach((critter, index) => {
      this.critterMap.set(critter.id, critter);
      if (index === 0) {
        this.activeCritter = critter;
        this.activeAnimationId = critter.defaultAnimationId ?? critter.animations?.[0]?.id ?? null;
      }
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

  async initializeCritters() {
    if (!this.activeCritter) return;

    if (this.critterSelector) {
      this.critterSelector.setActive(this.activeCritter.id);
    }

    if (this.animationControls) {
      this.animationControls.setAnimations(
        this.activeCritter.animations,
        this.activeAnimationId
      );
    }

    await this.sceneManager.loadCritter(this.activeCritter);
    await this.playActiveAnimation();
  }

  async handleCritterSelection(critterId) {
    const critter = this.critterMap.get(critterId);
    if (!critter || critter === this.activeCritter) {
      return;
    }

    this.activeCritter = critter;
    this.activeAnimationId = critter.defaultAnimationId ?? critter.animations?.[0]?.id ?? null;

    if (this.critterSelector) {
      this.critterSelector.setActive(critter.id);
    }

    if (this.animationControls) {
      this.animationControls.setAnimations(critter.animations, this.activeAnimationId);
    }

    await this.sceneManager.loadCritter(critter);
    await this.playActiveAnimation();
  }

  async handleAnimationSelection(animationId) {
    this.activeAnimationId = animationId || null;
    if (this.animationControls) {
      this.animationControls.setActive(animationId);
    }
    await this.playActiveAnimation();
  }

  async playActiveAnimation() {
    if (!this.activeCritter) {
      return;
    }

    const animation = this.activeCritter.animations.find(
      (clip) => clip.id === this.activeAnimationId
    );

    if (animation) {
      await this.sceneManager.playAnimation(animation);
    } else {
      this.sceneManager.stopAnimation();
    }
  }
}
