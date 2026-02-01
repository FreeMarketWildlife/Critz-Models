export class NavigationTabs {
  constructor({ element, categories = [], activeCategory, onSelect }) {
    this.element = element;
    this.categories = categories;
    this.activeCategory = activeCategory;
    this.onSelect = onSelect;
    this.buttons = new Map();
  }

  render() {
    this.element.innerHTML = '';
    this.buttons.clear();
    this.categories.forEach((category) => {
      const details = document.createElement('details');
      details.className = 'nav-subsection nav-tab';

      const summary = document.createElement('summary');
      summary.className = 'nav-tab__summary';
      summary.textContent = category.label;
      summary.dataset.category = category.id;
      if (category.id === this.activeCategory) {
        summary.classList.add('active');
      }
      summary.addEventListener('click', () => this.handleSelect(category.id));
      summary.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.handleSelect(category.id);
        }
      });

      const content = document.createElement('div');
      content.className = 'nav-tab__content';
      content.dataset.scroll = 'nav-subsection';

      if (category.items && category.items.length) {
        const list = document.createElement('ul');
        list.className = 'nav-tab__list';
        category.items.forEach((item) => {
          const entry = document.createElement('li');
          entry.textContent = item.name;
          list.appendChild(entry);
        });
        content.appendChild(list);
      } else {
        const emptyState = document.createElement('p');
        emptyState.className = 'nav-empty';
        emptyState.textContent = 'No tools are in this category yet.';
        content.appendChild(emptyState);
      }

      details.appendChild(summary);
      details.appendChild(content);

      const item = document.createElement('li');
      item.appendChild(details);
      this.element.appendChild(item);
      this.buttons.set(category.id, summary);
    });
  }

  handleSelect(categoryId) {
    if (this.activeCategory === categoryId) return;
    this.setActive(categoryId);
    this.onSelect?.(categoryId);
  }

  setActive(categoryId) {
    this.activeCategory = categoryId;
    this.buttons.forEach((button, id) => {
      if (id === categoryId) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      }
    });
  }
}
