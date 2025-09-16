import { normalizeWeapon } from './weaponSchema.js';

const basePath = 'assets/models';

const weapons = [
  normalizeWeapon({
    id: 'arc-light-lance',
    name: 'Arc-Light Lance',
    category: 'primary',
    rarity: 'legendary',
    description:
      'A spear forged from crystallized lightning. Every thrust fractures reality, discharging arcs that chain between foes.',
    modelPath: null,
    preview: {
      scale: 1.35,
    },
    stats: {
      damage: 94,
      fireRate: 0.8,
      reloadSpeed: 2.6,
      magazineSize: 4,
      capacity: 16,
      range: '36m',
    },
    special: {
      elementalAffinity: 'storm',
      passive: 'Charge attacks mark enemies, causing delayed thunderstrikes.',
    },
  }),
  normalizeWeapon({
    id: 'gilded-repeater',
    name: 'Gilded Repeater',
    category: 'primary',
    rarity: 'epic',
    description:
      'Arcane engravings along its barrel siphon mana to stabilize recoil. Designed for elite sentinels of Critz.',
    modelPath: `${basePath}/primary/gilded-repeater.glb`,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: 42,
      fireRate: 6.2,
      reloadSpeed: 1.9,
      magazineSize: 36,
      capacity: 180,
      range: '28m',
    },
    special: {
      passive: 'Landing critical hits refunds ammo and increases fire rate briefly.',
    },
  }),
  normalizeWeapon({
    id: 'whispering-pistol',
    name: 'Whispering Pistol',
    category: 'secondary',
    rarity: 'rare',
    description:
      'Compact spellfire sidearm that murmurs prophecies as it reloads. Favored by covert agents.',
    modelPath: `${basePath}/secondary/whispering-pistol.glb`,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: 38,
      fireRate: 4.8,
      reloadSpeed: 1.4,
      magazineSize: 12,
      capacity: 72,
      range: '18m',
    },
    special: {
      passive: 'First shot after reload is silenced and guaranteed to stagger.',
    },
  }),
  normalizeWeapon({
    id: 'sunflare-discus',
    name: 'Sunflare Discus',
    category: 'secondary',
    rarity: 'legendary',
    description:
      'A radiant chakram forged in solar furnaces. Returns to the wielder trailing embers.',
    modelPath: null,
    preview: {
      scale: 1.2,
    },
    stats: {
      damage: 56,
      fireRate: 2.1,
      reloadSpeed: 0.9,
      magazineSize: 1,
      capacity: 6,
      cooldown: '18s',
      range: '22m',
    },
    special: {
      passive: 'Successful return throws trigger a blinding solar flare.',
    },
  }),
  normalizeWeapon({
    id: 'thorned-glaive',
    name: 'Thorned Glaive',
    category: 'melee',
    rarity: 'epic',
    description:
      'Living vines coil around this polearm, injecting venom with every sweeping strike.',
    modelPath: `${basePath}/melee/thorned-glaive.glb`,
    preview: {
      scale: 1.5,
    },
    stats: {
      damage: 72,
      staminaCost: 14,
      attackSpeed: 'Medium',
      range: '4.5m',
    },
    special: {
      passive: 'Critical hits spawn grasping roots that immobilize nearby enemies.',
    },
  }),
  normalizeWeapon({
    id: 'aetheric-daggers',
    name: 'Aetheric Daggers',
    category: 'melee',
    rarity: 'rare',
    description:
      'Twin blades phased slightly out of reality. They slip through armor before materializing.',
    modelPath: null,
    preview: {
      scale: 0.8,
    },
    stats: {
      damage: 32,
      staminaCost: 6,
      attackSpeed: 'Very Fast',
    },
    special: {
      passive: 'Backstab damage creates ethereal clones that repeat the attack.',
    },
  }),
  normalizeWeapon({
    id: 'wyrmwood-quiver',
    name: 'Wyrmwood Quiver',
    category: 'utility',
    rarity: 'epic',
    description:
      'Quiver grown from draconic trees. Transmutes mundane arrows into wyrmfire bolts.',
    modelPath: `${basePath}/utility/wyrmwood-quiver.glb`,
    preview: {
      scale: 1.1,
    },
    stats: {
      quiverCapacity: 24,
      reloadSpeed: 1.1,
      drawSpeed: 1.3,
    },
    special: {
      passive: 'Last arrow fired in a volley erupts into splitting wyrmlings.',
    },
  }),
  normalizeWeapon({
    id: 'veilweaver-tome',
    name: 'Veilweaver Tome',
    category: 'utility',
    rarity: 'legendary',
    description:
      'Spellbook that summons protective veils while channeling destructive wards.',
    modelPath: null,
    preview: {
      scale: 1.05,
    },
    stats: {
      shieldStrength: 320,
      cooldown: '24s',
      duration: '12s',
    },
    special: {
      passive: 'Channel to alternate between fortifying allies and unleashing arcane bursts.',
    },
  }),
];

export const sampleWeapons = weapons;
