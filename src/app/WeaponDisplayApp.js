import { SceneManager } from '../core/SceneManager.js';
import { HUDController } from '../hud/HUDController.js';
import { sampleWeapons } from '../data/sampleWeapons.js';
import { createEventBus } from '../utils/eventBus.js';
import { critters } from '../data/critters.js';
import { librarySections } from '../data/librarySections.js';
import { critterCategories } from '../data/critterCategories.js';
import { CritterSelector } from '../hud/components/CritterSelector.js';
import { CritterUnlockMap } from '../hud/components/CritterUnlockMap.js';
import { WeaponUnlockMap } from '../hud/components/WeaponUnlockMap.js';
import { ViewportOverlay } from '../hud/components/ViewportOverlay.js';
import { NavButtonList } from '../hud/components/NavButtonList.js';
import { CatalogListView } from '../hud/components/CatalogListView.js';
import { LibraryContentView } from '../hud/components/LibraryContentView.js';
import { CosmeticsCatalogView } from '../hud/components/CosmeticsCatalogView.js';
import { DesignShowcaseView } from '../hud/components/DesignShowcaseView.js';
import { MinigameRunner } from '../hud/components/MinigameRunner.js';
import { MinigameCritterQuest } from '../hud/components/MinigameCritterQuest.js';
import { MinigameKatanaMouse } from '../hud/components/MinigameKatanaMouse.js';
import { weaponsMapDefaultLayout } from '../data/weaponsMapDefaultLayout.js';
import { medalsAchievementsCatalog } from '../data/medalsAchievementsCatalog.js';
import { cosmeticSlots } from '../data/cosmeticsCatalog.js';
import { DEFAULT_PHASE_FILTER, normalizePhaseFilter, PHASE_OPTIONS } from '../utils/phaseUtils.js';

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
    this.weaponUnlockMap = null;
    this.viewportOverlay = null;
    this.mapsList = null;
    this.modesList = null;
    this.medalsAchievementsList = null;
    this.cosmeticsList = null;
    this.designList = null;
    this.minigamesList = null;
    this.brainstormingList = null;
    this.catalogListView = null;
    this.libraryContentView = null;
    this.cosmeticsCatalogView = null;
    this.designShowcaseView = null;
    this.minigameRunner = null;
    this.minigameQuest = null;
    this.minigameKatana = null;
    this.shellElement = null;
    this.navElement = null;
    this.centerMapPanel = null;
    this.mapCopyButton = null;
    this.mapZoomBadge = null;
    this.phaseFilterPillElement = null;
    this.centerMapTitle = null;
    this.centerMapHost = null;
    this.leftWindowToggleButton = null;
    this.rightWindowToggleButton = null;
    this.phaseFilterButtons = [];
    this.activePhaseFilter = DEFAULT_PHASE_FILTER;
    this.leftWindowCollapsed = false;
    this.rightWindowCollapsed = false;
    this.boundNavKeydown = (event) => this.handleNavKeydown(event);
    this.boundMapCopyClick = async () => {
      if (!this.mapCopyButton) {
        return;
      }

      const originalLabel = this.mapCopyButton.textContent;
      try {
        const activeMap = this.getActiveMapController();
        if (!activeMap) {
          return;
        }
        await activeMap.copyLayoutSnapshot({
          previewStates:
            this.activeCenterMapType === 'critters'
              ? this.sceneManager?.getCritterImagePreviewSnapshot?.() || null
              : null,
        });
        this.mapCopyButton.textContent = 'Copied';
      } catch (error) {
        this.mapCopyButton.textContent = 'Copy Failed';
        console.error('Failed to copy map layout:', error);
      }
      setTimeout(() => {
        if (this.mapCopyButton) {
          this.mapCopyButton.textContent = originalLabel || 'Copy Layout';
        }
      }, 1200);
    };
    this.boundLeftWindowToggleClick = () => {
      this.toggleWindowCollapse('left');
    };
    this.boundRightWindowToggleClick = () => {
      this.toggleWindowCollapse('right');
    };
    this.activeAnimationId = null;
    this.stageElement = null;

    this.categories = ['primary', 'secondary', 'melee', 'utility'];
    this.weapons = this.buildWeaponsCatalog();
    this.weaponMap = new Map();
    this.activeCategory = 'primary';
    this.activeWeapon = null;
    this.librarySections = librarySections;

    this.critters = critters;
    this.critterMap = new Map();
    this.critterCategories = critterCategories;
    this.activeCritterCategory = this.critterCategories[0]?.id ?? null;
    this.activeCritter = null;
    this.activeCenterMapType = 'critters';
    this.mountedCenterMapType = null;
    this.lastMapCenterType = 'critters';
    this.activeCatalogSectionId = null;
    this.activeCatalogItemId = null;
    this.activeCenterContentItem = null;
    this.activeDesignItemId = null;
    this.catalogSections = medalsAchievementsCatalog;

    this.cosmeticSlots = cosmeticSlots;
    this.activeCosmeticSlotId = this.cosmeticSlots[0]?.id ?? null;
  }

  init() {
    const layout = this.buildLayout();
    this.shellElement = layout.shellElement;
    this.stageElement = layout.stageElement;
    this.navElement = layout.navElement;
    this.centerMapPanel = layout.centerMapPanelElement;
    this.mapCopyButton = layout.mapCopyButtonElement;
    this.mapZoomBadge = layout.mapZoomElement;
    this.phaseFilterPillElement = layout.phaseFilterPillElement;
    this.centerMapTitle = layout.centerMapTitleElement;
    this.centerMapHost = layout.centerUnlockMapElement;
    this.leftWindowToggleButton = layout.leftWindowToggleButtonElement;
    this.rightWindowToggleButton = layout.rightWindowToggleButtonElement;
    this.phaseFilterButtons = layout.phaseFilterButtons;
    this.indexWeapons();
    this.indexCritters();
    this.registerEventHandlers();
    this.applyWindowCollapseState();

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
      element: layout.centerUnlockMapElement,
      critters: this.critters,
      categories: this.critterCategories,
      bus: this.eventBus,
      zoomElement: this.mapZoomBadge,
    });
    this.weaponUnlockMap = new WeaponUnlockMap({
      element: layout.centerUnlockMapElement,
      weapons: this.weapons,
      categories: this.categories,
      critters: this.critters,
      bus: this.eventBus,
      zoomElement: this.mapZoomBadge,
    });
    this.catalogListView = new CatalogListView({
      element: layout.centerUnlockMapElement,
      onSelect: (item) => this.handleCatalogItemSelection(item),
    });
    this.libraryContentView = new LibraryContentView({
      element: layout.centerUnlockMapElement,
      onSelect: (payload) => this.handleCenterContentSelection(payload),
    });
    this.cosmeticsCatalogView = new CosmeticsCatalogView({
      element: layout.centerUnlockMapElement,
      slots: this.cosmeticSlots,
      onSelect: (payload) => this.handleCosmeticViewSelection(payload),
    });
    this.designShowcaseView = new DesignShowcaseView({
      element: layout.centerUnlockMapElement,
      onSelect: (payload) => this.handleDesignViewSelection(payload),
    });
    this.setActivePhaseFilter(this.activePhaseFilter, { syncButtons: true });
    this.sceneManager.setCritterImagePreviewLayout(
      this.critterUnlockMap.getCritterImagePreviewStateMap()
    );
    this.minigameRunner = new MinigameRunner();
    this.minigameQuest = new MinigameCritterQuest();
    this.minigameKatana = new MinigameKatanaMouse();

    if (this.navElement) {
      this.navElement.addEventListener('keydown', this.boundNavKeydown, true);
    }
    if (this.mapCopyButton) {
      this.mapCopyButton.addEventListener('click', this.boundMapCopyClick);
    }
    if (this.leftWindowToggleButton) {
      this.leftWindowToggleButton.addEventListener('click', this.boundLeftWindowToggleClick);
    }
    if (this.rightWindowToggleButton) {
      this.rightWindowToggleButton.addEventListener('click', this.boundRightWindowToggleClick);
    }
    this.phaseFilterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.setActivePhaseFilter(button.dataset.phaseFilter);
      });
    });

    this.mapsList = new NavButtonList({
      element: layout.mapsListElement,
      items: this.librarySections.maps,
      emptyMessage: 'Map catalog entries are on deck.',
      onSelect: (item) => this.showLibraryContentItem(item, { sectionKey: 'maps' }),
    });
    this.mapsList.render();

    this.modesList = new NavButtonList({
      element: layout.modesListElement,
      items: this.librarySections.gameModes,
      emptyMessage: 'Game mode catalog entries are on deck.',
      onSelect: (item) => this.showLibraryContentItem(item, { sectionKey: 'modes' }),
    });
    this.modesList.render();

    this.medalsAchievementsList = new NavButtonList({
      element: layout.medalsAchievementsListElement,
      items: this.librarySections.medalsAchievements,
      emptyMessage: 'Medals and achievements are on deck.',
      onSelect: (item) => {
        if (!item) {
          this.activeCatalogItemId = null;
          this.catalogListView?.setActive(null);
          this.hudController.showLibraryInfo({
            title: 'Medals & Achievments',
            description: 'Select Medals or Achievements to browse the full list in the center window.',
            footer: 'Career progress catalog',
          });
          return;
        }

        this.showCatalogSection(item.id);
      },
    });
    this.medalsAchievementsList.render();

    this.cosmeticsList = new NavButtonList({
      element: layout.cosmeticsListElement,
      items: this.cosmeticSlots,
      emptyMessage: 'Cosmetics catalog entries are on deck.',
      onSelect: (item) => this.showCosmeticsSlot(item),
    });
    this.cosmeticsList.render();

    this.designList = new NavButtonList({
      element: layout.designListElement,
      items: this.librarySections.design,
      emptyMessage: 'Design simulations are on deck.',
      onSelect: (item) => this.showDesignItem(item),
    });
    this.designList.render();

    this.minigamesList = new NavButtonList({
      element: layout.minigamesListElement,
      items: this.librarySections.minigames,
      emptyMessage: 'Minigames are on deck.',
      onSelect: (item) => {
        if (!item) {
          this.unmountMinigames();
          this.hudController.clearInfo();
          return;
        }
        this.restoreMapCenterView();
        this.clearLibrarySelections('minigames');
        this.syncLeftWindowSelection('minigames');
        if (item.id === 'run') {
          this.unmountMinigames();
          const body = this.hudController.showCustomPanel({
            title: item.label,
            footer: 'Jump: Space/Up · Duck: Down/S · Restart: R · Pause: P',
            className: 'panel--minigame',
          });
          this.minigameRunner?.mount(body);
          return;
        }
        if (item.id === 'critter-quest') {
          this.unmountMinigames();
          const body = this.hudController.showCustomPanel({
            title: item.label,
            footer: 'Adventure: Dialog · Quests · Dungeons · Combat',
            className: 'panel--minigame',
          });
          this.minigameQuest?.mount(body);
          return;
        }
        if (item.id === 'katana-mouse') {
          this.unmountMinigames();
          const body = this.hudController.showCustomPanel({
            title: item.label,
            footer: 'Move: WASD/Arrows · Slash/Gun: Space · Dash: Shift · Freeze: F · Swap Gun: Q · Restart: R',
            className: 'panel--minigame',
          });
          this.minigameKatana?.mount(body);
          return;
        }
        this.unmountMinigames();
        this.hudController.showLibraryInfo({
          title: item.title || item.label,
          description: item.description || 'Minigame info coming soon.',
          footer: item.footer || 'Minigame info coming soon',
        });
      },
    });
    this.minigamesList.render();

    this.brainstormingList = new NavButtonList({
      element: layout.brainstormingListElement,
      items: this.librarySections.brainstorming,
      emptyMessage: 'Brainstorming notes are on deck.',
      onSelect: (item) => this.showLibraryContentItem(item, { sectionKey: 'brainstorming' }),
    });
    this.brainstormingList.render();

    this.activeAnimationId = null;
    this.critterSelector.render(this.activeCritterCategory);
    this.setCenterMapType('critters');
    this.syncLeftWindowSelection('critters');
    this.hudController.showCritterCategoryGuide({
      categoryLabel: this.getCritterCategoryLabel(this.activeCritterCategory),
      critterCount: this.getCrittersByCategory(this.activeCritterCategory).length,
    });
    this.setStageActive(false);
  }

  buildLayout() {
    this.root.innerHTML = `
      <div class="app-shell" data-component="app-shell">
        <nav class="hud-nav" id="left-window" aria-label="Interface options">
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
          <details class="nav-section nav-section--medals-achievements">
            <summary class="nav-section__summary">Medals &amp; Achievments</summary>
            <div class="nav-section__content">
              <div data-component="medals-achievements-list"></div>
            </div>
          </details>
          <details class="nav-section nav-section--cosmetics">
            <summary class="nav-section__summary">Cosmetics</summary>
            <div class="nav-section__content">
              <div data-component="cosmetics-list"></div>
            </div>
          </details>
          <details class="nav-section nav-section--design">
            <summary class="nav-section__summary">Design</summary>
            <div class="nav-section__content">
              <div data-component="design-list"></div>
            </div>
          </details>
          <details class="nav-section nav-section--brainstorming">
            <summary class="nav-section__summary">Brainstorming</summary>
            <div class="nav-section__content">
              <div data-component="brainstorming-list"></div>
            </div>
          </details>
        </nav>
        <section class="panel hud-panel hud-map" data-component="center-map-panel">
          <div class="panel-header">
            <span data-role="center-map-title">Critter Unlock Map</span>
            <div class="panel-header__actions">
              <span class="unlock-map__zoom unlock-map__zoom--header" data-role="map-zoom-header">100%</span>
              <div class="phase-filter-pill" data-role="phase-filter-pill" aria-label="Visible map phase">
                ${PHASE_OPTIONS.filter((option) => option.value !== 'unassigned')
                  .map(
                    (option) => `
                      <button
                        type="button"
                        class="phase-filter-pill__button"
                        data-action="set-phase-filter"
                        data-phase-filter="${option.value}"
                        aria-pressed="${Number(option.value) === DEFAULT_PHASE_FILTER ? 'true' : 'false'}"
                      >
                        ${option.label}
                      </button>
                    `
                  )
                  .join('')}
              </div>
              <button
                type="button"
                class="panel-copy-button"
                data-action="toggle-left-window"
                aria-controls="left-window"
                aria-expanded="true"
              >
                Hide Left
              </button>
              <button
                type="button"
                class="panel-copy-button"
                data-action="toggle-right-window"
                aria-controls="right-window"
                aria-expanded="true"
              >
                Hide Right
              </button>
              <button type="button" class="panel-copy-button" data-action="copy-map-layout">
                Copy Layout
              </button>
            </div>
          </div>
          <div class="detail-content">
            <div class="detail-scroll detail-scroll--map" data-component="center-unlock-map"></div>
          </div>
        </section>
        <section class="inspector" id="right-window" data-component="inspector">
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
              <span>Info</span>
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
      shellElement: this.root.querySelector('[data-component="app-shell"]'),
      stageElement: this.root.querySelector('[data-component="stage"]'),
      stageViewportElement: this.root.querySelector('[data-role="stage-viewport"]'),
      categoryMenuElement: this.root.querySelector('[data-component="weapon-category-menu"]'),
      critterSelectorElement: this.root.querySelector('[data-component="critter-selector"]'),
      centerUnlockMapElement: this.root.querySelector('[data-component="center-unlock-map"]'),
      weaponDetailPanel: this.root.querySelector('[data-component="weapon-detail"]'),
      rarityBadge: this.root.querySelector('[data-role="rarity-badge"]'),
      detailFooter: this.root.querySelector('[data-role="detail-footer"]'),
      centerMapTitleElement: this.root.querySelector('[data-role="center-map-title"]'),
      centerMapPanelElement: this.root.querySelector('[data-component="center-map-panel"]'),
      mapsListElement: this.root.querySelector('[data-component="maps-list"]'),
      modesListElement: this.root.querySelector('[data-component="modes-list"]'),
      medalsAchievementsListElement: this.root.querySelector(
        '[data-component="medals-achievements-list"]'
      ),
      cosmeticsListElement: this.root.querySelector('[data-component="cosmetics-list"]'),
      designListElement: this.root.querySelector('[data-component="design-list"]'),
      minigamesListElement: this.root.querySelector('[data-component="minigames-list"]'),
      brainstormingListElement: this.root.querySelector('[data-component="brainstorming-list"]'),
      mapCopyButtonElement: this.root.querySelector('[data-action="copy-map-layout"]'),
      leftWindowToggleButtonElement: this.root.querySelector('[data-action="toggle-left-window"]'),
      rightWindowToggleButtonElement: this.root.querySelector('[data-action="toggle-right-window"]'),
      mapZoomElement: this.root.querySelector('[data-role="map-zoom-header"]'),
      phaseFilterPillElement: this.root.querySelector('[data-role="phase-filter-pill"]'),
      phaseFilterButtons: Array.from(
        this.root.querySelectorAll('[data-action="set-phase-filter"]')
      ),
      navElement: this.root.querySelector('.hud-nav'),
    };
  }

  toggleWindowCollapse(side) {
    if (side === 'left') {
      this.leftWindowCollapsed = !this.leftWindowCollapsed;
    } else if (side === 'right') {
      this.rightWindowCollapsed = !this.rightWindowCollapsed;
    } else {
      return;
    }

    this.applyWindowCollapseState();

    requestAnimationFrame(() => {
      this.sceneManager?.handleResize?.();
    });
  }

  applyWindowCollapseState() {
    if (!this.shellElement) {
      return;
    }

    this.shellElement.classList.toggle('is-left-collapsed', this.leftWindowCollapsed);
    this.shellElement.classList.toggle('is-right-collapsed', this.rightWindowCollapsed);
    this.updateWindowToggleButton(this.leftWindowToggleButton, {
      collapsed: this.leftWindowCollapsed,
      collapsedLabel: 'Show Left',
      expandedLabel: 'Hide Left',
      expandedAriaLabel: 'Collapse left window',
      collapsedAriaLabel: 'Expand left window',
    });
    this.updateWindowToggleButton(this.rightWindowToggleButton, {
      collapsed: this.rightWindowCollapsed,
      collapsedLabel: 'Show Right',
      expandedLabel: 'Hide Right',
      expandedAriaLabel: 'Collapse right window',
      collapsedAriaLabel: 'Expand right window',
    });
  }

  updateWindowToggleButton(
    button,
    { collapsed, collapsedLabel, expandedLabel, expandedAriaLabel, collapsedAriaLabel }
  ) {
    if (!button) {
      return;
    }

    button.textContent = collapsed ? collapsedLabel : expandedLabel;
    button.setAttribute('aria-expanded', String(!collapsed));
    button.setAttribute('aria-label', collapsed ? collapsedAriaLabel : expandedAriaLabel);
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
      this.activeWeapon = null;
      this.activeAnimationId = null;
      if (this.activeCritter) {
        this.clearActiveCritter({ showGuide: false });
      } else {
        this.critterUnlockMap?.setActiveCritter(null);
        this.sceneManager?.disposeCurrentModel?.();
        this.setStageActive(false);
      }
      this.weaponUnlockMap?.setActiveWeapon(null);
      this.weaponUnlockMap?.setActiveAlienNode(null);
      this.activeCategory = category;
      this.weaponUnlockMap?.setCategory(category);
      this.setCenterMapType('weapons');
      this.syncLeftWindowSelection('weapons');
      this.hudController.showWeaponCategoryGuide({
        categoryLabel: this.getWeaponCategoryLabel(category),
        weaponCount: this.getWeaponsByCategory(category).length,
      });
    });

    this.eventBus.on('hud:weapon-selected', (weaponId) => {
      const weapon = this.weaponMap.get(weaponId);
      if (!weapon) {
        console.warn(`Weapon with id "${weaponId}" was not found.`);
        return;
      }
      this.unmountMinigames();
      if (this.activeCritter) {
        this.clearActiveCritter({ showGuide: false });
      }
      this.activeWeapon = weapon;
      this.weaponUnlockMap?.setActiveWeapon(weaponId);
      this.setCenterMapType('weapons');
      this.syncLeftWindowSelection('weapons');
      this.setStageActive(true);
      this.sceneManager.loadWeapon(weapon);
      this.sceneManager.applyRarityGlow();
      this.clearLibrarySelections();
    });

    this.eventBus.on('critter:category-selected', (categoryId) => {
      if (!categoryId) {
        return;
      }

      this.unmountMinigames();
      this.activeCritterCategory = categoryId;
      this.activeWeapon = null;
      this.weaponUnlockMap?.setActiveWeapon(null);
      this.clearActiveCritter({ showGuide: false });
      this.critterSelector?.setActiveCategory?.(categoryId, { emit: false });
      this.critterUnlockMap?.setCategory(categoryId);
      this.setCenterMapType('critters');
      this.syncLeftWindowSelection('critters');
      this.clearLibrarySelections();
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

      this.unmountMinigames();
      this.clearLibrarySelections();
      this.activeWeapon = null;
      this.weaponUnlockMap?.setActiveWeapon(null);
      this.setCenterMapType('critters');
      this.syncLeftWindowSelection('critters');
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

    this.eventBus.on('weapon-map:selected', (weaponId) => {
      if (!weaponId) {
        this.activeWeapon = null;
        this.weaponUnlockMap?.setActiveWeapon(null);
        this.sceneManager?.disposeCurrentModel?.();
        this.setStageActive(false);
        this.hudController.showWeaponCategoryGuide({
          categoryLabel: this.getWeaponCategoryLabel(this.activeCategory),
          weaponCount: this.getWeaponsByCategory(this.activeCategory).length,
        });
        return;
      }

      const weapon = this.weaponMap.get(weaponId);
      if (!weapon) {
        return;
      }

      if (weapon.category !== this.activeCategory) {
        this.activeCategory = weapon.category;
        this.hudController.weaponCategoryMenu?.setActiveCategory?.(weapon.category);
        this.weaponUnlockMap?.setCategory(weapon.category);
      }

      this.hudController.selectWeapon(weaponId, { emit: true });
    });

    this.eventBus.on('weapon-map:alien-selected', (payload) => {
      if (!payload?.critterId && !payload?.weaponId) {
        this.activeWeapon = null;
        this.weaponUnlockMap?.setActiveAlienNode(null);
        this.sceneManager?.disposeCurrentModel?.();
        this.setStageActive(false);
        this.hudController.showWeaponCategoryGuide({
          categoryLabel: this.getWeaponCategoryLabel(this.activeCategory),
          weaponCount: this.getWeaponsByCategory(this.activeCategory).length,
        });
        return;
      }

      if (payload?.weaponId) {
        const weapon = this.weaponMap.get(payload.weaponId);
        if (!weapon) {
          return;
        }

        this.unmountMinigames();
        this.clearLibrarySelections();
        this.activeWeapon = null;
        this.activeAnimationId = null;
        this.activeCritter = null;
        this.critterUnlockMap?.setActiveCritter(null);
        this.weaponUnlockMap?.setActiveAlienNode(payload.alienNodeId || null);
        this.setCenterMapType('weapons');
        this.syncLeftWindowSelection('weapons');
        this.hudController.showWeaponInfo(weapon);

        this.setStageActive(true);
        this.sceneManager.loadWeapon(weapon);
        this.sceneManager.applyRarityGlow();
        return;
      }

      const critter = this.critterMap.get(payload.critterId);
      if (!critter) {
        return;
      }

      this.unmountMinigames();
      this.clearLibrarySelections();
      this.activeWeapon = null;
      this.activeAnimationId = null;
      this.activeCritter = null;
      this.critterUnlockMap?.setActiveCritter(null);
      this.weaponUnlockMap?.setActiveAlienNode(payload.alienNodeId || null);
      this.setCenterMapType('weapons');
      this.syncLeftWindowSelection('weapons');
      this.hudController.showCritterInfo(critter, {
        categoryLabel: this.getCritterCategoryLabel(critter.category),
      });

      const previewAnimationId = this.resolveAnimationId(critter);
      const previewAnimation = this.findAnimation(critter, previewAnimationId);

      this.setStageActive(true);
      this.sceneManager.loadCritter(critter).then(() => {
        if (previewAnimation) {
          this.sceneManager.playAnimation(previewAnimation);
        } else {
          this.sceneManager.stopAnimation();
        }
      });
    });

  }

  unmountMinigames() {
    this.minigameRunner?.unmount();
    this.minigameQuest?.unmount();
    this.minigameKatana?.unmount();
  }

  clearLibrarySelections(except = null) {
    const lists = [
      ['maps', this.mapsList],
      ['modes', this.modesList],
      ['medals-achievements', this.medalsAchievementsList],
      ['cosmetics', this.cosmeticsList],
      ['design', this.designList],
      ['minigames', this.minigamesList],
      ['brainstorming', this.brainstormingList],
    ];

    lists.forEach(([key, list]) => {
      if (key !== except) {
        list?.setActive(null);
      }
    });
  }

  indexWeapons() {
    this.weaponMap.clear();
    this.weapons.forEach((weapon) => {
      this.weaponMap.set(weapon.id, weapon);
    });
  }

  buildWeaponsCatalog() {
    const merged = new Map(
      (sampleWeapons || []).map((weapon) => [
        weapon.id,
        {
          ...weapon,
          imagePath: weapon.imagePath || null,
        },
      ])
    );

    Object.entries(weaponsMapDefaultLayout?.categories || {}).forEach(([categoryId, categoryLayout]) => {
      const layoutWeapons = Array.isArray(categoryLayout?.weapons) ? categoryLayout.weapons : [];
      layoutWeapons.forEach((entry) => {
        const existing = merged.get(entry.id);
        if (existing) {
          merged.set(entry.id, {
            ...existing,
            category: existing.category || categoryId,
            imagePath: existing.imagePath || entry.imagePath || null,
            requirements: Array.isArray(entry.requirements) ? entry.requirements : existing.requirements || [],
            phase: entry.phase ?? existing.phase,
          });
          return;
        }

        merged.set(entry.id, {
          id: entry.id,
          name: entry.name,
          category: categoryId,
          rarity: 'common',
          description: 'Weapon data entry is pending. Using the weapon image as the current preview placeholder.',
          modelPath: null,
          imagePath: entry.imagePath || null,
          preview: {
            rotation: { x: 0, y: 0, z: 0 },
            scale: 1.2,
          },
          stats: {
            info: '3D model pending. Using weapon image placeholder.',
          },
          special: {},
          requirements: Array.isArray(entry.requirements) ? entry.requirements : [],
          phase: entry.phase,
        });
      });
    });

    return Array.from(merged.values());
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

  getWeaponsByCategory(categoryId) {
    if (!categoryId) {
      return [];
    }
    return this.weapons.filter((weapon) => weapon.category === categoryId);
  }

  getWeaponCategoryLabel(categoryId) {
    return String(categoryId || 'Weapons')
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

  getCosmeticSlot(slotId) {
    return this.cosmeticSlots.find((slot) => slot.id === slotId) || null;
  }

  getDesignItem(itemId) {
    return this.librarySections.design?.find((item) => item.id === itemId) || null;
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

  syncLeftWindowSelection(activeSection) {
    const showCritterSelection = activeSection === 'critters';
    const showWeaponSelection = activeSection === 'weapons';

    this.critterSelector?.setActiveCategory?.(
      showCritterSelection ? this.activeCritterCategory : null,
      { emit: false }
    );
    this.hudController?.weaponCategoryMenu?.setActiveCategory(
      showWeaponSelection ? this.activeCategory : null
    );
  }

  getActiveMapController() {
    if (this.activeCenterMapType === 'weapons') {
      return this.weaponUnlockMap;
    }

    if (this.activeCenterMapType === 'critters') {
      return this.critterUnlockMap;
    }

    return null;
  }

  mountCenterMap(mapType) {
    if (!this.centerMapHost) {
      return;
    }

    if (mapType === 'content') {
      this.libraryContentView.element = this.centerMapHost;
      this.libraryContentView.render(this.activeCenterContentItem);
      this.mountedCenterMapType = 'content';
      return;
    }

    if (mapType === 'catalog') {
      this.catalogListView.element = this.centerMapHost;
      this.catalogListView.render(
        this.activeCatalogSectionId ? this.catalogSections[this.activeCatalogSectionId] : null
      );
      this.catalogListView.setActive(this.activeCatalogItemId);
      this.mountedCenterMapType = 'catalog';
      return;
    }

    if (mapType === 'cosmetics') {
      this.cosmeticsCatalogView.element = this.centerMapHost;
      this.cosmeticsCatalogView.render({
        activeSlotId: this.activeCosmeticSlotId,
      });
      this.mountedCenterMapType = 'cosmetics';
      return;
    }

    if (mapType === 'design') {
      this.designShowcaseView.element = this.centerMapHost;
      this.designShowcaseView.render(this.getDesignItem(this.activeDesignItemId));
      this.mountedCenterMapType = 'design';
      return;
    }

    if (mapType === 'weapons') {
      this.weaponUnlockMap.element = this.centerMapHost;
      this.weaponUnlockMap.render(this.activeCategory);
      this.weaponUnlockMap.setActiveWeapon(this.activeWeapon?.id || null);
      this.mountedCenterMapType = 'weapons';
      return;
    }

    this.critterUnlockMap.element = this.centerMapHost;
    this.critterUnlockMap.render(this.activeCritterCategory);
    this.critterUnlockMap.setActiveCritter(this.activeCritter?.id || null);
    this.mountedCenterMapType = 'critters';
  }

  setCenterMapType(mapType, { force = false } = {}) {
    if (mapType === 'weapons') {
      this.activeCenterMapType = 'weapons';
    } else if (mapType === 'catalog') {
      this.activeCenterMapType = 'catalog';
    } else if (mapType === 'cosmetics') {
      this.activeCenterMapType = 'cosmetics';
    } else if (mapType === 'design') {
      this.activeCenterMapType = 'design';
    } else if (mapType === 'content') {
      this.activeCenterMapType = 'content';
    } else {
      this.activeCenterMapType = 'critters';
    }

    if (this.activeCenterMapType === 'critters' || this.activeCenterMapType === 'weapons') {
      this.lastMapCenterType = this.activeCenterMapType;
    }

    if (force || this.mountedCenterMapType !== this.activeCenterMapType) {
      this.mountCenterMap(this.activeCenterMapType);
    }

    this.syncCenterPanelChrome();

    if (this.centerMapTitle) {
      if (this.activeCenterMapType === 'weapons') {
        this.centerMapTitle.textContent = 'Weapon Unlock Map';
      } else if (this.activeCenterMapType === 'catalog') {
        this.centerMapTitle.textContent =
          this.catalogSections[this.activeCatalogSectionId]?.title || 'Catalog';
      } else if (this.activeCenterMapType === 'cosmetics') {
        this.centerMapTitle.textContent =
          this.getCosmeticSlot(this.activeCosmeticSlotId)?.title || 'Cosmetics';
      } else if (this.activeCenterMapType === 'design') {
        this.centerMapTitle.textContent =
          this.getDesignItem(this.activeDesignItemId)?.title || 'Design';
      } else if (this.activeCenterMapType === 'content') {
        this.centerMapTitle.textContent =
          this.activeCenterContentItem?.title || this.activeCenterContentItem?.label || 'Library';
      } else {
        this.centerMapTitle.textContent = 'Critter Unlock Map';
      }
    }
  }

  syncCenterPanelChrome() {
    const isCatalogView = this.activeCenterMapType === 'catalog';
    const isContentView = this.activeCenterMapType === 'content';
    const isCosmeticsView = this.activeCenterMapType === 'cosmetics';
    const isDesignView = this.activeCenterMapType === 'design';

    this.centerMapPanel?.classList.toggle('hud-map--catalog', isCatalogView);
    this.centerMapPanel?.classList.toggle('hud-map--content', isContentView);
    this.centerMapPanel?.classList.toggle('hud-map--cosmetics', isCosmeticsView);
    this.centerMapPanel?.classList.toggle('hud-map--design', isDesignView);

    if (this.mapZoomBadge) {
      this.mapZoomBadge.hidden = isCatalogView || isContentView || isCosmeticsView || isDesignView;
    }

    if (this.phaseFilterPillElement) {
      this.phaseFilterPillElement.hidden = isCatalogView || isContentView || isCosmeticsView || isDesignView;
    }

    if (this.mapCopyButton) {
      this.mapCopyButton.hidden = isCatalogView || isContentView || isCosmeticsView || isDesignView;
    }
  }

  clearSceneSelection() {
    this.activeWeapon = null;
    this.activeCritter = null;
    this.activeAnimationId = null;
    this.critterUnlockMap?.setActiveCritter(null);
    this.weaponUnlockMap?.setActiveWeapon(null);
    this.weaponUnlockMap?.setActiveAlienNode(null);
    this.sceneManager?.disposeCurrentModel?.();
    this.setStageActive(false);
    this.eventBus.emit('viewport:critter-cleared');
  }

  restoreMapCenterView() {
    if (
      this.activeCenterMapType === 'catalog' ||
      this.activeCenterMapType === 'content' ||
      this.activeCenterMapType === 'cosmetics' ||
      this.activeCenterMapType === 'design'
    ) {
      this.activeCenterContentItem = null;
      this.setCenterMapType(this.lastMapCenterType || 'critters', { force: true });
    }
  }

  refreshCosmeticsView() {
    if (this.mountedCenterMapType === 'cosmetics' || this.activeCenterMapType === 'cosmetics') {
      this.cosmeticsCatalogView?.render({
        activeSlotId: this.activeCosmeticSlotId,
      });
    }
  }

  showActiveCosmeticInfo() {
    const slot = this.getCosmeticSlot(this.activeCosmeticSlotId);

    this.hudController.showCosmeticGuide({
      slotTitle: slot?.title || slot?.label || 'Cosmetics',
      slotDescription:
        slot?.description ||
        'The category structure is still here, but the placeholder individual cosmetics were removed.',
    });
  }

  showCosmeticsSlot(item) {
    this.unmountMinigames();

    if (!item) {
      this.clearSceneSelection();
      this.restoreMapCenterView();
      this.showCurrentMapGuide();
      return;
    }

    this.clearSceneSelection();
    this.clearLibrarySelections('cosmetics');
    this.syncLeftWindowSelection('cosmetics');
    this.activeCatalogSectionId = null;
    this.activeCatalogItemId = null;
    this.activeCenterContentItem = null;
    this.activeCosmeticSlotId = item.id;
    this.setCenterMapType('cosmetics', { force: true });
    this.refreshCosmeticsView();
    this.showActiveCosmeticInfo();
  }

  handleCosmeticViewSelection(payload) {
    if (!payload?.type) {
      return;
    }

    if (payload.type === 'slot') {
      if (!payload.slotId) {
        return;
      }

      this.activeCosmeticSlotId = payload.slotId;
      this.cosmeticsList?.setActive(payload.slotId);
      this.setCenterMapType('cosmetics', { force: true });
      this.refreshCosmeticsView();
      this.showActiveCosmeticInfo();
    }
  }

  showActiveDesignInfo() {
    const item = this.getDesignItem(this.activeDesignItemId);

    if (!item) {
      this.hudController.clearInfo();
      return;
    }

    this.hudController.showLibraryInfo({
      title: item.title || item.label || 'Design',
      description: '',
      footer: '',
    });
  }

  showDesignItem(item) {
    this.unmountMinigames();

    if (!item) {
      this.activeDesignItemId = null;
      this.clearSceneSelection();
      this.restoreMapCenterView();
      this.showCurrentMapGuide();
      return;
    }

    this.clearSceneSelection();
    this.clearLibrarySelections('design');
    this.syncLeftWindowSelection('design');
    this.activeCatalogSectionId = null;
    this.activeCatalogItemId = null;
    this.activeCenterContentItem = null;
    this.activeDesignItemId = item.id;
    this.setCenterMapType('design', { force: true });
    this.showActiveDesignInfo();
  }

  handleDesignViewSelection(payload) {
    if (!payload?.type) {
      return;
    }

    if (payload.type === 'design-action') {
      this.showActiveDesignInfo();
    }
  }

  showCurrentMapGuide() {
    if (this.lastMapCenterType === 'weapons') {
      this.syncLeftWindowSelection('weapons');
      this.hudController.showWeaponCategoryGuide({
        categoryLabel: this.getWeaponCategoryLabel(this.activeCategory),
        weaponCount: this.getWeaponsByCategory(this.activeCategory).length,
      });
      return;
    }

    this.syncLeftWindowSelection('critters');
    this.hudController.showCritterCategoryGuide({
      categoryLabel: this.getCritterCategoryLabel(this.activeCritterCategory),
      critterCount: this.getCrittersByCategory(this.activeCritterCategory).length,
    });
  }

  showLibraryContentItem(item, { sectionKey } = {}) {
    this.unmountMinigames();

    if (!item) {
      this.restoreMapCenterView();
      this.showCurrentMapGuide();
      return;
    }

    this.clearSceneSelection();
    this.clearLibrarySelections(sectionKey);
    this.syncLeftWindowSelection(sectionKey);
    this.activeCatalogSectionId = null;
    this.activeCatalogItemId = null;
    this.activeCenterContentItem = item;
    this.setCenterMapType('content', { force: true });
    if (item.viewType === 'timeline') {
      this.hudController.showLibraryInfo({
        title: item.title || item.label || 'Roadmap',
        description: 'Select a milestone box in the center window to see its details here.',
        footer: 'Right Window follows center roadmap selections',
      });
      return;
    }

    this.hudController.showLibraryInfo({
      title: 'Info',
      description: 'This section is being displayed in the center window.',
      footer: 'Right Window follows center selections',
    });
  }

  handleCenterContentSelection(payload) {
    if (!payload || payload.type !== 'timeline-milestone' || !payload.info) {
      return;
    }

    this.hudController.showLibraryInfo(payload.info);
  }

  showCatalogSection(sectionId) {
    const section = this.catalogSections[sectionId];
    if (!section) {
      return;
    }

    this.unmountMinigames();
    this.clearSceneSelection();
    this.clearLibrarySelections('medals-achievements');
    this.syncLeftWindowSelection('medals-achievements');

    this.activeCenterContentItem = null;
    this.activeCatalogSectionId = sectionId;
    const selectedItem =
      section.items.find((item) => item.id === this.activeCatalogItemId) || section.items[0] || null;
    this.activeCatalogItemId = selectedItem?.id || null;

    this.setCenterMapType('catalog', { force: true });

    if (selectedItem) {
      this.handleCatalogItemSelection(selectedItem);
      return;
    }

    this.hudController.showLibraryInfo({
      title: section.title,
      description: section.description || 'Catalog entries are coming soon.',
      footer: section.detailFooter || 'Catalog',
    });
  }

  handleCatalogItemSelection(item) {
    const section = this.catalogSections[this.activeCatalogSectionId];
    if (!item || !section) {
      this.hudController.clearInfo();
      return;
    }

    this.activeCatalogItemId = item.id;
    this.catalogListView?.setActive(item.id);
    this.hudController.showLibraryInfo({
      title: item.label,
      description: item.description || 'Info coming soon.',
      footer: item.footer || section.detailFooter || section.title,
    });
  }

  setStageActive(isActive) {
    this.stageElement?.classList.toggle('has-critter', Boolean(isActive));
  }

  setActivePhaseFilter(phase, { syncButtons = true } = {}) {
    this.activePhaseFilter = normalizePhaseFilter(phase);
    this.critterUnlockMap?.setPhaseFilter?.(this.activePhaseFilter);
    this.weaponUnlockMap?.setPhaseFilter?.(this.activePhaseFilter);

    if (syncButtons) {
      this.phaseFilterButtons.forEach((button) => {
        const buttonPhase = normalizePhaseFilter(button.dataset.phaseFilter);
        const isIncluded = buttonPhase <= this.activePhaseFilter;
        const isCurrent = buttonPhase === this.activePhaseFilter;
        button.classList.toggle('is-active', isIncluded);
        button.classList.toggle('is-current', isCurrent);
        button.setAttribute('aria-pressed', isIncluded ? 'true' : 'false');
      });
    }
  }
}
