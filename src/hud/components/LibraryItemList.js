export class LibraryItemList {
  constructor({ element, items = [], onSelect, emptyMessage = 'No entries yet.' }) {
    this.element = element;
    this.items = items;
    this.onSelect = onSelect;
    this.emptyMessage = emptyMessage;
    this.activeId = null;
    this.buttons = new Map();
  }

  render() {
    if (!this.element) return;
    this.element.innerHTML = '';
    this.buttons.clear();

    if (!this.items || this.items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'nav-empty';
      empty.textContent = this.emptyMessage;
      this.element.appendChild(empty);
      return;
    }

    const list = document.createElement('div');
    list.className = 'critter-category__list';

    this.items.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'critter-button';
      button.dataset.itemId = item.id;
      button.textContent = item.label ?? item.name ?? item.id;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => this.selectItem(item));
      list.appendChild(button);
      this.buttons.set(item.id, button);
    });

    this.element.appendChild(list);
  }

  selectItem(item) {
    if (!item) return;
    this.activeId = item.id;
    this.buttons.forEach((button, itemId) => {
      const isActive = itemId === item.id;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    this.onSelect?.(item);
  }

  clearSelection() {
    this.activeId = null;
    this.buttons.forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-pressed', 'false');
    });
  }
}
