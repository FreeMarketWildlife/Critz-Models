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
    this.currentCritterId = null;
    this.platform = null;
    this.glowRing = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.mixer = null;
    this.activeAction = null;
    this.orbitControls = null;

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
    this.orbitControls.enablePan = false;
    this.orbitControls.maxPolarAngle = Math.PI * 0.52;
    this.orbitControls.minDistance = 2.0;
    this.orbitControls.maxDistance = 6.0;
    this.orbitControls.target.set(0, 0.65, 0);
    this.orbitControls.update();
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

    const scale = weapon.preview?.scale ?? 1.2;
    model.scale.setScalar(scale);

    this.disposeCurrentModel();
    this.currentModel = model;
    this.stageGroup.add(model);

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
      model = this.createPlaceholderModel();
    }

    this.disposeCurrentModel();

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
