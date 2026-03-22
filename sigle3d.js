/* ============================================================
   FENNECTRA — Sigle 3D (Three.js)
   Auto-rotating crystal on nav + footer canvases
   ============================================================ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

// --- Collect all sigle canvases ---
const canvases = [
    document.getElementById('sigleCanvas'),
    document.getElementById('footerSigleCanvas'),
].filter(Boolean);

if (canvases.length === 0) throw new Error('No sigle canvas found');

// --- Create one renderer per canvas ---
const instances = canvases.map((canvas) => {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(80, 80, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    renderer.setClearColor(0x000000, 0);
    return renderer;
});

// --- Shared scene ---
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 50);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// --- LIGHTS ---
const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);

const cyanLight = new THREE.PointLight(0x3DD8D8, 2.5, 15);
cyanLight.position.set(2, 1, 3);
scene.add(cyanLight);

const backCyan = new THREE.PointLight(0x3DD8D8, 1.5, 12);
backCyan.position.set(-2, -1, -2);
scene.add(backCyan);

const keyLight = new THREE.DirectionalLight(0xffffff, 1);
keyLight.position.set(1, 3, 2);
scene.add(keyLight);

// --- LOADER ---
const ktx2Loader = new KTX2Loader()
    .setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/');
ktx2Loader.detectSupport(instances[0]);

const loader = new GLTFLoader();
loader.setKTX2Loader(ktx2Loader);
loader.setMeshoptDecoder(MeshoptDecoder);

// --- LOAD SIGLE ---
let sigleGroup = null;

loader.load('sigle.glb', (gltf) => {
    sigleGroup = gltf.scene;

    sigleGroup.traverse((child) => {
        if (child.isMesh && child.material) {
            const mat = child.material;
            if (mat.emissive) {
                mat.emissive.set(0x1a6666);
                mat.emissiveIntensity = 0.3;
            }
            mat.needsUpdate = true;
        }
    });

    const box = new THREE.Box3().setFromObject(sigleGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.8 / maxDim;

    sigleGroup.scale.setScalar(scale);
    sigleGroup.position.sub(center.multiplyScalar(scale));

    scene.add(sigleGroup);
    console.log('Sigle loaded');
},
undefined,
(error) => {
    console.error('Sigle load error:', error);
    // Fallback: show PNG on all canvases
    canvases.forEach((c) => {
        c.style.display = 'none';
        const img = document.createElement('img');
        img.src = 'sigle.png';
        img.className = 'nav__logo-icon';
        img.alt = 'Fennectra';
        c.parentNode.insertBefore(img, c);
    });
});

// --- ANIMATION ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    if (sigleGroup) {
        sigleGroup.rotation.y = t * 0.8;
        sigleGroup.position.y = Math.sin(t * 1.5) * 0.04;
    }

    cyanLight.intensity = 2.5 + Math.sin(t * 2) * 0.5;

    // Render on all canvases
    instances.forEach((renderer) => {
        renderer.render(scene, camera);
    });
}

animate();
