import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class ResourceLoader {
  constructor() {
    this.gltfCache = new Map();
    this.textureCache = new Map();
    this.loaderPromise = null;
  }

  async loadModel(path) {
    if (!path) {
      return this._createPlaceholder();
    }

    const gltf = await this.loadGLTF(path);
    if (gltf?.scene) {
      return gltf.scene;
    }

    console.warn(`Failed to load model at ${path}. Using fallback geometry instead.`);
    return this._createPlaceholder();
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

  async loadGLTF(path) {
    if (!path) return null;

    if (this.gltfCache.has(path)) {
      const cached = this.gltfCache.get(path);
      return {
        scene: cached.scene?.clone(true) ?? null,
        animations: cached.animations.map((clip) => clip.clone()),
      };
    }

    try {
      const loader = await this._getLoader();
      const gltf = await loader.loadAsync(path);
      const scene = gltf.scene || gltf.scenes?.[0] || null;
      const animations = (gltf.animations || []).map((clip) => clip.clone());

      if (scene) {
        this.gltfCache.set(path, {
          scene,
          animations: gltf.animations || [],
        });
        return {
          scene: scene.clone(true),
          animations,
        };
      }
    } catch (error) {
      console.warn(`Failed to load GLTF at ${path}.`, error);
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
