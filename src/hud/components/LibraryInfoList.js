export class LibraryInfoList {
  constructor({ element, items = [], emptyMessage = 'No entries available yet.' }) {
    this.element = element;
    this.items = items;
    this.emptyMessage = emptyMessage;
  }

  render() {
    if (!this.element) {
      return;
    }

    this.element.innerHTML = '';

    if (!this.items || this.items.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'library-info-empty';
      emptyMessage.textContent = this.emptyMessage;
      this.element.appendChild(emptyMessage);
      return;
    }

    const list = document.createElement('ul');
    list.className = 'library-info-list';

    this.items.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.className = 'library-info-item';

      const title = document.createElement('span');
      title.className = 'library-info-title';
      title.textContent = item.title;

      listItem.appendChild(title);

      if (item.description) {
        const description = document.createElement('span');
        description.className = 'library-info-description';
        description.textContent = item.description;
        listItem.appendChild(description);
      }

      list.appendChild(listItem);
    });

    this.element.appendChild(list);
  }

  setItems(items = []) {
    this.items = items;
    this.render();
  }
}
