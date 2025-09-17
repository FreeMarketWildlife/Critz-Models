import * as THREE from 'https://esm.sh/three@0.160.0';

const FACTORIES = {
  'assault-rifle-blaster': createAssaultRifleBlaster,
};

export function createWeaponPlaceholder(id) {
  const factory = FACTORIES[id];
  if (!factory) {
    console.warn(`No weapon placeholder registered for id "${id}".`);
    return null;
  }
  return factory();
}

function createAssaultRifleBlaster() {
  const group = new THREE.Group();
  group.name = 'assault-rifle-blaster-placeholder';

  const deepMetal = new THREE.MeshStandardMaterial({
    color: 0x252b5a,
    metalness: 0.68,
    roughness: 0.32,
  });
  const midnightAlloy = new THREE.MeshStandardMaterial({
    color: 0x1a1f40,
    metalness: 0.6,
    roughness: 0.38,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: 0xff71d4,
    emissive: new THREE.Color(0xff71d4),
    emissiveIntensity: 0.6,
    metalness: 0.28,
    roughness: 0.2,
  });
  const energy = new THREE.MeshStandardMaterial({
    color: 0x7dfbff,
    emissive: new THREE.Color(0x7dfbff),
    emissiveIntensity: 0.9,
    metalness: 0.1,
    roughness: 0.08,
    transparent: true,
    opacity: 0.95,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.26, 0.4), deepMetal);
  body.position.set(0, 0, 0);
  group.add(body);

  const bodyStripe = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 0.18), accent);
  bodyStripe.position.set(0.05, 0.08, 0);
  group.add(bodyStripe);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.24, 0.38), midnightAlloy);
  stock.position.set(-0.95, -0.05, 0);
  stock.rotation.set(0, 0, Math.PI / 18);
  group.add(stock);

  const stockCap = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.42), accent);
  stockCap.position.set(-1.28, -0.04, 0);
  group.add(stockCap);

  const shoulderPad = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.44), deepMetal);
  shoulderPad.position.set(-1.15, 0.1, 0);
  shoulderPad.rotation.set(0, 0, Math.PI / 14);
  group.add(shoulderPad);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.12, 28), deepMetal);
  barrel.rotation.set(0, 0, Math.PI / 2);
  barrel.position.set(0.78, 0.05, 0);
  group.add(barrel);

  const barrelSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.48, 24, 1, true), midnightAlloy);
  barrelSleeve.rotation.set(0, 0, Math.PI / 2);
  barrelSleeve.position.set(0.46, 0.04, 0);
  group.add(barrelSleeve);

  const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.24, 32, 1, true), accent);
  muzzle.rotation.set(0, 0, Math.PI / 2);
  muzzle.position.set(1.38, 0.05, 0);
  group.add(muzzle);

  const muzzleRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.02, 16, 48), energy);
  muzzleRing.rotation.x = Math.PI / 2;
  muzzleRing.position.set(1.44, 0.05, 0);
  group.add(muzzleRing);

  const muzzleHalo = muzzleRing.clone();
  muzzleHalo.scale.setScalar(0.7);
  muzzleHalo.position.set(1.32, 0.05, 0);
  group.add(muzzleHalo);

  const scopeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.82, 24), midnightAlloy);
  scopeBody.rotation.set(Math.PI / 2, 0, 0);
  scopeBody.position.set(0.1, 0.2, 0);
  group.add(scopeBody);

  const scopeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.32, 24), energy);
  scopeLens.rotation.set(Math.PI / 2, 0, 0);
  scopeLens.position.set(0.42, 0.2, 0);
  group.add(scopeLens);

  const scopeMount = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.26), deepMetal);
  scopeMount.position.set(-0.12, 0.12, 0);
  group.add(scopeMount);

  const rail = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.2), accent);
  rail.position.set(0.2, 0.12, 0);
  group.add(rail);

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 0.3), midnightAlloy);
  grip.rotation.set(0, 0, -Math.PI / 6);
  grip.position.set(-0.08, -0.36, 0);
  group.add(grip);

  const triggerGuard = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 16, 32), deepMetal);
  triggerGuard.rotation.set(Math.PI / 2, 0, 0);
  triggerGuard.position.set(-0.06, -0.2, 0);
  group.add(triggerGuard);

  const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.08), accent);
  trigger.position.set(-0.12, -0.24, 0);
  trigger.rotation.set(0, 0, -Math.PI / 12);
  group.add(trigger);

  const foreGrip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.26), midnightAlloy);
  foreGrip.rotation.set(0, 0, -Math.PI / 10);
  foreGrip.position.set(0.58, -0.3, 0);
  group.add(foreGrip);

  const energyCell = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.38), accent);
  energyCell.position.set(0.32, -0.06, 0);
  group.add(energyCell);

  const energyCore = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.5, 32), energy);
  energyCore.rotation.set(0, 0, Math.PI / 2);
  energyCore.position.set(0.32, -0.06, 0);
  group.add(energyCore);

  const conduits = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.12, 0.2), deepMetal);
  conduits.position.set(0.42, -0.18, 0);
  group.add(conduits);

  const conduitGlow = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 0.12), energy);
  conduitGlow.position.set(0.42, -0.18, 0);
  group.add(conduitGlow);

  const leftFin = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 0.12), accent);
  leftFin.position.set(0.18, 0.02, 0.26);
  leftFin.rotation.set(0, Math.PI / 8, Math.PI / 40);
  group.add(leftFin);

  const rightFin = leftFin.clone();
  rightFin.position.z = -0.26;
  rightFin.rotation.y = -Math.PI / 8;
  rightFin.rotation.z = -Math.PI / 40;
  group.add(rightFin);

  const sigilMaterial = new THREE.MeshBasicMaterial({
    color: 0x7dfffc,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });
  const sigilGeometry = new THREE.RingGeometry(0.18, 0.24, 40);

  const frontSigil = new THREE.Mesh(sigilGeometry, sigilMaterial);
  frontSigil.position.set(0.88, 0.06, 0.24);
  frontSigil.rotation.y = Math.PI / 2;
  group.add(frontSigil);

  const rearSigil = frontSigil.clone();
  rearSigil.position.set(-0.38, 0.04, -0.24);
  rearSigil.rotation.y = -Math.PI / 2;
  group.add(rearSigil);

  const underBarrelShard = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.22), accent);
  underBarrelShard.position.set(1.05, -0.1, 0);
  underBarrelShard.rotation.set(Math.PI / 8, 0, 0);
  group.add(underBarrelShard);

  const ventArrayGeometry = new THREE.BoxGeometry(0.14, 0.04, 0.42);
  const ventArray = new THREE.Mesh(ventArrayGeometry, deepMetal);
  ventArray.position.set(-0.45, -0.02, 0);
  group.add(ventArray);

  const ventGlow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.36), energy);
  ventGlow.position.copy(ventArray.position);
  group.add(ventGlow);

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}
