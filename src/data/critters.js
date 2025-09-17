const createAnimation = (file) => {
  const base = file.replace(/\.glb$/i, '');
  const cleaned = base.replace(/^TH_(Frog|Lizard)_/i, '');
  const name = cleaned
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');

  const id = base
    .replace(/^TH_/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  return {
    id,
    name,
    path: `assets/models/critters/animations/${file}`,
  };
};

const buildAnimations = (files) => files.map((file) => createAnimation(file));

const frogAnimations = buildAnimations([
  'TH_Frog_Idle.glb',
  'TH_Frog_Wave.glb',
  'TH_Frog_Walk.glb',
  'TH_Frog_Walk_Forward.glb',
  'TH_Frog_Walk_Back.glb',
  'TH_Frog_Walk_Backward.glb',
  'TH_Frog_Run.glb',
  'TH_Frog_Run_Forward.glb',
  'TH_Frog_Hop.glb',
  'TH_Frog_Hop_Forward.glb',
  'TH_Frog_Jump.glb',
  'TH_Frog_Clap.glb',
  'TH_Frog_Finger_Wag.glb',
  'TH_Frog_Frustration.glb',
  'TH_Frog_One_Thumb_Up.glb',
  'TH_Frog_One_Thumb_Down.glb',
  'TH_Frog_Two_Thumbs_Up.glb',
  'TH_Frog_Two_Thumbs_Down.glb',
  'TH_Frog_Victory.glb',
  'TH_Frog_Push_Up.glb',
  'TH_Frog_Sleep.glb',
  'TH_Frog_Sit_01.glb',
  'TH_Frog_Sit_02.glb',
  'TH_Frog_Sit_Raise_Hand_01_A.glb',
  'TH_Frog_Sit_Raise_Hand_01_B.glb',
  'TH_Frog_Sit_Raise_Hand_02_A.glb',
  'TH_Frog_Sit_Raise_Hand_02_B.glb',
  'TH_Frog_Turn_Left_90.glb',
  'TH_Frog_Turn_Right_90.glb',
  'TH_Frog_Take_Hit.glb',
  'TH_Frog_Strike.glb',
  'TH_Frog_Sad_Walk.glb',
  'TH_Frog_Sad_Walk_Forward.glb',
  'TH_Frog_Death.glb',
]);

const lizardAnimations = buildAnimations([
  'TH_Lizard_Idle.glb',
  'TH_Lizard_Wave.glb',
  'TH_Lizard_Walk.glb',
  'TH_Lizard_Walk_Forward.glb',
  'TH_Lizard_Walk_Back.glb',
  'TH_Lizard_Walk_Backward.glb',
  'TH_Lizard_Run.glb',
  'TH_Lizard_Run_Forward.glb',
  'TH_Lizard_Hop.glb',
  'TH_Lizard_Hop_Forward.glb',
  'TH_Lizard_Jump.glb',
  'TH_Lizard_Clap.glb',
  'TH_Lizard_Finger_Wag.glb',
  'TH_Lizard_Frustration.glb',
  'TH_Lizard_One_Thumb_Up.glb',
  'TH_Lizard_One_Thumb_Down.glb',
  'TH_Lizard_Two_Thumbs_Up.glb',
  'TH_Lizard_Two_Thumbs_Down.glb',
  'TH_Lizard_Victory.glb',
  'TH_Lizard_Push_Up.glb',
  'TH_Lizard_Sleep.glb',
  'TH_Lizard_Sit_01.glb',
  'TH_Lizard_Sit_02.glb',
  'TH_Lizard_Sit_Raise_Hand_01_A.glb',
  'TH_Lizard_Sit_Raise_Hand_01_B.glb',
  'TH_Lizard_Sit_Raise_Hand_02_A.glb',
  'TH_Lizard_Sit_Raise_Hand_02_B.glb',
  'TH_Lizard_Turn_Left_90.glb',
  'TH_Lizard_Turn_Right_90.glb',
  'TH_Lizard_Take_Hit.glb',
  'TH_Lizard_Strike.glb',
  'TH_Lizard_Sad_Walk.glb',
  'TH_Lizard_Sad_Walk_Forward.glb',
  'TH_Lizard_Death.glb',
]);

export const critters = [
  {
    id: 'frog',
    name: 'Frog',
    modelPath: 'assets/models/critters/models/SK_TH_Frog_Rigged_01.glb',
    defaultAnimationId: 'frog-idle',
    animations: frogAnimations,
  },
  {
    id: 'lizard',
    name: 'Lizard',
    modelPath: 'assets/models/critters/models/SK_TH_Lizard_Rigged_01.glb',
    defaultAnimationId: 'lizard-idle',
    animations: lizardAnimations,
  },
];

