export class CritterSelector {
  constructor({ element, critters = [], groups = [], bus }) {
    this.element = element;
    this.critters = critters;
    this.groups = groups;
    this.bus = bus;
    this.activeId = null;
    this.buttons = new Map();
  }

  render(defaultId) {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.buttons.clear();
    this.element.setAttribute('role', 'list');
    this.element.classList.add('critter-selector');

    const orderedCritters = this.getOrderedCritters();
    const groupedCritters = this.groupCritters(orderedCritters);
    const groupOrder = this.groups.length
      ? this.groups.map((group) => group.id)
      : Array.from(groupedCritters.keys());

    groupOrder.forEach((groupId) => {
      const groupItems = groupedCritters.get(groupId) || [];
      if (groupItems.length === 0) {
        return;
      }
      const groupWrapper = document.createElement('div');
      groupWrapper.className = 'critter-group';
      groupWrapper.setAttribute('role', 'group');
      const groupLabel = this.getGroupLabel(groupId);
      const title = document.createElement('h3');
      title.className = 'critter-group-title';
      title.textContent = groupLabel;
      groupWrapper.appendChild(title);

      const list = document.createElement('div');
      list.className = 'critter-group-list';
      groupItems.forEach((critter) => {
        const button = this.createButton(critter);
        list.appendChild(button);
      });

      groupWrapper.appendChild(list);
      this.element.appendChild(groupWrapper);
    });

    const remaining = groupedCritters.get('uncategorized') || [];
    if (remaining.length) {
      const groupWrapper = document.createElement('div');
      groupWrapper.className = 'critter-group';
      groupWrapper.setAttribute('role', 'group');
      const title = document.createElement('h3');
      title.className = 'critter-group-title';
      title.textContent = 'Other';
      groupWrapper.appendChild(title);
      const list = document.createElement('div');
      list.className = 'critter-group-list';
      remaining.forEach((critter) => {
        const button = this.createButton(critter);
        list.appendChild(button);
      });
      groupWrapper.appendChild(list);
      this.element.appendChild(groupWrapper);
    }

    const initialId = defaultId || orderedCritters[0]?.id || null;
    if (initialId) {
      this.selectCritter(initialId, { emit: false });
    }
  }

  createButton(critter) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'critter-button';
    button.dataset.critterId = critter.id;
    button.textContent = critter.name;
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-checked', 'false');
    button.addEventListener('click', () => this.selectCritter(critter.id, { emit: true }));
    this.buttons.set(critter.id, button);
    return button;
  }

  getOrderedCritters() {
    if (!this.groups.length) {
      return [...this.critters];
    }

    const byGroup = new Map(this.groups.map((group) => [group.id, []]));
    const uncategorized = [];

    this.critters.forEach((critter) => {
      const group = byGroup.get(critter.category);
      if (group) {
        group.push(critter);
      } else {
        uncategorized.push(critter);
      }
    });

    const ordered = [];
    this.groups.forEach((group) => {
      ordered.push(...(byGroup.get(group.id) || []));
    });
    ordered.push(...uncategorized);
    return ordered;
  }

  groupCritters(list) {
    const grouped = new Map();
    list.forEach((critter) => {
      const key = critter.category || 'uncategorized';
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(critter);
    });
    return grouped;
  }

  getGroupLabel(groupId) {
    const match = this.groups.find((group) => group.id === groupId);
    return match?.label || groupId;
  }

  selectCritter(id, { emit }) {
    if (!id || this.activeId === id) {
      if (emit && id) {
        this.bus?.emit?.('critter:selected', id);
      }
      return;
    }

    this.activeId = id;

    this.buttons.forEach((button, critterId) => {
      const isActive = critterId === id;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    if (emit) {
      this.bus?.emit?.('critter:selected', id);
    }
  }
}
