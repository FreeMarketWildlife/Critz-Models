import { getCategories, getSelectedCategoryId, setSelectedCategory } from '../state/weaponState.js';
import { eventBus } from '../utils/eventBus.js';

export function initializeHud(container) {
  const categories = getCategories();
  container.innerHTML = `
    <div class="hud__brand">
      <span class="hud__emblem">✶</span>
      <div class="hud__title">Crtiz Armory</div>
      <span class="hud__subtitle">Arcane Arsenal Interface</span>
    </div>
    <nav class="hud__nav" aria-label="Weapon categories">
      ${categories
        .map(
          (category) => `
            <button class="hud__nav-item" data-category="${category.id}" type="button">
              <span class="hud__nav-label">${category.name}</span>
            </button>
          `,
        )
        .join('')}
    </nav>
  `;

  const navButtons = Array.from(container.querySelectorAll('[data-category]'));

  function renderActiveCategory(activeId) {
    navButtons.forEach((button) => {
      const isActive = button.dataset.category === activeId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const categoryId = button.dataset.category;
      setSelectedCategory(categoryId);
    });
  });

  eventBus.on('category:changed', ({ categoryId }) => {
    renderActiveCategory(categoryId);
  });

  renderActiveCategory(getSelectedCategoryId());
}
