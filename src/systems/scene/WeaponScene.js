import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

export class WeaponScene {
  constructor(container, { eventBus }) {
    this.container = container;
    this.eventBus = eventBus;

    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;

    this.weaponGroup = null;
    this.placeholderMesh = null;
    this.pedestalMesh = null;
    this.runeMesh = null;

    this.animationId = null;
    this.clock = new THREE.Clock();

    this.currentThemeColor = new THREE.Color('#f7c77d');

    this.onResize = this.onResize.bind(this);
  }

  init() {
    if (!this.container) {
      throw new Error('WeaponScene requires a container element.');
    }

    const { clientWidth, clientHeight } = this.container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(32, clientWidth / clientHeight, 0.1, 100);
    this.camera.position.set(0, 1.8, 4.2);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x07060f, 0.12);

    this.#createLights();
    this.#createBackdrop();
    this.#createWeaponAnchor();

    this.eventBus.on('weapon:selected', ({ weapon, category }) => {
      this.#updateWeapon(weapon, category);
    });

    window.addEventListener('resize', this.onResize);
    this.onResize();
    this.#animate();
  }

  onResize() {
    if (!this.renderer || !this.camera) {
      return;
    }

    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  #createLights() {
    const ambient = new THREE.AmbientLight(0x8074b2, 0.8);
    this.scene.add(ambient);

    const rimLight = new THREE.DirectionalLight(0xb59bff, 0.65);
    rimLight.position.set(-4, 6, 6);
    this.scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x3fd3ff, 1.2, 12, 2);
    fillLight.position.set(3, 2, 2);
    this.scene.add(fillLight);

    const emberLight = new THREE.PointLight(0xff9d5c, 0.9, 10, 2);
    emberLight.position.set(-2.5, 1.6, -1.5);
    this.scene.add(emberLight);
  }

  #createBackdrop() {
    const planeGeometry = new THREE.PlaneGeometry(18, 18, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0b0a15,
      transparent: true,
      opacity: 0.65,
    });
    const backdrop = new THREE.Mesh(planeGeometry, planeMaterial);
    backdrop.position.set(0, 1.8, -6);
    this.scene.add(backdrop);

    const haloGeometry = new THREE.RingGeometry(1.2, 4.8, 64, 1, 0, Math.PI * 2);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x7057ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -0.62;
    this.scene.add(halo);
  }

  #createWeaponAnchor() {
    this.weaponGroup = new THREE.Group();
    this.scene.add(this.weaponGroup);

    const pedestalGeometry = new THREE.CylinderGeometry(0.85, 1.05, 0.2, 32);
    const pedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f152f,
      roughness: 0.35,
      metalness: 0.78,
      emissive: 0x1a0f2d,
      emissiveIntensity: 0.6,
    });
    this.pedestalMesh = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    this.pedestalMesh.position.y = -0.8;
    this.weaponGroup.add(this.pedestalMesh);

    const runeGeometry = new THREE.RingGeometry(0.95, 1.35, 64);
    const runeMaterial = new THREE.MeshBasicMaterial({
      color: this.currentThemeColor,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    this.runeMesh = new THREE.Mesh(runeGeometry, runeMaterial);
    this.runeMesh.rotation.x = -Math.PI / 2;
    this.runeMesh.position.y = -0.7;
    this.weaponGroup.add(this.runeMesh);

    const sigilGeometry = new THREE.CircleGeometry(0.4, 32);
    const sigilMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.22,
      transparent: true,
    });
    const sigil = new THREE.Mesh(sigilGeometry, sigilMaterial);
    sigil.rotation.x = -Math.PI / 2;
    sigil.position.y = -0.68;
    this.weaponGroup.add(sigil);

    const placeholderGeometry = new THREE.BoxGeometry(1.4, 0.4, 0.4);
    const placeholderMaterial = new THREE.MeshStandardMaterial({
      color: 0x5e48ad,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x24164b,
      emissiveIntensity: 0.7,
    });
    this.placeholderMesh = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
    this.placeholderMesh.position.y = 0.4;
    this.weaponGroup.add(this.placeholderMesh);

    const focusSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
    );
    focusSphere.position.y = 0.9;
    this.weaponGroup.add(focusSphere);
  }

  #updateWeapon(weapon, category) {
    if (!weapon) {
      return;
    }

    const themeColor = category?.theme?.primaryColor || '#f7c77d';
    this.currentThemeColor.set(themeColor);

    if (this.placeholderMesh?.material) {
      this.placeholderMesh.material.color.set(themeColor);
      this.placeholderMesh.material.emissive.set(this.currentThemeColor.clone().multiplyScalar(0.35));
    }

    if (this.runeMesh?.material) {
      this.runeMesh.material.color.set(themeColor);
    }

    const scaleFactor = weapon.model?.scale ?? 1;
    this.placeholderMesh.scale.set(0.8 * scaleFactor, 0.45 * scaleFactor, 2.1 * scaleFactor);

    if (Array.isArray(weapon.model?.position)) {
      const [x = 0, y = 0, z = 0] = weapon.model.position;
      this.placeholderMesh.position.set(x, 0.4 + y, z);
    } else {
      this.placeholderMesh.position.set(0, 0.4, 0);
    }

    if (Array.isArray(weapon.model?.rotation)) {
      const [x = 0, y = 0, z = 0] = weapon.model.rotation;
      this.placeholderMesh.rotation.set(x, y, z);
    } else {
      this.placeholderMesh.rotation.set(0, Math.PI / 8, 0);
    }
  }

  #animate() {
    this.animationId = requestAnimationFrame(() => this.#animate());

    const elapsed = this.clock.getElapsedTime();

    if (this.weaponGroup) {
      this.weaponGroup.rotation.y = elapsed * 0.15;
    }

    if (this.runeMesh?.material) {
      this.runeMesh.material.opacity = 0.2 + Math.sin(elapsed * 1.5) * 0.1;
    }

    if (this.pedestalMesh?.material) {
      const intensity = 0.6 + Math.sin(elapsed * 0.8) * 0.2;
      this.pedestalMesh.material.emissiveIntensity = intensity;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
