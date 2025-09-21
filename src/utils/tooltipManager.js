const TOOLTIP_MARGIN = 12;
let tooltipRoot = null;
let tooltipBubble = null;
let tooltipArrow = null;
let installed = false;
let activeTarget = null;

const ensureTooltipRoot = () => {
  if (tooltipRoot) {
    return;
  }

  tooltipRoot = document.createElement('div');
  tooltipRoot.className = 'tooltip-layer';
  tooltipRoot.setAttribute('role', 'tooltip');
  tooltipRoot.hidden = true;

  tooltipBubble = document.createElement('div');
  tooltipBubble.className = 'tooltip-layer__bubble';

  tooltipArrow = document.createElement('div');
  tooltipArrow.className = 'tooltip-layer__arrow';

  tooltipRoot.appendChild(tooltipBubble);
  tooltipRoot.appendChild(tooltipArrow);
  document.body.appendChild(tooltipRoot);
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const positionTooltip = (target) => {
  if (!tooltipRoot || !tooltipBubble || !tooltipArrow) {
    return;
  }

  const description = target.getAttribute('data-tooltip');
  if (!description) {
    return;
  }

  tooltipBubble.textContent = description;
  tooltipRoot.hidden = false;
  tooltipRoot.classList.add('is-visible');

  requestAnimationFrame(() => {
    if (!tooltipRoot || tooltipRoot.hidden) {
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const bubbleRect = tooltipBubble.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    let top = targetRect.top - bubbleRect.height - TOOLTIP_MARGIN;
    let placement = 'top';

    if (top < TOOLTIP_MARGIN) {
      top = targetRect.bottom + TOOLTIP_MARGIN;
      placement = 'bottom';
    }

    top = clamp(top, TOOLTIP_MARGIN, viewportHeight - bubbleRect.height - TOOLTIP_MARGIN);

    const idealCenter = targetRect.left + targetRect.width / 2;
    let left = idealCenter - bubbleRect.width / 2;
    left = clamp(left, TOOLTIP_MARGIN, viewportWidth - bubbleRect.width - TOOLTIP_MARGIN);

    const arrowOffset = clamp(
      idealCenter - left,
      TOOLTIP_MARGIN,
      bubbleRect.width - TOOLTIP_MARGIN
    );

    tooltipRoot.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    tooltipRoot.dataset.placement = placement;
    tooltipRoot.style.setProperty('--tooltip-arrow-offset', `${Math.round(arrowOffset)}px`);
  });
};

const hideTooltip = () => {
  if (!tooltipRoot) {
    return;
  }

  tooltipRoot.classList.remove('is-visible');
  tooltipRoot.hidden = true;
  tooltipRoot.removeAttribute('data-placement');
  activeTarget = null;
};

const handlePointerEnter = (event) => {
  const target = event.target?.closest?.('[data-tooltip]');
  if (!target || target === activeTarget) {
    return;
  }

  activeTarget = target;
  ensureTooltipRoot();
  positionTooltip(target);
};

const handlePointerLeave = (event) => {
  if (!activeTarget) {
    return;
  }

  const target = event.target?.closest?.('[data-tooltip]');
  if (!target || target !== activeTarget) {
    return;
  }

  hideTooltip();
};

const handleFocusIn = (event) => {
  const target = event.target?.closest?.('[data-tooltip]');
  if (!target) {
    return;
  }

  activeTarget = target;
  ensureTooltipRoot();
  positionTooltip(target);
};

const handleFocusOut = (event) => {
  if (!activeTarget) {
    return;
  }

  if (event.target === activeTarget) {
    hideTooltip();
  }
};

const handleScroll = () => {
  if (activeTarget) {
    hideTooltip();
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    hideTooltip();
  }
};

export const installTooltipLayer = () => {
  if (installed) {
    return;
  }

  installed = true;

  document.addEventListener('pointerenter', handlePointerEnter, true);
  document.addEventListener('pointerleave', handlePointerLeave, true);
  document.addEventListener('focusin', handleFocusIn, true);
  document.addEventListener('focusout', handleFocusOut, true);
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleScroll, true);
  window.addEventListener('keydown', handleKeyDown, true);
};

export const forceTooltipReposition = () => {
  if (!activeTarget) {
    return;
  }
  positionTooltip(activeTarget);
};
