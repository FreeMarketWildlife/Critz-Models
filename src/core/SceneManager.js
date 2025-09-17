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

const MIXAMO_TO_UE_BONE_MAP = {
  pelvis: 'Hips',
  spine_01: 'Spine',
  spine_02: 'Spine1',
  spine_03: 'Spine2',
  neck_01: 'Neck',
  head: 'Head',
  clavicle_l: 'LeftShoulder',
  upperarm_l: 'LeftArm',
  lowerarm_l: 'LeftForeArm',
  hand_l: 'LeftHand',
  clavicle_r: 'RightShoulder',
  upperarm_r: 'RightArm',
  lowerarm_r: 'RightForeArm',
  hand_r: 'RightHand',
  thigh_l: 'LeftUpLeg',
  calf_l: 'LeftLeg',
  calf_twist_01_l: 'LeftLeg',
  foot_l: 'LeftFoot',
  ball_l: 'LeftToeBase',
  thigh_r: 'RightUpLeg',
  calf_r: 'RightLeg',
  calf_twist_01_r: 'RightLeg',
  foot_r: 'RightFoot',
  ball_r: 'RightToeBase',
  thumb_01_l: 'LeftHandThumb1',
  thumb_02_l: 'LeftHandThumb2',
  thumb_03_l: 'LeftHandThumb3',
  thumb_01_r: 'RightHandThumb1',
  thumb_02_r: 'RightHandThumb2',
  thumb_03_r: 'RightHandThumb3',
  index_metacarpal_l: 'LeftHandIndex1',
  index_01_l: 'LeftHandIndex2',
  index_02_l: 'LeftHandIndex3',
  index_03_l: 'LeftHandIndex3',
  index_metacarpal_r: 'RightHandIndex1',
  index_01_r: 'RightHandIndex2',
  index_02_r: 'RightHandIndex3',
  index_03_r: 'RightHandIndex3',
  middle_metacarpal_l: 'LeftHandMiddle1',
  middle_01_l: 'LeftHandMiddle2',
  middle_02_l: 'LeftHandMiddle3',
  middle_03_l: 'LeftHandMiddle3',
  middle_metacarpal_r: 'RightHandMiddle1',
  middle_01_r: 'RightHandMiddle2',
  middle_02_r: 'RightHandMiddle3',
  middle_03_r: 'RightHandMiddle3',
  pinky_metacarpal_l: 'LeftHandPinky1',
  pinky_01_l: 'LeftHandPinky2',
  pinky_02_l: 'LeftHandPinky3',
  pinky_03_l: 'LeftHandPinky3',
  pinky_metacarpal_r: 'RightHandPinky1',
  pinky_01_r: 'RightHandPinky2',
  pinky_02_r: 'RightHandPinky3',
  pinky_03_r: 'RightHandPinky3',
};

const CAMERA_DEFAULT_POSITION = new THREE.Vector3(0, 1.1, 3.3);
const CAMERA_DEFAULT_TARGET = new THREE.Vector3(0, 0.65, 0);
const CAMERA_TRANSITION_SPEED = 2.25;
const FOCUS_OFFSET_DIRECTION = new THREE.Vector3(0.45, 0.3, 1).normalize();
const FOCUS_PADDING = 1.25;

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
    this.platform = null;
    this.glowRing = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.mixer = null;
    this.activeAction = null;
    this.currentSkinnedMesh = null;
    this.orbitControls = null;
    this.autoRotateEnabled = false;

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
    this.orbitControls.dampingFactor = 0.08;
    this.orbitControls.enablePan = true;
    this.orbitControls.screenSpacePanning = true;
    this.orbitControls.panSpeed = 0.65;
    this.orbitControls.rotateSpeed = 0.6;
    this.orbitControls.zoomSpeed = 1.1;
    this.orbitControls.maxPolarAngle = Math.PI * 0.58;
    this.orbitControls.minDistance = 1.6;
    this.orbitControls.maxDistance = 6.5;
    this.orbitControls.target.copy(this.defaultCameraTarget);
    this.orbitControls.autoRotate = this.autoRotateEnabled;
    this.orbitControls.autoRotateSpeed = 1.2;
    this.orbitControls.addEventListener('start', () => {
      if (this.autoRotateEnabled) {
        this.setAutoRotate(false);
      }
    });
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
      })
    );
  }

  emitStageEvent(event, detail) {
    this.bus?.emit?.(event, detail);
  }

  startCameraTransition(position, target, { immediate = false } = {}) {
    if (!this.camera) {
      return;
    }

    const safePosition = position || this.defaultCameraPosition;
    const safeTarget = target || this.defaultCameraTarget;

    if (immediate || !this.orbitControls) {
      this.camera.position.copy(safePosition);
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
    this.cameraTargetPosition.copy(safePosition);
    this.controlsStartTarget.copy(this.orbitControls.target);
    this.controlsTarget.copy(safeTarget);
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
      this.orbitControls.autoRotate = this.autoRotateEnabled;
    }
    this.emitStageEvent('stage:auto-rotate-changed', { enabled: this.autoRotateEnabled });
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
    // The viewport should remain clear so the active model is unobstructed.
    this.platform = null;
    this.glowRing = null;
  }

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

    model.position.set(0, 0, 0);
    model.rotation.set(0, Math.PI / 4, 0);

    const scale = weapon.preview?.scale ?? 1.2;
    model.scale.setScalar(scale);

    this.currentModel = model;
    this.stageGroup.add(model);

    this.applyRarityGlow(weapon.rarity);
    this.focusOnCurrentModel({ immediate: false });
    this.emitStageEvent('stage:model-ready', {
      type: 'weapon',
      id: weapon.id,
      name: weapon.name,
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
    this.currentSkinnedMesh = this.findFirstSkinnedMesh(model);

    this.mixer = new THREE.AnimationMixer(model);
    this.activeAction = null;
    this.focusOnCurrentModel({ immediate: false });
    this.emitStageEvent('stage:model-ready', {
      type: 'critter',
      id: critter.id,
      name: critter.name,
    });
    this.pendingCritterId = null;
  }

  async playAnimation(animation) {
    if (!this.currentModel || !animation?.path) {
      return;
    }

    if (!this.mixer) {
      this.mixer = new THREE.AnimationMixer(this.currentModel);
    }

    const clipData = await this.resourceLoader.loadAnimationClip(animation.path);
    if (!clipData?.clip) {
      return;
    }

    let clip = clipData.clip;
    const targetMesh = this.getCurrentSkinnedMesh();
    const sourceMesh = this.findFirstSkinnedMesh(clipData.root);

    if (targetMesh && sourceMesh) {
      clip = await this.resourceLoader.retargetClip(targetMesh, sourceMesh, clip, {
        names: MIXAMO_TO_UE_BONE_MAP,
        hip: MIXAMO_TO_UE_BONE_MAP.pelvis,
      });
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
    this.currentSkinnedMesh = null;
  }

  getCurrentSkinnedMesh() {
    if (this.currentSkinnedMesh?.parent) {
      return this.currentSkinnedMesh;
    }

    this.currentSkinnedMesh = this.findFirstSkinnedMesh(this.currentModel);
    return this.currentSkinnedMesh;
  }

  findFirstSkinnedMesh(object) {
    if (!object) {
      return null;
    }

    let target = null;
    object.traverse?.((child) => {
      if (!target && child.isSkinnedMesh) {
        target = child;
      }
    });
    return target;
  }

  applyRarityGlow(rarity = 'common') {
    const color = RARITY_GLOWS[rarity] ?? RARITY_GLOWS.common;
    if (this.glowRing) {
      this.glowRing.material.color = new THREE.Color(color);
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
  }
}
