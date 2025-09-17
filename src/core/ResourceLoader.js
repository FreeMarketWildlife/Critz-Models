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
        const clone = SkeletonUtils.clone(cached.scene);
        this._makeResourcesUnique(clone);
        return clone;
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
        const clone = SkeletonUtils.clone(scene);
        this._makeResourcesUnique(clone);
        return clone;
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
    const group = new THREE.Group();
    group.name = 'missing-model-placeholder';
    group.userData.isPlaceholder = true;
    return group;
  }

  _makeResourcesUnique(object) {
    if (!object) return;

    const cloneMaterial = (material) => {
      if (!material || typeof material.clone !== 'function') {
        return material;
      }
      const cloned = material.clone();
      cloned.userData = { ...material.userData, __resourceLoaderManaged: true };
      return cloned;
    };

    object.traverse?.((child) => {
      if (child.isMesh || child.isSkinnedMesh || child.isPoints || child.isLine) {
        if (child.geometry && typeof child.geometry.clone === 'function') {
          const originalGeometry = child.geometry;
          const geometry = originalGeometry.clone();
          geometry.userData = { ...originalGeometry.userData, __resourceLoaderManaged: true };
          child.geometry = geometry;
        }

        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => cloneMaterial(mat));
          } else {
            child.material = cloneMaterial(child.material);
          }
        }
      }
    });
  }
}
