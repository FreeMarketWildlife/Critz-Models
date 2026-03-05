import { critterMapDefaultLayout } from '../../data/critterMapDefaultLayout.js';

const MAP_WIDTH = 1520;
const MAP_HEIGHT = 3980;
const LANE_START_Y = 88;
const LANE_HEIGHT = 760;
const NODE_WIDTH = 176;
const NODE_HEIGHT = 84;
const LANE_ROW_OFFSET = 58;
const LANE_BOTTOM_PADDING = 48;
const MIN_NODE_GAP = 26;
const LANE_X_PADDING = 34;
const DEFAULT_PAN = { x: 38, y: 30 };
const PAN_MARGIN = 82;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.6;
const NODE_DRAG_THRESHOLD = 6;
const NODE_BOUNDARY_PADDING = 10;

const RARITY_LANES = [
  { id: 'common', label: 'Common' },
  { id: 'uncommon', label: 'Uncommon' },
  { id: 'rare', label: 'Rare' },
  { id: 'extinct', label: 'Extinct' },
  { id: 'mythical', label: 'Mythical' },
];

const prettify = (value = '') =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getUnlockRequirements = (critter) => {
  const unlock = critter?.unlock;
  if (!unlock) {
    return [];
  }

  if (Array.isArray(unlock.requirements)) {
    return unlock.requirements
      .filter((entry) => entry && entry.critterId && Number.isFinite(Number(entry.level)))
      .map((entry) => ({
        critterId: entry.critterId,
        level: Number(entry.level),
      }));
  }

  if (unlock.type === 'level' && unlock.critterId && Number.isFinite(Number(unlock.level))) {
    return [
      {
        critterId: unlock.critterId,
        level: Number(unlock.level),
      },
    ];
  }

  return [];
};

const getPrimaryRequirement = (critter) => getUnlockRequirements(critter)[0] || null;

const getRequirementLevel = (critter) => {
  const unlock = critter?.unlock;
  if (unlock?.type === 'starter') {
    return 0;
  }

  const requirements = getUnlockRequirements(critter);
  if (!requirements.length) {
    return 0;
  }

  return Math.max(...requirements.map((requirement) => requirement.level));
};

const shortUnlockLabel = (critter, namesById) => {
  const unlock = critter?.unlock;
  if (!unlock) {
    return 'Awaiting data';
  }

  if (unlock.type === 'starter') {
    return 'Starter';
  }

  const requirements = getUnlockRequirements(critter);
  if (requirements.length === 1) {
    const requirement = requirements[0];
    const sourceName = namesById.get(requirement.critterId) || prettify(requirement.critterId);
    return `Lvl ${requirement.level}: ${sourceName}`;
  }

  if (requirements.length > 1) {
    return `${requirements.length} reqs`;
  }

  return unlock.text || 'Awaiting data';
};

const critterSortWeight = (critter) => {
  const unlock = critter?.unlock;
  if (unlock?.type === 'starter') return 0;
  if (getUnlockRequirements(critter).length) return 1;
  return 2;
};

export class CritterUnlockMap {
  constructor({ element, critters = [], categories = [], bus, zoomElement = null }) {
    this.element = element;
    this.critters = critters;
    this.categories = categories;
    this.bus = bus;

    this.root = null;
    this.viewport = null;
    this.board = null;
    this.linksLayer = null;
    this.lanesLayer = null;
    this.nodesLayer = null;
    this.zoomLabel = zoomElement || null;

    this.activeCategoryId = null;
    this.activeCritterId = null;
    this.nodeButtons = new Map();
    this.currentPositions = new Map();
    this.linkRecords = [];
    this.customPositionsByCategory = this.buildPositionOverrides(critterMapDefaultLayout);

    this.pan = { ...DEFAULT_PAN };
    this.scale = 1;
    this.panDragState = null;
  }

  buildPositionOverrides(layoutByCategory = {}) {
    const positionsByCategory = new Map();
    Object.entries(layoutByCategory).forEach(([categoryId, critterPoints]) => {
      if (!critterPoints || typeof critterPoints !== 'object') {
        return;
      }

      const positionsByCritter = new Map();
      Object.entries(critterPoints).forEach(([critterId, point]) => {
        const x = Number(point?.x);
        const y = Number(point?.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          return;
        }

        const bounded = this.clampNodePosition(x, y);
        positionsByCritter.set(critterId, { x: bounded.x, y: bounded.y });
      });

      if (positionsByCritter.size) {
        positionsByCategory.set(categoryId, positionsByCritter);
      }
    });
    return positionsByCategory;
  }

  render(defaultCategoryId) {
    if (!this.element) {
      return;
    }

    this.element.innerHTML = '';
    this.root = document.createElement('div');
    this.root.className = 'unlock-map';
    this.root.innerHTML = `
      <div class="unlock-map__viewport" data-role="map-viewport">
        <div class="unlock-map__board" data-role="map-board">
          <svg class="unlock-map__links" data-role="map-links" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" preserveAspectRatio="xMinYMin meet"></svg>
          <div class="unlock-map__lanes" data-role="map-lanes"></div>
          <div class="unlock-map__nodes" data-role="map-nodes"></div>
        </div>
      </div>
    `;

    this.element.appendChild(this.root);
    this.viewport = this.root.querySelector('[data-role="map-viewport"]');
    this.board = this.root.querySelector('[data-role="map-board"]');
    this.linksLayer = this.root.querySelector('[data-role="map-links"]');
    this.lanesLayer = this.root.querySelector('[data-role="map-lanes"]');
    this.nodesLayer = this.root.querySelector('[data-role="map-nodes"]');
    if (!this.zoomLabel) {
      this.zoomLabel = this.root.querySelector('[data-role="map-zoom"]');
    }

    this.board.style.width = `${MAP_WIDTH}px`;
    this.board.style.height = `${MAP_HEIGHT}px`;

    this.bindPanning();
    this.bindWheelNavigation();
    this.applyTransform();

    const initialCategory = defaultCategoryId || this.categories[0]?.id || this.critters[0]?.category || null;
    if (initialCategory) {
      this.setCategory(initialCategory);
    }
  }

  bindPanning() {
    if (!this.viewport) {
      return;
    }

    const onPointerDown = (event) => {
      if (event.button !== 0) {
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

      const dx = event.clientX - this.panDragState.startX;
      const dy = event.clientY - this.panDragState.startY;
      this.pan.x = this.panDragState.originX + dx;
      this.pan.y = this.panDragState.originY + dy;
      this.applyTransform();
    };

    const onPointerUp = (event) => {
      if (!this.panDragState || event.pointerId !== this.panDragState.pointerId) {
        return;
      }

      this.viewport.releasePointerCapture(event.pointerId);
      this.panDragState = null;
      this.viewport.classList.remove('is-dragging');
    };

    this.viewport.addEventListener('pointerdown', onPointerDown);
    this.viewport.addEventListener('pointermove', onPointerMove);
    this.viewport.addEventListener('pointerup', onPointerUp);
    this.viewport.addEventListener('pointercancel', onPointerUp);
    this.viewport.addEventListener('pointerleave', onPointerUp);
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

        event.preventDefault();
        this.pan.x -= event.deltaX;
        this.pan.y -= event.deltaY;
        this.applyTransform();
      },
      { passive: false }
    );
  }

  clampZoom(value) {
    return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, value));
  }

  clampPan() {
    if (!this.viewport) {
      return;
    }

    const viewportWidth = this.viewport.clientWidth;
    const viewportHeight = this.viewport.clientHeight;
    const scaledWidth = MAP_WIDTH * this.scale;
    const scaledHeight = MAP_HEIGHT * this.scale;

    const minX = Math.min(PAN_MARGIN, viewportWidth - scaledWidth - PAN_MARGIN);
    const maxX = PAN_MARGIN;
    const minY = Math.min(PAN_MARGIN, viewportHeight - scaledHeight - PAN_MARGIN);
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
      this.zoomLabel.textContent = `${Math.round(this.scale * 100)}%`;
    }
  }

  setCategory(categoryId) {
    if (!categoryId) {
      return;
    }

    this.activeCategoryId = categoryId;
    this.activeCritterId = null;
    this.pan = { ...DEFAULT_PAN };
    this.scale = 1;
    this.applyTransform();
    this.renderCategoryMap();
  }

  setActiveCritter(critterId) {
    this.activeCritterId = critterId || null;
    this.nodeButtons.forEach((button, id) => {
      const isActive = id === this.activeCritterId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  getAllCategoryIds() {
    const configured = (this.categories || []).map((category) => category.id);
    const discovered = this.critters
      .map((critter) => critter.category)
      .filter((categoryId) => Boolean(categoryId));
    return Array.from(new Set([...configured, ...discovered]));
  }

  buildPoint(x, y, level = 0) {
    return {
      x,
      y,
      centerX: x + NODE_WIDTH / 2,
      centerY: y + NODE_HEIGHT / 2,
      level,
    };
  }

  clampNodePosition(x, y) {
    const minX = NODE_BOUNDARY_PADDING;
    const maxX = MAP_WIDTH - NODE_WIDTH - NODE_BOUNDARY_PADDING;
    const minY = NODE_BOUNDARY_PADDING;
    const maxY = MAP_HEIGHT - NODE_HEIGHT - NODE_BOUNDARY_PADDING;
    return {
      x: Math.max(minX, Math.min(maxX, Math.round(x))),
      y: Math.max(minY, Math.min(maxY, Math.round(y))),
    };
  }

  ensureCategoryCustomPositions(categoryId) {
    if (!categoryId) {
      return new Map();
    }

    if (!this.customPositionsByCategory.has(categoryId)) {
      this.customPositionsByCategory.set(categoryId, new Map());
    }

    return this.customPositionsByCategory.get(categoryId);
  }

  updateNodePosition(critterId, x, y) {
    const existing = this.currentPositions.get(critterId);
    const level = existing?.level ?? 0;
    const nextPoint = this.buildPoint(x, y, level);
    this.currentPositions.set(critterId, nextPoint);

    const node = this.nodeButtons.get(critterId);
    if (node) {
      node.style.left = `${nextPoint.x}px`;
      node.style.top = `${nextPoint.y}px`;
    }

    if (this.activeCategoryId) {
      const categoryOverrides = this.ensureCategoryCustomPositions(this.activeCategoryId);
      categoryOverrides.set(critterId, { x: nextPoint.x, y: nextPoint.y });
    }

    this.updateLinkPaths();
  }

  updateLinkPaths() {
    this.linkRecords.forEach((record) => {
      const source = this.currentPositions.get(record.sourceId);
      const target = this.currentPositions.get(record.targetId);
      if (!source || !target) {
        return;
      }

      const startX = source.centerX;
      const startY = source.centerY + NODE_HEIGHT / 2 - 4;
      const endX = target.centerX;
      const endY = target.centerY - NODE_HEIGHT / 2 + 4;
      const controlOffset = Math.max(50, Math.abs(endY - startY) * 0.55);
      const pathData = `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`;
      record.path.setAttribute('d', pathData);
    });
  }

  bindNodeDrag(node, critterId) {
    let nodeDragState = null;
    let suppressNextClick = false;

    node.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) {
        return;
      }

      const point = this.currentPositions.get(critterId);
      if (!point) {
        return;
      }

      nodeDragState = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: point.x,
        startY: point.y,
        moved: false,
      };
      node.setPointerCapture(event.pointerId);
    });

    node.addEventListener('pointermove', (event) => {
      if (!nodeDragState || event.pointerId !== nodeDragState.pointerId) {
        return;
      }

      const dxClient = event.clientX - nodeDragState.startClientX;
      const dyClient = event.clientY - nodeDragState.startClientY;
      const travel = Math.hypot(dxClient, dyClient);

      if (!nodeDragState.moved && travel >= NODE_DRAG_THRESHOLD) {
        nodeDragState.moved = true;
        node.classList.add('is-dragging-node');
      }

      if (!nodeDragState.moved) {
        return;
      }

      const dx = dxClient / this.scale;
      const dy = dyClient / this.scale;
      const bounded = this.clampNodePosition(nodeDragState.startX + dx, nodeDragState.startY + dy);
      this.updateNodePosition(critterId, bounded.x, bounded.y);
      event.preventDefault();
      event.stopPropagation();
    });

    const onPointerFinish = (event) => {
      if (!nodeDragState || event.pointerId !== nodeDragState.pointerId) {
        return;
      }

      const moved = nodeDragState.moved;
      node.classList.remove('is-dragging-node');
      if (node.hasPointerCapture(event.pointerId)) {
        node.releasePointerCapture(event.pointerId);
      }
      nodeDragState = null;
      if (moved) {
        suppressNextClick = true;
        requestAnimationFrame(() => {
          suppressNextClick = false;
        });
        event.preventDefault();
        event.stopPropagation();
      }
    };

    node.addEventListener('pointerup', onPointerFinish);
    node.addEventListener('pointercancel', onPointerFinish);

    return () => suppressNextClick;
  }

  buildCategoryLayout(categoryId) {
    const categoryCritters = this.critters
      .filter((critter) => critter.category === categoryId)
      .slice()
      .sort((a, b) => {
        const unlockDiff = critterSortWeight(a) - critterSortWeight(b);
        if (unlockDiff !== 0) {
          return unlockDiff;
        }
        return a.name.localeCompare(b.name);
      });

    const namesById = new Map(this.critters.map((critter) => [critter.id, critter.name]));
    const positions = new Map();
    const lanes = new Map();

    const crittersByLane = new Map(RARITY_LANES.map((lane) => [lane.id, []]));
    categoryCritters.forEach((critter) => {
      const laneId = critter.rarity || 'common';
      if (!crittersByLane.has(laneId)) {
        crittersByLane.set(laneId, []);
      }
      crittersByLane.get(laneId).push(critter);
    });

    RARITY_LANES.forEach((lane, laneIndex) => {
      const laneTop = LANE_START_Y + laneIndex * LANE_HEIGHT;
      const laneCritters = (crittersByLane.get(lane.id) || []).slice();
      const levelRows = Array.from(new Set(laneCritters.map((critter) => getRequirementLevel(critter)))).sort(
        (left, right) => left - right
      );
      const rows = new Map(levelRows.map((level) => [level, []]));
      laneCritters.forEach((critter) => {
        const level = getRequirementLevel(critter);
        rows.get(level).push(critter);
      });

      const rowCount = Math.max(levelRows.length, 1);
      const usableHeight = LANE_HEIGHT - LANE_ROW_OFFSET - NODE_HEIGHT - LANE_BOTTOM_PADDING;
      const rowGap = rowCount > 1 ? usableHeight / (rowCount - 1) : 0;

      levelRows.forEach((level, rowIndex) => {
        const y = Math.round(laneTop + LANE_ROW_OFFSET + rowIndex * rowGap);
        const rowCritters = rows.get(level) || [];
        rowCritters.sort((left, right) => {
          const leftPrimary = getPrimaryRequirement(left)?.critterId || '';
          const rightPrimary = getPrimaryRequirement(right)?.critterId || '';
          if (leftPrimary !== rightPrimary) {
            return leftPrimary.localeCompare(rightPrimary);
          }
          return left.name.localeCompare(right.name);
        });

        const rowCountHorizontal = rowCritters.length;
        const usableWidth = MAP_WIDTH - LANE_X_PADDING * 2;
        const spacing = rowCountHorizontal > 0 ? usableWidth / (rowCountHorizontal + 1) : usableWidth;
        const canUseEvenSpacing = spacing >= NODE_WIDTH + MIN_NODE_GAP;
        const packedWidth = rowCountHorizontal * NODE_WIDTH + Math.max(0, rowCountHorizontal - 1) * MIN_NODE_GAP;
        const packedStartX = Math.round((MAP_WIDTH - packedWidth) * 0.5);

        rowCritters.forEach((critter, index) => {
          const x = canUseEvenSpacing
            ? Math.round(LANE_X_PADDING + spacing * (index + 1) - NODE_WIDTH / 2)
            : packedStartX + index * (NODE_WIDTH + MIN_NODE_GAP);

          positions.set(critter.id, this.buildPoint(x, y, level));
        });
      });

      lanes.set(lane.id, {
        laneTop,
        laneCritters,
      });
    });

    const categoryOverrides = this.customPositionsByCategory.get(categoryId);
    if (categoryOverrides) {
      categoryCritters.forEach((critter) => {
        const override = categoryOverrides.get(critter.id);
        if (!override) {
          return;
        }

        const existingPoint = positions.get(critter.id);
        const level = existingPoint?.level ?? getRequirementLevel(critter);
        const bounded = this.clampNodePosition(override.x, override.y);
        positions.set(critter.id, this.buildPoint(bounded.x, bounded.y, level));
      });
    }

    return {
      categoryCritters,
      namesById,
      positions,
      lanes,
    };
  }

  async copyLayoutSnapshot() {
    const categoryIds = this.getAllCategoryIds();
    const payload = {
      generatedAt: new Date().toISOString(),
      board: {
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        nodeWidth: NODE_WIDTH,
        nodeHeight: NODE_HEIGHT,
      },
      categories: {},
    };

    categoryIds.forEach((categoryId) => {
      const { categoryCritters, positions } = this.buildCategoryLayout(categoryId);
      const categoryLabel =
        this.categories.find((category) => category.id === categoryId)?.label || prettify(categoryId);

      payload.categories[categoryId] = {
        label: categoryLabel,
        critters: categoryCritters.map((critter) => {
          const point = positions.get(critter.id) || {};
          return {
            id: critter.id,
            name: critter.name,
            rarity: critter.rarity || 'common',
            level: getRequirementLevel(critter),
            x: point.x ?? 0,
            y: point.y ?? 0,
            requirements: getUnlockRequirements(critter),
          };
        }),
      };
    });

    const text = JSON.stringify(payload, null, 2);
    await this.copyTextToClipboard(text);
    return text;
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

  renderCategoryMap() {
    if (!this.nodesLayer || !this.lanesLayer || !this.linksLayer) {
      return;
    }
    const { categoryCritters, namesById, positions, lanes } = this.buildCategoryLayout(this.activeCategoryId);
    this.nodeButtons.clear();
    this.currentPositions = new Map(positions);
    this.linkRecords = [];
    this.linksLayer.innerHTML = '';
    this.lanesLayer.innerHTML = '';
    this.nodesLayer.innerHTML = '';

    RARITY_LANES.forEach((lane, laneIndex) => {
      const laneInfo = lanes.get(lane.id);
      const laneCritters = laneInfo?.laneCritters || [];
      const laneTop = laneInfo?.laneTop ?? LANE_START_Y + laneIndex * LANE_HEIGHT;

      const laneRow = document.createElement('div');
      laneRow.className = 'unlock-lane';
      laneRow.style.top = `${laneTop}px`;
      laneRow.style.height = `${LANE_HEIGHT - 14}px`;
      laneRow.innerHTML = `
        <span class="unlock-lane__name">${lane.label}</span>
        <span class="unlock-lane__status">${laneCritters.length ? `${laneCritters.length} critter${laneCritters.length === 1 ? '' : 's'}` : 'Awaiting Data Entry'}</span>
      `;
      this.lanesLayer.appendChild(laneRow);

      if (!laneCritters.length) {
        return;
      }
      laneCritters.forEach((critter) => {
        const point = positions.get(critter.id);
        if (!point) {
          return;
        }
        const unlockType = critter?.unlock?.type || 'pending';
        const node = document.createElement('button');
        node.type = 'button';
        node.className = `unlock-node unlock-node--${unlockType} unlock-node--${critter.rarity || 'common'}`;
        node.style.left = `${point.x}px`;
        node.style.top = `${point.y}px`;
        node.dataset.critterId = critter.id;
        node.setAttribute('aria-pressed', 'false');
        node.innerHTML = `
          <span class="unlock-node__name">${critter.name}</span>
          <span class="unlock-node__rarity">${prettify(critter.rarity || 'common')}</span>
          <span class="unlock-node__unlock">${shortUnlockLabel(critter, namesById)}</span>
        `;

        const shouldSuppressClick = this.bindNodeDrag(node, critter.id);
        node.addEventListener('click', () => {
          if (shouldSuppressClick()) {
            return;
          }
          const nextId = this.activeCritterId === critter.id ? null : critter.id;
          this.setActiveCritter(nextId);
          this.bus?.emit?.('critter:selected', nextId);
        });

        this.nodesLayer.appendChild(node);
        this.nodeButtons.set(critter.id, node);
      });
    });

    categoryCritters.forEach((critter) => {
      const requirements = getUnlockRequirements(critter);
      if (!requirements.length) {
        return;
      }

      requirements.forEach((requirement) => {
        if (!positions.has(requirement.critterId) || !positions.has(critter.id)) {
          return;
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'unlock-link');
        this.linksLayer.appendChild(path);
        this.linkRecords.push({
          path,
          sourceId: requirement.critterId,
          targetId: critter.id,
        });
      });
    });

    this.updateLinkPaths();

    this.setActiveCritter(null);
  }
}
