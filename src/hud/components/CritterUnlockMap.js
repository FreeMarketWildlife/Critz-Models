const MAP_WIDTH = 1440;
const MAP_HEIGHT = 1660;
const LANE_START_Y = 88;
const LANE_HEIGHT = 292;
const NODE_WIDTH = 176;
const NODE_HEIGHT = 84;
const LANE_ROW_OFFSET = 44;
const DEPTH_ROW_GAP = 108;
const MIN_NODE_GAP = 26;
const DEFAULT_PAN = { x: 38, y: 30 };
const PAN_MARGIN = 82;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.6;

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

const buildUnlockSummary = (critter, namesById) => {
  const unlock = critter?.unlock;
  if (!unlock) {
    return 'Awaiting Data Entry';
  }

  if (typeof unlock.text === 'string' && unlock.text.trim()) {
    return unlock.text.trim();
  }

  if (unlock.type === 'starter') {
    return 'Starter critter';
  }

  const requirements = getUnlockRequirements(critter);
  if (requirements.length) {
    const parts = requirements.map((requirement) => {
      const sourceName = namesById.get(requirement.critterId) || prettify(requirement.critterId);
      return `Level ${requirement.level} with ${sourceName}`;
    });
    return `Reach ${parts.join(' and ')}`;
  }

  return 'Awaiting Data Entry';
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
  constructor({ element, critters = [], categories = [], bus }) {
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
    this.categoryLabel = null;
    this.requirements = null;
    this.zoomLabel = null;

    this.activeCategoryId = null;
    this.activeCritterId = null;
    this.nodeButtons = new Map();

    this.pan = { ...DEFAULT_PAN };
    this.scale = 1;
    this.dragState = null;
  }

  render(defaultCategoryId) {
    if (!this.element) {
      return;
    }

    this.element.innerHTML = '';
    this.root = document.createElement('div');
    this.root.className = 'unlock-map';
    this.root.innerHTML = `
      <div class="unlock-map__meta">
        <p class="unlock-map__category" data-role="map-category"></p>
        <p class="unlock-map__hint">Drag or scroll to pan. Pinch trackpad to zoom. Click a critter box to preview details.</p>
        <span class="unlock-map__zoom" data-role="map-zoom">100%</span>
      </div>
      <div class="unlock-map__viewport" data-role="map-viewport">
        <div class="unlock-map__board" data-role="map-board">
          <svg class="unlock-map__links" data-role="map-links" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" preserveAspectRatio="xMinYMin meet"></svg>
          <div class="unlock-map__lanes" data-role="map-lanes"></div>
          <div class="unlock-map__nodes" data-role="map-nodes"></div>
        </div>
      </div>
      <div class="unlock-map__requirements" data-role="map-requirements"></div>
    `;

    this.element.appendChild(this.root);
    this.viewport = this.root.querySelector('[data-role="map-viewport"]');
    this.board = this.root.querySelector('[data-role="map-board"]');
    this.linksLayer = this.root.querySelector('[data-role="map-links"]');
    this.lanesLayer = this.root.querySelector('[data-role="map-lanes"]');
    this.nodesLayer = this.root.querySelector('[data-role="map-nodes"]');
    this.categoryLabel = this.root.querySelector('[data-role="map-category"]');
    this.requirements = this.root.querySelector('[data-role="map-requirements"]');
    this.zoomLabel = this.root.querySelector('[data-role="map-zoom"]');

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

      this.dragState = {
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
      if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
        return;
      }

      const dx = event.clientX - this.dragState.startX;
      const dy = event.clientY - this.dragState.startY;
      this.pan.x = this.dragState.originX + dx;
      this.pan.y = this.dragState.originY + dy;
      this.applyTransform();
    };

    const onPointerUp = (event) => {
      if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
        return;
      }

      this.viewport.releasePointerCapture(event.pointerId);
      this.dragState = null;
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

  renderCategoryMap() {
    if (!this.nodesLayer || !this.lanesLayer || !this.linksLayer || !this.requirements) {
      return;
    }

    const categoryCritters = this.critters
      .filter((critter) => critter.category === this.activeCategoryId)
      .slice()
      .sort((a, b) => {
        const unlockDiff = critterSortWeight(a) - critterSortWeight(b);
        if (unlockDiff !== 0) {
          return unlockDiff;
        }
        return a.name.localeCompare(b.name);
      });

    const namesById = new Map(this.critters.map((critter) => [critter.id, critter.name]));

    this.nodeButtons.clear();
    this.linksLayer.innerHTML = '';
    this.lanesLayer.innerHTML = '';
    this.nodesLayer.innerHTML = '';

    const crittersByLane = new Map(RARITY_LANES.map((lane) => [lane.id, []]));
    categoryCritters.forEach((critter) => {
      const laneId = critter.rarity || 'common';
      if (!crittersByLane.has(laneId)) {
        crittersByLane.set(laneId, []);
      }
      crittersByLane.get(laneId).push(critter);
    });

    const nodePositions = new Map();
    const categoryIds = new Set(categoryCritters.map((critter) => critter.id));
    const byId = new Map(categoryCritters.map((critter) => [critter.id, critter]));

    const resolveRootId = (critter) => {
      let cursor = critter;
      const seen = new Set([critter.id]);
      let primary = getPrimaryRequirement(cursor);
      while (primary?.critterId && categoryIds.has(primary.critterId)) {
        if (seen.has(primary.critterId)) {
          break;
        }
        seen.add(primary.critterId);
        const parent = byId.get(primary.critterId);
        if (!parent) {
          break;
        }
        cursor = parent;
        primary = getPrimaryRequirement(cursor);
      }
      return cursor?.id || critter.id;
    };

    const rootIds = Array.from(new Set(categoryCritters.map((critter) => resolveRootId(critter))));
    const rootXById = new Map();
    const rootSpacing = rootIds.length ? MAP_WIDTH / (rootIds.length + 1) : MAP_WIDTH / 2;
    rootIds.forEach((rootId, index) => {
      rootXById.set(rootId, Math.round(rootSpacing * (index + 1) - NODE_WIDTH / 2));
    });

    const laneTopById = new Map(
      RARITY_LANES.map((lane, laneIndex) => [lane.id, LANE_START_Y + laneIndex * LANE_HEIGHT])
    );

    const depthById = new Map();
    const computeDepth = (critter) => {
      if (!critter) return 0;
      if (depthById.has(critter.id)) {
        return depthById.get(critter.id);
      }
      const sourceId = critter?.unlock?.critterId;
      const source = sourceId ? byId.get(sourceId) : null;
      const depth = source ? computeDepth(source) + 1 : 0;
      depthById.set(critter.id, depth);
      return depth;
    };
    categoryCritters.forEach((critter) => computeDepth(critter));

    RARITY_LANES.forEach((lane, laneIndex) => {
      const laneCritters = (crittersByLane.get(lane.id) || []).slice();
      const laneTop = laneTopById.get(lane.id);

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

      const occupiedX = [];
      laneCritters.forEach((critter, index) => {
        const rootId = resolveRootId(critter);
        const baseX = rootXById.get(rootId) ?? Math.round(MAP_WIDTH * 0.5 - NODE_WIDTH / 2);
        const depth = depthById.get(critter.id) ?? 0;

        const sameRootSameDepth = laneCritters.filter(
          (entry) => resolveRootId(entry) === rootId && (depthById.get(entry.id) ?? 0) === depth
        );
        const branchIndex = sameRootSameDepth.findIndex((entry) => entry.id === critter.id);
        const siblingOffset =
          sameRootSameDepth.length > 1
            ? (branchIndex - (sameRootSameDepth.length - 1) / 2) * (NODE_WIDTH * 0.72)
            : 0;

        let x = Math.round(baseX + siblingOffset);
        let attempts = 0;
        while (occupiedX.some((value) => Math.abs(value - x) < NODE_WIDTH + MIN_NODE_GAP) && attempts < 20) {
          x += NODE_WIDTH * 0.58;
          attempts += 1;
        }
        occupiedX.push(x);
        x = Math.max(18, Math.min(MAP_WIDTH - NODE_WIDTH - 18, x));

        const primaryRequirement = getPrimaryRequirement(critter);
        const source = primaryRequirement ? byId.get(primaryRequirement.critterId) : null;
        const sourceInSameLane = source && (source.rarity || 'common') === lane.id;
        const y = Math.round(
          laneTop + LANE_ROW_OFFSET + (sourceInSameLane ? Math.max(1, depth) : depth) * DEPTH_ROW_GAP
        );

        nodePositions.set(critter.id, {
          x,
          y,
          centerX: x + NODE_WIDTH / 2,
          centerY: y + NODE_HEIGHT / 2,
        });

        const unlockType = critter?.unlock?.type || 'pending';
        const node = document.createElement('button');
        node.type = 'button';
        node.className = `unlock-node unlock-node--${unlockType} unlock-node--${critter.rarity || 'common'}`;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.dataset.critterId = critter.id;
        node.setAttribute('aria-pressed', 'false');
        node.innerHTML = `
          <span class="unlock-node__name">${critter.name}</span>
          <span class="unlock-node__rarity">${prettify(critter.rarity || 'common')}</span>
          <span class="unlock-node__unlock">${shortUnlockLabel(critter, namesById)}</span>
        `;

        node.addEventListener('click', () => {
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
        const source = nodePositions.get(requirement.critterId);
        const target = nodePositions.get(critter.id);
        if (!source || !target) {
          return;
        }

        const startX = source.centerX;
        const startY = source.centerY + NODE_HEIGHT / 2 - 4;
        const endX = target.centerX;
        const endY = target.centerY - NODE_HEIGHT / 2 + 4;
        const controlOffset = Math.max(50, Math.abs(endY - startY) * 0.55);
        const pathData = `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('class', 'unlock-link');
        this.linksLayer.appendChild(path);
      });
    });

    const categoryLabel = this.categories.find((category) => category.id === this.activeCategoryId)?.label
      || prettify(this.activeCategoryId);
    this.categoryLabel.textContent = `${categoryLabel} unlock network`;

    const requirementItems = categoryCritters.map((critter) => {
      const summary = buildUnlockSummary(critter, namesById);
      return `<li><strong>${critter.name}:</strong> ${summary}</li>`;
    });

    this.requirements.innerHTML = requirementItems.length
      ? `<ul class="unlock-map__rules">${requirementItems.join('')}</ul>`
      : '<p class="unlock-map__empty">Awaiting Data Entry</p>';

    this.setActiveCritter(null);
  }
}
