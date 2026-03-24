import * as THREE from 'https://esm.sh/three@0.160.0';
import { createRenderer } from './RendererFactory.js';
import { ResourceLoader } from './ResourceLoader.js';
import { RigController } from './RigController.js';

const ORBIT_CONTROLS_MODULE =
  'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const CAMERA_DEFAULT_POSITION = new THREE.Vector3(0, 1.1, 3.3);
const CAMERA_DEFAULT_TARGET = new THREE.Vector3(0, 0.65, 0);
const CAMERA_TRANSITION_SPEED = 2.25;
const FOCUS_OFFSET_DIRECTION = new THREE.Vector3(0.45, 0.3, 1).normalize();
const FOCUS_PADDING = 1.25;
const IMAGE_PLACEHOLDER_HEIGHT = 2.1;
const IMAGE_PLACEHOLDER_EXTENSIONS = ['png', 'webp', 'jpg', 'jpeg'];
const INTERACTION_MODE_HINTS = {
  idle: 'idle',
  model: 'model',
  image: 'image',
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export class SceneManager {
  constructor(container, options = {}) {
    this.container = container;
    this.bus = options.bus ?? null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.resourceLoader = new ResourceLoader();
    this.animationFrame = null;

    this.stageGroup = new THREE.Group();
    this.currentModel = null;
    this.currentCritterId = null;
    this.currentWeaponId = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.pendingAnimationId = null;
    this.mixer = null;
    this.activeAction = null;
    this.orbitControls = null;
    this.autoRotateEnabled = false;
    this.rarityLight = null;
    this.rigController = null;
    this.hasRigControls = false;
    this.currentInteractionMode = INTERACTION_MODE_HINTS.idle;
    this.currentUsesImagePlaceholder = false;
    this.critterImagePreviewStates = new Map();
    this.resizeObserver = null;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);

    this.defaultCameraPosition = CAMERA_DEFAULT_POSITION.clone();
    this.defaultCameraTarget = CAMERA_DEFAULT_TARGET.clone();

    this.cameraStartPosition = CAMERA_DEFAULT_POSITION.clone();
    this.cameraTargetPosition = CAMERA_DEFAULT_POSITION.clone();
    this.controlsStartTarget = CAMERA_DEFAULT_TARGET.clone();
    this.controlsTarget = CAMERA_DEFAULT_TARGET.clone();
    this.cameraLerpAlpha = 1;
    this.cameraLerpSpeed = CAMERA_TRANSITION_SPEED;

    this.boundingBox = new THREE.Box3();
    this.boundingSphere = new THREE.Sphere();

    this.busOffHandlers = [];
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.camera = this.createCamera();
    this.setupLights();
    this.setupEnvironment();
    this.scene.add(this.stageGroup);
    this.setupControls();
    this.registerBusHandlers();
    this.resetView(true);
    this.emitStageEvent('stage:auto-rotate-changed', { enabled: this.autoRotateEnabled });
    this.emitStageEvent('stage:rig-controls-cleared');

    window.addEventListener('resize', this.handleResize);
    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.container);
    }
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
    if (this.cameraLerpAlpha < 1 && this.camera) {
      this.cameraLerpAlpha = Math.min(1, this.cameraLerpAlpha + delta * this.cameraLerpSpeed);
      const eased = easeOutCubic(this.cameraLerpAlpha);
      this.camera.position.lerpVectors(this.cameraStartPosition, this.cameraTargetPosition, eased);
      if (this.orbitControls) {
        this.orbitControls.target.lerpVectors(this.controlsStartTarget, this.controlsTarget, eased);
        this.orbitControls.update();
      } else {
        this.camera.lookAt(this.controlsTarget);
      }
    } else if (this.orbitControls) {
      this.orbitControls.update();
    }

    if (this.mixer) {
      this.mixer.update(delta);
    }

    if (this.rigController) {
      this.rigController.applyPoseAdjustments();
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
    this.orbitControls.screenSpacePanning = true;
    this.orbitControls.panSpeed = 0.65;
    this.orbitControls.rotateSpeed = 0.6;
    this.orbitControls.zoomSpeed = 1.1;
    this.orbitControls.maxPolarAngle = Math.PI * 0.58;
    this.orbitControls.minDistance = 1.6;
    this.orbitControls.maxDistance = 6.5;
    this.orbitControls.target.copy(this.controlsTarget);
    this.orbitControls.autoRotate = this.currentUsesImagePlaceholder ? false : this.autoRotateEnabled;
    this.orbitControls.autoRotateSpeed = 1.2;
    this.orbitControls.addEventListener('start', () => {
      if (this.autoRotateEnabled) {
        this.setAutoRotate(false);
      }
    });
    this.orbitControls.addEventListener('change', () => {
      this.persistActiveImagePreviewState();
    });
    this.applyInteractionMode(this.currentInteractionMode);
    this.orbitControls.update();
  }

  registerBusHandlers() {
    if (!this.bus) return;
    this.busOffHandlers.push(
      this.bus.on('stage:focus-requested', () => this.focusOnCurrentModel()),
      this.bus.on('stage:reset-requested', () => this.resetView()),
      this.bus.on('stage:auto-rotate-requested', (payload) => {
        const next = payload?.enabled;
        if (typeof next === 'boolean') {
          this.setAutoRotate(next);
        } else {
          this.setAutoRotate(!this.autoRotateEnabled);
        }
      }),
      this.bus.on('rig:pose-changed', (payload) => this.handleRigPoseChanged(payload)),
      this.bus.on('rig:reset-requested', () => this.resetRigPose())
    );
  }

  emitStageEvent(event, detail) {
    this.bus?.emit?.(event, detail);
  }

  handleRigPoseChanged(payload) {
    if (!payload || !this.rigController) {
      return;
    }

    const value = this.rigController.setPoseValue(payload.id, payload.value);
    if (value === null) {
      return;
    }

    this.rigController.applyPoseAdjustments();
    this.emitStageEvent('stage:rig-pose-updated', { id: payload.id, value });
  }

  resetRigPose() {
    if (!this.rigController) {
      return;
    }

    const result = this.rigController.resetPose();
    this.rigController.applyPoseAdjustments();
    this.emitStageEvent('stage:rig-pose-reset', result);
  }

  setupRigController(model) {
    this.disposeRigController({ silent: true });

    if (!model) {
      this.hasRigControls = false;
      this.emitStageEvent('stage:rig-controls-cleared');
      return;
    }

    this.rigController = new RigController(model);
    const controls = this.rigController.getControls();
    const values = this.rigController.getPoseValues();
    this.hasRigControls = controls.length > 0;

    if (this.hasRigControls) {
      this.emitStageEvent('stage:rig-controls-ready', { controls, values });
    } else {
      this.emitStageEvent('stage:rig-controls-cleared');
    }
  }

  disposeRigController({ silent = false } = {}) {
    if (this.rigController) {
      this.rigController.dispose();
      this.rigController = null;
    }
    if (!silent && this.hasRigControls) {
      this.emitStageEvent('stage:rig-controls-cleared');
    }
    this.hasRigControls = false;
  }

  getPrimarySkinnedMesh() {
    if (this.rigController?.skinnedMeshes?.length) {
      return this.rigController.skinnedMeshes[0];
    }

    let mesh = null;
    this.currentModel?.traverse?.((child) => {
      if (!mesh && child.isSkinnedMesh) {
        mesh = child;
      }
    });
    return mesh;
  }

  startCameraTransition(position, target, { immediate = false } = {}) {
    if (!this.camera) {
      return;
    }

    const safePosition = position || this.defaultCameraPosition;
    const safeTarget = target || this.defaultCameraTarget;
    this.cameraTargetPosition.copy(safePosition);
    this.controlsTarget.copy(safeTarget);

    if (immediate || !this.orbitControls) {
      this.camera.position.copy(safePosition);
      this.cameraStartPosition.copy(safePosition);
      this.controlsStartTarget.copy(safeTarget);
      if (this.orbitControls) {
        this.orbitControls.target.copy(safeTarget);
        this.orbitControls.update();
      } else {
        this.camera.lookAt(safeTarget);
      }
      this.cameraLerpAlpha = 1;
      return;
    }

    this.cameraStartPosition.copy(this.camera.position);
    this.controlsStartTarget.copy(this.orbitControls.target);
    this.cameraLerpAlpha = 0;
  }

  computeFrameDistance(radius) {
    if (!this.camera || radius <= 0) {
      return 3;
    }

    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1);
    const horizontalFov = 2 * Math.atan(Math.tan(fov / 2) * aspect);
    const minFov = Math.min(fov, horizontalFov);
    const distance = radius / Math.sin(minFov / 2);
    return distance * FOCUS_PADDING;
  }

  focusOnCurrentModel({ immediate = false } = {}) {
    if (!this.currentModel) {
      return false;
    }

    this.currentModel.updateWorldMatrix?.(true, true);
    this.boundingBox.setFromObject(this.currentModel);
    if (this.boundingBox.isEmpty()) {
      return false;
    }

    this.boundingBox.getBoundingSphere(this.boundingSphere);
    if (!Number.isFinite(this.boundingSphere.radius) || this.boundingSphere.radius <= 0) {
      return false;
    }

    const center = this.boundingSphere.center.clone();
    if (!Number.isFinite(center.x) || !Number.isFinite(center.y) || !Number.isFinite(center.z)) {
      return false;
    }
    const distance = this.computeFrameDistance(this.boundingSphere.radius);
    const offset = FOCUS_OFFSET_DIRECTION.clone().multiplyScalar(distance);
    const position = center.clone().add(offset);

    this.startCameraTransition(position, center, { immediate });
    this.emitStageEvent('stage:focus-achieved', {
      position: position.toArray(),
      target: center.toArray(),
    });
    return true;
  }

  resetView(immediate = false) {
    this.startCameraTransition(this.defaultCameraPosition, this.defaultCameraTarget, { immediate });
    this.emitStageEvent('stage:view-reset');
  }

  setAutoRotate(enabled) {
    this.autoRotateEnabled = Boolean(enabled);
    if (this.orbitControls) {
      this.orbitControls.autoRotate = this.currentInteractionMode !== INTERACTION_MODE_HINTS.image && this.autoRotateEnabled;
    }
    this.emitStageEvent('stage:auto-rotate-changed', { enabled: this.autoRotateEnabled });
  }

  applyInteractionMode(mode) {
    const safeMode = Object.values(INTERACTION_MODE_HINTS).includes(mode) ? mode : INTERACTION_MODE_HINTS.model;
    this.currentInteractionMode = safeMode;
    this.currentUsesImagePlaceholder = safeMode === INTERACTION_MODE_HINTS.image;

    if (this.orbitControls) {
      this.orbitControls.enableRotate = !this.currentUsesImagePlaceholder;
      this.orbitControls.mouseButtons.LEFT = this.currentUsesImagePlaceholder
        ? THREE.MOUSE.PAN
        : THREE.MOUSE.ROTATE;
      this.orbitControls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
      this.orbitControls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
      this.orbitControls.touches.ONE = this.currentUsesImagePlaceholder
        ? THREE.TOUCH.PAN
        : THREE.TOUCH.ROTATE;
      this.orbitControls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
      this.orbitControls.autoRotate = !this.currentUsesImagePlaceholder && this.autoRotateEnabled;
      this.orbitControls.update();
    }

    this.emitStageEvent('stage:interaction-mode-changed', {
      mode: safeMode,
      usesImagePlaceholder: this.currentUsesImagePlaceholder,
    });
  }

  normalizeVector3Like(value) {
    if (Array.isArray(value) && value.length >= 3) {
      const [x, y, z] = value.map((entry) => Number(entry));
      if ([x, y, z].every((entry) => Number.isFinite(entry))) {
        return { x, y, z };
      }
      return null;
    }

    const x = Number(value?.x);
    const y = Number(value?.y);
    const z = Number(value?.z);
    if ([x, y, z].every((entry) => Number.isFinite(entry))) {
      return { x, y, z };
    }

    return null;
  }

  normalizeImagePreviewState(source) {
    if (!source || typeof source !== 'object') {
      return null;
    }

    const position = this.normalizeVector3Like(
      source.position ?? source.cameraPosition ?? source.camera?.position
    );
    const target = this.normalizeVector3Like(
      source.target ?? source.cameraTarget ?? source.camera?.target
    );

    if (!position || !target) {
      return null;
    }

    return {
      position: { ...position },
      target: { ...target },
    };
  }

  cloneImagePreviewState(source) {
    const normalized = this.normalizeImagePreviewState(source);
    if (!normalized) {
      return null;
    }

    return {
      position: { ...normalized.position },
      target: { ...normalized.target },
    };
  }

  setCritterImagePreviewLayout(layoutSource) {
    this.critterImagePreviewStates.clear();
    if (!layoutSource) {
      return;
    }

    if (layoutSource instanceof Map) {
      layoutSource.forEach((value, critterId) => {
        const normalized = this.cloneImagePreviewState(value);
        if (critterId && normalized) {
          this.critterImagePreviewStates.set(critterId, normalized);
        }
      });
      return;
    }

    if (typeof layoutSource !== 'object') {
      return;
    }

    Object.entries(layoutSource).forEach(([critterId, value]) => {
      const normalized = this.cloneImagePreviewState(value);
      if (critterId && normalized) {
        this.critterImagePreviewStates.set(critterId, normalized);
      }
    });
  }

  getCritterImagePreviewSnapshot() {
    this.persistActiveImagePreviewState();
    const snapshot = new Map();
    this.critterImagePreviewStates.forEach((value, critterId) => {
      const cloned = this.cloneImagePreviewState(value);
      if (cloned) {
        snapshot.set(critterId, cloned);
      }
    });
    return snapshot;
  }

  getActiveCameraTarget() {
    if (this.orbitControls) {
      return this.orbitControls.target.clone();
    }

    return this.controlsTarget.clone();
  }

  persistActiveImagePreviewState() {
    if (!this.currentUsesImagePlaceholder || !this.currentCritterId || !this.camera) {
      return;
    }

    const target = this.getActiveCameraTarget();
    this.critterImagePreviewStates.set(this.currentCritterId, {
      position: {
        x: Number(this.camera.position.x.toFixed(4)),
        y: Number(this.camera.position.y.toFixed(4)),
        z: Number(this.camera.position.z.toFixed(4)),
      },
      target: {
        x: Number(target.x.toFixed(4)),
        y: Number(target.y.toFixed(4)),
        z: Number(target.z.toFixed(4)),
      },
    });
  }

  applyStoredImagePreviewState(critterId, { immediate = true } = {}) {
    const stored = critterId ? this.critterImagePreviewStates.get(critterId) : null;
    const normalized = this.normalizeImagePreviewState(stored);
    if (!normalized) {
      return false;
    }

    const position = new THREE.Vector3(
      normalized.position.x,
      normalized.position.y,
      normalized.position.z
    );
    const target = new THREE.Vector3(normalized.target.x, normalized.target.y, normalized.target.z);
    this.startCameraTransition(position, target, { immediate });
    return true;
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xe9f7ff, 0.55);
    const hemisphere = new THREE.HemisphereLight(0xbaf5e0, 0x0c1412, 0.6);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(4.5, 6, 5.2);

    const rimLight = new THREE.DirectionalLight(0x78c7ff, 0.85);
    rimLight.position.set(-4.5, 5, -2.5);

    const fillLight = new THREE.PointLight(0xfff0d4, 0.95, 18, 2.2);
    fillLight.position.set(0.9, 3.6, 2.8);

    const accentLight = new THREE.PointLight(0x9fffe0, 1.05, 12, 2.4);
    accentLight.position.set(0, 1.6, 1.2);
    this.rarityLight = accentLight;
    this.applyRarityGlow();

    this.scene.add(ambient, hemisphere, keyLight, rimLight, fillLight, accentLight);
  }

  setupEnvironment() {}

  async loadWeapon(weapon) {
    if (!weapon) return;

    const requestId = (this.pendingWeaponId = weapon.id);
    this.emitStageEvent('stage:model-loading', {
      type: 'weapon',
      id: weapon.id,
      name: weapon.name,
    });

    let model = null;
    if (weapon.modelPath) {
      model = await this.resourceLoader.loadModel(weapon.modelPath);
    }

    if (!model || model.userData?.isPlaceholder) {
      model = await this.createWeaponImagePlaceholder(weapon);
    }

    if (this.pendingWeaponId !== requestId) {
      return;
    }

    this.disposeCurrentModel();

    if (!model || model.userData?.isPlaceholder) {
      this.emitStageEvent('stage:model-missing', {
        type: 'weapon',
        id: weapon.id,
        name: weapon.name,
      });
      this.setAutoRotate(false);
      this.pendingWeaponId = null;
      return;
    }

    const usesImagePlaceholder = Boolean(model.userData?.isImagePlaceholder);
    if (!usesImagePlaceholder) {
      model.position.set(0, 0, 0);
      model.rotation.set(0, Math.PI / 4, 0);

      const scale = weapon.preview?.scale ?? 1.2;
      model.scale.setScalar(scale);
    }

    this.currentModel = model;
    this.currentWeaponId = weapon.id;
    this.stageGroup.add(model);

    this.applyInteractionMode(usesImagePlaceholder ? INTERACTION_MODE_HINTS.image : INTERACTION_MODE_HINTS.model);
    this.setupRigController(usesImagePlaceholder ? null : model);
    if (usesImagePlaceholder) {
      this.stopAnimation();
      this.setAutoRotate(false);
      if (!this.focusOnCurrentModel({ immediate: true })) {
        this.resetView(true);
      }
    } else {
      this.resetView(true);
    }

    this.applyRarityGlow();
    this.emitStageEvent('stage:model-ready', {
      type: 'weapon',
      id: weapon.id,
      name: weapon.name,
      usesImagePlaceholder,
    });
    this.pendingWeaponId = null;
  }

  async loadCritter(critter) {
    if (!critter) return;

    const requestId = (this.pendingCritterId = critter.id);
    this.emitStageEvent('stage:model-loading', {
      type: 'critter',
      id: critter.id,
      name: critter.name,
    });

    let model = null;
    if (critter.modelPath) {
      model = await this.resourceLoader.loadModel(critter.modelPath);
    }

    if (!model || model.userData?.isPlaceholder) {
      model = await this.createCritterImagePlaceholder(critter);
    }

    if (this.pendingCritterId !== requestId) {
      return;
    }

    this.disposeCurrentModel();

    if (!model || model.userData?.isPlaceholder) {
      this.emitStageEvent('stage:model-missing', {
        type: 'critter',
        id: critter.id,
        name: critter.name,
      });
      this.stopAnimation();
      this.setAutoRotate(false);
      this.pendingCritterId = null;
      return;
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

    const usesImagePlaceholder = Boolean(model.userData?.isImagePlaceholder);
    this.applyInteractionMode(usesImagePlaceholder ? INTERACTION_MODE_HINTS.image : INTERACTION_MODE_HINTS.model);
    this.setupRigController(usesImagePlaceholder ? null : model);
    if (usesImagePlaceholder) {
      this.stopAnimation();
      this.setAutoRotate(false);
    } else {
      this.mixer = new THREE.AnimationMixer(model);
      this.activeAction = null;
    }
    if (usesImagePlaceholder) {
      const appliedStoredView = this.applyStoredImagePreviewState(critter.id, { immediate: true });
      if (!appliedStoredView && !this.focusOnCurrentModel({ immediate: true })) {
        this.resetView(true);
      }
      this.persistActiveImagePreviewState();
    } else {
      this.resetView(true);
    }
    this.emitStageEvent('stage:model-ready', {
      type: 'critter',
      id: critter.id,
      name: critter.name,
      usesImagePlaceholder,
    });
    this.pendingCritterId = null;
  }

  async playAnimation(animation) {
    if (!this.currentModel || this.currentModel.userData?.isImagePlaceholder || !animation?.path) {
      return;
    }

    const requestId = animation.id ?? animation.path;
    this.pendingAnimationId = requestId;

    if (!this.mixer) {
      this.mixer = new THREE.AnimationMixer(this.currentModel);
    }

    const animationData = await this.resourceLoader.loadAnimationClip(animation.path);
    if (!animationData || this.pendingAnimationId !== requestId || !this.currentModel) {
      return;
    }

    let clip = animationData.clip;
    const targetMesh = this.getPrimarySkinnedMesh();
    if (animationData.source && targetMesh) {
      clip = await this.resourceLoader.retargetClip(targetMesh, animationData.source, clip);
    }

    if (!clip) {
      return;
    }

    this.mixer.stopAllAction();

    const action = this.mixer.clipAction(clip, this.currentModel);
    if (!action) {
      return;
    }

    action.reset();
    action.clampWhenFinished = true;
    action.enabled = true;
    if (animation.loop === 'once') {
      action.setLoop(THREE.LoopOnce, 1);
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
    }

    action.play();
    this.activeAction = action;
    this.rigController?.applyPoseAdjustments?.();
    this.pendingAnimationId = null;
  }

  stopAnimation() {
    if (this.activeAction) {
      this.activeAction.stop();
      this.activeAction = null;
    }
    this.mixer?.stopAllAction?.();
    this.pendingAnimationId = null;
  }

  async createCritterImagePlaceholder(critter) {
    const imageCandidates = this.getCritterImageCandidates(critter);
    const imageHeight = Number.isFinite(critter?.imageHeight) ? critter.imageHeight : IMAGE_PLACEHOLDER_HEIGHT;

    for (const imagePath of imageCandidates) {
      const texture = await this.resourceLoader.loadTexture(imagePath, { silent: true });
      if (!texture) {
        continue;
      }

      texture.colorSpace = THREE.SRGBColorSpace;

      const width = Number(texture.image?.naturalWidth ?? texture.image?.width ?? 1);
      const height = Number(texture.image?.naturalHeight ?? texture.image?.height ?? 1);
      const safeHeight = height > 0 ? height : 1;
      const aspect = Math.max(width / safeHeight, 0.5);

      const group = new THREE.Group();
      group.name = 'critter-image-placeholder';
      group.userData.isImagePlaceholder = true;
      group.userData.imagePath = imagePath;

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        alphaTest: 0.03,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(imageHeight * aspect, imageHeight, 1);
      group.add(sprite);
      return group;
    }

    return null;
  }

  async createWeaponImagePlaceholder(weapon) {
    const imageCandidates = this.getWeaponImageCandidates(weapon);
    const imageHeight = Number.isFinite(weapon?.imageHeight) ? weapon.imageHeight : IMAGE_PLACEHOLDER_HEIGHT;

    for (const imagePath of imageCandidates) {
      const texture = await this.resourceLoader.loadTexture(imagePath, { silent: true });
      if (!texture) {
        continue;
      }

      texture.colorSpace = THREE.SRGBColorSpace;

      const width = Number(texture.image?.naturalWidth ?? texture.image?.width ?? 1);
      const height = Number(texture.image?.naturalHeight ?? texture.image?.height ?? 1);
      const safeHeight = height > 0 ? height : 1;
      const aspect = Math.max(width / safeHeight, 0.5);

      const group = new THREE.Group();
      group.name = 'weapon-image-placeholder';
      group.userData.isImagePlaceholder = true;
      group.userData.imagePath = imagePath;

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        alphaTest: 0.03,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(imageHeight * aspect, imageHeight, 1);
      group.add(sprite);
      return group;
    }

    return null;
  }

  getCritterImageCandidates(critter) {
    const candidates = [];
    if (typeof critter?.imagePath === 'string' && critter.imagePath.trim()) {
      candidates.push(critter.imagePath.trim());
    }

    const critterName = String(critter?.name || '').trim().replace(/\s+/g, ' ');
    const categoryFolder = this.toTitleCase(String(critter?.category || ''));
    if (!critterName || !categoryFolder) {
      return candidates;
    }

    const normalizedName = critterName
      .split(' ')
      .filter(Boolean)
      .map((word) =>
        word
          .split('-')
          .map((part) => this.toTitleCase(part))
          .join('-')
      )
      .join(' ');

    const nameCandidates = Array.from(new Set([critterName, normalizedName].filter(Boolean)));
    nameCandidates.forEach((nameVariant) => {
      IMAGE_PLACEHOLDER_EXTENSIONS.forEach((ext) => {
        candidates.push(`assets/images/Critters/${categoryFolder}/Image_${nameVariant}.${ext}`);
      });
    });

    return Array.from(new Set(candidates));
  }

  getWeaponImageCandidates(weapon) {
    const candidates = [];
    if (typeof weapon?.imagePath === 'string' && weapon.imagePath.trim()) {
      candidates.push(weapon.imagePath.trim());
    }

    const weaponName = String(weapon?.name || '').trim().replace(/\s+/g, ' ');
    const categoryFolder = this.toTitleCase(String(weapon?.category || ''));
    if (!weaponName || !categoryFolder) {
      return Array.from(new Set(candidates));
    }

    const normalizedName = weaponName
      .split(' ')
      .filter(Boolean)
      .map((word) =>
        word
          .split('-')
          .map((part) => this.toTitleCase(part))
          .join('-')
      )
      .join(' ');

    const nameCandidates = Array.from(new Set([weaponName, normalizedName].filter(Boolean)));
    nameCandidates.forEach((nameVariant) => {
      IMAGE_PLACEHOLDER_EXTENSIONS.forEach((ext) => {
        candidates.push(`assets/images/Weapons/${categoryFolder}/Image_${nameVariant}.${ext}`);
      });
    });

    return Array.from(new Set(candidates));
  }

  toTitleCase(value) {
    return String(value || '')
      .trim()
      .replace(/[-_]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
      .join(' ');
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
    this.currentWeaponId = null;
    this.currentUsesImagePlaceholder = false;
    this.applyInteractionMode(INTERACTION_MODE_HINTS.idle);
    this.mixer?.stopAllAction?.();
    this.mixer = null;
    this.activeAction = null;
    this.pendingAnimationId = null;
    this.disposeRigController();
  }

  applyRarityGlow() {
    if (this.rarityLight) {
      this.rarityLight.color = new THREE.Color(0x9fffe0);
      this.rarityLight.intensity = 1.05;
    }
  }

  createPlaceholderModel() {
    const group = new THREE.Group();
    group.name = 'scene-placeholder';
    group.userData.isPlaceholder = true;
    return group;
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
    this.resizeObserver?.disconnect?.();
    this.resizeObserver = null;
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
    this.busOffHandlers.forEach((off) => off?.());
    this.busOffHandlers = [];
    this.disposeRigController({ silent: true });
  }
}
