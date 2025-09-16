import { createElement, clearElement } from '../utils/dom.js';
import { getCategoryById } from '../config/categories.js';

export default class WeaponList {
  constructor({ root, eventBus, registry }) {
    this.root = root;
    this.eventBus = eventBus;
    this.registry = registry;
    this.listElement = null;
    this.activeSlug = null;
    this.unsubscribe = [];
  }

  init() {
    this.root.classList.add('weapon-list');

    const header = createElement('div', {
      classNames: 'weapon-list__header',
      children: [
        createElement('h2', { classNames: 'panel-title', text: 'Armory Index' }),
        createElement('p', {
          classNames: 'panel-subtitle',
          text: 'Browse the forged arsenal of Critz.',
        }),
      ],
    });

    this.listElement = createElement('div', {
      classNames: 'weapon-list__items',
    });

    this.root.appendChild(header);
    this.root.appendChild(this.listElement);

    this.unsubscribe.push(
      this.eventBus.on('category:selected', ({ categoryId }) => {
        this.renderCategory(categoryId);
      })
    );

    this.unsubscribe.push(
      this.eventBus.on('weapon:selected', ({ weapon }) => {
        const slug = weapon?.core?.slug || null;
        this.highlightWeapon(slug);
      })
    );
  }

  renderCategory(categoryId) {
    clearElement(this.listElement);

    const categoryMeta = getCategoryById(categoryId);
    if (categoryMeta) {
      this.listElement.appendChild(
        createElement('p', {
          classNames: 'weapon-list__category-label',
          text: categoryMeta.description,
        })
      );
    }

    const weapons = this.registry.getWeaponsByCategory(categoryId);
    if (!weapons.length) {
      this.listElement.appendChild(
        createElement('div', {
          classNames: 'weapon-list__empty',
          text: 'No weapons registered yet. Summon new designs soon.',
        })
      );
      return;
    }

    const list = createElement('ul', { classNames: 'weapon-list__collection' });

    weapons.forEach((weapon) => {
      const item = this.createWeaponListItem(weapon);
      list.appendChild(item);
    });

    this.listElement.appendChild(list);
    if (this.activeSlug) {
      this.highlightWeapon(this.activeSlug);
    }
  }

  createWeaponListItem(weapon) {
    const item = createElement('li', { classNames: 'weapon-list__item' });
    const button = createElement('button', {
      classNames: ['weapon-list__button'],
      attrs: { type: 'button' },
    });

    const title = createElement('span', {
      classNames: 'weapon-list__name',
      text: weapon.core.name,
    });

    const rarity = createElement('span', {
      classNames: ['weapon-list__rarity', `is-${(weapon.core.rarity || 'common').toLowerCase()}`],
      text: weapon.core.rarity || 'Unknown',
    });

    button.appendChild(title);
    button.appendChild(rarity);

    button.addEventListener('click', () => {
      this.eventBus.emit('weapon:selected', { weapon });
    });

    item.appendChild(button);
    item.dataset.slug = weapon.core.slug;
    return item;
  }

  highlightWeapon(slug) {
    this.activeSlug = slug;
    const items = this.listElement.querySelectorAll('.weapon-list__item');
    items.forEach((item) => {
      if (item.dataset.slug === slug) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  destroy() {
    this.unsubscribe.forEach((off) => off && off());
    this.unsubscribe = [];
  }
}
