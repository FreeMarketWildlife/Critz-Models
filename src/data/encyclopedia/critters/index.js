export { critters } from './entries.js';

export const critterTemplate = {
  id: '',
  name: '',
  modelPath: '',
  scale: 1,
  offset: { x: 0, y: 0, z: 0 },
  defaultAnimationId: '',
  stats: {
    health: 0,
    speed: 0,
    stamina: 0,
    bonus: '',
  },
  animations: [
    {
      id: '',
      label: '',
      path: '',
      loop: 'loop',
    },
  ],
};
