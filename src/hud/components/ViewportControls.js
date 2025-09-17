export class ViewportControls {
  constructor({ element, bus }) {
    this.element = element;
    this.bus = bus;

    this.autoRotate = false;
    this.hasModel = false;

    this.resetButton = null;
    this.focusButton = null;
    this.autoRotateButton = null;
    this.autoRotateLabel = null;

    this.unsubscribe = [];

    this.handleClick = this.handleClick.bind(this);
  }

  init() {
    if (!this.element) return;
    this.render();
    this.bindEvents();
  }

  render() {
    this.element.innerHTML = `
      <div class="viewport-controls__cluster">
        <button
          type="button"
          class="viewport-controls__button"
          data-action="reset"
        >
          <span>Reset View</span>
        </button>
        <button
          type="button"
          class="viewport-controls__button"
          data-action="focus"
        >
          <span>Center Model</span>
        </button>
      </div>
      <button
        type="button"
        class="viewport-controls__button viewport-controls__button--toggle"
        data-action="autorotate"
        aria-pressed="false"
      >
        <span data-role="auto-rotate-label">Auto Orbit</span>
      </button>
    `;

    this.resetButton = this.element.querySelector('[data-action="reset"]');
    this.focusButton = this.element.querySelector('[data-action="focus"]');
    this.autoRotateButton = this.element.querySelector('[data-action="autorotate"]');
    this.autoRotateLabel = this.element.querySelector('[data-role="auto-rotate-label"]');

    this.setHasModel(false);
  }

  bindEvents() {
    this.element.addEventListener('click', this.handleClick);

    if (!this.bus) {
      return;
    }

    this.unsubscribe.push(
      this.bus.on('viewport:model-changed', (state = {}) => {
        this.setHasModel(Boolean(state.hasModel));
        if (!state.hasModel) {
          this.setAutoRotate(false);
        }
      })
    );

    this.unsubscribe.push(
      this.bus.on('viewport:auto-rotate-changed', ({ autoRotate } = {}) => {
        this.setAutoRotate(Boolean(autoRotate));
      })
    );
  }

  handleClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) {
      return;
    }

    const action = button.dataset.action;

    if (action === 'reset') {
      this.bus?.emit?.('viewport:reset-view');
    } else if (action === 'focus') {
      this.bus?.emit?.('viewport:focus-model');
    } else if (action === 'autorotate') {
      this.bus?.emit?.('viewport:auto-rotate-toggle');
    }
  }

  setHasModel(hasModel) {
    this.hasModel = hasModel;
    const disabled = !hasModel;
    if (this.resetButton) this.resetButton.disabled = disabled;
    if (this.focusButton) this.focusButton.disabled = disabled;
    if (this.autoRotateButton) {
      this.autoRotateButton.disabled = disabled;
      if (disabled) {
        this.autoRotateButton.setAttribute('aria-pressed', 'false');
        this.autoRotateButton.classList.remove('is-active');
      }
    }
    if (disabled) {
      this.autoRotate = false;
      if (this.autoRotateLabel) {
        this.autoRotateLabel.textContent = 'Auto Orbit';
      }
      this.element.classList.add('viewport-controls--disabled');
    } else {
      this.element.classList.remove('viewport-controls--disabled');
    }
  }

  setAutoRotate(enabled) {
    this.autoRotate = Boolean(enabled) && this.hasModel;
    if (!this.autoRotateButton || !this.autoRotateLabel) {
      return;
    }

    this.autoRotateButton.setAttribute('aria-pressed', this.autoRotate ? 'true' : 'false');
    this.autoRotateButton.classList.toggle('is-active', this.autoRotate);
    this.autoRotateLabel.textContent = this.autoRotate ? 'Stop Auto Orbit' : 'Auto Orbit';
  }

  destroy() {
    this.element?.removeEventListener('click', this.handleClick);
    this.unsubscribe.forEach((unsubscribe) => unsubscribe?.());
    this.unsubscribe = [];
  }
}
