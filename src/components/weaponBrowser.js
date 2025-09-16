import {
  getCurrentCategory,
  getSelectedWeaponId,
  getWeaponsForCategory,
  setSelectedWeapon,
} from '../state/weaponState.js';
import { eventBus } from '../utils/eventBus.js';

export function initializeWeaponBrowser({
  titleElement,
  descriptionElement,
  listElement,
}) {
  function renderCategorySummary() {
    const category = getCurrentCategory();
    if (!category) {
      titleElement.textContent = 'Armory';
      descriptionElement.textContent = 'No category selected.';
      return;
    }

    titleElement.textContent = category.name;
    descriptionElement.textContent = category.description ?? '';
  }

  function renderWeaponList() {
    const category = getCurrentCategory();
    const weapons = category ? getWeaponsForCategory(category.id) : [];
    const selectedWeaponId = getSelectedWeaponId();

    if (!weapons || weapons.length === 0) {
      listElement.innerHTML = '<p class="weapon-list__empty">No weapons registered for this category yet.</p>';
      return;
    }

    const itemsMarkup = weapons
      .map((weapon) => {
        const isActive = weapon.id === selectedWeaponId;
        const statSummary = getWeaponSummaryStat(weapon);
        return `
          <li class="weapon-list__item ${isActive ? 'is-active' : ''}" data-weapon="${weapon.id}">
            <div class="weapon-list__item-title">${weapon.name}</div>
            <div class="weapon-list__item-meta">
              <span>${weapon.role ?? 'Prototype'}</span>
              <span>${statSummary}</span>
            </div>
          </li>
        `;
      })
      .join('');

    listElement.innerHTML = `<ul class="weapon-list__items">${itemsMarkup}</ul>`;

    listElement.querySelectorAll('[data-weapon]').forEach((node) => {
      node.addEventListener('click', () => {
        const weaponId = node.getAttribute('data-weapon');
        setSelectedWeapon(weaponId);
      });
    });
  }

  eventBus.on('category:changed', () => {
    renderCategorySummary();
    renderWeaponList();
  });

  eventBus.on('weapon:changed', () => {
    renderWeaponList();
  });

  renderCategorySummary();
  renderWeaponList();
}

function getWeaponSummaryStat(weapon) {
  const stats = weapon.stats ?? {};
  if (stats.damage != null) {
    return `${stats.damage} dmg`;
  }
  if (stats.utilityEffect) {
    return stats.utilityEffect;
  }
  if (stats.impact != null) {
    return `${stats.impact} impact`;
  }
  if (stats.cooldown != null) {
    return `${stats.cooldown}s cd`;
  }
  return 'Uncatalogued';
}
