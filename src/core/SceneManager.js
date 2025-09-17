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

    this.stageGroup = new THREE.Group();
    this.weaponGroup = new THREE.Group();
    this.critterGroup = new THREE.Group();
    this.currentModel = null;
    this.platform = null;
    this.glowRing = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.pendingAnimationId = null;
    this.critterModel = null;
    this.critterMixer = null;
    this.currentAnimationAction = null;
    this.controls = null;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.camera = this.createCamera();
    this.setupLights();
    this.setupEnvironment();
    this.setupControls();
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
    if (this.glowRing) {
      this.glowRing.rotation.z += delta * 0.2;
    }

    if (this.controls) {
      this.controls.update();
    }

    if (this.critterMixer) {
      this.critterMixer.update(delta);
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
    this.stageGroup.add(this.weaponGroup);
    this.stageGroup.add(this.critterGroup);
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

    this.disposeCurrentModel();

    if (!model) {
      this.applyRarityGlow(weapon.rarity);
      return;
    }

    model.position.set(0, 0, 0);
    model.rotation.set(0, Math.PI / 4, 0);

    const scale = weapon.preview?.scale ?? 1.2;
    model.scale.setScalar(scale);

    this.currentModel = model;
    this.weaponGroup.add(model);

    this.applyRarityGlow(weapon.rarity);
  }

  disposeCurrentModel() {
    if (!this.currentModel) return;
    this.weaponGroup.remove(this.currentModel);
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

  setupControls() {
    if (!this.camera || !this.renderer) return;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.8;
    this.controls.maxDistance = 6.5;
    this.controls.minPolarAngle = Math.PI / 6;
    this.controls.maxPolarAngle = Math.PI - Math.PI / 12;
    this.controls.target.set(0, 0.85, 0);
    this.controls.update();
  }

  async loadCritter(critter) {
    const critterId = critter?.id ?? null;
    this.pendingCritterId = critterId;

    if (!critter || !critter.modelPath) {
      this.disposeCritter();
      return;
    }

    const model = await this.resourceLoader.loadModel(critter.modelPath);
    if (this.pendingCritterId !== critterId) {
      return;
    }

    this.setCritterModel(model, critterId);
  }

  setCritterModel(model, critterId) {
    this.disposeCritter();
    if (!model) return;

    model.name = `critter-${critterId}`;
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);

    const pivot = new THREE.Group();
    pivot.name = `critter-pivot-${critterId}`;
    pivot.add(model);
    this.critterGroup.add(pivot);

    this.critterModel = model;
    this.critterMixer = new THREE.AnimationMixer(model);
    this.currentAnimationAction = null;

    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const height = size.y || 1;

    model.position.sub(center);
    model.position.y += height / 2;

    const targetY = Math.min(Math.max(height * 0.55, 0.6), 1.6);
    if (this.controls) {
      this.controls.target.set(0, targetY, 0);
      this.controls.update();
    }

    if (this.camera) {
      const distance = Math.min(Math.max(height * 1.6, 2.6), 4.8);
      this.camera.position.set(0, targetY + 0.35, distance);
      this.camera.lookAt(0, targetY, 0);
    }
  }

  async playAnimation(animation) {
    this.pendingAnimationId = animation?.id ?? null;

    if (!animation || !this.critterMixer || !this.critterModel) {
      this.stopAnimation();
      return;
    }

    const clips = await this.resourceLoader.loadAnimationClips(animation.path);
    if (this.pendingAnimationId !== animation.id) {
      return;
    }

    if (!Array.isArray(clips) || clips.length === 0) {
      this.stopAnimation();
      return;
    }

    const clip = clips[0];
    this.critterMixer.stopAllAction();
    const action = this.critterMixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = true;
    action.fadeIn(0.2);
    action.play();

    this.currentAnimationAction = action;
  }

  stopAnimation() {
    this.pendingAnimationId = null;
    if (this.critterMixer) {
      this.critterMixer.stopAllAction();
    }
    this.currentAnimationAction = null;
  }

  disposeCritter() {
    this.pendingCritterId = null;
    this.pendingAnimationId = null;

    if (this.critterMixer) {
      this.critterMixer.stopAllAction();
      this.critterMixer = null;
    }

    this.currentAnimationAction = null;

    if (this.critterGroup.children.length > 0) {
      const nodes = [...this.critterGroup.children];
      nodes.forEach((node) => {
        this.critterGroup.remove(node);
        node.traverse?.((child) => {
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
      });
    }

    this.critterModel = null;
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
    this.disposeCurrentModel();
    this.disposeCritter();
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
