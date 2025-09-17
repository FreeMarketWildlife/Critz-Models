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

  async loadAnimationClip(path) {
    if (!path) {
      return null;
    }

    const cached = this.cache.get(path);
    if (cached && cached.type === 'animation') {
      const clip = cached.clip?.clone?.();
      const source = cached.source ? await this._cloneScene(cached.source) : null;
      if (clip) {
        return { clip, source };
      }
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const [clip] = gltf.animations || [];
      const source = gltf.scene || gltf.scenes?.[0] || null;
      if (clip) {
        this.cache.set(path, { type: 'animation', clip, source });
        const clone = clip.clone();
        const sourceClone = source ? await this._cloneScene(source) : null;
        return { clip: clone, source: sourceClone };
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

  async _getSkeletonUtils() {
    if (!this.skeletonUtilsPromise) {
      this.skeletonUtilsPromise = import(
        'https://esm.sh/three@0.160.0/examples/jsm/utils/SkeletonUtils.js'
      ).then((module) => module?.SkeletonUtils ?? module?.default ?? module);
    }
    return this.skeletonUtilsPromise;
  }

  async _cloneScene(scene) {
    if (!scene) {
      return null;
    }

    try {
      const utils = await this._getSkeletonUtils();
      if (utils?.clone) {
        return utils.clone(scene);
      }
    } catch (error) {
      console.warn('Failed to clone model using SkeletonUtils. Falling back to basic clone.', error);
    }

    return scene.clone(true);
  }

  async retargetClip(targetMesh, sourceScene, clip, options) {
    if (!targetMesh || !sourceScene || !clip) {
      return clip;
    }

    try {
      const utils = await this._getSkeletonUtils();
      if (!utils?.retargetClip) {
        return clip;
      }

      const sourceMesh = this._findFirstSkinnedMesh(sourceScene);
      if (!sourceMesh) {
        return clip;
      }

      return utils.retargetClip(targetMesh, sourceMesh, clip, options ?? {});
    } catch (error) {
      console.warn('Failed to retarget animation clip.', error);
      return clip;
    }
  }

  _findFirstSkinnedMesh(root) {
    let skinned = null;
    root?.traverse?.((child) => {
      if (!skinned && child.isSkinnedMesh) {
        skinned = child;
      }
    });
    return skinned;
  }

  _createPlaceholder() {
    const group = new THREE.Group();
    group.name = 'missing-model-placeholder';
    group.userData.isPlaceholder = true;
    return group;
  }
}
