const TOOLTIP_DEFINITIONS = {
  splash: 'Damage is highest at the point of impact, and falls off sharply the further away from the impact it is',
  aoe: 'There is an Area of Effect (a defined zone or radius) applying whatever damage or effects.',
  fire: 'Ignites targets for 3 seconds dealing 10 damage per second. Gas can be lit by fire.',
  rpm: 'Rounds per Minute',
  overheat:
    "Weapons that have Overheat do not use Ammo, instead they are limited by a heat meter that rises with each shot fired and dissipates between shots. X/Y means that each shot costs X, and Y is the max of the heat meter. When a weapon overheats, it must wait until it's at 0/Y to fire again.",
  gas: 'Gas deals 5 damage for 5 seconds. Gas can be lit by fire.',
  lightning: 'Paralyzes Enemy Units for 0.5s every 1s',
  ice: 'All Units Have 50% Less Friction',
};

const escapeForAttribute = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const TOOLTIP_PATTERN = new RegExp(
  `\\b(${Object.keys(TOOLTIP_DEFINITIONS)
    .map(escapeForRegex)
    .join('|')})\\b`,
  'gi'
);

const annotateWord = (word) => {
  const tooltip = TOOLTIP_DEFINITIONS[word.toLowerCase()];
  if (!tooltip) {
    return word;
  }

  const escapedTooltip = escapeForAttribute(tooltip);
  return `<span class="has-tooltip" tabindex="0" data-tooltip="${escapedTooltip}">${word}</span>`;
};

export const applyTooltips = (content) => {
  if (content === null || content === undefined) {
    return '';
  }

  const text = String(content);

  if (!text.trim()) {
    return text;
  }

  return text.replace(TOOLTIP_PATTERN, annotateWord);
};

