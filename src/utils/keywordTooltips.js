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
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
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
