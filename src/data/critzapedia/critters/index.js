export { critters } from './critters.js';

export const createEmptyCritter = () => ({
  id: '',
  name: '',
  description: '',
  modelPath: '',
  scale: 1,
  offset: { x: 0, y: 0, z: 0 },
  defaultAnimationId: '',
  stats: {
    health: null,
    speed: null,
    stamina: null,
    bonus: '',
  },
  animations: [],
  notes: '',
});
