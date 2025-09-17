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

const TARGET_CRITTER_HEIGHT = 1.6;
const CRITTER_PLATFORM_OFFSET = -0.58;

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
    this.weaponGroup = new THREE.Group();
    this.critterGroup = new THREE.Group();
    this.weaponModel = null;
    this.critterModel = null;
    this.platform = null;
    this.glowRing = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;

    this.controls = null;
    this.mixer = null;
    this.activeAction = null;
    this.availableAnimations = [];

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.camera = this.createCamera();
    this.setupLights();
    this.setupEnvironment();
    this.scene.add(this.stageGroup);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.55;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 5;
    this.controls.maxPolarAngle = Math.PI * 0.45;
    this.controls.target.set(0, 0.9, 0);
    this.controls.update();

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
    this.mixer?.update(delta);

    if (this.weaponModel) {
      this.weaponModel.rotation.y += delta * 0.35;
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
    this.stageGroup.add(this.critterGroup);
    this.stageGroup.add(this.weaponGroup);
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

    this.disposeWeaponModel();
    this.weaponModel = model;
    this.weaponGroup.add(model);

    this.applyRarityGlow(weapon.rarity);
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

  async loadCritter(critter) {
    if (!critter) return [];

    const requestId = (this.pendingCritterId = critter.id);

    let gltf = null;
    if (critter.modelPath) {
      gltf = await this.resourceLoader.loadGLTF(critter.modelPath);
    }

    if (this.pendingCritterId !== requestId) {
      return [];
    }

    let model = gltf?.scene ?? null;
    if (!model) {
      model = new THREE.Group();
      model.add(this.createPlaceholderModel());
    }

    model.traverse?.((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = false;
      }
    });

    this.disposeCritterModel();

    this.critterModel = model;
    const bounds = this.prepareCritterModel(model);
    this.critterGroup.add(model);

    this.mixer?.stopAllAction();
    this.mixer = new THREE.AnimationMixer(model);
    this.activeAction = null;
    this.availableAnimations = [];

    const loadedAnimations = [];
    for (const animation of critter.animations ?? []) {
      const animationGltf = await this.resourceLoader.loadGLTF(animation.path);
      if (this.pendingCritterId !== requestId) {
        return [];
      }

      const clip = animationGltf?.animations?.[0];
      if (!clip) {
        continue;
      }

      clip.name = animation.id;
      loadedAnimations.push({
        id: animation.id,
        name: animation.name,
        clip,
      });
    }

    if (this.pendingCritterId !== requestId) {
      return [];
    }

    this.availableAnimations = loadedAnimations;
    this.updateControlsTargetFromBox(bounds);

    this.pendingCritterId = null;
    return loadedAnimations.map(({ id, name }) => ({ id, name }));
  }

  playAnimation(animationId) {
    if (!this.mixer || this.availableAnimations.length === 0) {
      return false;
    }

    const animation =
      this.availableAnimations.find((entry) => entry.id === animationId) || this.availableAnimations[0];
    if (!animation) {
      return false;
    }

    const action = this.mixer.clipAction(animation.clip);
    action.enabled = true;
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = true;

    if (this.activeAction && this.activeAction !== action) {
      this.activeAction.fadeOut(0.25);
    }

    action.reset();
    action.fadeIn(0.25);
    action.play();
    this.activeAction = action;
    return true;
  }

  disposeCritterModel() {
    if (this.critterModel) {
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
    }

    this.mixer?.stopAllAction();
    this.mixer = null;
    this.activeAction = null;
    this.availableAnimations = [];
  }

  prepareCritterModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const currentHeight = Math.max(size.y, 0.001);
    const scale = TARGET_CRITTER_HEIGHT / currentHeight;
    model.scale.setScalar(scale);

    box.setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;
    model.position.y += CRITTER_PLATFORM_OFFSET;

    model.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(model);
  }

  updateControlsTargetFromBox(box) {
    if (!this.controls || !box) return;
    const center = box.getCenter(new THREE.Vector3());
    this.controls.target.copy(center);
    this.controls.update();
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
