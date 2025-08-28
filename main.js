// Simple 3D scene with an anthropomorphic squirrel built from primitives.
// Use WASD to walk, Shift to run, Space to jump, and Ctrl to crouch.

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228b22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Squirrel model
const squirrel = new THREE.Group();
const brown = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), brown);
squirrel.add(body);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), brown);
head.position.set(0, 0.75, 0);
squirrel.add(head);

const earGeom = new THREE.ConeGeometry(0.1, 0.2, 8);
const ear1 = new THREE.Mesh(earGeom, brown);
ear1.position.set(-0.15, 1, 0.15);
ear1.rotation.z = Math.PI;
const ear2 = ear1.clone();
ear2.position.x = 0.15;
squirrel.add(ear1, ear2);

const armGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.6);
const arm1 = new THREE.Mesh(armGeom, brown);
arm1.position.set(-0.4, 0.2, 0);
arm1.rotation.z = Math.PI / 4;
const arm2 = arm1.clone();
arm2.position.x = 0.4;
arm2.rotation.z = -Math.PI / 4;
squirrel.add(arm1, arm2);

const legGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.7);
const leg1 = new THREE.Mesh(legGeom, brown);
leg1.position.set(-0.2, -0.4, 0);
const leg2 = leg1.clone();
leg2.position.x = 0.2;
squirrel.add(leg1, leg2);

const tail = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.2, 1, 8),
  brown
);
tail.position.set(0, 0.2, -0.7);
tail.rotation.x = Math.PI / 2;
squirrel.add(tail);

squirrel.position.y = 0.8;
scene.add(squirrel);

// Movement controls
const keys = {};
document.addEventListener('keydown', (e) => (keys[e.code] = true));
document.addEventListener('keyup', (e) => (keys[e.code] = false));

let velocityY = 0;
const speed = 2;
const runMultiplier = 2;
const jumpStrength = 5;
let crouched = false;

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  let moveSpeed = speed;
  if (keys['ShiftLeft'] || keys['ShiftRight']) moveSpeed *= runMultiplier;

  const forward = new THREE.Vector3(0, 0, -1)
    .applyQuaternion(camera.quaternion)
    .setY(0)
    .normalize();
  const right = new THREE.Vector3(1, 0, 0)
    .applyQuaternion(camera.quaternion)
    .setY(0)
    .normalize();

  if (keys['KeyW']) squirrel.position.add(forward.clone().multiplyScalar(moveSpeed * delta));
  if (keys['KeyS']) squirrel.position.add(forward.clone().multiplyScalar(-moveSpeed * delta));
  if (keys['KeyA']) squirrel.position.add(right.clone().multiplyScalar(-moveSpeed * delta));
  if (keys['KeyD']) squirrel.position.add(right.clone().multiplyScalar(moveSpeed * delta));

  if (keys['ControlLeft'] || keys['ControlRight']) {
    if (!crouched) {
      squirrel.scale.y = 0.5;
      crouched = true;
    }
  } else if (crouched) {
    squirrel.scale.y = 1;
    crouched = false;
  }

  if (keys['Space'] && Math.abs(squirrel.position.y - 0.8) < 0.001) {
    velocityY = jumpStrength;
  }

  velocityY += -9.8 * delta;
  squirrel.position.y += velocityY * delta;
  if (squirrel.position.y < 0.8) {
    squirrel.position.y = 0.8;
    velocityY = 0;
  }

  camera.position.copy(squirrel.position).add(new THREE.Vector3(0, 1.5, 3));
  camera.lookAt(squirrel.position);

  renderer.render(scene, camera);
}

animate();
