import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { createEventBus } from '../utils/eventBus.js';
import { critters } from '../data/critters.js';
import { librarySections } from '../data/librarySections.js';
import { critterCategories } from '../data/critterCategories.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { ViewportOverlay } from '../hud/components/ViewportOverlay.js';
import { RigControlPanel } from '../hud/components/RigControlPanel.js';

const RARITY_ORDER = {
  common: 0,
  rare: 1,
  legendary: 2,
  mythic: 3,
};

export class WeaponDisplayApp {
  constructor(rootElement) {
    this.root = rootElement;
    this.eventBus = createEventBus();
    this.sceneManager = null;
    this.hudController = null;
    this.critterSelector = null;
    this.viewportOverlay = null;
    this.rigControlPanel = null;
    this.activeAnimationId = null;

    this.weapons = sampleWeapons;
    this.weaponMap = new Map();
    this.categories = ['primary', 'secondary', 'melee', 'utility'];
    this.activeCategory = 'primary';
    this.activeWeapon = null;
    this.librarySections = librarySections;

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
      detailPanel: layout.weaponDetailPanel,
      catalogElement: layout.weaponCatalogElement,
      rarityBadge: layout.rarityBadge,
      detailFooter: layout.detailFooter,
    });

    this.hudController.init({
      categories: this.categories,
      weaponsByCategory: this.groupWeaponsByCategory(),
      defaultCategory: this.activeCategory,
      defaultWeaponId: null,
    });

    this.critterSelector = new CritterSelector({
      element: layout.critterSelectorElement,
      critters: this.critters,
      categories: critterCategories,
      bus: this.eventBus,
    });

    this.rigControlPanel = new RigControlPanel({
      container: layout.rigControlsElement,
      bus: this.eventBus,
    });
    this.rigControlPanel.init();

    this.activeAnimationId = null;
    this.critterSelector.render(null);
  }

  buildLayout() {
    const mapsMarkup = this.renderNavList(
      this.librarySections.maps,
      'Map catalog entries are on deck.',
      'map'
    );
    const modesMarkup = this.renderNavList(
      this.librarySections.gameModes,
      'Game mode catalog entries are on deck.',
      'mode'
    );

    this.root.innerHTML = `
      <div class="app-shell">
        <div class="hud-brand">Critz Library</div>
        <nav class="hud-nav" aria-label="Interface options">
          <details class="nav-section nav-section--critters">
            <summary class="nav-section__summary">Critters</summary>
            <div class="nav-section__content">
              <div data-component="critter-selector"></div>
            </div>
          </details>
          <details class="nav-section nav-section--categories">
            <summary class="nav-section__summary">Weapons &amp; Tools</summary>
            <div class="nav-section__content">
              <div data-component="weapon-catalog"></div>
            </div>
          </details>
          <details class="nav-section nav-section--maps">
            <summary class="nav-section__summary">Maps</summary>
            <div class="nav-section__content">
              ${mapsMarkup}
            </div>
          </details>
          <details class="nav-section nav-section--modes">
            <summary class="nav-section__summary">Game Modes</summary>
            <div class="nav-section__content">
              ${modesMarkup}
            </div>
          </details>
        </nav>
        <section class="panel hud-panel hud-detail" data-component="weapon-detail">
          <div class="panel-header">
            <span>Library Info</span>
            <span data-role="rarity-badge"></span>
          </div>
          <div class="detail-content">
            <div class="detail-scroll" data-role="detail-content">
              <p class="description">Select an item to see its details.</p>
            </div>
          </div>
          <div class="panel-footer" data-role="detail-footer">Awaiting selection</div>
        </section>
        <section class="stage" data-component="stage">
          <div
            class="stage-viewport"
            data-role="stage-viewport"
            aria-label="Critter viewer"
            tabindex="0"
          ></div>
          <div class="stage-toolbar" data-component="stage-toolbar">
            <div class="stage-tool-panel stage-tool-panel--rig" data-component="rig-controls"></div>
          </div>
        </section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      stageViewportElement: this.root.querySelector('[data-role="stage-viewport"]'),
      weaponCatalogElement: this.root.querySelector('[data-component="weapon-catalog"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      rigControlsElement: this.root.querySelector('[data-component="rig-controls"]'),
    };
  }

  renderNavList(items, emptyMessage, type) {
    if (!items || items.length === 0) {
      return `<p class="nav-empty">${emptyMessage}</p>`;
    }

    return `
      <div class="catalog-category__list nav-info-list">
        ${items
          .map(
            (item) => `
              <button
                type="button"
                class="catalog-button"
                data-info-type="${type}"
                data-info-id="${item.id}"
                data-info-label="${item.label ?? item.name}"
              >
                ${item.label ?? item.name}
              </button>
            `
          )
          .join('')}
      </div>
    `;
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
      this.sceneManager.applyRarityGlow();
    });

    this.eventBus.on('critter:selected', (critterId) => {
      const critter = this.critterMap.get(critterId);
      if (!critter || this.activeCritter?.id === critterId) {
        return;
      }

      this.activeCritter = critter;
      this.emitCritterStats(critter);
      this.activeAnimationId = this.resolveAnimationId(critter);
      const activeAnimation = this.findAnimation(critter, this.activeAnimationId);

      this.sceneManager.loadCritter(critter).then(() => {
        if (activeAnimation) {
          this.sceneManager.playAnimation(activeAnimation);
        } else {
          this.sceneManager.stopAnimation();
        }
      });
    });

    this.eventBus.on('rig:refresh-requested', () => {
      this.refreshActiveCritter();
    });

    this.root.querySelectorAll('[data-info-type][data-info-id]').forEach((button) => {
      const handleSelect = () => {
        this.eventBus.emit('nav:info-selected', {
          type: button.dataset.infoType,
          id: button.dataset.infoId,
          label: button.dataset.infoLabel,
        });
      };

      button.addEventListener('click', handleSelect);
      button.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelect();
        }
      });
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
    const grouped = this.weapons.reduce((acc, weapon) => {
      const bucket = acc[weapon.category] || [];
      bucket.push(weapon);
      acc[weapon.category] = bucket;
      return acc;
    }, {});

    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => {
        const rarityA = RARITY_ORDER[a.rarity] ?? Number.MAX_SAFE_INTEGER;
        const rarityB = RARITY_ORDER[b.rarity] ?? Number.MAX_SAFE_INTEGER;
        if (rarityA !== rarityB) {
          return rarityA - rarityB;
        }
        return a.name.localeCompare(b.name);
      });
    });

    return grouped;
  }

  findAnimation(critter, animationId) {
    if (!critter || !animationId) {
      return null;
    }

    return critter.animations?.find((animation) => animation.id === animationId) || null;
  }

  resolveAnimationId(critter) {
    if (!critter) {
      return null;
    }

    return critter.defaultAnimationId || critter.animations?.[0]?.id || null;
  }

  refreshActiveCritter() {
    if (!this.activeCritter || !this.sceneManager) {
      return;
    }

    const animation = this.findAnimation(this.activeCritter, this.activeAnimationId);

    this.sceneManager.loadCritter(this.activeCritter).then(() => {
      if (animation) {
        this.sceneManager.playAnimation(animation);
      } else {
        this.sceneManager.stopAnimation();
      }
    });
  }

  emitCritterStats(critter) {
    if (!critter) {
      this.eventBus.emit('viewport:critter-info', null);
      return;
    }

    this.eventBus.emit('viewport:critter-info', {
      id: critter.id,
      name: critter.name,
      stats: critter.stats ?? null,
    });
  }
}
