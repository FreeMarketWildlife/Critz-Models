import * as THREE from 'https://esm.sh/three@0.160.0';

const createMesh = (geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};

export const createAssaultBlasterPlaceholder = () => {
  const group = new THREE.Group();
  group.name = 'assault-blaster-placeholder';
  group.userData.isPlaceholder = false;

  const chassisMaterial = new THREE.MeshStandardMaterial({
    color: 0x3538a7,
    metalness: 0.75,
    roughness: 0.32,
    emissive: 0x101233,
    emissiveIntensity: 0.45,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6acb,
    metalness: 0.6,
    roughness: 0.28,
    emissive: 0x331122,
    emissiveIntensity: 0.55,
  });
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x10111f,
    metalness: 0.25,
    roughness: 0.68,
  });
  const gripMaterial = new THREE.MeshStandardMaterial({
    color: 0x1c1d2f,
    metalness: 0.22,
    roughness: 0.85,
  });
  const energyMaterial = new THREE.MeshStandardMaterial({
    color: 0x7ef4ff,
    emissive: 0x2285ff,
    emissiveIntensity: 1.1,
    transparent: true,
    opacity: 0.85,
  });

  const chassis = createMesh(new THREE.BoxGeometry(1.9, 0.42, 0.38), chassisMaterial, [0, 0.1, 0]);
  group.add(chassis);

  const midSpine = createMesh(new THREE.BoxGeometry(1.2, 0.14, 0.3), darkMaterial, [0.05, -0.05, 0]);
  group.add(midSpine);

  const grip = createMesh(new THREE.BoxGeometry(0.2, 0.6, 0.36), gripMaterial, [-0.2, -0.22, 0], [Math.PI / 8, 0, 0]);
  group.add(grip);

  const triggerGuard = createMesh(
    new THREE.TorusGeometry(0.17, 0.035, 12, 24, Math.PI * 1.1),
    accentMaterial,
    [-0.32, -0.12, 0],
    [Math.PI / 2, 0, Math.PI / 2]
  );
  group.add(triggerGuard);

  const stockBody = createMesh(new THREE.BoxGeometry(0.72, 0.36, 0.34), chassisMaterial, [-0.9, 0.05, 0]);
  group.add(stockBody);

  const stockFin = createMesh(new THREE.BoxGeometry(0.62, 0.14, 0.38), darkMaterial, [-1.05, 0.2, 0]);
  stockFin.rotation.set(0, 0, -Math.PI / 9);
  group.add(stockFin);

  const shoulderPad = createMesh(new THREE.BoxGeometry(0.55, 0.22, 0.32), accentMaterial, [-1.05, -0.05, 0]);
  group.add(shoulderPad);

  const barrelCore = createMesh(
    new THREE.CylinderGeometry(0.09, 0.09, 1.45, 32, 1, true),
    darkMaterial,
    [0.78, 0.12, 0],
    [0, 0, Math.PI / 2]
  );
  group.add(barrelCore);

  const barrelSleeve = createMesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.9, 24, 1, true),
    chassisMaterial,
    [0.45, 0.18, 0],
    [0, 0, Math.PI / 2]
  );
  group.add(barrelSleeve);

  const barrelFins = createMesh(new THREE.BoxGeometry(0.9, 0.08, 0.42), accentMaterial, [0.45, 0.18, 0]);
  group.add(barrelFins);

  const muzzle = createMesh(new THREE.ConeGeometry(0.18, 0.36, 28), accentMaterial, [1.54, 0.12, 0], [0, 0, -Math.PI / 2]);
  group.add(muzzle);

  const muzzleGlow = createMesh(new THREE.SphereGeometry(0.17, 24, 18), energyMaterial, [1.43, 0.12, 0]);
  group.add(muzzleGlow);

  const emitterRing = createMesh(new THREE.TorusGeometry(0.24, 0.05, 16, 32), energyMaterial, [0.32, 0.24, 0], [Math.PI / 2, 0, 0]);
  group.add(emitterRing);

  const energyCore = createMesh(new THREE.BoxGeometry(0.58, 0.24, 0.26), energyMaterial, [0.1, 0.1, 0]);
  group.add(energyCore);

  const energyPipes = [
    createMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 20), accentMaterial, [0.0, 0.05, 0.24], [0, 0, Math.PI / 2]),
    createMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 20), accentMaterial, [0.0, 0.05, -0.24], [0, 0, Math.PI / 2]),
  ];
  energyPipes.forEach((pipe) => group.add(pipe));

  const underBarrel = createMesh(
    new THREE.CylinderGeometry(0.07, 0.09, 0.9, 20, 1, true),
    darkMaterial,
    [0.35, -0.12, 0],
    [0, 0, Math.PI / 2]
  );
  group.add(underBarrel);

  const railBraces = [
    createMesh(new THREE.BoxGeometry(0.16, 0.24, 0.32), darkMaterial, [0.0, -0.02, 0.32]),
    createMesh(new THREE.BoxGeometry(0.16, 0.24, 0.32), darkMaterial, [0.0, -0.02, -0.32]),
  ];
  railBraces.forEach((brace) => group.add(brace));

  const topRail = createMesh(new THREE.BoxGeometry(0.95, 0.08, 0.22), darkMaterial, [0.22, 0.32, 0]);
  group.add(topRail);

  const scopeBody = createMesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.72, 24, 1, true),
    chassisMaterial,
    [-0.05, 0.38, 0],
    [Math.PI / 2, 0, 0]
  );
  group.add(scopeBody);

  const scopeLensFront = createMesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.08, 24),
    energyMaterial,
    [-0.36, 0.38, 0],
    [Math.PI / 2, 0, 0]
  );
  group.add(scopeLensFront);

  const scopeLensRear = createMesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.06, 24),
    energyMaterial,
    [0.26, 0.38, 0],
    [Math.PI / 2, 0, 0]
  );
  group.add(scopeLensRear);

  const scopeMounts = [
    createMesh(new THREE.BoxGeometry(0.22, 0.16, 0.26), accentMaterial, [-0.18, 0.28, 0]),
    createMesh(new THREE.BoxGeometry(0.22, 0.16, 0.26), accentMaterial, [0.08, 0.28, 0]),
  ];
  scopeMounts.forEach((mount) => group.add(mount));

  const magazine = createMesh(new THREE.BoxGeometry(0.28, 0.54, 0.32), chassisMaterial, [0.1, -0.34, 0], [Math.PI / 5, 0, 0]);
  group.add(magazine);

  const magazineGlow = createMesh(new THREE.BoxGeometry(0.2, 0.36, 0.24), energyMaterial, [0.12, -0.24, 0]);
  group.add(magazineGlow);

  const sideFins = [
    createMesh(new THREE.BoxGeometry(0.64, 0.08, 0.14), accentMaterial, [0.42, 0.22, 0.24], [0, 0, Math.PI / 18]),
    createMesh(new THREE.BoxGeometry(0.64, 0.08, 0.14), accentMaterial, [0.42, 0.22, -0.24], [0, 0, -Math.PI / 18]),
  ];
  sideFins.forEach((fin) => group.add(fin));

  const runeStrips = [
    createMesh(new THREE.BoxGeometry(0.4, 0.04, 0.02), energyMaterial, [0.4, 0.1, 0.19]),
    createMesh(new THREE.BoxGeometry(0.4, 0.04, 0.02), energyMaterial, [0.4, 0.1, -0.19]),
  ];
  runeStrips.forEach((strip) => group.add(strip));

  const ventDetails = [
    createMesh(new THREE.BoxGeometry(0.22, 0.06, 0.32), darkMaterial, [-0.55, 0.1, 0]),
    createMesh(new THREE.BoxGeometry(0.18, 0.06, 0.28), darkMaterial, [-0.4, 0.08, 0]),
  ];
  ventDetails.forEach((vent) => group.add(vent));

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
};
