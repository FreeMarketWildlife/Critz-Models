import { normalizeWeapon } from './weaponSchema.js';

const FALLBACK_RARITY_BY_CATEGORY = {
  primary: 'rare',
  secondary: 'uncommon',
  melee: 'common',
  utility: 'uncommon',
};

const weaponDefinitions = [
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
      damage: '100',
      fireMode: 'Manual',
      rpm: '50',
      ammo: '1/6',
      reloadSpeed: '1s',
      drawSpeed: '0.5s',
      range: '300cm',
    },
    special: {
      info: 'Splash damage tiers: 100% / 50% / 25% from center outward.',
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
      damage: '10',
      fireMode: 'Full-Auto Splash',
      rpm: '120',
      ammoOverheat: '10/100',
      cooldown: '2s',
      drawSpeed: '0.5s',
      range: '100cm',
    },
  },

  // Secondaries
  {
    name: 'Blaster Pistol',
    category: 'secondary',
    description: 'Reliable sidearm that vents heat between bursts.',
    stats: {
      damage: '5',
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
      damage: '10',
      fireMode: 'Semi-Auto Splash',
      rpm: '300',
      ammo: '8/16',
      reloadSpeed: '0.2s',
      drawSpeed: '0.2s',
      range: '100cm',
    },
    special: {
      info: 'Splash damage falls to 50% on the second ring and 25% on the outer ring.',
    },
  },
  {
    name: 'Fey Wand',
    category: 'secondary',
    description: 'Full-auto wand that bathes targets in fae energy.',
    stats: {
      damage: '15',
      fireMode: 'Fully-Auto Splash',
      rpm: '120',
      overheat: '20/100',
      cooldown: '3s',
      drawSpeed: '0.1s',
      range: '100cm',
    },
  },
  {
    name: 'Flamethrower',
    category: 'secondary',
    description: 'Close-range burner that drenches foes in flame.',
    stats: {
      damage: 'Fire (10/s for 3s)',
      fireMode: 'Full-Auto AOE',
      rpm: '1000',
      overheat: '2/100',
      cooldown: '2s',
      drawSpeed: '0.4s',
      range: '10cm',
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
    },
    special: {
      ability: 'Grapple',
      effect: 'Hold on to Enemy',
      cooldown: '5s',
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
    },
    special: {
      ability: 'Assassinate',
      effect: 'Kill from Behind',
      cooldown: '10s',
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
    },
    special: {
      ability: 'Throw',
      effect: 'Throw Tomahawk (Tomahawks can be picked up)',
      cooldown: '0.1s',
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
    },
    special: {
      ability: 'Deflect',
      effect: 'Returns Enemy Shots for 1s (excludes arrows)',
      cooldown: '5s',
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
    },
    special: {
      ability: 'Bash',
      effect: 'Knock Back Enemy Units',
      cooldown: '5s',
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
    },
    special: {
      ability: 'Ground Pound',
      effect: 'Swing the Warhammer at the Ground',
      cooldown: '10s',
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
    },
    special: {
      ability: 'Spin',
      effect: 'Blows Self & Enemies Back; Disarms Enemy Arrows',
      cooldown: '5s',
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
    },
    special: {
      info: 'Grenades push enemies & self back; cannot be cooked.',
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
    },
    special: {
      info: 'Creates a sphere of smoke on hit; smoke extinguishes fire.',
    },
  },
  {
    name: 'Resource Pack',
    category: 'utility',
    description: 'Support drop that refreshes health and ammunition.',
    stats: {
      effect: 'Restores 50% of max ammo & health',
      deploy: 'Drop',
      capacity: '4',
      range: '2cm',
    },
    special: {
      info: 'Resource packs can be picked up by any unit.',
    },
  },
  {
    name: 'Mines',
    category: 'utility',
    description: 'Area denial charges triggered by contact.',
    stats: {
      damage: '150',
      deploy: 'Drop',
      capacity: '4',
      range: '2cm',
    },
    special: {
      info: 'Triggered when enemy units step on them or shoot them (50 health).',
    },
  },
  {
    name: 'Glider',
    category: 'utility',
    description: 'Traversal tool that lets units ride the air.',
    stats: {
      deploy: 'Hold',
    },
    special: {
      info: 'Units glide by equipping the glider and falling; movement is forced forward.',
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
    },
    special: {
      info: 'Creates a pool of gas on hit; gas can be lit on fire by any team.',
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
    },
    special: {
      info: 'Creates a pool of fire on hit.',
    },
  },
  {
    name: "Bottle o' Lightning",
    category: 'utility',
    description: 'Crackling vial that paralyzes anything within.',
    stats: {
      effect: 'Lightning (Paralyzes enemy units for 0.5s every 1s)',
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
    },
    special: {
      info: 'Creates a pool of electricity on hit.',
    },
  },
  {
    name: "Bottle o' Ice",
    category: 'utility',
    description: 'Chilling vial that strips traction from the ground.',
    stats: {
      effect: 'Ice (All units have 50% less friction)',
      deploy: 'Throw',
      capacity: '2',
      range: '50cm',
    },
    special: {
      info: 'Creates a pool of ice on hit.',
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
    },
    special: {
      info: 'Creates a blast of air that pushes enemies & self away.',
    },
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const weaponGlobals = {
  headshot_multiplier: 2,
  units: {
    distance: 'cm',
  },
};

export const sampleWeapons = weaponDefinitions.map((weapon) =>
  normalizeWeapon({
    id: slugify(weapon.name),
    category: weapon.category,
    rarity: weapon.rarity || FALLBACK_RARITY_BY_CATEGORY[weapon.category] || 'common',
    description: weapon.description || '',
    name: weapon.name,
    stats: {
      ...(weapon.stats || {}),
    },
    special: {
      ...(weapon.special || {}),
    },
  })
);
