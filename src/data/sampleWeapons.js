import { CATEGORY_IDS } from '../config/categories.js';

const sampleWeapons = [
  {
    core: {
      name: 'Asterion Longbow',
      slug: 'asterion-longbow',
      category: CATEGORY_IDS.PRIMARY,
      rarity: 'Legendary',
      manufacturer: 'Critz Arcforge',
      lore:
        'Forged from voidglass and starlit sinew, the Asterion Longbow channels astral currents into devastating piercing shots.',
    },
    stats: {
      damage: 280,
      fireRate: 0.8,
      drawTime: 1.1,
      quiverSize: 1,
      capacity: 24,
      critChance: 0.38,
      critMultiplier: 2.1,
      statusChance: 0.18,
      range: 120,
      element: 'Radiant',
    },
    mechanics: {
      ammoType: 'Astral Arrow',
      altFire: 'Meteoric Volley',
    },
    visual: {
      modelPath: 'assets/models/asterion-longbow/asterion-longbow.glb',
      thumbnail: 'assets/models/asterion-longbow/thumbnail.png',
      accentColor: '#8f7dff',
    },
  },
  {
    core: {
      name: 'Wispfire Duets',
      slug: 'wispfire-duets',
      category: CATEGORY_IDS.SECONDARY,
      rarity: 'Epic',
      manufacturer: 'Emberwright Guild',
      lore:
        'Twin spellpistols woven with ember wisps, excelling at close-range execution with incendiary arcs.',
    },
    stats: {
      damage: 62,
      fireRate: 6.5,
      magazineSize: 24,
      reloadSpeed: 1.6,
      critChance: 0.24,
      statusChance: 0.32,
      element: 'Ember',
    },
    mechanics: {
      ammoType: 'Cindered Casings',
      altFire: 'Overcharged Fan',
    },
    visual: {
      modelPath: 'assets/models/wispfire-duets/wispfire-duets.glb',
      thumbnail: 'assets/models/wispfire-duets/thumbnail.png',
      accentColor: '#ff6f4c',
    },
  },
  {
    core: {
      name: 'Galecleaver',
      slug: 'galecleaver',
      category: CATEGORY_IDS.MELEE,
      rarity: 'Rare',
      manufacturer: 'Stormkind Smiths',
      lore:
        'A war-axe humming with storm runes. Each swing draws cyclonic force to batter foes and deflect projectiles.',
    },
    stats: {
      damage: 190,
      swingSpeed: 1.15,
      comboMultiplier: 3.4,
      impactForce: 820,
      blockEfficiency: 0.52,
      element: 'Tempest',
    },
    mechanics: {
      stance: 'Cyclone Executioner',
    },
    visual: {
      modelPath: 'assets/models/galecleaver/galecleaver.glb',
      thumbnail: 'assets/models/galecleaver/thumbnail.png',
      accentColor: '#6fd4ff',
    },
  },
  {
    core: {
      name: 'Frostwarden Bulwark',
      slug: 'frostwarden-bulwark',
      category: CATEGORY_IDS.UTILITY,
      rarity: 'Legendary',
      manufacturer: 'Northreach Vault',
      lore:
        'An arcane barrier projector that crystallizes the air into a towering shield wall capable of reflecting spells.',
    },
    stats: {
      capacity: 950,
      deployTime: 0.9,
      duration: 16,
      cooldown: 12,
      statusChance: 0.12,
      element: 'Frost',
    },
    mechanics: {
      utilityType: 'Deployable Shield',
    },
    visual: {
      modelPath: 'assets/models/frostwarden-bulwark/frostwarden-bulwark.glb',
      thumbnail: 'assets/models/frostwarden-bulwark/thumbnail.png',
      accentColor: '#8bdcff',
    },
  },
];

export default sampleWeapons;
