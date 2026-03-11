import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { createEventBus } from '../utils/eventBus.js';
import { critters } from '../data/critters.js';
import { librarySections } from '../data/librarySections.js';
import { critterCategories } from '../data/critterCategories.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { CritterUnlockMap } from '../hud/components/CritterUnlockMap.js';
import { ViewportOverlay } from '../hud/components/ViewportOverlay.js';
import { NavButtonList } from '../hud/components/NavButtonList.js';
import { MinigameRunner } from '../hud/components/MinigameRunner.js';
import { MinigameCritterQuest } from '../hud/components/MinigameCritterQuest.js';
import { MinigameKatanaMouse } from '../hud/components/MinigameKatanaMouse.js';

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
    this.critterUnlockMap = null;
    this.viewportOverlay = null;
    this.mapsList = null;
    this.modesList = null;
    this.cosmeticsList = null;
    this.minigamesList = null;
    this.minigameRunner = null;
    this.minigameQuest = null;
    this.minigameKatana = null;
    this.navElement = null;
    this.mapCopyButton = null;
    this.mapAddNodesToggleButton = null;
    this.mapPanToggleButton = null;
    this.mapPointsToggleButton = null;
    this.mapZoomBadge = null;
    this.boundNavKeydown = (event) => this.handleNavKeydown(event);
    this.boundMapCopyClick = async () => {
      if (!this.critterUnlockMap || !this.mapCopyButton) {
        return;
      }

      const originalLabel = this.mapCopyButton.textContent;
      try {
        await this.critterUnlockMap.copyLayoutSnapshot();
        this.mapCopyButton.textContent = 'Copied';
      } catch (error) {
        this.mapCopyButton.textContent = 'Copy Failed';
        console.error('Failed to copy critter map layout:', error);
      }
      setTimeout(() => {
        if (this.mapCopyButton) {
          this.mapCopyButton.textContent = originalLabel || 'Copy Layout';
        }
      }, 1200);
    };
    this.boundMapPointsToggleClick = () => {
      if (!this.critterUnlockMap || !this.mapPointsToggleButton) {
        return;
      }

      const visible = this.critterUnlockMap.toggleLinkPointsVisibility();
      this.mapPointsToggleButton.textContent = visible ? 'Hide Nodes' : 'Show Nodes';
    };
    this.boundMapAddNodesToggleClick = () => {
      if (!this.critterUnlockMap || !this.mapAddNodesToggleButton) {
        return;
      }

      const addNodesEnabled = this.critterUnlockMap.toggleAddNodesModeEnabled();
      this.mapAddNodesToggleButton.textContent = addNodesEnabled ? 'Add Nodes: On' : 'Add Nodes: Off';
      if (this.mapPanToggleButton) {
        if (addNodesEnabled) {
          this.mapPanToggleButton.disabled = true;
          this.mapPanToggleButton.textContent = 'Panning Locked';
        } else {
          this.mapPanToggleButton.disabled = false;
          const panningEnabled = this.critterUnlockMap.isPanningEnabled();
          this.mapPanToggleButton.textContent = panningEnabled ? 'Disable Panning' : 'Enable Panning';
        }
      }
      if (this.mapPointsToggleButton) {
        const visible = this.critterUnlockMap.areLinkPointsVisible();
        this.mapPointsToggleButton.textContent = visible ? 'Hide Nodes' : 'Show Nodes';
      }
    };
    this.boundMapPanToggleClick = () => {
      if (!this.critterUnlockMap || !this.mapPanToggleButton) {
        return;
      }

      const panningEnabled = this.critterUnlockMap.togglePanningEnabled();
      this.mapPanToggleButton.textContent = panningEnabled ? 'Disable Panning' : 'Enable Panning';
    };
    this.activeAnimationId = null;
    this.stageElement = null;

    this.weapons = sampleWeapons;
    this.weaponMap = new Map();
    this.categories = ['primary', 'secondary', 'melee', 'utility'];
    this.activeCategory = 'primary';
    this.activeWeapon = null;
    this.librarySections = librarySections;

    this.critters = critters;
    this.critterMap = new Map();
    this.critterCategories = critterCategories;
    this.activeCritterCategory = this.critterCategories[0]?.id ?? null;
    this.activeCritter = null;
  }

  init() {
    const layout = this.buildLayout();
    this.stageElement = layout.stageElement;
    this.navElement = layout.navElement;
    this.mapCopyButton = layout.mapCopyButtonElement;
    this.mapAddNodesToggleButton = layout.mapAddNodesToggleButtonElement;
    this.mapPanToggleButton = layout.mapPanToggleButtonElement;
    this.mapPointsToggleButton = layout.mapPointsToggleButtonElement;
    this.mapZoomBadge = layout.mapZoomElement;
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
      rarityBadge: layout.rarityBadge,
      detailFooter: layout.detailFooter,
      categoryMenuElement: layout.categoryMenuElement,
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
      categories: this.critterCategories,
      bus: this.eventBus,
    });

    this.critterUnlockMap = new CritterUnlockMap({
      element: layout.critterUnlockMapElement,
      critters: this.critters,
      categories: this.critterCategories,
      bus: this.eventBus,
      zoomElement: this.mapZoomBadge,
    });
    this.minigameRunner = new MinigameRunner();
    this.minigameQuest = new MinigameCritterQuest();
    this.minigameKatana = new MinigameKatanaMouse();

    if (this.navElement) {
      this.navElement.addEventListener('keydown', this.boundNavKeydown, true);
    }
    if (this.mapCopyButton) {
      this.mapCopyButton.addEventListener('click', this.boundMapCopyClick);
    }
    if (this.mapPointsToggleButton) {
      this.mapPointsToggleButton.addEventListener('click', this.boundMapPointsToggleClick);
    }
    if (this.mapAddNodesToggleButton) {
      this.mapAddNodesToggleButton.addEventListener('click', this.boundMapAddNodesToggleClick);
    }
    if (this.mapPanToggleButton) {
      this.mapPanToggleButton.addEventListener('click', this.boundMapPanToggleClick);
    }

    this.mapsList = new NavButtonList({
      element: layout.mapsListElement,
      items: this.librarySections.maps,
      emptyMessage: 'Map catalog entries are on deck.',
      onSelect: (item) => {
        if (!item) {
          this.minigameRunner?.unmount();
          this.minigameQuest?.unmount();
          this.minigameKatana?.unmount();
          this.hudController.clearInfo();
          return;
        }
        this.minigameRunner?.unmount();
        this.minigameQuest?.unmount();
        this.minigameKatana?.unmount();
        this.modesList?.setActive(null);
        this.cosmeticsList?.setActive(null);
        this.minigamesList?.setActive(null);
        this.hudController.showLibraryInfo({
          title: item.label,
          description: 'Info coming soon.',
          footer: 'Map info coming soon',
        });
      },
    });
    this.mapsList.render();

    this.modesList = new NavButtonList({
      element: layout.modesListElement,
      items: this.librarySections.gameModes,
      emptyMessage: 'Game mode catalog entries are on deck.',
      onSelect: (item) => {
        if (!item) {
          this.minigameRunner?.unmount();
          this.minigameQuest?.unmount();
          this.minigameKatana?.unmount();
          this.hudController.clearInfo();
          return;
        }
        this.minigameRunner?.unmount();
        this.minigameQuest?.unmount();
        this.minigameKatana?.unmount();
        this.mapsList?.setActive(null);
        this.cosmeticsList?.setActive(null);
        this.minigamesList?.setActive(null);
        this.hudController.showLibraryInfo({
          title: item.label,
          description: 'Info coming soon.',
          footer: 'Game mode info coming soon',
        });
      },
    });
    this.modesList.render();

    this.cosmeticsList = new NavButtonList({
      element: layout.cosmeticsListElement,
      items: this.librarySections.cosmetics,
      emptyMessage: 'Cosmetics catalog entries are on deck.',
      onSelect: (item) => {
        if (!item) {
          this.minigameRunner?.unmount();
          this.minigameQuest?.unmount();
          this.minigameKatana?.unmount();
          this.hudController.clearInfo();
          return;
        }
        this.minigameRunner?.unmount();
        this.minigameQuest?.unmount();
        this.minigameKatana?.unmount();
        this.mapsList?.setActive(null);
        this.modesList?.setActive(null);
        this.minigamesList?.setActive(null);
        this.hudController.showLibraryInfo({
          title: item.label,
          description: 'Cosmetic info coming soon.',
          footer: 'Cosmetic info coming soon',
        });
      },
    });
    this.cosmeticsList.render();

    this.minigamesList = new NavButtonList({
      element: layout.minigamesListElement,
      items: this.librarySections.minigames,
      emptyMessage: 'Minigames are on deck.',
      onSelect: (item) => {
        if (!item) {
          this.minigameRunner?.unmount();
          this.minigameQuest?.unmount();
          this.minigameKatana?.unmount();
          this.hudController.clearInfo();
          return;
        }
        this.mapsList?.setActive(null);
        this.modesList?.setActive(null);
        this.cosmeticsList?.setActive(null);
        if (item.id === 'run') {
          this.minigameRunner?.unmount();
          this.minigameQuest?.unmount();
          this.minigameKatana?.unmount();
          const body = this.hudController.showCustomPanel({
            title: item.label,
            footer: 'Jump: Space/Up · Duck: Down/S · Restart: R · Pause: P',
            className: 'panel--minigame',
          });
          this.minigameRunner?.mount(body);
          return;
        }
        if (item.id === 'critter-quest') {
          this.minigameRunner?.unmount();
          this.minigameQuest?.unmount();
          this.minigameKatana?.unmount();
          const body = this.hudController.showCustomPanel({
            title: item.label,
            footer: 'Adventure: Dialog · Quests · Dungeons · Combat',
            className: 'panel--minigame',
          });
          this.minigameQuest?.mount(body);
          return;
        }
        if (item.id === 'katana-mouse') {
          this.minigameRunner?.unmount();
          this.minigameQuest?.unmount();
          this.minigameKatana?.unmount();
          const body = this.hudController.showCustomPanel({
            title: item.label,
            footer: 'Move: WASD/Arrows · Slash/Gun: Space · Dash: Shift · Freeze: F · Swap Gun: Q · Restart: R',
            className: 'panel--minigame',
          });
          this.minigameKatana?.mount(body);
          return;
        }
        this.minigameRunner?.unmount();
        this.minigameQuest?.unmount();
        this.minigameKatana?.unmount();
        this.hudController.showLibraryInfo({
          title: item.label,
          description: 'Minigame info coming soon.',
          footer: 'Minigame info coming soon',
        });
      },
    });
    this.minigamesList.render();

    this.activeAnimationId = null;
    this.critterSelector.render(this.activeCritterCategory);
    this.critterUnlockMap.render(this.activeCritterCategory);
    if (this.mapPointsToggleButton) {
      const visible = this.critterUnlockMap.areLinkPointsVisible();
      this.mapPointsToggleButton.textContent = visible ? 'Hide Nodes' : 'Show Nodes';
    }
    if (this.mapAddNodesToggleButton) {
      const addNodesEnabled = this.critterUnlockMap.isAddNodesModeEnabled();
      this.mapAddNodesToggleButton.textContent = addNodesEnabled ? 'Add Nodes: On' : 'Add Nodes: Off';
    }
    if (this.mapPanToggleButton) {
      const addNodesEnabled = this.critterUnlockMap.isAddNodesModeEnabled();
      if (addNodesEnabled) {
        this.mapPanToggleButton.disabled = true;
        this.mapPanToggleButton.textContent = 'Panning Locked';
      } else {
        this.mapPanToggleButton.disabled = false;
        const panningEnabled = this.critterUnlockMap.isPanningEnabled();
        this.mapPanToggleButton.textContent = panningEnabled ? 'Disable Panning' : 'Enable Panning';
      }
    }
    this.hudController.showCritterCategoryGuide({
      categoryLabel: this.getCritterCategoryLabel(this.activeCritterCategory),
      critterCount: this.getCrittersByCategory(this.activeCritterCategory).length,
    });
    this.setStageActive(false);
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell">
        <nav class="hud-nav" aria-label="Interface options">
          <details class="nav-section nav-section--critters" open>
            <summary class="nav-section__summary">Critters</summary>
            <div class="nav-section__content">
              <div data-component="critter-selector"></div>
            </div>
          </details>
          <details class="nav-section nav-section--categories">
            <summary class="nav-section__summary">Weapons &amp; Tools</summary>
            <div class="nav-section__content">
              <div data-component="weapon-category-menu"></div>
            </div>
          </details>
          <details class="nav-section nav-section--maps">
            <summary class="nav-section__summary">Maps</summary>
            <div class="nav-section__content">
              <div data-component="maps-list"></div>
            </div>
          </details>
          <details class="nav-section nav-section--modes">
            <summary class="nav-section__summary">Game Modes</summary>
            <div class="nav-section__content">
              <div data-component="modes-list"></div>
            </div>
          </details>
          <details class="nav-section nav-section--cosmetics">
            <summary class="nav-section__summary">Cosmetics</summary>
            <div class="nav-section__content">
              <div data-component="cosmetics-list"></div>
            </div>
          </details>
          <details class="nav-section nav-section--minigames">
            <summary class="nav-section__summary">Minigames</summary>
            <div class="nav-section__content">
              <div data-component="minigames-list"></div>
            </div>
          </details>
        </nav>
        <section class="panel hud-panel hud-map" data-component="critter-map-panel">
          <div class="panel-header">
            <span>Critter Unlock Map</span>
            <div class="panel-header__actions">
              <span class="unlock-map__zoom unlock-map__zoom--header" data-role="map-zoom-header">100%</span>
              <button type="button" class="panel-copy-button" data-action="toggle-add-nodes">
                Add Nodes: Off
              </button>
              <button type="button" class="panel-copy-button" data-action="toggle-map-panning">
                Disable Panning
              </button>
              <button type="button" class="panel-copy-button" data-action="toggle-link-points">
                Hide Nodes
              </button>
              <button type="button" class="panel-copy-button" data-action="copy-map-layout">
                Copy Layout
              </button>
            </div>
          </div>
          <div class="detail-content">
            <div class="detail-scroll detail-scroll--map" data-component="critter-unlock-map"></div>
          </div>
        </section>
        <section class="inspector" data-component="inspector">
          <section class="stage" data-component="stage">
            <div
              class="stage-viewport"
              data-role="stage-viewport"
              aria-label="Critter viewer"
              tabindex="0"
            ></div>
          </section>
          <section class="panel hud-panel hud-detail" data-component="weapon-detail">
            <div class="panel-header">
              <span>Critter Intel</span>
              <span data-role="rarity-badge"></span>
            </div>
            <div class="detail-content">
              <div class="detail-scroll" data-role="detail-content">
                <p class="description">Pick a critter in the unlock map to preview details.</p>
              </div>
            </div>
            <div class="panel-footer" data-role="detail-footer">Awaiting selection</div>
          </section>
        </section>
      </div>
    `;

    return {
      stageElement: this.root.querySelector('[data-component="stage"]'),
      stageViewportElement: this.root.querySelector('[data-role="stage-viewport"]'),
      categoryMenuElement: this.root.querySelector('[data-component="weapon-category-menu"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
      critterUnlockMapElement: this.root.querySelector('[data-component="critter-unlock-map"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      mapsListElement: this.root.querySelector('[data-component="maps-list"]'),
      modesListElement: this.root.querySelector('[data-component="modes-list"]'),
      cosmeticsListElement: this.root.querySelector('[data-component="cosmetics-list"]'),
      minigamesListElement: this.root.querySelector('[data-component="minigames-list"]'),
      mapCopyButtonElement: this.root.querySelector('[data-action="copy-map-layout"]'),
      mapAddNodesToggleButtonElement: this.root.querySelector('[data-action="toggle-add-nodes"]'),
      mapPanToggleButtonElement: this.root.querySelector('[data-action="toggle-map-panning"]'),
      mapPointsToggleButtonElement: this.root.querySelector('[data-action="toggle-link-points"]'),
      mapZoomElement: this.root.querySelector('[data-role="map-zoom-header"]'),
      navElement: this.root.querySelector('.hud-nav'),
    };
  }

  handleNavKeydown(event) {
    const key = event.key;
    if (key === ' ' || key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  registerEventHandlers() {
    this.eventBus.on('hud:category-changed', (category) => {
      this.minigameRunner?.unmount();
      this.minigameQuest?.unmount();
      this.minigameKatana?.unmount();
      if (this.activeCritter) {
        this.clearActiveCritter({ showGuide: false });
      }
      this.activeCategory = category;
    });

    this.eventBus.on('hud:weapon-selected', (weaponId) => {
      const weapon = this.weaponMap.get(weaponId);
      if (!weapon) {
        console.warn(`Weapon with id "${weaponId}" was not found.`);
        return;
      }
      this.minigameRunner?.unmount();
      this.minigameQuest?.unmount();
      this.minigameKatana?.unmount();
      if (this.activeCritter) {
        this.clearActiveCritter({ showGuide: false });
      }
      this.activeWeapon = weapon;
      this.sceneManager.applyRarityGlow();
      this.mapsList?.setActive(null);
      this.modesList?.setActive(null);
      this.cosmeticsList?.setActive(null);
      this.minigamesList?.setActive(null);
    });

    this.eventBus.on('critter:category-selected', (categoryId) => {
      if (!categoryId || this.activeCritterCategory === categoryId) {
        return;
      }

      this.activeCritterCategory = categoryId;
      this.clearActiveCritter({ showGuide: false });
      this.critterUnlockMap?.setCategory(categoryId);
      this.mapsList?.setActive(null);
      this.modesList?.setActive(null);
      this.cosmeticsList?.setActive(null);
      this.minigamesList?.setActive(null);
      this.hudController.showCritterCategoryGuide({
        categoryLabel: this.getCritterCategoryLabel(categoryId),
        critterCount: this.getCrittersByCategory(categoryId).length,
      });
    });

    this.eventBus.on('critter:selected', (critterId) => {
      if (!critterId) {
        this.clearActiveCritter();
        return;
      }

      const critter = this.critterMap.get(critterId);
      if (!critter) {
        return;
      }

      if (this.activeCritterCategory && critter.category !== this.activeCritterCategory) {
        this.activeCritterCategory = critter.category;
        this.critterSelector?.setActiveCategory?.(critter.category, { emit: false });
        this.critterUnlockMap?.setCategory(critter.category);
      }

      if (this.activeCritter?.id === critterId) {
        const editorState = this.critterUnlockMap?.getCritterEditorState?.(critterId) || null;
        this.hudController.showCritterInfo(critter, {
          categoryLabel: this.getCritterCategoryLabel(critter.category),
          editorState,
        });
        return;
      }

      this.minigameRunner?.unmount();
      this.minigameQuest?.unmount();
      this.minigameKatana?.unmount();
      this.mapsList?.setActive(null);
      this.modesList?.setActive(null);
      this.cosmeticsList?.setActive(null);
      this.minigamesList?.setActive(null);
      this.activeCritter = critter;
      this.critterUnlockMap?.setActiveCritter(critterId);
      const editorState = this.critterUnlockMap?.getCritterEditorState?.(critterId) || null;
      this.hudController.showCritterInfo(critter, {
        categoryLabel: this.getCritterCategoryLabel(critter.category),
        editorState,
      });
      this.activeAnimationId = this.resolveAnimationId(critter);
      const activeAnimation = this.findAnimation(critter, this.activeAnimationId);

      this.setStageActive(true);
      this.sceneManager.loadCritter(critter).then(() => {
        if (activeAnimation) {
          this.sceneManager.playAnimation(activeAnimation);
        } else {
          this.sceneManager.stopAnimation();
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

  getCrittersByCategory(categoryId) {
    if (!categoryId) {
      return [];
    }
    return this.critters.filter((critter) => critter.category === categoryId);
  }

  getCritterCategoryLabel(categoryId) {
    const category = this.critterCategories.find((entry) => entry.id === categoryId);
    if (category?.label) {
      return category.label;
    }

    return String(categoryId || 'Critters')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, (char) => char.toUpperCase());
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

  clearActiveCritter({ showGuide = true } = {}) {
    this.activeCritter = null;
    this.activeAnimationId = null;
    this.critterUnlockMap?.setActiveCritter(null);
    this.sceneManager?.disposeCurrentModel?.();
    this.setStageActive(false);
    this.eventBus.emit('viewport:critter-cleared');

    if (showGuide) {
      this.hudController.showCritterCategoryGuide({
        categoryLabel: this.getCritterCategoryLabel(this.activeCritterCategory),
        critterCount: this.getCrittersByCategory(this.activeCritterCategory).length,
      });
    }
  }

  setStageActive(isActive) {
    this.stageElement?.classList.toggle('has-critter', Boolean(isActive));
  }
}
