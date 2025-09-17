export const CRITTERS = [
  {
    id: 'frog',
    name: 'Frog',
    accentColor: '#7cc86f',
    modelPath: 'assets/models/critters/models/SK_TH_Frog_Rigged_01.glb',
    defaultAnimationId: 'idle',
    animations: [
      {
        id: 'idle',
        name: 'Idle',
        path: 'assets/models/critters/animations/TH_Frog_Idle.glb',
      },
      {
        id: 'run-forward',
        name: 'Run Forward',
        path: 'assets/models/critters/animations/TH_Frog_Run_Forward.glb',
      },
      {
        id: 'walk-forward',
        name: 'Walk Forward',
        path: 'assets/models/critters/animations/TH_Frog_Walk_Forward.glb',
      },
      {
        id: 'jump',
        name: 'Jump',
        path: 'assets/models/critters/animations/TH_Frog_Jump.glb',
      },
      {
        id: 'clap',
        name: 'Clap',
        path: 'assets/models/critters/animations/TH_Frog_Clap.glb',
      },
      {
        id: 'wave',
        name: 'Wave',
        path: 'assets/models/critters/animations/TH_Frog_Wave.glb',
      },
      {
        id: 'victory',
        name: 'Victory',
        path: 'assets/models/critters/animations/TH_Frog_Victory.glb',
      },
      {
        id: 'frustration',
        name: 'Frustration',
        path: 'assets/models/critters/animations/TH_Frog_Frustration.glb',
      },
    ],
  },
  {
    id: 'lizard',
    name: 'Lizard',
    accentColor: '#5aa9c9',
    modelPath: 'assets/models/critters/models/SK_TH_Lizard_Rigged_01.glb',
    defaultAnimationId: 'idle',
    animations: [
      {
        id: 'idle',
        name: 'Idle',
        path: 'assets/models/critters/animations/TH_Lizard_Idle.glb',
      },
      {
        id: 'run-forward',
        name: 'Run Forward',
        path: 'assets/models/critters/animations/TH_Lizard_Run_Forward.glb',
      },
      {
        id: 'walk-forward',
        name: 'Walk Forward',
        path: 'assets/models/critters/animations/TH_Lizard_Walk_Forward.glb',
      },
      {
        id: 'jump',
        name: 'Jump',
        path: 'assets/models/critters/animations/TH_Lizard_Jump.glb',
      },
      {
        id: 'clap',
        name: 'Clap',
        path: 'assets/models/critters/animations/TH_Lizard_Clap.glb',
      },
      {
        id: 'wave',
        name: 'Wave',
        path: 'assets/models/critters/animations/TH_Lizard_Wave.glb',
      },
      {
        id: 'victory',
        name: 'Victory',
        path: 'assets/models/critters/animations/TH_Lizard_Victory.glb',
      },
      {
        id: 'frustration',
        name: 'Frustration',
        path: 'assets/models/critters/animations/TH_Lizard_Frustration.glb',
      },
    ],
  },
];

export const CRITTER_MAP = new Map(CRITTERS.map((critter) => [critter.id, critter]));

export const getCritterById = (id) => CRITTER_MAP.get(id) ?? null;
