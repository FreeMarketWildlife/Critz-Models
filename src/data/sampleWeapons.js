import { normalizeWeapon } from './weaponSchema.js';

const RAW_GLOBALS = {
  base_health: 100,
  base_speed: 100,
  base_stamina: 100,
  headshot_multiplier: 2.0,
  units: {
    distance: 'cm',
    time: 's',
  },
  rules: {
    headshots_apply_to: ['projectiles', 'bullets'],
    headshots_excluded_for: ['explosives', 'aoe', 'dot', 'melee', 'traps'],
  },
};

const RAW_WEAPONS = [
  // Primaries
  {
    name: 'Assault Rifle',
    category: 'primary',
    description: 'Standard issue rifle offering controllable automatic fire.',
    stats: {
      damage: '10',
      fireMode: 'Full-Auto',
      rpm: '500',
      ammo: '20/100',
      reloadSpeed: '0.5s',
      drawSpeed: '0.2s',
      range: '300cm',
    },
  },
  {
    name: 'Sniper Rifle',
    category: 'primary',
    description: 'Precision rifle built for long-range eliminations.',
    stats: {
      damage: '50',
      fireMode: 'Semi-Auto',
      rpm: '60',
      ammo: '4/16',
      reloadSpeed: '2s',
      drawSpeed: '0.5s',
      range: '1000cm',
    },
  },
  {
    name: 'Rocket Launcher',
    category: 'primary',
    description: 'Heavy launcher delivering high splash damage.',
    stats: {
      damage: '100 Splash',
      fireMode: 'Manual',
      rpm: '50',
      ammo: '1/6',
      reloadSpeed: '1s',
      drawSpeed: '0.5s',
      range: '300cm',
    },
    special: {
      splash: 'Splash damage drops to 50% in the inner ring and 25% in the outer ring.',
    },
  },
  {
    name: 'Bow',
    category: 'primary',
    description: 'Lightweight bow with flexible draw strength.',
    stats: {
      damage: '15',
      fireMode: 'Drawn',
      rpm: '200',
      ammo: '1/30',
      reloadSpeed: '0.3s',
      drawSpeed: '0.2s',
      range: '100-300cm',
    },
  },
  {
    name: 'Crossbow',
    category: 'primary',
    description: 'Precision bolt thrower with high per-shot impact.',
    stats: {
      damage: '30',
      fireMode: 'Manual',
      rpm: '120',
      ammo: '1/14',
      reloadSpeed: '0.5s',
      drawSpeed: '0.5s',
      range: '200cm',
    },
  },
  {
    name: 'Wizard Staff',
    category: 'primary',
    description: 'Channelled staff that spits arcane splash bolts.',
    stats: {
      damage: '10 Splash damage',
      fireMode: 'Full-Auto',
      rpm: '120',
      ammoOverheat: '10/100',
      cooldown: '2s',
      drawSpeed: '0.5s',
      range: '100cm',
    },
    special: {
      splash: 'Splash damage drops to 50% in the inner ring and 25% in the outer ring.',
    },
  },

  // Secondaries
  {
    name: 'Blaster Pistol',
    category: 'secondary',
    description: 'Reliable sidearm that vents heat between bursts.',
    stats: {
      damage: '5',
      fireMode: 'Semi-Auto',
      rpm: '300',
      overheat: '20/100',
      cooldown: '2s',
      drawSpeed: '0.1s',
      range: '100cm',
    },
  },
  {
    name: 'Slingshot',
    category: 'secondary',
    description: 'Elastic launcher for quick pebbles and seeds.',
    stats: {
      damage: '5',
      fireMode: 'Drawn',
      rpm: '150',
      reloadSpeed: '0.4s',
      drawSpeed: '0.1s',
      range: '50-100cm',
    },
  },
  {
    name: 'Splash Blaster',
    category: 'secondary',
    description: 'Burst sidearm that saturates tight spaces.',
    stats: {
      damage: '10 Splash damage',
      fireMode: 'Semi-Auto',
      rpm: '300',
      ammo: '8/16',
      reloadSpeed: '0.2s',
      drawSpeed: '0.2s',
      range: '100cm',
    },
    special: {
      splash: 'Splash damage drops to 50% in the inner ring and 25% in the outer ring.',
    },
  },
  {
    name: 'Fey Wand',
    category: 'secondary',
    description: 'Full-auto wand that bathes targets in fae energy.',
    stats: {
      damage: '15 Splash damage',
      fireMode: 'Full-Auto',
      rpm: '120',
      overheat: '20/100',
      cooldown: '3s',
      drawSpeed: '0.1s',
      range: '100cm',
    },
    special: {
      splash: 'Splash damage drops to 50% in the inner ring and 25% in the outer ring.',
    },
  },
  {
    name: 'Flamethrower',
    category: 'secondary',
    description: 'Close-range burner that drenches foes in flame.',
    stats: {
      damage: 'Fire AOE',
      fireMode: 'Full-Auto',
      rpm: '1000',
      overheat: '2/100',
      cooldown: '2s',
      drawSpeed: '0.4s',
      range: '10cm',
    },
    special: {
      burnProfile: 'Ignites targets for 3 seconds dealing 10 damage per second.',
    },
  },

  // Melee
  {
    name: 'Hands',
    category: 'melee',
    description: 'Basic close-quarters strikes powered by stamina.',
    stats: {
      damage: '3',
      rpm: '300',
      stamina: '5/15',
      drawSpeed: '0.1s',
      range: '2cm',
      ability: 'Grapple: Hold on to Enemy',
      abilityCooldown: '5s',
    },
  },
  {
    name: 'Knife',
    category: 'melee',
    description: 'Light blade tuned for stealth eliminations.',
    stats: {
      damage: '15',
      rpm: '120',
      stamina: '10/5',
      drawSpeed: '0.1s',
      range: '2cm',
      ability: 'Assassinate: Kill from Behind',
      abilityCooldown: '10s',
    },
  },
  {
    name: 'Tomahawk',
    category: 'melee',
    description: 'Hefty blade built for brutal swings or throws.',
    stats: {
      damage: '20',
      rpm: '60',
      stamina: '15/10',
      drawSpeed: '0.3s',
      range: '3cm',
      ability: 'Throw: Throw Tomahawk (Tomahawks are Able to be Picked Up)',
      abilityCooldown: '0.1s',
    },
  },
  {
    name: 'Katana',
    category: 'melee',
    description: 'Balanced blade suited for agile duels.',
    stats: {
      damage: '15',
      rpm: '120',
      stamina: '10/25-100',
      drawSpeed: '0.2s',
      range: '4cm',
      ability:
        'Deflect: Returns Enemy Shots for 1s (Stamina Spent Scales with Hypothetical Damage Dealt; Excludes Arrows)',
      abilityCooldown: '5s',
    },
  },
  {
    name: 'Shield',
    category: 'melee',
    description: 'Protective barrier that can drive foes back.',
    stats: {
      damage: '5',
      rpm: '90',
      stamina: '10/30',
      drawSpeed: '0.5s',
      range: '2cm',
      ability: 'Bash: Knock Back Enemy Units',
      abilityCooldown: '5s',
    },
  },
  {
    name: 'Warhammer',
    category: 'melee',
    description: 'Massive hammer that crushes targets with splash.',
    stats: {
      damage: '30',
      rpm: '60',
      stamina: '30/50 Splash',
      drawSpeed: '1s',
      range: '4cm',
      ability: 'Ground Pound: Swing the Warhammer at the Ground',
      abilityCooldown: '10s',
    },
    special: {
      splash: 'Splash damage drops to 50% in the inner ring and 25% in the outer ring.',
    },
  },
  {
    name: 'Bo Staff',
    category: 'melee',
    description: 'Swift staff ideal for crowd control.',
    stats: {
      damage: '5',
      rpm: '180',
      stamina: '2/10',
      drawSpeed: '0.1s',
      range: '3cm',
      ability: 'Spin: Blows Self & Enemies Back; Disarms Enemy Arrows',
      abilityCooldown: '5s',
    },
  },

  // Utilities
  {
    name: 'Grenade',
    category: 'utility',
    description: 'Standard grenade for clearing clustered foes.',
    stats: {
      damage: '50 Splash',
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
      info: 'Grenades Push Enemies & Self Back; Grenades Cannot be Cooked',
    },
    special: {
      splash: 'Splash damage drops to 50% in the inner ring and 25% in the outer ring.',
    },
  },
  {
    name: 'Smoke Grenade',
    category: 'utility',
    description: 'Obscures sightlines with a dense smoke field.',
    stats: {
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
      info: 'Creates Sphere of Smoke On Hit; Smoke Distinguishes Fire',
    },
  },
  {
    name: 'Resource Pack',
    category: 'utility',
    description: 'Support drop that refreshes health and ammunition.',
    stats: {
      restores: '50% of Max Ammo & Health',
      deploy: 'Drop',
      capacity: '4',
      range: '2cm',
      info: 'Resource Packs can be picked up by any Unit (Friendly or Enemy)',
    },
  },
  {
    name: 'Mines',
    category: 'utility',
    description: 'Area denial charges triggered by contact.',
    stats: {
      damage: '150 damage',
      deploy: 'Drop',
      capacity: '4',
      range: '2cm',
      info: 'Mines are triggered when an Enemy Unit steps on them, or shoots them (50 health)',
    },
  },
  {
    name: 'Glider',
    category: 'utility',
    description: 'Traversal tool that lets units ride the air.',
    stats: {
      deploy: 'Hold',
      info: 'Units Can Glide by Equipping Glider and Falling, Units will be Forced to Move Forward',
    },
  },
  {
    name: "Bottle o' Gas",
    category: 'utility',
    description: 'Volatile gas bomb for area denial.',
    stats: {
      damage: 'Gas (5/s for 5s)',
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
      info: 'Create a Pool of Gas on Hit; Gas can be lit on fire by any team to deal damage to the enemy team.',
    },
  },
  {
    name: "Bottle o' Fire",
    category: 'utility',
    description: 'Ignites ground targets with lingering flames.',
    stats: {
      damage: 'Fire (10/s for 3s)',
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
      info: 'Create a Pool of Fire on Hit',
    },
  },
  {
    name: "Bottle o' Lightning",
    category: 'utility',
    description: 'Crackling vial that paralyzes anything within.',
    stats: {
      effect: 'Lightning (Paralyzes Enemy Units for 0.5s every 1s)',
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
      info: 'Create a Pool of Electricity on Hit',
    },
  },
  {
    name: "Bottle o' Ice",
    category: 'utility',
    description: 'Chilling vial that strips traction from the ground.',
    stats: {
      effect: 'Ice (All Units Have 50% Less Friction)',
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
      info: 'Create a Pool of Ice on Hit',
    },
  },
  {
    name: "Bottle o' Air",
    category: 'utility',
    description: 'Compressed gust that shoves everything outward.',
    stats: {
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
      info: 'Create a Blast of Air that Pushes Enemies & Self Away',
    },
    special: {
      knockback: 'Knockback strength follows 100%/50%/25% falloff from the impact center.',
    },
  },
];

const LEGACY_DETAILS = new Map();

const NAME_ALIASES = new Map();

const FALLBACK_RARITY_BY_CATEGORY = {
  primary: 'rare',
  secondary: 'uncommon',
  melee: 'common',
  utility: 'uncommon',
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const removeEmpty = (source) => {
  if (!source) {
    return {};
  }

  const result = {};
  Object.entries(source).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'string' && value.trim() === '') return;
    result[key] = value;
  });
  return result;
};

const getLegacyDetails = (name) => {
  const alias = NAME_ALIASES.get(name) ?? name;
  return LEGACY_DETAILS.get(alias) ?? null;
};

const buildStats = (weapon) => removeEmpty(weapon.stats);

const buildSpecial = (weapon, legacySpecial = {}) => {
  const merged = { ...(legacySpecial || {}) };
  if (weapon.special) {
    Object.assign(merged, weapon.special);
  }
  if (weapon.notes) {
    merged.notes = weapon.notes;
  }
  return removeEmpty(merged);
};

const weapons = RAW_WEAPONS.map((weapon) => {
  const category = weapon.category.toLowerCase();
  const legacy = getLegacyDetails(weapon.name) || {};

  return normalizeWeapon({
    id: slugify(weapon.name),
    name: weapon.name,
    category,
    rarity: legacy.rarity || FALLBACK_RARITY_BY_CATEGORY[category] || 'common',
    description: legacy.description || weapon.description || 'Specification pending.',
    modelPath: legacy.modelPath ?? null,
    preview: legacy.preview || undefined,
    stats: buildStats(weapon),
    special: buildSpecial(weapon, legacy.special || {}),
  });
});

export const weaponGlobals = RAW_GLOBALS;
export const sampleWeapons = weapons;

