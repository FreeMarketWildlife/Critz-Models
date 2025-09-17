const basePath = 'assets/models/critters';

export const sampleCritters = [
  {
    id: 'mosslight-warden',
    name: 'Mosslight Warden',
    description: 'An ancient guardian grown from the grove canopy who keeps watch over the glades.',
    modelPath: `${basePath}/mosslight_warden.glb`,
    preview: {
      scale: 1.08,
      position: { x: 0, y: -1.05, z: 0 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      target: { x: 0, y: 1.05, z: 0 },
      glowColor: 0x7cc86f,
    },
  },
  {
    id: 'embertail-scout',
    name: 'Embertail Scout',
    description: 'Fleet-footed skirmisher draped in cindersilk that trails friendly sparks.',
    modelPath: `${basePath}/embertail_scout.glb`,
    preview: {
      scale: 1.02,
      position: { x: 0, y: -0.98, z: 0 },
      rotation: { x: 0, y: Math.PI * 0.85, z: 0 },
      target: { x: 0, y: 1.0, z: 0 },
      glowColor: 0xff9a6b,
    },
  },
  {
    id: 'tideglider-savant',
    name: 'Tideglider Savant',
    description: 'Mystic rider who channels tidal currents to buoy allies through combat.',
    modelPath: `${basePath}/tideglider_savant.glb`,
    preview: {
      scale: 1.15,
      position: { x: 0, y: -1.12, z: 0 },
      rotation: { x: 0, y: Math.PI * 0.75, z: 0 },
      target: { x: 0, y: 1.12, z: 0 },
      glowColor: 0x5aa9c9,
    },
  },
  {
    id: 'thornshell-angler',
    name: 'Thornshell Angler',
    description: 'Placid heavyweight bristling with lantern-thorns that light safe paths.',
    modelPath: `${basePath}/thornshell_angler.glb`,
    preview: {
      scale: 1.2,
      position: { x: 0, y: -1.2, z: 0 },
      rotation: { x: 0, y: Math.PI * 0.65, z: 0 },
      target: { x: 0, y: 0.95, z: 0 },
      glowColor: 0xd3f36b,
    },
  },
  {
    id: 'glimmercap-adept',
    name: 'Glimmercap Adept',
    description: 'Bioluminescent caretaker who sprinkles spores that mend the squad.',
    modelPath: `${basePath}/glimmercap_adept.glb`,
    preview: {
      scale: 0.98,
      position: { x: 0, y: -0.92, z: 0 },
      rotation: { x: 0, y: Math.PI * 1.1, z: 0 },
      target: { x: 0, y: 0.9, z: 0 },
      glowColor: 0xffb7ff,
    },
  },
];
