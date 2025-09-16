import { normalizeWeapon } from './weaponSchema.js';

const weapons = [
  // Primary
  normalizeWeapon({
    id: 'bloomshot-assault-blaster',
    name: 'Bloomshot Assault Blaster',
    category: 'primary',
    rarity: 'rare',
    description:
      'Arc-charged petals spiral from the barrel, rattling foes with cheerful bursts while leaving allies untouched.',
    modelPath: null,
    preview: {
      scale: 1.08,
    },
    stats: {
      damage: 17,
      fireRate: 8.4,
      reloadSpeed: 2.2,
      magazineSize: 32,
      capacity: 192,
      range: '32m',
      weight: 6,
    },
    special: {
      cadence: 'Stable bloom spread keeps recoil cartoonishly light for quick tracking.',
      teamSafety: 'Petal shrapnel dissolves before it can ever troll a teammate.',
    },
  }),
  normalizeWeapon({
    id: 'moonpiercer-longshot',
    name: 'Moonpiercer Longshot',
    category: 'primary',
    rarity: 'epic',
    description:
      'A crystalline scope hums lullabies while lining up glittering beams that streak clear across the battlefield.',
    modelPath: null,
    preview: {
      scale: 1.12,
    },
    stats: {
      damage: 95,
      fireRate: 0.7,
      reloadSpeed: 2.8,
      magazineSize: 6,
      capacity: 24,
      range: '120m',
      weight: 12,
    },
    special: {
      focus: 'Tagging an enemy paints them with a halo your squad can see through cover.',
      teamSafety: 'The beam fizzles harmlessly the instant it would cross a friend.',
    },
  }),
  normalizeWeapon({
    id: 'cometburst-launcher',
    name: 'Cometburst Launcher',
    category: 'primary',
    rarity: 'legendary',
    description:
      'Miniature comets giggle in the chamber until launch, then blossom into enemy-only starfire.',
    modelPath: null,
    preview: {
      scale: 1.18,
    },
    stats: {
      damage: 160,
      blastRadius: '5.5m',
      reloadSpeed: 3.4,
      magazineSize: 1,
      capacity: 5,
      range: '48m',
      burnDuration: '1.5s',
      weight: 18,
    },
    special: {
      ignition: 'Blast leaves a brief arcane flame field that only singes opponents.',
      teamSafety: 'Allied wards harmonize with the comet so it refuses to detonate near friends.',
    },
  }),
  normalizeWeapon({
    id: 'sylphstring-bow',
    name: 'Sylphstring Bow',
    category: 'primary',
    rarity: 'uncommon',
    description:
      'Featherlight limbs sing when drawn, loosing gleaming arrows that swirl like playful sprites.',
    modelPath: null,
    preview: {
      scale: 1.04,
    },
    stats: {
      damage: 70,
      drawSpeed: 1.05,
      chargeTime: 0.55,
      quiverCapacity: 24,
      range: '48m',
      weight: 4,
    },
    special: {
      windwhisper: 'Fully drawn shots leave a gust trail that boosts allied gliders.',
      teamSafety: 'Sylph arrows disperse into glitter before brushing a teammate.',
    },
  }),
  normalizeWeapon({
    id: 'glimmershot-crossbow',
    name: 'Glimmershot Crossbow',
    category: 'primary',
    rarity: 'rare',
    description:
      'Gears click like chimes while bolts burst into guiding wisps for follow-up shots.',
    modelPath: null,
    preview: {
      scale: 1.06,
    },
    stats: {
      damage: 82,
      fireRate: 1.6,
      reloadSpeed: 2.1,
      magazineSize: 1,
      capacity: 20,
      range: '44m',
      weight: 5,
    },
    special: {
      tether: 'Bolts stick to terrain and weave temporary ziplines allies can ride.',
      teamSafety: 'Friendly bodies count as anchors, never targets.',
    },
  }),
  normalizeWeapon({
    id: 'astral-channel-staff',
    name: 'Astral Channel Staff',
    category: 'primary',
    rarity: 'epic',
    description:
      'A whimsical focus that vents pastel sparks while managing an overheat core with musical chirps.',
    modelPath: null,
    preview: {
      scale: 1.15,
    },
    stats: {
      damage: 42,
      fireRate: 3.2,
      heatCapacity: 120,
      heatDissipation: 26,
      range: '36m',
      weight: 7,
    },
    special: {
      overheat: 'When maxed, the staff blooms a healing breeze for allies as it cools.',
      teamSafety: 'Shockwaves only arc toward marked enemies, never allies.',
    },
  }),

  // Secondary
  normalizeWeapon({
    id: 'petalflare-pistol',
    name: 'Petalflare Pistol',
    category: 'secondary',
    rarity: 'uncommon',
    description:
      'Pocket-sized wandfire that chirps with each shot, perfect for colorful close skirmishes.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: 22,
      fireRate: 5.6,
      heatCapacity: 90,
      heatDissipation: 30,
      range: '24m',
      weight: 2,
    },
    special: {
      overheat: 'Vent burst creates a friendly speed puff while stunning enemies.',
      teamSafety: 'Petal vents wrap allies in harmless glitter instead of damage.',
    },
  }),
  normalizeWeapon({
    id: 'tidal-pop-blaster',
    name: 'Tidal Pop Blaster',
    category: 'secondary',
    rarity: 'rare',
    description:
      'Foamy cartridges lob squeaky orbs that splash arcane water across clustered foes.',
    modelPath: null,
    preview: {
      scale: 0.95,
    },
    stats: {
      damage: 28,
      splashRadius: '2.4m',
      fireRate: 2.4,
      magazineSize: 8,
      reloadSpeed: 1.6,
      capacity: 64,
      range: '16m',
      weight: 3,
    },
    special: {
      ripple: 'Splash cleanses allied debuffs while drenching only enemies.',
    },
  }),
  normalizeWeapon({
    id: 'sprig-snap-sling',
    name: 'Sprig-Snap Slingshot',
    category: 'secondary',
    rarity: 'common',
    description:
      'Elastic feywood snaps launch pebble sprites that giggle as they bonk targets.',
    modelPath: null,
    preview: {
      scale: 0.85,
    },
    stats: {
      damage: 38,
      drawSpeed: 0.8,
      capacity: 40,
      range: '22m',
      staggerForce: 'Medium',
      weight: 1,
    },
    special: {
      utility: 'Pebbles ricochet into enemies only, leaving teammates unruffled.',
    },
  }),
  normalizeWeapon({
    id: 'feyspark-wand',
    name: 'Feyspark Wand',
    category: 'secondary',
    rarity: 'epic',
    description:
      'A conduit for mischievous sprites that flit out in rapid beams and mark prey for allies.',
    modelPath: null,
    preview: {
      scale: 0.92,
    },
    stats: {
      damage: 18,
      fireRate: 9,
      heatCapacity: 75,
      heatDissipation: 28,
      effectDuration: '4s',
      range: '20m',
      weight: 1.5,
    },
    special: {
      pixieMark: 'Marked enemies take bonus team damage while allies gain a brief stamina trickle.',
    },
  }),
  normalizeWeapon({
    id: 'emberbloom-flamer',
    name: 'Emberbloom Flamethrower',
    category: 'secondary',
    rarity: 'rare',
    description:
      'A handheld arcane sprayer that paints enemies with friendly-colored flame ribbons.',
    modelPath: null,
    preview: {
      scale: 1,
    },
    stats: {
      tickDamage: 12,
      fireRate: 18,
      coneLength: '9m',
      coneWidth: '50°',
      burnDuration: '3s',
      capacity: 60,
      range: '10m',
      weight: 6,
    },
    special: {
      ignition: 'Ignites Bottle o’ Gas pools while ignoring friendly toes.',
    },
  }),

  // Melee
  normalizeWeapon({
    id: 'starbound-gauntlets',
    name: 'Starbound Gauntlets',
    category: 'melee',
    rarity: 'common',
    description:
      'Glowing knuckles amplify punches with giggling constellations eager to grapple foes.',
    modelPath: null,
    preview: {
      scale: 1,
    },
    stats: {
      damage: 12,
      attackSpeed: 'Very Fast',
      staminaCost: 4,
      range: '1.6m',
      cooldown: '14s',
      weight: 0,
    },
    special: {
      ability: 'Stargrip Grapple',
      abilityEffect: 'Launch a tether that reels an enemy in and roots them briefly; allies are never grabbed.',
      notes: 'Great for setting up team combos without draining ally stamina.',
    },
  }),
  normalizeWeapon({
    id: 'moonpetal-dagger',
    name: 'Moonpetal Dagger',
    category: 'melee',
    rarity: 'rare',
    description:
      'A petal-thin blade that hums before blooming into a decisive backstab.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: 34,
      attackSpeed: 'Fast',
      staminaCost: 5,
      range: '1.4m',
      cooldown: '12s',
      weight: 1,
    },
    special: {
      ability: 'Veilstep Backstab',
      abilityEffect: 'Striking from behind consumes the cooldown to deal a one-shot finisher on enemies.',
      notes: 'Fails gracefully on allies, simply phasing through them.',
    },
  }),
  normalizeWeapon({
    id: 'skysplitter-tomahawk',
    name: 'Skysplitter Tomahawk',
    category: 'melee',
    rarity: 'uncommon',
    description:
      'Carved from cometwood, it loves being thrown and zooms back like a faithful pet.',
    modelPath: null,
    preview: {
      scale: 1,
    },
    stats: {
      damage: 58,
      attackSpeed: 'Medium',
      staminaCost: 8,
      range: '2.2m',
      cooldown: '10s',
      weight: 3,
    },
    special: {
      ability: 'Aether Toss',
      abilityEffect: 'Throw to stick in enemies before warping back; allies only feel a pleasant breeze.',
    },
  }),
  normalizeWeapon({
    id: 'starlace-katana',
    name: 'Starlace Katana',
    category: 'melee',
    rarity: 'epic',
    description:
      'Threads of nebula lace the blade, humming happily when deflecting projectiles.',
    modelPath: null,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: 42,
      attackSpeed: 'Fast',
      staminaCost: 7,
      range: '2.4m',
      cooldown: '8s',
      weight: 2,
    },
    special: {
      ability: 'Prism Deflect',
      abilityEffect: 'Hold to reflect incoming fire toward enemies; allied shots pass right through.',
    },
  }),
  normalizeWeapon({
    id: 'aurora-bastion-shield',
    name: 'Aurora Bastion Shield',
    category: 'melee',
    rarity: 'rare',
    description:
      'A gleaming barrier board that thrums with protective melodies.',
    modelPath: null,
    preview: {
      scale: 1.1,
    },
    stats: {
      damage: 20,
      attackSpeed: 'Slow',
      staminaCost: 10,
      range: '1.5m',
      cooldown: '11s',
      weight: 9,
    },
    special: {
      ability: 'Comet Bash',
      abilityEffect: 'Shield bash knocks enemies back and grants nearby allies a brief ward.',
    },
  }),
  normalizeWeapon({
    id: 'thunderbloom-warhammer',
    name: 'Thunderbloom Warhammer',
    category: 'melee',
    rarity: 'legendary',
    description:
      'Each swing rings like a bell, gathering static before releasing a sparkling quake.',
    modelPath: null,
    preview: {
      scale: 1.18,
    },
    stats: {
      damage: 88,
      attackSpeed: 'Slow',
      staminaCost: 16,
      range: '2.8m',
      blastRadius: '3.5m',
      cooldown: '15s',
      weight: 12,
    },
    special: {
      ability: 'Meteor Bloom',
      abilityEffect: 'Slam to create a splash of damage and slow; allies in the circle gain bonus poise.',
    },
  }),
  normalizeWeapon({
    id: 'galeweave-bo-staff',
    name: 'Galeweave Bo Staff',
    category: 'melee',
    rarity: 'epic',
    description:
      'Ribboned segments spin playfully, channeling wind that whooshes bolts aside.',
    modelPath: null,
    preview: {
      scale: 1.08,
    },
    stats: {
      damage: 36,
      attackSpeed: 'Medium',
      staminaCost: 9,
      range: '3.2m',
      cooldown: '9s',
      weight: 4,
    },
    special: {
      ability: 'Cyclone Spin',
      abilityEffect: 'Spin to deflect arrows, push enemies, and hop yourself backward.',
    },
  }),

  // Utility
  normalizeWeapon({
    id: 'starseed-grenade',
    name: 'Starseed Grenade',
    category: 'utility',
    rarity: 'uncommon',
    description:
      'A plush seed pod that bursts into stardust, perfect for opening fights with a pop.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: 140,
      blastRadius: '4.5m',
      fuseTime: '1.3s',
      capacity: 3,
      weight: 2,
    },
    special: {
      teamSafety: 'Allies touched by the blast get a gentle hop instead of damage.',
    },
  }),
  normalizeWeapon({
    id: 'mistmellow-smoke',
    name: "Mistmellow Smoke",
    category: 'utility',
    rarity: 'common',
    description:
      'Spills a fluffy pastel fog that snuffs flames and smells like sugar clouds.',
    modelPath: null,
    preview: {
      scale: 0.88,
    },
    stats: {
      duration: '12s',
      effectRadius: '6m',
      fuseTime: '1s',
      capacity: 3,
      weight: 2,
    },
    special: {
      cleanse: 'Automatically extinguishes all flames, including ignited gas pools.',
    },
  }),
  normalizeWeapon({
    id: 'satchel-of-sustenance',
    name: 'Satchel of Sustenance',
    category: 'utility',
    rarity: 'rare',
    description:
      'A friendly sprite-hauler that drops snacks, ammo, and pep whenever tossed.',
    modelPath: null,
    preview: {
      scale: 1,
    },
    stats: {
      ammoRestored: 60,
      healAmount: 45,
      deployTime: '1s',
      capacity: 2,
      weight: 3,
    },
    special: {
      support: 'Supplies lock to allies so enemies cannot steal them.',
    },
  }),
  normalizeWeapon({
    id: 'starpollen-mines',
    name: 'Starpollen Mines',
    category: 'utility',
    rarity: 'epic',
    description:
      'Glittering motes nestle into the ground before unleashing a polite but potent blast.',
    modelPath: null,
    preview: {
      scale: 0.95,
    },
    stats: {
      damage: 200,
      blastRadius: '3.5m',
      armTime: '0.8s',
      capacity: 2,
      weight: 4,
    },
    special: {
      safety: 'Allies trigger a bounce pad instead of an explosion.',
    },
  }),
  normalizeWeapon({
    id: 'fae-wing-glider',
    name: 'Fae Wing Glider',
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Deploys sparkling wings that hum a lullaby while carrying you on the wind.',
    modelPath: null,
    preview: {
      scale: 1,
    },
    stats: {
      duration: '8s',
      cooldown: '14s',
      staminaCost: 0,
      weight: 1,
    },
    special: {
      mobility: 'Lets you reposition without touching stamina and shares uplift with nearby allies.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-gas',
    name: "Bottle o' Gas",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'A glass swirl that splashes a shimmering fuel puddle begging to be ignited.',
    modelPath: null,
    preview: {
      scale: 0.82,
    },
    stats: {
      duration: '10s',
      effectRadius: '5m',
      capacity: 4,
      weight: 1,
    },
    special: {
      ignition: 'Any team can light it, but only enemies burn; allies stride safely through the flames.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-fire',
    name: "Bottle o' Fire",
    category: 'utility',
    rarity: 'rare',
    description:
      'Cracks open into a prancing flame sprite that dances across enemy lines.',
    modelPath: null,
    preview: {
      scale: 0.82,
    },
    stats: {
      tickDamage: 35,
      burnDuration: '5s',
      effectRadius: '4m',
      capacity: 3,
      weight: 1,
    },
    special: {
      synergy: 'Ignites Bottle o’ Gas instantly while refusing to scorch friends.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-lightning',
    name: "Bottle o' Lightning",
    category: 'utility',
    rarity: 'epic',
    description:
      'Uncorks a playful storm cloud that zaps foes into statues.',
    modelPath: null,
    preview: {
      scale: 0.84,
    },
    stats: {
      tickDamage: 15,
      duration: '6s',
      effectRadius: '4m',
      capacity: 3,
      weight: 2,
    },
    special: {
      paralysis: 'Enemies are paralyzed while allies get a small haste buff when passing through.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-ice',
    name: "Bottle o' Ice",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Spreads candy-colored ice that makes foes slip-slide like cartoons.',
    modelPath: null,
    preview: {
      scale: 0.84,
    },
    stats: {
      duration: '8s',
      effectRadius: '6m',
      slowAmount: '35% less traction',
      capacity: 3,
      weight: 2,
    },
    special: {
      footing: 'Allies wear rune boots that negate the slip so they can style on enemies.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-air',
    name: "Bottle o' Air",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Pops into a gusty sprite that yeets enemies while nudging friends into perfect spots.',
    modelPath: null,
    preview: {
      scale: 0.82,
    },
    stats: {
      effectRadius: '5m',
      knockback: 'Strong',
      capacity: 4,
      weight: 1,
    },
    special: {
      mobility: 'Self-knockback is gentle, letting you bunny-hop without hurting teammates.',
    },
  }),
];

export const sampleWeapons = weapons;
