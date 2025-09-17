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
    this.stageGroup.name = 'stage-root';
    this.weaponGroup = new THREE.Group();
    this.weaponGroup.name = 'stage-weapon-group';
    this.critterGroup = new THREE.Group();
    this.critterGroup.name = 'stage-critter-group';
    this.activeWeaponModel = null;
    this.activeCritterModel = null;
    this.platform = null;
    this.glowRing = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
    this.controls = null;
    this.autoRotateEnabled = true;
    this.autoRotateSpeed = 0.4;
    this.defaultWeaponTarget = new THREE.Vector3(0, 0.4, 0);
    this.defaultCritterTarget = new THREE.Vector3(0, 1.05, 0);
    this.tempVector = new THREE.Vector3();

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    if (this.renderer?.domElement) {
      this.renderer.domElement.style.touchAction = 'none';
    }
    this.camera = this.createCamera();
    this.setupLights();
    this.setupEnvironment();
    this.scene.add(this.stageGroup);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.configureControls();

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

    if (this.autoRotateEnabled) {
      if (this.activeWeaponModel) {
        this.weaponGroup.rotation.y += delta * this.autoRotateSpeed;
      }

      if (this.activeCritterModel) {
        this.critterGroup.rotation.y += delta * this.autoRotateSpeed;
      }

      if (this.glowRing) {
        this.glowRing.rotation.z += delta * 0.2;
      }
    }
  }

  createCamera() {
    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 1.1, 3.3);
    const target = this.defaultCritterTarget ?? new THREE.Vector3(0, 0.9, 0);
    camera.lookAt(target);
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

    const requestId = weapon?.id ?? Symbol('weapon-request');
    this.pendingWeaponId = requestId;

    let model = null;
    if (weapon.modelPath) {
      model = await this.resourceLoader.loadModel(weapon.modelPath);
    }

    if (this.pendingWeaponId !== requestId) {
      this.disposeModel(model);
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel();
    }

    this.disposeWeaponModel();
    this.weaponGroup.rotation.set(0, 0, 0);

    this.applyPreviewTransform(model, weapon.preview, {
      rotation: { x: 0, y: Math.PI / 4, z: 0 },
      scale: 1.2,
    });

    model.userData.sourceId = weapon.id;
    this.activeWeaponModel = model;
    this.weaponGroup.add(model);

    this.applyRarityGlow(weapon.rarity);
    if (!this.activeCritterModel) {
      this.setControlsTarget(weapon.preview?.target, this.defaultWeaponTarget);
    }
    this.pendingWeaponId = null;
  }

  async loadCritter(critter) {
    if (!critter) return;

    const requestId = critter?.id ?? Symbol('critter-request');
    this.pendingCritterId = requestId;

    let model = null;
    if (critter.modelPath) {
      model = await this.resourceLoader.loadModel(critter.modelPath);
    }

    if (this.pendingCritterId !== requestId) {
      this.disposeModel(model);
      return;
    }

    if (!model) {
      model = this.createPlaceholderModel();
    }

    this.disposeCritterModel();
    this.critterGroup.rotation.set(0, 0, 0);

    this.applyPreviewTransform(model, critter.preview, {
      scale: 1,
    });

    model.userData.sourceId = critter.id;
    this.activeCritterModel = model;
    this.critterGroup.add(model);

    if (critter.preview?.glowColor != null) {
      this.setGlowColor(critter.preview.glowColor);
    } else if (!this.activeWeaponModel) {
      this.applyRarityGlow();
    }

    this.setControlsTarget(critter.preview?.target, this.defaultCritterTarget);
    this.pendingCritterId = null;
  }

  disposeWeaponModel() {
    if (!this.activeWeaponModel) return;
    this.weaponGroup.remove(this.activeWeaponModel);
    this.disposeModel(this.activeWeaponModel);
    this.activeWeaponModel = null;
  }

  disposeCritterModel() {
    if (!this.activeCritterModel) return;
    this.critterGroup.remove(this.activeCritterModel);
    this.disposeModel(this.activeCritterModel);
    this.activeCritterModel = null;
  }

  disposeModel(model) {
    if (!model) return;
    model.traverse?.((child) => {
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
  }

  applyPreviewTransform(model, preview = {}, defaults = {}) {
    const position = preview?.position ?? defaults.position ?? { x: 0, y: 0, z: 0 };
    model.position.set(position.x ?? 0, position.y ?? 0, position.z ?? 0);

    const rotation = preview?.rotation ?? defaults.rotation ?? { x: 0, y: 0, z: 0 };
    model.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0);

    const scaleValue = preview?.scale ?? defaults.scale ?? 1;
    if (typeof scaleValue === 'number') {
      model.scale.setScalar(scaleValue);
    } else if (scaleValue && typeof scaleValue === 'object') {
      model.scale.set(scaleValue.x ?? 1, scaleValue.y ?? 1, scaleValue.z ?? 1);
    } else {
      model.scale.setScalar(1);
    }
  }

  setAutoRotate(enabled) {
    this.autoRotateEnabled = Boolean(enabled);
  }

  applyRarityGlow(rarity = 'common') {
    const color = RARITY_GLOWS[rarity] ?? RARITY_GLOWS.common;
    this.setGlowColor(color);
  }

  setGlowColor(color) {
    if (this.glowRing && color != null) {
      this.glowRing.material.color = new THREE.Color(color);
    }
  }

  setControlsTarget(target, fallback) {
    if (!this.controls) return;
    if (target) {
      this.controls.target.copy(this.toVector3(target));
    } else if (fallback) {
      if (fallback instanceof THREE.Vector3) {
        this.controls.target.copy(fallback);
      } else {
        this.controls.target.copy(this.toVector3(fallback));
      }
    }
    this.controls.update();
  }

  configureControls() {
    if (!this.controls) return;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.7;
    this.controls.zoomSpeed = 0.9;
    this.controls.panSpeed = 0.6;
    this.controls.enablePan = true;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 1.6;
    this.controls.maxDistance = 6;
    this.controls.minPolarAngle = 0.2;
    this.controls.maxPolarAngle = Math.PI - 0.2;
    this.controls.target.copy(this.defaultCritterTarget);
    this.controls.update();
  }

  toVector3(value) {
    if (value instanceof THREE.Vector3) {
      return value;
    }
    const { x = 0, y = 0, z = 0 } = value || {};
    return this.tempVector.set(x, y, z);
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
    this.controls?.update();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
    this.disposeWeaponModel();
    this.disposeCritterModel();
    this.controls?.dispose?.();
    this.controls = null;
    this.pendingWeaponId = null;
    this.pendingCritterId = null;
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
