import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { createRenderer } from './RendererFactory.js';
import { ResourceLoader } from './ResourceLoader.js';

const RARITY_GLOWS = {
  common: 0x6ea56f,
  rare: 0x7ad0c0,
  epic: 0xc7b8ff,
  legendary: 0xf2c977,
  mythic: 0xf5f0bc,
};

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x16261b, 0.045);
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.resourceLoader = new ResourceLoader();
    this.animationFrame = null;

    this.stageGroup = new THREE.Group();
    this.currentModel = null;
    this.platform = null;
    this.glowRing = null;
    this.canopy = null;
    this.fireflies = null;
    this.pendingWeaponId = null;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer = createRenderer(this.container);
    this.camera = this.createCamera();
    this.setupLights();
    this.setupEnvironment();
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
    if (this.currentModel) {
      this.currentModel.rotation.y += delta * 0.4;
    }

    if (this.glowRing) {
      this.glowRing.rotation.z += delta * 0.2;
    }

    if (this.fireflies) {
      const { geometry, infos } = this.fireflies;
      const positions = geometry.attributes.position;
      for (let i = 0; i < infos.length; i += 1) {
        const info = infos[i];
        info.phase += delta * info.speed;
        const index = i * 3;
        positions.array[index] = info.baseX + Math.sin(info.phase * 0.35) * info.drift;
        positions.array[index + 1] = info.baseY + Math.sin(info.phase) * info.amplitude;
        positions.array[index + 2] = info.baseZ + Math.cos(info.phase * 0.28) * info.drift;
      }
      positions.needsUpdate = true;
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
    const ambient = new THREE.AmbientLight(0xf4ead8, 0.55);

    const rimLight = new THREE.DirectionalLight(0xc9ffd9, 1.05);
    rimLight.position.set(-3.2, 4.4, 2.4);

    const fillLight = new THREE.SpotLight(0xf2d7a0, 1.1, 18, Math.PI / 4.5, 0.9, 1.6);
    fillLight.position.set(2.4, 4, 1.2);
    fillLight.target.position.set(0, 0.4, 0);

    const bounceLight = new THREE.PointLight(0x8fd4c3, 0.65, 6, 2.2);
    bounceLight.position.set(0.2, 1.35, 0.65);

    const backLight = new THREE.DirectionalLight(0x3c6f53, 0.5);
    backLight.position.set(0.4, 1.8, -2.6);

    this.scene.add(fillLight.target);
    this.scene.add(ambient, rimLight, fillLight, bounceLight, backLight);
  }

  setupEnvironment() {
    const platformGeometry = new THREE.CylinderGeometry(1.6, 1.72, 0.16, 48, 1, true);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b2a1f,
      emissive: 0x071008,
      metalness: 0.18,
      roughness: 0.72,
      transparent: true,
      opacity: 0.95,
    });
    this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
    this.platform.rotation.x = Math.PI / 2;
    this.platform.position.set(0, -0.72, 0);
    this.platform.receiveShadow = false;

    const ringGeometry = new THREE.TorusGeometry(1.72, 0.04, 16, 120);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x9ad17b,
      transparent: true,
      opacity: 0.6,
    });
    this.glowRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.glowRing.rotation.x = Math.PI / 2;
    this.glowRing.position.y = -0.32;

    const canopyGeometry = new THREE.CircleGeometry(2.6, 64);
    const canopyMaterial = new THREE.MeshBasicMaterial({
      color: 0x14281d,
      transparent: true,
      opacity: 0.42,
    });
    this.canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
    this.canopy.rotation.x = -Math.PI / 2;
    this.canopy.position.set(0, -0.9, -0.6);

    this.stageGroup.add(this.platform);
    this.stageGroup.add(this.glowRing);
    this.stageGroup.add(this.canopy);

    this.createFireflies();
  }

  createFireflies() {
    if (this.fireflies) {
      this.stageGroup.remove(this.fireflies.points);
      this.fireflies.geometry.dispose?.();
      this.fireflies.points.material.dispose?.();
      this.fireflies = null;
    }

    const fireflyCount = 36;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(fireflyCount * 3);
    const infos = [];

    for (let i = 0; i < fireflyCount; i += 1) {
      const baseX = (Math.random() - 0.5) * 2.4;
      const baseY = Math.random() * 1.3 + 0.25;
      const baseZ = (Math.random() - 0.5) * 1.8;

      positions[i * 3] = baseX;
      positions[i * 3 + 1] = baseY;
      positions[i * 3 + 2] = baseZ;

      infos.push({
        baseX,
        baseY,
        baseZ,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
        amplitude: 0.08 + Math.random() * 0.18,
        drift: 0.02 + Math.random() * 0.05,
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xf6f3d2,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.renderOrder = 2;

    this.fireflies = { points, geometry, infos };
    this.stageGroup.add(points);
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
      color: 0x9ad17b,
      emissive: 0x163822,
      metalness: 0.24,
      roughness: 0.36,
      emissiveIntensity: 0.55,
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
    if (this.fireflies) {
      this.stageGroup.remove(this.fireflies.points);
      this.fireflies.geometry.dispose?.();
      this.fireflies.points.material.dispose?.();
      this.fireflies = null;
    }

    if (this.canopy) {
      this.stageGroup.remove(this.canopy);
      this.canopy.material.dispose?.();
      this.canopy.geometry.dispose?.();
      this.canopy = null;
    }
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
