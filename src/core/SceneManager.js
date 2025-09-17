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

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 1.1, 3.3);
const DEFAULT_CAMERA_TARGET = new THREE.Vector3(0, 0.6, 0);
const SCRATCH_VECTOR = new THREE.Vector3();
const SCRATCH_BOX = new THREE.Box3();

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    this.resourceLoader = new ResourceLoader();
    this.animationFrame = null;

    this.stageGroup = new THREE.Group();
    this.weaponGroup = new THREE.Group();
    this.weaponModel = null;
    this.critterGroup = new THREE.Group();
    this.critterModel = null;
    this.critterMixer = null;
    this.critterActions = new Map();
    this.critterClips = new Map();
    this.critterActiveAction = null;
    this.platform = null;
    this.glowRing = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.pendingAnimationId = null;
    this.activeCritter = null;
    this.activeAnimationId = null;
    this.critterFocusPoint = DEFAULT_CAMERA_TARGET.clone();

    this.defaultCameraPosition = DEFAULT_CAMERA_POSITION.clone();
    this.defaultCameraTarget = DEFAULT_CAMERA_TARGET.clone();

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
    this.stageGroup.add(this.weaponGroup);
    this.stageGroup.add(this.critterGroup);

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.resetCamera();
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
    if (this.weaponModel) {
      this.weaponGroup.rotation.y += delta * 0.4;
    }

    if (this.glowRing) {
      this.glowRing.rotation.z += delta * 0.2;
    }

    if (this.critterMixer) {
      this.critterMixer.update(delta);
    }

    if (this.controls) {
      this.controls.update();
    }
  }

  createCamera() {
    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.copy(this.defaultCameraPosition);
    camera.lookAt(this.defaultCameraTarget);
    return camera;
  }

  createControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.minDistance = 1.6;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.target.copy(this.defaultCameraTarget);
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

    const requestId = (this.pendingWeaponId = weapon.id);

    let model = null;
    if (weapon.modelPath) {
      model = await this.resourceLoader.loadModel(weapon.modelPath);
    }

    if (this.pendingWeaponId !== requestId) {
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel();
    }

    model.position.set(0, 0, 0);
    model.rotation.set(0, Math.PI / 4, 0);

    const scale = weapon.preview?.scale ?? (weapon.modelPath ? 1.2 : 0.75);
    model.scale.setScalar(scale);

    this.disposeWeaponModel();
    this.weaponGroup.position.set(
      weapon.preview?.offset?.[0] ?? 1.2,
      weapon.preview?.offset?.[1] ?? -0.1,
      weapon.preview?.offset?.[2] ?? 0
    );
    this.weaponGroup.rotation.set(0, 0, 0);
    this.weaponGroup.add(model);
    this.weaponModel = model;

    this.applyRarityGlow(weapon.rarity);
  }

  async loadCritter(critter) {
    if (!critter) return;

    const requestId = (this.pendingCritterId = critter.id);

    let model = null;
    if (critter.modelPath) {
      model = await this.resourceLoader.loadModel(critter.modelPath);
    }

    if (this.pendingCritterId !== requestId) {
      return;
    }

    if (!model) {
      console.warn(`Critter model at path "${critter.modelPath}" was not found.`);
      return;
    }

    const { root, focusPoint } = this.prepareCritterModel(model, critter);
    const preview = critter.preview ?? {};
    const floorHeight = this.getStageFloorHeight();
    const [offsetX = 0, offsetY = 0, offsetZ = 0] = preview.position ?? [];
    root.position.set(offsetX, floorHeight + offsetY, offsetZ);

    if (Array.isArray(preview.rotation)) {
      const [rx = 0, ry = 0, rz = 0] = preview.rotation;
      root.rotation.set(rx, ry, rz);
    }

    this.disposeCritterModel();
    this.critterGroup.add(root);
    this.critterModel = root;
    this.activeCritter = critter;
    this.critterMixer = new THREE.AnimationMixer(root);
    this.critterActions.clear();
    this.critterClips.clear();
    this.critterActiveAction = null;
    this.pendingAnimationId = null;
    this.activeAnimationId = null;

    const cameraSettings = preview.camera ?? {};
    const focus = focusPoint.clone().add(root.position);
    this.critterFocusPoint.copy(focus);
    if (cameraSettings.target) {
      this.defaultCameraTarget.fromArray(cameraSettings.target);
    } else {
      this.defaultCameraTarget.copy(focus);
    }

    const distance = cameraSettings.distance ?? 3.2;
    const elevation = cameraSettings.elevation ?? 0.85;
    const [offsetCameraX = 0, offsetCameraZ = 0] = cameraSettings.offset ?? [0, 0];
    this.defaultCameraPosition.set(
      this.defaultCameraTarget.x + offsetCameraX,
      this.defaultCameraTarget.y + elevation,
      this.defaultCameraTarget.z + offsetCameraZ + distance
    );

    if (this.controls) {
      this.controls.minDistance = cameraSettings.minDistance ?? 1.6;
      this.controls.maxDistance = cameraSettings.maxDistance ?? 6.0;
    }

    this.resetCamera();
  }

  prepareCritterModel(model, critter) {
    const preview = critter.preview ?? {};
    const root = new THREE.Group();
    root.name = `critter-${critter.id}`;
    root.add(model);

    SCRATCH_BOX.makeEmpty();
    SCRATCH_BOX.setFromObject(model);
    const size = SCRATCH_BOX.getSize(SCRATCH_VECTOR.set(0, 0, 0));
    const center = SCRATCH_BOX.getCenter(SCRATCH_VECTOR.set(0, 0, 0));

    model.position.sub(center);
    model.position.y -= SCRATCH_BOX.min.y;

    const targetHeight = preview.targetHeight;
    if (targetHeight && size.y > 0) {
      const factor = targetHeight / size.y;
      root.scale.setScalar(factor);
    } else {
      const scale = preview.scale ?? 1;
      root.scale.setScalar(scale);
    }

    root.updateMatrixWorld(true);

    SCRATCH_BOX.makeEmpty();
    SCRATCH_BOX.setFromObject(root);
    const finalSize = SCRATCH_BOX.getSize(SCRATCH_VECTOR.set(0, 0, 0));

    const focus = new THREE.Vector3(
      preview.focus?.[0] ?? 0,
      preview.focus?.[1] ?? SCRATCH_BOX.min.y + finalSize.y * (preview.focusRatio ?? 0.62),
      preview.focus?.[2] ?? 0
    );

    return { root, focusPoint: focus };
  }

  async playCritterAnimation(critter, animation) {
    if (!this.critterModel || !this.critterMixer) return;
    if (!critter || !animation) return;
    if (!this.activeCritter || this.activeCritter.id !== critter.id) return;

    const requestId = (this.pendingAnimationId = animation.id);
    let clip = this.critterClips.get(animation.id);

    if (!clip) {
      clip = await this.resourceLoader.loadAnimation(animation.path);
      if (this.pendingAnimationId !== requestId) {
        return;
      }
      if (!clip) {
        console.warn(`Animation clip at path "${animation.path}" could not be loaded.`);
        return;
      }
      this.critterClips.set(animation.id, clip);
    }

    if (this.pendingAnimationId !== requestId) {
      return;
    }

    let action = this.critterActions.get(animation.id);
    if (!action) {
      action = this.critterMixer.clipAction(clip);
      const shouldLoop = animation.loop !== false;
      action.setLoop(shouldLoop ? THREE.LoopRepeat : THREE.LoopOnce, shouldLoop ? Infinity : 1);
      action.clampWhenFinished = !shouldLoop;
      action.timeScale = animation.speed ?? 1;
      this.critterActions.set(animation.id, action);
    }

    if (this.critterActiveAction && this.critterActiveAction !== action) {
      this.critterActiveAction.fadeOut(0.25);
    }

    action.reset();
    action.fadeIn(0.2);
    action.play();

    this.critterActiveAction = action;
    this.activeAnimationId = animation.id;
  }

  disposeWeaponModel() {
    if (!this.weaponModel) return;
    this.weaponGroup.remove(this.weaponModel);
    this.weaponModel.traverse?.((child) => {
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
    this.weaponModel = null;
  }

  disposeCritterModel() {
    if (!this.critterModel) return;
    this.critterGroup.remove(this.critterModel);
    this.critterModel.traverse?.((child) => {
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
    this.critterModel = null;
    this.critterMixer?.stopAllAction?.();
    this.critterMixer = null;
    this.critterActions.clear();
    this.critterClips.clear();
    this.critterActiveAction = null;
    this.activeCritter = null;
    this.pendingCritterId = null;
    this.pendingAnimationId = null;
    this.activeAnimationId = null;
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

  resetCamera() {
    if (!this.camera) return;
    this.camera.position.copy(this.defaultCameraPosition);
    this.camera.lookAt(this.defaultCameraTarget);
    if (this.controls) {
      this.controls.target.copy(this.defaultCameraTarget);
      this.controls.update();
    }
  }

  getStageFloorHeight() {
    if (!this.platform || !this.platform.geometry?.parameters?.height) {
      return -0.64;
    }
    const height = this.platform.geometry.parameters.height;
    return this.platform.position.y + height / 2;
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
    this.disposeWeaponModel();
    this.disposeCritterModel();
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
