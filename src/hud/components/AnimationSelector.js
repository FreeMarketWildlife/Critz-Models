export class AnimationSelector {
  constructor({ container, bus }) {
    this.container = container;
    this.bus = bus;
    this.animations = [];
    this.activeAnimationId = null;
    this.selectElement = null;
    this.critterNameElement = null;
    this.animationLabelId = `animation-label-${Math.random().toString(36).slice(2, 8)}`;
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="animation-selector">
        <div class="animation-selector__header">
          <span class="animation-selector__label">Critter</span>
          <strong class="animation-selector__name" data-role="critter-name">--</strong>
        </div>
        <label class="animation-selector__control" for="${this.animationLabelId}">
          <span>Animation</span>
          <select id="${this.animationLabelId}" data-role="animation-select"></select>
        </label>
        <p class="animation-selector__hint">Drag to orbit • Shift + drag to pan • Scroll to zoom</p>
      </div>
    `;

    this.selectElement = this.container.querySelector('[data-role="animation-select"]');
    this.critterNameElement = this.container.querySelector('[data-role="critter-name"]');

    if (this.selectElement) {
      this.selectElement.addEventListener('change', (event) => {
        const value = event.target.value;
        this.selectAnimation(value, { emit: true });
      });
    }
  }

  setCritterName(name) {
    if (this.critterNameElement) {
      this.critterNameElement.textContent = name || '--';
    }
  }

  setAnimations(animations = [], activeId = null) {
    this.animations = animations;
    if (!this.selectElement) return;

    this.selectElement.innerHTML = '';

    animations.forEach((animation) => {
      const option = document.createElement('option');
      option.value = animation.id;
      option.textContent = animation.label;
      this.selectElement.appendChild(option);
    });

    this.selectElement.disabled = animations.length === 0;

    const targetId = activeId || animations[0]?.id || null;
    this.selectAnimation(targetId, { emit: false });
  }

  selectAnimation(id, { emit }) {
    if (!this.selectElement) return;

    this.activeAnimationId = id;
    if (id) {
      this.selectElement.value = id;
    } else {
      this.selectElement.selectedIndex = -1;
    }

    if (emit && id) {
      this.bus?.emit?.('critter:animation-selected', id);
    }
  }

  getActiveAnimationId() {
    return this.activeAnimationId;
  }
}
