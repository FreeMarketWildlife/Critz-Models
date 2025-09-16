import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { createRenderer } from './RendererFactory.js';
import { ResourceLoader } from './ResourceLoader.js';

const RARITY_GLOWS = {
  common: 0x7c6cff,
  rare: 0x7df0ff,
  epic: 0xff9af5,
  legendary: 0xffe37d,
  mythic: 0xffb7ff,
};

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.resourceLoader = new ResourceLoader();
    this.animationFrame = null;

    this.stageGroup = new THREE.Group();
    this.currentModel = null;
    this.platform = null;
    this.glowRing = null;
    this.pendingLoad = null;
    this.controls = null;
    this.autoSpinEnabled = true;
    this.baseCameraPosition = new THREE.Vector3(0, 1.1, 3.3);
    this.baseCameraTarget = new THREE.Vector3(0, 0.4, 0);
    this.cameraHomePosition = this.baseCameraPosition.clone();
    this.cameraHomeTarget = this.baseCameraTarget.clone();

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.camera = this.createCamera();
    this.controls = this.createControls();
    this.setupLights();
    this.setupEnvironment();
    this.scene.add(this.stageGroup);

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.start();
  }

  start() {
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  animate() {
    const delta = this.clock.getDelta();
    this.update(delta);
    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  update(delta) {
    if (this.currentModel && this.autoSpinEnabled) {
      this.currentModel.rotation.y += delta * 0.4;
    }

    if (this.glowRing) {
      this.glowRing.rotation.z += delta * 0.2;
    }
  }

  createCamera() {
    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.copy(this.baseCameraPosition);
    camera.lookAt(this.baseCameraTarget);
    return camera;
  }

  createControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.enablePan = false;
    controls.minDistance = 1.4;
    controls.maxDistance = 6;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.enableKeys = false;
    controls.zoomSpeed = 0.8;
    controls.rotateSpeed = 0.6;
    controls.target.copy(this.cameraHomeTarget);
    controls.update();
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.style.touchAction = 'none';
    return controls;
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xffe6ff, 0.4);
    const rimLight = new THREE.DirectionalLight(0xa7c9ff, 1.15);
    rimLight.position.set(-3, 4, 2);
    const fillLight = new THREE.SpotLight(0xffc3f7, 1.25, 20, Math.PI / 4, 0.85, 2);
    fillLight.position.set(2.6, 3.8, 1.4);
    const bounceLight = new THREE.PointLight(0x8cf5ff, 0.6, 6, 2);
    bounceLight.position.set(0, 1.2, 0.8);

    this.scene.add(ambient, rimLight, fillLight, bounceLight);
  }

  setupEnvironment() {
    const platformGeometry = new THREE.CylinderGeometry(1.45, 1.45, 0.12, 48, 1, true);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x20153f,
      emissive: 0x0c0620,
      metalness: 0.28,
      roughness: 0.62,
      transparent: true,
      opacity: 0.95,
    });
    this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
    this.platform.rotation.x = Math.PI / 2;
    this.platform.position.set(0, -0.7, 0);
    this.platform.receiveShadow = false;

    const ringGeometry = new THREE.TorusGeometry(1.55, 0.035, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff9de6,
      transparent: true,
      opacity: 0.65,
    });
    this.glowRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.glowRing.rotation.x = Math.PI / 2;
    this.glowRing.position.y = -0.35;

    this.stageGroup.add(this.platform);
    this.stageGroup.add(this.glowRing);
  }

  async loadWeapon(weapon) {
    if (!weapon) {
      this.disposeCurrentModel();
      this.applyRarityGlow();
      this.pendingLoad = null;
      return;
    }

    const requestToken = { type: 'weapon', id: weapon.id };
    this.pendingLoad = requestToken;

    let model = null;
    if (weapon.modelPath) {
      model = await this.resourceLoader.loadModel(weapon.modelPath);
    }

    if (this.pendingLoad !== requestToken) {
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel();
    }

    this.prepareModel(model, weapon.preview, {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: Math.PI / 4, z: 0 },
      scale: 1.2,
    });

    this.disposeCurrentModel();
    this.currentModel = model;
    this.stageGroup.add(model);

    this.applyRarityGlow(weapon.rarity);
    this.setCameraHome(weapon.preview?.camera || null);
    this.resetView();
  }

  async loadCritter(critter) {
    if (!critter) {
      this.disposeCurrentModel();
      this.applyRarityGlow();
      this.setCameraHome(null);
      this.resetView();
      this.pendingLoad = null;
      return;
    }

    const requestToken = { type: 'critter', id: critter.id };
    this.pendingLoad = requestToken;

    let model = null;
    if (critter.modelPath) {
      model = await this.resourceLoader.loadModel(critter.modelPath);
    }

    if (this.pendingLoad !== requestToken) {
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel();
    }

    this.prepareModel(model, critter.preview, {
      position: { x: 0, y: -0.8, z: 0 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      scale: 1,
    });

    this.disposeCurrentModel();
    this.currentModel = model;
    this.stageGroup.add(model);

    if (critter.preview?.ringColor) {
      this.setGlowRingColor(critter.preview.ringColor);
    } else {
      this.applyRarityGlow();
    }

    this.setCameraHome(critter.preview?.camera || null);
    this.resetView();
  }

  disposeCurrentModel() {
    if (!this.currentModel) return;
    this.stageGroup.remove(this.currentModel);
    this.currentModel.traverse?.((child) => {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose?.());
        } else {
          child.material.dispose?.();
        }
      }
      if (child.geometry) {
        child.geometry.dispose?.();
      }
    });
    this.currentModel = null;
  }

  applyRarityGlow(rarity = 'common') {
    const color = RARITY_GLOWS[rarity] ?? RARITY_GLOWS.common;
    if (this.glowRing) {
      this.glowRing.material.color = new THREE.Color(color);
    }
  }

  setGlowRingColor(color) {
    if (!this.glowRing || color == null) return;
    this.glowRing.material.color = new THREE.Color(color);
  }

  prepareModel(model, preview = {}, defaults = {}) {
    const position = this.resolveVector(preview.position, defaults.position || { x: 0, y: 0, z: 0 });
    model.position.set(position.x, position.y, position.z);

    const rotation = this.resolveVector(preview.rotation, defaults.rotation || { x: 0, y: 0, z: 0 });
    model.rotation.set(rotation.x, rotation.y, rotation.z);

    const scale = preview.scale ?? defaults.scale ?? 1;
    if (typeof scale === 'number') {
      model.scale.setScalar(scale);
    } else if (Array.isArray(scale)) {
      const [x = 1, y = 1, z = 1] = scale;
      model.scale.set(x, y, z);
    } else if (typeof scale === 'object') {
      model.scale.set(scale.x ?? 1, scale.y ?? 1, scale.z ?? 1);
    }
  }

  resolveVector(value, fallback = { x: 0, y: 0, z: 0 }) {
    const fallbackVector = fallback instanceof THREE.Vector3 ? { x: fallback.x, y: fallback.y, z: fallback.z } : fallback;

    if (value instanceof THREE.Vector3) {
      return { x: value.x, y: value.y, z: value.z };
    }

    if (Array.isArray(value)) {
      return {
        x: value[0] ?? fallbackVector.x,
        y: value[1] ?? fallbackVector.y,
        z: value[2] ?? fallbackVector.z,
      };
    }

    if (typeof value === 'object' && value !== null) {
      return {
        x: value.x ?? fallbackVector.x,
        y: value.y ?? fallbackVector.y,
        z: value.z ?? fallbackVector.z,
      };
    }

    return { ...fallbackVector };
  }

  setCameraHome(preset) {
    if (preset && typeof preset === 'object') {
      const position = this.resolveVector(preset.position, this.baseCameraPosition);
      const target = this.resolveVector(preset.target, this.baseCameraTarget);
      this.cameraHomePosition.set(position.x, position.y, position.z);
      this.cameraHomeTarget.set(target.x, target.y, target.z);
    } else {
      this.cameraHomePosition.copy(this.baseCameraPosition);
      this.cameraHomeTarget.copy(this.baseCameraTarget);
    }
  }

  setAutoSpin(enabled) {
    this.autoSpinEnabled = Boolean(enabled);
  }

  resetView() {
    if (!this.camera || !this.controls) return;
    this.camera.position.copy(this.cameraHomePosition);
    this.controls.target.copy(this.cameraHomeTarget);
    this.controls.update();
  }

  createPlaceholderModel() {
    const geometry = new THREE.TorusKnotGeometry(0.65, 0.18, 128, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff9dce,
      emissive: 0x2b0f35,
      metalness: 0.28,
      roughness: 0.28,
      emissiveIntensity: 0.6,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    return mesh;
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    const { clientWidth, clientHeight } = this.container;
    this.renderer.setSize(clientWidth, clientHeight, false);
    this.camera.aspect = clientWidth / Math.max(clientHeight, 1);
    this.camera.updateProjectionMatrix();
    this.controls?.update();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
    this.scene.traverse((object) => {
      if (object.isMesh) {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose?.());
        } else {
          object.material?.dispose?.();
        }
      }
    });
    this.renderer?.dispose?.();
    this.controls?.dispose?.();
  }
}
