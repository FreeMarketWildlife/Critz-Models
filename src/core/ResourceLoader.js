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
      if (!cached.root) {
        return { clip: cached.clip.clone(), root: null };
      }

      const { SkeletonUtils } = await this._getSkeletonUtils();
      return {
        clip: cached.clip.clone(),
        root: SkeletonUtils.clone(cached.root),
      };
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const [clip] = gltf.animations || [];
      if (clip) {
        const scene = gltf.scene || gltf.scenes?.[0] || null;
        let cachedRoot = null;
        if (scene) {
          const { SkeletonUtils } = await this._getSkeletonUtils();
          cachedRoot = SkeletonUtils.clone(scene);
        }

        this.cache.set(path, { type: 'animation', clip, root: cachedRoot });

        if (!cachedRoot) {
          return { clip: clip.clone(), root: null };
        }

        const { SkeletonUtils } = await this._getSkeletonUtils();
        return {
          clip: clip.clone(),
          root: SkeletonUtils.clone(cachedRoot),
        };
      }
    } catch (error) {
      console.warn(`Failed to load animation at ${path}.`, error);
    }

    return null;
  }

  async retargetClip(target, source, clip, options = {}) {
    if (!target || !source || !clip) {
      return clip;
    }

    try {
      const { SkeletonUtils } = await this._getSkeletonUtils();
      const targetClone = SkeletonUtils.clone(target);
      const sourceClone = SkeletonUtils.clone(source);
      return SkeletonUtils.retargetClip(targetClone, sourceClone, clip, options);
    } catch (error) {
      console.warn('Failed to retarget animation clip.', error);
      return clip;
    }
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
    const group = new THREE.Group();
    group.name = 'missing-model-placeholder';
    group.userData.isPlaceholder = true;
    return group;
  }
}
