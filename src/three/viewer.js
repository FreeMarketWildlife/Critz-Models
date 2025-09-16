import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DirectionalLight,
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  TorusKnotGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadWeaponModel } from './loaders.js';
import { eventBus } from '../utils/eventBus.js';

export function initializeViewer(container, statusElement) {
  const scene = new Scene();
  scene.background = null;
  scene.fog = null;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const camera = new PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 1.3, 4.2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 2.1;
  controls.maxDistance = 6;
  controls.target.set(0, 1, 0);

  const ambientLight = new AmbientLight(0xf3f0ff, 0.6);
  const rimLight = new DirectionalLight(0xffe5c3, 0.9);
  rimLight.position.set(3.5, 5, 4.5);
  const fillLight = new DirectionalLight(0x77c8ff, 0.7);
  fillLight.position.set(-4, 2.5, -3.5);

  scene.add(ambientLight, rimLight, fillLight);

  const platform = createPlatform();
  scene.add(platform);

  const placeholder = createPlaceholder();
  scene.add(placeholder);

  let activeModel = null;
  let currentWeaponId = null;
  const statusMessageNode = statusElement?.querySelector('p') ?? null;

  function setStatus(message) {
    if (statusMessageNode) {
      statusMessageNode.textContent = message;
    }
  }

  async function handleWeaponChange({ weaponId, weapon }) {
    if (weaponId === currentWeaponId) {
      return;
    }

    currentWeaponId = weaponId;

    if (activeModel) {
      scene.remove(activeModel);
      disposeModel(activeModel);
      activeModel = null;
    }

    if (!weapon) {
      placeholder.visible = true;
      setStatus('Select a weapon to manifest its echo.');
      return;
    }

    const { model } = weapon;
    if (!model || !model.src) {
      placeholder.visible = true;
      setStatus('No 3D model assigned yet.');
      return;
    }

    placeholder.visible = false;
    setStatus(`Summoning ${weapon.name}...`);

    try {
      const rawModel = await loadWeaponModel(model.src);
      const preparedModel = configureModel(rawModel, model);
      scene.add(preparedModel);
      activeModel = preparedModel;
      setStatus(`${weapon.name}`);
    } catch (error) {
      console.error(error);
      placeholder.visible = true;
      setStatus('Manifestation failed. Check the model reference.');
    }
  }

  function resize() {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);

  eventBus.on('weapon:changed', handleWeaponChange);

  resize();
  setStatus('Select a weapon to manifest its echo.');

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    placeholder.rotation.y += 0.004;
    platform.rotation.z += 0.0008;
    if (activeModel) {
      activeModel.rotation.y += 0.0015;
    }
    renderer.render(scene, camera);
  }

  animate();

  return {
    dispose: () => {
      window.removeEventListener('resize', resize);
      renderer.dispose();
      disposeModel(activeModel);
      disposeModel(placeholder);
    },
  };
}

function createPlaceholder() {
  const geometry = new TorusKnotGeometry(0.6, 0.15, 220, 32);
  const material = new MeshStandardMaterial({
    color: new Color('#5cc6ff'),
    emissive: new Color('#1b2b3f'),
    metalness: 0.4,
    roughness: 0.2,
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(0, 1, 0);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

function createPlatform() {
  const group = new Group();
  const outer = new Mesh(
    new TorusKnotGeometry(1.2, 0.02, 90, 8, 1, 3),
    new MeshStandardMaterial({
      color: new Color('#332244'),
      emissive: new Color('#120d1b'),
      metalness: 0.3,
      roughness: 0.8,
    }),
  );
  outer.position.set(0, 0.2, 0);

  const inner = new Mesh(
    new TorusKnotGeometry(1.0, 0.01, 60, 8, 1, 2),
    new MeshStandardMaterial({
      color: new Color('#7f57c6'),
      emissive: new Color('#1a0f26'),
      metalness: 0.2,
      roughness: 0.7,
    }),
  );
  inner.position.set(0, 0.19, 0);

  group.add(outer, inner);
  return group;
}

function configureModel(model, config = {}) {
  const target = new Group();
  target.add(model);

  // Center the model so it rotates gracefully around the forge origin.
  const boundingBox = new Box3().setFromObject(model);
  const center = boundingBox.getCenter(new Vector3());
  model.position.sub(center);

  const scale = Array.isArray(config.scale)
    ? new Vector3(...config.scale)
    : new Vector3(1, 1, 1).multiplyScalar(config.scale ?? 1);
  target.scale.copy(scale);

  target.position.set(0, 1, 0);

  if (Array.isArray(config.position)) {
    target.position.set(
      config.position[0] ?? 0,
      config.position[1] ?? 0,
      config.position[2] ?? 0,
    );
  }

  if (Array.isArray(config.rotation)) {
    target.rotation.set(
      config.rotation[0] ?? 0,
      config.rotation[1] ?? 0,
      config.rotation[2] ?? 0,
    );
  }

  return target;
}

function disposeModel(model) {
  if (!model) {
    return;
  }

  model.traverse?.((child) => {
    if (child.isMesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => mat.dispose?.());
      } else {
        child.material?.dispose?.();
      }
    }
  });
}
