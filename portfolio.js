import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GroundedSkybox } from './GroundedSkybox.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let composer, mixer, clock, skybox;
let debug = false;
const params = {
    threshold: 0,
    strength: 0.05,
    height: 35,
    radius: 500,
    exposure: 0.5
};

clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

const hdrLoader = new RGBELoader();
const envMap = await hdrLoader.loadAsync( 'testpic.hdr' );
envMap.mapping = THREE.EquirectangularReflectionMapping;

skybox = new GroundedSkybox( envMap, params.height, params.radius );
skybox.position.y = params.height - 0.01;
scene.add( skybox );
scene.environment = envMap;

if (debug == false){
    camera.position.set(-100, 50, -300);
    gsap.to(camera.position, {x:1,y:19,z:60, duration:6, ease: 'power2.out'});
}
else{
    camera.position.set(1, 19,60);
}

renderer.setPixelRatio(window.innerWidth/window.innerHeight);
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 2;
controls.maxDistance = 100;

controls.maxPolarAngle = Math.PI / 2;
const ambientLight = new THREE.AmbientLight(0x808080)
scene.add( ambientLight);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener("DOMContentLoaded", loadedPage());

const gltfloader = new GLTFLoader();
const car = new THREE.Group();
const car2 = new THREE.Group();
const car3 = new THREE.Group();
function carLoaders(){
    gltfloader.load('models/fairlady.glb', function(gltf){
        car.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        scene.add(car);
        });
    gltfloader.load('models/porsche.glb', function(gltf){
        car2.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        scene.add(car2);
    });
    gltfloader.load('models/m3.glb', function(gltf){
        car3.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        scene.add(car3);
        loadedPage();
        animate();
    });
    car.position.set(-20.5, -8.5, -35.5);
    car.scale.set(15,15,15);
    car2.position.set(-35.5, 0, -0.5);

    car2.scale.set(10,10,10);
    car3.scale.set(10,10,10);
    car2.rotateY(1);
    car3.position.set(35.5,0, -0.5);
    car3.rotateY(-1);
}
let carloaded = false;
if (!carloaded){
    carLoaders();
    carloaded = true;
}

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5/5, 0.4/5, 0.8/5 );
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = 0;

const outputPass = new OutputPass();

composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );

function animate() {
    setTimeout( function() { requestAnimationFrame( animate ); }, 1000 / 60 );
    composer.render();
    controls.update();
}

function loadedPage(){
    setTimeout(function(){
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 2000);
}