import { createElement } from '../utils/dom.js';
import { getCategoryById } from '../config/categories.js';
import WeaponShowcaseScene from '../scenes/weaponShowcaseScene.js';

export default class WeaponViewer {
  constructor({ container, eventBus }) {
    this.container = container;
    this.eventBus = eventBus;
    this.scene = null;
    this.overlay = null;
    this.canvasMount = null;
    this.resizeObserver = null;
    this.unsubscribe = [];
    this.boundHandleResize = this.handleResize.bind(this);
  }

  init() {
    this.container.innerHTML = '';
    this.container.classList.add('weapon-viewer');

    this.canvasMount = createElement('div', { classNames: 'weapon-viewer__canvas' });
    this.overlay = createElement('div', { classNames: 'weapon-viewer__overlay' });
    this.overlay.appendChild(
      createElement('div', {
        classNames: 'weapon-viewer__placeholder-copy',
        text: 'Awaiting weapon selection...'
      })
    );

    this.container.appendChild(this.canvasMount);
    this.container.appendChild(this.overlay);

    this.scene = new WeaponShowcaseScene({ mount: this.canvasMount });
    this.scene.init();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener('resize', this.boundHandleResize);
    }
    this.handleResize();

    this.unsubscribe.push(
      this.eventBus.on('weapon:selected', ({ weapon }) => {
        this.presentWeapon(weapon);
      })
    );
  }

  handleResize() {
    if (!this.scene) return;
    const { width, height } = this.container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    this.scene.setSize(width, height);
  }

  presentWeapon(weapon) {
    if (!this.scene) return;

    if (!weapon) {
      this.overlay.innerHTML = '';
      this.overlay.appendChild(
        createElement('div', {
          classNames: 'weapon-viewer__placeholder-copy',
          text: 'Awaiting weapon selection...',
        })
      );
      this.scene.presentWeapon(null);
      return;
    }

    this.overlay.innerHTML = '';
    this.overlay.appendChild(
      createElement('div', {
        classNames: 'weapon-viewer__weapon-title',
        text: weapon.core.name,
      })
    );
    const category = getCategoryById(weapon.core.category);
    const categoryLabel = category?.label || weapon.core.category;
    const rarityLabel = weapon.core.rarity || '';
    const metaText = rarityLabel ? `${rarityLabel} • ${categoryLabel}` : categoryLabel;

    this.overlay.appendChild(
      createElement('div', {
        classNames: 'weapon-viewer__weapon-meta',
        text: metaText,
      })
    );

    this.scene.presentWeapon(weapon);
  }

  destroy() {
    this.unsubscribe.forEach((off) => off && off());
    this.unsubscribe = [];
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else {
      window.removeEventListener('resize', this.boundHandleResize);
    }
    if (this.scene) {
      this.scene.dispose();
      this.scene = null;
    }
  }
}
