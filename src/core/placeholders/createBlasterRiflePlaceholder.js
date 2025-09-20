import * as THREE from 'https://esm.sh/three@0.160.0';

const createEnergyCell = (color, offsetX) => {
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.32, 16);
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.4,
    roughness: 0.25,
    emissive: new THREE.Color(color).multiplyScalar(0.4),
    emissiveIntensity: 0.9,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = Math.PI / 2;
  mesh.position.set(offsetX, -0.04, 0);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
};

const createCoolingFin = (width, height, depth, position) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4c5d88,
    metalness: 0.55,
    roughness: 0.35,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
};

export const createBlasterRiflePlaceholder = () => {
  const group = new THREE.Group();
  group.name = 'assault-blaster-placeholder';

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d1f55,
    metalness: 0.65,
    roughness: 0.25,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x5fe0ff,
    metalness: 0.15,
    roughness: 0.15,
    emissive: new THREE.Color(0x5fe0ff).multiplyScalar(0.5),
    emissiveIntensity: 0.8,
  });
  const gripMaterial = new THREE.MeshStandardMaterial({
    color: 0x181323,
    metalness: 0.4,
    roughness: 0.6,
  });

  const bodyGeometry = new THREE.BoxGeometry(1.8, 0.32, 0.38);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  bodyMesh.position.set(0, 0, 0);
  group.add(bodyMesh);

  const barrelGeometry = new THREE.CylinderGeometry(0.09, 0.09, 1.2, 18, 1, false);
  const barrelMaterial = new THREE.MeshStandardMaterial({
    color: 0xcad6ff,
    metalness: 0.35,
    roughness: 0.2,
    emissive: new THREE.Color(0x99c0ff).multiplyScalar(0.35),
    emissiveIntensity: 0.6,
  });
  const barrelMesh = new THREE.Mesh(barrelGeometry, barrelMaterial);
  barrelMesh.rotation.z = Math.PI / 2;
  barrelMesh.position.set(1, 0.02, 0);
  group.add(barrelMesh);

  const muzzleGeometry = new THREE.CylinderGeometry(0.11, 0.11, 0.2, 16);
  const muzzleMaterial = new THREE.MeshStandardMaterial({
    color: 0x8ef7ff,
    metalness: 0.1,
    roughness: 0.05,
    emissive: new THREE.Color(0x8ef7ff).multiplyScalar(0.6),
    emissiveIntensity: 1.1,
  });
  const muzzle = new THREE.Mesh(muzzleGeometry, muzzleMaterial);
  muzzle.rotation.z = Math.PI / 2;
  muzzle.position.set(1.65, 0.02, 0);
  group.add(muzzle);

  const scopeBodyGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.7, 20);
  const scopeBody = new THREE.Mesh(scopeBodyGeometry, bodyMaterial);
  scopeBody.rotation.z = Math.PI / 2;
  scopeBody.position.set(0.3, 0.2, 0);
  group.add(scopeBody);

  const scopeLensGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.18, 20);
  const scopeLens = new THREE.Mesh(scopeLensGeometry, accentMaterial);
  scopeLens.rotation.z = Math.PI / 2;
  scopeLens.position.set(0.65, 0.2, 0);
  group.add(scopeLens);

  const gripGeometry = new THREE.BoxGeometry(0.24, 0.45, 0.32);
  const grip = new THREE.Mesh(gripGeometry, gripMaterial);
  grip.position.set(-0.35, -0.32, 0);
  group.add(grip);

  const stockGeometry = new THREE.BoxGeometry(0.55, 0.32, 0.36);
  const stock = new THREE.Mesh(stockGeometry, bodyMaterial);
  stock.position.set(-0.9, -0.02, 0);
  group.add(stock);

  const shoulderPadGeometry = new THREE.BoxGeometry(0.25, 0.36, 0.42);
  const shoulderPad = new THREE.Mesh(shoulderPadGeometry, gripMaterial);
  shoulderPad.position.set(-1.25, 0.02, 0);
  group.add(shoulderPad);

  const coreGeometry = new THREE.BoxGeometry(0.55, 0.26, 0.3);
  const core = new THREE.Mesh(coreGeometry, accentMaterial);
  core.position.set(0.35, -0.02, 0);
  group.add(core);

  const underBarrelGeometry = new THREE.BoxGeometry(0.7, 0.16, 0.32);
  const underBarrel = new THREE.Mesh(underBarrelGeometry, bodyMaterial);
  underBarrel.position.set(0.7, -0.18, 0);
  group.add(underBarrel);

  const triggerGuardGeometry = new THREE.TorusGeometry(0.14, 0.035, 12, 24, Math.PI);
  const triggerGuard = new THREE.Mesh(triggerGuardGeometry, gripMaterial);
  triggerGuard.rotation.x = Math.PI / 2;
  triggerGuard.rotation.z = Math.PI / 2;
  triggerGuard.position.set(-0.48, -0.18, 0);
  group.add(triggerGuard);

  const cellA = createEnergyCell(0x6ff0ff, -0.05);
  const cellB = createEnergyCell(0xff8ccf, 0.2);
  group.add(cellA, cellB);

  const fins = [
    createCoolingFin(0.06, 0.24, 0.34, new THREE.Vector3(0.8, 0.16, 0)),
    createCoolingFin(0.06, 0.22, 0.34, new THREE.Vector3(0.92, 0.16, 0)),
    createCoolingFin(0.06, 0.18, 0.34, new THREE.Vector3(1.04, 0.16, 0)),
  ];
  fins.forEach((fin) => group.add(fin));

  const accents = new THREE.TorusGeometry(0.18, 0.02, 12, 32);
  const emitterRing = new THREE.Mesh(accents, accentMaterial);
  emitterRing.rotation.z = Math.PI / 2;
  emitterRing.position.set(1.32, 0.02, 0);
  group.add(emitterRing);

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });

  return group;
};
