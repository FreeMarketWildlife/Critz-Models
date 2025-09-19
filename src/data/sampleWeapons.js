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

const LEGACY_DETAILS = new Map();

const NAME_ALIASES = new Map();

const FALLBACK_RARITY_BY_CATEGORY = {
  primary: 'rare',
  secondary: 'uncommon',
  melee: 'common',
  utility: 'uncommon',
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

const BASE_HEALTH = RAW_GLOBALS.base_health ?? 100;

const rpmToRps = (rpm) => {
  if (rpm === null || rpm === undefined) {
    return null;
  }
  return rpm / 60;
};

const computeShotsToKill = (damage) => {
  if (damage === null || damage === undefined) {
    return null;
  }
  if (damage <= 0) {
    return null;
  }
  return Math.ceil(BASE_HEALTH / damage);
};

const computeTtk = (damage, rps) => {
  const shots = computeShotsToKill(damage);
  if (!shots) {
    return null;
  }
  if (rps === null || rps === undefined || rps <= 0) {
    return null;
  }
  if (shots <= 1) {
    return 0;
  }
  return (shots - 1) / rps;
};

const RAW_WEAPONS = [
  {
    category: 'primary',
    name: 'Assault Rifle',
    damage_body: 10,
    headshot_allowed: true,
    projectile: 'bullet',
    rps: rpmToRps(500),
    magazine: 20,
    ammo_reserve: 100,
    reload_s: 0.5,
    draw_time_s: 0.2,
    range_cm: 300,
    dps: 10 * rpmToRps(500),
    shots_to_kill_body: computeShotsToKill(10),
    ttk_body_s: computeTtk(10, rpmToRps(500)),
    notes: 'Fire Mode: Full-auto. 100 rounds carried in reserve.',
  },
  {
    category: 'primary',
    name: 'Sniper Rifle',
    damage_body: 50,
    headshot_allowed: true,
    projectile: 'bullet',
    rps: rpmToRps(60),
    magazine: 4,
    ammo_reserve: 16,
    reload_s: 2,
    draw_time_s: 0.5,
    range_cm: 1000,
    dps: 50 * rpmToRps(60),
    shots_to_kill_body: computeShotsToKill(50),
    ttk_body_s: computeTtk(50, rpmToRps(60)),
    notes: 'Fire Mode: Semi-auto precision rifle.',
  },
  {
    category: 'primary',
    name: 'Rocket Launcher',
    damage_body: 100,
    headshot_allowed: false,
    projectile: 'explosive',
    rps: rpmToRps(50),
    magazine: 1,
    ammo_reserve: 6,
    reload_s: 1,
    draw_time_s: 0.5,
    range_cm: 300,
    dps: 100 * rpmToRps(50),
    shots_to_kill_body: computeShotsToKill(100),
    ttk_body_s: computeTtk(100, rpmToRps(50)),
    splash: { center_damage: 100 },
    notes: 'Fire Mode: Manual launcher. Splash damage follows 100%/50%/25% falloff.',
  },
  {
    category: 'primary',
    name: 'Bow',
    damage_body: 15,
    headshot_allowed: true,
    projectile: 'arrow',
    rps: rpmToRps(200),
    magazine: 1,
    ammo_reserve: 30,
    reload_s: 0.3,
    draw_time_s: 0.2,
    range_cm: 300,
    dps: 15 * rpmToRps(200),
    shots_to_kill_body: computeShotsToKill(15),
    ttk_body_s: computeTtk(15, rpmToRps(200)),
    notes: 'Fire Mode: Drawn shots with an effective range between 100 cm and 300 cm.',
  },
  {
    category: 'primary',
    name: 'Crossbow',
    damage_body: 30,
    headshot_allowed: true,
    projectile: 'bolt',
    rps: rpmToRps(120),
    magazine: 1,
    ammo_reserve: 14,
    reload_s: 0.5,
    draw_time_s: 0.5,
    range_cm: 200,
    dps: 30 * rpmToRps(120),
    shots_to_kill_body: computeShotsToKill(30),
    ttk_body_s: computeTtk(30, rpmToRps(120)),
    notes: 'Fire Mode: Manual reload crossbow.',
  },
  {
    category: 'primary',
    name: 'Wizard Staff',
    damage_body: 10,
    headshot_allowed: false,
    projectile: 'magic',
    rps: rpmToRps(120),
    overheat: { shots_before_overheat: 10, cooldown_s: 2 },
    draw_time_s: 0.5,
    range_cm: 100,
    dps: 10 * rpmToRps(120),
    shots_to_kill_body: computeShotsToKill(10),
    ttk_body_s: computeTtk(10, rpmToRps(120)),
    splash: { center_damage: 10 },
    notes: 'Fire Mode: Full-auto splash channel with a 10-shot focus and 100-unit heat sink.',
  },
  {
    category: 'secondary',
    name: 'Blaster Pistol',
    damage_body: 5,
    headshot_allowed: true,
    projectile: 'energy_bolt',
    rps: rpmToRps(300),
    overheat: { shots_before_overheat: 20, cooldown_s: 2 },
    draw_time_s: 0.1,
    range_cm: 100,
    dps: 5 * rpmToRps(300),
    shots_to_kill_body: computeShotsToKill(5),
    ttk_body_s: computeTtk(5, rpmToRps(300)),
    notes: 'Vent-to-cool sidearm with a 20-shot heat sink.',
  },
  {
    category: 'secondary',
    name: 'Slingshot',
    damage_body: 5,
    headshot_allowed: true,
    projectile: 'pebble',
    rps: rpmToRps(150),
    reload_s: 0.4,
    draw_time_s: 0.1,
    range_cm: 100,
    dps: 5 * rpmToRps(150),
    shots_to_kill_body: computeShotsToKill(5),
    ttk_body_s: computeTtk(5, rpmToRps(150)),
    notes: 'Fire Mode: Drawn. Effective range between 50 cm and 100 cm.',
  },
  {
    category: 'secondary',
    name: 'Splash Blaster',
    damage_body: 10,
    headshot_allowed: false,
    projectile: 'splash_orb',
    rps: rpmToRps(300),
    magazine: 8,
    ammo_reserve: 16,
    reload_s: 0.2,
    draw_time_s: 0.2,
    range_cm: 100,
    dps: 10 * rpmToRps(300),
    shots_to_kill_body: computeShotsToKill(10),
    ttk_body_s: computeTtk(10, rpmToRps(300)),
    splash: { center_damage: 10 },
    notes: 'Fire Mode: Semi-auto splash blaster.',
  },
  {
    category: 'secondary',
    name: 'Fey Wand',
    damage_body: 15,
    headshot_allowed: false,
    projectile: 'magic',
    rps: rpmToRps(120),
    overheat: { shots_before_overheat: 20, cooldown_s: 3 },
    draw_time_s: 0.1,
    range_cm: 100,
    dps: 15 * rpmToRps(120),
    shots_to_kill_body: computeShotsToKill(15),
    ttk_body_s: computeTtk(15, rpmToRps(120)),
    splash: { center_damage: 15 },
    notes: 'Fire Mode: Full-auto splash focus with a 20-shot vent cycle.',
  },
  {
    category: 'secondary',
    name: 'Flamethrower',
    headshot_allowed: false,
    projectile: 'flame',
    rps: rpmToRps(1000),
    overheat: { active_time_s: 2, cooldown_s: 2 },
    draw_time_s: 0.4,
    range_cm: 10,
    ignite: { dps: 10, duration_s: 3 },
    notes: 'Fire Mode: Full-auto AOE stream applying burning damage over 3 seconds.',
  },
  {
    category: 'melee',
    name: 'Hands',
    damage_body: 3,
    headshot_allowed: false,
    projectile: 'melee',
    rps: rpmToRps(300),
    draw_time_s: 0.1,
    range_cm: 2,
    stamina_cost: 5,
    stamina_reserve: 15,
    dps: 3 * rpmToRps(300),
    shots_to_kill_body: computeShotsToKill(3),
    ttk_body_s: computeTtk(3, rpmToRps(300)),
    abilities: { summary: 'Grapple', description: 'Hold on to enemy (5 s cooldown)' },
    grapple: { interaction: 'hold_on_to_enemy' },
    notes: 'Stamina: 5 per punch with 15 stamina available.',
  },
  {
    category: 'melee',
    name: 'Knife',
    damage_body: 15,
    headshot_allowed: false,
    projectile: 'melee',
    rps: rpmToRps(120),
    draw_time_s: 0.1,
    range_cm: 2,
    stamina_cost: 10,
    stamina_reserve: 5,
    dps: 15 * rpmToRps(120),
    shots_to_kill_body: computeShotsToKill(15),
    ttk_body_s: computeTtk(15, rpmToRps(120)),
    abilities: { backstab_damage: 100, backstab_cooldown_s: 10 },
    notes: 'Stamina: 10 per strike with 5 stamina reserve.',
  },
  {
    category: 'melee',
    name: 'Tomahawk',
    damage_body: 20,
    headshot_allowed: false,
    projectile: 'melee',
    rps: rpmToRps(60),
    draw_time_s: 0.3,
    range_cm: 3,
    stamina_cost: 15,
    stamina_reserve: 10,
    dps: 20 * rpmToRps(60),
    shots_to_kill_body: computeShotsToKill(20),
    ttk_body_s: computeTtk(20, rpmToRps(60)),
    abilities: { summary: 'Throw', description: 'Throw tomahawk (retrievable) with 0.1 s cooldown' },
    throw: { damage: 20, pickup: true },
    notes: 'Tomahawks can be picked up after being thrown.',
  },
  {
    category: 'melee',
    name: 'Katana',
    damage_body: 15,
    headshot_allowed: false,
    projectile: 'melee',
    rps: rpmToRps(120),
    draw_time_s: 0.2,
    range_cm: 4,
    stamina_cost: 10,
    stamina_reserve: 25,
    dps: 15 * rpmToRps(120),
    shots_to_kill_body: computeShotsToKill(15),
    ttk_body_s: computeTtk(15, rpmToRps(120)),
    abilities: { deflect_window_s: 1, deflect_cooldown_s: 5 },
    notes: 'Stamina: 10 per slash with 25–100 stamina available depending on stance.',
  },
  {
    category: 'melee',
    name: 'Shield',
    damage_body: 5,
    headshot_allowed: false,
    projectile: 'melee',
    rps: rpmToRps(90),
    draw_time_s: 0.5,
    range_cm: 2,
    stamina_cost: 10,
    stamina_reserve: 30,
    dps: 5 * rpmToRps(90),
    shots_to_kill_body: computeShotsToKill(5),
    ttk_body_s: computeTtk(5, rpmToRps(90)),
    abilities: { summary: 'Bash', description: 'Bash knocks enemies back (5 s cooldown)' },
    bash: { cooldown_s: 5, knockback: 'enemy_units' },
    notes: 'Defensive shield strikes consume 10 stamina with 30 stamina reserve.',
  },
  {
    category: 'melee',
    name: 'Warhammer',
    damage_body: 30,
    headshot_allowed: false,
    projectile: 'melee',
    rps: rpmToRps(60),
    draw_time_s: 1,
    range_cm: 4,
    stamina_cost: 30,
    stamina_reserve: 50,
    dps: 30 * rpmToRps(60),
    shots_to_kill_body: computeShotsToKill(30),
    ttk_body_s: computeTtk(30, rpmToRps(60)),
    abilities: { summary: 'Ground Pound', description: 'Ground Pound slam with 10 s cooldown' },
    splash: { center_damage: 30 },
    notes: 'Heavy swings consume 30 stamina from a 50 stamina reserve.',
  },
  {
    category: 'melee',
    name: 'Bo Staff',
    damage_body: 5,
    headshot_allowed: false,
    projectile: 'melee',
    rps: rpmToRps(180),
    draw_time_s: 0.1,
    range_cm: 3,
    stamina_cost: 2,
    stamina_reserve: 10,
    dps: 5 * rpmToRps(180),
    shots_to_kill_body: computeShotsToKill(5),
    ttk_body_s: computeTtk(5, rpmToRps(180)),
    abilities: {
      summary: 'Spin',
      description: 'Spin blows self and enemies back; disarms arrows (5 s cooldown)',
    },
    notes: 'Agile staff techniques consume 2 stamina per strike with 10 stamina reserve.',
  },
  {
    category: 'utility',
    name: 'Grenade',
    damage_body: 50,
    headshot_allowed: false,
    projectile: 'explosive',
    magazine: 2,
    range_cm: 50,
    splash: { center_damage: 50 },
    shots_to_kill_body: computeShotsToKill(50),
    notes: 'Throw to detonate. Pushes enemies and self; cannot be cooked.',
  },
  {
    category: 'utility',
    name: 'Smoke Grenade',
    headshot_allowed: false,
    projectile: 'smoke',
    magazine: 2,
    range_cm: 50,
    smoke: { radius_cm: 50, extinguish_fire: true },
    notes: 'Throw to create a smoke sphere on impact that extinguishes fire.',
  },
  {
    category: 'utility',
    name: 'Resource Pack',
    headshot_allowed: false,
    projectile: 'supply',
    magazine: 4,
    range_cm: 2,
    effects: { heal: 50, ammo_restore_percent: 50 },
    notes: 'Drop to restore 50% health and ammo to any unit.',
  },
  {
    category: 'utility',
    name: 'Mines',
    damage_body: 150,
    headshot_allowed: false,
    projectile: 'trap',
    magazine: 4,
    range_cm: 2,
    shots_to_kill_body: computeShotsToKill(150),
    notes: 'Drop to arm mines that trigger on contact or when shot (50 health).',
  },
  {
    category: 'utility',
    name: 'Glider',
    headshot_allowed: false,
    projectile: 'equipment',
    notes: 'Hold to deploy a glider; units glide forward when falling.',
  },
  {
    category: 'utility',
    name: 'Bottle o’ Gas',
    headshot_allowed: false,
    projectile: 'chemical',
    magazine: 2,
    range_cm: 50,
    pool: { type: 'gas', duration_s: 5, dps: 5, ignitable: true },
    notes: 'Creates a lingering gas pool on hit that can be ignited by any team.',
  },
  {
    category: 'utility',
    name: 'Bottle o’ Fire',
    headshot_allowed: false,
    projectile: 'fire',
    magazine: 2,
    range_cm: 50,
    ignite: { dps: 10, duration_s: 3 },
    pool: { type: 'fire', duration_s: 3 },
    notes: 'Creates a burning pool on hit that applies fire damage over time.',
  },
  {
    category: 'utility',
    name: 'Bottle o’ Lightning',
    headshot_allowed: false,
    projectile: 'electric',
    magazine: 2,
    range_cm: 50,
    field: { type: 'lightning', radius_cm: 50, stun_pattern: { stun_s: 0.5, interval_s: 1 } },
    notes: 'Creates an electrified pool that intermittently paralyzes enemies.',
  },
  {
    category: 'utility',
    name: 'Bottle o’ Ice',
    headshot_allowed: false,
    projectile: 'ice',
    magazine: 2,
    range_cm: 50,
    field: {
      type: 'ice',
      radius_cm: 50,
      movement_control_penalty_percent: 50,
      friction: 'reduced',
    },
    notes: 'Creates an icy pool that halves friction for all units.',
  },
  {
    category: 'utility',
    name: 'Bottle o’ Air',
    headshot_allowed: false,
    projectile: 'air',
    magazine: 2,
    range_cm: 50,
    notes: 'Creates a blast of air on hit that pushes enemies and the thrower away with tiered knockback.',
  },
];

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
    modelPath: legacy.modelPath ?? null,
    preview: legacy.preview || undefined,
    stats: buildStats(weapon, category),
    special: buildSpecial(weapon, legacy.special || {}, category),
  });
});

export const weaponGlobals = RAW_GLOBALS;
export const sampleWeapons = weapons;

