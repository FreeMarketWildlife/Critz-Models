export class ViewportUI {
  constructor({ container } = {}) {
    this.container = container;
    this.overlayElement = null;
    this.labelElement = null;
    this.titleElement = null;
    this.messageElement = null;
    this.metaElement = null;
    this.controlButtons = new Map();
    this.currentAnimationLabel = '';
  }

  init({
    onFocus,
    onReset,
    onZoomIn,
    onZoomOut,
    onAutoOrbitToggle,
  } = {}) {
    if (!this.container) return;

    this.container.classList.add('viewport-shell');
    this.container.insertAdjacentHTML(
      'beforeend',
      `
      <div class="viewport-overlay" data-role="viewport-overlay" aria-live="polite">
        <div class="viewport-status" data-role="viewport-status">
          <div class="viewport-status__glow" aria-hidden="true"></div>
          <div class="viewport-status__body">
            <span class="viewport-status__label" data-role="viewport-label">Viewport Ready</span>
            <h3 class="viewport-status__title" data-role="viewport-title">Summon a companion</h3>
            <p class="viewport-status__message" data-role="viewport-message">
              Select a critter or weapon to preview it in the sanctuary.
            </p>
            <p class="viewport-status__meta" data-role="viewport-meta"></p>
          </div>
        </div>
        <ul class="viewport-hints" data-role="viewport-hints">
          <li><span>Drag</span> Orbit camera</li>
          <li><span>Scroll</span> Zoom</li>
          <li><span>Shift + Drag</span> Pan</li>
        </ul>
      </div>
      <div class="viewport-controls" data-role="viewport-controls" role="toolbar" aria-label="Viewport camera controls">
        <button type="button" class="viewport-control" data-action="zoom-in" title="Zoom in">
          <span class="viewport-control__icon">+</span>
          <span class="viewport-control__label">Zoom In</span>
        </button>
        <button type="button" class="viewport-control" data-action="zoom-out" title="Zoom out">
          <span class="viewport-control__icon">−</span>
          <span class="viewport-control__label">Zoom Out</span>
        </button>
        <button type="button" class="viewport-control" data-action="focus" title="Frame the current model">
          <span class="viewport-control__icon">◎</span>
          <span class="viewport-control__label">Frame</span>
        </button>
        <button type="button" class="viewport-control" data-action="reset" title="Reset camera">
          <span class="viewport-control__icon">↺</span>
          <span class="viewport-control__label">Reset</span>
        </button>
        <button
          type="button"
          class="viewport-control viewport-control--toggle"
          data-action="auto-orbit"
          title="Toggle automatic orbit"
          aria-pressed="false"
        >
          <span class="viewport-control__icon">⟳</span>
          <span class="viewport-control__label">Auto Orbit</span>
        </button>
      </div>
    `
    );

    this.overlayElement = this.container.querySelector('[data-role="viewport-overlay"]');
    this.labelElement = this.container.querySelector('[data-role="viewport-label"]');
    this.titleElement = this.container.querySelector('[data-role="viewport-title"]');
    this.messageElement = this.container.querySelector('[data-role="viewport-message"]');
    this.metaElement = this.container.querySelector('[data-role="viewport-meta"]');

    this.bindControl('focus', onFocus);
    this.bindControl('reset', onReset);
    this.bindControl('zoom-in', onZoomIn);
    this.bindControl('zoom-out', onZoomOut);
    this.bindControl('auto-orbit', onAutoOrbitToggle);

    this.showIdleState();
  }

  bindControl(action, handler) {
    const button = this.container.querySelector(`[data-action="${action}"]`);
    if (button && typeof handler === 'function') {
      button.addEventListener('click', handler);
    }
    if (button) {
      this.controlButtons.set(action, button);
    }
  }

  showIdleState() {
    this.currentAnimationLabel = '';
    this.setState('idle', {
      label: 'Viewport Ready',
      title: 'Summon a companion',
      message: 'Select a critter or weapon to preview it in the sanctuary.',
      meta: 'Camera tips: Drag to orbit, scroll to zoom.',
    });
  }

  showLoading(subject) {
    this.currentAnimationLabel = '';
    this.setState('loading', {
      label: 'Loading Model',
      title: subject ? `Summoning ${subject}` : 'Preparing viewport',
      message: 'Fetching assets and calibrating the stage…',
      meta: '',
    });
  }

  showLoaded({ title, type, hint } = {}) {
    this.setState('active', {
      label: type ? `${type} Loaded` : 'Model Loaded',
      title: title || 'Viewport Active',
      message: hint || 'Use the controls below to position your view.',
      meta: this.currentAnimationLabel ? `Animation: ${this.currentAnimationLabel}` : '',
    });
  }

  showError(message) {
    this.currentAnimationLabel = '';
    this.setState('error', {
      label: 'Model Unavailable',
      title: 'Unable to load model',
      message: message || 'We could not load the selected asset. Please try a different entry.',
      meta: '',
    });
  }

  setAnimation(label) {
    this.currentAnimationLabel = label || '';
    if (this.metaElement && this.overlayElement?.dataset.state === 'active') {
      this.metaElement.textContent = this.currentAnimationLabel
        ? `Animation: ${this.currentAnimationLabel}`
        : '';
    }
  }

  setAutoOrbitActive(isActive) {
    const button = this.controlButtons.get('auto-orbit');
    if (!button) return;
    button.classList.toggle('is-active', Boolean(isActive));
    button.setAttribute('aria-pressed', Boolean(isActive) ? 'true' : 'false');
  }

  setState(state, { label, title, message, meta }) {
    if (!this.overlayElement) return;
    this.overlayElement.dataset.state = state;
    if (this.labelElement && typeof label === 'string') {
      this.labelElement.textContent = label;
    }
    if (this.titleElement && typeof title === 'string') {
      this.titleElement.textContent = title;
    }
    if (this.messageElement && typeof message === 'string') {
      this.messageElement.textContent = message;
    }
    if (this.metaElement) {
      this.metaElement.textContent = meta || '';
    }
  }
}
