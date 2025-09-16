const basePath = 'assets/models/critters';

export const sampleCritters = [
  {
    id: 'critter-forest-guardian',
    name: 'Forest Guardian',
    modelPath: `${basePath}/forest-guardian.glb`,
    tags: ['warden', 'druidic', 'ancient'],
    preview: {
      scale: 1.2,
      rotation: [0, Math.PI, 0],
      autoCenter: true,
      cameraDistanceMultiplier: 2.4,
    },
  },
  {
    id: 'critter-ember-fawn',
    name: 'Ember Fawn',
    modelPath: `${basePath}/ember-fawn.glb`,
    tags: ['quadruped', 'fire', 'swift'],
    preview: {
      scale: 1.4,
      rotation: [0, Math.PI, 0],
      autoCenter: true,
      cameraDistanceMultiplier: 2.8,
    },
  },
  {
    id: 'critter-tide-sage',
    name: 'Tide Sage',
    modelPath: `${basePath}/tide-sage.glb`,
    tags: ['mystic', 'water', 'sage'],
    preview: {
      scale: 1.1,
      rotation: [0, Math.PI, 0],
      autoCenter: true,
      cameraDistanceMultiplier: 2.3,
    },
  },
  {
    id: 'critter-sky-runner',
    name: 'Sky Runner',
    modelPath: `${basePath}/sky-runner.glb`,
    tags: ['aviator', 'agile', 'winged'],
    preview: {
      scale: 1.15,
      rotation: [0, Math.PI, 0],
      autoCenter: true,
      cameraDistanceMultiplier: 2.6,
    },
  },
  {
    id: 'critter-cavern-brute',
    name: 'Cavern Brute',
    modelPath: `${basePath}/cavern-brute.glb`,
    tags: ['tank', 'stone', 'bruiser'],
    preview: {
      scale: 1.05,
      rotation: [0, Math.PI, 0],
      autoCenter: true,
      cameraDistanceMultiplier: 3.1,
    },
  },
];
