import { AppState } from '../core/AppState.js';
import { EventBus } from '../core/EventBus.js';
import { WeaponRepository } from '../data/weaponData.js';
import { WeaponStatSchema } from '../data/weaponSchema.js';
import { HudController } from '../systems/hud/HudController.js';
import { WeaponScene } from '../systems/scene/WeaponScene.js';

export class App {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.eventBus = new EventBus();
    this.state = new AppState();
    this.repository = new WeaponRepository();

    this.sceneContainer = null;
    this.hudLayer = null;
    this.hud = null;
    this.scene = null;
  }

  init() {
    this.#composeRoot();
    this.#registerEvents();

    this.hud = new HudController(this.hudLayer, {
      eventBus: this.eventBus,
      statSchema: WeaponStatSchema,
    });

    const categories = this.repository.getCategories();
    this.state.setCategories(categories);
    this.hud.setCategories(categories);

    this.scene = new WeaponScene(this.sceneContainer, {
      eventBus: this.eventBus,
    });
    this.scene.init();

    const defaultCategory = this.repository.getDefaultCategory();
    if (defaultCategory) {
      this.eventBus.emit('category:requested', defaultCategory.id);
    }
  }

  #composeRoot() {
    this.rootElement.innerHTML = `
      <div class="scene-container" id="scene-container"></div>
      <div class="hud-layer" id="hud-layer"></div>
    `;

    this.sceneContainer = this.rootElement.querySelector('#scene-container');
    this.hudLayer = this.rootElement.querySelector('#hud-layer');

    if (!this.sceneContainer || !this.hudLayer) {
      throw new Error('Failed to construct application layout.');
    }
  }

  #registerEvents() {
    this.eventBus.on('category:requested', (categoryId) => {
      const category = this.repository.findCategory(categoryId);
      if (!category) {
        return;
      }

      this.state.setActiveCategory(categoryId);
      this.eventBus.emit('category:selected', { category });

      const weapon = this.repository.getDefaultWeaponByCategory(categoryId);
      if (weapon) {
        this.state.setActiveWeapon(weapon.id);
        this.eventBus.emit('weapon:selected', { weapon, category });
      }
    });

    this.eventBus.on('weapon:requested', (weaponId) => {
      const weapon = this.repository.findWeapon(weaponId);
      if (!weapon) {
        return;
      }

      this.state.setActiveWeapon(weaponId);
      const category = this.repository.findCategory(weapon.categoryId);
      this.eventBus.emit('weapon:selected', { weapon, category });
    });
  }
}
