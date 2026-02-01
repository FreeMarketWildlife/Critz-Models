export class NavButtonList {
  constructor({ element, items = [], onSelect, emptyMessage = 'Nothing here yet.' }) {
    this.element = element;
    this.items = items;
    this.onSelect = onSelect;
    this.emptyMessage = emptyMessage;
    this.buttons = new Map();
    this.activeId = null;
  }

  setItems(items) {
    this.items = items;
    this.render();
  }

  render() {
    if (!this.element) return;
    this.element.innerHTML = '';
    this.buttons.clear();

    if (!this.items.length) {
      const empty = document.createElement('p');
      empty.className = 'nav-empty';
      empty.textContent = this.emptyMessage;
      this.element.appendChild(empty);
      return;
    }

    this.items.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-button';
      button.textContent = item.label ?? item.name ?? item.id;
      button.dataset.itemId = item.id;
      button.addEventListener('click', () => this.handleSelect(item.id));
      button.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.handleSelect(item.id);
        }
      });
      this.element.appendChild(button);
      this.buttons.set(item.id, button);
    });

    this.setActive(this.activeId);
  }

  handleSelect(id) {
    if (this.activeId === id) return;
    this.setActive(id);
    this.onSelect?.(id);
  }

  setActive(id) {
    this.activeId = id;
    this.buttons.forEach((button, buttonId) => {
      const isActive = buttonId === id;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }
}
