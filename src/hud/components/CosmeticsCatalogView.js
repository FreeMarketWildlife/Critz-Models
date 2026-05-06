const createElement = (tag, className, textContent) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }
  return element;
};

export class CosmeticsCatalogView {
  constructor({ element, slots = [], onSelect = null }) {
    this.element = element;
    this.slots = slots;
    this.onSelect = onSelect;
    this.state = {
      activeSlotId: slots[0]?.id ?? null,
    };
  }

  getSlot(slotId) {
    return this.slots.find((slot) => slot.id === slotId) || null;
  }

  render(state = {}) {
    if (!this.element) {
      return;
    }

    this.state = {
      ...this.state,
      ...state,
    };

    const activeSlot =
      this.getSlot(this.state.activeSlotId) || this.slots[0] || { id: null, label: 'Cosmetics' };

    this.element.innerHTML = '';

    const board = createElement('section', 'cosmetics-board');

    const hero = createElement('header', 'cosmetics-board__hero');
    const heroCopy = createElement('div', 'cosmetics-board__hero-copy');
    heroCopy.append(
      createElement('p', 'cosmetics-board__eyebrow', activeSlot.footer || 'Cosmetics'),
      createElement('h3', 'cosmetics-board__title', activeSlot.title || activeSlot.label || 'Cosmetics'),
      createElement(
        'p',
        'cosmetics-board__description',
        activeSlot.description ||
          'The slot structure is still here, but the placeholder individual cosmetics were removed.'
      )
    );
    hero.appendChild(heroCopy);
    board.appendChild(hero);

    const slotStrip = createElement('div', 'cosmetics-slot-strip');
    this.slots.forEach((slot) => {
      const button = createElement('button', 'cosmetics-slot-strip__button', slot.label);
      button.type = 'button';
      button.classList.toggle('is-active', slot.id === activeSlot.id);
      button.addEventListener('click', () => {
        this.onSelect?.({ type: 'slot', slotId: slot.id });
      });
      slotStrip.appendChild(button);
    });
    board.appendChild(slotStrip);

    const empty = createElement('section', 'cosmetics-board__empty');
    empty.append(
      createElement('h4', 'cosmetics-board__empty-title', 'Structure Kept, Items Removed'),
      createElement(
        'p',
        'cosmetics-board__empty-copy',
        'The individual cosmetic entries and temporary 3D wearable previews were removed from this pass. This section now keeps the category architecture only while the actual cosmetic direction gets reworked.'
      )
    );

    board.appendChild(empty);
    this.element.appendChild(board);
  }
}

