export class NavigationTabs {
  constructor({ element, categories = [], activeCategory, onSelect }) {
    this.element = element;
    this.categories = categories;
    this.activeCategory = activeCategory;
    this.onSelect = onSelect;
    this.buttons = new Map();
    this.details = new Map();
  }

  render() {
    this.element.innerHTML = '';
    this.buttons.clear();
    this.details.clear();
    this.categories.forEach((category) => {
      const details = document.createElement('details');
      details.className = 'nav-category';
      details.dataset.category = category.id;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = category.label;
      button.dataset.category = category.id;
      if (category.id === this.activeCategory) {
        button.classList.add('active');
      }
      button.addEventListener('click', () => this.handleSelect(category.id));
      const summary = document.createElement('summary');
      summary.className = 'nav-category__summary';
      summary.appendChild(button);

      const content = document.createElement('div');
      content.className = 'nav-category__content';

      const items = category.items || [];
      if (items.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'nav-empty';
        empty.textContent = 'No gear listed yet.';
        content.appendChild(empty);
      } else {
        const list = document.createElement('ul');
        list.className = 'nav-sublist';
        items.forEach((item) => {
          const entry = document.createElement('li');
          entry.textContent = item.label ?? item.name ?? item.id;
          list.appendChild(entry);
        });
        content.appendChild(list);
      }

      details.appendChild(summary);
      details.appendChild(content);
      const item = document.createElement('li');
      item.appendChild(details);
      this.element.appendChild(item);
      this.buttons.set(category.id, button);
      this.details.set(category.id, details);
    });
  }

  handleSelect(categoryId) {
    if (this.activeCategory === categoryId) return;
    this.setActive(categoryId);
    this.onSelect?.(categoryId);
  }

  setActive(categoryId, { open = true } = {}) {
    this.activeCategory = categoryId;
    this.buttons.forEach((button, id) => {
      if (id === categoryId) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        const details = this.details.get(id);
        if (details && open) {
          details.open = true;
        }
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      }
    });
  }
}
