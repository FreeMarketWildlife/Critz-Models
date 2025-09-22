export class ViewportOverlay {
  constructor({ container, bus }) {
    this.container = container;
    this.bus = bus;
    this.root = null;
    this.statusElement = null;
    this.statusText = null;
    this.autoRotateButton = null;
    this.focusButton = null;
    this.resetButton = null;
    this.autoRotateEnabled = false;
    this.state = 'idle';
    this.unsubscribe = [];
    this.pulseTimeout = null;
    this.isLoading = false;
    this.critterCardElement = null;
    this.critterNameElement = null;
    this.critterStatElements = {
      health: null,
      speed: null,
      stamina: null,
      bonus: null,
    };
  }

  init() {
    if (!this.container) {
      throw new Error('ViewportOverlay requires a container element.');
    }

    this.build();
    this.bindControls();
    this.bindBusEvents();
    this.setStatus('idle', 'Select a critter to preview.');
    this.setControlsAvailability({
      focus: false,
      reset: false,
      autorotate: false,
    });
  }

  build() {
    this.root = document.createElement('div');
    this.root.className = 'viewport-ui';
    this.root.innerHTML = `
      <div class="viewport-ui__top">
        <div class="viewport-status" data-role="viewport-status" data-state="idle">
          <span class="viewport-status__label">Preview</span>
          <span class="viewport-status__text" data-role="viewport-status-text"></span>
        </div>
        <aside class="viewport-critter" data-role="critter-card" hidden>
          <div class="viewport-critter__header">
            <span class="viewport-critter__name" data-role="critter-name"></span>
          </div>
          <dl class="viewport-critter__stats">
            <div class="viewport-critter__stat">
              <dt>Health</dt>
              <dd data-role="critter-stat-health"></dd>
            </div>
            <div class="viewport-critter__stat">
              <dt>Speed</dt>
              <dd data-role="critter-stat-speed"></dd>
            </div>
            <div class="viewport-critter__stat">
              <dt>Stamina</dt>
              <dd data-role="critter-stat-stamina"></dd>
            </div>
            <div class="viewport-critter__stat viewport-critter__stat--wide">
              <dt>Bonus</dt>
              <dd data-role="critter-stat-bonus"></dd>
            </div>
          </dl>
        </aside>
      </div>
      <div class="viewport-ui__bottom">
        <div class="viewport-controls-panel">
          <div class="viewport-controls" role="group" aria-label="Viewport controls">
            <button type="button" class="viewport-button" data-action="focus">Focus Model</button>
            <button type="button" class="viewport-button" data-action="reset">Reset View</button>
            <button
              type="button"
              class="viewport-button viewport-button--toggle"
              data-action="autorotate"
              aria-pressed="false"
            >
              Auto Orbit
            </button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.root);
    this.statusElement = this.root.querySelector('[data-role="viewport-status"]');
    this.statusText = this.root.querySelector('[data-role="viewport-status-text"]');
    this.autoRotateButton = this.root.querySelector('[data-action="autorotate"]');
    this.focusButton = this.root.querySelector('[data-action="focus"]');
    this.resetButton = this.root.querySelector('[data-action="reset"]');
    this.critterCardElement = this.root.querySelector('[data-role="critter-card"]');
    this.critterNameElement = this.root.querySelector('[data-role="critter-name"]');
    this.critterStatElements = {
      health: this.root.querySelector('[data-role="critter-stat-health"]'),
      speed: this.root.querySelector('[data-role="critter-stat-speed"]'),
      stamina: this.root.querySelector('[data-role="critter-stat-stamina"]'),
      bonus: this.root.querySelector('[data-role="critter-stat-bonus"]'),
    };
  }

  bindControls() {
    if (!this.bus) {
      return;
    }

    if (this.focusButton) {
      this.focusButton.addEventListener('click', () => {
        this.bus.emit('stage:focus-requested');
      });
    }

    if (this.resetButton) {
      this.resetButton.addEventListener('click', () => {
        this.bus.emit('stage:reset-requested');
        this.flashStatus();
      });
    }

    if (this.autoRotateButton) {
      this.autoRotateButton.addEventListener('click', () => {
        const next = !this.autoRotateEnabled;
        this.bus.emit('stage:auto-rotate-requested', { enabled: next });
      });
    }
  }

  bindBusEvents() {
    if (!this.bus) {
      return;
    }

    this.unsubscribe.push(
      this.bus.on('stage:model-loading', (payload) => {
        const name = payload?.name ?? 'Model';
        this.setStatus('loading', `Loading ${name}...`);
        this.setLoading(true);
      }),
      this.bus.on('stage:model-ready', (payload) => {
        const name = payload?.name ?? 'Model';
        this.setStatus('ready', name);
        this.setLoading(false);
        this.setControlsAvailability({
          focus: true,
          reset: true,
          autorotate: true,
        });
        this.flashStatus();
      }),
      this.bus.on('stage:model-missing', (payload) => {
        const name = payload?.name ?? 'model';
        this.setStatus('empty', `We couldn't load the ${name}.`);
        this.setLoading(false);
        this.setControlsAvailability({
          focus: false,
          reset: true,
          autorotate: false,
        });
        if (payload?.type === 'critter') {
          this.updateCritterDetails(null);
        }
      }),
      this.bus.on('stage:focus-achieved', () => {
        this.flashStatus();
      }),
      this.bus.on('stage:view-reset', () => {
        this.flashStatus();
      }),
      this.bus.on('stage:auto-rotate-changed', (payload) => {
        this.autoRotateEnabled = Boolean(payload?.enabled);
        this.updateAutoRotateButton();
      }),
      this.bus.on('viewport:critter-details', (payload) => {
        const critter = payload?.critter ?? null;
        this.updateCritterDetails(critter);
        if (!this.isLoading) {
          if (critter) {
            this.setStatus('ready', critter.name);
          } else {
            this.setStatus('idle', 'Select a critter to preview.');
          }
        }
      })
    );
  }

  setStatus(state, message) {
    this.state = state;
    if (this.statusElement) {
      this.statusElement.dataset.state = state;
    }
    if (this.statusText) {
      this.statusText.textContent = message;
    }
  }

  updateAutoRotateButton() {
    if (!this.autoRotateButton) {
      return;
    }
    this.autoRotateButton.setAttribute('aria-pressed', this.autoRotateEnabled ? 'true' : 'false');
    this.autoRotateButton.classList.toggle('is-active', this.autoRotateEnabled);
  }

  flashStatus() {
    if (!this.statusElement) {
      return;
    }
    this.statusElement.classList.remove('is-pulsing');
    // Force reflow so the animation can restart consistently.
    // eslint-disable-next-line no-unused-expressions
    this.statusElement.offsetWidth;
    this.statusElement.classList.add('is-pulsing');
    if (this.pulseTimeout) {
      clearTimeout(this.pulseTimeout);
    }
    this.pulseTimeout = setTimeout(() => {
      this.statusElement?.classList.remove('is-pulsing');
    }, 900);
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.root?.classList.toggle('is-loading', isLoading);
    this.setControlsAvailability({
      focus: !isLoading,
      reset: !isLoading,
      autorotate: !isLoading,
    });
  }

  setControlsAvailability({ focus, reset, autorotate }) {
    this.updateButtonState(this.focusButton, focus);
    this.updateButtonState(this.resetButton, reset);
    this.updateButtonState(this.autoRotateButton, autorotate);
  }

  updateCritterDetails(critter) {
    if (!this.critterCardElement) {
      return;
    }

    if (!critter) {
      this.critterCardElement.hidden = true;
      Object.values(this.critterStatElements).forEach((element) => {
        if (element) {
          element.textContent = '';
        }
      });
      if (this.critterNameElement) {
        this.critterNameElement.textContent = '';
      }
      return;
    }

    this.critterCardElement.hidden = false;
    if (this.critterNameElement) {
      this.critterNameElement.textContent = critter.name;
    }

    const stats = critter.stats ?? {};
    if (this.critterStatElements.health) {
      this.critterStatElements.health.textContent = stats.health ?? '—';
    }
    if (this.critterStatElements.speed) {
      this.critterStatElements.speed.textContent = stats.speed ?? '—';
    }
    if (this.critterStatElements.stamina) {
      this.critterStatElements.stamina.textContent = stats.stamina ?? '—';
    }
    if (this.critterStatElements.bonus) {
      this.critterStatElements.bonus.textContent = stats.bonus ?? '—';
    }
  }

  updateButtonState(button, isEnabled) {
    if (!button || typeof isEnabled === 'undefined') {
      return;
    }
    button.disabled = !isEnabled;
    button.classList.toggle('is-disabled', !isEnabled);
  }

  destroy() {
    this.unsubscribe.forEach((off) => off?.());
    this.unsubscribe = [];
    if (this.autoRotateButton) {
      this.autoRotateButton.replaceWith(this.autoRotateButton.cloneNode(true));
      this.autoRotateButton = null;
    }
    if (this.focusButton) {
      this.focusButton.replaceWith(this.focusButton.cloneNode(true));
      this.focusButton = null;
    }
    if (this.resetButton) {
      this.resetButton.replaceWith(this.resetButton.cloneNode(true));
      this.resetButton = null;
    }
    if (this.root?.parentNode) {
      this.root.parentNode.removeChild(this.root);
    }
    if (this.pulseTimeout) {
      clearTimeout(this.pulseTimeout);
      this.pulseTimeout = null;
    }
  }
}
