import { normalizeWeapon } from './weaponSchema.js';

const basePath = 'assets/models';

const weapons = [
  normalizeWeapon({
    id: 'assault-rifle',
    name: 'Assault Rifle',
    category: 'primary',
    rarity: 'rare',
    description:
      'Arc-bloom assault blaster that channels prismatic bolts without ever singeing allies.',
    modelPath: null,
    preview: {
      scale: 1.08,
    },
    stats: {
      damage: 5,
      fireRate: '100 rpm (full-auto)',
      reloadSpeed: '1.0 s',
      magazineSize: '30 rounds',
      capacity: '180 reserve',
      recoil: '100 (control index)',
      range: '55 m',
      projectileVelocity: '680 m/s',
      weight: '8 pts',
    },
    special: {
      perk: 'Prism rounds mark targets so allies deal +10% damage for 3s.',
    },
  }),
  normalizeWeapon({
    id: 'sniper-rifle',
    name: 'Sniper Rifle',
    category: 'primary',
    rarity: 'epic',
    description:
      'A crystalline long-range blaster that threads starlight lances across the battlefield.',
    modelPath: null,
    preview: {
      scale: 1.18,
    },
    stats: {
      damage: 50,
      fireRate: '25 rpm (semi-auto)',
      reloadSpeed: '3.0 s',
      magazineSize: '6 rounds',
      capacity: '18 reserve',
      recoil: '150 (heavy kick)',
      range: '220 m',
      projectileVelocity: '1300 m/s',
      weight: '12 pts',
    },
    special: {
      perk: 'Fully-charged shots reveal struck enemies to the squad for 4s.',
    },
  }),
  normalizeWeapon({
    id: 'rocket-launcher',
    name: 'Rocket Launcher',
    category: 'primary',
    rarity: 'legendary',
    description:
      'Launches humming comets that burst into friendly-safe shockwaves of glittering force.',
    modelPath: null,
    preview: {
      scale: 1.12,
    },
    stats: {
      damage: 100,
      splashDamage: 70,
      fireRate: 'N/A (single-shot)',
      reloadSpeed: '2.0 s',
      magazineSize: '1 rocket',
      capacity: '3 reserve',
      recoil: '100 (shockwave)',
      range: '60 m',
      aoeRadius: '6 m',
      weight: '18 pts',
    },
    special: {
      perk: 'Blast shields grant the wielder 1s stagger immunity on detonation.',
    },
  }),
  normalizeWeapon({
    id: 'bow',
    name: 'Bow',
    category: 'primary',
    rarity: 'uncommon',
    description:
      'Fey-grown limbs launch luminous arrows that leave a sparkling trail for teammates to follow.',
    modelPath: `${basePath}/primary/bow.glb`,
    preview: {
      scale: 1.04,
    },
    stats: {
      damage: 15,
      fireRate: '50 rpm (quick draw)',
      reloadSpeed: '0.2 s (nock)',
      quiverCapacity: '30 arrows',
      recoil: '1 (steady grip)',
      range: '70 m',
      projectileVelocity: '95 m/s',
      weight: '5 pts',
    },
    special: {
      perk: 'Holding the draw for 1.5s adds +15 damage and a guidance shimmer for allies.',
    },
  }),
  normalizeWeapon({
    id: 'crossbow',
    name: 'Crossbow',
    category: 'primary',
    rarity: 'rare',
    description:
      'Clockwork limbs weave bolts of condensed mana that pin foes without ricocheting into friends.',
    modelPath: `${basePath}/primary/crossbow.glb`,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: 24,
      fireRate: '30 rpm (lever action)',
      reloadSpeed: '2.0 s',
      magazineSize: '1 bolt',
      capacity: '12 reserve',
      recoil: '40 (stable)',
      range: '80 m',
      projectileVelocity: '110 m/s',
      weight: '7 pts',
    },
    special: {
      perk: 'Bolts pin targets for 1s while staying harmless to nearby teammates.',
    },
  }),
  normalizeWeapon({
    id: 'wizard-staff',
    name: 'Wizard Staff',
    category: 'primary',
    rarity: 'epic',
    description:
      'A living focus that overchannels starfire into sweeping volleys before venting into safety bubbles.',
    modelPath: `${basePath}/primary/wizard-staff.glb`,
    preview: {
      scale: 1.22,
    },
    stats: {
      damage: 20,
      fireRate: '50 rpm (channeled bursts)',
      heatCapacity: '100 heat',
      heatDissipation: '32 /s',
      recoil: '5 (gentle)',
      range: '40 m',
      projectileType: 'Arcane volleys',
      weight: '10 pts',
    },
    special: {
      perk: 'Venting overheats cleanse nearby allies of debuffs while leaving foes exposed.',
    },
  }),
  normalizeWeapon({
    id: 'blaster-pistol',
    name: 'Blaster Pistol',
    category: 'secondary',
    rarity: 'uncommon',
    description:
      'Pocket starcaster with an overheat dial that keeps squadmates perfectly safe.',
    modelPath: `${basePath}/secondary/blaster-pistol.glb`,
    preview: {
      scale: 0.92,
    },
    stats: {
      damage: 10,
      fireRate: '150 rpm (semi-auto)',
      heatCapacity: '90 heat',
      heatDissipation: '26 /s',
      recoil: '120 (snappy)',
      range: '24 m',
      projectileType: 'Star bolts',
      weight: '3 pts',
    },
    special: {
      perk: 'Maintains accuracy while sprinting; overheats never scorch teammates.',
    },
  }),
  normalizeWeapon({
    id: 'splash-blaster',
    name: 'Splash Blaster',
    category: 'secondary',
    rarity: 'rare',
    description:
      'Launches glittering globes that burst in soft radiance, showering enemies without hurting allies.',
    modelPath: null,
    preview: {
      scale: 0.98,
    },
    stats: {
      damage: 12,
      splashDamage: 8,
      fireRate: '80 rpm (burst)',
      reloadSpeed: '1.8 s',
      magazineSize: '6 shells',
      capacity: '24 reserve',
      recoil: '80 (chunky)',
      aoeRadius: '3 m',
      range: '16 m',
      weight: '4 pts',
    },
    special: {
      perk: 'Direct hits grant nearby allies a 10 health sparkle shield.',
    },
  }),
  normalizeWeapon({
    id: 'slingshot',
    name: 'Slingshot',
    category: 'secondary',
    rarity: 'common',
    description:
      'A playful rune-slinger that pelts foes with pebble meteors while dazzling spectators.',
    modelPath: `${basePath}/secondary/slingshot.glb`,
    preview: {
      scale: 0.85,
    },
    stats: {
      damage: 5,
      fireRate: '25 rpm (quick pull)',
      reloadSpeed: '0.2 s (pouch)',
      magazineSize: '20 stones',
      capacity: '60 spare stones',
      recoil: '5 (light)',
      range: '18 m',
      projectileVelocity: '60 m/s',
      weight: '2 pts',
    },
    special: {
      perk: 'Headshots daze foes for 0.6s without causing friendly grief.',
    },
  }),
  normalizeWeapon({
    id: 'fey-wand',
    name: 'Fey Wand',
    category: 'secondary',
    rarity: 'epic',
    description:
      'Channel faelight motes that slow enemies into a glittery trance.',
    modelPath: null,
    preview: {
      scale: 1.02,
    },
    stats: {
      damage: 12,
      fireRate: '90 rpm (arcane pulses)',
      heatCapacity: '80 heat',
      heatDissipation: '28 /s',
      recoil: '10 (glide)',
      range: '24 m',
      statusEffect: '20% slow',
      effectDuration: '2.5 s',
      weight: '2 pts',
    },
    special: {
      perk: 'Every third bolt grants nearby allies +15 stamina bloom.',
    },
  }),
  normalizeWeapon({
    id: 'flamethrower',
    name: 'Flamethrower',
    category: 'secondary',
    rarity: 'rare',
    description:
      'Handheld dragonet that sprays short cones of team-safe flame.',
    modelPath: null,
    preview: {
      scale: 1.08,
    },
    stats: {
      damage: 8,
      dotDamage: '12 /s (burn)',
      fireRate: '120 rpm (cone stream)',
      magazineSize: '50 fuel units',
      reloadSpeed: '2.6 s',
      recoil: '70 (steady)',
      range: '10 m',
      igniteDuration: '4 s',
      weight: '9 pts',
    },
    special: {
      perk: "Ignites Bottle o' Gas while leaving the caster's team unharmed.",
    },
  }),
  normalizeWeapon({
    id: 'fists',
    name: 'Fists',
    category: 'melee',
    rarity: 'common',
    description:
      'Gauntleted knuckles woven with grappling ribbons for playful takedowns.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: 8,
      attackSpeed: 'Very Fast',
      staminaCost: 4,
      range: '1.5 m',
      abilityCooldown: '10 s',
      weight: '0 pts',
    },
    special: {
      ability: 'Grapple: Leap and bind a foe for 1.5s, dealing 12 bonus damage.',
      perk: 'Grappled targets cannot swing and grant you 20% damage resist.',
    },
  }),
  normalizeWeapon({
    id: 'knife',
    name: 'Knife',
    category: 'melee',
    rarity: 'rare',
    description:
      'Slim arcblade for elegant close-quarters flourishes.',
    modelPath: `${basePath}/melee/knife.glb`,
    preview: {
      scale: 1,
    },
    stats: {
      damage: 18,
      attackSpeed: 'Very Fast',
      staminaCost: 4,
      range: '1.8 m',
      abilityCooldown: '12 s',
      weight: '1 pt',
    },
    special: {
      ability: 'Backstab: Striking from behind deals 90 damage and silences for 1s.',
      perk: 'Backstab refunds the stamina cost instead of draining it.',
    },
  }),
  normalizeWeapon({
    id: 'tomahawk',
    name: 'Tomahawk',
    category: 'melee',
    rarity: 'uncommon',
    description:
      'Feathered hatchet balanced for looping throws that always find home.',
    modelPath: null,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: 24,
      attackSpeed: 'Medium',
      staminaCost: 10,
      range: '2.6 m',
      abilityCooldown: '18 s',
      weight: '4 pts',
    },
    special: {
      ability: 'Returning Throw: Toss up to 18 m for 60 damage and recall automatically.',
      perk: 'Thrown strikes mark targets so allies deal +15% damage for 4s.',
    },
  }),
  normalizeWeapon({
    id: 'katana',
    name: 'Katana',
    category: 'melee',
    rarity: 'epic',
    description:
      'Wind-cutting blade that sings with every graceful parry.',
    modelPath: `${basePath}/melee/katana.glb`,
    preview: {
      scale: 1.08,
    },
    stats: {
      damage: 22,
      attackSpeed: 'Fast',
      staminaCost: 7,
      range: '2.8 m',
      abilityCooldown: '6 s',
      weight: '3 pts',
    },
    special: {
      ability: 'Wind Deflect: Reflect projectiles for 1s then counter-cut for bonus damage.',
      perk: 'Successful deflect restores 20 stamina to nearby allies.',
    },
  }),
  normalizeWeapon({
    id: 'shield',
    name: 'Shield',
    category: 'melee',
    rarity: 'rare',
    description:
      'Radiant bulwark for bash-happy guardians.',
    modelPath: `${basePath}/melee/shield.glb`,
    preview: {
      scale: 1.12,
    },
    stats: {
      damage: 15,
      attackSpeed: 'Slow',
      staminaCost: 12,
      range: '1.6 m',
      abilityCooldown: '8 s',
      weight: '8 pts',
    },
    special: {
      ability: 'Shield Bash: Lunge forward, knocking enemies back 3 m and stunning 0.7s.',
      perk: 'Holding guard grants allies behind you 5% damage reduction.',
    },
  }),
  normalizeWeapon({
    id: 'warhammer',
    name: 'Warhammer',
    category: 'melee',
    rarity: 'legendary',
    description:
      'Meteor-headed maul that paints impact circles of friendly boons.',
    modelPath: null,
    preview: {
      scale: 1.18,
    },
    stats: {
      damage: 32,
      attackSpeed: 'Slow',
      staminaCost: 16,
      range: '2.4 m',
      abilityCooldown: '14 s',
      aoeRadius: '4 m',
      weight: '10 pts',
    },
    special: {
      ability: 'Starfall Slam: Crash down for 60 AoE damage and launch foes skyward.',
      perk: 'Impact zone grants allies +20 stamina over 3s.',
    },
  }),
  normalizeWeapon({
    id: 'bo-staff',
    name: 'Bo Staff',
    category: 'melee',
    rarity: 'epic',
    description:
      'Celestial staff that twirls into a protective whirlwind.',
    modelPath: null,
    preview: {
      scale: 1.1,
    },
    stats: {
      damage: 20,
      attackSpeed: 'Fast',
      staminaCost: 8,
      range: '3.2 m',
      abilityCooldown: '12 s',
      weight: '4 pts',
    },
    special: {
      ability: 'Cyclone Spin: Deflect bolts, push foes 3 m, and propel yourself 4 m back.',
      perk: 'Spin clears projectiles embedded in allies.',
    },
  }),
  normalizeWeapon({
    id: 'grenade',
    name: 'Grenade',
    category: 'utility',
    rarity: 'rare',
    description:
      'Sparkburst charge that pops with a friendly nudge instead of friendly fire.',
    modelPath: `${basePath}/utility/grenade.glb`,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: 80,
      fuseTime: '2.0 s',
      aoeRadius: '4 m',
      carryLimit: 2,
      weight: '1 pt',
    },
    special: {
      perk: 'Outer blast nudges allies instead of harming them.',
    },
  }),
  normalizeWeapon({
    id: 'smoke-grenade',
    name: 'Smoke Grenade',
    category: 'utility',
    rarity: 'common',
    description:
      'Billows of lilac smoke that hide movement and calm wildfires.',
    modelPath: null,
    preview: {
      scale: 0.88,
    },
    stats: {
      duration: '12 s',
      aoeRadius: '6 m',
      deployTime: '0.6 s',
      carryLimit: 2,
      weight: '1 pt',
    },
    special: {
      perk: "Smoke extinguishes flames and shields Bottle o' Gas from ignition for 5s.",
    },
  }),
  normalizeWeapon({
    id: 'resource-pack',
    name: 'Resource Pack',
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Friendly courier bundle that rains snacks, ammo, and stamina confetti.',
    modelPath: `${basePath}/utility/resource-pack.glb`,
    preview: {
      scale: 1,
    },
    stats: {
      healAmount: '45 HP',
      ammoRestock: '50%',
      deployTime: '1.0 s',
      carryLimit: 1,
      weight: '4 pts',
    },
    special: {
      perk: 'Opening grants 25 stamina to teammates.',
    },
  }),
  normalizeWeapon({
    id: 'mines',
    name: 'Mines',
    category: 'utility',
    rarity: 'epic',
    description:
      'Crystal petals that only blossom under enemy footsteps.',
    modelPath: null,
    preview: {
      scale: 0.95,
    },
    stats: {
      damage: 90,
      aoeRadius: '3 m',
      armTime: '1.5 s',
      carryLimit: 3,
      weight: '4 pts',
    },
    special: {
      perk: 'Mines ignore friendly footsteps and glow for allies.',
    },
  }),
  normalizeWeapon({
    id: 'glider',
    name: 'Glider',
    category: 'utility',
    rarity: 'rare',
    description:
      'Whimsical wingpack that lets the squad float without stamina strain.',
    modelPath: null,
    preview: {
      scale: 1.1,
    },
    stats: {
      glideSpeed: '16 m/s',
      staminaDrain: '0 /s',
      deployTime: '0.4 s',
      carryLimit: 1,
      weight: '2 pts',
    },
    special: {
      perk: 'Activating negates fall damage for nearby allies for 2s.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-gas',
    name: "Bottle o' Gas",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Breaks into a shimmering vapor pool begging for a friendly spark.',
    modelPath: null,
    preview: {
      scale: 0.88,
    },
    stats: {
      poolDuration: '10 s',
      poolRadius: '4.5 m',
      carryLimit: 3,
      weight: '2 pts',
    },
    special: {
      perk: "Ignite with allied flames to create enemy-only fire for 25 damage per second.",
    },
  }),
  normalizeWeapon({
    id: 'bottle-fire',
    name: "Bottle o' Fire",
    category: 'utility',
    rarity: 'rare',
    description:
      'Splashes into a dancing ring of flame that loves foes and ignores friends.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: '15 /s',
      duration: '6 s',
      aoeRadius: '4 m',
      carryLimit: 2,
      weight: '2 pts',
    },
    special: {
      perk: "Fire respects the thrower's team, letting allies dance through safely.",
    },
  }),
  normalizeWeapon({
    id: 'bottle-lightning',
    name: "Bottle o' Lightning",
    category: 'utility',
    rarity: 'epic',
    description:
      'Crackling storm bottled for paralyzing surprise parties.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: 25,
      stunDuration: '2.0 s',
      duration: '3 s',
      aoeRadius: '3.5 m',
      carryLimit: 2,
      weight: '2 pts',
    },
    special: {
      perk: 'Paralyzed enemies take +15% ranged damage from your squad.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-ice',
    name: "Bottle o' Ice",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Frosty slick that sends foes skating while allies glide with style.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      duration: '8 s',
      aoeRadius: '4 m',
      frictionModifier: '0.4x',
      carryLimit: 3,
      weight: '2 pts',
    },
    special: {
      perk: 'Allies sliding gain +20% speed; enemies skid without control.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-air',
    name: "Bottle o' Air",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'A giggling gust in a jar, perfect for repositioning friends and foes alike.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      aoeRadius: '4.5 m',
      pushForce: '5 m',
      deployTime: '0.5 s',
      carryLimit: 3,
      weight: '2 pts',
    },
    special: {
      perk: 'Self-knockback refunds 20 stamina and never harms friends.',
    },
  }),
];

export const sampleWeapons = weapons;
