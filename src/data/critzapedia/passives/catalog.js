export const PASSIVE_IDS = Object.freeze({
  SHELL: 'shell',
  HASTY: 'hasty',
  HOPPER: 'hopper',
  HYDROPHOBIC: 'hydrophobic',
  STICKY: 'sticky',
  GLIDE: 'glide',
  SPIKY: 'spiky',
  BORROWER: 'borrower',
  FLIGHT: 'flight',
  SWINGER: 'swinger',
  SLITHER: 'slither',
  HEALTH_REGENERATION: 'health-regeneration',
  ROLLER: 'roller',
});

export const passiveAbilities = Object.freeze([
  {
    id: PASSIVE_IDS.SHELL,
    name: 'Shell',
    effect: 'Shell Blocks All Physical Damage',
  },
  {
    id: PASSIVE_IDS.HASTY,
    name: 'Hasty',
    effect: '+25% movement speed while above 50% stamina',
  },
  {
    id: PASSIVE_IDS.HOPPER,
    name: 'Hopper',
    effect: 'Jump Costs No Stamina',
  },
  {
    id: PASSIVE_IDS.HYDROPHOBIC,
    name: 'Hydrophobic',
    effect: 'Sprinting allows you to run on water',
  },
  {
    id: PASSIVE_IDS.STICKY,
    name: 'Sticky',
    effect: 'Hang on walls for 10 stamina per second',
  },
  {
    id: PASSIVE_IDS.GLIDE,
    name: 'Glide',
    effect: 'Hold jump to Glide',
  },
  {
    id: PASSIVE_IDS.SPIKY,
    name: 'Spiky',
    effect: 'Thorns deal 10 Damage',
  },
  {
    id: PASSIVE_IDS.BORROWER,
    name: 'Borrower',
    effect: 'Dig underground tunnels which can be used by Borrowers',
  },
  {
    id: PASSIVE_IDS.FLIGHT,
    name: 'Flight',
    effect: 'Jump to Flap, Flap to Fly, Hold Jump to Glide',
  },
  {
    id: PASSIVE_IDS.SWINGER,
    name: 'Swinger',
    effect: 'Swing on branches & vines by holding & releasing Jump',
  },
  {
    id: PASSIVE_IDS.SLITHER,
    name: 'Slither',
    effect: 'has no legs... or arms for that matter',
  },
  {
    id: PASSIVE_IDS.HEALTH_REGENERATION,
    name: 'Health Regeneration',
    effect: '+1 HP per Second',
  },
  {
    id: PASSIVE_IDS.ROLLER,
    name: 'Roller',
    effect: 'Instead of Sprinting, Ball up & Roll out',
  },
]);

const passiveAbilityIndex = passiveAbilities.reduce((index, passiveAbility) => {
  index[passiveAbility.id] = passiveAbility;
  return index;
}, Object.create(null));

const LEGACY_PASSIVE_BONUS_IDS = Object.freeze({
  'Shell (Shell Blocks All Physical Damage)': PASSIVE_IDS.SHELL,
  'Sprint Boost (+25% movement while above 50% stamina)': PASSIVE_IDS.HASTY,
  'Health Regeneration (+1 health per second).': PASSIVE_IDS.HEALTH_REGENERATION,
  'Burrow (Can create and use underground tunnels.)': PASSIVE_IDS.BORROWER,
  'Thornmail (Melee attacks return back 25% damage dealt, enemy units that touch the thorns will be damaged with 25 physical damage)':
    PASSIVE_IDS.SPIKY,
  'Spike Roll (Invulnerable long roll as a spiky ball that does 10 physical damage)':
    PASSIVE_IDS.ROLLER,
  'Bird Flight (press space bar to flap wings)': PASSIVE_IDS.FLIGHT,
  "Mantis Flight (Mantis does a long jump with flapping it's wings)": PASSIVE_IDS.FLIGHT,
  "Beetle Flight (Beetle opens it's wings to fly a medium distance and takes in more damage in this state)":
    PASSIVE_IDS.FLIGHT,
});

export const critterPassiveIds = Object.freeze({
  frog: PASSIVE_IDS.HOPPER,
  lizard: PASSIVE_IDS.HASTY,
  turtle: PASSIVE_IDS.SHELL,
  'red-eared-slider': PASSIVE_IDS.SHELL,
  anole: PASSIVE_IDS.HASTY,
  tortoise: PASSIVE_IDS.SHELL,
  'painted-turtle': PASSIVE_IDS.SHELL,
  'snapping-turtle': PASSIVE_IDS.SHELL,
  'african-sideneck-turtle': PASSIVE_IDS.SHELL,
  'pancake-tortoise': PASSIVE_IDS.SHELL,
  gecko: PASSIVE_IDS.STICKY,
  basilisk: PASSIVE_IDS.HYDROPHOBIC,
  stinkpot: PASSIVE_IDS.SHELL,
  'eastern-mud-turtle': PASSIVE_IDS.SHELL,
  'pigsnouted-turtle': PASSIVE_IDS.SHELL,
  'snakeneck-turtle': PASSIVE_IDS.SHELL,
  'softshell-turtle': PASSIVE_IDS.SHELL,
  'diamondback-terrapin': PASSIVE_IDS.SHELL,
  'african-dwarf-mud-turtle': PASSIVE_IDS.SHELL,
  'bearded-dragon': PASSIVE_IDS.HASTY,
  draco: PASSIVE_IDS.GLIDE,
  pterosaur: PASSIVE_IDS.FLIGHT,
  velociraptor: PASSIVE_IDS.HASTY,
  dragon: PASSIVE_IDS.FLIGHT,
  kappa: PASSIVE_IDS.HYDROPHOBIC,
  salamander: PASSIVE_IDS.STICKY,
  newt: PASSIVE_IDS.HEALTH_REGENERATION,
  bullfrog: PASSIVE_IDS.HOPPER,
  toad: PASSIVE_IDS.HOPPER,
  'glass-frog': PASSIVE_IDS.STICKY,
  'slender-salamander': PASSIVE_IDS.STICKY,
  'rough-skinned-newt': PASSIVE_IDS.HEALTH_REGENERATION,
  'african-bullfrog': PASSIVE_IDS.HOPPER,
  'fire-bellied-toad': PASSIVE_IDS.HOPPER,
  'poison-dart-frog': PASSIVE_IDS.STICKY,
  'great-crested-newt': PASSIVE_IDS.HEALTH_REGENERATION,
  'black-rain-frog': PASSIVE_IDS.HOPPER,
  'surinam-toad': PASSIVE_IDS.HOPPER,
  'gastric-brooder': PASSIVE_IDS.HOPPER,
  'devil-frog': PASSIVE_IDS.HOPPER,
  'golden-toad': PASSIVE_IDS.HOPPER,
  'jin-chan': PASSIVE_IDS.HOPPER,
  'frog-prince': PASSIVE_IDS.HOPPER,
  mouse: PASSIVE_IDS.HASTY,
  squirrel: PASSIVE_IDS.SWINGER,
  chipmunk: PASSIVE_IDS.SWINGER,
  rabbit: PASSIVE_IDS.HOPPER,
  vole: PASSIVE_IDS.HASTY,
  gopher: PASSIVE_IDS.BORROWER,
  bat: PASSIVE_IDS.FLIGHT,
  weasel: PASSIVE_IDS.HASTY,
  'flying-squirrel': PASSIVE_IDS.GLIDE,
  'sugar-glider': PASSIVE_IDS.GLIDE,
  mole: PASSIVE_IDS.BORROWER,
  'prairie-dog': PASSIVE_IDS.BORROWER,
  ferret: PASSIVE_IDS.HASTY,
  bandicoot: PASSIVE_IDS.HASTY,
  wallaby: PASSIVE_IDS.HOPPER,
  'finger-monkey': PASSIVE_IDS.SWINGER,
  porcupine: PASSIVE_IDS.SPIKY,
  hedgehog: PASSIVE_IDS.ROLLER,
  finch: PASSIVE_IDS.FLIGHT,
  sparrow: PASSIVE_IDS.FLIGHT,
  mantis: PASSIVE_IDS.FLIGHT,
  beetle: PASSIVE_IDS.FLIGHT,
});

export const getPassiveAbility = (passiveId) => {
  if (typeof passiveId !== 'string' || !passiveId.trim()) {
    return null;
  }

  return passiveAbilityIndex[passiveId.trim()] || null;
};

export const getPassiveIdFromLegacyBonus = (bonus) => {
  if (typeof bonus !== 'string') {
    return '';
  }

  return LEGACY_PASSIVE_BONUS_IDS[bonus.trim()] || '';
};

export const getCritterPassiveId = (critter) => {
  if (!critter || typeof critter !== 'object') {
    return '';
  }

  if (typeof critter.passiveId === 'string' && critter.passiveId.trim()) {
    return critter.passiveId.trim();
  }

  if (typeof critter.id === 'string' && critterPassiveIds[critter.id]) {
    return critterPassiveIds[critter.id];
  }

  return getPassiveIdFromLegacyBonus(critter.stats?.bonus);
};

export const applyPassiveAbilityToCritter = (critter) => {
  if (!critter || typeof critter !== 'object') {
    return critter;
  }

  const passiveId = getCritterPassiveId(critter);
  if (!passiveId) {
    return critter;
  }

  return {
    ...critter,
    passiveId,
  };
};
