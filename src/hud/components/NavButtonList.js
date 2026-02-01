export class NavButtonList {
  constructor({ element, items = [], emptyMessage = '', onSelect }) {
    this.element = element;
    this.items = items;
    this.emptyMessage = emptyMessage;
    this.onSelect = onSelect;
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
      button.dataset.navId = item.id;
      button.textContent = item.label ?? item.name ?? item.id;
      button.addEventListener('click', () => this.handleSelect(item));
      list.appendChild(button);
      this.buttons.set(item.id, button);
    });

    this.element.appendChild(list);
    this.setActive(this.activeId);
  }

  handleSelect(item) {
    if (this.activeId === item.id) {
      this.setActive(null);
      this.onSelect?.(null);
      return;
    }

    this.setActive(item.id);
    this.onSelect?.(item);
  }

  setActive(id) {
    this.activeId = id;
    this.buttons.forEach((button, buttonId) => {
      button.classList.toggle('active', buttonId === id);
    });
  }
}
