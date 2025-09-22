import * as THREE from 'https://esm.sh/three@0.160.0';

export const createRenderer = (container) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  const { clientWidth, clientHeight } = container;
  renderer.setSize(clientWidth, clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);
  return renderer;
};
