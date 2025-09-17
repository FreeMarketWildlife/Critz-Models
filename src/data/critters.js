const toTitle = (value) =>
  value
    .split('_')
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');

const normalizeKey = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');

const createAnimations = (speciesId, filePrefix, entries) =>
  entries.map((entry) => {
    const config = typeof entry === 'string' ? { key: entry } : entry;
    const key = config.key;
    const idSuffix = normalizeKey(config.id ?? key);
    const label = config.label ?? toTitle(key);
    const pathKey = config.file ?? key;

    const animation = {
      id: `${speciesId}_${idSuffix}`,
      label,
      path: `assets/models/critters/animations/TH_${filePrefix}_${pathKey}.glb`,
    };

    if (config.loop) {
      animation.loop = config.loop;
    }

    return animation;
  });

const frogAnimationEntries = [
  'Idle',
  'Walk',
  'Walk_Forward',
  'Walk_Back',
  'Walk_Backward',
  'Run',
  'Run_Forward',
  'Hop',
  'Hop_Forward',
  'Jump',
  'Clap',
  'Wave',
  'Victory',
  'Frustration',
  'Sad_Walk',
  'Sad_Walk_Forward',
  'Finger_Wag',
  'One_Thumb_Up',
  'One_Thumb_Down',
  'Two_Thumbs_Up',
  'Two_Thumbs_Down',
  'Sit_01',
  'Sit_02',
  'Sit_Raise_Hand_01_A',
  'Sit_Raise_Hand_01_B',
  'Sit_Raise_Hand_02_A',
  'Sit_Raise_Hand_02_B',
  { key: 'Sleep', loop: 'once' },
  { key: 'Take_Hit', loop: 'once' },
  { key: 'Death', loop: 'once' },
  'Strike',
  'Push_Up',
  'Turn_Left_90',
  'Turn_Right_90',
];

const lizardAnimationEntries = [
  'Idle',
  'Walk',
  'Walk_Forward',
  'Walk_Back',
  'Walk_Backward',
  'Run',
  'Run_Forward',
  'Hop',
  'Hop_Forward',
  'Jump',
  'Clap',
  'Wave',
  'Victory',
  'Frustration',
  'Sad_Walk',
  'Sad_Walk_Forward',
  'Finger_Wag',
  'One_Thumb_Up',
  'One_Thumb_Down',
  'Two_Thumbs_Up',
  'Two_Thumbs_Down',
  'Sit_01',
  'Sit_02',
  'Sit_Raise_Hand_01_A',
  'Sit_Raise_Hand_01_B',
  'Sit_Raise_Hand_02_A',
  'Sit_Raise_Hand_02_B',
  { key: 'Sleep', loop: 'once' },
  { key: 'Take_Hit', loop: 'once' },
  { key: 'Death', loop: 'once' },
  'Strike',
  'Push_Up',
  'Turn_Left_90',
  'Turn_Right_90',
];

export const critters = [
  {
    id: 'frog',
    name: 'Frog',
    modelPath: 'assets/models/critters/models/SK_TH_Frog_Rigged_01.glb',
    scale: 1.15,
    offset: { y: -0.6 },
    defaultAnimationId: 'frog_idle',
    animations: createAnimations('frog', 'Frog', frogAnimationEntries),
  },
  {
    id: 'lizard',
    name: 'Lizard',
    modelPath: 'assets/models/critters/models/SK_TH_Lizard_Rigged_01.glb',
    scale: 1.25,
    offset: { y: -0.6 },
    defaultAnimationId: 'lizard_idle',
    animations: createAnimations('lizard', 'Lizard', lizardAnimationEntries),
  },
];
