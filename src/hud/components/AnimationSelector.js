export class AnimationSelector {
  constructor({ element, onSelect }) {
    this.element = element;
    this.onSelect = onSelect;
    this.selectElement = this.element?.querySelector('[data-role="animation-select"]') || null;
    this.statusElement = this.element?.querySelector('[data-role="animation-status"]') || null;
    this.loading = false;

    this.handleChange = this.handleChange.bind(this);
    this.selectElement?.addEventListener('change', this.handleChange);
  }

  setLoading(isLoading) {
    this.loading = isLoading;
    if (!this.selectElement) return;

    this.selectElement.disabled = isLoading;
    if (isLoading) {
      this.renderOptions([{ id: 'loading', name: 'Loading…', disabled: true }], 'loading');
    }
  }

  setAnimations(animations = [], activeId = null) {
    if (!this.selectElement) return;

    if (this.loading) {
      this.loading = false;
      this.selectElement.disabled = false;
    }

    const entries = animations.map((animation) => ({
      id: animation.id,
      name: animation.name,
    }));

    if (entries.length === 0) {
      this.renderOptions(
        [{ id: 'none', name: 'No animations available', disabled: true }],
        'none'
      );
      this.selectElement.disabled = true;
      return;
    }

    const targetId = activeId && entries.some((entry) => entry.id === activeId)
      ? activeId
      : entries[0].id;
    this.renderOptions(entries, targetId);
    this.selectElement.disabled = false;
  }

  renderOptions(options, activeId) {
    if (!this.selectElement) return;
    this.selectElement.innerHTML = '';

    options.forEach((option) => {
      const opt = document.createElement('option');
      opt.value = option.id;
      opt.textContent = option.name;
      if (option.disabled) {
        opt.disabled = true;
      }
      if (option.id === activeId) {
        opt.selected = true;
      }
      this.selectElement.appendChild(opt);
    });

    if (this.statusElement) {
      this.statusElement.textContent = this.selectElement.selectedOptions[0]?.textContent || '';
    }
  }

  setSelected(animationId) {
    if (!this.selectElement) return;
    this.selectElement.value = animationId;
    if (this.statusElement) {
      const option = this.selectElement.selectedOptions[0];
      this.statusElement.textContent = option?.textContent ?? '';
    }
  }

  handleChange(event) {
    const value = event.target.value;
    if (this.statusElement) {
      const option = event.target.selectedOptions[0];
      this.statusElement.textContent = option?.textContent ?? '';
    }
    this.onSelect?.(value);
  }
}
