import { critterMapDefaultLayout } from '../../data/critterMapDefaultLayout.js';

const MAP_WIDTH = 1700;
const MAP_HEIGHT = 3980;
const LANE_START_Y = 88;
const LANE_HEIGHT = 760;
const GRID_ROWS_PER_LANE = 7;
const GRID_COLUMNS_PER_LANE = 9;
const NODE_WIDTH = 176;
const NODE_HEIGHT = 84;
const LANE_ROW_OFFSET = 58;
const LANE_BOTTOM_PADDING = 48;
const LANE_X_PADDING = 34;
const DEFAULT_PAN = { x: 38, y: 30 };
const PAN_MARGIN = 82;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.6;
const NODE_DRAG_THRESHOLD = 6;
const DEFAULT_NODE_TEXT_SCALE = 100;
const DEFAULT_NODE_FONT_SIZE = 15;
const DEFAULT_NODE_HUE = 145;
const DEFAULT_NODE_SATURATION = 88;
const DEFAULT_NODE_LIGHTNESS = 52;
const DEFAULT_LINK_HUE = 194;
const DEFAULT_LINK_SATURATION = 78;
const DEFAULT_LINK_LIGHTNESS = 64;
const DEFAULT_LINK_WIDTH = 3;
const DEFAULT_INPUT_WIDTH = 3;
const NODE_FONT_MIN = 9;
const NODE_FONT_MAX = 54;
const NODE_TEXT_HORIZONTAL_PADDING = 30;
const NODE_TEXT_VERTICAL_PADDING = 18;

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
    this.critterById = new Map((critters || []).map((critter) => [critter.id, critter]));

    this.root = null;
    this.viewport = null;
    this.board = null;
    this.linksLayer = null;
    this.pointsLayer = null;
    this.lanesLayer = null;
    this.nodesLayer = null;
    this.zoomLabel = zoomElement || null;

    this.activeCategoryId = null;
    this.activeCritterId = null;
    this.nodeButtons = new Map();
    this.currentPositions = new Map();
    this.linkRecords = [];
    this.customPositionsByCategory = new Map();
    this.nodeStylesByCategory = new Map();
    this.linkStylesByCategory = new Map();
    this.linkPointsByCategory = new Map();
    this.autoTextSizeCache = new Map();
    this.wordFitSizeCache = new Map();
    this.styleMenu = null;
    this.dismissStyleMenu = null;
    this.removeEditorListeners = [];
    this.editorBusBound = false;

    this.pan = { ...DEFAULT_PAN };
    this.scale = 1;
    this.panDragState = null;
    this.linkPointsVisible = true;
    this.linkPointIdSequence = 1;

    this.loadDefaultLayout(critterMapDefaultLayout);
  }

  loadDefaultLayout(layoutSource = {}) {
    if (!layoutSource || typeof layoutSource !== 'object') {
      return;
    }

    const applyLegacyShape = (sourceByCategory = {}) => {
      Object.entries(sourceByCategory).forEach(([categoryId, critterPoints]) => {
        if (!critterPoints || typeof critterPoints !== 'object' || Array.isArray(critterPoints)) {
          return;
        }
        const positionsByCritter = this.ensureCategoryCustomPositions(categoryId);
        Object.entries(critterPoints).forEach(([critterId, point]) => {
          const x = Number(point?.x);
          const y = Number(point?.y);
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return;
          }
          positionsByCritter.set(critterId, { x: Math.round(x), y: Math.round(y) });
        });
      });
    };

    if (layoutSource.categories && typeof layoutSource.categories === 'object') {
      Object.entries(layoutSource.categories).forEach(([categoryId, categoryEntry]) => {
        const positionsByCritter = this.ensureCategoryCustomPositions(categoryId);
        const nodeStyles = this.ensureCategoryNodeStyles(categoryId);
        const linkStyles = this.ensureCategoryLinkStyles(categoryId);
        const linkPoints = this.ensureCategoryLinkPoints(categoryId);

        if (Array.isArray(categoryEntry?.critters)) {
          categoryEntry.critters.forEach((critter) => {
            const critterId = critter?.id;
            if (!critterId) {
              return;
            }

            const x = Number(critter?.x);
            const y = Number(critter?.y);
            if (Number.isFinite(x) && Number.isFinite(y)) {
              positionsByCritter.set(critterId, { x: Math.round(x), y: Math.round(y) });
            }

            if (critter?.style && typeof critter.style === 'object') {
              nodeStyles.set(critterId, this.normalizeNodeStyle(critter.style));
            }
          });
        }

        if (Array.isArray(categoryEntry?.lines)) {
          categoryEntry.lines.forEach((line) => {
            const key = String(line?.key || '');
            if (!key) {
              return;
            }
            const hasDirectStyle =
              Number.isFinite(Number(line?.hue)) ||
              Number.isFinite(Number(line?.saturation)) ||
              Number.isFinite(Number(line?.lightness)) ||
              Number.isFinite(Number(line?.width));
            if (hasDirectStyle) {
              linkStyles.set(key, this.normalizeLinkStyle(line));
            }

            const rawPoints = Array.isArray(line?.points)
              ? line.points
              : Array.isArray(line?.controlPoints)
                ? line.controlPoints
                : [];
            if (rawPoints.length) {
              linkPoints.set(key, this.normalizeLinkPoints(rawPoints));
            }
          });
        }
      });
      return;
    }

    applyLegacyShape(layoutSource);
  }

  clampNumber(value, min, max, fallback) {
    if (!Number.isFinite(Number(value))) {
      return fallback;
    }
    const numeric = Number(value);
    return Math.max(min, Math.min(max, numeric));
  }

  normalizeLinkPoints(points = []) {
    return points
      .filter((point) => Number.isFinite(Number(point?.x)) && Number.isFinite(Number(point?.y)))
      .map((point) => ({
        id: this.resolveLinkPointId(point?.id),
        x: Math.round(this.clampNumber(point.x, 0, MAP_WIDTH, 0)),
        y: Math.round(this.clampNumber(point.y, 0, MAP_HEIGHT, 0)),
      }));
  }

  resolveLinkPointId(rawId) {
    if (typeof rawId === 'string' && rawId.trim()) {
      const trimmedId = rawId.trim();
      this.trackLinkPointSequence(trimmedId);
      return trimmedId;
    }
    return this.generateLinkPointId();
  }

  trackLinkPointSequence(linkPointId) {
    const match = /^lp-(\d+)$/.exec(String(linkPointId || '').trim());
    if (!match) {
      return;
    }

    const numericId = Number(match[1]);
    if (!Number.isFinite(numericId)) {
      return;
    }

    this.linkPointIdSequence = Math.max(this.linkPointIdSequence, numericId + 1);
  }

  generateLinkPointId() {
    const id = `lp-${this.linkPointIdSequence}`;
    this.linkPointIdSequence += 1;
    return id;
  }

  normalizeNodeStyle(style = {}, existing = null) {
    const previous = existing || {};
    const fallbackHue = Number.isFinite(previous.hue) ? Number(previous.hue) : DEFAULT_NODE_HUE;
    const fallbackSaturation = Number.isFinite(previous.saturation)
      ? Number(previous.saturation)
      : DEFAULT_NODE_SATURATION;
    const fallbackLightness = Number.isFinite(previous.lightness)
      ? Number(previous.lightness)
      : DEFAULT_NODE_LIGHTNESS;
    const incomingHueCandidate = Number.isFinite(style.inputHue)
      ? Number(style.inputHue)
      : Number.isFinite(style.outputHue)
        ? Number(style.outputHue)
        : null;
    const incomingHueNullRequested = style.inputHue === null || style.outputHue === null;
    const hasIncomingHue = Number.isFinite(incomingHueCandidate);
    const preserveIncomingHue =
      !hasIncomingHue && !incomingHueNullRequested && Number.isFinite(previous.inputHue);
    const resolvedIncomingHue = hasIncomingHue
      ? incomingHueCandidate
      : incomingHueNullRequested
        ? null
        : preserveIncomingHue
          ? Number(previous.inputHue)
          : null;

    const legacyScale = Number.isFinite(style.fontSize)
      ? Number(style.fontSize / DEFAULT_NODE_FONT_SIZE) * 100
      : null;
    const previousScale = Number.isFinite(previous.textScale)
      ? Number(previous.textScale)
      : Number.isFinite(previous.fontSize)
        ? Number(previous.fontSize / DEFAULT_NODE_FONT_SIZE) * 100
        : DEFAULT_NODE_TEXT_SCALE;
    const nextScale = Number.isFinite(style.textScale)
      ? Number(style.textScale)
      : Number.isFinite(legacyScale)
        ? legacyScale
        : previousScale;

    const incomingSaturationValue = Number.isFinite(style.inputSaturation)
      ? Number(style.inputSaturation)
      : Number.isFinite(style.outputSaturation)
        ? Number(style.outputSaturation)
        : null;
    const incomingSaturationNullRequested = style.inputSaturation === null || style.outputSaturation === null;
    const resolvedInputSaturation = Number.isFinite(incomingSaturationValue)
      ? this.clampNumber(incomingSaturationValue, 10, 100, DEFAULT_LINK_SATURATION)
      : incomingSaturationNullRequested
        ? null
        : Number.isFinite(previous.inputSaturation)
          ? this.clampNumber(previous.inputSaturation, 10, 100, DEFAULT_LINK_SATURATION)
          : null;
    const incomingLightnessValue = Number.isFinite(style.inputLightness)
      ? Number(style.inputLightness)
      : Number.isFinite(style.outputLightness)
        ? Number(style.outputLightness)
        : null;
    const incomingLightnessNullRequested = style.inputLightness === null || style.outputLightness === null;
    const resolvedInputLightness = Number.isFinite(incomingLightnessValue)
      ? this.clampNumber(incomingLightnessValue, 14, 84, DEFAULT_LINK_LIGHTNESS)
      : incomingLightnessNullRequested
        ? null
        : Number.isFinite(previous.inputLightness)
          ? this.clampNumber(previous.inputLightness, 14, 84, DEFAULT_LINK_LIGHTNESS)
          : null;
    const incomingWidthCandidate = Number.isFinite(style.inputWidth)
      ? Number(style.inputWidth)
      : Number.isFinite(style.outputWidth)
        ? Number(style.outputWidth)
        : null;
    const previousInputWidth = Number.isFinite(previous.inputWidth)
      ? Number(previous.inputWidth)
      : Number.isFinite(previous.outputWidth)
        ? Number(previous.outputWidth)
        : DEFAULT_INPUT_WIDTH;

    return {
      textScale: this.clampNumber(nextScale, 65, 220, DEFAULT_NODE_TEXT_SCALE),
      hue: this.clampNumber(style.hue, 0, 360, fallbackHue),
      saturation: this.clampNumber(style.saturation, 10, 100, fallbackSaturation),
      lightness: this.clampNumber(style.lightness, 14, 84, fallbackLightness),
      inputHue: Number.isFinite(resolvedIncomingHue)
        ? this.clampNumber(resolvedIncomingHue, 0, 360, null)
        : null,
      inputSaturation: Number.isFinite(resolvedIncomingHue) ? resolvedInputSaturation : null,
      inputLightness: Number.isFinite(resolvedIncomingHue) ? resolvedInputLightness : null,
      inputWidth: this.clampNumber(incomingWidthCandidate, 1, 10, previousInputWidth),
    };
  }

  normalizeLinkStyle(style = {}, existing = null) {
    const previous = existing || {};
    return {
      hue: this.clampNumber(style.hue, 0, 360, Number.isFinite(previous.hue) ? Number(previous.hue) : DEFAULT_LINK_HUE),
      saturation: this.clampNumber(
        style.saturation,
        10,
        100,
        Number.isFinite(previous.saturation) ? Number(previous.saturation) : DEFAULT_LINK_SATURATION
      ),
      lightness: this.clampNumber(
        style.lightness,
        14,
        84,
        Number.isFinite(previous.lightness) ? Number(previous.lightness) : DEFAULT_LINK_LIGHTNESS
      ),
      width: this.clampNumber(style.width, 1, 10, Number.isFinite(previous.width) ? Number(previous.width) : DEFAULT_LINK_WIDTH),
    };
  }

  getResolvedNodeStyle(categoryId, critterId) {
    const style = this.getNodeStyle(categoryId, critterId);
    return this.normalizeNodeStyle(style || {});
  }

  getResolvedIncomingLineStyle(categoryId, targetCritterId) {
    const targetStyle = this.getResolvedNodeStyle(categoryId, targetCritterId);
    const targetRawStyle = this.getNodeStyle(categoryId, targetCritterId) || null;
    const inputHue = Number.isFinite(targetRawStyle?.inputHue)
      ? Number(targetRawStyle.inputHue)
      : Number.isFinite(targetRawStyle?.outputHue)
        ? Number(targetRawStyle.outputHue)
        : targetStyle.hue;
    const inputSaturation = Number.isFinite(targetRawStyle?.inputSaturation)
      ? Number(targetRawStyle.inputSaturation)
      : Number.isFinite(targetRawStyle?.outputSaturation)
        ? Number(targetRawStyle.outputSaturation)
        : targetStyle.saturation;
    const inputLightness = Number.isFinite(targetRawStyle?.inputLightness)
      ? Number(targetRawStyle.inputLightness)
      : Number.isFinite(targetRawStyle?.outputLightness)
        ? Number(targetRawStyle.outputLightness)
        : targetStyle.lightness;

    return {
      hue: this.clampNumber(inputHue, 0, 360, targetStyle.hue),
      saturation: this.clampNumber(inputSaturation, 10, 100, targetStyle.saturation),
      lightness: this.clampNumber(inputLightness, 14, 84, targetStyle.lightness),
      width: this.clampNumber(targetStyle.inputWidth, 1, 10, DEFAULT_INPUT_WIDTH),
    };
  }

  ensureCategoryNodeStyles(categoryId) {
    if (!categoryId) {
      return new Map();
    }

    if (!this.nodeStylesByCategory.has(categoryId)) {
      this.nodeStylesByCategory.set(categoryId, new Map());
    }

    return this.nodeStylesByCategory.get(categoryId);
  }

  ensureCategoryLinkStyles(categoryId) {
    if (!categoryId) {
      return new Map();
    }

    if (!this.linkStylesByCategory.has(categoryId)) {
      this.linkStylesByCategory.set(categoryId, new Map());
    }

    return this.linkStylesByCategory.get(categoryId);
  }

  ensureCategoryLinkPoints(categoryId) {
    if (!categoryId) {
      return new Map();
    }

    if (!this.linkPointsByCategory.has(categoryId)) {
      this.linkPointsByCategory.set(categoryId, new Map());
    }

    return this.linkPointsByCategory.get(categoryId);
  }

  getLinkPoints(categoryId, linkKey) {
    if (!categoryId || !linkKey) {
      return [];
    }

    const categoryPoints = this.ensureCategoryLinkPoints(categoryId);
    if (!categoryPoints.has(linkKey)) {
      categoryPoints.set(linkKey, []);
    }

    return categoryPoints.get(linkKey);
  }

  getBoardCoordinatesFromClient(clientX, clientY) {
    if (!this.viewport) {
      return { x: 0, y: 0 };
    }

    const rect = this.viewport.getBoundingClientRect();
    const boardX = (clientX - rect.left - this.pan.x) / this.scale;
    const boardY = (clientY - rect.top - this.pan.y) / this.scale;
    return {
      x: this.clampNumber(boardX, 0, MAP_WIDTH, 0),
      y: this.clampNumber(boardY, 0, MAP_HEIGHT, 0),
    };
  }

  setLinkPointsVisible(nextVisible) {
    this.linkPointsVisible = Boolean(nextVisible);
    if (this.pointsLayer) {
      this.pointsLayer.hidden = !this.linkPointsVisible;
    }
    return this.linkPointsVisible;
  }

  toggleLinkPointsVisibility() {
    return this.setLinkPointsVisible(!this.linkPointsVisible);
  }

  areLinkPointsVisible() {
    return this.linkPointsVisible;
  }

  getNodeStyle(categoryId, critterId) {
    return this.nodeStylesByCategory.get(categoryId)?.get(critterId) || null;
  }

  getLinkStyle(categoryId, linkKey) {
    return this.linkStylesByCategory.get(categoryId)?.get(linkKey) || null;
  }

  setNodeStyle(categoryId, critterId, nextStyle) {
    if (!categoryId || !critterId || !nextStyle) {
      return;
    }

    const categoryStyles = this.ensureCategoryNodeStyles(categoryId);
    const existing = categoryStyles.get(critterId) || null;
    categoryStyles.set(critterId, this.normalizeNodeStyle(nextStyle, existing));
  }

  setLinkStyle(categoryId, linkKey, nextStyle) {
    if (!categoryId || !linkKey || !nextStyle) {
      return;
    }

    const categoryStyles = this.ensureCategoryLinkStyles(categoryId);
    const existing = categoryStyles.get(linkKey) || null;
    categoryStyles.set(linkKey, this.normalizeLinkStyle(nextStyle, existing));
  }

  removeNodeStyle(categoryId, critterId) {
    const categoryStyles = this.nodeStylesByCategory.get(categoryId);
    if (!categoryStyles) {
      return;
    }

    categoryStyles.delete(critterId);
    if (!categoryStyles.size) {
      this.nodeStylesByCategory.delete(categoryId);
    }
  }

  removeLinkStyle(categoryId, linkKey) {
    const categoryStyles = this.linkStylesByCategory.get(categoryId);
    if (!categoryStyles) {
      return;
    }

    categoryStyles.delete(linkKey);
    if (!categoryStyles.size) {
      this.linkStylesByCategory.delete(categoryId);
    }
  }

  applyNodeVisualStyle(critterId) {
    if (!this.activeCategoryId || !critterId) {
      return;
    }

    const node = this.nodeButtons.get(critterId);
    if (!node) {
      return;
    }

    const style = this.getResolvedNodeStyle(this.activeCategoryId, critterId);
    const critter = this.critterById.get(critterId);
    const label = String(critter?.name || node.querySelector('.unlock-node__name')?.textContent || critterId);
    const autoSize = this.getAutoNodeFontSize(label);
    const maxWordFitSize = this.getMaxWordFitSize(label);
    const textScale = this.clampNumber(style.textScale, 65, 220, DEFAULT_NODE_TEXT_SCALE);
    const finalFontSize = this.clampNumber(
      Math.min((autoSize * textScale) / 100, maxWordFitSize),
      NODE_FONT_MIN,
      NODE_FONT_MAX,
      DEFAULT_NODE_FONT_SIZE
    );

    node.style.setProperty('--node-font-size', `${finalFontSize}px`);
    node.style.setProperty('--node-hue', String(style.hue));
    node.style.setProperty('--node-saturation', String(style.saturation));
    node.style.setProperty('--node-lightness', String(style.lightness));
  }

  getAutoNodeFontSize(label) {
    const cacheKey = String(label || '').trim().toLowerCase();
    if (this.autoTextSizeCache.has(cacheKey)) {
      return this.autoTextSizeCache.get(cacheKey);
    }

    const words = String(label || '')
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0);
    const fallback = DEFAULT_NODE_FONT_SIZE;
    if (!words.length) {
      return fallback;
    }

    const maxWidth = NODE_WIDTH - NODE_TEXT_HORIZONTAL_PADDING;
    const maxHeight = NODE_HEIGHT - NODE_TEXT_VERTICAL_PADDING;
    let best = NODE_FONT_MIN;
    for (let size = NODE_FONT_MAX; size >= NODE_FONT_MIN; size -= 1) {
      const lines = this.estimateWrappedLineCount(words, size, maxWidth);
      if (!Number.isFinite(lines)) {
        continue;
      }
      const estimatedHeight = lines * size * 1.04;
      if (estimatedHeight <= maxHeight) {
        best = size;
        break;
      }
    }
    const resolved = this.clampNumber(best, NODE_FONT_MIN, NODE_FONT_MAX, fallback);
    this.autoTextSizeCache.set(cacheKey, resolved);
    return resolved;
  }

  getMaxWordFitSize(label) {
    const cacheKey = String(label || '').trim().toLowerCase();
    if (this.wordFitSizeCache.has(cacheKey)) {
      return this.wordFitSizeCache.get(cacheKey);
    }

    const words = String(label || '')
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0);
    if (!words.length) {
      return DEFAULT_NODE_FONT_SIZE;
    }

    const maxWidth = NODE_WIDTH - NODE_TEXT_HORIZONTAL_PADDING;
    let best = NODE_FONT_MIN;
    for (let size = NODE_FONT_MAX; size >= NODE_FONT_MIN; size -= 1) {
      const allWordsFit = words.every((word) => word.length * size * 0.63 <= maxWidth);
      if (allWordsFit) {
        best = size;
        break;
      }
    }

    const resolved = this.clampNumber(best, NODE_FONT_MIN, NODE_FONT_MAX, NODE_FONT_MIN);
    this.wordFitSizeCache.set(cacheKey, resolved);
    return resolved;
  }

  estimateWrappedLineCount(words, fontSize, maxWidth) {
    const glyphWidth = fontSize * 0.63;
    const spaceWidth = fontSize * 0.34;
    if (!words.length) {
      return 1;
    }

    let lines = 1;
    let lineWidth = 0;
    for (let index = 0; index < words.length; index += 1) {
      const word = words[index];
      const tokenWidth = word.length * glyphWidth;
      if (tokenWidth > maxWidth) {
        return Number.POSITIVE_INFINITY;
      }

      const nextWidth = lineWidth > 0 ? lineWidth + spaceWidth + tokenWidth : tokenWidth;
      if (nextWidth <= maxWidth) {
        lineWidth = nextWidth;
        continue;
      }

      lines += 1;
      lineWidth = tokenWidth;
    }

    return lines;
  }

  hideStyleMenu() {
    if (this.dismissStyleMenu) {
      this.dismissStyleMenu();
      this.dismissStyleMenu = null;
    }
    if (this.styleMenu) {
      this.styleMenu.hidden = true;
      this.styleMenu.innerHTML = '';
    }
  }

  positionStyleMenu(clientX, clientY) {
    if (!this.styleMenu || !this.viewport) {
      return;
    }

    const viewportRect = this.viewport.getBoundingClientRect();
    const offsetX = clientX - viewportRect.left;
    const offsetY = clientY - viewportRect.top;
    const menuWidth = this.styleMenu.offsetWidth || 262;
    const menuHeight = this.styleMenu.offsetHeight || 320;
    this.styleMenu.style.left = `${Math.max(8, Math.min(offsetX + 8, viewportRect.width - menuWidth - 8))}px`;
    this.styleMenu.style.top = `${Math.max(8, Math.min(offsetY + 8, viewportRect.height - menuHeight - 8))}px`;
  }

  bindStyleMenuDismiss() {
    const onPointerDown = (event) => {
      if (!this.styleMenu || this.styleMenu.hidden) {
        return;
      }

      if (event.target === this.styleMenu || this.styleMenu.contains(event.target)) {
        return;
      }

      this.hideStyleMenu();
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        this.hideStyleMenu();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    this.dismissStyleMenu = () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }

  showNodeStyleMenu({ critter, clientX, clientY }) {
    if (!this.styleMenu || !this.activeCategoryId || !critter) {
      return;
    }

    this.hideStyleMenu();
    this.bindStyleMenuDismiss();
    const current = this.getResolvedNodeStyle(this.activeCategoryId, critter.id);
    const raw = this.getNodeStyle(this.activeCategoryId, critter.id) || null;
    const inputEnabled = Number.isFinite(raw?.inputHue) || Number.isFinite(raw?.outputHue);
    const inputHue = inputEnabled
      ? Number.isFinite(raw?.inputHue)
        ? Number(raw.inputHue)
        : Number(raw.outputHue)
      : current.hue;
    const inputSaturation = inputEnabled
      ? this.clampNumber(
          Number.isFinite(raw?.inputSaturation) ? raw?.inputSaturation : raw?.outputSaturation,
          10,
          100,
          current.saturation
        )
      : current.saturation;
    const inputLightness = inputEnabled
      ? this.clampNumber(
          Number.isFinite(raw?.inputLightness) ? raw?.inputLightness : raw?.outputLightness,
          14,
          84,
          current.lightness
        )
      : current.lightness;
    this.styleMenu.hidden = false;
    this.styleMenu.innerHTML = `
      <p class="unlock-style-menu__title">Edit ${critter.name}</p>
      <label class="unlock-style-menu__field">
        <span>Text Scale</span>
        <input data-role="node-text-scale" type="range" min="65" max="220" step="1" value="${Math.round(current.textScale)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Box Hue</span>
        <input data-role="node-hue" type="range" min="0" max="360" step="1" value="${Math.round(current.hue)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Box Saturation</span>
        <input data-role="node-saturation" type="range" min="10" max="100" step="1" value="${Math.round(current.saturation)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Box Lightness</span>
        <input data-role="node-lightness" type="range" min="14" max="84" step="1" value="${Math.round(current.lightness)}" />
      </label>
      <label class="unlock-style-menu__toggle">
        <input data-role="input-enabled" type="checkbox" ${inputEnabled ? 'checked' : ''} />
        <span>Custom Incoming Line Color</span>
      </label>
      <label class="unlock-style-menu__field">
        <span>Incoming Hue</span>
        <input data-role="input-hue" type="range" min="0" max="360" step="1" value="${Math.round(inputHue)}" ${inputEnabled ? '' : 'disabled'} />
      </label>
      <label class="unlock-style-menu__field">
        <span>Incoming Saturation</span>
        <input data-role="input-saturation" type="range" min="10" max="100" step="1" value="${Math.round(inputSaturation)}" ${inputEnabled ? '' : 'disabled'} />
      </label>
      <label class="unlock-style-menu__field">
        <span>Incoming Lightness</span>
        <input data-role="input-lightness" type="range" min="14" max="84" step="1" value="${Math.round(inputLightness)}" ${inputEnabled ? '' : 'disabled'} />
      </label>
      <label class="unlock-style-menu__field">
        <span>Incoming Width</span>
        <input data-role="input-width" type="range" min="1" max="10" step="1" value="${Math.round(current.inputWidth)}" />
      </label>
      <div class="unlock-style-menu__actions">
        <button type="button" data-action="reset-node-style">Reset Node Style</button>
      </div>
    `;

    this.positionStyleMenu(clientX, clientY);

    const textScaleInput = this.styleMenu.querySelector('[data-role="node-text-scale"]');
    const hueInput = this.styleMenu.querySelector('[data-role="node-hue"]');
    const saturationInput = this.styleMenu.querySelector('[data-role="node-saturation"]');
    const lightnessInput = this.styleMenu.querySelector('[data-role="node-lightness"]');
    const inputEnabledInput = this.styleMenu.querySelector('[data-role="input-enabled"]');
    const inputHueInput = this.styleMenu.querySelector('[data-role="input-hue"]');
    const inputSaturationInput = this.styleMenu.querySelector('[data-role="input-saturation"]');
    const inputLightnessInput = this.styleMenu.querySelector('[data-role="input-lightness"]');
    const inputWidthInput = this.styleMenu.querySelector('[data-role="input-width"]');
    const resetButton = this.styleMenu.querySelector('[data-action="reset-node-style"]');

    const commitNodeStyle = () => {
      const inputHueValue = inputEnabledInput.checked ? Number(inputHueInput.value) : null;
      const inputSaturationValue = inputEnabledInput.checked ? Number(inputSaturationInput.value) : null;
      const inputLightnessValue = inputEnabledInput.checked ? Number(inputLightnessInput.value) : null;
      this.applyCritterEditorState(critter.id, {
        textScale: Number(textScaleInput.value),
        hue: Number(hueInput.value),
        saturation: Number(saturationInput.value),
        lightness: Number(lightnessInput.value),
        inputHue: inputHueValue,
        inputSaturation: inputSaturationValue,
        inputLightness: inputLightnessValue,
        inputWidth: Number(inputWidthInput.value),
      });
    };

    textScaleInput.addEventListener('input', commitNodeStyle);
    hueInput.addEventListener('input', commitNodeStyle);
    saturationInput.addEventListener('input', commitNodeStyle);
    lightnessInput.addEventListener('input', commitNodeStyle);
    inputEnabledInput.addEventListener('change', () => {
      inputHueInput.disabled = !inputEnabledInput.checked;
      inputSaturationInput.disabled = !inputEnabledInput.checked;
      inputLightnessInput.disabled = !inputEnabledInput.checked;
      commitNodeStyle();
    });
    inputHueInput.addEventListener('input', commitNodeStyle);
    inputSaturationInput.addEventListener('input', commitNodeStyle);
    inputLightnessInput.addEventListener('input', commitNodeStyle);
    inputWidthInput.addEventListener('input', commitNodeStyle);
    resetButton.addEventListener('click', () => {
      this.resetCritterEditorState(critter.id);
      this.hideStyleMenu();
    });
  }

  showLinkStyleMenu({ linkRecord, clientX, clientY }) {
    if (!this.styleMenu || !this.activeCategoryId || !linkRecord) {
      return;
    }

    this.hideStyleMenu();
    this.bindStyleMenuDismiss();

    const inherited = this.getResolvedIncomingLineStyle(this.activeCategoryId, linkRecord.targetId);
    const direct = this.getLinkStyle(this.activeCategoryId, linkRecord.key);
    const current = direct ? this.normalizeLinkStyle(direct, inherited) : inherited;

    this.styleMenu.hidden = false;
    this.styleMenu.innerHTML = `
      <p class="unlock-style-menu__title">Line ${prettify(linkRecord.sourceId)} to ${prettify(linkRecord.targetId)}</p>
      <label class="unlock-style-menu__field">
        <span>Line Hue</span>
        <input data-role="line-hue" type="range" min="0" max="360" step="1" value="${Math.round(current.hue)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Line Saturation</span>
        <input data-role="line-saturation" type="range" min="10" max="100" step="1" value="${Math.round(current.saturation)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Line Lightness</span>
        <input data-role="line-lightness" type="range" min="14" max="84" step="1" value="${Math.round(current.lightness)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Line Width</span>
        <input data-role="line-width" type="range" min="1" max="10" step="1" value="${Math.round(current.width)}" />
      </label>
      <div class="unlock-style-menu__actions">
        <button type="button" data-action="reset-line-style">Reset Line Style</button>
      </div>
    `;

    this.positionStyleMenu(clientX, clientY);

    const hueInput = this.styleMenu.querySelector('[data-role="line-hue"]');
    const saturationInput = this.styleMenu.querySelector('[data-role="line-saturation"]');
    const lightnessInput = this.styleMenu.querySelector('[data-role="line-lightness"]');
    const widthInput = this.styleMenu.querySelector('[data-role="line-width"]');
    const resetButton = this.styleMenu.querySelector('[data-action="reset-line-style"]');

    const commitLineStyle = () => {
      this.setLinkStyle(this.activeCategoryId, linkRecord.key, {
        hue: Number(hueInput.value),
        saturation: Number(saturationInput.value),
        lightness: Number(lightnessInput.value),
        width: Number(widthInput.value),
      });
      this.updateLinkPaths();
    };

    hueInput.addEventListener('input', commitLineStyle);
    saturationInput.addEventListener('input', commitLineStyle);
    lightnessInput.addEventListener('input', commitLineStyle);
    widthInput.addEventListener('input', commitLineStyle);
    resetButton.addEventListener('click', () => {
      this.removeLinkStyle(this.activeCategoryId, linkRecord.key);
      this.updateLinkPaths();
      this.hideStyleMenu();
    });
  }

  getCritterEditorState(critterId) {
    if (!this.activeCategoryId || !critterId) {
      return {
        textScale: DEFAULT_NODE_TEXT_SCALE,
        hue: DEFAULT_NODE_HUE,
        saturation: DEFAULT_NODE_SATURATION,
        lightness: DEFAULT_NODE_LIGHTNESS,
        inputHue: null,
        inputSaturation: null,
        inputLightness: null,
        inputWidth: DEFAULT_INPUT_WIDTH,
      };
    }

    const style = this.getResolvedNodeStyle(this.activeCategoryId, critterId);
    const raw = this.getNodeStyle(this.activeCategoryId, critterId) || null;
    const inputHue = Number.isFinite(raw?.inputHue)
      ? Number(raw.inputHue)
      : Number.isFinite(raw?.outputHue)
        ? Number(raw.outputHue)
        : null;
    const inputSaturation = Number.isFinite(raw?.inputSaturation)
      ? Number(raw.inputSaturation)
      : Number.isFinite(raw?.outputSaturation)
        ? Number(raw.outputSaturation)
        : null;
    const inputLightness = Number.isFinite(raw?.inputLightness)
      ? Number(raw.inputLightness)
      : Number.isFinite(raw?.outputLightness)
        ? Number(raw.outputLightness)
        : null;
    return {
      textScale: style.textScale,
      hue: style.hue,
      saturation: style.saturation,
      lightness: style.lightness,
      inputHue,
      inputSaturation,
      inputLightness,
      inputWidth: style.inputWidth,
    };
  }

  applyCritterEditorState(critterId, patch = {}) {
    if (!this.activeCategoryId || !critterId || !patch) {
      return;
    }

    const previous = this.getCritterEditorState(critterId);
    this.setNodeStyle(this.activeCategoryId, critterId, {
      textScale: Number.isFinite(patch.textScale)
        ? Number(patch.textScale)
        : Number.isFinite(patch.fontSize)
          ? Number((Number(patch.fontSize) / DEFAULT_NODE_FONT_SIZE) * 100)
          : previous.textScale,
      hue: Number.isFinite(patch.hue) ? Number(patch.hue) : previous.hue,
      saturation: Number.isFinite(patch.saturation) ? Number(patch.saturation) : previous.saturation,
      lightness: Number.isFinite(patch.lightness) ? Number(patch.lightness) : previous.lightness,
      inputHue: Number.isFinite(patch.inputHue)
        ? Number(patch.inputHue)
        : Number.isFinite(patch.outputHue)
          ? Number(patch.outputHue)
          : patch.inputHue === null || patch.outputHue === null
          ? null
          : previous.inputHue,
      inputSaturation: Number.isFinite(patch.inputSaturation)
        ? Number(patch.inputSaturation)
        : Number.isFinite(patch.outputSaturation)
          ? Number(patch.outputSaturation)
          : patch.inputSaturation === null || patch.outputSaturation === null
          ? null
          : previous.inputSaturation,
      inputLightness: Number.isFinite(patch.inputLightness)
        ? Number(patch.inputLightness)
        : Number.isFinite(patch.outputLightness)
          ? Number(patch.outputLightness)
          : patch.inputLightness === null || patch.outputLightness === null
          ? null
          : previous.inputLightness,
      inputWidth: Number.isFinite(patch.inputWidth)
        ? Number(patch.inputWidth)
        : Number.isFinite(patch.outputWidth)
          ? Number(patch.outputWidth)
          : previous.inputWidth,
    });

    this.applyNodeVisualStyle(critterId);
    this.updateLinkPaths();
  }

  resetCritterEditorState(critterId) {
    if (!this.activeCategoryId || !critterId) {
      return;
    }
    this.removeNodeStyle(this.activeCategoryId, critterId);
    this.applyNodeVisualStyle(critterId);
    this.updateLinkPaths();
  }

  bindEditorEvents() {
    if (this.editorBusBound || !this.bus?.on) {
      return;
    }

    const offUpdate = this.bus.on('critter:editor-changed', (payload) => {
      const critterId = payload?.critterId;
      if (!critterId) {
        return;
      }
      this.applyCritterEditorState(critterId, payload || {});
    });

    const offReset = this.bus.on('critter:editor-reset', (payload) => {
      const critterId = payload?.critterId;
      if (!critterId) {
        return;
      }
      this.resetCritterEditorState(critterId);
    });

    this.removeEditorListeners = [offUpdate, offReset];
    this.editorBusBound = true;
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
          <div class="unlock-map__points" data-role="map-points"></div>
          <div class="unlock-map__lanes" data-role="map-lanes"></div>
          <div class="unlock-map__nodes" data-role="map-nodes"></div>
        </div>
        <div class="unlock-style-menu" data-role="style-menu" hidden></div>
      </div>
    `;

    this.element.appendChild(this.root);
    this.viewport = this.root.querySelector('[data-role="map-viewport"]');
    this.board = this.root.querySelector('[data-role="map-board"]');
    this.linksLayer = this.root.querySelector('[data-role="map-links"]');
    this.pointsLayer = this.root.querySelector('[data-role="map-points"]');
    this.lanesLayer = this.root.querySelector('[data-role="map-lanes"]');
    this.nodesLayer = this.root.querySelector('[data-role="map-nodes"]');
    this.styleMenu = this.root.querySelector('[data-role="style-menu"]');
    if (!this.zoomLabel) {
      this.zoomLabel = this.root.querySelector('[data-role="map-zoom"]');
    }

    this.board.style.width = `${MAP_WIDTH}px`;
    this.board.style.height = `${MAP_HEIGHT}px`;

    this.bindPanning();
    this.bindWheelNavigation();
    this.bindContextMenuGuard();
    this.bindConnectorPointCreation();
    this.bindDoubleClickGuard();
    this.bindEditorEvents();
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

      if (
        event.target.closest('.unlock-node') ||
        event.target.closest('.unlock-style-menu') ||
        event.target.closest('.unlock-link-point') ||
        event.target.closest('.unlock-link')
      ) {
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

  bindContextMenuGuard() {
    if (!this.viewport) {
      return;
    }

    this.viewport.addEventListener(
      'contextmenu',
      (event) => {
        event.preventDefault();
      },
      { capture: true }
    );
  }

  bindConnectorPointCreation() {
    if (!this.linksLayer) {
      return;
    }

    const handleAddPoint = (event) => {
      const isSecondary =
        event.type === 'contextmenu' ||
        event.button === 2 ||
        (event.button === 0 && event.ctrlKey);
      if (!isSecondary) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const boardPoint = this.getBoardCoordinatesFromClient(event.clientX, event.clientY);
      const explicitTarget = event.target?.closest?.('[data-link-key]');
      const explicitKey =
        explicitTarget && typeof explicitTarget.dataset?.linkKey === 'string'
          ? explicitTarget.dataset.linkKey
          : null;
      const nearestRecord = explicitKey
        ? this.linkRecords.find((record) => record.key === explicitKey) || null
        : this.findNearestLinkRecord(boardPoint.x, boardPoint.y, 72);

      if (!nearestRecord) {
        return;
      }

      this.addLinkPoint(nearestRecord.key, boardPoint.x, boardPoint.y);
    };

    this.linksLayer.addEventListener('contextmenu', handleAddPoint);
    this.linksLayer.addEventListener('dblclick', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const boardPoint = this.getBoardCoordinatesFromClient(event.clientX, event.clientY);
      const explicitTarget = event.target?.closest?.('[data-link-key]');
      const explicitKey =
        explicitTarget && typeof explicitTarget.dataset?.linkKey === 'string'
          ? explicitTarget.dataset.linkKey
          : null;
      const nearestRecord = explicitKey
        ? this.linkRecords.find((record) => record.key === explicitKey) || null
        : this.findNearestLinkRecord(boardPoint.x, boardPoint.y, 72);
      if (!nearestRecord) {
        return;
      }
      this.addLinkPoint(nearestRecord.key, boardPoint.x, boardPoint.y);
    });
  }

  bindDoubleClickGuard() {
    if (!this.viewport) {
      return;
    }

    this.viewport.addEventListener(
      'dblclick',
      (event) => {
        if (event.target.closest('.unlock-style-menu')) {
          return;
        }
        event.preventDefault();
      },
      { capture: true }
    );
  }

  bindWheelNavigation() {
    if (!this.viewport) {
      return;
    }

    this.viewport.addEventListener(
      'wheel',
      (event) => {
        if (event.target.closest('.unlock-style-menu')) {
          return;
        }

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

    this.hideStyleMenu();
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

  getLaneIdFromRarity(rarity) {
    const laneId = rarity || 'common';
    return RARITY_LANES.some((lane) => lane.id === laneId) ? laneId : 'common';
  }

  getLaneIndexById(laneId) {
    const index = RARITY_LANES.findIndex((lane) => lane.id === laneId);
    return index >= 0 ? index : 0;
  }

  getLaneGridMetrics(laneId) {
    const laneIndex = this.getLaneIndexById(laneId);
    const laneTop = LANE_START_Y + laneIndex * LANE_HEIGHT;
    const gridLeft = LANE_X_PADDING;
    const gridTop = laneTop + LANE_ROW_OFFSET;
    const gridWidth = MAP_WIDTH - LANE_X_PADDING * 2;
    const gridHeight = LANE_HEIGHT - LANE_ROW_OFFSET - LANE_BOTTOM_PADDING;
    return {
      laneTop,
      gridLeft,
      gridTop,
      gridWidth,
      gridHeight,
      cellWidth: gridWidth / GRID_COLUMNS_PER_LANE,
      cellHeight: gridHeight / GRID_ROWS_PER_LANE,
    };
  }

  getGridCellPosition(laneId, row, column) {
    const metrics = this.getLaneGridMetrics(laneId);
    const snappedRow = Math.max(0, Math.min(GRID_ROWS_PER_LANE - 1, row));
    const snappedColumn = Math.max(0, Math.min(GRID_COLUMNS_PER_LANE - 1, column));
    const x = Math.round(
      metrics.gridLeft + snappedColumn * metrics.cellWidth + (metrics.cellWidth - NODE_WIDTH) * 0.5
    );
    const y = Math.round(
      metrics.gridTop + snappedRow * metrics.cellHeight + (metrics.cellHeight - NODE_HEIGHT) * 0.5
    );
    return { x, y, row: snappedRow, column: snappedColumn };
  }

  snapNodeToGrid(x, y, laneId) {
    const metrics = this.getLaneGridMetrics(laneId);
    const centerX = x + NODE_WIDTH * 0.5;
    const centerY = y + NODE_HEIGHT * 0.5;
    const column = Math.round((centerX - metrics.gridLeft - metrics.cellWidth * 0.5) / metrics.cellWidth);
    const row = Math.round((centerY - metrics.gridTop - metrics.cellHeight * 0.5) / metrics.cellHeight);
    return this.getGridCellPosition(laneId, row, column);
  }

  inferLaneIdFromY(y) {
    const centerY = y + NODE_HEIGHT * 0.5;
    const laneIndex = Math.max(
      0,
      Math.min(RARITY_LANES.length - 1, Math.floor((centerY - LANE_START_Y) / LANE_HEIGHT))
    );
    return RARITY_LANES[laneIndex]?.id || 'common';
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
    for (let i = 0; i < itemCount; i += 1) {
      const target = Math.round(i * step);
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

  buildPoint(x, y, level = 0, laneId = null) {
    return {
      x,
      y,
      centerX: x + NODE_WIDTH / 2,
      centerY: y + NODE_HEIGHT / 2,
      level,
      laneId,
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

  updateNodePosition(critterId, x, y, laneId = null) {
    const existing = this.currentPositions.get(critterId);
    const level = existing?.level ?? 0;
    const resolvedLaneId = laneId || existing?.laneId || this.inferLaneIdFromY(y);
    const snapped = this.snapNodeToGrid(x, y, resolvedLaneId);
    const nextPoint = this.buildPoint(snapped.x, snapped.y, level, resolvedLaneId);
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

  buildLinkPathFromWaypoints(waypoints = []) {
    if (!Array.isArray(waypoints) || waypoints.length < 2) {
      return '';
    }

    let pathData = `M ${waypoints[0].x} ${waypoints[0].y}`;
    for (let index = 0; index < waypoints.length - 1; index += 1) {
      const start = waypoints[index];
      const end = waypoints[index + 1];
      const deltaY = end.y - start.y;
      const direction = deltaY === 0 ? 1 : Math.sign(deltaY);
      const controlOffset = Math.max(50, Math.abs(deltaY) * 0.55);
      const control1X = start.x;
      const control1Y = start.y + direction * controlOffset;
      const control2X = end.x;
      const control2Y = end.y - direction * controlOffset;
      pathData += ` C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${end.x} ${end.y}`;
    }

    return pathData;
  }

  positionLinkPointElement(element, point) {
    if (!element || !point) {
      return;
    }

    element.style.left = `${point.x}px`;
    element.style.top = `${point.y}px`;
  }

  bindLinkPointDrag(element, record, point) {
    let dragState = null;

    const deletePoint = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.removeLinkPoint(record.key, point.id);
    };

    element.addEventListener('contextmenu', deletePoint);

    element.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) {
        return;
      }

      dragState = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: point.x,
        startY: point.y,
      };
      element.classList.add('is-dragging-point');
      element.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    });

    element.addEventListener('pointermove', (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      const dx = (event.clientX - dragState.startClientX) / this.scale;
      const dy = (event.clientY - dragState.startClientY) / this.scale;
      point.x = Math.round(this.clampNumber(dragState.startX + dx, 0, MAP_WIDTH, dragState.startX));
      point.y = Math.round(this.clampNumber(dragState.startY + dy, 0, MAP_HEIGHT, dragState.startY));
      this.positionLinkPointElement(element, point);
      this.updateLinkPaths();
      event.preventDefault();
      event.stopPropagation();
    });

    const onPointerFinish = (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }
      element.classList.remove('is-dragging-point');
      dragState = null;
      event.preventDefault();
      event.stopPropagation();
    };

    element.addEventListener('pointerup', onPointerFinish);
    element.addEventListener('pointercancel', onPointerFinish);
  }

  renderLinkPointHandles() {
    if (!this.pointsLayer) {
      return;
    }

    this.pointsLayer.innerHTML = '';
    this.linkRecords.forEach((record) => {
      record.pointElements = [];
      record.points.forEach((point) => {
        const handle = document.createElement('button');
        handle.type = 'button';
        handle.className = 'unlock-link-point';
        handle.dataset.linkKey = record.key;
        handle.dataset.pointId = point.id;
        handle.setAttribute('aria-label', 'Path control point');
        this.positionLinkPointElement(handle, point);
        this.bindLinkPointDrag(handle, record, point);
        this.pointsLayer.appendChild(handle);
        record.pointElements.push(handle);
      });
    });

    this.pointsLayer.hidden = !this.linkPointsVisible;
  }

  addLinkPoint(linkKey, x, y) {
    if (!this.activeCategoryId || !linkKey) {
      return;
    }

    const points = this.getLinkPoints(this.activeCategoryId, linkKey);
    const nextPoint = {
      id: this.generateLinkPointId(),
      x: Math.round(this.clampNumber(x, 0, MAP_WIDTH, 0)),
      y: Math.round(this.clampNumber(y, 0, MAP_HEIGHT, 0)),
    };

    const insertionIndex = this.resolveLinkPointInsertionIndex(linkKey, nextPoint);
    if (!Number.isFinite(insertionIndex)) {
      points.push(nextPoint);
    } else {
      points.splice(insertionIndex, 0, nextPoint);
    }

    this.renderLinkPointHandles();
    this.updateLinkPaths();
  }

  removeLinkPoint(linkKey, pointId) {
    if (!this.activeCategoryId || !linkKey || !pointId) {
      return;
    }

    const points = this.getLinkPoints(this.activeCategoryId, linkKey);
    const pointIndex = points.findIndex((point) => point.id === pointId);
    if (pointIndex < 0) {
      return;
    }

    points.splice(pointIndex, 1);
    this.renderLinkPointHandles();
    this.updateLinkPaths();
  }

  getLinkWaypoints(record) {
    if (!record) {
      return [];
    }

    const source = this.currentPositions.get(record.sourceId);
    const target = this.currentPositions.get(record.targetId);
    if (!source || !target) {
      return [];
    }

    const start = {
      x: source.centerX,
      y: source.centerY + NODE_HEIGHT / 2 - 4,
    };
    const end = {
      x: target.centerX,
      y: target.centerY - NODE_HEIGHT / 2 + 4,
    };

    return [start, ...(record.points || []), end];
  }

  findNearestLinkRecord(x, y, maxDistance = 72) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !this.linkRecords.length) {
      return null;
    }

    let nearest = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    this.linkRecords.forEach((record) => {
      const waypoints = this.getLinkWaypoints(record);
      if (waypoints.length < 2) {
        return;
      }

      for (let index = 0; index < waypoints.length - 1; index += 1) {
        const segmentStart = waypoints[index];
        const segmentEnd = waypoints[index + 1];
        const segmentDistance = this.getDistanceToSegment(
          x,
          y,
          segmentStart.x,
          segmentStart.y,
          segmentEnd.x,
          segmentEnd.y
        );
        if (segmentDistance < nearestDistance) {
          nearestDistance = segmentDistance;
          nearest = record;
        }
      }
    });

    if (!nearest || nearestDistance > maxDistance) {
      return null;
    }

    return nearest;
  }

  resolveLinkPointInsertionIndex(linkKey, nextPoint) {
    const record = this.linkRecords.find((entry) => entry.key === linkKey);
    if (!record || !nextPoint) {
      return Number.NaN;
    }

    const waypoints = this.getLinkWaypoints(record);
    if (waypoints.length < 2) {
      return Number.NaN;
    }

    let bestSegmentIndex = waypoints.length - 2;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < waypoints.length - 1; index += 1) {
      const segmentStart = waypoints[index];
      const segmentEnd = waypoints[index + 1];
      const distance = this.getDistanceToSegment(
        nextPoint.x,
        nextPoint.y,
        segmentStart.x,
        segmentStart.y,
        segmentEnd.x,
        segmentEnd.y
      );
      if (distance < bestDistance) {
        bestDistance = distance;
        bestSegmentIndex = index;
      }
    }

    return Math.max(0, Math.min(record.points.length, bestSegmentIndex));
  }

  getDistanceToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) {
      return Math.hypot(px - x1, py - y1);
    }

    const projection = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
    const t = Math.max(0, Math.min(1, projection));
    const nearestX = x1 + t * dx;
    const nearestY = y1 + t * dy;
    return Math.hypot(px - nearestX, py - nearestY);
  }

  updateLinkPaths() {
    const categoryId = this.activeCategoryId;
    const linkStyles = categoryId ? this.linkStylesByCategory.get(categoryId) : null;

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
      const waypoints = [{ x: startX, y: startY }, ...record.points, { x: endX, y: endY }];
      const pathData = this.buildLinkPathFromWaypoints(waypoints);
      record.path.setAttribute('d', pathData);
      if (record.hitPath) {
        record.hitPath.setAttribute('d', pathData);
      }

      const directStyle = linkStyles?.get(record.key) || null;
      const inheritedStyle = this.getResolvedIncomingLineStyle(categoryId, record.targetId);
      const hue = Number.isFinite(directStyle?.hue)
        ? directStyle.hue
        : inheritedStyle.hue;
      const saturation = Number.isFinite(directStyle?.saturation)
        ? directStyle.saturation
        : inheritedStyle.saturation;
      const lightness = Number.isFinite(directStyle?.lightness)
        ? directStyle.lightness
        : inheritedStyle.lightness;
      const width = Number.isFinite(directStyle?.width)
        ? directStyle.width
        : inheritedStyle.width;

      record.path.style.setProperty('--link-hue', String(hue));
      record.path.style.setProperty('--link-saturation', String(saturation));
      record.path.style.setProperty('--link-lightness', String(lightness));
      record.path.style.setProperty('--link-width', `${width}px`);

      if (Array.isArray(record.pointElements) && record.pointElements.length) {
        record.pointElements.forEach((element, index) => {
          const point = record.points[index];
          if (!point) {
            return;
          }
          this.positionLinkPointElement(element, point);
        });
      }
    });
  }

  bindNodeDrag(node, critterId, laneId, critter) {
    let nodeDragState = null;
    let suppressNextClick = false;

    node.addEventListener('pointerdown', (event) => {
      const isSecondaryClick = event.button === 2 || (event.button === 0 && event.ctrlKey);
      if (isSecondaryClick) {
        event.preventDefault();
        event.stopPropagation();
        this.showNodeStyleMenu({
          critter,
          clientX: event.clientX,
          clientY: event.clientY,
        });
        return;
      }

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
      this.updateNodePosition(critterId, nodeDragState.startX + dx, nodeDragState.startY + dy, laneId);
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

    const positions = new Map();
    const lanes = new Map();

    const crittersByLane = new Map(RARITY_LANES.map((lane) => [lane.id, []]));
    categoryCritters.forEach((critter) => {
      const laneId = this.getLaneIdFromRarity(critter.rarity);
      if (!crittersByLane.has(laneId)) {
        crittersByLane.set(laneId, []);
      }
      crittersByLane.get(laneId).push(critter);
    });

    RARITY_LANES.forEach((lane, laneIndex) => {
      const laneTop = LANE_START_Y + laneIndex * LANE_HEIGHT;
      const laneCritters = (crittersByLane.get(lane.id) || []).slice();
      laneCritters.sort((left, right) => {
        const levelDiff = getRequirementLevel(left) - getRequirementLevel(right);
        if (levelDiff !== 0) {
          return levelDiff;
        }
        const leftPrimary = getPrimaryRequirement(left)?.critterId || '';
        const rightPrimary = getPrimaryRequirement(right)?.critterId || '';
        if (leftPrimary !== rightPrimary) {
          return leftPrimary.localeCompare(rightPrimary);
        }
        return left.name.localeCompare(right.name);
      });

      const groupedByLevel = new Map();
      laneCritters.forEach((critter) => {
        const level = getRequirementLevel(critter);
        if (!groupedByLevel.has(level)) {
          groupedByLevel.set(level, []);
        }
        groupedByLevel.get(level).push(critter);
      });

      const sortedLevels = Array.from(groupedByLevel.keys()).sort((left, right) => left - right);
      const levelRows = this.buildSlotIndices(sortedLevels.length, GRID_ROWS_PER_LANE);
      const usedCells = new Set();

      sortedLevels.forEach((level, levelIndex) => {
        const row = levelRows[levelIndex] ?? Math.min(GRID_ROWS_PER_LANE - 1, levelIndex);
        const rowCritters = groupedByLevel.get(level) || [];
        const plannedColumns = this.buildSlotIndices(rowCritters.length, GRID_COLUMNS_PER_LANE);

        rowCritters.forEach((critter, critterIndex) => {
          const preferredColumn = plannedColumns[critterIndex] ?? 0;
          let column = preferredColumn;
          let rowCandidate = row;
          let key = `${rowCandidate}:${column}`;

          if (usedCells.has(key)) {
            let best = null;
            for (let scanRow = 0; scanRow < GRID_ROWS_PER_LANE; scanRow += 1) {
              for (let scanColumn = 0; scanColumn < GRID_COLUMNS_PER_LANE; scanColumn += 1) {
                const scanKey = `${scanRow}:${scanColumn}`;
                if (usedCells.has(scanKey)) {
                  continue;
                }
                const distance = Math.abs(scanRow - row) + Math.abs(scanColumn - preferredColumn);
                if (!best || distance < best.distance) {
                  best = {
                    row: scanRow,
                    column: scanColumn,
                    distance,
                  };
                }
              }
            }

            if (best) {
              rowCandidate = best.row;
              column = best.column;
              key = `${rowCandidate}:${column}`;
            }
          }

          usedCells.add(key);
          const cell = this.getGridCellPosition(lane.id, rowCandidate, column);
          positions.set(critter.id, this.buildPoint(cell.x, cell.y, level, lane.id));
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
        const laneId = existingPoint?.laneId || this.getLaneIdFromRarity(critter.rarity);
        const snapped = this.snapNodeToGrid(override.x, override.y, laneId);
        positions.set(critter.id, this.buildPoint(snapped.x, snapped.y, level, laneId));
      });
    }

    return {
      categoryCritters,
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
        gridColumnsPerRarity: GRID_COLUMNS_PER_LANE,
        gridRowsPerRarity: GRID_ROWS_PER_LANE,
      },
      categories: {},
    };

    categoryIds.forEach((categoryId) => {
      const { categoryCritters, positions } = this.buildCategoryLayout(categoryId);
      const categoryLabel =
        this.categories.find((category) => category.id === categoryId)?.label || prettify(categoryId);
      const nodeStyles = this.nodeStylesByCategory.get(categoryId) || null;
      const linkStyles = this.linkStylesByCategory.get(categoryId) || null;
      const linkPoints = this.linkPointsByCategory.get(categoryId) || null;

      payload.categories[categoryId] = {
        label: categoryLabel,
        critters: categoryCritters.map((critter) => {
          const point = positions.get(critter.id) || {};
          const style = nodeStyles?.get(critter.id) || null;
          return {
            id: critter.id,
            name: critter.name,
            rarity: critter.rarity || 'common',
            level: getRequirementLevel(critter),
            x: point.x ?? 0,
            y: point.y ?? 0,
            style: style
              ? {
                  textScale: style.textScale,
                  hue: style.hue,
                  saturation: style.saturation,
                  lightness: style.lightness,
                  inputHue: Number.isFinite(style.inputHue) ? style.inputHue : null,
                  inputSaturation: Number.isFinite(style.inputSaturation)
                    ? style.inputSaturation
                    : null,
                  inputLightness: Number.isFinite(style.inputLightness)
                    ? style.inputLightness
                    : null,
                  inputWidth: Number.isFinite(style.inputWidth) ? style.inputWidth : DEFAULT_INPUT_WIDTH,
                }
              : null,
            requirements: getUnlockRequirements(critter),
          };
        }),
        lines: categoryCritters.flatMap((critter) => {
          const requirements = getUnlockRequirements(critter);
          return requirements
            .map((requirement, requirementIndex) => {
              const key = `${requirement.critterId}->${critter.id}#${requirementIndex}`;
              const style = linkStyles?.get(key) || null;
              const points = linkPoints?.get(key) || [];
              if (!style && !points.length) {
                return null;
              }
              const lineEntry = {
                key,
                sourceId: requirement.critterId,
                targetId: critter.id,
                points: points.map((point) => ({
                  id: point.id,
                  x: Math.round(point.x),
                  y: Math.round(point.y),
                })),
              };

              if (style) {
                lineEntry.hue = style.hue;
                lineEntry.saturation = Number.isFinite(style.saturation)
                  ? style.saturation
                  : DEFAULT_LINK_SATURATION;
                lineEntry.lightness = Number.isFinite(style.lightness)
                  ? style.lightness
                  : DEFAULT_LINK_LIGHTNESS;
                lineEntry.width = style.width;
              }

              return lineEntry;
            })
            .filter((entry) => entry);
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
    if (!this.nodesLayer || !this.lanesLayer || !this.linksLayer || !this.pointsLayer) {
      return;
    }
    const { categoryCritters, positions, lanes } = this.buildCategoryLayout(this.activeCategoryId);
    this.nodeButtons.clear();
    this.currentPositions = new Map(positions);
    this.linkRecords = [];
    this.linksLayer.innerHTML = '';
    this.pointsLayer.innerHTML = '';
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
      laneRow.style.setProperty('--grid-cols', String(GRID_COLUMNS_PER_LANE));
      laneRow.style.setProperty('--grid-rows', String(GRID_ROWS_PER_LANE));
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
        `;

        const shouldSuppressClick = this.bindNodeDrag(node, critter.id, lane.id, critter);
        node.addEventListener('click', () => {
          if (shouldSuppressClick()) {
            return;
          }
          const nextId = this.activeCritterId === critter.id ? null : critter.id;
          this.setActiveCritter(nextId);
          this.bus?.emit?.('critter:selected', nextId);
        });
        const openNodeMenu = (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.showNodeStyleMenu({
            critter,
            clientX: event.clientX,
            clientY: event.clientY,
          });
        };
        node.addEventListener('contextmenu', (event) => {
          openNodeMenu(event);
        });
        node.addEventListener('auxclick', (event) => {
          if (event.button !== 2) {
            return;
          }
          openNodeMenu(event);
        });

        this.nodesLayer.appendChild(node);
        this.nodeButtons.set(critter.id, node);
        this.applyNodeVisualStyle(critter.id);
      });
    });

    categoryCritters.forEach((critter) => {
      const requirements = getUnlockRequirements(critter);
      if (!requirements.length) {
        return;
      }

      requirements.forEach((requirement, requirementIndex) => {
        if (!positions.has(requirement.critterId) || !positions.has(critter.id)) {
          return;
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'unlock-link');
        const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hitPath.setAttribute('class', 'unlock-link-hitbox');
        const linkKey = `${requirement.critterId}->${critter.id}#${requirementIndex}`;
        path.dataset.linkKey = linkKey;
        hitPath.dataset.linkKey = linkKey;
        this.linksLayer.appendChild(path);
        this.linksLayer.appendChild(hitPath);
        const points = this.getLinkPoints(this.activeCategoryId, linkKey);
        this.linkRecords.push({
          path,
          hitPath,
          key: linkKey,
          sourceId: requirement.critterId,
          targetId: critter.id,
          points,
          pointElements: [],
        });
      });
    });

    this.renderLinkPointHandles();
    this.updateLinkPaths();

    this.setActiveCritter(null);
  }
}
