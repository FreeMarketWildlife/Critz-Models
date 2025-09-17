import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { SkeletonUtils } from 'https://unpkg.com/three@0.160.0/examples/jsm/utils/SkeletonUtils.js';

export class ResourceLoader {
  constructor() {
    this.modelCache = new Map();
    this.textureCache = new Map();
    this.animationCache = new Map();
    this.loaderPromise = null;
  }

  async loadModel(path) {
    if (!path) {
      return this._createPlaceholder();
    }

    if (this.modelCache.has(path)) {
      return SkeletonUtils.clone(this.modelCache.get(path));
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const scene = gltf.scene || gltf.scenes?.[0];
      if (scene) {
        this.modelCache.set(path, scene);
        return SkeletonUtils.clone(scene);
      }
    } catch (error) {
      console.warn(`Failed to load model at ${path}. Using fallback geometry instead.`, error);
    }

    const fallback = this._createPlaceholder();
    this.modelCache.set(path, fallback);
    return fallback.clone();
  }

  async loadTexture(path) {
    if (!path) return null;
    if (this.textureCache.has(path)) {
      return this.textureCache.get(path);
    }

    const textureLoader = new THREE.TextureLoader();
    try {
      const texture = await textureLoader.loadAsync(path);
      this.textureCache.set(path, texture);
      return texture;
    } catch (error) {
      console.warn(`Failed to load texture at ${path}.`, error);
      return null;
    }
  }

  async loadAnimation(path) {
    if (!path) return null;

    if (this.animationCache.has(path)) {
      return this.animationCache.get(path).clone();
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const clip = gltf.animations?.[0] ?? null;
      if (clip) {
        this.animationCache.set(path, clip);
        return clip.clone();
      }
    } catch (error) {
      console.warn(`Failed to load animation at ${path}.`, error);
    }

    return null;
  }

  async _getLoader() {
    if (!this.loaderPromise) {
      this.loaderPromise = import(
        'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'
      ).then((module) => new module.GLTFLoader());
    }
    return this.loaderPromise;
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
