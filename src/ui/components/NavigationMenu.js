export class NavigationMenu {
  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.element = document.createElement('nav');
    this.element.className = 'hud__nav';
    this.buttons = new Map();
  }

  getElement() {
    return this.element;
  }

  setCategories(categories = []) {
    this.element.innerHTML = '';
    this.buttons.clear();

    categories.forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-button';
      button.textContent = category.label;
      button.addEventListener('click', () => {
        this.eventBus.emit('category:requested', category.id);
      });

      this.buttons.set(category.id, button);
      this.element.appendChild(button);
    });
  }

  setActiveCategory(categoryId) {
    this.buttons.forEach((button, id) => {
      button.classList.toggle('nav-button--active', id === categoryId);
    });
  }
}
