import { normalizeWeapon } from './weaponSchema.js';

const RAW_GLOBALS = {
  base_health: 100,
  base_speed: 100,
  base_stamina: 100,
  headshot_multiplier: 3.0,
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
  {
    name: 'Assault Rifle',
    category: 'Primary',
    damage_body: 4,
    headshot_allowed: true,
    rps: 10,
    magazine: 30,
    reload_s: 1.8,
    range_cm: null,
    projectile: 'hitscan',
    notes: 'Mid-range auto, moderate recoil',
    ttk_body_s: 2.4,
    shots_to_kill_body: 25,
  },
  {
    name: 'Sniper Rifle',
    category: 'Primary',
    damage_body: 32,
    headshot_allowed: true,
    rps: 0.9,
    magazine: 5,
    reload_s: 2.8,
    range_cm: null,
    projectile: 'hitscan',
    notes: '1 head + 1 body = kill (96+32)',
    ttk_body_s: 3.33,
    shots_to_kill_body: 4,
  },
  {
    name: 'Rocket Launcher',
    category: 'Primary',
    damage_body: 80,
    headshot_allowed: false,
    rps: 0.6,
    magazine: 1,
    reload_s: 2.2,
    range_cm: null,
    projectile: 'projectile',
    splash: {
      center_damage: 60,
      edge_damage: 20,
      radius_cm: null,
      falloff: 'linear',
    },
    self_damage: 50,
    notes: 'AOE; slow ADS',
  },
  {
    name: 'Bow',
    category: 'Primary',
    damage_body: 18,
    headshot_allowed: true,
    rps: 1.3,
    magazine: 30,
    reload_s: 0.0,
    draw_time_s: 0.77,
    range_cm: null,
    projectile: 'projectile',
    notes: 'Arcing projectile; 2 headshots to kill',
    ttk_body_s: 3.85,
    shots_to_kill_body: 6,
  },
  {
    name: 'Crossbow',
    category: 'Primary',
    damage_body: 28,
    headshot_allowed: true,
    rps: 0.7,
    magazine: 1,
    reload_s: 1.4,
    range_cm: null,
    projectile: 'projectile',
    notes: 'Pinpoint; 1 head + 1 body = kill',
    ttk_body_s: 4.29,
    shots_to_kill_body: 4,
  },
  {
    name: 'Wizard Staff',
    category: 'Primary',
    damage_body: 8,
    headshot_allowed: false,
    rps: 6,
    magazine: null,
    reload_s: 0.0,
    range_cm: null,
    projectile: 'aoe_pulse',
    aoe: {
      radius_cm: 250,
      edge_damage: 4,
      falloff: 'linear',
    },
    overheat: {
      shots_before_overheat: 36,
      cooldown_s: 2.0,
    },
    notes: 'AOE pulses; strong at center',
    ttk_body_s: 2.0,
    shots_to_kill_body: 13,
  },
  {
    name: 'Blaster Pistol',
    category: 'Secondary',
    damage_body: 4,
    headshot_allowed: true,
    rps: 8,
    magazine: 15,
    reload_s: 1.2,
    range_cm: null,
    projectile: 'hitscan',
    notes: 'Reliable sidearm',
    ttk_body_s: 3.0,
    shots_to_kill_body: 25,
  },
  {
    name: 'Slingshot',
    category: 'Secondary',
    damage_body: 6,
    headshot_allowed: true,
    rps: 3,
    magazine: 12,
    reload_s: 0.8,
    range_cm: null,
    projectile: 'projectile',
    notes: 'Arc; cheap ammo; starter',
    ttk_body_s: 5.33,
    shots_to_kill_body: 17,
  },
  {
    name: 'Splash Blaster',
    category: 'Secondary',
    damage_body: 10,
    headshot_allowed: false,
    rps: 3,
    magazine: 8,
    reload_s: 1.0,
    range_cm: null,
    projectile: 'projectile',
    aoe: {
      radius_cm: 200,
      edge_damage: 5,
      falloff: 'linear',
    },
    notes: '2 m (200 cm) splash',
    ttk_body_s: 3.0,
    shots_to_kill_body: 10,
  },
  {
    name: 'Fey Wand',
    category: 'Secondary',
    damage_body: 5,
    headshot_allowed: false,
    rps: 9,
    magazine: null,
    reload_s: 0.0,
    range_cm: null,
    projectile: 'aoe_beam',
    aoe: {
      radius_cm: 120,
      edge_damage: 5,
      falloff: 'none',
    },
    overheat: {
      shots_before_overheat: 45,
      cooldown_s: 1.5,
    },
    notes: 'Micro-splash beam',
    ttk_body_s: 2.11,
    shots_to_kill_body: 20,
  },
  {
    name: 'Flamethrower',
    category: 'Secondary',
    damage_body: 0,
    headshot_allowed: false,
    rps: null,
    magazine: null,
    reload_s: 0.0,
    range_cm: 400,
    projectile: 'continuous_cone',
    dps: 16,
    ignite: {
      dps: 6,
      duration_s: 3,
    },
    overheat: {
      active_time_s: 4.0,
      cooldown_s: 2.0,
    },
    notes: 'Stream within ~400 cm; DPS + ignite',
  },
  {
    name: 'Hands',
    category: 'Melee',
    damage_body: 8,
    headshot_allowed: false,
    rps: 2.0,
    magazine: null,
    reload_s: 0.0,
    range_cm: 50,
    projectile: 'melee',
    grapple: {
      max_hold_s: 2.0,
      interaction: 'mash_space_to_hold_or_escape',
    },
    ttk_body_s: 6.0,
    shots_to_kill_body: 13,
  },
  {
    name: 'Knife',
    category: 'Melee',
    damage_body: 20,
    headshot_allowed: false,
    rps: 1.7,
    magazine: null,
    reload_s: 0.0,
    range_cm: 60,
    projectile: 'melee',
    abilities: {
      backstab_damage: 75,
      backstab_cooldown_s: 1.0,
    },
    ttk_body_s: 2.35,
    shots_to_kill_body: 5,
  },
  {
    name: 'Tomahawk',
    category: 'Melee',
    damage_body: 24,
    headshot_allowed: false,
    rps: 1.4,
    magazine: null,
    reload_s: 0.0,
    range_cm: 70,
    projectile: 'melee',
    throw: {
      damage: 32,
      pickup: true,
    },
    on_hit: {
      slow_percent: 20,
      duration_s: 1.0,
    },
    ttk_body_s: 2.86,
    shots_to_kill_body: 5,
  },
  {
    name: 'Katana',
    category: 'Melee',
    damage_body: 18,
    headshot_allowed: false,
    rps: 2.2,
    magazine: null,
    reload_s: 0.0,
    range_cm: 80,
    projectile: 'melee',
    abilities: {
      deflect_window_s: 0.8,
      deflect_cooldown_s: 6.0,
    },
    ttk_body_s: 2.27,
    shots_to_kill_body: 6,
  },
  {
    name: 'Shield',
    category: 'Melee',
    damage_body: 24,
    headshot_allowed: false,
    rps: 1.1,
    magazine: null,
    reload_s: 0.0,
    range_cm: 50,
    projectile: 'melee',
    block: {
      frontal_reduction_percent: 70,
    },
    bash: {
      cooldown_s: 2.0,
      knockback: 'high',
    },
    ttk_body_s: 3.64,
    shots_to_kill_body: 5,
  },
  {
    name: 'Warhammer',
    category: 'Melee',
    damage_body: 34,
    headshot_allowed: false,
    rps: 0.9,
    magazine: null,
    reload_s: 0.0,
    range_cm: 80,
    projectile: 'melee',
    abilities: {
      ground_slam_damage: 20,
      ground_slam_cooldown_s: 6.0,
      ground_slam_radius_cm: null,
    },
    ttk_body_s: 2.22,
    shots_to_kill_body: 3,
  },
  {
    name: 'Bo Staff',
    category: 'Melee',
    damage_body: 12,
    headshot_allowed: false,
    rps: 2.0,
    magazine: null,
    reload_s: 0.0,
    range_cm: 90,
    projectile: 'melee',
    abilities: {
      spin_duration_s: 1.0,
      spin_cooldown_s: 8.0,
      spin_effects: ['block_arrows', 'aoe_knockback'],
    },
    ttk_body_s: 4.0,
    shots_to_kill_body: 9,
  },
  {
    name: 'Grenade',
    category: 'Utility',
    damage_body: 60,
    headshot_allowed: false,
    rps: null,
    magazine: 2,
    reload_s: 0.0,
    range_cm: null,
    projectile: 'throwable',
    fuse_s: 1.5,
    aoe: {
      radius_cm: null,
      edge_damage: 20,
      falloff: 'linear',
    },
  },
  {
    name: 'Smoke Grenade',
    category: 'Utility',
    damage_body: 0,
    headshot_allowed: false,
    magazine: 2,
    projectile: 'throwable',
    smoke: {
      duration_s: 5.0,
      radius_cm: null,
      extinguish_fire: true,
    },
  },
  {
    name: 'Resource Pack',
    category: 'Utility',
    damage_body: 0,
    headshot_allowed: false,
    magazine: 4,
    projectile: 'deployable',
    effects: {
      heal: 35,
      ammo_restore_percent: 25,
    },
  },
  {
    name: 'Mine',
    category: 'Utility',
    damage_body: 85,
    headshot_allowed: false,
    magazine: 4,
    projectile: 'deployable',
    arm_time_s: 0.2,
    aoe: {
      radius_cm: null,
      edge_damage: 20,
      falloff: 'linear',
    },
    team_safe: true,
  },
  {
    name: 'Glider',
    category: 'Utility',
    damage_body: 0,
    headshot_allowed: false,
    projectile: 'equipment',
    stamina_cost: 0,
    notes: 'Traversal; escape; no vertical gain',
  },
  {
    name: 'Bottle o’ Gas',
    category: 'Utility',
    damage_body: 0,
    headshot_allowed: false,
    projectile: 'throwable',
    pool: {
      type: 'gas',
      duration_s: 4,
      radius_cm: null,
      dps: 10,
      slow_percent: 20,
      ignitable: true,
    },
  },
  {
    name: 'Bottle o’ Fire',
    category: 'Utility',
    damage_body: 0,
    headshot_allowed: false,
    projectile: 'throwable',
    pool: {
      type: 'fire',
      duration_s: 5,
      radius_cm: null,
      dps: 8,
      ignite_on_contact: {
        dps: 6,
        duration_s: 3,
      },
    },
  },
  {
    name: 'Bottle o’ Lightning',
    category: 'Utility',
    damage_body: 0,
    headshot_allowed: false,
    projectile: 'throwable',
    field: {
      type: 'stun',
      duration_s: 6,
      radius_cm: null,
      stun_pattern: {
        stun_s: 1,
        interval_s: 2,
      },
    },
  },
  {
    name: 'Bottle o’ Ice',
    category: 'Utility',
    damage_body: 0,
    headshot_allowed: false,
    projectile: 'throwable',
    field: {
      type: 'ice',
      duration_s: 5,
      radius_cm: null,
      movement_control_penalty_percent: 35,
      friction: 'low',
    },
  },
  {
    name: 'Bottle o’ Air',
    category: 'Utility',
    damage_body: 0,
    headshot_allowed: false,
    projectile: 'throwable',
    aoe: {
      type: 'knockback',
      radius_cm: null,
      scaling: 'proximity',
    },
    notes: 'Spherical knockback; ragdoll on close direct hit',
  },
];

const LEGACY_DETAILS = new Map([
  ['Assault Rifle', { rarity: 'rare', description: 'Arc-bloom assault blaster that channels prismatic bolts without ever singeing allies.', special: { perk: 'Prism rounds mark targets so allies deal +10% damage for 3s.' } }],
  ['Sniper Rifle', { rarity: 'epic', description: 'A crystalline long-range blaster that threads starlight lances across the battlefield.', special: { perk: 'Fully-charged shots reveal struck enemies to the squad for 4s.' } }],
  ['Rocket Launcher', { rarity: 'legendary', description: 'Launches humming comets that burst into friendly-safe shockwaves of glittering force.', special: { perk: 'Blast shields grant the wielder 1s stagger immunity on detonation.' } }],
  ['Bow', { rarity: 'uncommon', description: 'Fey-grown limbs launch luminous arrows that leave a sparkling trail for teammates to follow.', special: { perk: 'Holding the draw for 1.5s adds +25 damage and a guidance shimmer for allies.' } }],
  ['Crossbow', { rarity: 'rare', description: 'Clockwork limbs weave bolts of condensed mana that pin foes without ricocheting into friends.', special: { perk: 'Bolts pin targets for 1s while staying harmless to nearby teammates.' } }],
  ['Wizard Staff', { rarity: 'epic', description: 'A living focus that overchannels starfire into sweeping volleys before venting into safety bubbles.', special: { perk: 'Venting overheats cleanse nearby allies of debuffs while leaving foes exposed.' } }],
  ['Blaster Pistol', { rarity: 'uncommon', description: 'Pocket starcaster with an overheat dial that keeps squadmates perfectly safe.', special: { perk: 'Maintains accuracy while sprinting; overheats never scorch teammates.' } }],
  ['Splash Blaster', { rarity: 'rare', description: 'Launches glittering globes that burst in soft radiance, showering enemies without hurting allies.', special: { perk: 'Direct hits grant nearby allies a 10 health sparkle shield.' } }],
  ['Slingshot', { rarity: 'common', description: 'A playful rune-slinger that pelts foes with pebble meteors while dazzling spectators.', special: { perk: 'Headshots daze foes for 0.6s without causing friendly grief.' } }],
  ['Fey Wand', { rarity: 'epic', description: 'Channel faelight motes that slow enemies into a glittery trance.', special: { perk: 'Every third bolt grants nearby allies +15 stamina bloom.' } }],
  ['Flamethrower', { rarity: 'rare', description: 'Handheld dragonet that sprays short cones of team-safe flame.', special: { perk: "Ignites Bottle o' Gas while leaving the caster's team unharmed." } }],
  ['Fists', { rarity: 'common', description: 'Gauntleted knuckles woven with grappling ribbons for playful takedowns.', special: { ability: 'Grapple: Leap and bind a foe for 1.5s, dealing 12 bonus damage.', perk: 'Grappled targets cannot swing and grant you 20% damage resist.' } }],
  ['Knife', { rarity: 'rare', description: 'Slim arcblade for elegant close-quarters flourishes.', special: { ability: 'Backstab: Striking from behind deals 150 damage and silences for 1s.', perk: 'Backstab refunds the stamina cost instead of draining it.' } }],
  ['Tomahawk', { rarity: 'uncommon', description: 'Feathered hatchet balanced for looping throws that always find home.', special: { ability: 'Returning Throw: Toss up to 18 m for 70 damage and recall automatically.', perk: 'Thrown strikes mark targets so allies deal +15% damage for 4s.' } }],
  ['Katana', { rarity: 'epic', description: 'Wind-cutting blade that sings with every graceful parry.', special: { ability: 'Wind Deflect: Reflect projectiles for 1s then counter-cut for bonus damage.', perk: 'Successful deflect restores 20 stamina to nearby allies.' } }],
  ['Shield', { rarity: 'rare', description: 'Radiant bulwark for bash-happy guardians.', special: { ability: 'Shield Bash: Lunge forward, knocking enemies back 4 m and stunning 0.8s.', perk: 'Holding guard grants allies behind you 5% damage reduction.' } }],
  ['Warhammer', { rarity: 'legendary', description: 'Meteor-headed maul that paints impact circles of friendly boons.', special: { ability: 'Starfall Slam: Crash down for 90 AoE damage and launch foes skyward.', perk: 'Impact zone grants allies +20 stamina over 3s.' } }],
  ['Bo Staff', { rarity: 'epic', description: 'Celestial staff that twirls into a protective whirlwind.', special: { ability: 'Cyclone Spin: Deflect bolts, push foes 3 m, and propel yourself 4 m back.', perk: 'Spin clears projectiles embedded in allies.' } }],
  ['Grenade', { rarity: 'rare', description: 'Sparkburst charge that pops with a friendly nudge instead of friendly fire.', special: { perk: 'Outer blast nudges allies instead of harming them.' } }],
  ['Smoke Grenade', { rarity: 'common', description: 'Billows of lilac smoke that hide movement and calm wildfires.', special: { perk: "Smoke extinguishes flames and shields Bottle o' Gas from ignition for 5s." } }],
  ['Resource Pack', { rarity: 'uncommon', description: 'Friendly courier bundle that rains snacks, ammo, and stamina confetti.', special: { perk: 'Opening grants 25 stamina to teammates.' } }],
  ['Mines', { rarity: 'epic', description: 'Crystal petals that only blossom under enemy footsteps.', special: { perk: 'Mines ignore friendly footsteps and glow for allies.' } }],
  ['Glider', { rarity: 'rare', description: 'Whimsical wingpack that lets the squad float without stamina strain.', special: { perk: 'Activating negates fall damage for nearby allies for 2s.' } }],
  ["Bottle o' Gas", { rarity: 'uncommon', description: "Breaks into a shimmering vapor pool begging for a friendly spark.", special: { perk: "Ignite with allied flames to create enemy-only fire for 45 damage per second." } }],
  ["Bottle o' Fire", { rarity: 'rare', description: "Splashes into a dancing ring of flame that loves foes and ignores friends.", special: { perk: "Fire respects the thrower's team, letting allies dance through safely." } }],
  ["Bottle o' Lightning", { rarity: 'epic', description: "Crackling storm bottled for paralyzing surprise parties.", special: { perk: "Paralyzed enemies take +15% ranged damage from your squad." } }],
  ["Bottle o' Ice", { rarity: 'uncommon', description: "Frosty slick that sends foes skating while allies glide with style.", special: { perk: "Allies sliding gain +20% speed; enemies skid without control." } }],
  ["Bottle o' Air", { rarity: 'uncommon', description: "A giggling gust in a jar, perfect for repositioning friends and foes alike.", special: { perk: 'Self-knockback refunds 20 stamina and never harms friends.' } }],
]);

const NAME_ALIASES = new Map([
  ['Hands', 'Fists'],
  ['Mine', 'Mines'],
]);

const FALLBACK_RARITY_BY_CATEGORY = {
  primary: 'rare',
  secondary: 'uncommon',
  melee: 'common',
  utility: 'uncommon',
};

const PLACEHOLDER_MODEL_BY_CATEGORY = {
  primary: 'assets/models/primary/placeholder.gltf',
  secondary: 'assets/models/secondary/placeholder.gltf',
  melee: 'assets/models/melee/placeholder.gltf',
  utility: 'assets/models/utility/placeholder.gltf',
};

const HEADSHOT_MULTIPLIER = RAW_GLOBALS.headshot_multiplier ?? 3;

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const prettify = (value) =>
  value
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAoe\b/g, 'AOE')
    .replace(/\bDps\b/g, 'DPS');

const formatNumber = (value, { maximumFractionDigits = 2 } = {}) => {
  if (value === null || value === undefined) {
    return null;
  }
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
};

const formatSeconds = (value, options = {}) => {
  if (value === null || value === undefined) {
    return null;
  }
  const formatted = formatNumber(value, options);
  return formatted ? `${formatted} s` : null;
};

const formatRate = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  const formatted = formatNumber(value);
  return formatted ? `${formatted} rps` : null;
};

const formatMeters = (centimeters) => {
  if (centimeters === null || centimeters === undefined) {
    return null;
  }
  const formatted = formatNumber(centimeters / 100);
  return formatted ? `${formatted} m` : null;
};

const formatShots = (value, suffix = 'body hits') => {
  if (value === null || value === undefined) {
    return null;
  }
  const formatted = formatNumber(value, { maximumFractionDigits: 0 });
  return formatted ? `${formatted} ${suffix}` : null;
};

const formatPercent = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  const formatted = formatNumber(value, { maximumFractionDigits: 0 });
  return formatted ? `${formatted}%` : null;
};

const formatList = (values) =>
  Array.isArray(values) && values.length > 0
    ? values.map((item) => prettify(String(item))).join(', ')
    : null;

const pickFirst = (...values) => values.find((value) => value !== null && value !== undefined);

const removeEmpty = (source) => {
  const result = {};
  Object.entries(source).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'string' && value.trim() === '') return;
    result[key] = value;
  });
  return result;
};

const formatSplash = (splash) => {
  if (!splash) return null;
  const parts = [];
  if (splash.center_damage !== undefined || splash.edge_damage !== undefined) {
    const center = splash.center_damage !== undefined ? formatNumber(splash.center_damage) : null;
    const edge = splash.edge_damage !== undefined ? formatNumber(splash.edge_damage) : null;
    if (center && edge) {
      parts.push(`${center} center / ${edge} edge damage`);
    } else if (center) {
      parts.push(`${center} center damage`);
    } else if (edge) {
      parts.push(`${edge} edge damage`);
    }
  }
  if (splash.radius_cm !== undefined && splash.radius_cm !== null) {
    parts.push(`${formatMeters(splash.radius_cm)} radius`);
  }
  if (splash.falloff) {
    parts.push(`${prettify(splash.falloff)} falloff`);
  }
  return parts.join('; ');
};

const formatAoe = (aoe) => {
  if (!aoe) return null;
  const parts = [];
  if (aoe.edge_damage !== undefined && aoe.edge_damage !== null) {
    parts.push(`${formatNumber(aoe.edge_damage)} edge damage`);
  }
  if (aoe.radius_cm !== undefined && aoe.radius_cm !== null) {
    parts.push(`${formatMeters(aoe.radius_cm)} radius`);
  }
  if (aoe.falloff) {
    parts.push(`${prettify(aoe.falloff)} falloff`);
  }
  if (aoe.type) {
    parts.push(prettify(aoe.type));
  }
  return parts.join('; ');
};

const formatOverheat = (overheat) => {
  if (!overheat) return null;
  const parts = [];
  if (overheat.shots_before_overheat !== undefined && overheat.shots_before_overheat !== null) {
    parts.push(`${formatNumber(overheat.shots_before_overheat, { maximumFractionDigits: 0 })} shots`);
  }
  if (overheat.active_time_s !== undefined && overheat.active_time_s !== null) {
    parts.push(`${formatSeconds(overheat.active_time_s)} active`);
  }
  if (overheat.cooldown_s !== undefined && overheat.cooldown_s !== null) {
    parts.push(`${formatSeconds(overheat.cooldown_s)} cooldown`);
  }
  return parts.join('; ');
};

const formatIgnite = (ignite) => {
  if (!ignite) return null;
  const dps = ignite.dps !== undefined && ignite.dps !== null ? `${formatNumber(ignite.dps)} DPS` : null;
  const duration = ignite.duration_s !== undefined && ignite.duration_s !== null ? formatSeconds(ignite.duration_s) : null;
  if (dps && duration) {
    return `${dps} for ${duration}`;
  }
  return dps || (duration ? `Duration ${duration}` : null);
};

const formatGrapple = (grapple) => {
  if (!grapple) return null;
  const parts = [];
  if (grapple.max_hold_s !== undefined && grapple.max_hold_s !== null) {
    parts.push(`Hold up to ${formatSeconds(grapple.max_hold_s)}`);
  }
  if (grapple.interaction) {
    parts.push(prettify(grapple.interaction));
  }
  return parts.join('; ');
};

const formatAbility = (abilities) => {
  if (!abilities) return null;
  if ('backstab_damage' in abilities) {
    const damage = abilities.backstab_damage !== null && abilities.backstab_damage !== undefined ? `${formatNumber(abilities.backstab_damage)} damage` : null;
    const cooldown = abilities.backstab_cooldown_s !== null && abilities.backstab_cooldown_s !== undefined ? `${formatSeconds(abilities.backstab_cooldown_s)} cooldown` : null;
    return [damage, cooldown].filter(Boolean).join('; ');
  }
  if ('deflect_window_s' in abilities) {
    const window = abilities.deflect_window_s !== null && abilities.deflect_window_s !== undefined ? `${formatSeconds(abilities.deflect_window_s)} window` : null;
    const cooldown = abilities.deflect_cooldown_s !== null && abilities.deflect_cooldown_s !== undefined ? `${formatSeconds(abilities.deflect_cooldown_s)} cooldown` : null;
    return [window, cooldown].filter(Boolean).join('; ');
  }
  if ('ground_slam_damage' in abilities) {
    const damage = abilities.ground_slam_damage !== null && abilities.ground_slam_damage !== undefined ? `${formatNumber(abilities.ground_slam_damage)} impact` : null;
    const cooldown = abilities.ground_slam_cooldown_s !== null && abilities.ground_slam_cooldown_s !== undefined ? `${formatSeconds(abilities.ground_slam_cooldown_s)} cooldown` : null;
    const radius = abilities.ground_slam_radius_cm !== null && abilities.ground_slam_radius_cm !== undefined ? `${formatMeters(abilities.ground_slam_radius_cm)} radius` : null;
    return [damage, cooldown, radius].filter(Boolean).join('; ');
  }
  if ('spin_duration_s' in abilities) {
    const duration = abilities.spin_duration_s !== null && abilities.spin_duration_s !== undefined ? `${formatSeconds(abilities.spin_duration_s)} spin` : null;
    const cooldown = abilities.spin_cooldown_s !== null && abilities.spin_cooldown_s !== undefined ? `${formatSeconds(abilities.spin_cooldown_s)} cooldown` : null;
    const effects = Array.isArray(abilities.spin_effects) ? `Effects: ${formatList(abilities.spin_effects)}` : null;
    return [duration, cooldown, effects].filter(Boolean).join('; ');
  }
  return Object.entries(abilities)
    .map(([key, value]) => `${prettify(key)}: ${value}`)
    .join('; ');
};

const formatThrow = (data) => {
  if (!data) return null;
  const damage = data.damage !== undefined && data.damage !== null ? `${formatNumber(data.damage)} damage` : null;
  const pickup = data.pickup !== undefined ? `Pickup ${data.pickup ? 'enabled' : 'disabled'}` : null;
  return [damage, pickup].filter(Boolean).join('; ');
};

const formatOnHit = (data) => {
  if (!data) return null;
  const slow = data.slow_percent !== undefined && data.slow_percent !== null ? `${formatPercent(data.slow_percent)} slow` : null;
  const duration = data.duration_s !== undefined && data.duration_s !== null ? `${formatSeconds(data.duration_s)} duration` : null;
  return [slow, duration].filter(Boolean).join('; ');
};

const formatBlock = (block) => {
  if (!block) return null;
  if (block.frontal_reduction_percent !== undefined && block.frontal_reduction_percent !== null) {
    return `${formatPercent(block.frontal_reduction_percent)} frontal reduction`;
  }
  return null;
};

const formatBash = (bash) => {
  if (!bash) return null;
  const cooldown = bash.cooldown_s !== undefined && bash.cooldown_s !== null ? `${formatSeconds(bash.cooldown_s)} cooldown` : null;
  const knockback = bash.knockback ? `Knockback: ${prettify(bash.knockback)}` : null;
  return [cooldown, knockback].filter(Boolean).join('; ');
};

const formatEffects = (effects) => {
  if (!effects) return null;
  const heal = effects.heal !== undefined && effects.heal !== null ? `${formatNumber(effects.heal, { maximumFractionDigits: 0 })} heal` : null;
  const ammo = effects.ammo_restore_percent !== undefined && effects.ammo_restore_percent !== null ? `${formatPercent(effects.ammo_restore_percent)} ammo` : null;
  return [heal, ammo].filter(Boolean).join('; ');
};

const formatPool = (pool) => {
  if (!pool) return null;
  const parts = [];
  if (pool.type) {
    parts.push(`Type: ${prettify(pool.type)}`);
  }
  if (pool.duration_s !== undefined && pool.duration_s !== null) {
    parts.push(`Duration ${formatSeconds(pool.duration_s)}`);
  }
  if (pool.radius_cm !== undefined && pool.radius_cm !== null) {
    parts.push(`${formatMeters(pool.radius_cm)} radius`);
  }
  if (pool.dps !== undefined && pool.dps !== null) {
    parts.push(`${formatNumber(pool.dps)} DPS`);
  }
  if (pool.slow_percent !== undefined && pool.slow_percent !== null) {
    parts.push(`${formatPercent(pool.slow_percent)} slow`);
  }
  if (pool.ignitable !== undefined) {
    parts.push(pool.ignitable ? 'Ignitable' : 'Not ignitable');
  }
  if (pool.ignite_on_contact) {
    const ignite = pool.ignite_on_contact;
    const igniteDps = ignite.dps !== undefined && ignite.dps !== null ? `${formatNumber(ignite.dps)} DPS` : null;
    const igniteDuration = ignite.duration_s !== undefined && ignite.duration_s !== null ? formatSeconds(ignite.duration_s) : null;
    const igniteParts = [igniteDps, igniteDuration ? `for ${igniteDuration}` : null].filter(Boolean).join(' ');
    if (igniteParts) {
      parts.push(`Ignites on contact: ${igniteParts}`);
    }
  }
  return parts.join('; ');
};

const formatStunPattern = (pattern) => {
  if (!pattern) return null;
  const stun = pattern.stun_s !== undefined && pattern.stun_s !== null ? formatSeconds(pattern.stun_s) : null;
  const interval = pattern.interval_s !== undefined && pattern.interval_s !== null ? formatSeconds(pattern.interval_s) : null;
  return [stun ? `Stuns ${stun}` : null, interval ? `every ${interval}` : null].filter(Boolean).join(' ');
};

const formatField = (field) => {
  if (!field) return null;
  const parts = [];
  if (field.type) {
    parts.push(`Type: ${prettify(field.type)}`);
  }
  if (field.duration_s !== undefined && field.duration_s !== null) {
    parts.push(`Duration ${formatSeconds(field.duration_s)}`);
  }
  if (field.radius_cm !== undefined && field.radius_cm !== null) {
    parts.push(`${formatMeters(field.radius_cm)} radius`);
  }
  if (field.stun_pattern) {
    const pattern = formatStunPattern(field.stun_pattern);
    if (pattern) {
      parts.push(pattern);
    }
  }
  if (field.movement_control_penalty_percent !== undefined && field.movement_control_penalty_percent !== null) {
    parts.push(`${formatPercent(field.movement_control_penalty_percent)} movement penalty`);
  }
  if (field.friction) {
    parts.push(`Friction: ${prettify(field.friction)}`);
  }
  return parts.join('; ');
};

const formatSmoke = (smoke) => {
  if (!smoke) return null;
  const parts = [];
  if (smoke.duration_s !== undefined && smoke.duration_s !== null) {
    parts.push(`Duration ${formatSeconds(smoke.duration_s)}`);
  }
  if (smoke.radius_cm !== undefined && smoke.radius_cm !== null) {
    parts.push(`${formatMeters(smoke.radius_cm)} radius`);
  }
  if (smoke.extinguish_fire !== undefined) {
    parts.push(smoke.extinguish_fire ? 'Extinguishes fire' : 'No fire extinguish');
  }
  return parts.join('; ');
};

const getLegacyDetails = (name) => {
  const alias = NAME_ALIASES.get(name) ?? name;
  return LEGACY_DETAILS.get(alias) ?? null;
};

const buildStats = (weapon, category) => {
  const headshotDamage =
    weapon.headshot_allowed && weapon.damage_body !== null && weapon.damage_body !== undefined
      ? weapon.damage_body * HEADSHOT_MULTIPLIER
      : null;

  const baseStats = {
    damage: weapon.damage_body !== null && weapon.damage_body !== undefined ? `${formatNumber(weapon.damage_body)} body` : null,
    headshotDamage:
      headshotDamage !== null
        ? `${formatNumber(headshotDamage)} head (×${formatNumber(HEADSHOT_MULTIPLIER)})`
        : null,
    fireRate: formatRate(weapon.rps),
    reloadSpeed: formatSeconds(weapon.reload_s),
    magazineSize:
      weapon.magazine !== null && weapon.magazine !== undefined
        ? `${formatNumber(weapon.magazine, { maximumFractionDigits: 0 })} ${category === 'utility' ? 'charges' : 'rounds'}`
        : null,
    ttkBody: weapon.ttk_body_s !== null && weapon.ttk_body_s !== undefined ? `${formatNumber(weapon.ttk_body_s)} s` : null,
    shotsToKillBody: formatShots(weapon.shots_to_kill_body),
    range: formatMeters(weapon.range_cm),
    projectileType: weapon.projectile ? prettify(weapon.projectile) : null,
  };

  if (weapon.draw_time_s !== null && weapon.draw_time_s !== undefined) {
    baseStats.drawSpeed = formatSeconds(weapon.draw_time_s);
  }

  if (weapon.dps !== null && weapon.dps !== undefined) {
    baseStats.dps = `${formatNumber(weapon.dps)} DPS`;
  }

  if (weapon.ignite?.dps !== undefined && weapon.ignite?.dps !== null) {
    baseStats.igniteDps = `${formatNumber(weapon.ignite.dps)} DPS`;
  }

  if (weapon.ignite?.duration_s !== undefined && weapon.ignite?.duration_s !== null) {
    baseStats.igniteDuration = formatSeconds(weapon.ignite.duration_s);
  }

  if (weapon.overheat?.shots_before_overheat !== undefined && weapon.overheat?.shots_before_overheat !== null) {
    baseStats.heatCapacity = `${formatNumber(weapon.overheat.shots_before_overheat, { maximumFractionDigits: 0 })} shots`;
  }

  if (weapon.overheat?.active_time_s !== undefined && weapon.overheat?.active_time_s !== null) {
    baseStats.heatCapacity = formatSeconds(weapon.overheat.active_time_s);
  }

  if (weapon.overheat?.cooldown_s !== undefined && weapon.overheat?.cooldown_s !== null) {
    baseStats.heatDissipation = formatSeconds(weapon.overheat.cooldown_s);
  }

  const radius = pickFirst(
    weapon.aoe?.radius_cm,
    weapon.splash?.radius_cm,
    weapon.pool?.radius_cm,
    weapon.field?.radius_cm,
    weapon.smoke?.radius_cm
  );
  if (radius !== undefined && radius !== null) {
    baseStats.aoeRadius = formatMeters(radius);
  }

  const duration = pickFirst(weapon.pool?.duration_s, weapon.field?.duration_s, weapon.smoke?.duration_s);
  if (duration !== undefined && duration !== null) {
    baseStats.duration = formatSeconds(duration);
  }

  if (weapon.fuse_s !== null && weapon.fuse_s !== undefined) {
    baseStats.fuseTime = formatSeconds(weapon.fuse_s);
  }

  if (weapon.arm_time_s !== null && weapon.arm_time_s !== undefined) {
    baseStats.armTime = formatSeconds(weapon.arm_time_s);
  }

  if (weapon.effects?.heal !== undefined && weapon.effects?.heal !== null) {
    baseStats.healAmount = formatNumber(weapon.effects.heal, { maximumFractionDigits: 0 });
  }

  if (weapon.effects?.ammo_restore_percent !== undefined && weapon.effects?.ammo_restore_percent !== null) {
    baseStats.ammoRestock = `${formatPercent(weapon.effects.ammo_restore_percent)}`;
  }

  if (weapon.field?.stun_pattern?.stun_s !== undefined && weapon.field?.stun_pattern?.stun_s !== null) {
    baseStats.stunDuration = formatSeconds(weapon.field.stun_pattern.stun_s);
  }

  if (category === 'utility') {
    baseStats.magazineSize = null;
    if (weapon.magazine !== null && weapon.magazine !== undefined) {
      baseStats.carryLimit = `${formatNumber(weapon.magazine, { maximumFractionDigits: 0 })} charges`;
    }
    baseStats.damage =
      weapon.damage_body !== null && weapon.damage_body !== undefined
        ? `${formatNumber(weapon.damage_body)} impact`
        : baseStats.damage;
  }

  if (weapon.stamina_cost !== undefined && weapon.stamina_cost !== null) {
    baseStats.staminaCost = formatNumber(weapon.stamina_cost, { maximumFractionDigits: 0 });
  }

  if (weapon.projectile === 'melee' && weapon.range_cm !== null && weapon.range_cm !== undefined) {
    baseStats.range = formatMeters(weapon.range_cm);
  }

  return removeEmpty(baseStats);
};

const buildSpecial = (weapon, legacySpecial = {}, category) => {
  const special = { ...(legacySpecial || {}) };

  if (weapon.notes) {
    special.combatNotes = weapon.notes;
  }

  if (weapon.headshot_allowed !== undefined) {
    special.headshotRule = weapon.headshot_allowed
      ? `Headshots enabled (×${formatNumber(HEADSHOT_MULTIPLIER)})`
      : 'Headshots disabled';
  }

  if (weapon.headshot_allowed && weapon.damage_body !== null && weapon.damage_body !== undefined) {
    special.headshotDamage = `${formatNumber(weapon.damage_body * HEADSHOT_MULTIPLIER)} damage on headshots`;
  }

  // Time-to-kill and shots-to-kill are surfaced in the core stat list.

  if (weapon.splash) {
    const splash = formatSplash(weapon.splash);
    if (splash) {
      special.splashProfile = splash;
    }
  }

  if (weapon.aoe) {
    const aoe = formatAoe(weapon.aoe);
    if (aoe) {
      special.aoeProfile = aoe;
    }
  }

  if (weapon.overheat) {
    const overheat = formatOverheat(weapon.overheat);
    if (overheat) {
      special.overheatProfile = overheat;
    }
  }

  if (weapon.self_damage !== undefined && weapon.self_damage !== null) {
    special.selfDamage = `${formatNumber(weapon.self_damage)} self-damage`;
  }

  if (weapon.ignite) {
    const ignite = formatIgnite(weapon.ignite);
    if (ignite) {
      special.igniteProfile = ignite;
    }
  }

  if (weapon.grapple) {
    const grapple = formatGrapple(weapon.grapple);
    if (grapple) {
      special.grapple = grapple;
    }
  }

  if (weapon.abilities) {
    const ability = formatAbility(weapon.abilities);
    if (ability) {
      special.abilityDetails = ability;
    }
  }

  if (weapon.throw) {
    const throwInfo = formatThrow(weapon.throw);
    if (throwInfo) {
      special.throwProfile = throwInfo;
    }
  }

  if (weapon.on_hit) {
    const onHit = formatOnHit(weapon.on_hit);
    if (onHit) {
      special.onHitEffect = onHit;
    }
  }

  if (weapon.block) {
    const block = formatBlock(weapon.block);
    if (block) {
      special.blockProfile = block;
    }
  }

  if (weapon.bash) {
    const bash = formatBash(weapon.bash);
    if (bash) {
      special.bashProfile = bash;
    }
  }

  if (weapon.effects) {
    const effects = formatEffects(weapon.effects);
    if (effects) {
      special.supportEffects = effects;
    }
  }

  if (weapon.pool) {
    const pool = formatPool(weapon.pool);
    if (pool) {
      special.poolProfile = pool;
    }
  }

  if (weapon.field) {
    const field = formatField(weapon.field);
    if (field) {
      special.fieldProfile = field;
    }
  }

  if (weapon.smoke) {
    const smoke = formatSmoke(weapon.smoke);
    if (smoke) {
      special.smokeProfile = smoke;
    }
  }

  if (weapon.team_safe !== undefined) {
    special.teamSafe = weapon.team_safe ? 'Safe for allies' : 'Hazardous to allies';
  }

  if (category === 'utility' && weapon.projectile === 'equipment') {
    special.usage = 'Traversal equipment';
  }

  return removeEmpty(special);
};

const weapons = RAW_WEAPONS.map((weapon) => {
  const category = weapon.category.toLowerCase();
  const legacy = getLegacyDetails(weapon.name) || {};

  return normalizeWeapon({
    id: slugify(weapon.name),
    name: weapon.name,
    category,
    rarity: legacy.rarity || FALLBACK_RARITY_BY_CATEGORY[category] || 'common',
    description: legacy.description || weapon.notes || 'Specification pending.',
    modelPath: legacy.modelPath ?? PLACEHOLDER_MODEL_BY_CATEGORY[category] ?? null,
    preview: legacy.preview || undefined,
    stats: buildStats(weapon, category),
    special: buildSpecial(weapon, legacy.special || {}, category),
  });
});

export const weaponGlobals = RAW_GLOBALS;
export const sampleWeapons = weapons;

