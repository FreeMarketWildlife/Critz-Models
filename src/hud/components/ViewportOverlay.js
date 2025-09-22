export class ViewportOverlay {
  constructor({ container, bus }) {
    this.container = container;
    this.bus = bus;
    this.root = null;
    this.statusElement = null;
    this.statusText = null;
    this.statsElement = null;
    this.statsNameElement = null;
    this.statsBonusElement = null;
    this.statsValues = {};
    this.autoRotateButton = null;
    this.focusButton = null;
    this.resetButton = null;
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
        <div class="viewport-status" data-role="viewport-status" role="status" aria-live="polite">
          <span class="viewport-status__text" data-role="viewport-status-text"></span>
        </div>
        <div class="critter-stats" data-role="critter-stats" hidden>
          <div class="critter-stats__header">
            <span class="critter-stats__title">Vitals</span>
            <h3 class="critter-stats__name" data-role="critter-name"></h3>
          </div>
          <dl class="critter-stats__grid">
            <div class="critter-stats__row">
              <dt>Health</dt>
              <dd data-stat="health"></dd>
            </div>
            <div class="critter-stats__row">
              <dt>Speed</dt>
              <dd data-stat="speed"></dd>
            </div>
            <div class="critter-stats__row">
              <dt>Stamina</dt>
              <dd data-stat="stamina"></dd>
            </div>
          </dl>
          <p class="critter-stats__bonus" data-role="critter-bonus"></p>
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
    this.statsElement = this.root.querySelector('[data-role="critter-stats"]');
    this.statsNameElement = this.root.querySelector('[data-role="critter-name"]');
    this.statsBonusElement = this.root.querySelector('[data-role="critter-bonus"]');
    this.statsValues = {};
    this.root.querySelectorAll('[data-stat]').forEach((node) => {
      if (node.dataset.stat) {
        this.statsValues[node.dataset.stat] = node;
      }
    });
    this.autoRotateButton = this.root.querySelector('[data-action="autorotate"]');
    this.focusButton = this.root.querySelector('[data-action="focus"]');
    this.resetButton = this.root.querySelector('[data-action="reset"]');
    this.updateCritterStats(null);
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
        if (payload?.type === 'critter') {
          this.updateCritterStats(payload, { state: 'loading' });
        } else {
          this.updateCritterStats(null);
        }
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
        if (payload?.type === 'critter') {
          this.updateCritterStats(payload, { state: 'ready' });
        } else {
          this.updateCritterStats(null);
        }
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
        this.updateCritterStats(null);
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
      })
    );
  }

  setStatus(state, message) {
    this.state = state;
    if (this.statusElement) {
      this.statusElement.dataset.state = state;
      this.statusElement.classList.remove('is-pulsing');
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

  updateCritterStats(detail, { state } = {}) {
    if (!this.statsElement) {
      return;
    }

    const stats = detail?.stats;
    if (!stats) {
      this.statsElement.hidden = true;
      this.statsElement.dataset.state = 'empty';
      return;
    }

    this.statsElement.hidden = false;
    this.statsElement.dataset.state = state || 'ready';

    if (this.statsNameElement) {
      this.statsNameElement.textContent = detail?.name || 'Critter';
    }

    ['health', 'speed', 'stamina'].forEach((key) => {
      const node = this.statsValues[key];
      if (!node) {
        return;
      }
      const value = stats[key];
      node.textContent = typeof value === 'number' ? `${value}` : value ?? '—';
    });

    if (this.statsBonusElement) {
      if (stats.bonus) {
        this.statsBonusElement.textContent = stats.bonus;
        this.statsBonusElement.hidden = false;
      } else {
        this.statsBonusElement.textContent = '';
        this.statsBonusElement.hidden = true;
      }
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
    this.statsElement = null;
    this.statsNameElement = null;
    this.statsBonusElement = null;
    this.statsValues = {};
  }
}
