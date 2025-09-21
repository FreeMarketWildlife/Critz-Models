const TOOLTIP_SELECTOR = '.tooltip[data-tooltip]';
const VIEWPORT_MARGIN = 16;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const state = {
  overlay: null,
  activeTrigger: null,
};

let isInitialized = false;
let pendingFrame = null;
let decoder = null;

const createOverlay = () => {
  const root = document.createElement('div');
  root.className = 'tooltip-overlay';
  root.setAttribute('role', 'tooltip');
  root.setAttribute('aria-hidden', 'true');
  root.style.left = '0px';
  root.style.top = '0px';

  const bubble = document.createElement('div');
  bubble.className = 'tooltip-overlay__bubble';
  root.appendChild(bubble);

  document.body.appendChild(root);
  return { root, bubble };
};

const ensureOverlay = () => {
  if (!state.overlay) {
    state.overlay = createOverlay();
  }
  return state.overlay;
};

const decodeTooltip = (value) => {
  if (!value) {
    return '';
  }

  if (typeof document === 'undefined') {
    return value;
  }

  if (!decoder) {
    decoder = document.createElement('div');
  }

  decoder.innerHTML = value;
  return decoder.textContent || '';
};

const getDescription = (trigger) => {
  if (!trigger) return '';
  const raw = trigger.getAttribute('data-tooltip');
  if (typeof raw !== 'string') {
    return '';
  }

  return decodeTooltip(raw.trim());
};

const positionOverlay = (trigger) => {
  if (!trigger || !state.overlay) {
    return;
  }

  const { root, bubble } = state.overlay;
  const rect = trigger.getBoundingClientRect();
  const bubbleRect = bubble.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  const bubbleWidth = bubbleRect.width;
  const bubbleHeight = bubbleRect.height;

  let centerX = rect.left + rect.width / 2;
  const halfWidth = bubbleWidth / 2;
  centerX = clamp(centerX, VIEWPORT_MARGIN + halfWidth, viewportWidth - VIEWPORT_MARGIN - halfWidth);

  let placement = 'above';
  let anchorY = rect.top;
  const aboveSpace = rect.top;
  const belowSpace = viewportHeight - rect.bottom;

  if (aboveSpace < bubbleHeight + VIEWPORT_MARGIN && belowSpace > aboveSpace) {
    placement = 'below';
    anchorY = rect.bottom;
  }

  if (placement === 'below' && belowSpace < bubbleHeight + VIEWPORT_MARGIN) {
    placement = 'above';
    anchorY = rect.top;
  }

  root.style.left = `${Math.round(centerX)}px`;
  root.style.top = `${Math.round(anchorY)}px`;
  root.classList.toggle('is-below', placement === 'below');
};

const scheduleReposition = () => {
  if (!state.activeTrigger) {
    return;
  }
  if (pendingFrame) {
    return;
  }
  pendingFrame = requestAnimationFrame(() => {
    pendingFrame = null;
    positionOverlay(state.activeTrigger);
  });
};

const showTooltip = (trigger) => {
  if (!trigger) {
    return;
  }

  const description = getDescription(trigger);
  if (!description) {
    hideTooltip(trigger);
    return;
  }

  const overlay = ensureOverlay();
  overlay.bubble.textContent = description;
  overlay.root.setAttribute('aria-hidden', 'false');
  overlay.root.classList.add('is-active');
  state.activeTrigger = trigger;
  positionOverlay(trigger);
  scheduleReposition();
};

const hideTooltip = (trigger) => {
  if (state.activeTrigger && trigger && state.activeTrigger !== trigger) {
    return;
  }

  if (!state.overlay) {
    state.activeTrigger = null;
    return;
  }

  if (pendingFrame) {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = null;
  }

  state.overlay.root.classList.remove('is-active');
  state.overlay.root.classList.remove('is-below');
  state.overlay.root.setAttribute('aria-hidden', 'true');
  state.activeTrigger = null;
};

const handlePointerEnter = (event) => {
  const trigger = event.target.closest(TOOLTIP_SELECTOR);
  if (trigger) {
    showTooltip(trigger);
  }
};

const handlePointerLeave = (event) => {
  const trigger = event.target.closest(TOOLTIP_SELECTOR);
  if (trigger) {
    hideTooltip(trigger);
  }
};

const handleFocusIn = (event) => {
  const trigger = event.target.closest(TOOLTIP_SELECTOR);
  if (trigger) {
    showTooltip(trigger);
  }
};

const handleFocusOut = (event) => {
  const trigger = event.target.closest(TOOLTIP_SELECTOR);
  if (trigger) {
    hideTooltip(trigger);
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && state.activeTrigger) {
    hideTooltip(state.activeTrigger);
  }
};

export const initializeTooltipManager = () => {
  if (isInitialized || typeof document === 'undefined') {
    return;
  }

  isInitialized = true;
  document.addEventListener('pointerenter', handlePointerEnter, true);
  document.addEventListener('pointerleave', handlePointerLeave, true);
  document.addEventListener('focusin', handleFocusIn, true);
  document.addEventListener('focusout', handleFocusOut, true);
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('scroll', scheduleReposition, true);
  window.addEventListener('scroll', scheduleReposition, true);
  window.addEventListener('resize', scheduleReposition, true);
};
