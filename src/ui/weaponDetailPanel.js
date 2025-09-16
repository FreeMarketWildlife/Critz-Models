import { createElement, clearElement } from '../utils/dom.js';
import { buildWeaponStatDescriptors, formatStatValue } from '../data/weaponSchema.js';
import { getCategoryById } from '../config/categories.js';

export default class WeaponDetailPanel {
  constructor({ root, eventBus }) {
    this.root = root;
    this.eventBus = eventBus;
    this.content = null;
    this.statList = null;
    this.unsubscribe = [];
  }

  init() {
    this.root.classList.add('weapon-detail');
    this.renderSkeleton();

    this.unsubscribe.push(
      this.eventBus.on('weapon:selected', ({ weapon }) => {
        this.renderWeapon(weapon);
      })
    );
  }

  renderSkeleton() {
    this.root.innerHTML = '';

    this.content = createElement('div', { classNames: 'weapon-detail__content' });
    this.statList = null;

    this.root.appendChild(
      createElement('div', {
        classNames: 'weapon-detail__header',
        children: [
          createElement('h2', { classNames: 'panel-title', text: 'Weapon Details' }),
          createElement('p', {
            classNames: 'panel-subtitle',
            text: 'Inspect arcane craftsmanship and battle-readiness.',
          }),
        ],
      })
    );

    this.root.appendChild(this.content);
    this.renderEmptyState();
  }

  renderEmptyState() {
    clearElement(this.content);
    this.content.appendChild(
      createElement('div', {
        classNames: 'weapon-detail__empty',
        children: [
          createElement('p', {
            classNames: 'weapon-detail__empty-title',
            text: 'Select a weapon to reveal its secrets.',
          }),
          createElement('p', {
            classNames: 'weapon-detail__empty-copy',
            text: 'Choose a relic from the index to view lore, stats, and future attachments.',
          }),
        ],
      })
    );
  }

  renderWeapon(weapon) {
    if (!weapon) {
      this.renderEmptyState();
      return;
    }

    clearElement(this.content);

    const name = createElement('h2', {
      classNames: 'weapon-detail__name',
      text: weapon.core.name,
    });

    const category = getCategoryById(weapon.core.category);
    const metaText = [weapon.core.rarity, category?.label]
      .filter(Boolean)
      .join(' • ');

    const meta = createElement('p', {
      classNames: 'weapon-detail__meta',
      text: metaText || 'Uncatalogued relic',
    });

    const lore = createElement('p', {
      classNames: 'weapon-detail__lore',
      text: weapon.core.lore || 'Lore entry forthcoming.',
    });

    this.statList = createElement('dl', { classNames: 'weapon-detail__stats' });

    const statDescriptors = buildWeaponStatDescriptors(weapon);
    if (statDescriptors.length) {
      statDescriptors.forEach((descriptor) => {
        const term = createElement('dt', {
          classNames: 'weapon-detail__stat-label',
          text: descriptor.label,
        });
        const value = createElement('dd', {
          classNames: 'weapon-detail__stat-value',
          text: formatStatValue(descriptor.value, descriptor),
        });
        this.statList.appendChild(term);
        this.statList.appendChild(value);
      });
    } else {
      this.statList.appendChild(
        createElement('p', {
          classNames: 'weapon-detail__empty-copy',
          text: 'Stat profile pending infusion.',
        })
      );
    }

    this.content.appendChild(name);
    this.content.appendChild(meta);
    this.content.appendChild(lore);
    this.content.appendChild(this.statList);
  }

  destroy() {
    this.unsubscribe.forEach((off) => off && off());
    this.unsubscribe = [];
  }
}
