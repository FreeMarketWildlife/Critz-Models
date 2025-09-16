import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const createRenderer = (container) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  const { clientWidth, clientHeight } = container;
  renderer.setSize(clientWidth, clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);
  return renderer;
};
