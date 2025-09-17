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
  constructor(container, uiOptions = {}) {
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
    this.platform = null;
    this.glowRing = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.mixer = null;
    this.activeAction = null;
    this.orbitControls = null;
    this.ui = {
      overlay: uiOptions.overlayElement ?? null,
      status: uiOptions.statusElement ?? null,
    };
    this.lastFocusedView = {
      position: new THREE.Vector3(0, 1.1, 3.3),
      target: new THREE.Vector3(0, 0.65, 0),
      minDistance: 2.0,
      maxDistance: 6.0,
    };
    this.handleUIClick = this.handleUIClick.bind(this);
    this.handleKeyboardShortcut = this.handleKeyboardShortcut.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown);
    this.camera = this.createCamera();
    this.setupLights();
    this.setupEnvironment();
    this.scene.add(this.stageGroup);
    this.setupControls();
    this.bindUI();

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
    camera.position.set(0, 1.1, 3.3);
    camera.lookAt(0, 0.4, 0);
    return camera;
  }

  async setupControls() {
    if (!this.renderer || !this.camera) return;
    const module = await import(ORBIT_CONTROLS_MODULE);
    this.orbitControls = new module.OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.08;
    this.orbitControls.enablePan = true;
    this.orbitControls.screenSpacePanning = true;
    this.orbitControls.rotateSpeed = 0.6;
    this.orbitControls.zoomSpeed = 1.0;
    this.orbitControls.panSpeed = 0.8;
    this.orbitControls.maxPolarAngle = Math.PI * 0.62;
    this.orbitControls.minDistance = this.lastFocusedView.minDistance;
    this.orbitControls.maxDistance = this.lastFocusedView.maxDistance;
    this.orbitControls.target.copy(this.lastFocusedView.target);
    this.orbitControls.listenToKeyEvents?.(this.container);
    this.orbitControls.update();
  }

  bindUI() {
    if (this.ui.overlay) {
      this.ui.overlay.addEventListener('click', this.handleUIClick);
    }

    if (this.container) {
      this.container.addEventListener('keydown', this.handleKeyboardShortcut);
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
    if (!weapon) return;

    const requestId = (this.pendingWeaponId = weapon.id);
    this.setStatus(`Loading ${weapon.name ?? 'weapon'}…`, 'loading');

    let model = null;
    if (weapon.modelPath) {
      model = await this.resourceLoader.loadModel(weapon.modelPath);
    }

    if (this.pendingWeaponId !== requestId) {
      return;
    }

    this.disposeCurrentModel();
    if (!model) {
      this.setStatus('Unable to load this weapon preview.', 'error');
      return;
    }

    model.position.set(0, 0, 0);
    model.rotation.set(0, Math.PI / 4, 0);

    const scale = weapon.preview?.scale ?? 1.2;
    model.scale.setScalar(scale);

    this.currentModel = model;
    this.stageGroup.add(model);

    this.focusCameraOn(model);
    this.applyRarityGlow(weapon.rarity);
    this.setStatus(weapon.name ?? 'Weapon ready', 'ready');
  }

  async loadCritter(critter) {
    if (!critter) {
      this.disposeCurrentModel();
      this.setStatus('Pick a critter to bring it to life.', 'idle');
      return;
    }

    const requestId = (this.pendingCritterId = critter.id);
    this.setStatus(`Welcoming ${critter.name}…`, 'loading');

    let model = null;
    if (critter.modelPath) {
      model = await this.resourceLoader.loadModel(critter.modelPath);
    }

    if (this.pendingCritterId !== requestId) {
      return;
    }

    this.disposeCurrentModel();

    const offset = critter.offset ?? {};
    const rotation = critter.rotation ?? {};
    if (model) {
      model.position.set(offset.x ?? 0, offset.y ?? 0, offset.z ?? 0);
      model.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0);

      const scale = critter.scale ?? 1;
      model.scale.setScalar(scale);

      this.currentModel = model;
      this.currentCritterId = critter.id;
      this.stageGroup.add(model);

      this.mixer = new THREE.AnimationMixer(model);
      this.activeAction = null;

      this.focusCameraOn(model, critter.cameraPadding ?? 1.2);
      this.setStatus(`${critter.name} ready`, 'ready');
    } else {
      this.setStatus(`We couldn't load ${critter.name}.`, 'error');
    }
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
  }

  applyRarityGlow(rarity = 'common') {
    const color = RARITY_GLOWS[rarity] ?? RARITY_GLOWS.common;
    if (this.glowRing) {
      this.glowRing.material.color = new THREE.Color(color);
    }
  }

  focusCameraOn(object, padding = 1.25) {
    if (!this.camera || !this.orbitControls || !object) {
      return;
    }

    const box = new THREE.Box3().setFromObject(object);
    if (!box.isEmpty()) {
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = THREE.MathUtils.degToRad(this.camera.fov);
      const distance = (maxDim / Math.sin(fov / 2)) * 0.5 * padding;

      const direction = new THREE.Vector3()
        .subVectors(this.camera.position, this.orbitControls.target)
        .normalize();

      if (!Number.isFinite(direction.lengthSq()) || direction.lengthSq() === 0) {
        direction.set(0, 0, 1);
      }

      const newPosition = center.clone().add(direction.multiplyScalar(distance));

      this.camera.position.copy(newPosition);
      this.camera.near = Math.max(0.05, distance / 100);
      this.camera.far = Math.max(20, distance * 10);
      this.camera.updateProjectionMatrix();

      this.orbitControls.target.copy(center);
      this.orbitControls.minDistance = Math.max(distance * 0.25, 0.5);
      this.orbitControls.maxDistance = distance * 3;
      this.orbitControls.update();

      this.lastFocusedView = {
        position: this.camera.position.clone(),
        target: this.orbitControls.target.clone(),
        minDistance: this.orbitControls.minDistance,
        maxDistance: this.orbitControls.maxDistance,
      };
    }
  }

  resetCamera() {
    if (!this.camera || !this.orbitControls) {
      return;
    }

    const view = this.lastFocusedView ?? {
      position: new THREE.Vector3(0, 1.1, 3.3),
      target: new THREE.Vector3(0, 0.65, 0),
      minDistance: 2.0,
      maxDistance: 6.0,
    };

    this.camera.position.copy(view.position);
    this.orbitControls.target.copy(view.target);
    this.orbitControls.minDistance = view.minDistance;
    this.orbitControls.maxDistance = view.maxDistance;
    this.orbitControls.update();
  }

  adjustZoom(multiplier) {
    if (!this.orbitControls) return;
    if (multiplier < 1) {
      this.orbitControls.dollyOut(1 / multiplier);
    } else {
      this.orbitControls.dollyIn(multiplier);
    }
    this.orbitControls.update();
  }

  rotateView(deltaAzimuth, deltaPolar = 0) {
    if (!this.orbitControls) return;
    if (deltaAzimuth) {
      this.orbitControls.rotateLeft(deltaAzimuth);
    }
    if (deltaPolar) {
      this.orbitControls.rotateUp(deltaPolar);
    }
    this.orbitControls.update();
  }

  handleUIClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }

    const action = button.dataset.action;
    if (!action) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.executeAction(action);
  }

  handleKeyboardShortcut(event) {
    if (event.defaultPrevented) {
      return;
    }

    const key = event.key.toLowerCase();
    switch (key) {
      case 'r':
        event.preventDefault();
        this.resetCamera();
        break;
      case 'f':
        event.preventDefault();
        this.focusCameraOn(this.currentModel ?? this.stageGroup);
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.adjustZoom(1.15);
        break;
      case '-':
      case '_':
        event.preventDefault();
        this.adjustZoom(0.85);
        break;
      case 'arrowleft':
        event.preventDefault();
        this.rotateView(THREE.MathUtils.degToRad(20));
        break;
      case 'arrowright':
        event.preventDefault();
        this.rotateView(THREE.MathUtils.degToRad(-20));
        break;
      case 'arrowup':
        event.preventDefault();
        this.rotateView(0, THREE.MathUtils.degToRad(12));
        break;
      case 'arrowdown':
        event.preventDefault();
        this.rotateView(0, THREE.MathUtils.degToRad(-12));
        break;
      default:
        break;
    }
  }

  executeAction(action) {
    switch (action) {
      case 'reset-view':
        this.resetCamera();
        break;
      case 'zoom-in':
        this.adjustZoom(1.18);
        break;
      case 'zoom-out':
        this.adjustZoom(0.82);
        break;
      case 'rotate-left':
        this.rotateView(THREE.MathUtils.degToRad(18));
        break;
      case 'rotate-right':
        this.rotateView(THREE.MathUtils.degToRad(-18));
        break;
      case 'rotate-up':
        this.rotateView(0, THREE.MathUtils.degToRad(12));
        break;
      case 'rotate-down':
        this.rotateView(0, THREE.MathUtils.degToRad(-12));
        break;
      case 'focus-model':
        this.focusCameraOn(this.currentModel ?? this.stageGroup);
        break;
      default:
        break;
    }
  }

  setStatus(message, state = 'idle') {
    if (!this.ui.status) {
      return;
    }

    this.ui.status.textContent = message ?? '';
    this.ui.status.dataset.state = state;
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
    if (this.ui.overlay) {
      this.ui.overlay.removeEventListener('click', this.handleUIClick);
    }
    if (this.container) {
      this.container.removeEventListener('keydown', this.handleKeyboardShortcut);
    }
    this.renderer?.domElement?.removeEventListener('pointerdown', this.handlePointerDown);
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

  handlePointerDown() {
    this.container?.focus?.();
  }
}
