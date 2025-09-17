import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class ResourceLoader {
  constructor() {
    this.cache = new Map();
    this.loaderPromise = null;
    this.skeletonUtilsPromise = null;
  }

  async loadModel(path) {
    if (!path) {
      return this._createPlaceholder('weapon-generic', { markMissing: true });
    }

    if (path.startsWith('placeholder:')) {
      const cachedPlaceholder = this.cache.get(path);
      if (cachedPlaceholder?.type === 'placeholder') {
        return cachedPlaceholder.object.clone();
      }

      const placeholderId = path.slice('placeholder:'.length) || 'weapon-generic';
      const placeholder = this._createPlaceholder(placeholderId, { markMissing: false });
      this.cache.set(path, { type: 'placeholder', object: placeholder });
      return placeholder.clone();
    }

    const cached = this.cache.get(path);
    if (cached) {
      if (cached.type === 'model') {
        const { SkeletonUtils } = await this._getSkeletonUtils();
        return SkeletonUtils.clone(cached.scene);
      }

      if (cached.type === 'placeholder') {
        return cached.object.clone();
      }
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const scene = gltf.scene || gltf.scenes?.[0];
      if (scene) {
        this.cache.set(path, { type: 'model', scene });
        const { SkeletonUtils } = await this._getSkeletonUtils();
        return SkeletonUtils.clone(scene);
      }
    } catch (error) {
      console.warn(`Failed to load model at ${path}. Using fallback geometry instead.`, error);
    }

    const fallback = this._createPlaceholder('weapon-generic', { markMissing: true });
    this.cache.set(path, { type: 'placeholder', object: fallback });
    return fallback.clone();
  }

  async loadAnimationClip(path) {
    if (!path) {
      return null;
    }

    const cached = this.cache.get(path);
    if (cached && cached.type === 'animation') {
      return cached.clip.clone();
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const [clip] = gltf.animations || [];
      if (clip) {
        this.cache.set(path, { type: 'animation', clip });
        return clip.clone();
      }
    } catch (error) {
      console.warn(`Failed to load animation at ${path}.`, error);
    }

    return null;
  }

  async loadTexture(path) {
    if (!path) return null;
    if (this.cache.has(path)) {
      const cached = this.cache.get(path);
      if (cached?.type === 'texture') {
        return cached.texture;
      }
      return cached;
    }

    const textureLoader = new THREE.TextureLoader();
    try {
      const texture = await textureLoader.loadAsync(path);
      this.cache.set(path, { type: 'texture', texture });
      return texture;
    } catch (error) {
      console.warn(`Failed to load texture at ${path}.`, error);
      return null;
    }
  }

  async _getLoader() {
    if (!this.loaderPromise) {
      this.loaderPromise = import(
        'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'
      ).then((module) => new module.GLTFLoader());
    }
    return this.loaderPromise;
  }

  async _getSkeletonUtils() {
    if (!this.skeletonUtilsPromise) {
      this.skeletonUtilsPromise = import(
        'https://unpkg.com/three@0.160.0/examples/jsm/utils/SkeletonUtils.js'
      );
    }
    return this.skeletonUtilsPromise;
  }

  _createPlaceholder(id = 'weapon-generic', { markMissing = true } = {}) {
    const placeholderId = id || 'weapon-generic';
    const group = new THREE.Group();
    group.name = `placeholder-${placeholderId}`;

    if (markMissing) {
      group.userData.isPlaceholder = true;
    } else {
      group.userData.placeholderId = placeholderId;
    }

    switch (placeholderId) {
      case 'weapon-primary':
        this._buildPrimaryPlaceholder(group);
        break;
      case 'weapon-secondary':
        this._buildSecondaryPlaceholder(group);
        break;
      case 'weapon-melee':
        this._buildMeleePlaceholder(group);
        break;
      case 'weapon-utility':
        this._buildUtilityPlaceholder(group);
        break;
      default:
        this._buildGenericPlaceholder(group);
        break;
    }

    group.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return group;
  }

  _buildPrimaryPlaceholder(group) {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.22, 0.24),
      this._createMaterial(0xff6f91, { metalness: 0.45, roughness: 0.35 })
    );

    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.6, 20),
      this._createMaterial(0xffc75f, { metalness: 0.6, roughness: 0.2 })
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.85, 0.02, 0);

    const stock = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.28, 0.25),
      this._createMaterial(0x845ec2, { metalness: 0.25, roughness: 0.45 })
    );
    stock.position.set(-0.7, -0.04, 0);

    const magazine = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.36, 0.18),
      this._createMaterial(0x2c73d2, { metalness: 0.3, roughness: 0.5 })
    );
    magazine.position.set(0.15, -0.3, 0);
    magazine.rotation.z = Math.PI / 12;

    const scope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16),
      this._createMaterial(0xfff1e6, { metalness: 0.35, roughness: 0.25 })
    );
    scope.rotation.z = Math.PI / 2;
    scope.position.set(0.2, 0.18, 0.08);

    group.add(body, barrel, stock, magazine, scope);
  }

  _buildSecondaryPlaceholder(group) {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.26, 0.28),
      this._createMaterial(0x56ccf2, { metalness: 0.4, roughness: 0.35 })
    );

    const grip = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.36, 0.2),
      this._createMaterial(0x3a86ff, { metalness: 0.3, roughness: 0.5 })
    );
    grip.position.set(-0.2, -0.28, 0);
    grip.rotation.z = Math.PI / 9;

    const muzzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.35, 12),
      this._createMaterial(0xffbe0b, { metalness: 0.5, roughness: 0.3 })
    );
    muzzle.rotation.z = Math.PI / 2;
    muzzle.position.set(0.45, 0.05, 0);

    const sight = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.08, 0.18),
      this._createMaterial(0xffd6ff, { metalness: 0.2, roughness: 0.3 })
    );
    sight.position.set(0.1, 0.18, 0.05);

    group.add(body, grip, muzzle, sight);
  }

  _buildMeleePlaceholder(group) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 1.2, 0.12),
      this._createMaterial(0xffffff, { metalness: 0.55, roughness: 0.2 })
    );
    blade.position.set(0, 0.45, 0);

    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 1.2, 0.06),
      this._createMaterial(0xbde0fe, { metalness: 0.45, roughness: 0.25 })
    );
    edge.position.set(0, 0.45, 0.05);

    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 0.2),
      this._createMaterial(0xffafcc, { metalness: 0.3, roughness: 0.4 })
    );
    guard.position.set(0, -0.25, 0);

    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12),
      this._createMaterial(0x264653, { metalness: 0.2, roughness: 0.6 })
    );
    handle.position.set(0, -0.65, 0);

    const pommel = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 12),
      this._createMaterial(0xffd166, { metalness: 0.4, roughness: 0.35 })
    );
    pommel.position.set(0, -0.95, 0);

    group.add(blade, edge, guard, handle, pommel);
  }

  _buildUtilityPlaceholder(group) {
    const canister = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.24, 0.6, 20),
      this._createMaterial(0x80ed99, { metalness: 0.25, roughness: 0.45 })
    );

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.18, 0.16, 20),
      this._createMaterial(0xfff3b0, { metalness: 0.3, roughness: 0.3 })
    );
    cap.position.set(0, 0.38, 0);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.12, 20),
      this._createMaterial(0x56cfe1, { metalness: 0.3, roughness: 0.35 })
    );
    base.position.set(0, -0.36, 0);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.05, 12, 24),
      this._createMaterial(0x4cc9f0, { metalness: 0.2, roughness: 0.4 })
    );
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, 0.26, 0);

    const gauge = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.18, 0.02),
      this._createMaterial(0xffc8dd, { metalness: 0.2, roughness: 0.35 })
    );
    gauge.position.set(0, 0, 0.24);

    group.add(canister, cap, base, handle, gauge);
  }

  _buildGenericPlaceholder(group) {
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      this._createMaterial(0xbdb2ff, { metalness: 0.2, roughness: 0.6 })
    );

    const accent = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.08, 12, 32),
      this._createMaterial(0xffe5ec, { metalness: 0.25, roughness: 0.35 })
    );
    accent.rotation.x = Math.PI / 2;

    group.add(core, accent);
  }

  _createMaterial(color, { metalness = 0.35, roughness = 0.4 } = {}) {
    return new THREE.MeshStandardMaterial({ color, metalness, roughness });
  }
}
