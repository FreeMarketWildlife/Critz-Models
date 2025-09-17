import * as THREE from 'https://esm.sh/three@0.160.0';

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

  async loadAnimationClip(path, target = null) {
    if (!path) {
      return null;
    }

    let cached = this.cache.get(path);
    if (!cached || cached.type !== 'animation') {
      try {
        const loader = await this._getLoader();
        const gltf = await loader.loadAsync(path);
        const clip = gltf.animations?.[0];
        if (clip) {
          cached = {
            type: 'animation',
            clip,
            source: gltf.scene || gltf.scenes?.[0] || null,
          };
          this.cache.set(path, cached);
        }
      } catch (error) {
        console.warn(`Failed to load animation at ${path}.`, error);
        return null;
      }
    }

    if (!cached || cached.type !== 'animation' || !cached.clip) {
      return null;
    }

    let clipInstance = cached.clip.clone();

    if (target && cached.source) {
      const retargeted = await this._retargetClip(target, cached.source, clipInstance);
      if (retargeted) {
        clipInstance = retargeted;
      }
    }

    return clipInstance;
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

  async _getSkeletonUtils() {
    if (!this.skeletonUtilsPromise) {
      this.skeletonUtilsPromise = import(
        'https://esm.sh/three@0.160.0/examples/jsm/utils/SkeletonUtils.js'
      );
    }
    return this.skeletonUtilsPromise;
  }

  async _cloneScene(scene) {
    if (!scene) {
      return null;
    }

    try {
      const { clone } = await this._getSkeletonUtils();
      if (clone) {
        return clone(scene);
      }
    } catch (error) {
      console.warn('Failed to clone model using SkeletonUtils. Falling back to basic clone.', error);
    }

    return scene.clone(true);
  }

  async _retargetClip(target, source, clip) {
    if (!target || !clip) {
      return clip;
    }

    try {
      const { retargetClip } = await this._getSkeletonUtils();
      if (typeof retargetClip === 'function' && source) {
        return retargetClip(target, source, clip);
      }
    } catch (error) {
      console.warn('Failed to retarget animation clip to the current model.', error);
    }

    return clip;
  }

  _createPlaceholder() {
    const group = new THREE.Group();
    group.name = 'missing-model-placeholder';
    group.userData.isPlaceholder = true;
    return group;
  }
}
