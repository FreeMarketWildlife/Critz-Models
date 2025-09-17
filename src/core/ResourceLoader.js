import * as THREE from 'https://esm.sh/three@0.160.0';

export class ResourceLoader {
  constructor() {
    this.cache = new Map();
    this.loaderPromise = null;
    this.clonePromise = null;
  }

  async loadModel(path) {
    if (!path) {
      return this._createPlaceholder();
    }

    const cached = this.cache.get(path);
    if (cached) {
      if (cached.type === 'model') {
        const clone = await this._cloneScene(cached.scene);
        if (clone) {
          return clone;
        }
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
        const clone = await this._cloneScene(scene);
        if (clone) {
          return clone;
        }
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
        'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'
      ).then((module) => new module.GLTFLoader());
    }
    return this.loaderPromise;
  }

  async _getCloneFunction() {
    if (!this.clonePromise) {
      this.clonePromise = import(
        'https://esm.sh/three@0.160.0/examples/jsm/utils/SkeletonUtils.js'
      ).then((module) => module.clone);
    }
    return this.clonePromise;
  }

  async _cloneScene(scene) {
    if (!scene) {
      return null;
    }

    try {
      const cloneFn = await this._getCloneFunction();
      if (cloneFn) {
        return cloneFn(scene);
      }
    } catch (error) {
      console.warn('Failed to clone model using SkeletonUtils. Falling back to basic clone.', error);
    }

    return scene.clone(true);
  }

  _createPlaceholder() {
    const group = new THREE.Group();
    group.name = 'missing-model-placeholder';
    group.userData.isPlaceholder = true;
    return group;
  }
}
