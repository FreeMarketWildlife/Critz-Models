export class CritterAnimationPanel {
  constructor({ container, onAnimationSelect, onResetCamera }) {
    this.container = container ?? null;
    this.onAnimationSelect = onAnimationSelect ?? null;
    this.onResetCamera = onResetCamera ?? null;

    this.labelElement = this.container?.querySelector('[data-role="critter-label"]') ?? null;
    this.taglineElement = this.container?.querySelector('[data-role="critter-tagline"]') ?? null;
    this.selectElement = this.container?.querySelector('[data-role="animation-select"]') ?? null;
    this.resetButton = this.container?.querySelector('[data-role="reset-camera"]') ?? null;

    this.currentCritterId = null;
    this.animations = [];

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);

    this.selectElement?.addEventListener('change', this.handleSelectChange);
    this.resetButton?.addEventListener('click', this.handleResetClick);
  }

  setCritter(critter) {
    this.currentCritterId = critter?.id ?? null;
    if (this.labelElement) {
      this.labelElement.textContent = critter?.name || 'Select a companion';
    }
    if (this.taglineElement) {
      this.taglineElement.textContent = critter?.tagline || '';
      this.taglineElement.hidden = !this.taglineElement.textContent;
    }

    const defaultAnimationId = critter?.defaultAnimationId ?? critter?.animations?.[0]?.id ?? null;
    this.setAnimations(critter?.animations ?? [], defaultAnimationId);
  }

  setAnimations(animations, defaultAnimationId) {
    if (!this.selectElement) return;

    this.animations = Array.isArray(animations) ? animations : [];
    this.selectElement.innerHTML = '';

    if (this.animations.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No animations available';
      this.selectElement.appendChild(option);
      this.selectElement.disabled = true;
      return;
    }

    this.selectElement.disabled = false;

    this.animations.forEach((animation) => {
      const option = document.createElement('option');
      option.value = animation.id;
      option.textContent = animation.name || animation.id;
      this.selectElement.appendChild(option);
    });

    const targetId = defaultAnimationId ?? this.animations[0]?.id ?? '';
    if (targetId) {
      this.selectElement.value = targetId;
    } else {
      this.selectElement.selectedIndex = 0;
    }
  }

  setActiveAnimation(animationId) {
    if (!this.selectElement || !animationId) return;
    this.selectElement.value = animationId;
  }

  handleSelectChange(event) {
    const value = event.target.value;
    if (!value) {
      return;
    }

    this.onAnimationSelect?.(value, this.currentCritterId);
  }

  handleResetClick(event) {
    event.preventDefault();
    this.onResetCamera?.();
  }
}
