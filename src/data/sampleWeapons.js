import { normalizeWeapon } from './weaponSchema.js';

const weapons = [
  // Primary Arsenal
  normalizeWeapon({
    id: 'luminet-assault-blaster',
    name: 'Luminet Assault Blaster',
    category: 'primary',
    rarity: 'rare',
    description:
      'Arc-spun coils breathe soft starlight into a steady pulse stream. Friendly wards make the glow feel like a warm breeze to allies while it singes foes.',
    modelPath: null,
    preview: {
      scale: 1.08,
    },
    stats: {
      damage: 18,
      fireRate: 7.2,
      reloadSpeed: 2.2,
      magazineSize: 32,
      capacity: 160,
      range: '32m',
      projectileVelocity: '340 m/s',
      weight: '-8',
    },
  }),
  normalizeWeapon({
    id: 'astral-longsight',
    name: 'Astral Longsight',
    category: 'primary',
    rarity: 'epic',
    description:
      'Crystalline rails condense cosmic motes into precise comets. The focusing faeries call out target weak points, leaving teammates perfectly safe behind the lens.',
    modelPath: null,
    preview: {
      scale: 1.18,
    },
    stats: {
      damage: 92,
      fireRate: 0.9,
      reloadSpeed: 2.8,
      magazineSize: 4,
      capacity: 20,
      chargeTime: 1.1,
      range: '110m',
      projectileVelocity: '620 m/s',
      scopeZoom: '4x-8x',
      weight: '-12',
    },
  }),
  normalizeWeapon({
    id: 'comet-chorus-launcher',
    name: 'Comet Chorus Launcher',
    category: 'primary',
    rarity: 'legendary',
    description:
      'Singing rockets trail aurora ribbon tails that bend around allies. Impact sprites only blossom on hostile signatures, keeping splash jokes strictly for the enemy team.',
    modelPath: null,
    preview: {
      scale: 1.12,
    },
    stats: {
      impactDamage: 140,
      splashDamage: 90,
      fireRate: 0.6,
      reloadSpeed: 3.2,
      magazineSize: 1,
      capacity: 5,
      blastRadius: '5.5m',
      projectileVelocity: '48 m/s',
      weight: '-16',
    },
  }),
  normalizeWeapon({
    id: 'sylphwing-bow',
    name: 'Sylphwing Bow',
    category: 'primary',
    rarity: 'uncommon',
    description:
      'Featherlight limbs hum with sylph song, guiding arrows around friendly silhouettes. Fully drawn shots bloom into petals that only bruise foes.',
    modelPath: null,
    preview: {
      scale: 1.15,
    },
    stats: {
      damage: 62,
      drawSpeed: 0.85,
      chargeTime: 0.75,
      capacity: 24,
      range: '60m',
      projectileVelocity: '90 m/s',
      weight: '-5',
    },
  }),
  normalizeWeapon({
    id: 'runic-crossbow',
    name: 'Runic Whisper Crossbow',
    category: 'primary',
    rarity: 'rare',
    description:
      'Runes lace every bolt with guidance wisps that correct mid-flight. The same charms detune friendlies, ensuring misfires turn into harmless glitter.',
    modelPath: null,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: 76,
      fireRate: 1.3,
      reloadSpeed: 2.1,
      magazineSize: 1,
      capacity: 18,
      range: '48m',
      projectileVelocity: '120 m/s',
      weight: '-7',
    },
  }),
  normalizeWeapon({
    id: 'oracle-resonance-staff',
    name: 'Oracle Resonance Staff',
    category: 'primary',
    rarity: 'epic',
    description:
      'A staff of prismwood that vents notes of arcane thunder. Lattice vents dump heat harmlessly into the wielder’s aura while the bolts chase only hostile hearts.',
    modelPath: null,
    preview: {
      scale: 1.2,
    },
    stats: {
      damage: 26,
      fireRate: 5.5,
      heatPerShot: 12,
      overheatThreshold: 100,
      heatDissipation: 22,
      overheatCooldown: '2.5s',
      projectileType: 'Arcane Bolt',
      range: '34m',
      weight: '-9',
    },
  }),

  // Secondary Suite
  normalizeWeapon({
    id: 'bloomfire-sidearm',
    name: 'Bloomfire Sidearm',
    category: 'secondary',
    rarity: 'uncommon',
    description:
      'Petal cartridges flare into warm sparks that politely hop around allies. The overheat rune chirps before mischief and cools with a cheerful sigh.',
    modelPath: null,
    preview: {
      scale: 0.95,
    },
    stats: {
      damage: 24,
      fireRate: 4.2,
      heatPerShot: 9,
      overheatThreshold: 100,
      heatDissipation: 28,
      overheatCooldown: '1.6s',
      range: '22m',
      weight: '-3',
    },
  }),
  normalizeWeapon({
    id: 'ripple-popper',
    name: 'Ripple Popper',
    category: 'secondary',
    rarity: 'rare',
    description:
      'Each bubbly burst splashes prismatic water that tingles enemies but feels like a refreshing mist to teammates. Perfect for area denial without pranks.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      directDamage: 20,
      splashDamage: 16,
      fireRate: 2.8,
      reloadSpeed: 2.0,
      magazineSize: 8,
      blastRadius: '2.5m',
      range: '16m',
      weight: '-4',
    },
  }),
  normalizeWeapon({
    id: 'spritebow-slingshot',
    name: 'Spritebow Slingshot',
    category: 'secondary',
    rarity: 'uncommon',
    description:
      'Companion sprites nest in the pouch, guiding pebbles with playful laughter. They refuse to bruise friends, ricocheting safely into pixie glitter instead.',
    modelPath: null,
    preview: {
      scale: 0.85,
    },
    stats: {
      damage: 34,
      drawSpeed: 0.55,
      chargeTime: 0.45,
      capacity: 24,
      range: '20m',
      projectileVelocity: '70 m/s',
      weight: '-2',
    },
  }),
  normalizeWeapon({
    id: 'lumenheart-wand',
    name: 'Lumenheart Wand',
    category: 'secondary',
    rarity: 'epic',
    description:
      'Fey sigils lace the barrel, firing heart-shaped motes that charm enemies into brief hesitation. Allies feel only a friendly heartbeat when brushed by its glow.',
    modelPath: null,
    preview: {
      scale: 0.92,
    },
    stats: {
      damage: 28,
      fireRate: 3.1,
      heatPerShot: 14,
      overheatThreshold: 90,
      heatDissipation: 24,
      overheatCooldown: '1.8s',
      range: '26m',
      weight: '-3',
    },
  }),
  normalizeWeapon({
    id: 'pocket-flamecaster',
    name: 'Pocket Flamecaster',
    category: 'secondary',
    rarity: 'rare',
    description:
      'A handheld flamethrower powered by bottled phoenix breath. Flames curl lovingly around allies, refusing to singe them while chasing foes with cozy heat.',
    modelPath: null,
    preview: {
      scale: 1.05,
    },
    stats: {
      damagePerSecond: 14,
      fireRate: 10,
      fuelCapacity: 40,
      igniteDuration: '4s',
      range: '8m',
      reloadSpeed: 3.4,
      weight: '-6',
    },
  }),

  // Melee Arts
  normalizeWeapon({
    id: 'aetherbound-gauntlets',
    name: 'Aetherbound Gauntlets',
    category: 'melee',
    rarity: 'common',
    description:
      'Barehanded brawling gloves woven from cloud leather. Cushioning sigils prevent ally bruises, but enemies feel a star bear hug.',
    modelPath: null,
    preview: {
      scale: 0.95,
    },
    stats: {
      damage: 14,
      attackSpeed: 'Fast',
      staminaCost: 6,
      reach: '1.5m',
      weight: '0',
    },
    special: {
      ability: 'Grapple',
      cooldown: '12s',
      effect: 'Launch a shimmering tether to pull yourself to the target and stagger them briefly.',
    },
  }),
  normalizeWeapon({
    id: 'whisperstep-knife',
    name: 'Whisperstep Knife',
    category: 'melee',
    rarity: 'uncommon',
    description:
      'This moonlit dagger giggles when you vanish behind foes. Protective wards make ally backstrikes harmless, turning goofs into harmless sparkles.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: 38,
      attackSpeed: 'Very Fast',
      staminaCost: 8,
      reach: '1.8m',
      weight: '-1',
    },
    special: {
      ability: 'Backstab',
      cooldown: 'Passive',
      effect: 'Strikes from behind deal 150 damage and ignore shields, instantly felling most targets.',
    },
  }),
  normalizeWeapon({
    id: 'emberloop-tomahawk',
    name: 'Emberloop Tomahawk',
    category: 'melee',
    rarity: 'rare',
    description:
      'Runed feathers keep this hatchet aloft when thrown, steering away from friends. Return glyphs let you ride the arc like a carnival ride.',
    modelPath: null,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: 46,
      attackSpeed: 'Medium',
      staminaCost: 12,
      reach: '2.6m',
      weight: '-3',
    },
    special: {
      ability: 'Return Throw',
      cooldown: '10s',
      effect: 'Throw up to 18m; reactivate to zip to the tomahawk or recall it instantly, dealing 60 damage on the catch.',
    },
  }),
  normalizeWeapon({
    id: 'moonpetal-katana',
    name: 'Moonpetal Katana',
    category: 'melee',
    rarity: 'epic',
    description:
      'A blade forged from night-bloom petals. It sings a lullaby that turns stray ally hits into harmless petals while sending enemy shots back.',
    modelPath: null,
    preview: {
      scale: 1.1,
    },
    stats: {
      damage: 40,
      attackSpeed: 'Fast',
      staminaCost: 10,
      reach: '2.3m',
      weight: '-2',
    },
    special: {
      ability: 'Deflect',
      cooldown: '14s',
      effect: 'Hold to deflect projectiles for 1.2s, reflecting bolts as moonlit sparks toward foes.',
    },
  }),
  normalizeWeapon({
    id: 'aureline-bulwark',
    name: 'Aureline Bulwark',
    category: 'melee',
    rarity: 'rare',
    description:
      'This gilded shield projects a cozy barrier that friends can lean on. Its bash rune politely apologizes to allies while bowling over enemies.',
    modelPath: null,
    preview: {
      scale: 1.18,
    },
    stats: {
      damage: 22,
      attackSpeed: 'Medium',
      staminaCost: 8,
      reach: '1.7m',
      guardStrength: '85%',
      weight: '-6',
    },
    special: {
      ability: 'Shield Bash',
      cooldown: '16s',
      effect: 'Deliver a radiant bash that deals 35 damage and knocks enemies back 4m.',
    },
  }),
  normalizeWeapon({
    id: 'thunderbloom-warhammer',
    name: 'Thunderbloom Warhammer',
    category: 'melee',
    rarity: 'legendary',
    description:
      'Each swing leaves trailing blossoms of thunder. Safety sprites mute the boom around allies, directing the quake toward foes only.',
    modelPath: null,
    preview: {
      scale: 1.2,
    },
    stats: {
      damage: 64,
      attackSpeed: 'Slow',
      staminaCost: 18,
      reach: '2.9m',
      weight: '-8',
    },
    special: {
      ability: 'Quake Slam',
      cooldown: '18s',
      effect: 'Slam to create a 4m shockwave for 80 damage and slow enemies by 20% for 4s.',
    },
  }),
  normalizeWeapon({
    id: 'zephyrglow-bo-staff',
    name: 'Zephyrglow Bo Staff',
    category: 'melee',
    rarity: 'uncommon',
    description:
      'Spun from wind willow, this staff twirls with playful gusts. Breezes slip safely around teammates yet swat away hostile bolts.',
    modelPath: null,
    preview: {
      scale: 1.14,
    },
    stats: {
      damage: 34,
      attackSpeed: 'Fast',
      staminaCost: 12,
      reach: '3.2m',
      weight: '-3',
    },
    special: {
      ability: 'Windmill Spin',
      cooldown: '15s',
      effect: 'Spin to deflect arrows and push everyone nearby 3m—wielder included for dramatic exits.',
    },
  }),

  // Utility Kit
  normalizeWeapon({
    id: 'starling-grenade',
    name: 'Starling Grenade',
    category: 'utility',
    rarity: 'uncommon',
    description:
      'A friendly cluster of starlings guides this explosive straight to foes. The birds shield allies from the sparkle blast, so no troll tosses here.',
    modelPath: null,
    preview: {
      scale: 0.95,
    },
    stats: {
      damage: 120,
      blastRadius: '4m',
      fuseTime: '1.4s',
      carryLimit: 2,
      cooldown: '28s',
      weight: '-2',
    },
  }),
  normalizeWeapon({
    id: 'mistsong-smoke',
    name: 'Mistsong Smoke',
    category: 'utility',
    rarity: 'common',
    description:
      'Pop the cork to summon fog sprites that extinguish flames and hug allies with clarity charms. Enemies stumble while teammates see guiding runes.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      duration: '9s',
      effectRadius: '6m',
      carryLimit: 2,
      cooldown: '24s',
      weight: '-1',
    },
  }),
  normalizeWeapon({
    id: 'sprite-resource-pack',
    name: 'Sprite Resource Pack',
    category: 'utility',
    rarity: 'rare',
    description:
      'A cheery satchel that sprouts supply sprites. They hand allies ammo and tea biscuits, topping off health while refusing to arm enemies.',
    modelPath: null,
    preview: {
      scale: 1.1,
    },
    stats: {
      healAmount: 60,
      ammoRestored: '75%',
      deployTime: '1.2s',
      carryLimit: 1,
      cooldown: '35s',
      weight: '-5',
    },
  }),
  normalizeWeapon({
    id: 'starfall-mines',
    name: 'Starfall Mines',
    category: 'utility',
    rarity: 'epic',
    description:
      'Crystalline runes float just off the ground, winking at allies as they hover in harmless mode. Hostiles trigger the full 200-damage meteor surprise.',
    modelPath: null,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: 200,
      triggerRadius: '1.5m',
      armingTime: '0.8s',
      carryLimit: 3,
      cooldown: '40s',
      weight: '-4',
    },
  }),
  normalizeWeapon({
    id: 'petal-glider',
    name: 'Petal Glider',
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Unfolds into a pastel canopy that laughs at gravity. Glide sprites hold you aloft without draining stamina and tug friends clear of danger.',
    modelPath: null,
    preview: {
      scale: 1.12,
    },
    stats: {
      duration: '5s',
      glideSpeed: '12m/s',
      staminaCost: 0,
      carryLimit: 1,
      cooldown: '22s',
      weight: '-3',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-gas',
    name: "Bottle o' Gas",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'A tossable vial that paints the ground in shimmergas. Any fire source can ignite it for enemy-only burning—light it yourself and your team dances safely through.',
    modelPath: null,
    preview: {
      scale: 0.9,
    },
    stats: {
      duration: '8s',
      poolRadius: '4.5m',
      carryLimit: 3,
      cooldown: '26s',
      weight: '-2',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-fire',
    name: "Bottle o' Fire",
    category: 'utility',
    rarity: 'rare',
    description:
      'Ignites a friendly bonfire that refuses to roast allies. Pour it over shimmergas for instant enemy barbecues while your squad roasts marshmallows.',
    modelPath: null,
    preview: {
      scale: 0.92,
    },
    stats: {
      damagePerSecond: 45,
      duration: '6s',
      effectRadius: '3.5m',
      carryLimit: 2,
      cooldown: '30s',
      weight: '-2',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-lightning',
    name: "Bottle o' Lightning",
    category: 'utility',
    rarity: 'epic',
    description:
      'Crack the seal to unleash a miniature storm field. Paralyze sigils filter out allied footsteps, leaving enemies jittering in place.',
    modelPath: null,
    preview: {
      scale: 0.92,
    },
    stats: {
      damagePerSecond: 20,
      duration: '5s',
      effectRadius: '4m',
      paralyzeDuration: '1.8s',
      carryLimit: 2,
      cooldown: '34s',
      weight: '-3',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-ice',
    name: "Bottle o' Ice",
    category: 'utility',
    rarity: 'rare',
    description:
      'Spreads frosty runes that make everyone slide like they are on a skating rink. Ally boots get stabilizing claws while enemies slip and squeal.',
    modelPath: null,
    preview: {
      scale: 0.92,
    },
    stats: {
      duration: '7s',
      effectRadius: '4m',
      frictionModifier: '-65%',
      carryLimit: 2,
      cooldown: '28s',
      weight: '-2',
    },
  }),
  normalizeWeapon({
    id: 'bottle-of-air',
    name: "Bottle o' Air",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Lets loose a friendly gust that boops everyone back without bruises. Use it to launch yourself or clear space—safety sprites slow allies before landing.',
    modelPath: null,
    preview: {
      scale: 0.92,
    },
    stats: {
      pushForce: '12m',
      effectRadius: '3m',
      carryLimit: 3,
      cooldown: '20s',
      weight: '-2',
    },
  }),
];

export const sampleWeapons = weapons;
