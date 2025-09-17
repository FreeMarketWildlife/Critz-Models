const basePath = 'assets/models/Critters';

export const critters = [
  {
    id: 'ember-lynx',
    name: 'Ember Lynx',
    modelPath: `${basePath}/ember-lynx.glb`,
    preview: {
      scale: 1.1,
      rotation: { x: 0, y: Math.PI, z: 0 },
      position: { x: 0, y: -0.95, z: 0 },
      focus: { x: 0, y: 0.9, z: 0 },
      spinSpeed: 0.25,
      glowColor: 0xffb27b,
    },
  },
  {
    id: 'mossback-tortoise',
    name: 'Mossback Tortoise',
    modelPath: `${basePath}/mossback-tortoise.glb`,
    preview: {
      scale: 1.2,
      rotation: { x: 0, y: Math.PI * 0.5, z: 0 },
      position: { x: 0, y: -0.85, z: 0 },
      focus: { x: 0, y: 0.6, z: 0 },
      spinSpeed: 0.18,
      glowColor: 0x7cc86f,
    },
  },
  {
    id: 'skywhisper-owl',
    name: 'Skywhisper Owl',
    modelPath: `${basePath}/skywhisper-owl.glb`,
    preview: {
      scale: 1.05,
      rotation: { x: 0, y: -Math.PI * 0.2, z: 0 },
      position: { x: 0, y: -0.6, z: 0 },
      focus: { x: 0, y: 1.35, z: 0 },
      spinSpeed: 0.32,
      glowColor: 0x7df0ff,
    },
  },
  {
    id: 'thunderfen-toad',
    name: 'Thunderfen Toad',
    modelPath: `${basePath}/thunderfen-toad.glb`,
    preview: {
      scale: 1.15,
      rotation: { x: 0, y: Math.PI * 0.35, z: 0 },
      position: { x: 0, y: -0.78, z: 0 },
      focus: { x: 0, y: 0.7, z: 0 },
      spinSpeed: 0.22,
      glowColor: 0xb58cff,
    },
  },
  {
    id: 'opal-ridge-ram',
    name: 'Opal Ridge Ram',
    modelPath: `${basePath}/opal-ridge-ram.glb`,
    preview: {
      scale: 1.08,
      rotation: { x: 0, y: Math.PI * 0.75, z: 0 },
      position: { x: 0, y: -0.92, z: 0 },
      focus: { x: 0, y: 1.05, z: 0 },
      spinSpeed: 0.28,
      glowColor: 0xffe37d,
    },
  },
  {
    id: 'starlit-otter',
    name: 'Starlit Otter',
    modelPath: `${basePath}/starlit-otter.glb`,
    preview: {
      scale: 1.12,
      rotation: { x: 0, y: Math.PI, z: 0 },
      position: { x: 0, y: -0.88, z: 0 },
      focus: { x: 0, y: 0.75, z: 0 },
      spinSpeed: 0.3,
      glowColor: 0x9cd5ff,
    },
  },
];

export const findCritterById = (id) => critters.find((critter) => critter.id === id) || null;
