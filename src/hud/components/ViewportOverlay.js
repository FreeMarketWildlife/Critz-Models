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
    this.statsElement = null;
    this.statFields = {};
    this.autoRotateEnabled = false;
    this.state = 'idle';
    this.unsubscribe = [];
    this.pulseTimeout = null;
    this.isLoading = false;
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
        <div class="viewport-status" data-role="viewport-status">
          <span class="viewport-status__text" data-role="viewport-status-text"></span>
        </div>
        <div class="viewport-stats" data-role="viewport-stats" hidden>
          <span class="viewport-stats__name" data-stat="name"></span>
          <dl class="viewport-stats__list">
            <div class="viewport-stats__item">
              <dt>Health</dt>
              <dd data-stat="health">--</dd>
            </div>
            <div class="viewport-stats__item">
              <dt>Speed</dt>
              <dd data-stat="speed">--</dd>
            </div>
            <div class="viewport-stats__item">
              <dt>Stamina</dt>
              <dd data-stat="stamina">--</dd>
            </div>
          </dl>
          <p class="viewport-stats__bonus" data-stat="bonus"></p>
        </div>
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
    this.statsElement = this.root.querySelector('[data-role="viewport-stats"]');
    this.statFields = {
      name: this.root.querySelector('[data-stat="name"]'),
      health: this.root.querySelector('[data-stat="health"]'),
      speed: this.root.querySelector('[data-stat="speed"]'),
      stamina: this.root.querySelector('[data-stat="stamina"]'),
      bonus: this.root.querySelector('[data-stat="bonus"]'),
    };
    this.autoRotateButton = this.root.querySelector('[data-action="autorotate"]');
    this.focusButton = this.root.querySelector('[data-action="focus"]');
    this.resetButton = this.root.querySelector('[data-action="reset"]');
    this.updateStats(null);
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
          this.updateStats(null);
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
      this.bus.on('viewport:critter-info', (payload) => {
        this.updateStats(payload);
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

  updateButtonState(button, isEnabled) {
    if (!button || typeof isEnabled === 'undefined') {
      return;
    }
    button.disabled = !isEnabled;
    button.classList.toggle('is-disabled', !isEnabled);
  }

  updateStats(payload) {
    if (!this.statsElement || !this.statFields) {
      return;
    }

    if (!payload || !payload.stats) {
      this.statsElement.hidden = true;
      if (this.statFields.name) {
        this.statFields.name.textContent = payload?.name ?? '';
      }
      ['health', 'speed', 'stamina'].forEach((key) => {
        if (this.statFields[key]) {
          this.statFields[key].textContent = '--';
        }
      });
      if (this.statFields.bonus) {
        this.statFields.bonus.textContent = '';
        this.statFields.bonus.classList.add('is-empty');
      }
      return;
    }

    const { name, stats } = payload;
    this.statsElement.hidden = false;
    if (this.statFields.name) {
      this.statFields.name.textContent = name ?? '';
    }

    ['health', 'speed', 'stamina'].forEach((key) => {
      if (this.statFields[key]) {
        const value = stats[key];
        this.statFields[key].textContent = typeof value === 'number' ? String(value) : value ?? '--';
      }
    });

    if (this.statFields.bonus) {
      const bonus = stats.bonus ? `Bonus: ${stats.bonus}` : '';
      this.statFields.bonus.textContent = bonus;
      this.statFields.bonus.classList.toggle('is-empty', !bonus);
    }
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
    this.statsElement = null;
    this.statFields = {};
    if (this.root?.parentNode) {
      this.root.parentNode.removeChild(this.root);
    }
    if (this.pulseTimeout) {
      clearTimeout(this.pulseTimeout);
      this.pulseTimeout = null;
    }
  }
}
