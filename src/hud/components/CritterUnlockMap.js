import { critterMapDefaultLayout } from '../../data/critterMapDefaultLayout.js';
import {
  DEFAULT_PHASE_FILTER,
  getPhaseOptionValue,
  isPhaseVisibleForFilter,
  normalizePhaseFilter,
  normalizePhaseValue,
  PHASE_OPTIONS,
  PHASE_UNASSIGNED,
} from '../../utils/phaseUtils.js';

const LOGICAL_MAP_WIDTH = 1700;
const MAP_WIDTH = 12000;
const MAP_HEIGHT = 3980;
const LANE_START_Y = 88;
const LANE_HEIGHT = 760;
const GRID_ROWS_PER_LANE = 7;
const GRID_COLUMNS_PER_LANE = 9;
const MIN_GRID_ROWS_PER_LANE = 5;
const MIN_GRID_COLUMNS_PER_LANE = 5;
const NODE_WIDTH = 176;
const NODE_HEIGHT = 84;
const LANE_ROW_OFFSET = 58;
const LANE_BOTTOM_PADDING = 48;
const LANE_X_PADDING = 34;
const DEFAULT_PAN = { x: 38, y: 30 };
const PAN_MARGIN = 82;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2.6;
const DEFAULT_VISUAL_SCALE = 0.5;
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
const LAYOUT_DRAFT_STORAGE_KEY = 'critz:critter-unlock-map:draft';

const RARITY_LANES = [
  { id: 'common', label: 'Common' },
  { id: 'uncommon', label: 'Uncommon' },
  { id: 'rare', label: 'Rare' },
  { id: 'extinct', label: 'Extinct' },
  { id: 'mythical', label: 'Mythical' },
];

const LANE_VISUAL_GAP = 14;
const LANE_VISUAL_SIDE_OUTSET = LANE_X_PADDING - 18;
const BASE_GRID_HEIGHT = LANE_HEIGHT - LANE_ROW_OFFSET - LANE_BOTTOM_PADDING;
const BASE_GRID_WIDTH = LOGICAL_MAP_WIDTH - LANE_X_PADDING * 2;
const BASE_GRID_CELL_HEIGHT = BASE_GRID_HEIGHT / GRID_ROWS_PER_LANE;
const BASE_GRID_CELL_WIDTH = BASE_GRID_WIDTH / GRID_COLUMNS_PER_LANE;
const INTERNAL_CENTER_X = MAP_WIDTH * 0.5;
const BOARD_BOTTOM_PADDING = Math.max(
  0,
  MAP_HEIGHT - (LANE_START_Y + RARITY_LANES.length * LANE_HEIGHT)
);

const prettify = (value = '') =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const clampColorChannel = (value) => Math.max(0, Math.min(255, Math.round(Number(value) || 0)));

const rgbToHex = ({ r = 0, g = 0, b = 0 } = {}) =>
  `#${[r, g, b]
    .map((channel) => clampColorChannel(channel).toString(16).padStart(2, '0'))
    .join('')}`;

const parseHexColor = (value = '') => {
  const normalized = String(value || '')
    .trim()
    .replace(/^#/, '')
    .toLowerCase();

  if (/^[0-9a-f]{3}$/.test(normalized)) {
    const [r, g, b] = normalized.split('').map((char) => `${char}${char}`);
    return {
      r: Number.parseInt(r, 16),
      g: Number.parseInt(g, 16),
      b: Number.parseInt(b, 16),
    };
  }

  if (/^[0-9a-f]{6}$/.test(normalized)) {
    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
    };
  }

  return null;
};

const hslToRgb = ({ hue = 0, saturation = 100, lightness = 50 } = {}) => {
  const h = ((Number(hue) % 360) + 360) % 360;
  const s = Math.max(0, Math.min(100, Number(saturation) || 0)) / 100;
  const l = Math.max(0, Math.min(100, Number(lightness) || 0)) / 100;

  if (s === 0) {
    const channel = Math.round(l * 255);
    return { r: channel, g: channel, b: channel };
  }

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hueSection = h / 60;
  const x = c * (1 - Math.abs((hueSection % 2) - 1));
  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hueSection >= 0 && hueSection < 1) {
    rPrime = c;
    gPrime = x;
  } else if (hueSection < 2) {
    rPrime = x;
    gPrime = c;
  } else if (hueSection < 3) {
    gPrime = c;
    bPrime = x;
  } else if (hueSection < 4) {
    gPrime = x;
    bPrime = c;
  } else if (hueSection < 5) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  const m = l - c / 2;
  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
};

const rgbToHsl = ({ r = 0, g = 0, b = 0 } = {}) => {
  const red = clampColorChannel(r) / 255;
  const green = clampColorChannel(g) / 255;
  const blue = clampColorChannel(b) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }
  }

  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    hue: Math.round(hue),
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100),
  };
};

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
    this.laneControlsLayer = null;
    this.nodesLayer = null;
    this.zoomLabel = zoomElement || null;

    this.activeCategoryId = null;
    this.activeCritterId = null;
    this.nodeButtons = new Map();
    this.currentPositions = new Map();
    this.linkRecords = [];
    this.customPositionsByCategory = new Map();
    this.categoryLaneDimensionsByCategory = new Map();
    this.nodeStylesByCategory = new Map();
    this.linkStylesByCategory = new Map();
    this.linkPointsByCategory = new Map();
    this.critterImagePreviewStates = new Map();
    this.autoTextSizeCache = new Map();
    this.wordFitSizeCache = new Map();
    this.styleMenu = null;
    this.dismissStyleMenu = null;
    this.actionMenu = null;
    this.dismissActionMenu = null;
    this.removeEditorListeners = [];
    this.editorBusBound = false;

    this.pan = { ...DEFAULT_PAN };
    this.scale = DEFAULT_VISUAL_SCALE;
    this.panDragState = null;
    this.panningEnabled = true;
    this.addNodesModeEnabled = false;
    this.panningBeforeAddNodes = null;
    this.linkPointsVisible = true;
    this.linkPointIdSequence = 1;
    this.defaultGridRows = GRID_ROWS_PER_LANE;
    this.defaultGridColumns = GRID_COLUMNS_PER_LANE;
    this.layoutBoardWidth = LOGICAL_MAP_WIDTH;
    this.activeBoardWidth = LOGICAL_MAP_WIDTH;
    this.layoutBoardHeight = MAP_HEIGHT;
    this.activeBoardHeight = MAP_HEIGHT;
    this.activePhaseFilter = DEFAULT_PHASE_FILTER;

    this.loadDefaultLayout(critterMapDefaultLayout);
    this.loadPersistedDraft();
  }

  loadDefaultLayout(layoutSource = {}) {
    if (!layoutSource || typeof layoutSource !== 'object') {
      return;
    }

    const defaultRows = Number(layoutSource?.board?.gridRowsPerRarity);
    const defaultColumns = Number(layoutSource?.board?.gridColumnsPerRarity);
    const layoutBoardWidth = Number(layoutSource?.board?.width);
    const layoutBoardHeight = Number(layoutSource?.board?.height);
    if (Number.isFinite(defaultRows)) {
      this.defaultGridRows = this.normalizeLaneRowCount(defaultRows, GRID_ROWS_PER_LANE);
    }
    if (Number.isFinite(defaultColumns)) {
      this.defaultGridColumns = this.normalizeLaneColumnCount(defaultColumns, GRID_COLUMNS_PER_LANE);
    }
    if (Number.isFinite(layoutBoardWidth)) {
      this.layoutBoardWidth = Math.max(LOGICAL_MAP_WIDTH, Math.round(layoutBoardWidth));
      this.activeBoardWidth = this.layoutBoardWidth;
    }
    if (Number.isFinite(layoutBoardHeight)) {
      this.layoutBoardHeight = Math.max(MAP_HEIGHT, Math.round(layoutBoardHeight));
      this.activeBoardHeight = this.layoutBoardHeight;
    }

    const resolvedLayoutBoardWidth = this.layoutBoardWidth;

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
          positionsByCritter.set(critterId, {
            x: this.translateLayoutXToWorld(x, resolvedLayoutBoardWidth),
            y: Math.round(y),
          });
        });
      });
    };

    if (layoutSource.categories && typeof layoutSource.categories === 'object') {
      Object.entries(layoutSource.categories).forEach(([categoryId, categoryEntry]) => {
        const positionsByCritter = this.ensureCategoryCustomPositions(categoryId);
        this.applyStoredLaneDimensions(categoryId, categoryEntry?.lanes);
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
              positionsByCritter.set(critterId, {
                x: this.translateLayoutXToWorld(x, resolvedLayoutBoardWidth),
                y: Math.round(y),
              });
            }

            if (critter?.style && typeof critter.style === 'object') {
              nodeStyles.set(critterId, this.normalizeNodeStyle(critter.style));
            }

            const imageView = this.normalizeImagePreviewState(
              critter?.imageView ?? critter?.preview?.imageView
            );
            if (imageView) {
              this.critterImagePreviewStates.set(critterId, imageView);
            }

            if ('phase' in (critter || {})) {
              this.setCritterPhase(critterId, critter.phase, {
                refresh: false,
                persistDraft: false,
              });
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
              linkPoints.set(key, this.normalizeLinkPoints(rawPoints, resolvedLayoutBoardWidth));
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

  normalizeVector3Like(value) {
    if (Array.isArray(value) && value.length >= 3) {
      const [x, y, z] = value.map((entry) => Number(entry));
      if ([x, y, z].every((entry) => Number.isFinite(entry))) {
        return { x, y, z };
      }
      return null;
    }

    const x = Number(value?.x);
    const y = Number(value?.y);
    const z = Number(value?.z);
    if ([x, y, z].every((entry) => Number.isFinite(entry))) {
      return { x, y, z };
    }

    return null;
  }

  normalizeImagePreviewState(source) {
    if (!source || typeof source !== 'object') {
      return null;
    }

    const position = this.normalizeVector3Like(
      source.position ?? source.cameraPosition ?? source.camera?.position
    );
    const target = this.normalizeVector3Like(
      source.target ?? source.cameraTarget ?? source.camera?.target
    );

    if (!position || !target) {
      return null;
    }

    return {
      position: { ...position },
      target: { ...target },
    };
  }

  cloneImagePreviewState(source) {
    const normalized = this.normalizeImagePreviewState(source);
    if (!normalized) {
      return null;
    }

    return {
      position: { ...normalized.position },
      target: { ...normalized.target },
    };
  }

  resolvePreviewState(previewStates, critterId) {
    const external =
      previewStates instanceof Map
        ? previewStates.get(critterId)
        : previewStates && typeof previewStates === 'object'
          ? previewStates[critterId]
          : null;
    return this.cloneImagePreviewState(external) || this.cloneImagePreviewState(this.critterImagePreviewStates.get(critterId));
  }

  getCritterImagePreviewStateMap() {
    const snapshot = new Map();
    this.critterImagePreviewStates.forEach((value, critterId) => {
      const cloned = this.cloneImagePreviewState(value);
      if (cloned) {
        snapshot.set(critterId, cloned);
      }
    });
    return snapshot;
  }

  getStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    return window.localStorage;
  }

  loadPersistedDraft() {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    try {
      const raw = storage.getItem(LAYOUT_DRAFT_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      this.loadDefaultLayout(parsed);
    } catch (error) {
      console.warn('Unable to restore critter layout draft.', error);
      storage.removeItem(LAYOUT_DRAFT_STORAGE_KEY);
    }
  }

  persistDraft() {
    const storage = this.getStorage();
    if (!storage) {
      return false;
    }

    try {
      const payload = this.buildLayoutSnapshotPayload();
      storage.setItem(LAYOUT_DRAFT_STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (error) {
      console.warn('Unable to persist critter layout draft.', error);
      return false;
    }
  }

  getBoardOffsetX(boardWidth = this.getCurrentBoardWidth()) {
    return INTERNAL_CENTER_X - boardWidth * 0.5;
  }

  translateLayoutXToWorld(x, boardWidth = this.layoutBoardWidth) {
    return Math.round(Number(x) + this.getBoardOffsetX(boardWidth));
  }

  translateWorldXToLayout(x, boardWidth = this.getCurrentBoardWidth()) {
    return Math.round(Number(x) - this.getBoardOffsetX(boardWidth));
  }

  getCurrentBoardWidth() {
    return Math.max(LOGICAL_MAP_WIDTH, Number(this.activeBoardWidth) || 0);
  }

  getCurrentBoardOffsetX() {
    return this.getBoardOffsetX(this.getCurrentBoardWidth());
  }

  getRenderableX(worldX, boardOffsetX = this.getCurrentBoardOffsetX()) {
    return Math.round(worldX - boardOffsetX);
  }

  normalizeLinkPoints(points = [], boardWidth = this.layoutBoardWidth) {
    const maxBoardHeight = Math.max(this.layoutBoardHeight, this.getCurrentBoardHeight());
    return points
      .filter((point) => Number.isFinite(Number(point?.x)) && Number.isFinite(Number(point?.y)))
      .map((point) => ({
        id: this.resolveLinkPointId(point?.id),
        x: Math.round(
          this.clampNumber(this.translateLayoutXToWorld(point.x, boardWidth), 0, MAP_WIDTH, 0)
        ),
        y: Math.round(this.clampNumber(point.y, 0, maxBoardHeight, 0)),
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
    const previousGlow = previous.glow === true;

    return {
      textScale: this.clampNumber(nextScale, 65, 220, DEFAULT_NODE_TEXT_SCALE),
      hue: this.clampNumber(style.hue, 0, 360, fallbackHue),
      saturation: this.clampNumber(style.saturation, 10, 100, fallbackSaturation),
      lightness: this.clampNumber(style.lightness, 14, 84, fallbackLightness),
      glow: typeof style.glow === 'boolean' ? style.glow : previousGlow,
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
    const boardOffsetX = this.getCurrentBoardOffsetX();
    const boardWidth = this.getCurrentBoardWidth();
    const boardX = (clientX - rect.left - this.pan.x) / this.scale;
    const boardY = (clientY - rect.top - this.pan.y) / this.scale;
    return {
      x: this.clampNumber(boardX + boardOffsetX, boardOffsetX, boardOffsetX + boardWidth, boardOffsetX),
      y: this.clampNumber(boardY, 0, this.getCurrentBoardHeight(), 0),
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

  setPanningEnabled(nextEnabled) {
    const requestedEnabled = Boolean(nextEnabled);
    this.panningEnabled = this.addNodesModeEnabled ? false : requestedEnabled;

    if (!this.panningEnabled) {
      if (
        this.viewport &&
        this.panDragState &&
        Number.isFinite(this.panDragState.pointerId) &&
        this.viewport.hasPointerCapture(this.panDragState.pointerId)
      ) {
        this.viewport.releasePointerCapture(this.panDragState.pointerId);
      }
      this.panDragState = null;
      if (this.viewport) {
        this.viewport.classList.remove('is-dragging');
      }
    }

    if (this.viewport) {
      this.viewport.classList.toggle('is-pan-disabled', !this.panningEnabled);
    }

    return this.panningEnabled;
  }

  togglePanningEnabled() {
    return this.setPanningEnabled(!this.panningEnabled);
  }

  isPanningEnabled() {
    return this.panningEnabled;
  }

  setAddNodesModeEnabled(nextEnabled) {
    const nextModeEnabled = Boolean(nextEnabled);
    const wasEnabled = this.addNodesModeEnabled;
    this.addNodesModeEnabled = nextModeEnabled;

    if (this.viewport) {
      this.viewport.classList.toggle('is-add-node-mode', this.addNodesModeEnabled);
    }
    if (this.linksLayer) {
      this.linksLayer.classList.toggle('is-add-node-mode', this.addNodesModeEnabled);
    }

    if (this.addNodesModeEnabled && !wasEnabled) {
      this.panningBeforeAddNodes = this.panningEnabled;
      this.setPanningEnabled(false);
      this.setLinkPointsVisible(true);
    } else if (!this.addNodesModeEnabled && wasEnabled) {
      const restorePanning = this.panningBeforeAddNodes;
      this.panningBeforeAddNodes = null;
      if (typeof restorePanning === 'boolean') {
        this.setPanningEnabled(restorePanning);
      }
    }

    return this.addNodesModeEnabled;
  }

  toggleAddNodesModeEnabled() {
    return this.setAddNodesModeEnabled(!this.addNodesModeEnabled);
  }

  isAddNodesModeEnabled() {
    return this.addNodesModeEnabled;
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
    this.persistDraft();
  }

  setLinkStyle(categoryId, linkKey, nextStyle) {
    if (!categoryId || !linkKey || !nextStyle) {
      return;
    }

    const categoryStyles = this.ensureCategoryLinkStyles(categoryId);
    const existing = categoryStyles.get(linkKey) || null;
    categoryStyles.set(linkKey, this.normalizeLinkStyle(nextStyle, existing));
    this.persistDraft();
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
    this.persistDraft();
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
    this.persistDraft();
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
    node.classList.toggle('is-glowing', style.glow === true);
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

  hideActionMenu() {
    if (this.dismissActionMenu) {
      this.dismissActionMenu();
      this.dismissActionMenu = null;
    }
    if (this.actionMenu) {
      this.actionMenu.hidden = true;
      this.actionMenu.innerHTML = '';
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

  positionActionMenu(clientX, clientY) {
    if (!this.actionMenu || !this.viewport) {
      return;
    }

    const viewportRect = this.viewport.getBoundingClientRect();
    const offsetX = clientX - viewportRect.left;
    const offsetY = clientY - viewportRect.top;
    const menuWidth = this.actionMenu.offsetWidth || 208;
    const menuHeight = this.actionMenu.offsetHeight || 120;
    this.actionMenu.style.left = `${Math.max(8, Math.min(offsetX + 8, viewportRect.width - menuWidth - 8))}px`;
    this.actionMenu.style.top = `${Math.max(8, Math.min(offsetY + 8, viewportRect.height - menuHeight - 8))}px`;
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

  bindActionMenuDismiss() {
    const onPointerDown = (event) => {
      if (!this.actionMenu || this.actionMenu.hidden) {
        return;
      }

      if (event.target === this.actionMenu || this.actionMenu.contains(event.target)) {
        return;
      }

      this.hideActionMenu();
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        this.hideActionMenu();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    this.dismissActionMenu = () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }

  showActionMenu({ clientX, clientY, title = '', actions = [] }) {
    if (!this.actionMenu || !Array.isArray(actions)) {
      return;
    }

    const resolvedActions = actions.filter(
      (entry) => entry && typeof entry.label === 'string' && typeof entry.onSelect === 'function'
    );
    if (!resolvedActions.length) {
      this.hideActionMenu();
      return;
    }

    this.hideStyleMenu();
    this.hideActionMenu();
    this.bindActionMenuDismiss();
    this.actionMenu.hidden = false;
    this.actionMenu.innerHTML = `
      ${
        title
          ? `<p class="unlock-action-menu__title">${title}</p>`
          : ''
      }
      <div class="unlock-action-menu__actions">
        ${resolvedActions
          .map(
            (entry, index) =>
              `<button type="button" data-action-index="${index}">${entry.label}</button>`
          )
          .join('')}
      </div>
    `;
    this.positionActionMenu(clientX, clientY);

    this.actionMenu.querySelectorAll('[data-action-index]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const index = Number(button.dataset.actionIndex);
        const selected = Number.isFinite(index) ? resolvedActions[index] : null;
        this.hideActionMenu();
        selected?.onSelect?.();
      });
    });
  }

  showNodeStyleMenu({ critter, clientX, clientY }) {
    if (!this.styleMenu || !this.activeCategoryId || !critter) {
      return;
    }

    this.hideActionMenu();
    this.hideStyleMenu();
    this.bindStyleMenuDismiss();
    const current = this.getResolvedNodeStyle(this.activeCategoryId, critter.id);
    const currentPhase = this.getCritterPhase(critter.id);
    const currentHex = rgbToHex(
      hslToRgb({
        hue: current.hue,
        saturation: current.saturation,
        lightness: current.lightness,
      })
    );
    this.styleMenu.hidden = false;
    this.styleMenu.innerHTML = `
      <p class="unlock-style-menu__title">Edit ${critter.name}</p>
      <label class="unlock-style-menu__field">
        <span>Text Scale</span>
        <input data-role="node-text-scale" type="range" min="65" max="220" step="1" value="${Math.round(current.textScale)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Box Color</span>
        <div class="unlock-style-menu__color-row">
          <input data-role="node-color-picker" class="unlock-style-menu__color-picker" type="color" value="${currentHex}" />
          <input
            data-role="node-color-hex"
            class="unlock-style-menu__hex-input"
            type="text"
            value="${currentHex.toUpperCase()}"
            inputmode="text"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      </label>
      <label class="unlock-style-menu__field">
        <span>Brightness</span>
        <input data-role="node-lightness" type="range" min="14" max="84" step="1" value="${Math.round(current.lightness)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Line Width</span>
        <input data-role="node-line-width" type="range" min="1" max="10" step="1" value="${Math.round(current.inputWidth)}" />
      </label>
      <label class="unlock-style-menu__toggle">
        <input data-role="node-glow" type="checkbox" ${current.glow ? 'checked' : ''} />
        <span>Glow With Box Color</span>
      </label>
      <label class="unlock-style-menu__field">
        <span>Phase</span>
        <select data-role="node-phase" class="unlock-style-menu__select">
          ${PHASE_OPTIONS.map(
            (option) => `
              <option value="${getPhaseOptionValue(option.value)}" ${
                normalizePhaseValue(option.value) === currentPhase ? 'selected' : ''
              }>
                ${option.label}
              </option>
            `
          ).join('')}
        </select>
      </label>
      <div class="unlock-style-menu__actions">
        <button type="button" data-action="reset-node-style">Reset Node Style</button>
      </div>
    `;

    this.positionStyleMenu(clientX, clientY);

    const textScaleInput = this.styleMenu.querySelector('[data-role="node-text-scale"]');
    const colorPickerInput = this.styleMenu.querySelector('[data-role="node-color-picker"]');
    const colorHexInput = this.styleMenu.querySelector('[data-role="node-color-hex"]');
    const lightnessInput = this.styleMenu.querySelector('[data-role="node-lightness"]');
    const lineWidthInput = this.styleMenu.querySelector('[data-role="node-line-width"]');
    const glowInput = this.styleMenu.querySelector('[data-role="node-glow"]');
    const phaseInput = this.styleMenu.querySelector('[data-role="node-phase"]');
    const resetButton = this.styleMenu.querySelector('[data-action="reset-node-style"]');

    const syncHexInput = (hexValue) => {
      colorPickerInput.value = hexValue;
      colorHexInput.value = hexValue.toUpperCase();
      colorHexInput.dataset.valid = 'true';
    };

    const commitNodeStyle = ({ preserveLightness = false } = {}) => {
      const parsedColor = parseHexColor(colorPickerInput.value) || parseHexColor(colorHexInput.value);
      const colorHsl = parsedColor ? rgbToHsl(parsedColor) : null;
      this.applyCritterEditorState(critter.id, {
        textScale: Number(textScaleInput.value),
        hue: colorHsl ? colorHsl.hue : current.hue,
        saturation: colorHsl ? colorHsl.saturation : current.saturation,
        lightness: preserveLightness && colorHsl ? Number(lightnessInput.value) : colorHsl ? colorHsl.lightness : current.lightness,
        inputWidth: Number(lineWidthInput.value),
        glow: glowInput.checked,
      });
    };

    textScaleInput.addEventListener('input', commitNodeStyle);
    colorPickerInput.addEventListener('input', () => {
      syncHexInput(colorPickerInput.value);
      const parsedColor = parseHexColor(colorPickerInput.value);
      if (parsedColor) {
        const nextHsl = rgbToHsl(parsedColor);
        lightnessInput.value = String(
          this.clampNumber(nextHsl.lightness, 14, 84, DEFAULT_NODE_LIGHTNESS)
        );
      }
      commitNodeStyle();
    });
    colorHexInput.addEventListener('input', () => {
      const parsedColor = parseHexColor(colorHexInput.value);
      if (!parsedColor) {
        colorHexInput.dataset.valid = 'false';
        return;
      }

      const normalizedHex = rgbToHex(parsedColor);
      syncHexInput(normalizedHex);
      const nextHsl = rgbToHsl(parsedColor);
      lightnessInput.value = String(
        this.clampNumber(nextHsl.lightness, 14, 84, DEFAULT_NODE_LIGHTNESS)
      );
      commitNodeStyle();
    });
    colorHexInput.addEventListener('blur', () => {
      const parsedColor = parseHexColor(colorHexInput.value);
      if (parsedColor) {
        syncHexInput(rgbToHex(parsedColor));
        return;
      }

      const resolved = this.getResolvedNodeStyle(this.activeCategoryId, critter.id);
      syncHexInput(rgbToHex(hslToRgb(resolved)));
    });
    lightnessInput.addEventListener('input', () => {
      const parsedColor = parseHexColor(colorPickerInput.value) || parseHexColor(colorHexInput.value);
      if (parsedColor) {
        const nextColor = rgbToHex(
          hslToRgb({
            ...rgbToHsl(parsedColor),
            lightness: Number(lightnessInput.value),
          })
        );
        syncHexInput(nextColor);
      }
      commitNodeStyle({ preserveLightness: true });
    });
    lineWidthInput.addEventListener('input', commitNodeStyle);
    glowInput.addEventListener('change', commitNodeStyle);
    phaseInput.addEventListener('change', () => {
      this.setCritterPhase(critter.id, phaseInput.value, {
        refresh: true,
        emitIfSelectionHidden: true,
      });
      if (!this.isCritterVisibleForCurrentPhase(critter.id)) {
        this.hideStyleMenu();
      }
    });
    resetButton.addEventListener('click', () => {
      this.resetCritterEditorState(critter.id);
      this.hideStyleMenu();
    });
  }

  showLinkStyleMenu({ linkRecord, clientX, clientY }) {
    if (!this.styleMenu || !this.activeCategoryId || !linkRecord) {
      return;
    }

    this.hideActionMenu();
    this.hideStyleMenu();
    this.bindStyleMenuDismiss();

    const inherited = this.getResolvedIncomingLineStyle(this.activeCategoryId, linkRecord.targetId);
    const direct = this.getLinkStyle(this.activeCategoryId, linkRecord.key);
    const current = direct ? this.normalizeLinkStyle(direct, inherited) : inherited;

    this.styleMenu.hidden = false;
    this.styleMenu.innerHTML = `
      <p class="unlock-style-menu__title">Link ${prettify(linkRecord.sourceId)} to ${prettify(linkRecord.targetId)}</p>
      <label class="unlock-style-menu__field">
        <span>Link Hue</span>
        <input data-role="line-hue" type="range" min="0" max="360" step="1" value="${Math.round(current.hue)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Link Saturation</span>
        <input data-role="line-saturation" type="range" min="10" max="100" step="1" value="${Math.round(current.saturation)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Link Lightness</span>
        <input data-role="line-lightness" type="range" min="14" max="84" step="1" value="${Math.round(current.lightness)}" />
      </label>
      <label class="unlock-style-menu__field">
        <span>Link Width</span>
        <input data-role="line-width" type="range" min="1" max="10" step="1" value="${Math.round(current.width)}" />
      </label>
      <div class="unlock-style-menu__actions">
        <button type="button" data-action="reset-line-style">Reset Link Style</button>
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
        glow: false,
        inputHue: null,
        inputSaturation: null,
        inputLightness: null,
        inputWidth: DEFAULT_INPUT_WIDTH,
        phase: PHASE_UNASSIGNED,
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
      glow: style.glow === true,
      inputHue,
      inputSaturation,
      inputLightness,
      inputWidth: style.inputWidth,
      phase: this.getCritterPhase(critterId),
    };
  }

  getCritterPhase(critterId) {
    return normalizePhaseValue(this.critterById.get(critterId)?.phase);
  }

  setCritterPhase(
    critterId,
    phase,
    { refresh = true, emitIfSelectionHidden = false, persistDraft = true } = {}
  ) {
    const critter = this.critterById.get(critterId);
    if (!critter) {
      return PHASE_UNASSIGNED;
    }

    critter.phase = normalizePhaseValue(phase);
    if (refresh) {
      this.refreshPhaseVisibility({ emitIfSelectionHidden });
    }
    if (persistDraft) {
      this.persistDraft();
    }

    return critter.phase;
  }

  isCritterVisibleForCurrentPhase(critterId) {
    return isPhaseVisibleForFilter(this.getCritterPhase(critterId), this.activePhaseFilter);
  }

  setPhaseFilter(filterPhase, { emitIfSelectionHidden = true } = {}) {
    this.hideActionMenu();
    this.hideStyleMenu();
    this.activePhaseFilter = normalizePhaseFilter(filterPhase);
    this.refreshPhaseVisibility({ emitIfSelectionHidden });
    return this.activePhaseFilter;
  }

  refreshPhaseVisibility({ emitIfSelectionHidden = false } = {}) {
    let activeCritterVisible = !this.activeCritterId;

    this.nodeButtons.forEach((button, critterId) => {
      const isVisible = this.isCritterVisibleForCurrentPhase(critterId);
      button.hidden = !isVisible;
      button.classList.toggle('is-phase-hidden', !isVisible);
      button.style.display = isVisible ? '' : 'none';
      if (critterId === this.activeCritterId && isVisible) {
        activeCritterVisible = true;
      }
    });

    this.linkRecords.forEach((record) => {
      const isVisible =
        this.isCritterVisibleForCurrentPhase(record.sourceId) &&
        this.isCritterVisibleForCurrentPhase(record.targetId);
      if (record.path) {
        record.path.hidden = !isVisible;
        record.path.style.display = isVisible ? '' : 'none';
      }
      if (record.hitPath) {
        record.hitPath.hidden = !isVisible;
        record.hitPath.style.display = isVisible ? '' : 'none';
      }
      if (Array.isArray(record.pointElements)) {
        record.pointElements.forEach((element) => {
          element.hidden = !isVisible;
          element.classList.toggle('is-phase-hidden', !isVisible);
          element.style.display = isVisible ? '' : 'none';
        });
      }
    });

    if (!activeCritterVisible && this.activeCritterId) {
      this.setActiveCritter(null);
      if (emitIfSelectionHidden) {
        this.bus?.emit?.('critter:selected', null);
      }
    }
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
      glow: typeof patch.glow === 'boolean' ? patch.glow : previous.glow,
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
          <svg class="unlock-map__links" data-role="map-links" viewBox="${this.getCurrentBoardOffsetX()} 0 ${this.getCurrentBoardWidth()} ${this.getCurrentBoardHeight()}" preserveAspectRatio="xMinYMin meet"></svg>
          <div class="unlock-map__points" data-role="map-points"></div>
          <div class="unlock-map__lanes" data-role="map-lanes"></div>
          <div class="unlock-map__nodes" data-role="map-nodes"></div>
          <div class="unlock-map__lane-controls" data-role="map-lane-controls"></div>
        </div>
        <div class="unlock-style-menu" data-role="style-menu" hidden></div>
        <div class="unlock-action-menu" data-role="action-menu" hidden></div>
      </div>
    `;

    this.element.appendChild(this.root);
    this.viewport = this.root.querySelector('[data-role="map-viewport"]');
    this.board = this.root.querySelector('[data-role="map-board"]');
    this.linksLayer = this.root.querySelector('[data-role="map-links"]');
    this.pointsLayer = this.root.querySelector('[data-role="map-points"]');
    this.lanesLayer = this.root.querySelector('[data-role="map-lanes"]');
    this.laneControlsLayer = this.root.querySelector('[data-role="map-lane-controls"]');
    this.nodesLayer = this.root.querySelector('[data-role="map-nodes"]');
    this.styleMenu = this.root.querySelector('[data-role="style-menu"]');
    this.actionMenu = this.root.querySelector('[data-role="action-menu"]');
    if (!this.zoomLabel) {
      this.zoomLabel = this.root.querySelector('[data-role="map-zoom"]');
    }

    this.board.style.width = `${this.getCurrentBoardWidth()}px`;
    this.board.style.height = `${this.getCurrentBoardHeight()}px`;
    this.setPanningEnabled(this.panningEnabled);
    this.setAddNodesModeEnabled(this.addNodesModeEnabled);

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

      if (!this.panningEnabled) {
        return;
      }

      if (
        event.target.closest('.unlock-node') ||
        event.target.closest('.unlock-lane__controls') ||
        event.target.closest('.unlock-lane__control-button') ||
        event.target.closest('.unlock-style-menu') ||
        event.target.closest('.unlock-action-menu') ||
        event.target.closest('.unlock-link-point') ||
        event.target.closest('.unlock-link') ||
        event.target.closest('.unlock-link-hitbox') ||
        event.target.closest('[data-link-key]')
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

    const resolveContext = (event, maxDistance = 92) => {
      const boardPoint = this.getBoardCoordinatesFromClient(event.clientX, event.clientY);
      const explicitTarget = event.target?.closest?.('[data-link-key]');
      const explicitKey =
        explicitTarget && typeof explicitTarget.dataset?.linkKey === 'string'
          ? explicitTarget.dataset.linkKey
          : null;
      const linkRecord = explicitKey
        ? this.linkRecords.find((record) => record.key === explicitKey) || null
        : this.findNearestLinkRecord(boardPoint.x, boardPoint.y, maxDistance);
      return { boardPoint, linkRecord };
    };

    this.linksLayer.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const { boardPoint, linkRecord } = resolveContext(event);
      if (!linkRecord) {
        this.hideActionMenu();
        return;
      }

      this.showActionMenu({
        clientX: event.clientX,
        clientY: event.clientY,
        actions: [
          {
            label: 'Create New Node',
            onSelect: () => {
              this.addLinkPoint(linkRecord.key, boardPoint.x, boardPoint.y);
            },
          },
        ],
      });
    });

    this.linksLayer.addEventListener('dblclick', (event) => {
      if (this.addNodesModeEnabled) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.hideActionMenu();
      const { boardPoint, linkRecord } = resolveContext(event);
      if (!linkRecord) {
        return;
      }
      this.addLinkPoint(linkRecord.key, boardPoint.x, boardPoint.y);
    });

    this.linksLayer.addEventListener('click', (event) => {
      if (!this.addNodesModeEnabled) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      this.hideActionMenu();
      const { boardPoint, linkRecord } = resolveContext(event, 108);
      if (!linkRecord) {
        return;
      }
      this.addLinkPoint(linkRecord.key, boardPoint.x, boardPoint.y);
    });
  }

  bindDoubleClickGuard() {
    if (!this.viewport) {
      return;
    }

    this.viewport.addEventListener(
      'dblclick',
      (event) => {
        if (event.target.closest('.unlock-style-menu') || event.target.closest('.unlock-action-menu')) {
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
        if (event.target.closest('.unlock-style-menu') || event.target.closest('.unlock-action-menu')) {
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

  clampZoom(value) {
    return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, value));
  }

  clampPan() {
    if (!this.viewport) {
      return;
    }

    const viewportWidth = this.viewport.clientWidth;
    const viewportHeight = this.viewport.clientHeight;
    const scaledWidth = this.getCurrentBoardWidth() * this.scale;
    const scaledHeight = this.getCurrentBoardHeight() * this.scale;

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
      this.zoomLabel.textContent = `${Math.round((this.scale / DEFAULT_VISUAL_SCALE) * 100)}%`;
    }
  }

  getGridCenterPoint() {
    const boardMetrics = this.getCategoryBoardMetrics(this.activeCategoryId);
    const firstLaneMetrics = this.getLaneGridMetrics(
      RARITY_LANES[0]?.id || 'common',
      this.activeCategoryId,
      boardMetrics
    );
    const lastLaneMetrics = this.getLaneGridMetrics(
      RARITY_LANES[RARITY_LANES.length - 1]?.id || 'mythical',
      this.activeCategoryId,
      boardMetrics
    );

    return {
      x: firstLaneMetrics.gridLeft + firstLaneMetrics.gridWidth * 0.5,
      y: (firstLaneMetrics.gridTop + (lastLaneMetrics.gridTop + lastLaneMetrics.gridHeight)) * 0.5,
    };
  }

  getLaneCenterPoint(laneId = RARITY_LANES[0]?.id || 'common') {
    const boardMetrics = this.getCategoryBoardMetrics(this.activeCategoryId);
    const laneMetrics = this.getLaneGridMetrics(laneId, this.activeCategoryId, boardMetrics);

    return {
      x: laneMetrics.gridLeft + laneMetrics.gridWidth * 0.5,
      y: laneMetrics.gridTop + laneMetrics.gridHeight * 0.5,
    };
  }

  centerGridOnViewport({ scale = this.scale } = {}) {
    this.scale = this.clampZoom(scale);

    if (!this.viewport) {
      this.applyTransform();
      return;
    }

    const viewportWidth = this.viewport.clientWidth || 0;
    const viewportHeight = this.viewport.clientHeight || 0;
    if (viewportWidth <= 0 || viewportHeight <= 0) {
      this.applyTransform();
      return;
    }

    const gridCenter = this.getGridCenterPoint();
    this.pan.x =
      viewportWidth * 0.5 - (gridCenter.x - this.getCurrentBoardOffsetX()) * this.scale;
    this.pan.y = viewportHeight * 0.5 - gridCenter.y * this.scale;
    this.applyTransform();
  }

  centerLaneOnViewport(laneId = RARITY_LANES[0]?.id || 'common', { scale = this.scale } = {}) {
    this.scale = this.clampZoom(scale);

    if (!this.viewport) {
      this.applyTransform();
      return;
    }

    const viewportWidth = this.viewport.clientWidth || 0;
    const viewportHeight = this.viewport.clientHeight || 0;
    if (viewportWidth <= 0 || viewportHeight <= 0) {
      this.applyTransform();
      return;
    }

    const laneCenter = this.getLaneCenterPoint(laneId);
    this.pan.x =
      viewportWidth * 0.5 - (laneCenter.x - this.getCurrentBoardOffsetX()) * this.scale;
    this.pan.y = viewportHeight * 0.5 - laneCenter.y * this.scale;
    this.applyTransform();
  }

  resetCategoryView() {
    this.scale = DEFAULT_VISUAL_SCALE;
    this.applyTransform();
    requestAnimationFrame(() => {
      this.centerLaneOnViewport(RARITY_LANES[0]?.id || 'common', {
        scale: DEFAULT_VISUAL_SCALE,
      });
    });
  }

  setCategory(categoryId) {
    if (!categoryId) {
      return;
    }

    this.hideActionMenu();
    this.hideStyleMenu();
    this.activeCategoryId = categoryId;
    this.activeCritterId = null;
    this.pan = { ...DEFAULT_PAN };
    this.renderCategoryMap();
    this.resetCategoryView();
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

  getLaneGridMetrics(laneId, categoryId = this.activeCategoryId, boardMetrics = null) {
    const resolvedLaneId = this.getLaneIdFromRarity(laneId);
    const metricsSource = boardMetrics?.lanes || this.getCategoryBoardMetrics(categoryId).lanes;
    return (
      metricsSource.get(resolvedLaneId) ||
      metricsSource.get(RARITY_LANES[0]?.id || 'common') || {
        laneTop: LANE_START_Y,
        laneHeight: LANE_HEIGHT,
        visualHeight: LANE_HEIGHT - LANE_VISUAL_GAP,
        rows: this.defaultGridRows,
        columns: this.defaultGridColumns,
        gridLeft: INTERNAL_CENTER_X - BASE_GRID_WIDTH * 0.5,
        gridTop: LANE_START_Y + LANE_ROW_OFFSET,
        gridWidth: BASE_GRID_WIDTH,
        gridHeight: BASE_GRID_HEIGHT,
        cellWidth: BASE_GRID_CELL_WIDTH,
        cellHeight: BASE_GRID_CELL_HEIGHT,
        visualLeft: INTERNAL_CENTER_X - (BASE_GRID_WIDTH + LANE_VISUAL_SIDE_OUTSET * 2) * 0.5,
        visualWidth: BASE_GRID_WIDTH + LANE_VISUAL_SIDE_OUTSET * 2,
        visualRight:
          INTERNAL_CENTER_X + (BASE_GRID_WIDTH + LANE_VISUAL_SIDE_OUTSET * 2) * 0.5,
        visualBottom: LANE_START_Y + LANE_HEIGHT - LANE_VISUAL_GAP,
      }
    );
  }

  getGridCellPosition(laneId, row, column, options = {}) {
    const metrics = this.getLaneGridMetrics(laneId, options.categoryId, options.boardMetrics);
    const snappedRow = Math.max(0, Math.min(metrics.rows - 1, row));
    const snappedColumn = Math.max(0, Math.min(metrics.columns - 1, column));
    const x = Math.round(
      metrics.gridLeft + snappedColumn * metrics.cellWidth + (metrics.cellWidth - NODE_WIDTH) * 0.5
    );
    const y = Math.round(
      metrics.gridTop + snappedRow * metrics.cellHeight + (metrics.cellHeight - NODE_HEIGHT) * 0.5
    );
    return { x, y, row: snappedRow, column: snappedColumn };
  }

  snapNodeToGrid(x, y, laneId, options = {}) {
    const metrics = this.getLaneGridMetrics(laneId, options.categoryId, options.boardMetrics);
    const centerX = x + NODE_WIDTH * 0.5;
    const centerY = y + NODE_HEIGHT * 0.5;
    const column = Math.round((centerX - metrics.gridLeft - metrics.cellWidth * 0.5) / metrics.cellWidth);
    const row = Math.round((centerY - metrics.gridTop - metrics.cellHeight * 0.5) / metrics.cellHeight);
    return this.getGridCellPosition(laneId, row, column, options);
  }

  inferLaneIdFromY(y, categoryId = this.activeCategoryId, boardMetrics = null) {
    const centerY = y + NODE_HEIGHT * 0.5;
    const metricsSource = boardMetrics?.lanes || this.getCategoryBoardMetrics(categoryId).lanes;
    for (let index = 0; index < RARITY_LANES.length; index += 1) {
      const laneId = RARITY_LANES[index]?.id || 'common';
      const metrics = metricsSource.get(laneId);
      if (!metrics) {
        continue;
      }
      if (centerY < metrics.laneTop + metrics.laneHeight) {
        return laneId;
      }
    }
    return RARITY_LANES[RARITY_LANES.length - 1]?.id || 'mythical';
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

  normalizeLaneRowCount(value, fallback = this.defaultGridRows) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return Math.max(MIN_GRID_ROWS_PER_LANE, Math.round(Number(fallback) || GRID_ROWS_PER_LANE));
    }
    return Math.max(MIN_GRID_ROWS_PER_LANE, Math.round(numeric));
  }

  normalizeLaneColumnCount(value, fallback = this.defaultGridColumns) {
    const fallbackValue = Number.isFinite(Number(fallback))
      ? Number(fallback)
      : GRID_COLUMNS_PER_LANE;
    const numeric = Number(value);
    const candidate = Number.isFinite(numeric) ? Math.round(numeric) : Math.round(fallbackValue);
    const clamped = Math.max(MIN_GRID_COLUMNS_PER_LANE, candidate);
    return clamped % 2 === 0 ? clamped + 1 : clamped;
  }

  normalizeLaneDimensions(source = {}, fallback = null) {
    const base =
      fallback && typeof fallback === 'object'
        ? fallback
        : {
            rows: this.defaultGridRows,
            columns: this.defaultGridColumns,
          };

    return {
      rows: this.normalizeLaneRowCount(source?.rows, base.rows),
      columns: this.normalizeLaneColumnCount(source?.columns, base.columns),
    };
  }

  ensureCategoryLaneDimensions(categoryId) {
    if (!categoryId) {
      return new Map();
    }

    if (!this.categoryLaneDimensionsByCategory.has(categoryId)) {
      const defaults = new Map();
      RARITY_LANES.forEach((lane) => {
        defaults.set(lane.id, this.normalizeLaneDimensions());
      });
      this.categoryLaneDimensionsByCategory.set(categoryId, defaults);
    }

    return this.categoryLaneDimensionsByCategory.get(categoryId);
  }

  applyStoredLaneDimensions(categoryId, rawLanes) {
    if (!categoryId || !rawLanes || typeof rawLanes !== 'object') {
      return;
    }

    const laneDimensions = this.ensureCategoryLaneDimensions(categoryId);
    const laneEntries = Array.isArray(rawLanes)
      ? rawLanes
          .filter((lane) => lane && lane.id)
          .map((lane) => [lane.id, lane])
      : Object.entries(rawLanes);

    laneEntries.forEach(([laneId, laneConfig]) => {
      const resolvedLaneId = this.getLaneIdFromRarity(laneId);
      const previous = laneDimensions.get(resolvedLaneId) || this.normalizeLaneDimensions();
      laneDimensions.set(resolvedLaneId, this.normalizeLaneDimensions(laneConfig, previous));
    });
  }

  getLaneDimensions(categoryId, laneId) {
    const laneDimensions = this.ensureCategoryLaneDimensions(categoryId);
    const resolvedLaneId = this.getLaneIdFromRarity(laneId);
    if (!laneDimensions.has(resolvedLaneId)) {
      laneDimensions.set(resolvedLaneId, this.normalizeLaneDimensions());
    }
    return laneDimensions.get(resolvedLaneId);
  }

  getCategoryBoardMetrics(categoryId = this.activeCategoryId) {
    const metricsByLane = new Map();
    let laneTop = LANE_START_Y;
    let maxHalfWidth = this.layoutBoardWidth * 0.5;

    RARITY_LANES.forEach((lane) => {
      const dimensions = this.getLaneDimensions(categoryId, lane.id);
      const gridWidth = dimensions.columns * BASE_GRID_CELL_WIDTH;
      const gridHeight = dimensions.rows * BASE_GRID_CELL_HEIGHT;
      const laneHeight = LANE_ROW_OFFSET + gridHeight + LANE_BOTTOM_PADDING;
      const visualHeight = Math.max(0, laneHeight - LANE_VISUAL_GAP);
      const visualWidth = gridWidth + LANE_VISUAL_SIDE_OUTSET * 2;
      const gridLeft = INTERNAL_CENTER_X - gridWidth * 0.5;
      const visualLeft = INTERNAL_CENTER_X - visualWidth * 0.5;
      maxHalfWidth = Math.max(maxHalfWidth, visualWidth * 0.5);
      metricsByLane.set(lane.id, {
        laneTop,
        laneHeight,
        visualHeight,
        rows: dimensions.rows,
        columns: dimensions.columns,
        gridLeft,
        gridTop: laneTop + LANE_ROW_OFFSET,
        gridWidth,
        gridHeight,
        cellWidth: BASE_GRID_CELL_WIDTH,
        cellHeight: gridHeight / dimensions.rows,
        visualLeft,
        visualWidth,
        visualRight: visualLeft + visualWidth,
        visualBottom: laneTop + visualHeight,
      });
      laneTop += laneHeight;
    });

    const registerHalfSpan = (left, right) => {
      if (!Number.isFinite(left) || !Number.isFinite(right)) {
        return;
      }
      maxHalfWidth = Math.max(
        maxHalfWidth,
        Math.abs(left - INTERNAL_CENTER_X),
        Math.abs(right - INTERNAL_CENTER_X)
      );
    };

    const categoryOverrides = this.customPositionsByCategory.get(categoryId) || null;
    categoryOverrides?.forEach((point) => {
      registerHalfSpan(point.x, point.x + NODE_WIDTH);
    });

    const categoryLinkPoints = this.linkPointsByCategory.get(categoryId) || null;
    categoryLinkPoints?.forEach((points) => {
      points.forEach((point) => {
        registerHalfSpan(point.x, point.x);
      });
    });

    return {
      lanes: metricsByLane,
      boardWidth: Math.max(this.layoutBoardWidth, Math.ceil(maxHalfWidth * 2)),
      boardHeight: Math.max(this.layoutBoardHeight, laneTop + BOARD_BOTTOM_PADDING),
    };
  }

  getCurrentBoardHeight() {
    return Math.max(MAP_HEIGHT, Number(this.activeBoardHeight) || 0);
  }

  clampNodePositionToBoard(
    x,
    y,
    boardHeight = this.getCurrentBoardHeight(),
    boardWidth = this.getCurrentBoardWidth(),
    boardOffsetX = this.getBoardOffsetX(boardWidth)
  ) {
    return {
      x: Math.round(
        this.clampNumber(x, boardOffsetX, boardOffsetX + boardWidth - NODE_WIDTH, boardOffsetX)
      ),
      y: Math.round(this.clampNumber(y, 0, Math.max(0, boardHeight - NODE_HEIGHT), 0)),
    };
  }

  getLaneVisualBounds(laneId, options = {}) {
    const metrics = this.getLaneGridMetrics(laneId, options.categoryId, options.boardMetrics);
    return {
      left: metrics.visualLeft,
      top: metrics.laneTop,
      right: metrics.visualRight,
      bottom: metrics.visualBottom,
    };
  }

  isNodeInsideLaneBounds(x, y, laneId, options = {}) {
    const bounds = this.getLaneVisualBounds(laneId, options);
    return (
      x >= bounds.left &&
      y >= bounds.top &&
      x + NODE_WIDTH <= bounds.right &&
      y + NODE_HEIGHT <= bounds.bottom
    );
  }

  commitNodePosition(critterId, point, options = {}) {
    if (!point) {
      return null;
    }

    const persistOverride = options.persistOverride !== false;
    const shouldPersistDraft = options.persistDraft !== false;
    this.currentPositions.set(critterId, point);

    const node = this.nodeButtons.get(critterId);
    if (node) {
      node.style.left = `${this.getRenderableX(point.x)}px`;
      node.style.top = `${point.y}px`;
    }

    if (persistOverride && this.activeCategoryId) {
      const categoryOverrides = this.ensureCategoryCustomPositions(this.activeCategoryId);
      categoryOverrides.set(critterId, { x: point.x, y: point.y });
    }

    this.updateLinkPaths();
    if (shouldPersistDraft && persistOverride && this.activeCategoryId) {
      this.persistDraft();
    }
    return point;
  }

  updateNodePosition(critterId, x, y, laneId = null, options = {}) {
    const existing = this.currentPositions.get(critterId);
    const level = existing?.level ?? 0;
    const categoryId = options.categoryId || this.activeCategoryId;
    const boardMetrics = options.boardMetrics || this.getCategoryBoardMetrics(categoryId);
    const resolvedLaneId =
      laneId || existing?.laneId || this.inferLaneIdFromY(y, categoryId, boardMetrics);
    const shouldConstrainToLane = options.constrainToLane !== false;
    const nextCoordinates = shouldConstrainToLane
      ? this.snapNodeToGrid(x, y, resolvedLaneId, { categoryId, boardMetrics })
      : this.clampNodePositionToBoard(
          x,
          y,
          boardMetrics.boardHeight,
          boardMetrics.boardWidth,
          this.getBoardOffsetX(boardMetrics.boardWidth)
        );
    const nextPoint = this.buildPoint(nextCoordinates.x, nextCoordinates.y, level, resolvedLaneId);
    return this.commitNodePosition(critterId, nextPoint, options);
  }

  shiftCategoryContentBelowLane(categoryId, laneId, previousMetrics, nextMetrics) {
    if (!categoryId || !previousMetrics?.lanes || !nextMetrics?.lanes) {
      return;
    }

    const changedLaneIndex = this.getLaneIndexById(laneId);
    const categoryOverrides = this.customPositionsByCategory.get(categoryId) || null;
    if (categoryOverrides) {
      categoryOverrides.forEach((point, critterId) => {
        const critter = this.critterById.get(critterId);
        const critterLaneId = this.getLaneIdFromRarity(critter?.rarity);
        if (this.getLaneIndexById(critterLaneId) <= changedLaneIndex) {
          return;
        }
        const previousLane = previousMetrics.lanes.get(critterLaneId);
        const nextLane = nextMetrics.lanes.get(critterLaneId);
        const deltaY = (nextLane?.laneTop || 0) - (previousLane?.laneTop || 0);
        if (!deltaY) {
          return;
        }
        point.y = Math.round(point.y + deltaY);
      });
    }

    const firstShiftedLaneId = RARITY_LANES[changedLaneIndex + 1]?.id || null;
    if (!firstShiftedLaneId) {
      return;
    }

    const threshold = previousMetrics.lanes.get(firstShiftedLaneId)?.laneTop;
    const deltaY =
      (nextMetrics.lanes.get(firstShiftedLaneId)?.laneTop || 0) -
      (previousMetrics.lanes.get(firstShiftedLaneId)?.laneTop || 0);
    if (!Number.isFinite(threshold) || !deltaY) {
      return;
    }

    const linkPoints = this.linkPointsByCategory.get(categoryId) || null;
    linkPoints?.forEach((points) => {
      points.forEach((point) => {
        if (point.y >= threshold) {
          point.y = Math.round(point.y + deltaY);
        }
      });
    });
  }

  seedCategoryOverridesFromLayout(categoryId, layout = null) {
    if (!categoryId) {
      return;
    }

    const resolvedLayout = layout || this.buildCategoryLayout(categoryId);
    const categoryOverrides = this.ensureCategoryCustomPositions(categoryId);
    resolvedLayout.categoryCritters.forEach((critter) => {
      const point = resolvedLayout.positions.get(critter.id);
      if (!point) {
        return;
      }
      categoryOverrides.set(critter.id, {
        x: Math.round(point.x),
        y: Math.round(point.y),
      });
    });
  }

  adjustLaneRows(categoryId, laneId, delta) {
    if (!categoryId || !laneId || !Number.isFinite(Number(delta))) {
      return;
    }

    const laneDimensions = this.ensureCategoryLaneDimensions(categoryId);
    const previousLayout = this.buildCategoryLayout(categoryId);
    this.seedCategoryOverridesFromLayout(categoryId, previousLayout);
    const previousMetrics = this.getCategoryBoardMetrics(categoryId);
    const current = this.getLaneDimensions(categoryId, laneId);
    const nextRows = this.normalizeLaneRowCount(current.rows + Number(delta), current.rows);
    if (nextRows === current.rows) {
      return;
    }

    laneDimensions.set(laneId, {
      ...current,
      rows: nextRows,
    });

    const nextMetrics = this.getCategoryBoardMetrics(categoryId);
    this.shiftCategoryContentBelowLane(categoryId, laneId, previousMetrics, nextMetrics);

    if (categoryId === this.activeCategoryId) {
      this.renderCategoryMap();
      this.applyTransform();
    }
    this.persistDraft();
  }

  adjustLaneColumns(categoryId, laneId, delta) {
    if (!categoryId || !laneId || !Number.isFinite(Number(delta))) {
      return;
    }

    const laneDimensions = this.ensureCategoryLaneDimensions(categoryId);
    this.seedCategoryOverridesFromLayout(categoryId);
    const previousMetrics = this.getCategoryBoardMetrics(categoryId);
    const current = this.getLaneDimensions(categoryId, laneId);
    const nextColumns = this.normalizeLaneColumnCount(current.columns + Number(delta), current.columns);
    if (nextColumns === current.columns) {
      return;
    }

    laneDimensions.set(laneId, {
      ...current,
      columns: nextColumns,
    });

    const nextMetrics = this.getCategoryBoardMetrics(categoryId);
    if (categoryId === this.activeCategoryId) {
      const previousOffsetX = this.getBoardOffsetX(previousMetrics.boardWidth);
      const nextOffsetX = this.getBoardOffsetX(nextMetrics.boardWidth);
      this.pan.x += (nextOffsetX - previousOffsetX) * this.scale;
      this.renderCategoryMap();
      this.applyTransform();
    }
    this.persistDraft();
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

    element.style.left = `${this.getRenderableX(point.x)}px`;
    element.style.top = `${point.y}px`;
  }

  bindLinkPointDrag(element, record, point) {
    let dragState = null;

    element.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.showActionMenu({
        clientX: event.clientX,
        clientY: event.clientY,
        actions: [
          {
            label: 'Delete Node',
            onSelect: () => {
              this.removeLinkPoint(record.key, point.id);
            },
          },
        ],
      });
    });

    element.addEventListener('dblclick', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.hideActionMenu();
      this.removeLinkPoint(record.key, point.id);
    });

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
      const boardHeight = this.getCurrentBoardHeight();
      const boardOffsetX = this.getCurrentBoardOffsetX();
      const boardWidth = this.getCurrentBoardWidth();
      point.x = Math.round(
        this.clampNumber(
          dragState.startX + dx,
          boardOffsetX,
          boardOffsetX + boardWidth,
          dragState.startX
        )
      );
      point.y = Math.round(
        this.clampNumber(dragState.startY + dy, 0, boardHeight, dragState.startY)
      );
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
      this.persistDraft();
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
        handle.setAttribute('aria-label', 'Link node');
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
    const boardOffsetX = this.getCurrentBoardOffsetX();
    const boardWidth = this.getCurrentBoardWidth();
    const nextPoint = {
      id: this.generateLinkPointId(),
      x: Math.round(this.clampNumber(x, boardOffsetX, boardOffsetX + boardWidth, boardOffsetX)),
      y: Math.round(this.clampNumber(y, 0, this.getCurrentBoardHeight(), 0)),
    };

    const insertionIndex = this.resolveLinkPointInsertionIndex(linkKey, nextPoint);
    if (!Number.isFinite(insertionIndex)) {
      points.push(nextPoint);
    } else {
      points.splice(insertionIndex, 0, nextPoint);
    }

    this.renderLinkPointHandles();
    this.updateLinkPaths();
    this.persistDraft();
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
    this.persistDraft();
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
        constrainToLane: this.isNodeInsideLaneBounds(point.x, point.y, laneId, {
          categoryId: this.activeCategoryId,
        }),
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
      const nextX = nodeDragState.startX + dx;
      const nextY = nodeDragState.startY + dy;
      if (
        !nodeDragState.constrainToLane &&
        this.isNodeInsideLaneBounds(nextX, nextY, laneId, {
          categoryId: this.activeCategoryId,
        })
      ) {
        nodeDragState.constrainToLane = true;
      }

      this.updateNodePosition(critterId, nextX, nextY, laneId, {
        constrainToLane: nodeDragState.constrainToLane,
        persistDraft: false,
      });
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
        this.persistDraft();
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
    const boardMetrics = this.getCategoryBoardMetrics(categoryId);

    const crittersByLane = new Map(RARITY_LANES.map((lane) => [lane.id, []]));
    categoryCritters.forEach((critter) => {
      const laneId = this.getLaneIdFromRarity(critter.rarity);
      if (!crittersByLane.has(laneId)) {
        crittersByLane.set(laneId, []);
      }
      crittersByLane.get(laneId).push(critter);
    });

    RARITY_LANES.forEach((lane) => {
      const laneMetrics = this.getLaneGridMetrics(lane.id, categoryId, boardMetrics);
      const laneTop = laneMetrics.laneTop;
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
      const levelRows = this.buildSlotIndices(sortedLevels.length, laneMetrics.rows);
      const usedCells = new Set();

      sortedLevels.forEach((level, levelIndex) => {
        const row = levelRows[levelIndex] ?? Math.min(laneMetrics.rows - 1, levelIndex);
        const rowCritters = groupedByLevel.get(level) || [];
        const plannedColumns = this.buildSlotIndices(rowCritters.length, laneMetrics.columns);

        rowCritters.forEach((critter, critterIndex) => {
          const preferredColumn = plannedColumns[critterIndex] ?? 0;
          let column = preferredColumn;
          let rowCandidate = row;
          let key = `${rowCandidate}:${column}`;

          if (usedCells.has(key)) {
            let best = null;
            for (let scanRow = 0; scanRow < laneMetrics.rows; scanRow += 1) {
              for (let scanColumn = 0; scanColumn < laneMetrics.columns; scanColumn += 1) {
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
          const cell = this.getGridCellPosition(lane.id, rowCandidate, column, {
            categoryId,
            boardMetrics,
          });
          positions.set(critter.id, this.buildPoint(cell.x, cell.y, level, lane.id));
        });
      });

      lanes.set(lane.id, {
        ...laneMetrics,
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
        const clamped = this.clampNodePositionToBoard(
          override.x,
          override.y,
          boardMetrics.boardHeight,
          boardMetrics.boardWidth,
          this.getBoardOffsetX(boardMetrics.boardWidth)
        );
        positions.set(critter.id, this.buildPoint(clamped.x, clamped.y, level, laneId));
      });
    }

    return {
      categoryCritters,
      positions,
      lanes,
      boardWidth: boardMetrics.boardWidth,
      boardHeight: boardMetrics.boardHeight,
    };
  }

  buildLayoutSnapshotPayload(options = {}) {
    const previewStates = options?.previewStates ?? null;
    const includeGeneratedAt = options?.includeGeneratedAt !== false;
    const categoryIds = this.getAllCategoryIds();
    const categoryLayouts = categoryIds.map((categoryId) => ({
      categoryId,
      ...this.buildCategoryLayout(categoryId),
    }));
    const exportBoardWidth = Math.max(
      LOGICAL_MAP_WIDTH,
      ...categoryLayouts.map((entry) => entry.boardWidth || LOGICAL_MAP_WIDTH)
    );
    const exportBoardHeight = Math.max(
      MAP_HEIGHT,
      ...categoryLayouts.map((entry) => entry.boardHeight || MAP_HEIGHT)
    );
    const payload = {
      board: {
        width: exportBoardWidth,
        height: exportBoardHeight,
        nodeWidth: NODE_WIDTH,
        nodeHeight: NODE_HEIGHT,
        gridColumnsPerRarity: this.defaultGridColumns,
        gridRowsPerRarity: this.defaultGridRows,
      },
      categories: {},
    };
    categoryLayouts.forEach(({ categoryId, categoryCritters, positions }) => {
      const categoryLabel =
        this.categories.find((category) => category.id === categoryId)?.label || prettify(categoryId);
      const nodeStyles = this.nodeStylesByCategory.get(categoryId) || null;
      const linkStyles = this.linkStylesByCategory.get(categoryId) || null;
      const linkPoints = this.linkPointsByCategory.get(categoryId) || null;
      const laneDimensions = Object.fromEntries(
        RARITY_LANES.map((lane) => {
          const dimensions = this.getLaneDimensions(categoryId, lane.id);
          return [
            lane.id,
            {
              rows: dimensions.rows,
              columns: dimensions.columns,
            },
          ];
        })
      );

      payload.categories[categoryId] = {
        label: categoryLabel,
        lanes: laneDimensions,
        critters: categoryCritters.map((critter) => {
          const point = positions.get(critter.id) || {};
          const style = nodeStyles?.get(critter.id) || null;
          return {
            id: critter.id,
            name: critter.name,
            rarity: critter.rarity || 'common',
            phase: this.getCritterPhase(critter.id),
            level: getRequirementLevel(critter),
            x: Number.isFinite(point.x)
              ? this.translateWorldXToLayout(point.x, exportBoardWidth)
              : 0,
            y: point.y ?? 0,
            imageView: this.resolvePreviewState(previewStates, critter.id),
            style: style
              ? {
                  textScale: style.textScale,
                  hue: style.hue,
                  saturation: style.saturation,
                  lightness: style.lightness,
                  glow: style.glow === true,
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
                  x: this.translateWorldXToLayout(point.x, exportBoardWidth),
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

    if (includeGeneratedAt) {
      payload.generatedAt = new Date().toISOString();
    }

    return payload;
  }

  async copyLayoutSnapshot(options = {}) {
    const payload = this.buildLayoutSnapshotPayload(options);

    const text = `export const critterMapDefaultLayout = ${JSON.stringify(payload, null, 2)};\n`;
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
    if (
      !this.nodesLayer ||
      !this.lanesLayer ||
      !this.laneControlsLayer ||
      !this.linksLayer ||
      !this.pointsLayer
    ) {
      return;
    }
    this.hideActionMenu();
    const { categoryCritters, positions, lanes, boardWidth, boardHeight } = this.buildCategoryLayout(
      this.activeCategoryId
    );
    this.activeBoardWidth = boardWidth || LOGICAL_MAP_WIDTH;
    this.activeBoardHeight = boardHeight || MAP_HEIGHT;
    if (this.board) {
      this.board.style.width = `${this.getCurrentBoardWidth()}px`;
      this.board.style.height = `${this.getCurrentBoardHeight()}px`;
    }
    if (this.linksLayer) {
      this.linksLayer.setAttribute(
        'viewBox',
        `${this.getCurrentBoardOffsetX()} 0 ${this.getCurrentBoardWidth()} ${this.getCurrentBoardHeight()}`
      );
    }
    this.nodeButtons.clear();
    this.currentPositions = new Map(positions);
    this.linkRecords = [];
    this.linksLayer.innerHTML = '';
    this.pointsLayer.innerHTML = '';
    this.lanesLayer.innerHTML = '';
    this.laneControlsLayer.innerHTML = '';
    this.nodesLayer.innerHTML = '';

    RARITY_LANES.forEach((lane) => {
      const laneInfo = lanes.get(lane.id);
      const laneCritters = laneInfo?.laneCritters || [];
      const laneTop = laneInfo?.laneTop ?? LANE_START_Y;
      const laneHeight = laneInfo?.visualHeight ?? Math.max(0, LANE_HEIGHT - LANE_VISUAL_GAP);
      const laneDimensions = this.getLaneDimensions(this.activeCategoryId, lane.id);

      const laneRow = document.createElement('div');
      laneRow.className = 'unlock-lane';
      laneRow.style.left = `${this.getRenderableX(laneInfo?.visualLeft ?? 18)}px`;
      laneRow.style.right = 'auto';
      laneRow.style.width = `${laneInfo?.visualWidth ?? LOGICAL_MAP_WIDTH - 36}px`;
      laneRow.style.top = `${laneTop}px`;
      laneRow.style.height = `${laneHeight}px`;
      laneRow.style.setProperty('--grid-cols', String(laneDimensions.columns));
      laneRow.style.setProperty('--grid-rows', String(laneDimensions.rows));
      this.lanesLayer.appendChild(laneRow);

      const laneOverlay = document.createElement('div');
      laneOverlay.className = 'unlock-lane unlock-lane--control-overlay';
      laneOverlay.style.left = `${this.getRenderableX(laneInfo?.visualLeft ?? 18)}px`;
      laneOverlay.style.right = 'auto';
      laneOverlay.style.width = `${laneInfo?.visualWidth ?? LOGICAL_MAP_WIDTH - 36}px`;
      laneOverlay.style.top = `${laneTop}px`;
      laneOverlay.style.height = `${laneHeight}px`;

      const laneHeader = document.createElement('div');
      laneHeader.className = 'unlock-lane__header';

      const laneMeta = document.createElement('div');
      laneMeta.className = 'unlock-lane__meta';

      const laneName = document.createElement('span');
      laneName.className = 'unlock-lane__name';
      laneName.textContent = lane.label;

      const laneStatus = document.createElement('span');
      laneStatus.className = 'unlock-lane__status';
      laneStatus.textContent = laneCritters.length
        ? `${laneCritters.length} critter${laneCritters.length === 1 ? '' : 's'}`
        : 'Awaiting Data Entry';

      const laneControls = document.createElement('div');
      laneControls.className = 'unlock-lane__controls';

      const createResizeControl = ({ label, value, decrease, increase, minReached, ariaBase }) => {
        const group = document.createElement('div');
        group.className = 'unlock-lane__control-group';

        const labelElement = document.createElement('span');
        labelElement.className = 'unlock-lane__control-label';
        labelElement.textContent = label;

        const valueElement = document.createElement('span');
        valueElement.className = 'unlock-lane__control-value';
        valueElement.textContent = String(value);

        const stepper = document.createElement('div');
        stepper.className = 'unlock-lane__stepper';

        const decreaseButton = document.createElement('button');
        decreaseButton.type = 'button';
        decreaseButton.className = 'unlock-lane__control-button';
        decreaseButton.textContent = '-';
        decreaseButton.disabled = Boolean(minReached);
        decreaseButton.setAttribute('aria-label', `${ariaBase} minus`);
        decreaseButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          decrease();
        });

        const increaseButton = document.createElement('button');
        increaseButton.type = 'button';
        increaseButton.className = 'unlock-lane__control-button';
        increaseButton.textContent = '+';
        increaseButton.setAttribute('aria-label', `${ariaBase} plus`);
        increaseButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          increase();
        });

        stepper.append(decreaseButton, increaseButton);
        group.append(labelElement, valueElement, stepper);
        return group;
      };

      laneControls.append(
        createResizeControl({
          label: 'Rows',
          value: laneDimensions.rows,
          minReached: laneDimensions.rows <= MIN_GRID_ROWS_PER_LANE,
          decrease: () => this.adjustLaneRows(this.activeCategoryId, lane.id, -1),
          increase: () => this.adjustLaneRows(this.activeCategoryId, lane.id, 1),
          ariaBase: `${lane.label} rows`,
        }),
        createResizeControl({
          label: 'Columns',
          value: laneDimensions.columns,
          minReached: laneDimensions.columns <= MIN_GRID_COLUMNS_PER_LANE,
          decrease: () => this.adjustLaneColumns(this.activeCategoryId, lane.id, -2),
          increase: () => this.adjustLaneColumns(this.activeCategoryId, lane.id, 2),
          ariaBase: `${lane.label} columns`,
        })
      );

      laneMeta.append(laneName, laneStatus);
      laneHeader.append(laneMeta, laneControls);
      laneOverlay.appendChild(laneHeader);
      this.laneControlsLayer.appendChild(laneOverlay);

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
        node.style.left = `${this.getRenderableX(point.x)}px`;
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
    this.setActiveCritter(this.nodeButtons.has(this.activeCritterId) ? this.activeCritterId : null);
    this.refreshPhaseVisibility();
  }
}
