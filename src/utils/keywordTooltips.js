const TOOLTIP_DEFINITIONS = [
  {
    term: 'Splash',
    description:
      'Damage is highest at the point of impact, and falls off sharply the further away from the impact it is',
  },
  {
    term: 'AOE',
    description: 'There is an Area of Effect (a defined zone or radius) applying whatever damage or effects.',
  },
  {
    term: 'Gas',
    description: 'Gas deals 5 damage for 5 seconds. Gas can be lit by fire.',
  },
  {
    term: 'Fire',
    description:
      'Ignites targets for 3 seconds dealing 10 damage per second. Gas can be lit by fire.',
  },
  {
    term: 'RPM',
    description: 'Rounds per Minute',
  },
  {
    term: 'Overheat',
    description:
      'Weapons that have Overheat do not use Ammo, instead they are limited by a heat meter that rises with each shot fired and dissipates between shots. X/Y means that each shot costs X, and Y is the max of the heat meter. When a weapon overheats, it must wait until it\'s at 0/Y to fire again.',
  },
  {
    term: 'Lightning',
    description: 'Paralyzes Enemy Units for 0.5s every 1s',
  },
  {
    term: 'Ice',
    description: 'All Units Have 50% Less Friction',
  },
];

const escapeAttribute = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const buildTooltipMarkup = (label, description) => {
  const escapedDescription = escapeAttribute(description);
  return `<span class="tooltip" data-tooltip="${escapedDescription}" tabindex="0" aria-label="${escapedDescription}">${label}</span>`;
};

const shouldSkipMatch = (term, text, startIndex, endIndex) => {
  if (term.toLowerCase() === 'fire') {
    const trailing = text.slice(endIndex);
    if (/^\s*mode\b/i.test(trailing)) {
      return true;
    }
  }
  return false;
};

let tooltipLayerElement = null;
let activeTooltipTarget = null;
let isTooltipSystemInitialized = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ensureTooltipLayer = () => {
  if (tooltipLayerElement && document.body.contains(tooltipLayerElement)) {
    return;
  }

  tooltipLayerElement = document.createElement('div');
  tooltipLayerElement.className = 'tooltip-layer';
  tooltipLayerElement.dataset.visible = 'false';
  tooltipLayerElement.dataset.placement = 'top';
  tooltipLayerElement.setAttribute('role', 'tooltip');
  tooltipLayerElement.setAttribute('aria-hidden', 'true');
  tooltipLayerElement.style.left = '0px';
  tooltipLayerElement.style.top = '0px';
  document.body.appendChild(tooltipLayerElement);
};

const getTooltipText = (target) =>
  target?.getAttribute('data-tooltip')?.trim() || target?.getAttribute('aria-label')?.trim() || '';

const positionTooltipLayer = () => {
  if (!tooltipLayerElement || !activeTooltipTarget) {
    return;
  }

  if (!activeTooltipTarget.isConnected) {
    activeTooltipTarget = null;
    tooltipLayerElement.dataset.visible = 'false';
    tooltipLayerElement.setAttribute('aria-hidden', 'true');
    return;
  }

  const rect = activeTooltipTarget.getBoundingClientRect();

  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  tooltipLayerElement.style.left = '0px';
  tooltipLayerElement.style.top = '0px';

  const layerRect = tooltipLayerElement.getBoundingClientRect();
  const gap = 12;
  const halfWidth = layerRect.width / 2;
  const minLeft = gap + halfWidth;
  const maxLeft = viewportWidth - gap - halfWidth;
  const centerLeft = rect.left + rect.width / 2;
  const clampedLeft = clamp(centerLeft, minLeft, maxLeft);

  let top = rect.top - gap - layerRect.height;
  let placement = 'top';

  if (top < gap) {
    top = Math.min(rect.bottom + gap, viewportHeight - gap - layerRect.height);
    placement = 'bottom';
  }

  tooltipLayerElement.dataset.placement = placement;
  tooltipLayerElement.style.left = `${Math.round(clampedLeft)}px`;
  tooltipLayerElement.style.top = `${Math.round(top)}px`;
};

const showTooltipLayer = (target) => {
  if (!target) {
    return;
  }

  ensureTooltipLayer();
  const tooltipText = getTooltipText(target);
  if (!tooltipText) {
    return;
  }

  activeTooltipTarget = target;
  tooltipLayerElement.textContent = tooltipText;
  tooltipLayerElement.dataset.visible = 'true';
  tooltipLayerElement.setAttribute('aria-hidden', 'false');
  positionTooltipLayer();
};

const hideTooltipLayer = (target) => {
  if (!tooltipLayerElement) {
    return;
  }

  if (target && target !== activeTooltipTarget) {
    return;
  }

  activeTooltipTarget = null;
  tooltipLayerElement.dataset.visible = 'false';
  tooltipLayerElement.setAttribute('aria-hidden', 'true');
};

const handlePointerOver = (event) => {
  const target = event.target?.closest?.('.tooltip');
  if (!target) {
    return;
  }
  showTooltipLayer(target);
};

const handlePointerOut = (event) => {
  if (!activeTooltipTarget) {
    return;
  }

  const origin = event.target?.closest?.('.tooltip');
  if (!origin) {
    return;
  }

  const related = event.relatedTarget instanceof Element ? event.relatedTarget.closest('.tooltip') : null;
  if (related === origin) {
    return;
  }

  hideTooltipLayer(origin);
};

const handleFocusIn = (event) => {
  const target = event.target?.closest?.('.tooltip');
  if (!target) {
    return;
  }
  showTooltipLayer(target);
};

const handleFocusOut = (event) => {
  if (!activeTooltipTarget) {
    return;
  }

  const origin = event.target?.closest?.('.tooltip');
  if (!origin) {
    return;
  }

  if (event.relatedTarget instanceof Element && origin.contains(event.relatedTarget)) {
    return;
  }

  hideTooltipLayer(origin);
};

const handleViewportChange = () => {
  if (!activeTooltipTarget) {
    return;
  }
  positionTooltipLayer();
};

export const initializeKeywordTooltips = () => {
  if (isTooltipSystemInitialized) {
    return;
  }
  isTooltipSystemInitialized = true;

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        ensureTooltipLayer();
      },
      { once: true }
    );
  } else {
    ensureTooltipLayer();
  }

  document.addEventListener('pointerover', handlePointerOver);
  document.addEventListener('pointerout', handlePointerOut);
  document.addEventListener('focusin', handleFocusIn);
  document.addEventListener('focusout', handleFocusOut);
  window.addEventListener('scroll', handleViewportChange, true);
  window.addEventListener('resize', handleViewportChange);
};

export const applyKeywordTooltips = (input) => {
  if (input === null || input === undefined) {
    return '';
  }

  const text = String(input);
  const matches = [];

  TOOLTIP_DEFINITIONS.forEach(({ term, description }) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;
      if (shouldSkipMatch(term, text, startIndex, endIndex)) {
        continue;
      }
      matches.push({
        start: startIndex,
        end: endIndex,
        replacement: buildTooltipMarkup(match[0], description),
      });
    }
  });

  if (!matches.length) {
    return text;
  }

  matches.sort((a, b) => {
    if (a.start === b.start) {
      return b.end - a.end;
    }
    return a.start - b.start;
  });

  const filtered = [];
  let lastEnd = -1;

  matches.forEach((match) => {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  });

  let cursor = 0;
  let result = '';

  filtered.forEach((match) => {
    result += text.slice(cursor, match.start);
    result += match.replacement;
    cursor = match.end;
  });

  result += text.slice(cursor);
  return result;
};
