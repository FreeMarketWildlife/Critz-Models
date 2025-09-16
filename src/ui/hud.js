import { createElement } from '../utils/dom.js';
import CategoryTabs from './categoryTabs.js';
import WeaponList from './weaponList.js';
import WeaponDetailPanel from './weaponDetailPanel.js';

export default class HUD {
  constructor({ root, categories, eventBus, registry }) {
    this.root = root;
    this.categories = categories;
    this.eventBus = eventBus;
    this.registry = registry;

    this.categoryTabs = null;
    this.weaponList = null;
    this.weaponDetail = null;
    this.viewerMount = null;
  }

  init() {
    this.root.innerHTML = '';
    this.root.classList.add('hud-shell');

    const header = createElement('header', {
      classNames: 'hud-header',
      children: [
        createElement('div', { classNames: 'hud-brand', text: 'Crtiz' }),
        createElement('nav', { classNames: 'hud-nav' }),
      ],
    });

    const layout = createElement('div', { classNames: 'hud-layout' });

    const listPanel = createElement('aside', { classNames: ['hud-panel', 'weapon-list-panel'] });
    this.viewerMount = createElement('section', { classNames: ['hud-panel', 'weapon-viewer-panel'] });
    const detailPanel = createElement('aside', { classNames: ['hud-panel', 'weapon-detail-panel'] });

    layout.appendChild(listPanel);
    layout.appendChild(this.viewerMount);
    layout.appendChild(detailPanel);

    this.root.appendChild(header);
    this.root.appendChild(layout);

    // Instantiate UI components
    this.categoryTabs = new CategoryTabs({
      root: header.querySelector('.hud-nav'),
      categories: this.categories,
      eventBus: this.eventBus,
    });
    this.categoryTabs.init();

    this.weaponList = new WeaponList({
      root: listPanel,
      eventBus: this.eventBus,
      registry: this.registry,
    });
    this.weaponList.init();

    this.weaponDetail = new WeaponDetailPanel({
      root: detailPanel,
      eventBus: this.eventBus,
    });
    this.weaponDetail.init();
  }

  getViewerMount() {
    return this.viewerMount;
  }

  selectCategory(categoryId, { emit = true } = {}) {
    this.categoryTabs.selectCategory(categoryId, { emit });
  }

  highlightCategory(categoryId) {
    this.categoryTabs.selectCategory(categoryId, { emit: false });
  }
}
