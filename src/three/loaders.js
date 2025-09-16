import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let gltfLoader;
let dracoLoader;
const modelCache = new Map();

function getGLTFLoader() {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader();
    gltfLoader.setCrossOrigin('anonymous');
    gltfLoader.setDRACOLoader(getDracoLoader());
  }
  return gltfLoader;
}

function getDracoLoader() {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  }
  return dracoLoader;
}

export async function loadWeaponModel(src, { useCache = true } = {}) {
  if (!src) {
    return null;
  }

  if (useCache && modelCache.has(src)) {
    return modelCache.get(src).clone();
  }

  const loader = getGLTFLoader();
  const gltf = await loader.loadAsync(src);
  const scene = gltf.scene || gltf.scenes?.[0];

  if (!scene) {
    throw new Error(`GLTF at ${src} did not include a scene.`);
  }

  if (useCache) {
    modelCache.set(src, scene.clone());
  }

  return scene.clone();
}

export function clearModelCache() {
  modelCache.clear();
}
