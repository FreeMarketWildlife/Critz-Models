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
    this.controls = null;
    this.autoRotate = true;
    this.pendingLoadToken = null;
    this.cameraDirection = new THREE.Vector3(0, 0, 1);

    this.stageGroup = new THREE.Group();
    this.currentModel = null;
    this.platform = null;
    this.glowRing = null;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.camera = this.createCamera();
    this.controls = this.createControls(this.camera, this.renderer.domElement);
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
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  update(delta) {
    this.controls?.update();

    if (this.currentModel) {
      if (this.autoRotate) {
        this.currentModel.rotation.y += delta * 0.4;
      }
    }

    if (this.glowRing) {
      this.glowRing.rotation.z += delta * 0.2;
    }
  }

  createCamera() {
    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 1.1, 3.3);
    camera.lookAt(0, 0.4, 0);
    return camera;
  }

  createControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);
    domElement.tabIndex = 0;
    domElement.setAttribute('aria-label', '3D model viewer');
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 8;
    controls.target.set(0, 0.9, 0);
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
    await this.loadEntry(weapon, {
      fallbackType: 'weapon',
      applyRarityGlow: true,
      defaultRotation: [0, Math.PI / 4, 0],
      defaultScale: 1.2,
      autoCenter: weapon?.preview?.autoCenter ?? false,
      updateCamera: weapon?.preview?.updateCamera ?? false,
    });
  }

  async loadCritter(critter) {
    await this.loadEntry(critter, {
      fallbackType: 'critter',
      applyRarityGlow: false,
      defaultRotation: [0, Math.PI, 0],
      defaultScale: 1,
      autoCenter: critter?.preview?.autoCenter ?? true,
      updateCamera: critter?.preview?.updateCamera ?? true,
      cameraOffset: critter?.preview?.cameraOffset,
    });
  }

  async loadEntry(entry, options = {}) {
    if (!entry) return;

    const requestToken = {};
    this.pendingLoadToken = requestToken;

    let model = null;
    if (entry.modelPath) {
      model = await this.resourceLoader.loadModel(entry.modelPath);
    }

    if (this.pendingLoadToken !== requestToken) {
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel(options.fallbackType);
    }

    const settings = this.buildPreviewSettings(entry, options);
    const metrics = this.prepareModel(model, settings);
    settings.metrics = metrics;

    this.disposeCurrentModel();
    this.currentModel = model;
    this.stageGroup.add(model);

    if (settings.updateCamera) {
      this.focusModel(settings);
    } else {
      this.resetCameraTarget(settings);
    }

    if (options.applyRarityGlow) {
      this.applyRarityGlow(entry.rarity);
    } else {
      this.applyRarityGlow('common');
    }

    this.pendingLoadToken = null;
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

  createPlaceholderModel(type = 'weapon') {
    if (type === 'critter') {
      const body = new THREE.CapsuleGeometry(0.4, 1.6, 12, 24);
      const material = new THREE.MeshStandardMaterial({
        color: 0x7cc86f,
        emissive: 0x1a3a29,
        metalness: 0.2,
        roughness: 0.5,
      });
      const mesh = new THREE.Mesh(body, material);
      mesh.position.y = 0.8;
      return mesh;
    }

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

  setAutoRotate(enabled) {
    this.autoRotate = Boolean(enabled);
  }

  buildPreviewSettings(entry, options = {}) {
    const preview = entry?.preview ?? {};
    return {
      rotation: preview.rotation ?? options.defaultRotation ?? [0, 0, 0],
      scale: preview.scale ?? options.defaultScale ?? 1,
      position: preview.position ?? options.defaultPosition ?? [0, 0, 0],
      offset: preview.offset ?? options.defaultOffset ?? [0, 0, 0],
      autoCenter: preview.autoCenter ?? options.autoCenter ?? false,
      focusTarget: preview.focusTarget ?? null,
      cameraDistance: preview.cameraDistance ?? null,
      cameraDistanceMultiplier:
        preview.cameraDistanceMultiplier ?? options.cameraDistanceMultiplier ?? null,
      cameraOffset: preview.cameraOffset ?? options.cameraOffset ?? [0, 0, 0],
      minDistanceMultiplier: preview.minDistanceMultiplier ?? null,
      maxDistanceMultiplier: preview.maxDistanceMultiplier ?? null,
      updateCamera: preview.updateCamera ?? options.updateCamera ?? true,
    };
  }

  prepareModel(model, settings) {
    const rotation = Array.isArray(settings.rotation) ? settings.rotation : [0, 0, 0];
    const scale = settings.scale;

    if (Array.isArray(scale)) {
      const [sx = 1, sy = 1, sz = 1] = scale;
      model.scale.set(sx, sy, sz);
    } else if (typeof scale === 'number') {
      model.scale.setScalar(scale);
    } else {
      model.scale.setScalar(1);
    }

    const [rx = 0, ry = 0, rz = 0] = rotation;
    model.rotation.set(rx, ry, rz);
    model.position.set(0, 0, 0);

    if (Array.isArray(settings.position)) {
      const [px = 0, py = 0, pz = 0] = settings.position;
      model.position.add(new THREE.Vector3(px, py, pz));
    }

    return this.centerModel(model, settings);
  }

  centerModel(model, settings) {
    const initialBox = new THREE.Box3().setFromObject(model);
    if (settings.autoCenter && !initialBox.isEmpty()) {
      const center = initialBox.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= initialBox.min.y;
    }

    if (Array.isArray(settings.offset)) {
      const [ox = 0, oy = 0, oz = 0] = settings.offset;
      model.position.add(new THREE.Vector3(ox, oy, oz));
    }

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = sphere?.radius && Number.isFinite(sphere.radius)
      ? sphere.radius
      : Math.max(size.x, size.y, size.z, 1) * 0.5;

    return { box, size, center, radius };
  }

  focusModel(settings) {
    if (!this.controls || !this.camera) return;

    const { metrics } = settings;
    const radius = Math.max(metrics?.radius ?? 1, 0.5);
    const target = Array.isArray(settings.focusTarget) ? settings.focusTarget : null;

    if (target) {
      this.controls.target.set(target[0] ?? 0, target[1] ?? 0, target[2] ?? 0);
    } else {
      const targetY = Math.max(metrics.center?.y ?? 0, (metrics.size?.y ?? 1) * 0.5);
      this.controls.target.set(0, targetY, 0);
    }

    const distance = this.getCameraDistance(radius, settings);
    const direction = this.getCameraDirection();
    const offset = this.arrayToVector(settings.cameraOffset, 0);

    const targetPosition = new THREE.Vector3().copy(this.controls.target);
    const cameraPosition = targetPosition.add(direction.multiplyScalar(distance)).add(offset);
    this.camera.position.copy(cameraPosition);
    this.camera.updateProjectionMatrix();

    const minMultiplier = settings.minDistanceMultiplier ?? 0.65;
    const maxMultiplier = settings.maxDistanceMultiplier ?? 4.5;
    this.controls.minDistance = Math.max(radius * minMultiplier, 0.8);
    this.controls.maxDistance = Math.max(radius * maxMultiplier, this.controls.minDistance + 0.5);
    this.controls.update();
  }

  resetCameraTarget(settings = {}) {
    if (!this.controls) return;

    const target = Array.isArray(settings.focusTarget) ? settings.focusTarget : null;
    if (target) {
      this.controls.target.set(target[0] ?? 0, target[1] ?? 0, target[2] ?? 0);
    } else {
      this.controls.target.set(0, 0.9, 0);
    }

    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 8;
    this.controls.update();
  }

  getCameraDistance(radius, settings) {
    if (typeof settings.cameraDistance === 'number' && Number.isFinite(settings.cameraDistance)) {
      return Math.max(settings.cameraDistance, 1.2);
    }
    const multiplier = settings.cameraDistanceMultiplier ?? 2.8;
    return Math.max(radius * multiplier, 1.6);
  }

  getCameraDirection() {
    if (!this.controls) {
      return this.cameraDirection.clone();
    }

    this.cameraDirection
      .copy(this.camera.position)
      .sub(this.controls.target)
      .normalize();

    if (this.cameraDirection.lengthSq() === 0) {
      this.cameraDirection.set(0, 0, 1);
    }
    return this.cameraDirection.clone();
  }

  arrayToVector(input, defaultValue = 0) {
    if (!Array.isArray(input)) {
      return new THREE.Vector3(defaultValue, defaultValue, defaultValue);
    }
    const [x = defaultValue, y = defaultValue, z = defaultValue] = input;
    return new THREE.Vector3(x, y, z);
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
