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

export class SceneManager {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.resourceLoader = new ResourceLoader();
    this.animationFrame = null;

    this.stageGroup = new THREE.Group();
    this.currentModel = null;
    this.currentCritterId = null;
    this.platform = null;
    this.glowRing = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.mixer = null;
    this.activeAction = null;
    this.orbitControls = null;
    this.autoOrbitEnabled = false;
    this.defaultCameraPosition = new THREE.Vector3(0, 1.1, 3.3);
    this.defaultCameraTarget = new THREE.Vector3(0, 0.65, 0);
    this.pendingFocus = null;

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
    if (this.orbitControls) {
      this.orbitControls.update();
    }

    if (this.mixer) {
      this.mixer.update(delta);
    }

    if (this.glowRing) {
      this.glowRing.rotation.z += delta * 0.2;
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
    this.orbitControls.dampingFactor = 0.12;
    this.orbitControls.enablePan = true;
    this.orbitControls.panSpeed = 0.65;
    this.orbitControls.rotateSpeed = 0.75;
    this.orbitControls.zoomSpeed = 0.9;
    this.orbitControls.screenSpacePanning = true;
    this.orbitControls.minPolarAngle = Math.PI * 0.12;
    this.orbitControls.maxPolarAngle = Math.PI * 0.58;
    this.orbitControls.minDistance = 1.6;
    this.orbitControls.maxDistance = 8.0;
    this.orbitControls.autoRotate = this.autoOrbitEnabled;
    this.orbitControls.autoRotateSpeed = 1.4;
    this.orbitControls.target.copy(this.defaultCameraTarget);
    this.orbitControls.update();
    this.orbitControls.saveState();
    this.orbitControls.addEventListener('start', () => {
      this.options?.onInteractionStart?.();
      if (this.autoOrbitEnabled) {
        this.setAutoOrbitEnabled(false);
      }
    });
    this.orbitControls.addEventListener('end', () => {
      this.options?.onInteractionEnd?.();
    });
    this.options?.onAutoOrbitChanged?.(this.autoOrbitEnabled);
    if (this.pendingFocus && this.currentModel) {
      const pending = this.pendingFocus;
      this.pendingFocus = null;
      this.focusCurrentModel(pending);
    }
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
    if (!weapon) return false;

    const requestId = (this.pendingWeaponId = weapon.id);

    let model = null;
    if (weapon.modelPath) {
      model = await this.resourceLoader.loadModel(weapon.modelPath);
    }

    if (this.pendingWeaponId !== requestId) {
      return false;
    }

    this.pendingWeaponId = null;

    this.disposeCurrentModel();

    if (!model) {
      return false;
    }

    model.position.set(0, 0, 0);
    model.rotation.set(0, Math.PI / 4, 0);

    const scale = weapon.preview?.scale ?? 1.2;
    model.scale.setScalar(scale);

    this.currentModel = model;
    this.stageGroup.add(model);

    this.applyRarityGlow(weapon.rarity);
    this.focusCurrentModel({ padding: weapon.preview?.focusPadding ?? 1.4 });

    return true;
  }

  async loadCritter(critter) {
    if (!critter) return false;

    const requestId = (this.pendingCritterId = critter.id);

    let model = null;
    if (critter.modelPath) {
      model = await this.resourceLoader.loadModel(critter.modelPath);
    }

    if (this.pendingCritterId !== requestId) {
      return false;
    }

    this.pendingCritterId = null;

    this.disposeCurrentModel();

    if (!model) {
      return false;
    }

    const offset = critter.offset ?? {};
    const rotation = critter.rotation ?? {};
    model.position.set(offset.x ?? 0, offset.y ?? 0, offset.z ?? 0);
    model.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0);

    const scale = critter.scale ?? 1;
    model.scale.setScalar(scale);

    this.currentModel = model;
    this.currentCritterId = critter.id;
    this.stageGroup.add(model);

    this.mixer = new THREE.AnimationMixer(model);
    this.activeAction = null;

    this.focusCurrentModel({ padding: critter.focusPadding ?? 1.5 });

    return true;
  }

  focusCurrentModel({ padding = 1.4 } = {}) {
    if (!this.currentModel) {
      this.pendingFocus = { padding };
      return;
    }

    if (!this.camera || !this.orbitControls) {
      this.pendingFocus = { padding };
      return;
    }

    this.pendingFocus = null;

    const box = new THREE.Box3().setFromObject(this.currentModel);
    if (box.isEmpty()) {
      return;
    }

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
      return;
    }

    const paddingFactor = Math.max(1, padding ?? 1.4);
    const halfFov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const baseDistance = maxDimension / 2 / Math.tan(halfFov);
    const targetDistance = baseDistance * paddingFactor;

    const direction = this.camera.position.clone().sub(this.orbitControls.target);
    if (direction.lengthSq() === 0) {
      direction.copy(this.defaultCameraPosition).sub(this.defaultCameraTarget);
    }

    direction.normalize();
    const offset = direction.multiplyScalar(targetDistance);

    this.orbitControls.target.copy(center);
    this.camera.position.copy(center.clone().add(offset));
    this.camera.updateProjectionMatrix();
    this.orbitControls.update();
  }

  adjustZoom(delta = 0) {
    if (!this.camera || !this.orbitControls || delta === 0) {
      return;
    }

    const offset = this.camera.position.clone().sub(this.orbitControls.target);
    const distance = offset.length();

    if (!distance) {
      return;
    }

    const minDistance = this.orbitControls.minDistance ?? 0.1;
    const maxDistance = this.orbitControls.maxDistance ?? Infinity;
    const nextDistance = THREE.MathUtils.clamp(distance + delta, minDistance, maxDistance);

    offset.setLength(nextDistance);
    this.camera.position.copy(this.orbitControls.target.clone().add(offset));
    this.camera.updateProjectionMatrix();
    this.orbitControls.update();
  }

  resetCamera() {
    if (!this.orbitControls) {
      return;
    }

    this.orbitControls.reset();
    this.setAutoOrbitEnabled(false);
  }

  setAutoOrbitEnabled(enabled, { silent = false } = {}) {
    const nextState = Boolean(enabled);
    const changed = nextState !== this.autoOrbitEnabled;
    this.autoOrbitEnabled = nextState;

    if (this.orbitControls) {
      this.orbitControls.autoRotate = this.autoOrbitEnabled;
    }

    if (!silent && changed) {
      this.options?.onAutoOrbitChanged?.(this.autoOrbitEnabled);
    }

    return this.autoOrbitEnabled;
  }

  toggleAutoOrbit() {
    return this.setAutoOrbitEnabled(!this.autoOrbitEnabled);
  }

  getAutoOrbitEnabled() {
    return this.autoOrbitEnabled;
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
    this.currentCritterId = null;
    this.mixer?.stopAllAction?.();
    this.mixer = null;
    this.activeAction = null;
    this.pendingFocus = null;
  }

  applyRarityGlow(rarity = 'common') {
    const color = RARITY_GLOWS[rarity] ?? RARITY_GLOWS.common;
    if (this.glowRing) {
      this.glowRing.material.color = new THREE.Color(color);
    }
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
  }
}
