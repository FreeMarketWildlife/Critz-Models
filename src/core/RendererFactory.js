import * as THREE from 'https://esm.sh/three@0.160.0';

export const createRenderer = (container) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
  renderer.setPixelRatio(pixelRatio);
  const { clientWidth, clientHeight } = container;
  renderer.setSize(clientWidth, clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);
  return renderer;
};
