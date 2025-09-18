import { normalizeWeapon } from './weaponSchema.js';

export const weaponGlobals = {
  base_health: 100,
  base_speed: 100,
  base_stamina: 100,
  headshot_multiplier: 3.0,
  units: {
    distance: 'cm',
    time: 's',
  },
};

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

const RAW_WEAPONS = [
  {
    name: 'Assault Rifle',
    category: 'primary',
    stats: {
      damage: '10',
      fireRate: '500 RPM',
      magazineSize: '20/100',
      reloadSpeed: '0.5s',
      drawSpeed: '0.2s',
      range: '300cm',
    },
    special: {
      fireMode: 'Full-Auto',
    },
  },
  {
    name: 'Sniper Rifle',
    category: 'primary',
    stats: {
      damage: '50',
      fireRate: '60 RPM',
      magazineSize: '4/16',
      reloadSpeed: '2s',
      drawSpeed: '0.5s',
      range: '1000cm',
    },
    special: {
      fireMode: 'Semi-Auto',
    },
  },
  {
    name: 'Rocket Launcher',
    category: 'primary',
    stats: {
      damage: '100',
      fireRate: '50 RPM',
      magazineSize: '1/6',
      reloadSpeed: '1s',
      drawSpeed: '0.5s',
      range: '300cm',
    },
    special: {
      fireMode: 'Manual',
    },
  },
  {
    name: 'Bow',
    category: 'primary',
    stats: {
      damage: '15',
      fireRate: '200 RPM',
      magazineSize: '1/30',
      reloadSpeed: '0.3s',
      drawSpeed: '0.2s',
      range: '100-300cm',
    },
    special: {
      fireMode: 'Drawn',
    },
  },
  {
    name: 'Crossbow',
    category: 'primary',
    stats: {
      damage: '30',
      fireRate: '120 RPM',
      magazineSize: '1/14',
      reloadSpeed: '0.5s',
      drawSpeed: '0.5s',
      range: '200cm',
    },
    special: {
      fireMode: 'Manual',
    },
  },
  {
    name: 'Wizard Staff',
    category: 'primary',
    stats: {
      damage: '10',
      fireRate: '120 RPM',
      capacity: '10/100',
      cooldown: '2s',
      drawSpeed: '0.5s',
      range: '100cm',
    },
    special: {
      fireMode: 'Full-Auto Splash',
    },
  },
  {
    name: 'Blaster Pistol',
    category: 'secondary',
    stats: {
      damage: '5',
      fireRate: '300 RPM',
      heatCapacity: '20/100',
      cooldown: '2s',
      drawSpeed: '0.1s',
      range: '100cm',
    },
    special: {
      fireMode: ' ',
    },
  },
  {
    name: 'Slingshot',
    category: 'secondary',
    stats: {
      damage: '5',
      fireRate: '150 RPM',
      reloadSpeed: '0.4s',
      drawSpeed: '0.1s',
      range: '50-100cm',
    },
    special: {
      fireMode: 'Drawn',
    },
  },
  {
    name: 'Splash Blaster',
    category: 'secondary',
    stats: {
      damage: '10',
      fireRate: '300 RPM',
      magazineSize: '8/16',
      reloadSpeed: '0.2s',
      drawSpeed: '0.2s',
      range: '100cm',
    },
    special: {
      fireMode: 'Semi-Auto Splash',
    },
  },
  {
    name: 'Fey Wand',
    category: 'secondary',
    stats: {
      damage: '15',
      fireRate: '120 RPM',
      heatCapacity: '20/100',
      cooldown: '3s',
      drawSpeed: '0.1s',
      range: '100cm',
    },
    special: {
      fireMode: 'Fully-Auto Splash',
    },
  },
  {
    name: 'Flamethrower',
    category: 'secondary',
    stats: {
      damage: 'Fire (10/s for 3s)',
      fireRate: '1000 RPM',
      heatCapacity: '2/100',
      cooldown: '2s',
      drawSpeed: '0.4s',
      range: '10cm',
    },
    special: {
      fireMode: 'Full-Auto AOE',
    },
  },
  {
    name: 'Hands (Fists)',
    category: 'melee',
    stats: {
      damage: '3',
      fireRate: '300 RPM',
      staminaCost: '5/15',
      drawSpeed: '0.1s',
      range: '2cm',
    },
    special: {
      ability: 'Grapple: Hold on to Enemy',
      abilityCooldown: '5s',
    },
  },
  {
    name: 'Knife',
    category: 'melee',
    stats: {
      damage: '15',
      fireRate: '120 RPM',
      staminaCost: '10/5',
      drawSpeed: '0.1s',
      range: '2cm',
    },
    special: {
      ability: 'Assassinate: Kill from Behind',
      abilityCooldown: '10s',
    },
  },
  {
    name: 'Tomahawk',
    category: 'melee',
    stats: {
      damage: '20',
      fireRate: '60 RPM',
      staminaCost: '15/10',
      drawSpeed: '0.3s',
      range: '3cm',
    },
    special: {
      ability: 'Throw: Throw Tomahawk (Tomahawks are Able to be Picked Up)',
      abilityCooldown: '0.1s',
    },
  },
  {
    name: 'Katana',
    category: 'melee',
    stats: {
      damage: '15',
      fireRate: '120 RPM',
      staminaCost: '10/25-100',
      drawSpeed: '0.2s',
      range: '4cm',
    },
    special: {
      ability:
        'Deflect: Returns Enemy Shots for 1s (Stamina Spent Scales with Hypothetical Damage Dealt; Excludes Arrows)',
      abilityCooldown: '5s',
    },
  },
  {
    name: 'Shield',
    category: 'melee',
    stats: {
      damage: '5',
      fireRate: '90 RPM',
      staminaCost: '10/30',
      drawSpeed: '0.5s',
      range: '2cm',
    },
    special: {
      ability: 'Bash: Knock Back Enemy Units',
      abilityCooldown: '5s',
    },
  },
  {
    name: 'Warhammer',
    category: 'melee',
    stats: {
      damage: '30',
      fireRate: '60 RPM',
      staminaCost: '30/50 Splash',
      drawSpeed: '1s',
      range: '4cm',
    },
    special: {
      ability: 'Ground Pound: Swing the Warhammer at the Ground',
      abilityCooldown: '10s',
    },
  },
  {
    name: 'Bo Staff',
    category: 'melee',
    stats: {
      damage: '5',
      fireRate: '180 RPM',
      staminaCost: '2/10',
      drawSpeed: '0.1s',
      range: '3cm',
    },
    special: {
      ability: 'Spin: Blows Self & Enemies Back; Disarms Enemy Arrows',
      abilityCooldown: '5s',
    },
  },
  {
    name: 'Grenade',
    category: 'utility',
    stats: {
      damage: '50 Splash',
      carryLimit: '2',
      range: '50cm',
    },
    special: {
      deploy: 'Throw',
      info: 'Grenades Push Enemies & Self Back; Grenades Cannot be Cooked',
    },
  },
  {
    name: 'Smoke Grenade',
    category: 'utility',
    stats: {
      carryLimit: '2',
      range: '50cm',
    },
    special: {
      deploy: 'Throw',
      info: 'Creates Sphere of Smoke On Hit; Smoke Distinguishes Fire',
    },
  },
  {
    name: 'Resource Pack',
    category: 'utility',
    stats: {
      carryLimit: '4',
      range: '2cm',
    },
    special: {
      deploy: 'Drop',
      info: 'Restores 50% of Max Ammo & Health; Resource Packs can be picked up by any Unit (Friendly or Enemy)',
    },
  },
  {
    name: 'Mines',
    category: 'utility',
    stats: {
      damage: '150 damage',
      carryLimit: '4',
      range: '2cm',
    },
    special: {
      deploy: 'Drop',
      info: 'Mines are triggered when an Enemy Unit steps on them, or shoots them (50 health)',
    },
  },
  {
    name: 'Glider',
    category: 'utility',
    stats: {},
    special: {
      deploy: 'Hold',
      info: 'Units Can Glide by Equipping Glider and Falling, Units will be Forced to Move Forward',
    },
  },
  {
    name: 'Bottle o’ Gas',
    category: 'utility',
    stats: {
      damage: 'Gas (5/s for 5s)',
      carryLimit: '2',
      range: '50cm',
    },
    special: {
      deploy: 'Throw',
      info: 'Create a Pool of Gas on Hit; Gas can be lit on fire by any team to deal damage to the enemy team.',
    },
  },
  {
    name: 'Bottle o’ Fire',
    category: 'utility',
    stats: {
      damage: 'Fire (10/s for 3s)',
      carryLimit: '2',
      range: '50cm',
    },
    special: {
      deploy: 'Throw',
      info: 'Create a Pool of Fire on Hit',
    },
  },
  {
    name: 'Bottle o’ Lightning',
    category: 'utility',
    stats: {
      carryLimit: '2',
      range: '50cm',
    },
    special: {
      deploy: 'Throw',
      effect: 'Lightning (Paralyzes Enemy Units for 0.5s every 1s)',
      info: 'Create a Pool of Electricity on Hit',
    },
  },
  {
    name: 'Bottle o’ Ice',
    category: 'utility',
    stats: {
      carryLimit: '2',
      range: '50cm',
    },
    special: {
      deploy: 'Throw',
      effect: 'Ice (All Units Have 50% Less Friction)',
      info: 'Create a Pool of Ice on Hit',
    },
  },
  {
    name: 'Bottle o’ Air',
    category: 'utility',
    stats: {
      carryLimit: '2',
      range: '50cm',
    },
    special: {
      deploy: 'Throw',
      info: 'Create a Blast of Air that Pushes Enemies & Self Away',
    },
  },
];

export const sampleWeapons = RAW_WEAPONS.map((weapon) => {
  const category = weapon.category.toLowerCase();

  return normalizeWeapon({
    id: slugify(weapon.name),
    name: weapon.name,
    category,
    rarity: weapon.rarity || FALLBACK_RARITY_BY_CATEGORY[category] || 'common',
    description: weapon.description || 'Specification pending.',
    stats: weapon.stats || {},
    special: weapon.special || {},
  });
});

