import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { createRenderer } from './RendererFactory.js';
import { ResourceLoader } from './ResourceLoader.js';

const ORBIT_CONTROLS_MODULE =
  'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const RARITY_GLOWS = {
  common: 0x7c6cff,
  rare: 0x7df0ff,
  epic: 0xff9af5,
  legendary: 0xffe37d,
  mythic: 0xffb7ff,
};

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 1.1, 3.3);
const DEFAULT_CAMERA_TARGET = new THREE.Vector3(0, 0.65, 0);

export class SceneManager {
  constructor(container, options = {}) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.resourceLoader = new ResourceLoader();
    this.animationFrame = null;

    this.stageGroup = new THREE.Group();
    this.currentModel = null;
    this.currentCritterId = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.mixer = null;
    this.activeAction = null;
    this.orbitControls = null;
    this.autoRotate = false;

    this.bus = options.bus ?? null;

    this.defaultCameraPosition = DEFAULT_CAMERA_POSITION.clone();
    this.defaultCameraTarget = DEFAULT_CAMERA_TARGET.clone();
    this.defaultCameraOffset = new THREE.Vector3().subVectors(
      this.defaultCameraPosition,
      this.defaultCameraTarget
    );

    this.modelBounds = new THREE.Box3();
    this.modelSize = new THREE.Vector3();
    this.modelCenter = new THREE.Vector3();

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.camera = this.createCamera();
    this.setupLights();
    this.scene.add(this.stageGroup);
    this.setupControls();

    this.container.classList.add('stage-viewport--empty');

    window.addEventListener('resize', this.handleResize);
    this.container.addEventListener('dblclick', this.handleDoubleClick);
    this.container.addEventListener('keydown', this.handleKeyDown);

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
    if (this.orbitControls) {
      this.orbitControls.update();
    }

    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  createCamera() {
    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.copy(this.defaultCameraPosition);
    camera.lookAt(this.defaultCameraTarget);
    return camera;
  }

  async setupControls() {
    if (!this.renderer || !this.camera) return;
    const module = await import(ORBIT_CONTROLS_MODULE);
    this.orbitControls = new module.OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.08;
    this.orbitControls.enablePan = true;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.enableZoom = true;
    this.orbitControls.rotateSpeed = 0.85;
    this.orbitControls.zoomSpeed = 1.15;
    this.orbitControls.panSpeed = 0.85;
    this.orbitControls.maxPolarAngle = Math.PI * 0.52;
    this.orbitControls.minDistance = 1.4;
    this.orbitControls.maxDistance = 10.0;
    this.orbitControls.autoRotate = false;
    this.orbitControls.autoRotateSpeed = 1.6;
    this.orbitControls.target.copy(this.defaultCameraTarget);
    this.orbitControls.update();
    this.orbitControls.listenToKeyEvents?.(this.container);
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xffe6ff, 0.4);
    const rimLight = new THREE.DirectionalLight(0xa7c9ff, 1.05);
    rimLight.position.set(-3, 4, 2);
    const fillLight = new THREE.SpotLight(0xffc3f7, 1.1, 18, Math.PI / 4, 0.9, 2);
    fillLight.position.set(2.6, 3.8, 1.4);
    const bounceLight = new THREE.PointLight(0x8cf5ff, 0.55, 6, 2);
    bounceLight.position.set(0, 1.2, 0.8);

    this.scene.add(ambient, rimLight, fillLight, bounceLight);
  }

  async loadWeapon(weapon) {
    if (!weapon) {
      this.disposeCurrentModel();
      this.notifyModelChange(false, { type: 'weapon', reason: 'no-selection' });
      return { success: false, reason: 'no-selection' };
    }

    const requestId = (this.pendingWeaponId = weapon.id);

    let model = null;
    if (weapon.modelPath) {
      model = await this.resourceLoader.loadModel(weapon.modelPath);
    }

    if (this.pendingWeaponId !== requestId) {
      return { success: false, reason: 'stale' };
    }

    if (!model) {
      this.disposeCurrentModel({ silent: true });
      this.pendingWeaponId = null;
      this.notifyModelChange(false, {
        type: 'weapon',
        id: weapon.id,
        reason: weapon.modelPath ? 'load-failed' : 'missing-model',
      });
      return { success: false, reason: weapon.modelPath ? 'load-failed' : 'missing-model' };
    }

    model.position.set(0, 0, 0);
    model.rotation.set(0, weapon.preview?.rotationY ?? Math.PI / 4, 0);

    const scale = weapon.preview?.scale ?? 1;
    model.scale.setScalar(scale);

    this.disposeCurrentModel({ silent: true });
    this.currentModel = model;
    this.currentCritterId = null;
    this.stageGroup.add(model);

    this.stopAnimation();
    this.pendingWeaponId = null;

    this.focusCurrentModel({ fit: true });
    this.applyRarityGlow(weapon.rarity);
    this.notifyModelChange(true, { type: 'weapon', id: weapon.id });

    return { success: true };
  }

  async loadCritter(critter) {
    if (!critter) {
      this.disposeCurrentModel();
      this.notifyModelChange(false, { type: 'critter', reason: 'no-selection' });
      return { success: false, reason: 'no-selection' };
    }

    const requestId = (this.pendingCritterId = critter.id);

    let model = null;
    if (critter.modelPath) {
      model = await this.resourceLoader.loadModel(critter.modelPath);
    } else {
      console.warn(`Critter "${critter.id}" is missing a modelPath.`);
    }

    if (this.pendingCritterId !== requestId) {
      return { success: false, reason: 'stale' };
    }

    if (!model) {
      this.disposeCurrentModel({ silent: true });
      this.pendingCritterId = null;
      this.notifyModelChange(false, {
        type: 'critter',
        id: critter.id,
        reason: critter.modelPath ? 'load-failed' : 'missing-model',
      });
      return { success: false, reason: critter.modelPath ? 'load-failed' : 'missing-model' };
    }

    const offset = critter.offset ?? {};
    const rotation = critter.rotation ?? {};
    model.position.set(offset.x ?? 0, offset.y ?? 0, offset.z ?? 0);
    model.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0);

    const scale = critter.scale ?? 1;
    model.scale.setScalar(scale);

    this.disposeCurrentModel({ silent: true });
    this.currentModel = model;
    this.currentCritterId = critter.id;
    this.stageGroup.add(model);

    this.mixer = new THREE.AnimationMixer(model);
    this.activeAction = null;
    this.pendingCritterId = null;

    this.focusCurrentModel({ fit: true });
    this.notifyModelChange(true, { type: 'critter', id: critter.id });

    return { success: true };
  }

  async playAnimation(animation) {
    if (!this.currentModel || !animation?.path) {
      return;
    }

    if (!this.mixer) {
      this.mixer = new THREE.AnimationMixer(this.currentModel);
    }

    const clip = await this.resourceLoader.loadAnimationClip(animation.path);
    if (!clip) {
      return;
    }

    const action = this.mixer.clipAction(clip);
    action.reset();
    action.clampWhenFinished = true;
    if (animation.loop === 'once') {
      action.setLoop(THREE.LoopOnce, 1);
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
    }

    if (this.activeAction && this.activeAction !== action) {
      this.activeAction.fadeOut(0.2);
    }

    action.fadeIn(0.2);
    action.play();
    this.activeAction = action;
  }

  stopAnimation() {
    if (this.activeAction) {
      this.activeAction.stop();
      this.activeAction = null;
    }
    this.mixer?.stopAllAction?.();
    this.mixer = null;
  }

  focusCurrentModel({ fit = true } = {}) {
    if (!this.currentModel || !this.camera || !this.orbitControls) {
      return false;
    }

    this.modelBounds.setFromObject(this.currentModel);
    if (this.modelBounds.isEmpty()) {
      return false;
    }

    const center = this.modelBounds.getCenter(this.modelCenter);
    this.orbitControls.target.copy(center);

    if (fit) {
      const size = this.modelBounds.getSize(this.modelSize);
      const maxDim = Math.max(size.x, size.y, size.z);
      const halfFov = THREE.MathUtils.degToRad(this.camera.fov * 0.5);
      const fitHeight = maxDim / (2 * Math.tan(halfFov));
      const distance = THREE.MathUtils.clamp(
        fitHeight * 1.35,
        this.orbitControls.minDistance,
        this.orbitControls.maxDistance
      );

      const offsetDirection = this.defaultCameraOffset.clone().normalize();
      const newPosition = center.clone().addScaledVector(offsetDirection, distance);
      this.camera.position.copy(newPosition);
      this.camera.updateProjectionMatrix();
    }

    this.orbitControls.update();
    return true;
  }

  resetView() {
    if (!this.camera || !this.orbitControls) return;
    this.setAutoRotate(false);
    this.camera.position.copy(this.defaultCameraPosition);
    this.camera.up.set(0, 1, 0);
    this.orbitControls.target.copy(this.defaultCameraTarget);
    this.orbitControls.update();
  }

  setAutoRotate(enabled) {
    const allow = Boolean(enabled) && !!this.currentModel;
    this.autoRotate = allow;
    if (this.orbitControls) {
      this.orbitControls.autoRotate = this.autoRotate;
      this.orbitControls.autoRotateSpeed = 1.6;
    }
    this.bus?.emit?.('viewport:auto-rotate-changed', { autoRotate: this.autoRotate });
    return this.autoRotate;
  }

  toggleAutoRotate() {
    return this.setAutoRotate(!this.autoRotate);
  }

  disposeCurrentModel({ silent = false } = {}) {
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
    this.currentCritterId = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.stopAnimation();

    if (!silent) {
      this.notifyModelChange(false, { type: 'cleared', reason: 'cleared' });
    }
  }

  applyRarityGlow(rarity = 'common') {
    const color = RARITY_GLOWS[rarity] ?? RARITY_GLOWS.common;
    if (!this.container) return;
    const colorObj = new THREE.Color(color);
    const cssColor = `rgba(${Math.round(colorObj.r * 255)}, ${Math.round(colorObj.g * 255)}, ${Math.round(
      colorObj.b * 255
    )}, 0.55)`;
    this.container.style.setProperty('--rarity-glow-color', cssColor);
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    const { clientWidth, clientHeight } = this.container;
    this.renderer.setSize(clientWidth, clientHeight, false);
    this.camera.aspect = clientWidth / Math.max(clientHeight, 1);
    this.camera.updateProjectionMatrix();
  }

  handleDoubleClick(event) {
    if (!this.container.contains(event.target)) {
      return;
    }
    this.focusCurrentModel({ fit: true });
  }

  handleKeyDown(event) {
    if (event.defaultPrevented) return;
    const key = event.key.toLowerCase();
    if (key === 'f') {
      event.preventDefault();
      this.focusCurrentModel({ fit: true });
    } else if (key === 'r') {
      event.preventDefault();
      this.resetView();
    } else if (key === ' ') {
      event.preventDefault();
      this.toggleAutoRotate();
    }
  }

  notifyModelChange(hasModel, detail = {}) {
    if (!this.container) {
      return;
    }

    if (hasModel) {
      this.container.classList.add('stage-viewport--has-model');
      this.container.classList.remove('stage-viewport--empty');
    } else {
      this.container.classList.remove('stage-viewport--has-model');
      this.container.classList.add('stage-viewport--empty');
      this.setAutoRotate(false);
    }

    this.bus?.emit?.('viewport:model-changed', { hasModel, ...detail });
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
    this.container.removeEventListener('dblclick', this.handleDoubleClick);
    this.container.removeEventListener('keydown', this.handleKeyDown);
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
    this.orbitControls?.dispose?.();
    this.container.classList.remove('stage-viewport--has-model', 'stage-viewport--empty');
  }
}
