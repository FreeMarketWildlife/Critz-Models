import { weaponsMapDefaultLayout } from '../../data/weaponsMapDefaultLayout.js';

const MAP_WIDTH = 1700;
const DEFAULT_PAN = { x: 38, y: 30 };
const PAN_MARGIN = 82;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2.6;
const DEFAULT_VISUAL_SCALE = 0.66;
const DEFAULT_FOCUS_GROUP_ID = 'military';
const LANE_START_Y = 88;
const LANE_GAP = 28;
const LANE_INNER_TOP = 58;
const NODE_WIDTH = 176;
const NODE_HEIGHT = 84;
const GRID_COLUMNS_PER_GROUP = 5;
const GRID_ROWS = 20;
const NODE_DRAG_THRESHOLD = 6;
const GROUP_SIDE_PADDING = 34;
const LANE_BOTTOM_PADDING = 48;
const BOARD_BOTTOM_PADDING = 88;

// Match the critter map cell geometry so the grids feel like the same design system.
const STANDARD_GRID_CELL_WIDTH = (MAP_WIDTH - 34 * 2) / 9;
const STANDARD_GRID_CELL_HEIGHT = (760 - 58 - 48) / 7;

const prettify = (value = '') =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export class WeaponUnlockMap {
  constructor({ element, weapons = [], categories = [], critters = [], bus, zoomElement = null }) {
    this.element = element;
    this.weapons = weapons;
    this.categories = categories;
    this.weaponById = new Map((weapons || []).map((weapon) => [weapon.id, weapon]));
    this.critterById = new Map((critters || []).map((critter) => [critter.id, critter]));
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
    this.activeAlienNodeId = null;
    this.nodeButtons = new Map();
    this.alienNodeButtons = new Map();
    this.currentPositions = new Map();
    this.customPositionsByCategory = new Map();
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

    this.board.style.width = `${this.getBoardWidth()}px`;
    this.board.style.height = `${this.getBoardHeight()}px`;
    if (this.linksLayer) {
      this.linksLayer.setAttribute('viewBox', `0 0 ${this.getBoardWidth()} ${this.getBoardHeight()}`);
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
    const boardWidth = this.getBoardWidth() * this.scale;
    const boardHeight = this.getBoardHeight() * this.scale;

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
    this.activeAlienNodeId = null;
    this.pan = { ...DEFAULT_PAN };
    this.renderCategoryMap();
    this.resetCategoryView();
  }

  setActiveWeapon(weaponId) {
    this.activeWeaponId = weaponId || null;
    this.activeAlienNodeId = null;
    this.applyActiveNodeState();
  }

  setActiveAlienNode(alienNodeId) {
    this.activeAlienNodeId = alienNodeId || null;
    this.activeWeaponId = null;
    this.applyActiveNodeState();
  }

  applyActiveNodeState() {
    this.nodeButtons.forEach((button, id) => {
      const isActive = id === this.activeWeaponId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    this.alienNodeButtons.forEach((button, id) => {
      const isActive = id === this.activeAlienNodeId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  isAlienRequirement(requirement) {
    return Boolean(
      requirement &&
        (requirement.type === 'alien-node' || (requirement.critterId && !requirement.weaponId))
    );
  }

  getAlienNodeKey(groupId, requirement = {}) {
    const sourceType = requirement.weaponId ? 'weapon' : requirement.critterId ? 'critter' : 'external';
    const sourceId = String(requirement.weaponId || requirement.critterId || 'unknown');
    const level = Number.isFinite(Number(requirement.level)) ? Number(requirement.level) : 0;
    return `alien:${sourceType}:${sourceId}:level:${level}:group:${String(groupId || 'default')}`;
  }

  getAlienNodeLabel(requirement = {}) {
    const weaponId = requirement.weaponId || '';
    const weapon = this.weaponById.get(weaponId) || null;
    if (weaponId) {
      return weapon?.name || requirement.label || prettify(weaponId || 'Alien Node');
    }

    const critterId = requirement.critterId || '';
    const critter = this.critterById.get(critterId) || null;
    return critter?.name || requirement.label || prettify(critterId || 'Alien Node');
  }

  getAlienNodeMeta(requirement = {}) {
    const weaponId = requirement.weaponId || '';
    const weapon = this.weaponById.get(weaponId) || null;
    if (weaponId) {
      const categoryLabel = weapon?.category ? `${prettify(weapon.category)} Weapon` : 'External Weapon';
      const level = Number.isFinite(Number(requirement.level)) ? `Lv. ${Number(requirement.level)}` : null;
      return [categoryLabel, level].filter(Boolean).join(' · ');
    }

    const critterId = requirement.critterId || '';
    const critter = this.critterById.get(critterId) || null;
    const categoryLabel = critter?.category ? prettify(critter.category) : 'External Requirement';
    const level = Number.isFinite(Number(requirement.level)) ? `Lv. ${Number(requirement.level)}` : null;
    return [categoryLabel, level].filter(Boolean).join(' · ');
  }

  buildAlienNodeMap(categoryId, categoryLayout = null, overrides = null) {
    const resolvedCategoryLayout = categoryLayout || this.getCategoryLayoutById(categoryId);
    const alienNodes = new Map();
    const groups = this.getCategoryGroups(categoryId, resolvedCategoryLayout);
    const weapons = Array.isArray(resolvedCategoryLayout?.weapons) ? resolvedCategoryLayout.weapons : [];
    const shouldUseStoredLayout = this.hasStoredBoardFootprint();

    groups.forEach((group) => {
      const laneWeapons = weapons
        .filter((entry) => entry.group === group.id)
        .sort((a, b) => {
          const deltaY = (Number(a.y) || 0) - (Number(b.y) || 0);
          if (deltaY !== 0) {
            return deltaY;
          }
          return (Number(a.x) || 0) - (Number(b.x) || 0);
        });

      const groupAlienEntries = [];
      laneWeapons.forEach((entry) => {
        const requirements = Array.isArray(entry.requirements) ? entry.requirements : [];
        requirements.forEach((requirement, requirementIndex) => {
          if (!this.isAlienRequirement(requirement)) {
            return;
          }

          const key = this.getAlienNodeKey(group.id, requirement);
          const existing = alienNodes.get(key);
          if (existing) {
            existing.targets.push({ weaponId: entry.id, requirementIndex });
            return;
          }

          const record = {
            key,
            groupId: group.id,
            weaponId: requirement.weaponId || null,
            critterId: requirement.critterId,
            level: Number.isFinite(Number(requirement.level)) ? Number(requirement.level) : null,
            label: this.getAlienNodeLabel(requirement),
            meta: this.getAlienNodeMeta(requirement),
            sourceX: Number.isFinite(Number(requirement.x)) ? Number(requirement.x) : null,
            sourceY: Number.isFinite(Number(requirement.y)) ? Number(requirement.y) : null,
            targets: [{ weaponId: entry.id, requirementIndex }],
          };
          alienNodes.set(key, record);
          groupAlienEntries.push(record);
        });
      });

      const alienRowEnd = Math.max(
        0,
        Math.min(GRID_ROWS - 1, Math.floor(GRID_ROWS * 0.35) - 1)
      );
      const plannedCells = this.buildDistributedGridCells(groupAlienEntries.length, {
        rowStart: 0,
        rowEnd: alienRowEnd,
      });
      groupAlienEntries.forEach((record, recordIndex) => {
        const plannedCell =
          plannedCells[recordIndex] || {
            row: Math.min(GRID_ROWS - 1, recordIndex),
            column: recordIndex % GRID_COLUMNS_PER_GROUP,
          };
        const fallbackPoint = this.getGridCellPosition(
          categoryId,
          group.id,
          plannedCell.row,
          plannedCell.column,
          resolvedCategoryLayout
        );
        const override = overrides?.get(record.key) || null;
        const rawX =
          override?.x ??
          (shouldUseStoredLayout && Number.isFinite(record.sourceX) ? record.sourceX : fallbackPoint.x);
        const rawY =
          override?.y ??
          (shouldUseStoredLayout && Number.isFinite(record.sourceY) ? record.sourceY : fallbackPoint.y);
        const snapped = this.snapNodeToGrid(rawX, rawY, categoryId, group.id, resolvedCategoryLayout);
        record.point = this.buildPoint(snapped.x, snapped.y, group.id);
      });
    });

    return alienNodes;
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
    const payload = JSON.parse(JSON.stringify(this.layoutSource || {}));
    payload.board = {
      ...(payload.board || {}),
      width: this.getBoardWidth(),
      height: this.getBoardHeight(),
      nodeWidth: NODE_WIDTH,
      nodeHeight: NODE_HEIGHT,
    };
    Object.entries(payload?.categories || {}).forEach(([categoryId, categoryLayout]) => {
      const overrides = this.customPositionsByCategory.get(categoryId);
      if (!Array.isArray(categoryLayout?.weapons)) {
        return;
      }

      const positionMap = this.buildCategoryPositionMap(categoryId, categoryLayout, overrides);
      const alienNodeMap = this.buildAlienNodeMap(categoryId, categoryLayout, overrides);
      categoryLayout.weapons = categoryLayout.weapons.map((entry) => {
        const point = positionMap.get(entry.id);
        if (!point) {
          return entry;
        }

        const requirements = Array.isArray(entry.requirements)
          ? entry.requirements.map((requirement) => {
              if (!this.isAlienRequirement(requirement)) {
                return requirement;
              }

              const alienNode = alienNodeMap.get(this.getAlienNodeKey(entry.group, requirement));
              if (!alienNode) {
                return requirement;
              }

              return {
                ...requirement,
                type: 'alien-node',
                x: alienNode.point.x,
                y: alienNode.point.y,
              };
            })
          : [];

        return {
          ...entry,
          x: point.x,
          y: point.y,
          requirements,
        };
      });
    });

    const text = `export const weaponsMapDefaultLayout = ${JSON.stringify(payload, null, 2)};\n`;
    return this.copyTextToClipboard(text).then(() => text);
  }

  getCategoryLayout() {
    return this.getCategoryLayoutById(this.activeCategoryId);
  }

  getCategoryLayoutById(categoryId) {
    return this.layoutSource?.categories?.[categoryId] || null;
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
    const boardWidth = this.getBoardWidth();
    const boardHeight = this.getBoardHeight();
    const viewportWidth = this.viewport.clientWidth || 0;
    const viewportHeight = this.viewport.clientHeight || 0;
    const targetX = metric?.centerX || boardWidth / 2;
    const targetY = metric?.centerY || boardHeight / 2;

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
        const source = this.isAlienRequirement(requirement)
          ? nodePositions.get(this.getAlienNodeKey(entry.group, requirement))
          : nodePositions.get(requirement.weaponId);
        if (!source) {
          return;
        }

        const startX = source.centerX;
        const startY = source.y + NODE_HEIGHT - 4;
        const endX = target.centerX;
        const endY = target.y + 4;
        const deltaY = endY - startY;
        const pathData =
          deltaY >= 0
            ? [
                `M ${startX} ${startY}`,
                `C ${startX} ${startY + Math.max(90, deltaY * 0.45)},`,
                `${endX} ${endY - Math.max(90, deltaY * 0.45)},`,
                `${endX} ${endY}`,
              ].join(' ')
            : [
                `M ${startX} ${startY}`,
                `C ${startX} ${startY + Math.max(120, Math.abs(deltaY) * 0.65)},`,
                `${endX} ${endY + Math.max(120, Math.abs(deltaY) * 0.65)},`,
                `${endX} ${endY}`,
              ].join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'unlock-link');
        path.setAttribute('d', pathData);
        this.linksLayer.appendChild(path);
      });
    });
  }

  getBoardWidth() {
    const groupCount = this.getMaxGroupCount();
    const groupWidth = this.getGroupWidthForCategory();
    return Math.round(
      GROUP_SIDE_PADDING * 2 + groupCount * groupWidth + Math.max(0, groupCount - 1) * LANE_GAP
    );
  }

  getBoardHeight() {
    return Math.round(LANE_START_Y + this.getLaneHeightForCategory() + BOARD_BOTTOM_PADDING);
  }

  getMaxGroupCount() {
    const categories = Object.values(this.layoutSource?.categories || {});
    const maxCount = categories.reduce((largest, categoryLayout) => {
      const count =
        Array.isArray(categoryLayout?.progressionGroups) && categoryLayout.progressionGroups.length
          ? categoryLayout.progressionGroups.length
          : 1;
      return Math.max(largest, count);
    }, 0);
    return Math.max(1, maxCount);
  }

  hasStoredBoardFootprint() {
    const storedWidth = Number(this.layoutSource?.board?.width);
    const storedHeight = Number(this.layoutSource?.board?.height);
    return (
      Number.isFinite(storedWidth) &&
      Number.isFinite(storedHeight) &&
      Math.abs(storedWidth - this.getBoardWidth()) <= 2 &&
      Math.abs(storedHeight - this.getBoardHeight()) <= 2
    );
  }

  buildPoint(x, y, groupId = null) {
    return {
      x,
      y,
      centerX: x + NODE_WIDTH / 2,
      centerY: y + NODE_HEIGHT / 2,
      groupId,
    };
  }

  getCategoryGroups(categoryId, categoryLayout = null) {
    const resolvedCategoryLayout = categoryLayout || this.getCategoryLayoutById(categoryId);
    const groups = Array.isArray(resolvedCategoryLayout?.progressionGroups)
      ? resolvedCategoryLayout.progressionGroups
      : [];
    if (groups.length) {
      return groups;
    }
    return [{ id: categoryId || 'default', label: prettify(categoryId || 'default') }];
  }

  getLaneHeightForCategory(categoryId, categoryLayout = null) {
    return Math.round(LANE_INNER_TOP + STANDARD_GRID_CELL_HEIGHT * GRID_ROWS + LANE_BOTTOM_PADDING);
  }

  getGroupWidthForCategory(categoryId, categoryLayout = null) {
    return Math.round(STANDARD_GRID_CELL_WIDTH * GRID_COLUMNS_PER_GROUP);
  }

  buildSlotIndices(itemCount, slotCount) {
    if (itemCount <= 0 || slotCount <= 0) {
      return [];
    }

    if (itemCount === 1) {
      return [Math.floor((slotCount - 1) * 0.5)];
    }

    if (itemCount >= slotCount) {
      return Array.from({ length: itemCount }, (_, index) =>
        Math.min(slotCount - 1, Math.floor((index * slotCount) / itemCount))
      );
    }

    const used = new Set();
    const indices = [];
    const step = (slotCount - 1) / (itemCount - 1);
    for (let index = 0; index < itemCount; index += 1) {
      const target = Math.round(index * step);
      let candidate = target;

      if (used.has(candidate)) {
        let offset = 1;
        while (offset < slotCount) {
          const right = target + offset;
          const left = target - offset;
          if (right < slotCount && !used.has(right)) {
            candidate = right;
            break;
          }
          if (left >= 0 && !used.has(left)) {
            candidate = left;
            break;
          }
          offset += 1;
        }
      }

      used.add(candidate);
      indices.push(candidate);
    }

    return indices;
  }

  buildDistributedGridCells(itemCount, { rowStart = 0, rowEnd = GRID_ROWS - 1 } = {}) {
    if (itemCount <= 0) {
      return [];
    }

    const availableRows = Math.max(1, rowEnd - rowStart + 1);
    const rowCount = Math.max(
      1,
      Math.min(availableRows, Math.ceil(itemCount / GRID_COLUMNS_PER_GROUP))
    );
    const rowSlots = this.buildSlotIndices(rowCount, availableRows).map((row) => rowStart + row);
    const cells = [];
    let remaining = itemCount;

    rowSlots.forEach((row, rowIndex) => {
      if (remaining <= 0) {
        return;
      }

      const rowsLeft = rowSlots.length - rowIndex;
      const rowItemCount = Math.min(
        GRID_COLUMNS_PER_GROUP,
        Math.max(1, Math.ceil(remaining / rowsLeft))
      );
      const columnSlots = this.buildSlotIndices(rowItemCount, GRID_COLUMNS_PER_GROUP);
      columnSlots.forEach((column) => {
        cells.push({ row, column });
      });
      remaining -= rowItemCount;
    });

    return cells;
  }

  getGroupIndexById(categoryId, groupId, categoryLayout = null) {
    const groups = this.getCategoryGroups(categoryId, categoryLayout);
    const index = groups.findIndex((group) => group.id === groupId);
    return index >= 0 ? index : 0;
  }

  getGroupGridMetrics(categoryId, groupId, categoryLayout = null) {
    const laneHeight = this.getLaneHeightForCategory(categoryId, categoryLayout);
    const laneWidth = this.getGroupWidthForCategory(categoryId, categoryLayout);
    const laneIndex = this.getGroupIndexById(categoryId, groupId, categoryLayout);
    const groups = this.getCategoryGroups(categoryId, categoryLayout);
    const totalGridWidth =
      groups.length * laneWidth + Math.max(0, groups.length - 1) * LANE_GAP;
    const startLeft = Math.max(
      GROUP_SIDE_PADDING,
      (this.getBoardWidth() - totalGridWidth) / 2
    );
    const laneTop = LANE_START_Y;
    const laneLeft = startLeft + laneIndex * (laneWidth + LANE_GAP);
    const gridTop = laneTop + LANE_INNER_TOP;

    return {
      laneLeft,
      laneTop,
      laneWidth,
      laneHeight,
      gridLeft: laneLeft,
      gridTop,
      gridWidth: laneWidth,
      gridHeight: STANDARD_GRID_CELL_HEIGHT * GRID_ROWS,
      cellWidth: laneWidth / GRID_COLUMNS_PER_GROUP,
      cellHeight: STANDARD_GRID_CELL_HEIGHT,
    };
  }

  getGridCellPosition(categoryId, groupId, row, column, categoryLayout = null) {
    const metrics = this.getGroupGridMetrics(categoryId, groupId, categoryLayout);
    const snappedColumn = Math.max(0, Math.min(GRID_COLUMNS_PER_GROUP - 1, column));
    const snappedRow = Math.max(0, Math.min(GRID_ROWS - 1, row));
    const x = Math.round(
      metrics.gridLeft + snappedColumn * metrics.cellWidth + (metrics.cellWidth - NODE_WIDTH) * 0.5
    );
    const y = Math.round(
      metrics.gridTop + snappedRow * metrics.cellHeight + (metrics.cellHeight - NODE_HEIGHT) * 0.5
    );
    return { x, y, row: snappedRow, column: snappedColumn };
  }

  snapNodeToGrid(x, y, categoryId, groupId, categoryLayout = null) {
    const metrics = this.getGroupGridMetrics(categoryId, groupId, categoryLayout);
    const centerX = Number(x) + NODE_WIDTH * 0.5;
    const centerY = Number(y) + NODE_HEIGHT * 0.5;
    const column = Math.round(
      (centerX - metrics.gridLeft - metrics.cellWidth * 0.5) / metrics.cellWidth
    );
    const row = Math.round(
      (centerY - metrics.gridTop - metrics.cellHeight * 0.5) / metrics.cellHeight
    );
    return this.getGridCellPosition(categoryId, groupId, row, column, categoryLayout);
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

  getResolvedNodePosition(categoryId, entry, groupId, fallbackX, fallbackY, categoryLayout = null) {
    const overrides = this.customPositionsByCategory.get(categoryId);
    const override = overrides?.get(entry.id) || null;
    const shouldUseStoredLayout = this.hasStoredBoardFootprint();
    const rawX =
      override?.x ??
      (shouldUseStoredLayout && Number.isFinite(Number(entry?.x)) ? Number(entry.x) : fallbackX);
    const rawY =
      override?.y ??
      (shouldUseStoredLayout && Number.isFinite(Number(entry?.y)) ? Number(entry.y) : fallbackY);
    const snapped = this.snapNodeToGrid(rawX, rawY, categoryId, groupId, categoryLayout);
    return this.buildPoint(snapped.x, snapped.y, groupId);
  }

  buildCategoryPositionMap(categoryId, categoryLayout = null, overrides = null) {
    const resolvedCategoryLayout = categoryLayout || this.getCategoryLayoutById(categoryId);
    const positionMap = new Map();
    const groups = this.getCategoryGroups(categoryId, resolvedCategoryLayout);
    const weapons = Array.isArray(resolvedCategoryLayout?.weapons) ? resolvedCategoryLayout.weapons : [];
    const shouldUseStoredLayout = this.hasStoredBoardFootprint();

    groups.forEach((group) => {
      const laneWeapons = weapons
        .filter((entry) => entry.group === group.id)
        .sort((a, b) => {
          const deltaY = (Number(a.y) || 0) - (Number(b.y) || 0);
          if (deltaY !== 0) {
            return deltaY;
          }
          return (Number(a.x) || 0) - (Number(b.x) || 0);
        });
      const plannedCells = this.buildDistributedGridCells(laneWeapons.length);

      laneWeapons.forEach((entry, weaponIndex) => {
        const plannedCell =
          plannedCells[weaponIndex] || {
            row: Math.min(GRID_ROWS - 1, weaponIndex),
            column: weaponIndex % GRID_COLUMNS_PER_GROUP,
          };
        const fallbackPoint = this.getGridCellPosition(
          categoryId,
          group.id,
          plannedCell.row,
          plannedCell.column,
          resolvedCategoryLayout
        );
        const override = overrides?.get(entry.id) || null;
        const rawX =
          override?.x ??
          (shouldUseStoredLayout && Number.isFinite(Number(entry?.x)) ? Number(entry.x) : fallbackPoint.x);
        const rawY =
          override?.y ??
          (shouldUseStoredLayout && Number.isFinite(Number(entry?.y)) ? Number(entry.y) : fallbackPoint.y);
        const snapped = this.snapNodeToGrid(rawX, rawY, categoryId, group.id, resolvedCategoryLayout);
        positionMap.set(entry.id, this.buildPoint(snapped.x, snapped.y, group.id));
      });
    });

    return positionMap;
  }

  updateNodePosition(nodeId, x, y, groupId = null) {
    const existing = this.currentPositions.get(nodeId);
    const resolvedGroupId = groupId || existing?.groupId || null;
    if (!this.activeCategoryId || !resolvedGroupId) {
      return;
    }

    const snapped = this.snapNodeToGrid(x, y, this.activeCategoryId, resolvedGroupId);
    const nextPoint = this.buildPoint(snapped.x, snapped.y, resolvedGroupId);
    this.currentPositions.set(nodeId, nextPoint);

    const node = this.nodeButtons.get(nodeId) || this.alienNodeButtons.get(nodeId);
    if (node) {
      node.style.left = `${nextPoint.x}px`;
      node.style.top = `${nextPoint.y}px`;
    }

    if (this.activeCategoryId) {
      const overrides = this.ensureCategoryCustomPositions(this.activeCategoryId);
      overrides.set(nodeId, { x: nextPoint.x, y: nextPoint.y });
    }

    this.renderRequirementLinks(this.currentPositions);
  }

  bindNodeDrag(node, weaponId, groupId) {
    let nodeDragState = null;
    let suppressNextClick = false;

    node.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) {
        return;
      }

      const point = this.currentPositions.get(weaponId);
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
      this.updateNodePosition(weaponId, nodeDragState.startX + dx, nodeDragState.startY + dy, groupId);
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

  renderCategoryMap() {
    if (!this.lanesLayer || !this.nodesLayer || !this.linksLayer) {
      return;
    }

    this.linksLayer.innerHTML = '';
    this.lanesLayer.innerHTML = '';
    this.nodesLayer.innerHTML = '';
    this.nodeButtons.clear();
    this.alienNodeButtons.clear();
    this.currentPositions.clear();
    this.groupMetrics.clear();

    const categoryLayout = this.getCategoryLayout();
    if (!categoryLayout) {
      return;
    }

    const groups = this.getCategoryGroups(this.activeCategoryId, categoryLayout);
    const boardHeight = this.getBoardHeight();
    const laneHeight = this.getLaneHeightForCategory(this.activeCategoryId, categoryLayout);
    const positionMap = this.buildCategoryPositionMap(
      this.activeCategoryId,
      categoryLayout,
      this.customPositionsByCategory.get(this.activeCategoryId)
    );
    const alienNodeMap = this.buildAlienNodeMap(
      this.activeCategoryId,
      categoryLayout,
      this.customPositionsByCategory.get(this.activeCategoryId)
    );

    groups.forEach((group) => {
      const laneWeapons = this.getWeaponsForCategory()
        .filter((entry) => entry.group === group.id)
        .sort((a, b) => {
          const deltaY = (Number(a.y) || 0) - (Number(b.y) || 0);
          if (deltaY !== 0) {
            return deltaY;
          }
          return (Number(a.x) || 0) - (Number(b.x) || 0);
        });
      const laneCells = this.buildDistributedGridCells(laneWeapons.length);
      const groupGridMetrics = this.getGroupGridMetrics(this.activeCategoryId, group.id, categoryLayout);
      const laneTop = groupGridMetrics.laneTop;
      this.groupMetrics.set(group.id, {
        left: groupGridMetrics.laneLeft,
        width: groupGridMetrics.laneWidth,
        top: laneTop,
        height: laneHeight,
        centerX: groupGridMetrics.laneLeft + groupGridMetrics.laneWidth / 2,
        centerY: laneTop + laneHeight / 2,
      });

      const lane = document.createElement('div');
      lane.className = 'unlock-lane unlock-lane--weapon';
      lane.style.left = `${groupGridMetrics.laneLeft}px`;
      lane.style.right = 'auto';
      lane.style.width = `${groupGridMetrics.laneWidth}px`;
      lane.style.top = `${laneTop}px`;
      lane.style.height = `${laneHeight}px`;
      lane.style.setProperty('--grid-cols', String(GRID_COLUMNS_PER_GROUP));
      lane.style.setProperty('--grid-rows', String(GRID_ROWS));
      lane.innerHTML = `
        <span class="unlock-lane__name">${group.label || prettify(group.id)}</span>
        <span class="unlock-lane__status">${
          laneWeapons.length ? `${laneWeapons.length} weapon${laneWeapons.length === 1 ? '' : 's'}` : 'Awaiting Data Entry'
        }</span>
      `;
      this.lanesLayer.appendChild(lane);

      const alienNodesForGroup = Array.from(alienNodeMap.values()).filter((record) => record.groupId === group.id);
      alienNodesForGroup.forEach((record) => {
        const node = document.createElement('button');
        node.type = 'button';
        node.className = 'unlock-node unlock-node--weapon unlock-node--alien';
        node.style.left = `${record.point.x}px`;
        node.style.top = `${record.point.y}px`;
        node.dataset.alienNodeId = record.key;
        node.setAttribute('aria-pressed', 'false');
        node.innerHTML = `
          <span class="unlock-node__name">${record.label}</span>
          <span class="unlock-node__meta">${record.meta || 'Alien Node'}</span>
        `;
        this.currentPositions.set(record.key, record.point);

        const shouldSuppressClick = this.bindNodeDrag(node, record.key, group.id);
        node.addEventListener('click', () => {
          if (shouldSuppressClick()) {
            return;
          }
          const nextId = this.activeAlienNodeId === record.key ? null : record.key;
          this.setActiveAlienNode(nextId);
          this.bus?.emit?.(
            'weapon-map:alien-selected',
            nextId
              ? {
                  alienNodeId: record.key,
                  weaponId: record.weaponId || null,
                  critterId: record.critterId,
                  level: record.level,
                  category: record.weaponId
                    ? this.weaponById.get(record.weaponId)?.category || null
                    : this.critterById.get(record.critterId)?.category || null,
                }
              : null
          );
        });

        this.nodesLayer.appendChild(node);
        this.alienNodeButtons.set(record.key, node);
      });

      laneWeapons.forEach((entry, weaponIndex) => {
        const node = document.createElement('button');
        node.type = 'button';
        node.className = 'unlock-node unlock-node--weapon';
        const fallbackCell =
          laneCells[weaponIndex] || {
            row: Math.min(GRID_ROWS - 1, weaponIndex),
            column: weaponIndex % GRID_COLUMNS_PER_GROUP,
          };
        const fallbackPoint = this.getGridCellPosition(
          this.activeCategoryId,
          group.id,
          fallbackCell.row,
          fallbackCell.column,
          categoryLayout
        );
        const point =
          positionMap.get(entry.id) ||
          this.getResolvedNodePosition(
            this.activeCategoryId,
            entry,
            group.id,
            fallbackPoint.x,
            fallbackPoint.y,
            categoryLayout
          );
        node.style.left = `${point.x}px`;
        node.style.top = `${point.y}px`;
        node.dataset.weaponId = entry.id;
        node.setAttribute('aria-pressed', 'false');
        node.innerHTML = `<span class="unlock-node__name">${entry.name}</span>`;
        this.currentPositions.set(entry.id, point);

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

        const shouldSuppressClick = this.bindNodeDrag(node, entry.id, group.id);
        node.addEventListener('click', () => {
          if (shouldSuppressClick()) {
            return;
          }
          const nextId = this.activeWeaponId === entry.id ? null : entry.id;
          this.setActiveWeapon(nextId);
          this.bus?.emit?.('weapon-map:selected', nextId);
        });

        this.nodesLayer.appendChild(node);
        this.nodeButtons.set(entry.id, node);
      });
    });

    this.renderRequirementLinks(this.currentPositions);
    this.applyActiveNodeState();

    if (!groups.length) {
      const fallbackLane = document.createElement('div');
      fallbackLane.className = 'unlock-lane unlock-lane--weapon';
      fallbackLane.style.left = `${GROUP_SIDE_PADDING}px`;
      fallbackLane.style.right = 'auto';
      fallbackLane.style.width = `${this.getBoardWidth() - GROUP_SIDE_PADDING * 2}px`;
      fallbackLane.style.top = `${LANE_START_Y}px`;
      fallbackLane.style.height = `${Math.max(280, boardHeight - LANE_START_Y * 2)}px`;
      fallbackLane.style.setProperty(
        '--grid-cols',
        String(this.getMaxGroupCount() * GRID_COLUMNS_PER_GROUP)
      );
      fallbackLane.style.setProperty('--grid-rows', String(GRID_ROWS));
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
