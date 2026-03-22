/* ============================================================
   FENNECTRA — Hero 3D Fox (Three.js)
   Wireframe GLB with mouse-tracking rotation
   ============================================================ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const canvas = document.getElementById('heroCanvas');
if (!canvas) throw new Error('heroCanvas not found');

const hero = document.getElementById('hero');

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.setClearColor(0x000000, 0);

// --- SCENE ---
const scene = new THREE.Scene();

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 2.2, 5);
camera.lookAt(0, 1.8, 0);

// --- LIGHTS ---
const ambient = new THREE.AmbientLight(0x3DD8D8, 0.4);
scene.add(ambient);

const rimLight = new THREE.PointLight(0x3DD8D8, 1.5, 20);
rimLight.position.set(-3, 3, -2);
scene.add(rimLight);

const frontLight = new THREE.DirectionalLight(0x1a3a3a, 1);
frontLight.position.set(0, 2, 5);
scene.add(frontLight);

// --- WIREFRAME MATERIAL ---
const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x4a6a6a,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
});

// --- LOAD FOX ---
let foxGroup = null;
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

loader.load('fox.glb', (gltf) => {
    foxGroup = gltf.scene;

    foxGroup.traverse((child) => {
        if (child.isMesh) {
            child.material = wireMaterial;
        }
    });

    // Center and scale
    const box = new THREE.Box3().setFromObject(foxGroup);
    const center = box.getCenter(new THREE.Vector3());
    const boxSize = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
    const scale = 4 / maxDim;

    foxGroup.scale.setScalar(scale);
    foxGroup.position.sub(center.multiplyScalar(scale));
    foxGroup.position.y += 1;

    // Slight rotation for a 3/4 profile view
    foxGroup.rotation.y = 0.45;
    foxGroup.position.z=-16;

    scene.add(foxGroup);
    console.log('Fox loaded');
},
undefined,
(error) => {
    console.warn('Could not load fox.glb:', error);
});

// --- MOUSE TRACKING ---
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

// --- RESIZE ---
function resize() {
    const rect = hero.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize, { passive: true });
resize();

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    if (foxGroup) {
        const targetRotY = 0.35 + mouseX * 0.25;
        const targetRotX = mouseY * 0.1;

        foxGroup.rotation.y += (targetRotY - foxGroup.rotation.y) * 0.03;
        foxGroup.rotation.x += (targetRotX - foxGroup.rotation.x) * 0.03;
    }

    renderer.render(scene, camera);
}

animate();
