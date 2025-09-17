const basePath = 'assets/models/critters';

export const sampleCritters = [
  {
    id: 'grove-warden',
    name: 'Grove Warden',
    modelPath: `${basePath}/grove-warden.glb`,
    description: 'Ancient guardian who patrols the glades with patient vigilance.',
    preview: {
      scale: 1.05,
      position: { y: -0.78 },
      rotation: { y: Math.PI },
      camera: {
        position: { x: 0.6, y: 1.4, z: 2.9 },
        target: { x: 0, y: 1.1, z: 0 },
      },
      ringColor: 0x7cc86f,
    },
  },
  {
    id: 'ember-runner',
    name: 'Ember Runner',
    modelPath: `${basePath}/ember-runner.glb`,
    description: 'Fleet messenger cloaked in embers who never scorches the forest floor.',
    preview: {
      scale: 1.02,
      position: { y: -0.82 },
      rotation: { y: Math.PI * 0.85 },
      camera: {
        position: { x: -0.4, y: 1.3, z: 3.1 },
        target: { x: 0, y: 1, z: 0 },
      },
      ringColor: 0xffa45f,
    },
  },
  {
    id: 'tidal-mystic',
    name: 'Tidal Mystic',
    modelPath: `${basePath}/tidal-mystic.glb`,
    description: 'Wavecalling healer who channels the tides into protective veils.',
    preview: {
      scale: 1,
      position: { y: -0.8 },
      rotation: { y: Math.PI * 1.1 },
      camera: {
        position: { x: 0.2, y: 1.5, z: 3.2 },
        target: { x: 0, y: 1.15, z: 0 },
      },
      ringColor: 0x5aa9c9,
    },
  },
];
