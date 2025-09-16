import { createElement } from '../utils/dom.js';

export default class CategoryTabs {
  constructor({ root, categories, eventBus }) {
    this.root = root;
    this.categories = categories;
    this.eventBus = eventBus;
    this.buttons = new Map();
    this.activeCategory = null;
  }

  init() {
    this.root.classList.add('category-tabs');
    this.render();
  }

  render() {
    this.root.innerHTML = '';
    this.categories.forEach((category) => {
      const button = createElement('button', {
        classNames: ['category-tab'],
        text: category.label,
        attrs: {
          type: 'button',
          title: category.description,
        },
        dataset: {
          category: category.id,
        },
      });

      button.addEventListener('click', () => {
        this.selectCategory(category.id, { emit: true });
      });

      this.buttons.set(category.id, button);
      this.root.appendChild(button);
    });
  }

  selectCategory(categoryId, { emit = false } = {}) {
    if (!this.buttons.has(categoryId)) return;
    if (this.activeCategory === categoryId && emit === false) return;

    if (this.activeCategory && this.buttons.has(this.activeCategory)) {
      this.buttons.get(this.activeCategory).classList.remove('is-active');
    }

    const button = this.buttons.get(categoryId);
    button.classList.add('is-active');
    this.activeCategory = categoryId;

    if (emit) {
      this.eventBus.emit('category:selected', { categoryId });
    }
  }
}
