const TRIGGER_SELECTOR = '.tooltip-trigger[data-tooltip]';
const OFFSET = 12;
let tooltipElement = null;
let activeTrigger = null;
let rafId = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ensureTooltipElement = () => {
  if (!tooltipElement) {
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltip-bubble';
    tooltipElement.setAttribute('role', 'tooltip');
    tooltipElement.id = 'tooltip-bubble';
    document.body.appendChild(tooltipElement);
  }
  return tooltipElement;
};

const schedulePositionUpdate = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }

  rafId = requestAnimationFrame(() => {
    rafId = null;
    if (activeTrigger) {
      positionTooltip(activeTrigger);
    }
  });
};

const hideTooltip = (target) => {
  if (!tooltipElement || (target && target !== activeTrigger)) {
    return;
  }

  tooltipElement.removeAttribute('data-visible');
  tooltipElement.removeAttribute('data-position');
  tooltipElement.textContent = '';
  if (activeTrigger) {
    activeTrigger.removeAttribute('aria-describedby');
  }
  activeTrigger = null;
};

const showTooltip = (target) => {
  if (!target || typeof target.getAttribute !== 'function') {
    return;
  }

  const description = target.getAttribute('data-tooltip');
  if (!description) {
    return;
  }

  if (activeTrigger && activeTrigger !== target) {
    hideTooltip(activeTrigger);
  }

  const bubble = ensureTooltipElement();
  bubble.textContent = description;
  bubble.setAttribute('data-visible', 'true');
  activeTrigger = target;
  target.setAttribute('aria-describedby', bubble.id);
  positionTooltip(target);
};

function positionTooltip(target) {
  if (!tooltipElement) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const bubbleRect = tooltipElement.getBoundingClientRect();

  let top = rect.top - bubbleRect.height - OFFSET;
  let position = 'above';

  if (top < 8) {
    top = rect.bottom + OFFSET;
    position = 'below';
  }

  let left = rect.left + rect.width / 2 - bubbleRect.width / 2;
  const maxLeft = window.innerWidth - bubbleRect.width - 8;
  left = clamp(left, 8, Math.max(8, maxLeft));

  tooltipElement.style.top = `${Math.round(top)}px`;
  tooltipElement.style.left = `${Math.round(left)}px`;
  tooltipElement.setAttribute('data-position', position);
}

const resolveTriggerFromEvent = (event) => {
  const element = event.target;
  if (!(element instanceof Element)) {
    return null;
  }
  return element.closest(TRIGGER_SELECTOR);
};

const handlePointerEnter = (event) => {
  const trigger = resolveTriggerFromEvent(event);
  if (trigger) {
    showTooltip(trigger);
  }
};

const handlePointerLeave = (event) => {
  const trigger = resolveTriggerFromEvent(event);
  if (trigger) {
    hideTooltip(trigger);
  }
};

const handleFocusIn = (event) => {
  const trigger = resolveTriggerFromEvent(event);
  if (trigger) {
    showTooltip(trigger);
  }
};

const handleFocusOut = (event) => {
  const trigger = resolveTriggerFromEvent(event);
  if (trigger) {
    hideTooltip(trigger);
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    hideTooltip(activeTrigger);
  }
};

export const installTooltipHandlers = () => {
  document.addEventListener('pointerenter', handlePointerEnter, true);
  document.addEventListener('pointerleave', handlePointerLeave, true);
  document.addEventListener('focusin', handleFocusIn, true);
  document.addEventListener('focusout', handleFocusOut, true);
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('scroll', schedulePositionUpdate, true);
  window.addEventListener('scroll', schedulePositionUpdate, true);
  window.addEventListener('resize', schedulePositionUpdate, true);
};

export const uninstallTooltipHandlers = () => {
  document.removeEventListener('pointerenter', handlePointerEnter, true);
  document.removeEventListener('pointerleave', handlePointerLeave, true);
  document.removeEventListener('focusin', handleFocusIn, true);
  document.removeEventListener('focusout', handleFocusOut, true);
  document.removeEventListener('keydown', handleKeyDown, true);
  document.removeEventListener('scroll', schedulePositionUpdate, true);
  window.removeEventListener('scroll', schedulePositionUpdate, true);
  window.removeEventListener('resize', schedulePositionUpdate, true);
  hideTooltip();
};
