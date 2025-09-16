import { WeaponSchemaKeySet } from '../../data/weaponSchema.js';

export class WeaponDetails {
  constructor({ statSchema }) {
    this.statSchema = statSchema;
    this.schemaKeySet = WeaponSchemaKeySet;

    this.element = document.createElement('div');
    this.element.className = 'weapon-details';

    this.headerElement = document.createElement('div');
    this.headerElement.className = 'weapon-details__header';

    this.titleElement = document.createElement('h2');
    this.titleElement.className = 'weapon-details__title';

    this.typeElement = document.createElement('div');
    this.typeElement.className = 'weapon-details__type';

    this.headerElement.appendChild(this.titleElement);
    this.headerElement.appendChild(this.typeElement);

    this.descriptionElement = document.createElement('p');
    this.descriptionElement.className = 'weapon-details__description';

    this.statsContainer = document.createElement('div');
    this.statsContainer.className = 'weapon-details__stat-groups';

    this.tagsContainer = document.createElement('div');
    this.tagsContainer.className = 'weapon-details__tags';

    this.notesElement = document.createElement('div');
    this.notesElement.className = 'weapon-details__notes';

    this.modelElement = document.createElement('div');
    this.modelElement.className = 'weapon-details__model';

    this.element.append(
      this.headerElement,
      this.descriptionElement,
      this.statsContainer,
      this.tagsContainer,
      this.notesElement,
      this.modelElement,
    );

    this.setEmptyState();
  }

  getElement() {
    return this.element;
  }

  setEmptyState() {
    this.titleElement.textContent = 'Select a weapon';
    this.typeElement.textContent = 'Choose an item from the arsenal to inspect its details.';
    this.descriptionElement.textContent = '';
    this.statsContainer.innerHTML = '';
    this.tagsContainer.innerHTML = '';
    this.tagsContainer.style.display = 'none';
    this.notesElement.textContent = '';
    this.notesElement.style.display = 'none';
    this.modelElement.textContent = '';
  }

  update(weapon, category) {
    if (!weapon) {
      this.setEmptyState();
      return;
    }

    this.titleElement.textContent = weapon.name;

    const metaParts = [weapon.role, weapon.type, category?.label];
    this.typeElement.textContent = metaParts.filter(Boolean).join(' · ');

    this.descriptionElement.textContent = weapon.description || '';

    this.#renderStats(weapon.stats || {});
    this.#renderTags(weapon.tags || []);
    this.#renderNotes(weapon.notes);
    this.#renderModelInfo(weapon.model || {});
  }

  #renderStats(stats) {
    this.statsContainer.innerHTML = '';
    const groups = [];

    for (const group of this.statSchema) {
      const renderedStats = group.fields
        .filter((field) => this.#hasValue(stats[field.key]))
        .map((field) => this.#createStatElement(field, stats[field.key]));

      if (renderedStats.length) {
        const groupElement = document.createElement('div');
        groupElement.className = 'weapon-details__stat-group';

        const title = document.createElement('div');
        title.className = 'weapon-details__stat-title';
        title.textContent = group.title;

        groupElement.appendChild(title);
        renderedStats.forEach((statElement) => groupElement.appendChild(statElement));
        groups.push(groupElement);
      }
    }

    const additionalEntries = Object.entries(stats).filter(
      ([key, value]) => !this.schemaKeySet.has(key) && this.#hasValue(value),
    );

    if (additionalEntries.length) {
      const groupElement = document.createElement('div');
      groupElement.className = 'weapon-details__stat-group';

      const title = document.createElement('div');
      title.className = 'weapon-details__stat-title';
      title.textContent = 'Additional Insights';
      groupElement.appendChild(title);

      additionalEntries.forEach(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .replace(/^\w/, (char) => char.toUpperCase());
        const field = { key, label };
        groupElement.appendChild(this.#createStatElement(field, value));
      });

      groups.push(groupElement);
    }

    if (!groups.length) {
      const placeholder = document.createElement('p');
      placeholder.className = 'hud__panel-description';
      placeholder.textContent = 'Stat block coming soon. Fill in weapon.stats to populate this section.';
      this.statsContainer.appendChild(placeholder);
      return;
    }

    groups.forEach((groupElement) => this.statsContainer.appendChild(groupElement));
  }

  #renderTags(tags) {
    this.tagsContainer.innerHTML = '';
    if (!tags.length) {
      this.tagsContainer.style.display = 'none';
      return;
    }

    this.tagsContainer.style.display = 'flex';
    tags.forEach((tag) => {
      const pill = document.createElement('span');
      pill.className = 'weapon-details__tag';
      pill.textContent = tag;
      this.tagsContainer.appendChild(pill);
    });
  }

  #renderNotes(notes) {
    if (!notes) {
      this.notesElement.textContent = '';
      this.notesElement.style.display = 'none';
      return;
    }

    this.notesElement.style.display = 'block';
    this.notesElement.textContent = notes;
  }

  #renderModelInfo(model) {
    if (!model || !Object.keys(model).length) {
      this.modelElement.textContent = 'Model pending integration.';
      return;
    }

    const parts = [];
    if (model.path) {
      parts.push(`<strong>Model:</strong> ${model.path}`);
    }
    if (model.scale) {
      parts.push(`<strong>Scale:</strong> ${model.scale}`);
    }
    if (Array.isArray(model.position)) {
      parts.push(`<strong>Position:</strong> [${model.position.map((v) => (typeof v === 'number' ? v.toFixed(2) : v)).join(', ')}]`);
    }
    if (Array.isArray(model.rotation)) {
      parts.push(`<strong>Rotation:</strong> [${model.rotation
        .map((v) => (typeof v === 'number' ? v.toFixed(2) : v))
        .join(', ')}]`);
    }
    if (model.thumbnail) {
      parts.push(`<strong>Preview:</strong> ${model.thumbnail}`);
    }

    this.modelElement.innerHTML = parts.join('<br />');
  }

  #createStatElement(field, value) {
    const statElement = document.createElement('div');
    statElement.className = 'weapon-details__stat';

    const label = document.createElement('span');
    label.className = 'weapon-details__stat-label';
    label.textContent = field.label || field.key;

    const statValue = document.createElement('span');
    statValue.className = 'weapon-details__stat-value';
    statValue.textContent = this.#formatStatValue(field, value);

    statElement.append(label, statValue);
    return statElement;
  }

  #formatStatValue(field, rawValue) {
    if (!this.#hasValue(rawValue)) {
      return '—';
    }

    if (typeof rawValue === 'number') {
      const formatted = Number.isInteger(rawValue)
        ? rawValue.toString()
        : rawValue.toFixed(1).replace(/\.0$/, '');

      if (field.format === 'rate') {
        return `${formatted}/s`;
      }

      if (field.format === 'time') {
        return `${formatted}s`;
      }

      if (field.suffix) {
        return `${formatted}${field.suffix}`;
      }

      return formatted;
    }

    return String(rawValue);
  }

  #hasValue(value) {
    return value !== undefined && value !== null && value !== '';
  }
}
