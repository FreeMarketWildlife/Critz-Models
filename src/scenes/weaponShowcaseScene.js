import * as THREE from 'https://cdn.skypack.dev/three@0.158.0';

function resolveColor(accent) {
  const color = new THREE.Color();
  if (!accent) {
    color.set('#8a67ff');
    return color;
  }

  try {
    color.set(accent);
  } catch (error) {
    console.warn('Failed to parse accent color, falling back to default.', accent, error);
    color.set('#8a67ff');
  }

  return color;
}

export default class WeaponShowcaseScene {
  constructor({ mount }) {
    this.mount = mount;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationId = null;
    this.pivot = null;
    this.placeholder = null;
    this.currentWeapon = null;
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x090512, 0.02);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 1.2, 3.4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.shadowMap.enabled = true;
    this.mount.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0x7a6cff, 0.5);
    const fill = new THREE.DirectionalLight(0xd8b2ff, 0.8);
    fill.position.set(-4, 6, 8);
    const rim = new THREE.DirectionalLight(0x7de0ff, 0.7);
    rim.position.set(5, 3, -6);

    this.scene.add(ambient, fill, rim);

    const floorGeometry = new THREE.CircleGeometry(2.2, 48);
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: 0x2f1d4f,
      transparent: true,
      opacity: 0.45,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);

    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    this.placeholder = this.createPlaceholderMesh();
    this.pivot.add(this.placeholder);

    this.animate();
  }

  createPlaceholderMesh() {
    const geometry = new THREE.CylinderGeometry(0.18, 0.45, 1.6, 24, 1, true);
    const material = new THREE.MeshStandardMaterial({
      color: 0x9a7bff,
      emissive: 0x221133,
      roughness: 0.35,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const runeGeometry = new THREE.RingGeometry(0.5, 0.55, 32);
    const runeMaterial = new THREE.MeshBasicMaterial({
      color: 0x88aaff,
      transparent: true,
      opacity: 0.6,
    });
    const rune = new THREE.Mesh(runeGeometry, runeMaterial);
    rune.rotation.x = Math.PI / 2;
    rune.position.y = -0.8;

    mesh.add(rune);

    return mesh;
  }

  presentWeapon(weapon) {
    this.currentWeapon = weapon;

    if (!weapon) {
      const baseColor = resolveColor('#9a7bff');
      this.placeholder.material.color.copy(baseColor);
      this.placeholder.material.emissive.set('#221133');
      this.pivot.scale.setScalar(1);
      return;
    }

    const accent = weapon.visual?.accentColor || weapon.stats?.elementColor;
    const accentColor = resolveColor(accent);

    this.placeholder.material.color.copy(accentColor);
    this.placeholder.material.emissive.copy(accentColor).multiplyScalar(0.25);

    // Placeholder scale modulation to hint at different weapon sizes
    const scale = weapon.visual?.displayScale || 1;
    this.pivot.scale.setScalar(scale);
  }

  setSize(width, height) {
    if (!this.renderer || !this.camera) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.pivot) {
      this.pivot.rotation.y += 0.0035;
      const pulse = 0.05 * Math.sin(Date.now() * 0.0015) + 1;
      this.placeholder.scale.y = pulse;
    }
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.placeholder) {
      this.placeholder.geometry.dispose();
      this.placeholder.material.dispose();
    }
    if (this.mount && this.renderer && this.renderer.domElement.parentNode === this.mount) {
      this.mount.removeChild(this.renderer.domElement);
    }
  }
}
