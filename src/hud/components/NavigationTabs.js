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
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = category.label;
      button.dataset.category = category.id;
      if (category.id === this.activeCategory) {
        button.classList.add('active');
      }
      button.addEventListener('click', () => this.handleSelect(category.id));
      button.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.handleSelect(category.id);
        }
      });
      const item = document.createElement('li');
      item.appendChild(button);
      this.element.appendChild(item);
      this.buttons.set(category.id, button);
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
