import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { createEventBus } from '../utils/eventBus.js';
import { CRITTERS, getCritterById } from '../data/critters.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { AnimationSelector } from '../hud/components/AnimationSelector.js';

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

    this.critters = CRITTERS;
    this.critterMap = new Map(this.critters.map((critter) => [critter.id, critter]));
    this.activeCritterId = this.critters[0]?.id ?? null;
    this.activeAnimationId = null;

    this.critterSelector = null;
    this.animationSelector = null;
    this.critterNameElement = null;
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

    this.critterSelector = new CritterSelector({
      element: layout.critterSelectorElement,
      critters: this.critters,
      activeCritterId: this.activeCritterId,
      onSelect: (critterId) => this.handleCritterSelection(critterId),
    });
    this.critterSelector.render();

    this.animationSelector = new AnimationSelector({
      element: layout.animationSelectorElement,
      onSelect: (animationId) => this.handleAnimationSelection(animationId),
    });
    this.animationSelector.setLoading(true);

    this.critterNameElement = layout.critterNameLabel;

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

    if (this.activeCritterId) {
      this.loadCritterById(this.activeCritterId);
    }
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <div class="hud-brand">Crtiz Armory</div>
        <nav class="hud-nav" aria-label="Weapon categories">
          <div class="nav-section nav-section--critters">
            <p class="nav-section-label">Critter</p>
            <div data-component="critter-selector"></div>
          </div>
          <div class="nav-section-divider" role="presentation"></div>
          <div class="nav-section nav-section--categories">
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
            <div class="stage-toolbar">
              <div class="stage-meta">
                <span class="stage-label">Companion</span>
                <h3 class="stage-critter-name" data-role="active-critter-name">---</h3>
              </div>
              <div class="stage-animation" data-component="animation-selector">
                <span class="stage-label">Animation</span>
                <div class="animation-select-wrapper">
                  <select data-role="animation-select" aria-label="Critter animation"></select>
                  <span class="animation-select-display" data-role="animation-status"></span>
                </div>
              </div>
            </div>
            <p class="stage-hint">Drag to orbit • Scroll to zoom</p>
          </div>
        </section>
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
      animationSelectorElement: this.root.querySelector('[data-component="animation-selector"]'),
      critterNameLabel: this.root.querySelector('[data-role="active-critter-name"]'),
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

  handleCritterSelection(critterId) {
    if (!critterId || critterId === this.activeCritterId) {
      return;
    }

    this.activeCritterId = critterId;
    this.loadCritterById(critterId);
  }

  async loadCritterById(critterId) {
    const critter = getCritterById(critterId);
    if (!critter) {
      console.warn(`Critter with id "${critterId}" was not found.`);
      return;
    }

    if (this.critterNameElement) {
      this.critterNameElement.textContent = critter.name;
    }

    this.animationSelector?.setLoading(true);
    const animations = await this.sceneManager.loadCritter(critter);

    if (critterId !== this.activeCritterId) {
      return;
    }

    this.activeAnimationId = critter.defaultAnimationId || animations[0]?.id || null;
    this.animationSelector?.setAnimations(animations, this.activeAnimationId);

    if (this.activeAnimationId) {
      this.sceneManager.playAnimation(this.activeAnimationId);
      this.animationSelector?.setSelected(this.activeAnimationId);
    }
  }

  handleAnimationSelection(animationId) {
    if (!animationId || animationId === this.activeAnimationId) {
      return;
    }

    const played = this.sceneManager.playAnimation(animationId);
    if (played) {
      this.activeAnimationId = animationId;
    } else {
      this.animationSelector?.setSelected(this.activeAnimationId ?? '');
    }
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
