import { SceneManager } from '../core/SceneManager.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { createEventBus } from '../utils/eventBus.js';
import { critters } from '../data/critters.js';
import { librarySections } from '../data/librarySections.js';
import { critterCategories } from '../data/critterCategories.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { ViewportOverlay } from '../hud/components/ViewportOverlay.js';
import { RigControlPanel } from '../hud/components/RigControlPanel.js';
import { WeaponDetailPanel } from '../hud/components/WeaponDetailPanel.js';
import { WeaponCategorySelector } from '../hud/components/WeaponCategorySelector.js';
import { LibraryItemList } from '../hud/components/LibraryItemList.js';

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
    this.weaponDetailPanel = null;
    this.critterSelector = null;
    this.weaponCategorySelector = null;
    this.mapList = null;
    this.modeList = null;
    this.viewportOverlay = null;
    this.rigControlPanel = null;
    this.activeAnimationId = null;

    this.weapons = sampleWeapons;
    this.weaponMap = new Map();
    this.categories = ['primary', 'secondary', 'melee', 'utility'];
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

    this.weaponDetailPanel = new WeaponDetailPanel({
      panelElement: layout.weaponDetailPanel,
      rarityBadge: layout.rarityBadge,
      footerElement: layout.detailFooter,
    });
    this.weaponDetailPanel.renderEmpty();

    const weaponsByCategory = this.groupWeaponsByCategory();
    this.weaponCategorySelector = new WeaponCategorySelector({
      element: layout.weaponCategorySelectorElement,
      weaponsByCategory,
      categories: this.categories,
      onSelect: (weaponId) => this.handleWeaponSelection(weaponId),
    });
    this.weaponCategorySelector.render();

    this.mapList = new LibraryItemList({
      element: layout.mapListElement,
      items: this.librarySections.maps,
      onSelect: (item) => this.handleLibrarySelection('Map', item),
    });
    this.mapList.render();

    this.modeList = new LibraryItemList({
      element: layout.modeListElement,
      items: this.librarySections.gameModes,
      onSelect: (item) => this.handleLibrarySelection('Game Mode', item),
    });
    this.modeList.render();

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
              <div data-component="weapon-category-selector"></div>
            </div>
          </details>
          <details class="nav-section nav-section--maps">
            <summary class="nav-section__summary">Maps</summary>
            <div class="nav-section__content">
              <div data-component="map-list"></div>
            </div>
          </details>
          <details class="nav-section nav-section--modes">
            <summary class="nav-section__summary">Game Modes</summary>
            <div class="nav-section__content">
              <div data-component="mode-list"></div>
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
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
      weaponCategorySelectorElement: this.root.querySelector(
        '[data-component="weapon-category-selector"]'
      ),
      mapListElement: this.root.querySelector('[data-component="map-list"]'),
      modeListElement: this.root.querySelector('[data-component="mode-list"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      rigControlsElement: this.root.querySelector('[data-component="rig-controls"]'),
    };
  }

  registerEventHandlers() {
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
  }

  handleWeaponSelection(weaponId) {
    const weapon = this.weaponMap.get(weaponId);
    if (!weapon) {
      console.warn(`Weapon with id "${weaponId}" was not found.`);
      return;
    }

    this.activeWeapon = weapon;
    this.mapList?.clearSelection();
    this.modeList?.clearSelection();
    this.weaponDetailPanel.render(weapon);
    this.eventBus.emit('hud:weapon-selected', weapon.id);
  }

  handleLibrarySelection(typeLabel, item) {
    if (!item) return;
    this.activeWeapon = null;
    this.weaponCategorySelector?.clearSelection();
    if (typeLabel === 'Map') {
      this.modeList?.clearSelection();
    }
    if (typeLabel === 'Game Mode') {
      this.mapList?.clearSelection();
    }
    const title = item.label ?? item.name ?? typeLabel;
    this.weaponDetailPanel.renderPlaceholder({
      title,
      message: 'No info yet. Info coming soon.',
      footer: `${typeLabel} entry pending`,
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
