import { weaponsMapDefaultLayout } from '../../data/weaponsMapDefaultLayout.js';

const DEFAULT_PAN = { x: 38, y: 30 };
const PAN_MARGIN = 82;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2.6;
const DEFAULT_VISUAL_SCALE = 0.5;
const DEFAULT_FOCUS_GROUP_ID = 'military';
const LANE_START_Y = 88;
const LANE_GAP = 16;
const LANE_INNER_TOP = 78;
const LANE_ROW_GAP = 98;
const NODE_WIDTH = 176;
const NODE_HEIGHT = 84;
const GRID_COLUMNS = 7;

const prettify = (value = '') =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export class WeaponUnlockMap {
  constructor({ element, weapons = [], categories = [], bus, zoomElement = null }) {
    this.element = element;
    this.weapons = weapons;
    this.categories = categories;
    this.bus = bus;
    this.zoomLabel = zoomElement;
    this.layoutSource = weaponsMapDefaultLayout;

    this.root = null;
    this.viewport = null;
    this.board = null;
    this.linksLayer = null;
    this.groupsLayer = null;
    this.lanesLayer = null;
    this.nodesLayer = null;

    this.activeCategoryId = null;
    this.activeWeaponId = null;
    this.nodeButtons = new Map();
    this.groupMetrics = new Map();

    this.pan = { ...DEFAULT_PAN };
    this.scale = DEFAULT_VISUAL_SCALE;
    this.panDragState = null;
    this.panningEnabled = true;
  }

  render(defaultCategoryId) {
    if (!this.element) {
      return;
    }

    this.element.innerHTML = '';
    this.root = document.createElement('div');
    this.root.className = 'unlock-map unlock-map--weapons';
    this.root.innerHTML = `
      <div class="unlock-map__viewport" data-role="map-viewport">
        <div class="unlock-map__board" data-role="map-board">
          <svg class="unlock-map__links" data-role="map-links" preserveAspectRatio="xMinYMin meet"></svg>
          <div class="unlock-map__lanes" data-role="map-lanes"></div>
          <div class="unlock-map__nodes" data-role="map-nodes"></div>
        </div>
      </div>
    `;

    this.element.appendChild(this.root);
    this.viewport = this.root.querySelector('[data-role="map-viewport"]');
    this.board = this.root.querySelector('[data-role="map-board"]');
    this.linksLayer = this.root.querySelector('[data-role="map-links"]');
    this.groupsLayer = null;
    this.lanesLayer = this.root.querySelector('[data-role="map-lanes"]');
    this.nodesLayer = this.root.querySelector('[data-role="map-nodes"]');

    const board = this.layoutSource?.board || {};
    this.board.style.width = `${Number(board.width) || 1700}px`;
    this.board.style.height = `${Number(board.height) || 3200}px`;
    if (this.linksLayer) {
      this.linksLayer.setAttribute('viewBox', `0 0 ${Number(board.width) || 1700} ${Number(board.height) || 3200}`);
    }

    this.bindPanning();
    this.bindWheelNavigation();
    this.applyTransform();

    const initialCategory = defaultCategoryId || this.categories[0] || 'primary';
    this.setCategory(initialCategory);
  }

  clampZoom(value) {
    return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, value));
  }

  clampPan() {
    if (!this.viewport || !this.board) {
      return;
    }

    const viewportWidth = this.viewport.clientWidth;
    const viewportHeight = this.viewport.clientHeight;
    const boardWidth = (Number(this.layoutSource?.board?.width) || 1700) * this.scale;
    const boardHeight = (Number(this.layoutSource?.board?.height) || 3200) * this.scale;

    const minX = Math.min(PAN_MARGIN, viewportWidth - boardWidth - PAN_MARGIN);
    const maxX = PAN_MARGIN;
    const minY = Math.min(PAN_MARGIN, viewportHeight - boardHeight - PAN_MARGIN);
    const maxY = PAN_MARGIN;

    this.pan.x = Math.max(minX, Math.min(maxX, this.pan.x));
    this.pan.y = Math.max(minY, Math.min(maxY, this.pan.y));
  }

  applyTransform() {
    if (!this.board) {
      return;
    }

    this.clampPan();
    this.board.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`;
    if (this.zoomLabel) {
      this.zoomLabel.textContent = `${Math.round((this.scale / DEFAULT_VISUAL_SCALE) * 100)}%`;
    }
  }

  bindPanning() {
    if (!this.viewport) {
      return;
    }

    const onPointerDown = (event) => {
      if (event.button !== 0 || !this.panningEnabled) {
        return;
      }

      if (event.target.closest('.unlock-node')) {
        return;
      }

      this.panDragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: this.pan.x,
        originY: this.pan.y,
      };
      this.viewport.classList.add('is-dragging');
      this.viewport.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!this.panDragState || event.pointerId !== this.panDragState.pointerId) {
        return;
      }

      this.pan.x = this.panDragState.originX + (event.clientX - this.panDragState.startX);
      this.pan.y = this.panDragState.originY + (event.clientY - this.panDragState.startY);
      this.applyTransform();
    };

    const onPointerFinish = (event) => {
      if (!this.panDragState || event.pointerId !== this.panDragState.pointerId) {
        return;
      }

      if (this.viewport.hasPointerCapture(event.pointerId)) {
        this.viewport.releasePointerCapture(event.pointerId);
      }
      this.panDragState = null;
      this.viewport.classList.remove('is-dragging');
    };

    this.viewport.addEventListener('pointerdown', onPointerDown);
    this.viewport.addEventListener('pointermove', onPointerMove);
    this.viewport.addEventListener('pointerup', onPointerFinish);
    this.viewport.addEventListener('pointercancel', onPointerFinish);
  }

  bindWheelNavigation() {
    if (!this.viewport) {
      return;
    }

    this.viewport.addEventListener(
      'wheel',
      (event) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          const rect = this.viewport.getBoundingClientRect();
          const pointerX = event.clientX - rect.left;
          const pointerY = event.clientY - rect.top;
          const previousScale = this.scale;
          const nextScale = this.clampZoom(previousScale * Math.exp(-event.deltaY * 0.0025));

          if (Math.abs(nextScale - previousScale) < 0.0001) {
            return;
          }

          const worldX = (pointerX - this.pan.x) / previousScale;
          const worldY = (pointerY - this.pan.y) / previousScale;
          this.scale = nextScale;
          this.pan.x = pointerX - worldX * nextScale;
          this.pan.y = pointerY - worldY * nextScale;
          this.applyTransform();
          return;
        }

        if (!this.panningEnabled) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        this.pan.x -= event.deltaX;
        this.pan.y -= event.deltaY;
        this.applyTransform();
      },
      { passive: false }
    );
  }

  setCategory(categoryId) {
    if (!categoryId) {
      return;
    }

    this.activeCategoryId = categoryId;
    this.activeWeaponId = null;
    this.pan = { ...DEFAULT_PAN };
    this.renderCategoryMap();
    this.resetCategoryView();
  }

  setActiveWeapon(weaponId) {
    this.activeWeaponId = weaponId || null;
    this.nodeButtons.forEach((button, id) => {
      const isActive = id === this.activeWeaponId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  setPanningEnabled(nextEnabled) {
    this.panningEnabled = Boolean(nextEnabled);
    this.viewport?.classList.toggle('is-pan-disabled', !this.panningEnabled);
    return this.panningEnabled;
  }

  togglePanningEnabled() {
    return this.setPanningEnabled(!this.panningEnabled);
  }

  isPanningEnabled() {
    return this.panningEnabled;
  }

  isAddNodesModeEnabled() {
    return false;
  }

  toggleAddNodesModeEnabled() {
    return false;
  }

  areLinkPointsVisible() {
    return false;
  }

  toggleLinkPointsVisibility() {
    return false;
  }

  copyLayoutSnapshot() {
    const text = JSON.stringify(this.layoutSource, null, 2);
    return this.copyTextToClipboard(text).then(() => text);
  }

  getCategoryLayout() {
    return this.layoutSource?.categories?.[this.activeCategoryId] || null;
  }

  getWeaponsForCategory() {
    const categoryLayout = this.getCategoryLayout();
    return Array.isArray(categoryLayout?.weapons) ? categoryLayout.weapons : [];
  }

  resetCategoryView() {
    this.scale = DEFAULT_VISUAL_SCALE;
    this.applyTransform();
    requestAnimationFrame(() => {
      this.focusGroup(DEFAULT_FOCUS_GROUP_ID, { scale: DEFAULT_VISUAL_SCALE });
    });
  }

  focusGroup(groupId, { scale = this.scale } = {}) {
    if (!this.viewport) {
      this.scale = this.clampZoom(scale);
      this.applyTransform();
      return;
    }

    const fallbackMetric = Array.from(this.groupMetrics.values())[0] || null;
    const metric = this.groupMetrics.get(groupId) || fallbackMetric;
    const boardWidth = Number(this.layoutSource?.board?.width) || 1700;
    const viewportWidth = this.viewport.clientWidth || 0;
    const viewportHeight = this.viewport.clientHeight || 0;
    const targetX = boardWidth / 2;
    const targetY = metric?.centerY || (Number(this.layoutSource?.board?.height) || 3200) / 2;

    this.scale = this.clampZoom(scale);
    this.pan.x = viewportWidth / 2 - targetX * this.scale;
    this.pan.y = viewportHeight / 2 - targetY * this.scale;
    this.applyTransform();
  }

  renderRequirementLinks(nodePositions) {
    if (!this.linksLayer) {
      return;
    }

    this.linksLayer.innerHTML = '';
    this.getWeaponsForCategory().forEach((entry) => {
      const target = nodePositions.get(entry.id);
      const requirements = Array.isArray(entry.requirements) ? entry.requirements : [];
      if (!target || !requirements.length) {
        return;
      }

      requirements.forEach((requirement) => {
        const source = nodePositions.get(requirement.weaponId);
        if (!source) {
          return;
        }

        const dx = target.centerX - source.centerX;
        const direction = dx >= 0 ? 1 : -1;
        const controlOffset = Math.max(120, Math.abs(dx) * 0.42);
        const startX = direction >= 0 ? source.x + NODE_WIDTH : source.x;
        const endX = direction >= 0 ? target.x : target.x + NODE_WIDTH;
        const startY = source.y + NODE_HEIGHT / 2;
        const endY = target.y + NODE_HEIGHT / 2;
        const pathData = [
          `M ${startX} ${startY}`,
          `C ${startX + direction * controlOffset} ${startY},`,
          `${endX - direction * controlOffset} ${endY},`,
          `${endX} ${endY}`,
        ].join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'unlock-link');
        path.setAttribute('d', pathData);
        this.linksLayer.appendChild(path);
      });
    });
  }

  renderCategoryMap() {
    if (!this.lanesLayer || !this.nodesLayer || !this.linksLayer) {
      return;
    }

    this.linksLayer.innerHTML = '';
    this.lanesLayer.innerHTML = '';
    this.nodesLayer.innerHTML = '';
    this.nodeButtons.clear();
    this.groupMetrics.clear();

    const categoryLayout = this.getCategoryLayout();
    if (!categoryLayout) {
      return;
    }

    const groups = Array.isArray(categoryLayout.progressionGroups) ? categoryLayout.progressionGroups : [];
    const boardHeight = Number(this.layoutSource?.board?.height) || 3200;
    const laneCount = Math.max(groups.length, 1);
    const laneHeight =
      laneCount > 0
        ? Math.max(260, Math.floor((boardHeight - LANE_START_Y * 2 - LANE_GAP * (laneCount - 1)) / laneCount))
        : 560;
    const boardWidth = Number(this.layoutSource?.board?.width) || 1700;
    const nodeStepX = Math.max(188, Math.floor((boardWidth - 120 - NODE_WIDTH) / Math.max(1, GRID_COLUMNS - 1)));

    groups.forEach((group, index) => {
      const laneWeapons = this.getWeaponsForCategory()
        .filter((entry) => entry.group === group.id)
        .sort((a, b) => {
          const deltaY = (Number(a.y) || 0) - (Number(b.y) || 0);
          if (deltaY !== 0) {
            return deltaY;
          }
          return (Number(a.x) || 0) - (Number(b.x) || 0);
        });
      const laneTop = LANE_START_Y + index * (laneHeight + LANE_GAP);
      this.groupMetrics.set(group.id, {
        top: laneTop,
        height: laneHeight,
        centerY: laneTop + laneHeight / 2,
      });

      const lane = document.createElement('div');
      lane.className = 'unlock-lane unlock-lane--weapon';
      lane.style.top = `${laneTop}px`;
      lane.style.height = `${laneHeight}px`;
      lane.style.setProperty('--grid-cols', String(GRID_COLUMNS));
      lane.style.setProperty('--grid-rows', '5');
      lane.innerHTML = `
        <span class="unlock-lane__name">${group.label || prettify(group.id)}</span>
        <span class="unlock-lane__status">${
          laneWeapons.length ? `${laneWeapons.length} weapon${laneWeapons.length === 1 ? '' : 's'}` : 'Awaiting Data Entry'
        }</span>
      `;
      this.lanesLayer.appendChild(lane);

      laneWeapons.forEach((entry, weaponIndex) => {
        const node = document.createElement('button');
        node.type = 'button';
        node.className = 'unlock-node unlock-node--weapon';
        const columnIndex = weaponIndex % GRID_COLUMNS;
        const rowIndex = Math.floor(weaponIndex / GRID_COLUMNS);
        const x = 52 + columnIndex * nodeStepX;
        const y = laneTop + LANE_INNER_TOP + rowIndex * LANE_ROW_GAP;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.dataset.weaponId = entry.id;
        node.setAttribute('aria-pressed', 'false');
        node.innerHTML = `<span class="unlock-node__name">${entry.name}</span>`;

        const style = entry.style || null;
        if (style) {
          if (Number.isFinite(Number(style.textScale))) {
            node.style.setProperty('--node-font-size', `${(15 * Number(style.textScale)) / 100}px`);
          }
          if (Number.isFinite(Number(style.hue))) {
            node.style.setProperty('--node-hue', String(style.hue));
          }
          if (Number.isFinite(Number(style.saturation))) {
            node.style.setProperty('--node-saturation', String(style.saturation));
          }
          if (Number.isFinite(Number(style.lightness))) {
            node.style.setProperty('--node-lightness', String(style.lightness));
          }
          if (style.glow === true) {
            node.classList.add('is-glowing');
          }
        }

        node.addEventListener('click', () => {
          const nextId = this.activeWeaponId === entry.id ? null : entry.id;
          this.setActiveWeapon(nextId);
          this.bus?.emit?.('weapon-map:selected', nextId);
        });

        this.nodesLayer.appendChild(node);
        this.nodeButtons.set(entry.id, node);
      });
    });

    this.renderRequirementLinks(
      new Map(
        Array.from(this.nodeButtons.keys()).map((id) => {
          const button = this.nodeButtons.get(id);
          if (!button) {
            return [id, null];
          }
          const x = Number.parseFloat(button.style.left) || 0;
          const y = Number.parseFloat(button.style.top) || 0;
          return [
            id,
            {
              x,
              y,
              centerX: x + NODE_WIDTH / 2,
              centerY: y + NODE_HEIGHT / 2,
            },
          ];
        })
      )
    );

    if (!groups.length) {
      const fallbackLane = document.createElement('div');
      fallbackLane.className = 'unlock-lane unlock-lane--weapon';
      fallbackLane.style.top = `${LANE_START_Y}px`;
      fallbackLane.style.height = `${Math.max(280, boardHeight - LANE_START_Y * 2)}px`;
      fallbackLane.style.setProperty('--grid-cols', String(GRID_COLUMNS));
      fallbackLane.style.setProperty('--grid-rows', '5');
      fallbackLane.innerHTML = `
        <span class="unlock-lane__name">${categoryLayout.label || prettify(this.activeCategoryId)}</span>
        <span class="unlock-lane__status">Awaiting Data Entry</span>
      `;
      this.lanesLayer.appendChild(fallbackLane);
      this.groupMetrics.set(this.activeCategoryId, {
        top: LANE_START_Y,
        height: Math.max(280, boardHeight - LANE_START_Y * 2),
        centerY: LANE_START_Y + Math.max(280, boardHeight - LANE_START_Y * 2) / 2,
      });
    }
  }

  async copyTextToClipboard(text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    helper.style.left = '-9999px';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
  }
}
