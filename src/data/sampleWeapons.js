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

const BASE_HEALTH = RAW_GLOBALS.base_health ?? 100;

const rpmToRps = (rpm) => {
  if (rpm === null || rpm === undefined) return null;
  return rpm / 60;
};

const computeShotsToKill = (damage) => {
  if (typeof damage !== 'number' || !Number.isFinite(damage) || damage <= 0) {
    return null;
  }
  return Math.ceil(BASE_HEALTH / damage);
};

const computeTtk = (shotsToKill, rps) => {
  if (typeof shotsToKill !== 'number' || !Number.isFinite(shotsToKill) || shotsToKill <= 0) {
    return null;
  }
  if (typeof rps !== 'number' || !Number.isFinite(rps) || rps <= 0) {
    return null;
  }
  if (shotsToKill === 1) {
    return 0;
  }
  return (shotsToKill - 1) / rps;
};

const defineWeapon = (config) => {
  const { rpm = null, ...rest } = config;
  const damage = typeof rest.damage_body === 'number' ? rest.damage_body : null;
  const rps = rest.rps ?? rpmToRps(rpm);
  const shotsToKill = rest.shots_to_kill_body ?? computeShotsToKill(damage);
  const ttk = rest.ttk_body_s ?? computeTtk(shotsToKill, rps);

  return {
    ...rest,
    rps,
    shots_to_kill_body: shotsToKill,
    ttk_body_s: ttk,
  };
};

const RAW_WEAPONS = [
  defineWeapon({
    name: 'Assault Rifle',
    category: 'Primary',
    damage_body: 10,
    headshot_allowed: false,
    rpm: 500,
    magazine: 20,
    reload_s: 0.5,
    draw_time_s: 0.2,
    range_cm: 300,
    projectile: 'hitscan',
    notes: 'Standard issue rifle tuned for consistent full-auto fire.',
    extra_stats: {
      damage: '10',
      fireMode: 'Full-Auto',
      rpm: '500 RPM',
      ammo: '20 / 100',
      reloadSpeed: '0.5 s',
      drawSpeed: '0.2 s',
      range: '300 cm',
    },
  }),
  defineWeapon({
    name: 'Sniper Rifle',
    category: 'Primary',
    damage_body: 50,
    headshot_allowed: false,
    rpm: 60,
    magazine: 4,
    reload_s: 2,
    draw_time_s: 0.5,
    range_cm: 1000,
    projectile: 'projectile',
    notes: 'Precision rifle built to land high-impact semi-auto shots.',
    extra_stats: {
      damage: '50',
      fireMode: 'Semi-Auto',
      rpm: '60 RPM',
      ammo: '4 / 16',
      reloadSpeed: '2 s',
      drawSpeed: '0.5 s',
      range: '1000 cm',
    },
  }),
  defineWeapon({
    name: 'Rocket Launcher',
    category: 'Primary',
    damage_body: 100,
    headshot_allowed: false,
    rpm: 50,
    magazine: 1,
    reload_s: 1,
    draw_time_s: 0.5,
    range_cm: 300,
    projectile: 'projectile',
    notes: 'Single-shot launcher delivering heavy explosive payloads.',
    extra_stats: {
      damage: '100',
      fireMode: 'Manual',
      rpm: '50 RPM',
      ammo: '1 / 6',
      reloadSpeed: '1 s',
      drawSpeed: '0.5 s',
      range: '300 cm',
    },
  }),
  defineWeapon({
    name: 'Bow',
    category: 'Primary',
    damage_body: 15,
    headshot_allowed: false,
    rpm: 200,
    magazine: 1,
    reload_s: 0.3,
    draw_time_s: 0.2,
    range_cm: 300,
    projectile: 'projectile',
    notes: 'Drawn bow with flexible range and quick follow-up shots.',
    extra_stats: {
      damage: '15',
      fireMode: 'Drawn',
      rpm: '200 RPM',
      ammo: '1 / 30',
      reloadSpeed: '0.3 s',
      drawSpeed: '0.2 s',
      range: '100-300 cm',
    },
  }),
  defineWeapon({
    name: 'Crossbow',
    category: 'Primary',
    damage_body: 30,
    headshot_allowed: false,
    rpm: 120,
    magazine: 1,
    reload_s: 0.5,
    draw_time_s: 0.5,
    range_cm: 200,
    projectile: 'projectile',
    notes: 'Manual crossbow for deliberate, high-impact bolts.',
    extra_stats: {
      damage: '30',
      fireMode: 'Manual',
      rpm: '120 RPM',
      ammo: '1 / 14',
      reloadSpeed: '0.5 s',
      drawSpeed: '0.5 s',
      range: '200 cm',
    },
  }),
  defineWeapon({
    name: 'Wizard Staff',
    category: 'Primary',
    damage_body: 10,
    headshot_allowed: false,
    rpm: 120,
    magazine: 10,
    draw_time_s: 0.5,
    range_cm: 100,
    projectile: 'aoe_pulse',
    overheat: {
      shots_before_overheat: 100,
      cooldown_s: 2,
    },
    notes: 'Channelled staff that unleashes continuous splash fire.',
    extra_stats: {
      damage: '10',
      fireMode: 'Full-Auto Splash',
      rpm: '120 RPM',
      ammo: '10 / 100',
      cooldown: '2 s',
      drawSpeed: '0.5 s',
      range: '100 cm',
    },
  }),
  defineWeapon({
    name: 'Blaster Pistol',
    category: 'Secondary',
    damage_body: 5,
    headshot_allowed: false,
    rpm: 300,
    draw_time_s: 0.1,
    range_cm: 100,
    projectile: 'hitscan',
    overheat: {
      shots_before_overheat: 20,
      cooldown_s: 2,
    },
    notes: 'Compact sidearm built for rapid close-quarters bursts.',
    extra_stats: {
      damage: '5',
      fireMode: '—',
      rpm: '300 RPM',
      overheat: '20 / 100',
      cooldown: '2 s',
      drawSpeed: '0.1 s',
      range: '100 cm',
    },
  }),
  defineWeapon({
    name: 'Slingshot',
    category: 'Secondary',
    damage_body: 5,
    headshot_allowed: false,
    rpm: 150,
    magazine: 1,
    reload_s: 0.4,
    draw_time_s: 0.1,
    range_cm: 100,
    projectile: 'projectile',
    notes: 'Drawn slingshot suited for quick arcing shots.',
    extra_stats: {
      damage: '5',
      fireMode: 'Drawn',
      rpm: '150 RPM',
      ammo: '—',
      reloadSpeed: '0.4 s',
      drawSpeed: '0.1 s',
      range: '50-100 cm',
    },
  }),
  defineWeapon({
    name: 'Splash Blaster',
    category: 'Secondary',
    damage_body: 10,
    headshot_allowed: false,
    rpm: 300,
    magazine: 8,
    reload_s: 0.2,
    draw_time_s: 0.2,
    range_cm: 100,
    projectile: 'projectile',
    notes: 'Semi-auto splash sidearm for tight-area control.',
    extra_stats: {
      damage: '10',
      fireMode: 'Semi-Auto Splash',
      rpm: '300 RPM',
      ammo: '8 / 16',
      reloadSpeed: '0.2 s',
      drawSpeed: '0.2 s',
      range: '100 cm',
    },
  }),
  defineWeapon({
    name: 'Fey Wand',
    category: 'Secondary',
    damage_body: 15,
    headshot_allowed: false,
    rpm: 120,
    draw_time_s: 0.1,
    range_cm: 100,
    projectile: 'aoe_beam',
    overheat: {
      shots_before_overheat: 20,
      cooldown_s: 3,
    },
    notes: 'Continuous splash wand that pressures clustered foes.',
    extra_stats: {
      damage: '15',
      fireMode: 'Fully-Auto Splash',
      rpm: '120 RPM',
      overheat: '20 / 100',
      cooldown: '3 s',
      drawSpeed: '0.1 s',
      range: '100 cm',
    },
  }),
  defineWeapon({
    name: 'Flamethrower',
    category: 'Secondary',
    damage_body: null,
    headshot_allowed: false,
    rpm: 1000,
    draw_time_s: 0.4,
    range_cm: 10,
    projectile: 'continuous_cone',
    overheat: {
      shots_before_overheat: 2,
      cooldown_s: 2,
    },
    notes: 'Close-range flame stream that saturates short corridors.',
    extra_stats: {
      damage: 'Fire (10/s for 3s)',
      fireMode: 'Full-Auto AOE',
      rpm: '1000 RPM',
      overheat: '2 / 100',
      cooldown: '2 s',
      drawSpeed: '0.4 s',
      range: '10 cm',
    },
  }),
  defineWeapon({
    name: 'Hands',
    category: 'Melee',
    damage_body: 3,
    headshot_allowed: false,
    rpm: 300,
    draw_time_s: 0.1,
    range_cm: 2,
    projectile: 'melee',
    notes: 'Bare-knuckle strikes with quick follow-up grapples.',
    extra_stats: {
      damage: '3',
      rpm: '300 RPM',
      stamina: '5 / 15',
      drawSpeed: '0.1 s',
      range: '2 cm',
    },
    special_entries: {
      ability: 'Grapple: Hold on to Enemy',
      abilityCooldown: '5 s',
    },
  }),
  defineWeapon({
    name: 'Knife',
    category: 'Melee',
    damage_body: 15,
    headshot_allowed: false,
    rpm: 120,
    draw_time_s: 0.1,
    range_cm: 2,
    projectile: 'melee',
    notes: 'Lightweight blade built for quick eliminations.',
    extra_stats: {
      damage: '15',
      rpm: '120 RPM',
      stamina: '10 / 5',
      drawSpeed: '0.1 s',
      range: '2 cm',
    },
    special_entries: {
      ability: 'Assassinate: Kill from Behind',
      abilityCooldown: '10 s',
    },
  }),
  defineWeapon({
    name: 'Tomahawk',
    category: 'Melee',
    damage_body: 20,
    headshot_allowed: false,
    rpm: 60,
    draw_time_s: 0.3,
    range_cm: 3,
    projectile: 'melee',
    notes: 'Hefty throwing axe that doubles as a melee finisher.',
    extra_stats: {
      damage: '20',
      rpm: '60 RPM',
      stamina: '15 / 10',
      drawSpeed: '0.3 s',
      range: '3 cm',
    },
    special_entries: {
      ability: 'Throw: Throw Tomahawk (Tomahawks are Able to be Picked Up)',
      abilityCooldown: '0.1 s',
    },
  }),
  defineWeapon({
    name: 'Katana',
    category: 'Melee',
    damage_body: 15,
    headshot_allowed: false,
    rpm: 120,
    draw_time_s: 0.2,
    range_cm: 4,
    projectile: 'melee',
    notes: 'Precision blade favoring swift slashes and deflects.',
    extra_stats: {
      damage: '15',
      rpm: '120 RPM',
      stamina: '10 / 25-100',
      drawSpeed: '0.2 s',
      range: '4 cm',
    },
    special_entries: {
      ability: 'Deflect: Returns Enemy Shots for 1s (Stamina Spent Scales with Hypothetical Damage Dealt; Excludes Arrows)',
      abilityCooldown: '5 s',
    },
  }),
  defineWeapon({
    name: 'Shield',
    category: 'Melee',
    damage_body: 5,
    headshot_allowed: false,
    rpm: 90,
    draw_time_s: 0.5,
    range_cm: 2,
    projectile: 'melee',
    notes: 'Defensive shield capable of staggering bash attacks.',
    extra_stats: {
      damage: '5',
      rpm: '90 RPM',
      stamina: '10 / 30',
      drawSpeed: '0.5 s',
      range: '2 cm',
    },
    special_entries: {
      ability: 'Bash: Knock Back Enemy Units',
      abilityCooldown: '5 s',
    },
  }),
  defineWeapon({
    name: 'Warhammer',
    category: 'Melee',
    damage_body: 30,
    headshot_allowed: false,
    rpm: 60,
    draw_time_s: 1,
    range_cm: 4,
    projectile: 'melee',
    notes: 'Slow but devastating hammer for splash impacts.',
    extra_stats: {
      damage: '30',
      rpm: '60 RPM',
      stamina: '30 / 50 Splash',
      drawSpeed: '1 s',
      range: '4 cm',
    },
    special_entries: {
      ability: 'Ground Pound: Swing the Warhammer at the Ground',
      abilityCooldown: '10 s',
    },
  }),
  defineWeapon({
    name: 'Bo Staff',
    category: 'Melee',
    damage_body: 5,
    headshot_allowed: false,
    rpm: 180,
    draw_time_s: 0.1,
    range_cm: 3,
    projectile: 'melee',
    notes: 'Balanced staff offering sustained defensive control.',
    extra_stats: {
      damage: '5',
      rpm: '180 RPM',
      stamina: '2 / 10',
      drawSpeed: '0.1 s',
      range: '3 cm',
    },
    special_entries: {
      ability: 'Spin: Blows Self & Enemies Back; Disarms Enemy Arrows',
      abilityCooldown: '5 s',
    },
  }),
  defineWeapon({
    name: 'Grenade',
    category: 'Utility',
    damage_body: 50,
    headshot_allowed: false,
    magazine: 2,
    range_cm: 50,
    projectile: 'throwable',
    notes: 'Standard explosive grenade with friendly knockback.',
    extra_stats: {
      damage: '50 Splash',
      deploy: 'Throw',
      capacity: '2',
      range: '50 cm',
    },
    special_entries: {
      info: 'Grenades Push Enemies & Self Back; Grenades Cannot be Cooked',
    },
  }),
  defineWeapon({
    name: 'Smoke Grenade',
    category: 'Utility',
    damage_body: null,
    headshot_allowed: false,
    magazine: 2,
    range_cm: 50,
    projectile: 'throwable',
    notes: 'Smoke canister for quick area denial and cover.',
    extra_stats: {
      deploy: 'Throw',
      capacity: '2',
      range: '50 cm',
    },
    special_entries: {
      info: 'Creates Sphere of Smoke On Hit; Smoke Distinguishes Fire',
    },
  }),
  defineWeapon({
    name: 'Resource Pack',
    category: 'Utility',
    damage_body: null,
    headshot_allowed: false,
    magazine: 4,
    range_cm: 2,
    projectile: 'deployable',
    notes: 'Supply drop that restores reserves for any unit.',
    extra_stats: {
      deploy: 'Drop',
      capacity: '4',
      range: '2 cm',
      restores: '50% Ammo & Health',
    },
    special_entries: {
      info: 'Resource Packs can be picked up by any Unit (Friendly or Enemy)',
    },
  }),
  defineWeapon({
    name: 'Mines',
    category: 'Utility',
    damage_body: 150,
    headshot_allowed: false,
    magazine: 4,
    range_cm: 2,
    projectile: 'deployable',
    notes: 'Proximity mines that punish careless advances.',
    extra_stats: {
      damage: '150 damage',
      deploy: 'Drop',
      capacity: '4',
      range: '2 cm',
    },
    special_entries: {
      info: 'Mines are triggered when an Enemy Unit steps on them, or shoots them (50 health)',
    },
  }),
  defineWeapon({
    name: 'Glider',
    category: 'Utility',
    damage_body: null,
    headshot_allowed: false,
    projectile: 'equipment',
    notes: 'Personal glider enabling controlled forward falls.',
    extra_stats: {
      deploy: 'Hold',
    },
    special_entries: {
      info: 'Units Can Glide by Equipping Glider and Falling, Units will be Forced to Move Forward',
    },
  }),
  defineWeapon({
    name: 'Bottle o’ Gas',
    category: 'Utility',
    damage_body: null,
    headshot_allowed: false,
    magazine: 2,
    range_cm: 50,
    projectile: 'throwable',
    notes: 'Volatile gas bottle that blankets zones in fumes.',
    extra_stats: {
      damage: 'Gas (5/s for 5s)',
      deploy: 'Throw',
      capacity: '2',
      range: '50 cm',
    },
    special_entries: {
      info: 'Create a Pool of Gas on Hit; Gas can be lit on fire by any team to deal damage to the enemy team.',
    },
  }),
  defineWeapon({
    name: 'Bottle o’ Fire',
    category: 'Utility',
    damage_body: null,
    headshot_allowed: false,
    magazine: 2,
    range_cm: 50,
    projectile: 'throwable',
    notes: 'Alchemical fire bottle that spreads persistent flames.',
    extra_stats: {
      damage: 'Fire (10/s for 3s)',
      deploy: 'Throw',
      capacity: '2',
      range: '50 cm',
    },
    special_entries: {
      info: 'Create a Pool of Fire on Hit',
    },
  }),
  defineWeapon({
    name: 'Bottle o’ Lightning',
    category: 'Utility',
    damage_body: null,
    headshot_allowed: false,
    magazine: 2,
    range_cm: 50,
    projectile: 'throwable',
    notes: 'Crackling lightning bottle that paralyzes intruders.',
    extra_stats: {
      effect: 'Lightning (Paralyzes Enemy Units for 0.5s every 1s)',
      deploy: 'Throw',
      capacity: '2',
      range: '50 cm',
    },
    special_entries: {
      info: 'Create a Pool of Electricity on Hit',
    },
  }),
  defineWeapon({
    name: 'Bottle o’ Ice',
    category: 'Utility',
    damage_body: null,
    headshot_allowed: false,
    magazine: 2,
    range_cm: 50,
    projectile: 'throwable',
    notes: 'Icy bottle that reduces traction across the impact zone.',
    extra_stats: {
      effect: 'Ice (All Units Have 50% Less Friction)',
      deploy: 'Throw',
      capacity: '2',
      range: '50 cm',
    },
    special_entries: {
      info: 'Create a Pool of Ice on Hit',
    },
  }),
  defineWeapon({
    name: 'Bottle o’ Air',
    category: 'Utility',
    damage_body: null,
    headshot_allowed: false,
    magazine: 2,
    range_cm: 50,
    projectile: 'throwable',
    notes: 'Compressed air bottle that blasts anything nearby away.',
    extra_stats: {
      deploy: 'Throw',
      capacity: '2',
      range: '50 cm',
    },
    special_entries: {
      info: 'Create a Blast of Air that Pushes Enemies & Self Away',
    },
  }),
];

const LEGACY_DETAILS = new Map();

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

  if (weapon.extra_stats && typeof weapon.extra_stats === 'object') {
    Object.entries(weapon.extra_stats).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      baseStats[key] = value;
    });
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

  if (weapon.special_entries && typeof weapon.special_entries === 'object') {
    Object.entries(weapon.special_entries).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (typeof value === 'string' && value.trim() === '') return;
      special[key] = value;
    });
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

