import EventBus from './eventBus.js';
import HUD from '../ui/hud.js';
import WeaponViewer from '../components/weaponViewer.js';
import WeaponRegistry from '../data/weaponRegistry.js';
import { weaponSchema } from '../data/weaponSchema.js';
import { createElement } from '../utils/dom.js';

export default class App {
  constructor({ root, categories, weapons, defaultCategory }) {
    this.root = root;
    this.categories = categories;
    this.weapons = weapons;
    this.defaultCategory = defaultCategory;

    this.eventBus = new EventBus();
    this.weaponRegistry = new WeaponRegistry({
      schema: weaponSchema,
      weapons: this.weapons,
      categories: this.categories,
    });

    this.hud = null;
    this.viewer = null;
    this.activeCategory = null;
    this.activeWeapon = null;

    this.unsubscribe = [];
  }

  init() {
    this.mountBaseLayout();
    this.registerEventHandlers();

    this.hud = new HUD({
      root: this.hudContainer,
      categories: this.categories,
      eventBus: this.eventBus,
      registry: this.weaponRegistry,
    });
    this.hud.init();

    this.viewer = new WeaponViewer({
      container: this.hud.getViewerMount(),
      eventBus: this.eventBus,
    });
    this.viewer.init();

    const initialCategory = this.defaultCategory || this.categories[0]?.id;
    if (initialCategory) {
      this.hud.selectCategory(initialCategory, { emit: true });
    }
  }

  mountBaseLayout() {
    this.root.innerHTML = '';
    this.root.classList.add('app-root');

    const background = createElement('div', { classNames: 'arcane-backdrop' });
    const glow = createElement('div', { classNames: 'arcane-backdrop__glow' });
    background.appendChild(glow);

    this.hudContainer = createElement('div', { classNames: 'hud-container' });

    this.root.appendChild(background);
    this.root.appendChild(this.hudContainer);
  }

  registerEventHandlers() {
    this.unsubscribe.push(
      this.eventBus.on('category:selected', ({ categoryId }) => {
        this.onCategorySelected(categoryId);
      })
    );

    this.unsubscribe.push(
      this.eventBus.on('weapon:selected', ({ weapon }) => {
        this.onWeaponSelected(weapon);
      })
    );
  }

  onCategorySelected(categoryId) {
    this.activeCategory = categoryId;
    if (!this.activeWeapon || this.activeWeapon.core.category !== categoryId) {
      const fallback = this.weaponRegistry.getFirstWeaponInCategory(categoryId);
      if (fallback && fallback.core.slug !== this.activeWeapon?.core?.slug) {
        this.eventBus.emit('weapon:selected', { weapon: fallback, meta: { auto: true } });
      } else if (!fallback) {
        this.eventBus.emit('weapon:selected', { weapon: null, meta: { auto: true } });
      }
    }
  }

  onWeaponSelected(weapon) {
    this.activeWeapon = weapon;
    if (weapon && this.activeCategory !== weapon.core.category) {
      this.activeCategory = weapon.core.category;
      this.hud.highlightCategory(this.activeCategory);
    }
  }

  destroy() {
    this.unsubscribe.forEach((off) => off && off());
    this.unsubscribe = [];

    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }

    if (this.hud) {
      this.hud = null;
    }

    this.eventBus.clear();
  }
}
