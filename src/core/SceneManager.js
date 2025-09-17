import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { createRenderer } from './RendererFactory.js';
import { ResourceLoader } from './ResourceLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

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
    this.controls = null;

    this.defaultFocus = new THREE.Vector3(0, 0.6, 0);
    this.defaultCameraPosition = new THREE.Vector3(0, 1.1, 3.3);
    this.focusTarget = this.defaultFocus.clone();
    this.autoSpinEnabled = true;
    this.defaultSpinSpeed = 0.4;
    this.currentSpinSpeed = this.defaultSpinSpeed;
    this.modelRequestToken = 0;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.setAttribute('aria-label', 'Critter and gear stage preview');
    this.camera = this.createCamera();
    this.setupLights();
    this.setupEnvironment();
    this.scene.add(this.stageGroup);
    this.controls = this.createControls(this.camera, this.renderer.domElement);

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
      this.currentModel.rotation.y += delta * this.currentSpinSpeed;
    }

    if (this.glowRing) {
      this.glowRing.rotation.z += delta * 0.2;
    }
  }

  createCamera() {
    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.copy(this.defaultCameraPosition);
    camera.lookAt(this.focusTarget);
    return camera;
  }

  createControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 1.4;
    controls.maxDistance = 6;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.copy(this.focusTarget);
    controls.update();
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
    if (!weapon) return;

    await this.loadStageModel({
      id: weapon.id,
      modelPath: weapon.modelPath,
      scale: weapon.preview?.scale ?? 1.2,
      rotation: weapon.preview?.rotation ?? { x: 0, y: Math.PI / 4, z: 0 },
      position: weapon.preview?.position ?? { x: 0, y: 0, z: 0 },
      focus: weapon.preview?.focus,
      spinSpeed: weapon.preview?.spinSpeed ?? this.defaultSpinSpeed,
    });

    this.applyRarityGlow(weapon.rarity);
  }

  async loadCritter(critter) {
    if (!critter) return;

    await this.loadStageModel({
      id: `critter-${critter.id}`,
      modelPath: critter.modelPath,
      scale: critter.preview?.scale ?? 1,
      rotation: critter.preview?.rotation ?? { x: 0, y: Math.PI, z: 0 },
      position: critter.preview?.position ?? { x: 0, y: -0.9, z: 0 },
      focus: critter.preview?.focus ?? { x: 0, y: 1, z: 0 },
      spinSpeed: critter.preview?.spinSpeed ?? 0.25,
    });

    if (critter.preview?.glowColor != null) {
      this.setGlowColor(critter.preview.glowColor);
    } else {
      this.setGlowColor(0x7cc86f);
    }
  }

  async loadStageModel({ id, modelPath, scale, rotation, position, focus, spinSpeed }) {
    const requestId = ++this.modelRequestToken;

    let model = null;
    if (modelPath) {
      model = await this.resourceLoader.loadModel(modelPath);
    }

    if (this.modelRequestToken !== requestId) {
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel();
    }

    const resolvedRotation = this.resolveEuler(rotation);
    const resolvedPosition = this.resolveVector(position);
    model.rotation.copy(resolvedRotation);
    model.position.copy(resolvedPosition);
    this.applyScale(model, scale);
    if (id) {
      model.name = id;
      model.userData.stageId = id;
    }

    this.disposeCurrentModel();
    this.currentModel = model;
    this.stageGroup.add(model);

    const focusTarget = this.resolveVector(focus, this.defaultFocus);
    this.setFocusTarget(focusTarget);
    this.setSpinSpeed(spinSpeed);
  }

  setAutoSpin(enabled) {
    this.autoSpinEnabled = Boolean(enabled);
  }

  setSpinSpeed(speed) {
    if (typeof speed === 'number' && Number.isFinite(speed)) {
      this.currentSpinSpeed = speed;
    } else {
      this.currentSpinSpeed = this.defaultSpinSpeed;
    }
  }

  setGlowColor(color) {
    if (!this.glowRing || color == null) return;
    this.glowRing.material.color = new THREE.Color(color);
  }

  setFocusTarget(target) {
    if (!target) return;
    this.focusTarget.copy(target);
    this.camera?.lookAt(this.focusTarget);
    if (this.controls) {
      this.controls.target.copy(this.focusTarget);
      this.controls.update();
    }
  }

  clearStageModel() {
    this.disposeCurrentModel();
    this.resetFocus();
    this.setSpinSpeed(this.defaultSpinSpeed);
    this.setGlowColor(RARITY_GLOWS.common);
  }

  resetFocus() {
    if (this.camera) {
      this.camera.position.copy(this.defaultCameraPosition);
    }
    this.setFocusTarget(this.defaultFocus);
  }

  resolveVector(value, fallback) {
    if (value?.isVector3) {
      return value.clone();
    }

    if (value && typeof value === 'object') {
      const { x = 0, y = 0, z = 0 } = value;
      return new THREE.Vector3(x, y, z);
    }

    if (fallback?.isVector3) {
      return fallback.clone();
    }

    if (fallback && typeof fallback === 'object') {
      const { x = 0, y = 0, z = 0 } = fallback;
      return new THREE.Vector3(x, y, z);
    }

    return new THREE.Vector3(0, 0, 0);
  }

  resolveEuler(value, fallback) {
    if (value?.isEuler) {
      return value.clone();
    }

    if (value && typeof value === 'object') {
      const { x = 0, y = 0, z = 0 } = value;
      return new THREE.Euler(x, y, z);
    }

    if (fallback?.isEuler) {
      return fallback.clone();
    }

    if (fallback && typeof fallback === 'object') {
      const { x = 0, y = 0, z = 0 } = fallback;
      return new THREE.Euler(x, y, z);
    }

    return new THREE.Euler(0, 0, 0);
  }

  applyScale(model, scale) {
    if (!model) return;

    if (scale?.isVector3) {
      model.scale.copy(scale);
      return;
    }

    if (typeof scale === 'number') {
      model.scale.setScalar(scale);
      return;
    }

    if (scale && typeof scale === 'object') {
      const { x = 1, y = 1, z = 1 } = scale;
      model.scale.set(x, y, z);
      return;
    }

    model.scale.setScalar(1);
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
    this.controls?.dispose?.();
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
  }
}
