const basePath = 'assets/models/critters';

export const sampleCritters = [
  {
    id: 'ember-fox',
    name: 'Ember Fox',
    modelPath: `${basePath}/ember-fox.glb`,
    faction: 'Wildspark',
    blurb:
      'A flame-kissed fox spirit that guides lost travelers with a lantern tail and gentle chirps.',
    preview: {
      scale: 1.05,
      position: { y: -0.45 },
    },
  },
  {
    id: 'marsh-colossus',
    name: 'Marsh Colossus',
    modelPath: `${basePath}/marsh-colossus.glb`,
    faction: 'Fungal Wardens',
    blurb:
      'An ancient guardian grown from peat and luminous spores, sworn to keep the swamps serene.',
    preview: {
      scale: 0.82,
      position: { y: -0.35 },
    },
  },
  {
    id: 'azure-sprite',
    name: 'Azure Sprite',
    modelPath: `${basePath}/azure-sprite.glb`,
    faction: 'Cloudborne Court',
    blurb:
      'A winged trickster who weaves rainbows through thunderheads to celebrate every victory.',
    preview: {
      scale: 1.4,
      position: { y: -0.2 },
    },
  },
  {
    id: 'verdant-brute',
    name: 'Verdant Brute',
    modelPath: `${basePath}/verdant-brute.glb`,
    faction: 'Grove Vanguard',
    blurb:
      'A hulking guardian clad in barkplate armor, channeling living vines as its battle standard.',
    preview: {
      scale: 0.9,
      position: { y: -0.4 },
    },
  },
];
