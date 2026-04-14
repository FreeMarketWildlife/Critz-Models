const formatCount = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export class CatalogListView {
  constructor({ element, onSelect }) {
    this.element = element;
    this.onSelect = onSelect;
    this.activeId = null;
    this.catalog = null;
    this.buttons = new Map();
  }

  render(catalog) {
    if (!this.element) {
      return;
    }

    this.catalog = catalog || null;
    this.buttons.clear();
    this.element.innerHTML = '';

    if (!catalog) {
      return;
    }

    const board = document.createElement('section');
    board.className = 'catalog-board';

    const header = document.createElement('header');
    header.className = 'catalog-board__header';

    if (catalog.eyebrow) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'catalog-board__eyebrow';
      eyebrow.textContent = catalog.eyebrow;
      header.appendChild(eyebrow);
    }

    const headingRow = document.createElement('div');
    headingRow.className = 'catalog-board__heading-row';

    const title = document.createElement('h3');
    title.textContent = catalog.title || 'Catalog';
    headingRow.appendChild(title);

    const count = document.createElement('span');
    count.className = 'catalog-board__count';
    count.textContent = formatCount(catalog.items?.length || 0, 'entry');
    headingRow.appendChild(count);

    header.appendChild(headingRow);

    if (catalog.description) {
      const description = document.createElement('p');
      description.className = 'description';
      description.textContent = catalog.description;
      header.appendChild(description);
    }

    board.appendChild(header);

    const list = document.createElement('div');
    list.className = 'catalog-list';
    list.setAttribute('role', 'list');
    list.setAttribute('aria-label', catalog.title || 'Catalog');

    const items = Array.isArray(catalog.items) ? catalog.items : [];
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'catalog-board__empty';
      empty.textContent = catalog.emptyMessage || 'No entries have been listed yet.';
      list.appendChild(empty);
    } else {
      items.forEach((item, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'catalog-row';
        button.dataset.catalogId = item.id;

        const order = document.createElement('span');
        order.className = 'catalog-row__index';
        order.textContent = String(index + 1).padStart(2, '0');
        button.appendChild(order);

        const content = document.createElement('span');
        content.className = 'catalog-row__content';

        const label = document.createElement('span');
        label.className = 'catalog-row__title';
        label.textContent = item.label;
        content.appendChild(label);

        if (item.description) {
          const description = document.createElement('span');
          description.className = 'catalog-row__description';
          description.textContent = item.description;
          content.appendChild(description);
        }

        button.appendChild(content);

        const tagText = item.tag || catalog.itemTag || '';
        if (tagText) {
          const tag = document.createElement('span');
          tag.className = 'catalog-row__tag';
          tag.textContent = tagText;
          button.appendChild(tag);
        }

        button.addEventListener('click', () => {
          this.setActive(item.id);
          this.onSelect?.(item);
        });

        this.buttons.set(item.id, button);
        list.appendChild(button);
      });
    }

    board.appendChild(list);
    this.element.appendChild(board);
    this.setActive(this.activeId);
  }

  setActive(id) {
    this.activeId = id;
    this.buttons.forEach((button, buttonId) => {
      const isActive = buttonId === id;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }
}
