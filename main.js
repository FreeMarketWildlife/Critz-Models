import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

function createSquirrel() {
  const group = new THREE.Group();
  const brown = 0x8b4513;
  const cream = 0xffe0bd;
  const matBrown = new THREE.MeshStandardMaterial({ color: brown });
  const matCream = new THREE.MeshStandardMaterial({ color: cream });

  const bodyGeom = new THREE.CapsuleGeometry(0.5, 1.0, 4, 8);
  const body = new THREE.Mesh(bodyGeom, matBrown);
  group.add(body);

  const headGeom = new THREE.SphereGeometry(0.35, 16, 16);
  const head = new THREE.Mesh(headGeom, matBrown);
  head.position.y = 0.9;
  group.add(head);

  const earGeom = new THREE.ConeGeometry(0.1, 0.25, 8);
  const earLeft = new THREE.Mesh(earGeom, matBrown);
  earLeft.position.set(-0.15, 1.1, 0);
  earLeft.rotation.x = Math.PI;
  const earRight = earLeft.clone();
  earRight.position.x = 0.15;
  group.add(earLeft, earRight);

  const eyeGeom = new THREE.SphereGeometry(0.05, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const eyeLeft = new THREE.Mesh(eyeGeom, eyeMat);
  eyeLeft.position.set(-0.12, 0.95, 0.3);
  const eyeRight = eyeLeft.clone();
  eyeRight.position.x = 0.12;
  group.add(eyeLeft, eyeRight);

  const bellyGeom = new THREE.CapsuleGeometry(0.3, 0.6, 4, 8);
  const belly = new THREE.Mesh(bellyGeom, matCream);
  belly.position.set(0, -0.1, 0.25);
  group.add(belly);

  const tailGeom = new THREE.CylinderGeometry(0.2, 0.1, 1.5, 8);
  const tail = new THREE.Mesh(tailGeom, matBrown);
  tail.rotation.z = Math.PI / 2;
  tail.position.set(-0.55, 0.2, 0);
  group.add(tail);

  group.position.y = 1;
  return group;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaad1ff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 5, 2);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.6));

const groundGeom = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeom, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const squirrel = createSquirrel();
scene.add(squirrel);

const keys = {};
let velocityY = 0;
let isGrounded = true;

document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function animate() {
  requestAnimationFrame(animate);
  const moveSpeed = (keys['shift'] ? 0.2 : 0.1);
  if (keys['w'] || keys['arrowup']) squirrel.position.z -= moveSpeed;
  if (keys['s'] || keys['arrowdown']) squirrel.position.z += moveSpeed;
  if (keys['a'] || keys['arrowleft']) squirrel.position.x -= moveSpeed;
  if (keys['d'] || keys['arrowright']) squirrel.position.x += moveSpeed;

  if (keys['c'] || keys['control']) {
    squirrel.scale.y = 0.5;
  } else {
    squirrel.scale.y = 1;
  }

  if (keys[' '] && isGrounded) {
    velocityY = 0.25;
    isGrounded = false;
  }
  if (!isGrounded) {
    squirrel.position.y += velocityY;
    velocityY -= 0.01;
    if (squirrel.position.y <= 1) {
      squirrel.position.y = 1;
      velocityY = 0;
      isGrounded = true;
    }
  }

  camera.position.x = squirrel.position.x;
  camera.position.z = squirrel.position.z + 5;
  camera.lookAt(squirrel.position);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
