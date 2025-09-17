import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { createEventBus } from '../utils/eventBus.js';
import { critters } from '../data/critters.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { AnimationSelector } from '../hud/components/AnimationSelector.js';
import { ViewportControls } from '../hud/components/ViewportControls.js';

export class WeaponDisplayApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.eventBus = createEventBus();
    this.sceneManager = null;
    this.hudController = null;
    this.critterSelector = null;
    this.animationSelector = null;
    this.viewportControls = null;
    this.viewportMessageElement = null;
    this.defaultViewportMessage = 'Select a critter to preview.';

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
    this.viewportMessageElement = layout.viewportMessageElement;
    if (this.viewportMessageElement) {
      this.defaultViewportMessage =
        this.viewportMessageElement.dataset.defaultMessage || this.defaultViewportMessage;
      this.setViewportMessage(this.defaultViewportMessage, { level: 'info', visible: true });
    }

    this.indexWeapons();
    this.indexCritters();
    this.registerEventHandlers();

    this.sceneManager = new SceneManager(layout.stageViewportElement, { bus: this.eventBus });
    this.sceneManager.init();

    this.viewportControls = new ViewportControls({
      element: layout.viewportControlsElement,
      bus: this.eventBus,
    });
    this.viewportControls.init();

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

    this.animationSelector = new AnimationSelector({
      container: layout.animationSelectorElement,
      bus: this.eventBus,
    });
    this.animationSelector.init();

    const defaultCritter = this.findDefaultCritter();
    if (defaultCritter) {
      this.activeCritter = defaultCritter;
      this.animationSelector.setCritterName(defaultCritter.name);
      this.animationSelector.setAnimations(
        defaultCritter.animations,
        defaultCritter.defaultAnimationId
      );

      const activeAnimationId = this.animationSelector.getActiveAnimationId();
      const activeAnimation = this.findAnimation(defaultCritter, activeAnimationId);

      this.sceneManager.loadCritter(defaultCritter).then((result) => {
        if (result?.success && activeAnimation) {
          this.sceneManager.playAnimation(activeAnimation);
        }
      });
    } else {
      this.animationSelector.setCritterName('--');
      this.animationSelector.setAnimations([]);
    }

    this.critterSelector.render(defaultCritter?.id);
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <div class="hud-brand">Crtiz Armory</div>
        <nav class="hud-nav" aria-label="Interface options">
          <div class="nav-section nav-section--critters">
            <h2>Critters</h2>
            <div data-component="critter-selector"></div>
          </div>
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
          <div class="stage-toolbar" data-component="animation-selector"></div>
          <div
            class="stage-viewport"
            data-role="stage-viewport"
            aria-label="Critter viewer"
            tabindex="0"
          >
            <div class="viewport-overlay" data-role="viewport-overlay">
              <div class="viewport-overlay__row viewport-overlay__row--top">
                <p
                  class="viewport-message is-visible"
                  data-role="viewport-message"
                  data-default-message="Select a critter to preview."
                  aria-live="polite"
                >
                  Select a critter to preview.
                </p>
              </div>
              <div class="viewport-overlay__row viewport-overlay__row--bottom">
                <div class="viewport-hints" aria-hidden="true">
                  <span>Drag to orbit</span>
                  <span>Shift + Drag to pan</span>
                  <span>Scroll to zoom</span>
                  <span>Double-click or press F to refocus</span>
                </div>
                <div class="viewport-controls" data-component="viewport-controls"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      stageViewportElement: this.root.querySelector('[data-role="stage-viewport"]'),
      viewportMessageElement: this.root.querySelector('[data-role="viewport-message"]'),
      viewportControlsElement: this.root.querySelector('[data-component="viewport-controls"]'),
      navTabsElement: this.root.querySelector('[data-component="nav-tabs"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
      weaponListPanel: this.root.querySelector('[data-component="weapon-list"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      listContextLabel: this.root.querySelector('[data-role="list-context"]'),
      listFooter: this.root.querySelector('[data-role="list-footer"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      animationSelectorElement: this.root.querySelector('[data-component="animation-selector"]'),
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
      this.animationSelector.setCritterName(critter.name);
      this.animationSelector.setAnimations(critter.animations, critter.defaultAnimationId);

      const activeAnimationId = this.animationSelector.getActiveAnimationId();
      const activeAnimation = this.findAnimation(critter, activeAnimationId);

      this.sceneManager.loadCritter(critter).then((result) => {
        if (result?.success) {
          if (activeAnimation) {
            this.sceneManager.playAnimation(activeAnimation);
          } else {
            this.sceneManager.stopAnimation();
          }
        } else {
          this.sceneManager.stopAnimation();
        }
      });
    });

    this.eventBus.on('critter:animation-selected', (animationId) => {
      if (!this.activeCritter) {
        return;
      }

      const animation = this.findAnimation(this.activeCritter, animationId);
      if (animation) {
        this.sceneManager.playAnimation(animation);
      }
    });

    this.eventBus.on('viewport:reset-view', () => {
      this.sceneManager.resetView();
    });

    this.eventBus.on('viewport:focus-model', () => {
      this.sceneManager.focusCurrentModel({ fit: true });
    });

    this.eventBus.on('viewport:auto-rotate-toggle', () => {
      this.sceneManager.toggleAutoRotate();
    });

    this.eventBus.on('viewport:model-changed', (state) => {
      this.handleViewportModelStateChange(state);
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

  setViewportMessage(message, { level = 'info', visible = true } = {}) {
    if (!this.viewportMessageElement) {
      return;
    }

    if (typeof message === 'string') {
      this.viewportMessageElement.textContent = message;
    }

    if (level) {
      this.viewportMessageElement.dataset.level = level;
    } else {
      delete this.viewportMessageElement.dataset.level;
    }

    const normalized = typeof message === 'string' ? message.trim() : '';
    const shouldShow = Boolean(visible) && normalized.length > 0;
    this.viewportMessageElement.classList.toggle('is-visible', shouldShow);
  }

  handleViewportModelStateChange(state = {}) {
    if (state?.hasModel) {
      this.setViewportMessage('', { level: 'info', visible: false });
      return;
    }

    let message = this.defaultViewportMessage;
    let level = 'info';

    if (state?.reason === 'load-failed') {
      level = 'error';
      message =
        state?.type === 'critter'
          ? 'We hit a snag loading this critter preview. Try a different animation or critter.'
          : 'We hit a snag loading this preview. Please try again.';
    } else if (state?.reason === 'missing-model') {
      level = 'warning';
      message =
        state?.type === 'critter'
          ? 'This critter preview is still on the way.'
          : 'No 3D preview is available for this selection yet.';
    } else if (state?.reason === 'no-selection' || state?.reason === 'cleared') {
      level = 'info';
      message = this.defaultViewportMessage;
    }

    this.setViewportMessage(message, { level, visible: true });
  }

  findAnimation(critter, animationId) {
    if (!critter || !animationId) {
      return null;
    }

    return critter.animations?.find((animation) => animation.id === animationId) || null;
  }
}
