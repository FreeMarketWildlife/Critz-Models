import { normalizeWeapon } from './weaponSchema.js';

const basePath = 'assets/models';

const weapons = [
  normalizeWeapon({
    id: 'assault-rifle',
    name: 'Assault Rifle',
    category: 'primary',
    rarity: 'rare',
    description:
      'Standard-issue blaster whose arc cartridges twirl into playful sparks. Designed for Guardians that keep the frontline glowing.',
    modelPath: `${basePath}/primary/assault-rifle.glb`,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: '22 / bolt',
      fireRate: '9.5/s',
      magazineSize: '30 cells',
      reloadSpeed: '2.1s',
      range: '32m',
      handling: 78,
      weight: '12 (Speed 88)',
    },
    special: {
      role: 'Mid-range pressure blaster tuned for agile sentinels.',
      teamSafety: 'Sigil-marked shots ghost through allies before striking foes.',
      notes: 'Arc vents chime softly whenever the rifle stabilizes.',
    },
  }),
  normalizeWeapon({
    id: 'sniper-rifle',
    name: 'Sniper Rifle',
    category: 'primary',
    rarity: 'epic',
    description:
      'Lunar lenses fold light into razor threads. Every charged shot paints a comet tail that guides teammates toward the target.',
    modelPath: `${basePath}/primary/sniper-rifle.glb`,
    preview: {
      scale: 1.12,
    },
    stats: {
      damage: '96 / bolt',
      fireRate: '0.9/s',
      magazineSize: '5 cells',
      reloadSpeed: '3.4s',
      range: '140m',
      scopeStability: 92,
      handling: 62,
      weight: '18 (Speed 82)',
    },
    special: {
      role: 'Long sightline eliminator channeling moonlight rails.',
      teamSafety: 'Bolts detune harmlessly if they would graze a teammate.',
      notes: 'Critical hits leave a shimmering trail that allies can follow.',
    },
  }),
  normalizeWeapon({
    id: 'rocket-launcher',
    name: 'Rocket Launcher',
    category: 'primary',
    rarity: 'legendary',
    description:
      'An oversized wand that hurls crystalline comets. Its rockets bloom into pastel novas that clear bunkered foes.',
    modelPath: `${basePath}/primary/rocket-launcher.glb`,
    preview: {
      scale: 1.18,
    },
    stats: {
      damage: '140 burst',
      fireRate: '0.5/s',
      magazineSize: '1 shell',
      reloadSpeed: '3.8s',
      blastRadius: '6.5m',
      range: '48m',
      handling: 48,
      weight: '24 (Speed 76)',
    },
    special: {
      role: 'Siege solution for clustered threats and fortifications.',
      teamSafety: 'Ward sigils convert near-allied blasts into harmless gusts.',
      synergy: 'Ignites bottled gas into enemy-only fire cyclones.',
    },
  }),
  normalizeWeapon({
    id: 'bow',
    name: 'Bow',
    category: 'primary',
    rarity: 'uncommon',
    description:
      'A whisperwood bow whose string hums with sprite laughter. The longer it charges, the brighter the arc arrow gleams.',
    modelPath: `${basePath}/primary/bow.glb`,
    preview: {
      scale: 1.08,
    },
    stats: {
      damage: '74 charged',
      drawSpeed: '1.3s',
      chargeTime: '0.7s',
      capacity: '24 arrows',
      range: '60m',
      projectileVelocity: '78 m/s',
      handling: 84,
      weight: '8 (Speed 92)',
    },
    special: {
      role: 'Precision arc-silk bow rewarding patient rhythm.',
      synergy: 'Bolts prime bottled gas without igniting until an ally triggers it.',
      notes: 'Guiding sprites gently curve the final arrow toward marked enemies.',
    },
  }),
  normalizeWeapon({
    id: 'crossbow',
    name: 'Crossbow',
    category: 'primary',
    rarity: 'rare',
    description:
      'Quiet rune-loaded crossbow built for stealth sorties. Each bolt blooms into glitter that tracks moving enemies.',
    modelPath: `${basePath}/primary/crossbow.glb`,
    preview: {
      scale: 1.04,
    },
    stats: {
      damage: '88 / bolt',
      fireRate: '1.4/s',
      reloadSpeed: '2.6s',
      magazineSize: '1 bolt',
      projectileVelocity: '96 m/s',
      range: '54m',
      handling: 72,
      weight: '10 (Speed 90)',
    },
    special: {
      role: 'Silent pick-off tool ideal for coordinated ambushes.',
      teamSafety: 'Bolts phase harmlessly through teammates while recalling.',
      notes: 'Reloading hums a lullaby that calms recoil sway.',
    },
  }),
  normalizeWeapon({
    id: 'wizard-staff',
    name: 'Wizard Staff',
    category: 'primary',
    rarity: 'epic',
    description:
      'Channeling focus crowned with floating runes. Sustained fire spins shimmering orbits around the caster.',
    modelPath: `${basePath}/primary/wizard-staff.glb`,
    preview: {
      scale: 1.16,
    },
    stats: {
      damage: '32 / arc',
      fireRate: '4.6/s',
      heatCapacity: '120 mana',
      cooldownRate: '26/s',
      overheatPenalty: '2.5s',
      range: '36m',
      handling: 80,
      weight: '14 (Speed 86)',
    },
    special: {
      role: 'Sustained beam perfect for stripping shields and locking lanes.',
      synergy: 'Channel above bottled gas to preheat flames for allies.',
      notes: 'Vent ports release miniature constellations while cooling.',
    },
  }),
  normalizeWeapon({
    id: 'blaster-pistol',
    name: 'Blaster Pistol',
    category: 'secondary',
    rarity: 'uncommon',
    description:
      'Pocket-sized star emitter that chirps when it is eager to fire. Trusty companion for explorers and duelists alike.',
    modelPath: `${basePath}/secondary/blaster-pistol.glb`,
    preview: {
      scale: 0.92,
    },
    stats: {
      damage: '28 / spark',
      fireRate: '5.4/s',
      heatCapacity: '90 mana',
      cooldownRate: '32/s',
      overheatPenalty: '1.6s',
      range: '22m',
      handling: 88,
      weight: '6 (Speed 94)',
    },
    special: {
      role: 'Reliable finisher that keeps pressure when primaries rest.',
      teamSafety: 'Ricochets fizzle into glitter before reaching allies.',
      notes: 'Quick vents whistle a friendly tune while cooling.',
    },
  }),
  normalizeWeapon({
    id: 'splash-blaster',
    name: 'Splash Blaster',
    category: 'secondary',
    rarity: 'rare',
    description:
      'A bubbly launcher that paints foes with candy-colored ether. Splash zones linger briefly for team follow-ups.',
    modelPath: `${basePath}/secondary/splash-blaster.glb`,
    preview: {
      scale: 0.98,
    },
    stats: {
      damage: '38 / burst',
      fireRate: '2.3/s',
      magazineSize: '8 vials',
      reloadSpeed: '2.2s',
      splashRadius: '3.6m',
      range: '16m',
      handling: 74,
      weight: '8 (Speed 92)',
    },
    special: {
      role: 'Crowd softener that marks targets for allies to pounce.',
      teamSafety: 'Splash coats teammates in harmless shimmer for visibility.',
      synergy: 'Primes bottled lightning for longer paralysis.',
    },
  }),
  normalizeWeapon({
    id: 'slingshot',
    name: 'Slingshot',
    category: 'secondary',
    rarity: 'common',
    description:
      'Feywood frame that flicks pebble comets with giddy accuracy. Mischievous but dependable.',
    modelPath: `${basePath}/secondary/slingshot.glb`,
    preview: {
      scale: 0.85,
    },
    stats: {
      damage: '24 / pebble',
      fireRate: '3.9/s',
      reloadSpeed: '1.1s',
      pouchCapacity: '12 shots',
      projectileVelocity: '48 m/s',
      range: '20m',
      handling: 96,
      weight: '2 (Speed 98)',
    },
    special: {
      role: 'Trickster tool perfect for tagging distracted foes.',
      notes: 'Pebbles burst into glitter that reveals cloaked enemies briefly.',
    },
  }),
  normalizeWeapon({
    id: 'fey-wand',
    name: 'Fey Wand',
    category: 'secondary',
    rarity: 'rare',
    description:
      'A delicate wand crowned with fluttering wings. Each beam leaves a trail of stardust that pacifies aggressors.',
    modelPath: `${basePath}/secondary/fey-wand.glb`,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: '34 / charm',
      fireRate: '3.2/s',
      heatCapacity: '60 mana',
      cooldownRate: '24/s',
      overheatPenalty: '1.8s',
      range: '18m',
      handling: 90,
      weight: '4 (Speed 96)',
    },
    special: {
      role: 'Support sidearm that softens pushes with gentle slows.',
      synergy: 'Charm bolts enhance control over bottled ice slicks.',
      notes: 'Overheating releases calming moth familiars while cooling.',
    },
  }),
  normalizeWeapon({
    id: 'flamethrow',
    name: 'Flamethrow',
    category: 'secondary',
    rarity: 'epic',
    description:
      'Compact flame harp that sings when held close. Ideal for clearing tunnels with a wave of warm light.',
    modelPath: `${basePath}/secondary/flamethrow.glb`,
    preview: {
      scale: 1,
    },
    stats: {
      damage: '18 / tick',
      fireRate: '8 ticks/s',
      fuelCapacity: '45 units',
      burnDuration: '3.5s',
      range: '12m',
      handling: 68,
      weight: '12 (Speed 88)',
    },
    special: {
      role: 'Close-range lane clearer with soft recoil.',
      synergy: 'Ignites bottled gas into enemy-only firestorms.',
      teamSafety: 'Flame wards wrap allies, preventing friendly burns.',
    },
  }),
  normalizeWeapon({
    id: 'fists',
    name: 'Fists',
    category: 'melee',
    rarity: 'common',
    description:
      'Bare-knuckle bravado channeled through crystalline knuckle dusters. Every punch leaves sparkly heart-shaped imprints.',
    modelPath: `${basePath}/melee/fists.glb`,
    preview: {
      scale: 0.9,
    },
    stats: {
      damage: '16 / combo',
      attackSpeed: 'Fast',
      staminaCost: 8,
      abilityCooldown: '12s',
      weight: '0 (Speed 100)',
    },
    special: {
      ability: 'Grapple pulls a target forward and roots them briefly.',
      notes: 'Grapples break enemy guard while sparing teammates.',
    },
  }),
  normalizeWeapon({
    id: 'knife',
    name: 'Knife',
    category: 'melee',
    rarity: 'rare',
    description:
      'A moonlit dagger balanced for twirling trickery. Perfect for weaving between foes with a smile.',
    modelPath: `${basePath}/melee/knife.glb`,
    preview: {
      scale: 0.85,
    },
    stats: {
      damage: '28 / strike',
      attackSpeed: 'Very Fast',
      staminaCost: 6,
      abilityCooldown: '8s',
      weight: '2 (Speed 98)',
    },
    special: {
      ability: 'Backstab from behind deals 100 damage instantly.',
      notes: 'A faint chime warns allies when you line up a backstab.',
    },
  }),
  normalizeWeapon({
    id: 'tomahawk',
    name: 'Tomahawk',
    category: 'melee',
    rarity: 'uncommon',
    description:
      'Rune-carved hatchet that loves dramatic spins. Throwing it feels like tossing a returning comet.',
    modelPath: `${basePath}/melee/tomahawk.glb`,
    preview: {
      scale: 1.05,
    },
    stats: {
      damage: '44 / swing',
      attackSpeed: 'Medium',
      staminaCost: 10,
      throwDamage: '60 impact',
      abilityCooldown: '14s',
      weight: '6 (Speed 94)',
    },
    special: {
      ability: 'Throw charges along a line and returns if it meets terrain.',
      notes: 'Friendly passes phase through allies on the way back.',
    },
  }),
  normalizeWeapon({
    id: 'katana',
    name: 'Katana',
    category: 'melee',
    rarity: 'epic',
    description:
      'A prism-edged blade that hums lullabies while drawn. Swings create ribbons of pastel wind.',
    modelPath: `${basePath}/melee/katana.glb`,
    preview: {
      scale: 1.1,
    },
    stats: {
      damage: '32 / cut',
      attackSpeed: 'Fast',
      staminaCost: 12,
      abilityCooldown: '10s',
      weight: '7 (Speed 93)',
    },
    special: {
      ability: 'Deflect converts incoming projectiles into harmless stardust.',
      notes: 'Perfect deflects send a guidance beam toward allies instead of ricochet.',
    },
  }),
  normalizeWeapon({
    id: 'shield',
    name: 'Shield',
    category: 'melee',
    rarity: 'rare',
    description:
      'Tower shield carved from festival floats. Its surface reflects teammates with a wink.',
    modelPath: `${basePath}/melee/shield.glb`,
    preview: {
      scale: 1.08,
    },
    stats: {
      damage: '20 / slam',
      attackSpeed: 'Slow',
      staminaCost: 14,
      blockStrength: 120,
      abilityCooldown: '18s',
      weight: '20 (Speed 80)',
    },
    special: {
      ability: 'Shield Bash emits a concussive wave that knocks enemies back.',
      notes: 'Allies touched by the wave gain a brief guard buff instead of knockback.',
    },
  }),
  normalizeWeapon({
    id: 'warhammer',
    name: 'Warhammer',
    category: 'melee',
    rarity: 'legendary',
    description:
      'Meteor-metal maul that rings like a bell tower. Perfect for dramatic entrances and crater-making finales.',
    modelPath: `${basePath}/melee/warhammer.glb`,
    preview: {
      scale: 1.14,
    },
    stats: {
      damage: '58 / hit',
      attackSpeed: 'Slow',
      staminaCost: 18,
      splashRadius: '4m',
      abilityCooldown: '20s',
      weight: '22 (Speed 78)',
    },
    special: {
      ability: 'Arc Quake slam deals splash damage and suspends enemies briefly.',
      notes: 'Shockwaves lift allies gently instead of launching them.',
    },
  }),
  normalizeWeapon({
    id: 'bo-staff',
    name: 'Bo Staff',
    category: 'melee',
    rarity: 'uncommon',
    description:
      'A twirling staff strung with ribbons that flutter like auroras. Graceful and deceptively protective.',
    modelPath: `${basePath}/melee/bo-staff.glb`,
    preview: {
      scale: 1.12,
    },
    stats: {
      damage: '30 / strike',
      attackSpeed: 'Medium',
      staminaCost: 10,
      abilityCooldown: '15s',
      weight: '9 (Speed 91)',
    },
    special: {
      ability: 'Whirling spin deflects bolts and pushes enemies and wielder back.',
      notes: 'Spin gusts cushion allies, nudging them without harm.',
    },
  }),
  normalizeWeapon({
    id: 'grenade',
    name: 'Grenade',
    category: 'utility',
    rarity: 'rare',
    description:
      'A plush-looking orb stuffed with volatile stars. Toss it and a pastel nova clears the way.',
    modelPath: `${basePath}/utility/grenade.glb`,
    preview: {
      scale: 0.85,
    },
    stats: {
      damage: '120 burst',
      radius: '4.5m',
      fuseTime: '3s',
      cooldown: '25s',
      charges: 2,
      weight: '4 (Speed 96)',
    },
    special: {
      teamSafety: 'Detonations near allies become harmless confetti gusts.',
      synergy: 'Ignites bottled gas instantly for coordinated plays.',
    },
  }),
  normalizeWeapon({
    id: 'smoke-grenade',
    name: 'Smoke Grenade',
    category: 'utility',
    rarity: 'uncommon',
    description:
      'A vial that bursts into lavender fog and sparkling butterflies. Vision denial with a gentle heart.',
    modelPath: `${basePath}/utility/smoke-grenade.glb`,
    preview: {
      scale: 0.82,
    },
    stats: {
      radius: '6m',
      duration: '10s',
      cooldown: '24s',
      charges: 3,
      weight: '4 (Speed 96)',
    },
    special: {
      role: 'Soft cover that also quenches flames on contact.',
      synergy: 'Neutralizes bottle o\' fire pools for safe advances.',
    },
  }),
  normalizeWeapon({
    id: 'resource-pack',
    name: 'Resource Pack',
    category: 'utility',
    rarity: 'rare',
    description:
      'A cheerful satchel that sings as it spills supplies. Allies swear it smells like fresh donuts.',
    modelPath: `${basePath}/utility/resource-pack.glb`,
    preview: {
      scale: 0.95,
    },
    stats: {
      resourceYield: '60 Health / 80 Ammo',
      dropCount: 1,
      cooldown: '45s',
      weight: '8 (Speed 92)',
    },
    special: {
      role: 'Support drop that refreshes squads mid-fight.',
      notes: 'Pack locks to allies so enemies cannot snag it mid-air.',
    },
  }),
  normalizeWeapon({
    id: 'mines',
    name: 'Mines',
    category: 'utility',
    rarity: 'epic',
    description:
      'Chubby rune critters that nap until disturbed. When startled they explode into polite yet potent fireworks.',
    modelPath: `${basePath}/utility/mines.glb`,
    preview: {
      scale: 0.88,
    },
    stats: {
      damage: '200 burst',
      triggerRadius: '2.5m',
      charges: 2,
      cooldown: '30s',
      weight: '10 (Speed 90)',
    },
    special: {
      teamSafety: 'Glyphs render mines intangible to allies and their summons.',
      notes: 'Armed mines glow softly to remind teammates of their spots.',
    },
  }),
  normalizeWeapon({
    id: 'glider',
    name: 'Glider',
    category: 'utility',
    rarity: 'uncommon',
    description:
      'A pair of ribbon wings that bloom when leaping. The breeze sounds like giggling sprites.',
    modelPath: `${basePath}/utility/glider.glb`,
    preview: {
      scale: 1,
    },
    stats: {
      duration: '8s',
      cooldown: '20s',
      handling: 88,
      weight: '5 (Speed 95)',
    },
    special: {
      role: 'Grants stamina-free glides and playful aerial repositioning.',
      notes: 'Draft lifts nearby allies gently instead of pushing them away.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-o-gas',
    name: "Bottle o' Gas",
    category: 'utility',
    rarity: 'rare',
    description:
      'A corked jar of shimmering vapor. Splashes into a glittering haze that eagerly awaits a spark.',
    modelPath: `${basePath}/utility/bottle-gas.glb`,
    preview: {
      scale: 0.78,
    },
    stats: {
      radius: '5m',
      duration: '12s',
      charges: 2,
      weight: '3 (Speed 97)',
    },
    special: {
      synergy: 'Ignite with allied fire or lightning to create enemy-only flames.',
      teamSafety: 'The team that lights the gas is immune to the resulting blaze.',
      notes: 'Shimmering borders highlight the safe path for friends.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-o-fire',
    name: "Bottle o' Fire",
    category: 'utility',
    rarity: 'rare',
    description:
      'A heart-shaped flask swirling with phoenix embers. On impact it blooms into a cheerful bonfire.',
    modelPath: `${basePath}/utility/bottle-fire.glb`,
    preview: {
      scale: 0.78,
    },
    stats: {
      damage: '25 impact + burn',
      burnDuration: '6s',
      radius: '4m',
      cooldown: '28s',
      weight: '3 (Speed 97)',
    },
    special: {
      synergy: 'Ignites bottled gas instantly while shielding allied igniters.',
      notes: 'Fire only tickles teammates, granting them a brief warmth buff.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-o-lighting',
    name: "Bottle o' Lighting",
    category: 'utility',
    rarity: 'epic',
    description:
      'A storm trapped in glass. Shake it and lightning fairies line up eagerly to zap foes.',
    modelPath: `${basePath}/utility/bottle-lighting.glb`,
    preview: {
      scale: 0.78,
    },
    stats: {
      damage: '40 surge',
      radius: '4m',
      paralyzeTime: '2.5s',
      cooldown: '30s',
      weight: '3 (Speed 97)',
    },
    special: {
      synergy: 'Arcs jump farther across enemies chilled by bottled ice.',
      teamSafety: 'Paralysis skips allies entirely.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-o-ice',
    name: "Bottle o' Ice",
    category: 'utility',
    rarity: 'uncommon',
    description:
      'Frosted jar that paints the ground with slick starlight. Enemies dance while allies slide with grace.',
    modelPath: `${basePath}/utility/bottle-ice.glb`,
    preview: {
      scale: 0.78,
    },
    stats: {
      radius: '5m',
      duration: '10s',
      frictionModifier: '0.45x',
      cooldown: '26s',
      weight: '3 (Speed 97)',
    },
    special: {
      role: 'Control zone that slows enemies yet keeps allies nimble.',
      synergy: 'Chilled foes take extra jolts from bottled lightning.',
    },
  }),
  normalizeWeapon({
    id: 'bottle-o-air',
    name: "Bottle o' Air",
    category: 'utility',
    rarity: 'common',
    description:
      'A swirling jar of playful wind sprites. Pop the cork to unleash a delighted woosh.',
    modelPath: `${basePath}/utility/bottle-air.glb`,
    preview: {
      scale: 0.78,
    },
    stats: {
      radius: '3m',
      knockbackForce: '12m push',
      cooldown: '18s',
      charges: 2,
      weight: '3 (Speed 97)',
    },
    special: {
      role: 'Reposition tool that sets up combos and quick escapes.',
      notes: 'Allies caught in the gust receive a gentle boost instead of damage.',
    },
  }),
];

export const sampleWeapons = weapons;
