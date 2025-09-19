export class RigControlPanel {
  constructor({ container, bus }) {
    this.container = container;
    this.bus = bus;
    this.root = null;
    this.contentElement = null;
    this.statusElement = null;
    this.currentState = 'idle';
    this.controls = new Map();
    this.subscriptions = [];
    this.currentCritterName = null;
  }

  init() {
    if (!this.container) {
      return;
    }

    this.build();
    this.bindBusEvents();
    this.renderEmpty('Select a critter to unlock pose sliders.');
  }

  build() {
    this.container.innerHTML = '';
    this.root = document.createElement('div');
    this.root.className = 'rig-panel';
    this.root.innerHTML = `
      <div class="rig-panel__header">
        <div class="rig-panel__heading">
          <span class="rig-panel__title">Pose Controls</span>
        </div>
        <span class="rig-panel__status" data-role="rig-status">Idle</span>
      </div>
      <div class="rig-panel__content" data-role="rig-content"></div>
    `;

    this.container.appendChild(this.root);
    this.contentElement = this.root.querySelector('[data-role="rig-content"]');
    this.statusElement = this.root.querySelector('[data-role="rig-status"]');
  }

  bindBusEvents() {
    if (!this.bus) {
      return;
    }

    this.subscriptions.push(
      this.bus.on('stage:model-loading', (payload) => {
        if (payload?.type === 'critter') {
          this.currentCritterName = payload?.name ?? null;
          this.setLoading(true, `Loading ${payload?.name ?? 'critter'} rig…`);
        }
      }),
      this.bus.on('stage:model-ready', (payload) => {
        if (payload?.type === 'critter') {
          this.currentCritterName = payload?.name ?? null;
          this.setLoading(false, `${payload?.name ?? 'Rig'} ready for tuning.`);
        }
      }),
      this.bus.on('stage:model-missing', (payload) => {
        if (payload?.type === 'critter') {
          this.currentCritterName = null;
          this.setLoading(false, `Rig unavailable for ${payload?.name ?? 'this critter'}.`);
          this.renderEmpty('We could not find pose controls for this critter.');
        }
      }),
      this.bus.on('stage:rig-controls-ready', (payload) => {
        const controls = payload?.controls ?? [];
        const values = payload?.values ?? {};
        this.renderControls(controls, values);
        this.setStatus('ready', `${controls.length} control${controls.length === 1 ? '' : 's'} ready.`);
      }),
      this.bus.on('stage:rig-controls-cleared', () => {
        this.renderEmpty('Select a critter to unlock pose sliders.');
      }),
      this.bus.on('stage:rig-pose-updated', (payload) => {
        if (!payload) return;
        this.updateControlValue(payload.id, payload.value);
      }),
      this.bus.on('stage:rig-pose-reset', (payload) => {
        const values = payload?.values ?? {};
        this.applyValues(values);
        this.setStatus('ready', 'Pose sliders reset.');
      })
    );
  }

  setStatus(state, message) {
    this.currentState = state;
    if (this.statusElement) {
      this.statusElement.dataset.state = state;
      this.statusElement.textContent = message;
    }
  }

  setLoading(isLoading, message) {
    this.root?.classList.toggle('is-loading', Boolean(isLoading));
    if (message) {
      this.setStatus(isLoading ? 'loading' : 'ready', message);
    } else if (isLoading) {
      this.setStatus('loading', 'Loading rig…');
    }

    this.controls.forEach((control) => {
      control.input.disabled = Boolean(isLoading);
    });
  }

  renderEmpty(message) {
    this.clearControls({ keepContent: true });
    if (this.contentElement) {
      this.contentElement.innerHTML = '';
      const empty = document.createElement('p');
      empty.className = 'rig-panel__empty';
      empty.textContent = message;
      this.contentElement.appendChild(empty);
    }
    this.setStatus('idle', message);
  }

  renderControls(controls, values) {
    this.clearControls({ keepContent: true });
    if (!controls || controls.length === 0) {
      this.renderEmpty('This critter does not expose pose overrides yet.');
      return;
    }

    if (this.contentElement) {
      this.contentElement.innerHTML = '';
    }

    const groups = new Map();

    controls.forEach((control) => {
      const groupName = control.group || 'General';
      let group = groups.get(groupName);
      if (!group) {
        group = this.createGroup(groupName);
        groups.set(groupName, group);
        this.contentElement?.appendChild(group.container);
      }
      const value = typeof values[control.id] === 'number' ? values[control.id] : control.defaultValue ?? 0;
      const controlElements = this.createControlElement(control, value);
      group.controls.appendChild(controlElements.wrapper);
      this.controls.set(control.id, controlElements);
    });

    this.setStatus('ready', `${controls.length} control${controls.length === 1 ? '' : 's'} ready.`);
  }

  createGroup(name) {
    const container = document.createElement('section');
    container.className = 'rig-group';

    const title = document.createElement('h3');
    title.className = 'rig-group__title';
    title.textContent = name;

    const controls = document.createElement('div');
    controls.className = 'rig-group__controls';

    container.appendChild(title);
    container.appendChild(controls);

    return { container, controls };
  }

  createControlElement(control, value) {
    const wrapper = document.createElement('div');
    wrapper.className = 'rig-control';
    wrapper.dataset.id = control.id;

    const labelRow = document.createElement('div');
    labelRow.className = 'rig-control__label';

    const name = document.createElement('span');
    name.className = 'rig-control__name';
    name.textContent = control.label;

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'rig-control__value';
    valueDisplay.textContent = this.formatValue(control.type, value);

    labelRow.appendChild(name);
    labelRow.appendChild(valueDisplay);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'rig-control__slider';

    const isBoneControl = control.type === 'bone';
    const toSliderUnits = (raw) =>
      isBoneControl ? (raw * 180) / Math.PI : raw;
    const fromSliderUnits = (raw) =>
      isBoneControl ? (raw * Math.PI) / 180 : raw;

    if (isBoneControl) {
      const min = typeof control.min === 'number' ? toSliderUnits(control.min) : -180;
      const max = typeof control.max === 'number' ? toSliderUnits(control.max) : 180;
      const step = typeof control.step === 'number' ? Math.max(toSliderUnits(control.step), 0.1) : 1;
      slider.min = String(min);
      slider.max = String(max);
      slider.step = String(step);
      slider.value = String(toSliderUnits(value));
    } else {
      slider.min = typeof control.min === 'number' ? control.min : 0;
      slider.max = typeof control.max === 'number' ? control.max : 1;
      slider.step = typeof control.step === 'number' ? control.step : 0.01;
      slider.value = String(value);
    }

    const handleInput = (event) => {
      const sliderValue = parseFloat(event.target.value);
      const nextValue = fromSliderUnits(sliderValue);
      valueDisplay.textContent = this.formatValue(control.type, nextValue);
      this.bus?.emit?.('rig:pose-changed', { id: control.id, value: nextValue });
    };

    slider.addEventListener('input', handleInput);

    wrapper.appendChild(labelRow);
    wrapper.appendChild(slider);

    return {
      wrapper,
      input: slider,
      valueElement: valueDisplay,
      type: control.type,
      toSliderUnits,
      fromSliderUnits,
      handleInput,
    };
  }

  updateControlValue(id, value) {
    const entry = this.controls.get(id);
    if (!entry || typeof value !== 'number') {
      return;
    }

    const sliderValue = entry.toSliderUnits ? entry.toSliderUnits(value) : value;
    entry.input.value = String(sliderValue);
    entry.valueElement.textContent = this.formatValue(entry.type, value);
  }

  applyValues(values) {
    if (!values) {
      return;
    }

    Object.entries(values).forEach(([id, value]) => {
      this.updateControlValue(id, value);
    });
  }

  clearControls({ keepContent = false } = {}) {
    this.controls.forEach((entry) => {
      entry.input.removeEventListener('input', entry.handleInput);
    });
    this.controls.clear();

    if (!keepContent && this.contentElement) {
      this.contentElement.innerHTML = '';
    }
  }

  formatValue(type, value) {
    if (type === 'bone') {
      const degrees = value * (180 / Math.PI);
      const rounded = Math.round(degrees);
      const prefix = rounded > 0 ? '+' : '';
      return `${prefix}${rounded}\u00B0`;
    }
    const percent = Math.round(value * 100);
    return `${percent}%`;
  }

  destroy() {
    this.clearControls();
    this.subscriptions.forEach((off) => off?.());
    this.subscriptions = [];
    this.container = null;
    this.root = null;
    this.contentElement = null;
    this.statusElement = null;
  }
}
