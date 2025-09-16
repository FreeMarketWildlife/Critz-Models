import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
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
    this.pendingEntityToken = null;
    this.controls = null;
    this.autoRotate = true;
    this.rotationSpeed = 0.4;
    this.pendingControlsTarget = new THREE.Vector3(0, 0.4, 0);

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.camera = this.createCamera();
    this.setupLights();
    this.setupEnvironment();
    this.scene.add(this.stageGroup);
    this.setupControls();

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
    if (this.currentModel && this.autoRotate) {
      this.currentModel.rotation.y += delta * this.rotationSpeed;
    }

    if (this.glowRing) {
      this.glowRing.rotation.z += delta * 0.2;
    }

    if (this.controls) {
      this.controls.update();
    }
  }

  createCamera() {
    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 1.1, 3.3);
    camera.lookAt(0, 0.4, 0);
    return camera;
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

    const requestId = (this.pendingEntityToken = `weapon:${weapon.id}`);

    let model = null;
    if (weapon.modelPath) {
      model = await this.resourceLoader.loadModel(weapon.modelPath);
    }

    if (this.pendingEntityToken !== requestId) {
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel();
    }

    this.applyPreviewTransform(model, weapon.preview, {
      rotation: { x: 0, y: Math.PI / 4, z: 0 },
      position: { x: 0, y: 0, z: 0 },
      scale: 1.2,
    });

    this.disposeCurrentModel();
    this.currentModel = model;
    this.stageGroup.add(model);

    this.applyRarityGlow(weapon.rarity);
    const target = weapon.preview?.target || { x: 0, y: 0.45, z: 0 };
    this.setControlsTarget(target);
  }

  async loadCritter(critter) {
    if (!critter) return;

    const requestId = (this.pendingEntityToken = `critter:${critter.id}`);

    let model = null;
    if (critter.modelPath) {
      model = await this.resourceLoader.loadModel(critter.modelPath);
    }

    if (this.pendingEntityToken !== requestId) {
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel();
    }

    this.applyPreviewTransform(model, critter.preview, {
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: -0.8, z: 0 },
      scale: 1.1,
    });

    this.disposeCurrentModel();
    this.currentModel = model;
    this.stageGroup.add(model);

    if (critter.preview?.glowColor) {
      this.applyGlowColor(critter.preview.glowColor);
    } else {
      this.applyRarityGlow(critter.preview?.rarity || 'mythic');
    }

    const target = critter.preview?.target || { x: 0, y: 1.1, z: 0 };
    this.setControlsTarget(target);
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

  applyGlowColor(color) {
    if (this.glowRing && color) {
      this.glowRing.material.color = new THREE.Color(color);
    }
  }

  applyPreviewTransform(model, preview = {}, defaults = {}) {
    const defaultPosition = defaults.position || {};
    const previewPosition = preview.position || {};
    const resolvedPosition = {
      x: previewPosition.x ?? defaultPosition.x ?? 0,
      y: previewPosition.y ?? defaultPosition.y ?? 0,
      z: previewPosition.z ?? defaultPosition.z ?? 0,
    };
    model.position.set(resolvedPosition.x, resolvedPosition.y, resolvedPosition.z);

    const defaultRotation = defaults.rotation || {};
    const previewRotation = preview.rotation || {};
    const providedAxes = preview.__rotationProvidedAxes || [];
    const forceRotation = preview.useDefaultRotation === false;
    const resolvedRotation = {
      x: defaultRotation.x ?? 0,
      y: defaultRotation.y ?? 0,
      z: defaultRotation.z ?? 0,
    };
    ['x', 'y', 'z'].forEach((axis) => {
      if (!Object.prototype.hasOwnProperty.call(previewRotation, axis)) {
        return;
      }
      const value = previewRotation[axis];
      const axisProvided =
        providedAxes.includes(axis) ||
        forceRotation ||
        (typeof value === 'number' && Math.abs(value) > 1e-6);
      if (axisProvided && typeof value === 'number') {
        resolvedRotation[axis] = value;
      }
    });
    model.rotation.set(resolvedRotation.x, resolvedRotation.y, resolvedRotation.z);

    const scaleValue = preview.scale ?? defaults.scale ?? 1;
    if (typeof scaleValue === 'number') {
      model.scale.setScalar(scaleValue);
    } else {
      const { x = 1, y = 1, z = 1 } = scaleValue || {};
      model.scale.set(x, y, z);
    }
  }

  setupControls() {
    import('https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js')
      .then((module) => {
        if (!this.camera || !this.renderer) return null;
        this.controls = new module.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.enablePan = false;
        this.controls.minDistance = 1.4;
        this.controls.maxDistance = 6;
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.controls.target.copy(this.pendingControlsTarget);
        this.controls.update();
        return null;
      })
      .catch((error) => {
        console.warn('Failed to set up orbit controls.', error);
      });
  }

  setControlsTarget(target = { x: 0, y: 0.4, z: 0 }) {
    if (!target) return;
    const nextTarget = new THREE.Vector3(target.x ?? 0, target.y ?? 0, target.z ?? 0);
    this.pendingControlsTarget = nextTarget;
    this.camera?.lookAt(nextTarget);
    if (this.controls) {
      this.controls.target.copy(nextTarget);
      this.controls.update();
    }
  }

  isAutoRotating() {
    return this.autoRotate;
  }

  setAutoRotate(enabled) {
    this.autoRotate = Boolean(enabled);
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
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
    this.controls?.dispose?.();
    this.controls = null;
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
