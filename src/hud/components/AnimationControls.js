export class AnimationControls {
  constructor({ element, onSelect }) {
    this.element = element;
    this.onSelect = onSelect;
    this.animations = [];
    this.activeAnimationId = null;
    this.selectElement = null;

    this.render();
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = `
      <label class="animation-label" for="animation-select">Animation</label>
      <select id="animation-select" class="animation-select" data-role="animation-select">
        <option value="">Choose animation</option>
      </select>
    `;

    this.selectElement = this.element.querySelector('[data-role="animation-select"]');
    if (this.selectElement) {
      this.selectElement.addEventListener('change', (event) => {
        const value = event.target.value || null;
        this.activeAnimationId = value;
        if (typeof this.onSelect === 'function') {
          this.onSelect(value);
        }
      });
    }

    this.refreshOptions();
  }

  setAnimations(animations = [], activeId = null) {
    this.animations = animations.slice();
    this.activeAnimationId = activeId || null;
    this.refreshOptions();
  }

  setActive(animationId) {
    this.activeAnimationId = animationId || null;
    if (this.selectElement) {
      this.selectElement.value = this.activeAnimationId || '';
    }
  }

  refreshOptions() {
    if (!this.selectElement) return;

    const sorted = this.animations.slice().sort((a, b) => a.name.localeCompare(b.name));
    const options = [`<option value="">Choose animation</option>`].concat(
      sorted.map((animation) => {
        const selected = animation.id === this.activeAnimationId ? ' selected' : '';
        return `<option value="${animation.id}"${selected}>${animation.name}</option>`;
      })
    );

    this.selectElement.innerHTML = options.join('');
    if (this.activeAnimationId) {
      this.selectElement.value = this.activeAnimationId;
    }
  }
}

