import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class ResourceLoader {
  constructor() {
    this.cache = new Map();
    this.loaderPromise = null;
    this.skeletonUtilsPromise = null;
  }

  async loadModel(path) {
    if (!path) {
      return this._createPlaceholder();
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

    const fallback = this._createPlaceholder();
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

  _createPlaceholder() {
    const geometry = new THREE.IcosahedronGeometry(0.8, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7a5dd1,
      emissive: 0x140d2f,
      metalness: 0.45,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'placeholder-weapon';

    const group = new THREE.Group();
    group.add(mesh);
    return group;
  }
}
