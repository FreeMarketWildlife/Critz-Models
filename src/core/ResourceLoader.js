import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { SkeletonUtils } from 'https://unpkg.com/three@0.160.0/examples/jsm/utils/SkeletonUtils.js';

export class ResourceLoader {
  constructor() {
    this.cache = new Map();
    this.loaderPromise = null;
  }

  async loadModel(path) {
    if (!path) {
      return this._createPlaceholder();
    }

    if (this.cache.has(path)) {
      const cached = this.cache.get(path);
      if (cached?.isObject3D) {
        return SkeletonUtils.clone(cached);
      }
      if (typeof cached?.clone === 'function') {
        return cached.clone();
      }
      return cached;
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const scene = gltf.scene || gltf.scenes?.[0];
      if (scene) {
        this.cache.set(path, scene);
        return SkeletonUtils.clone(scene);
      }
    } catch (error) {
      console.warn(`Failed to load model at ${path}. Using fallback geometry instead.`, error);
    }

    const fallback = this._createPlaceholder();
    this.cache.set(path, fallback);
    return SkeletonUtils.clone(fallback);
  }

  async loadTexture(path) {
    if (!path) return null;
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    const textureLoader = new THREE.TextureLoader();
    try {
      const texture = await textureLoader.loadAsync(path);
      this.cache.set(path, texture);
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

  async loadAnimationClips(path) {
    if (!path) return [];

    if (this.cache.has(path)) {
      const cached = this.cache.get(path);
      if (Array.isArray(cached)) {
        return cached.map((clip) => clip.clone());
      }
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const clips = gltf.animations || [];
      this.cache.set(path, clips);
      return clips.map((clip) => clip.clone());
    } catch (error) {
      console.warn(`Failed to load animation at ${path}.`, error);
      return [];
    }
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
