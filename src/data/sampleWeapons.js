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

const RAW_WEAPONS = [];

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

const CATEGORY_PLACEHOLDER_MODELS = {
  primary: 'assets/models/primary/placeholder-primary.gltf',
  secondary: 'assets/models/secondary/placeholder-secondary.gltf',
  melee: 'assets/models/melee/placeholder-melee.gltf',
  utility: 'assets/models/utility/placeholder-utility.gltf',
};

const weapons = RAW_WEAPONS.map((weapon) => {
  const category = weapon.category.toLowerCase();
  const legacy = getLegacyDetails(weapon.name) || {};
  const placeholderModelPath = CATEGORY_PLACEHOLDER_MODELS[category] ?? null;

  return normalizeWeapon({
    id: slugify(weapon.name),
    name: weapon.name,
    category,
    rarity: legacy.rarity || FALLBACK_RARITY_BY_CATEGORY[category] || 'common',
    description: legacy.description || weapon.notes || 'Specification pending.',
    modelPath: legacy.modelPath ?? placeholderModelPath,
    preview: legacy.preview || undefined,
    stats: buildStats(weapon, category),
    special: buildSpecial(weapon, legacy.special || {}, category),
  });
});

export const weaponGlobals = RAW_GLOBALS;
export const sampleWeapons = weapons;

