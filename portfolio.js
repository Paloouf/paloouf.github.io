import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

let composer, mixer, clock;

const params = {
    threshold: 0,
    strength: 0.05,
    radius: 0,
    exposure: 0.5
};

clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color( 0xcccccc );
scene.fog = new THREE.FogExp2( 0xcccccc, 0.03 );

camera.position.set(-2, 2, -2);
gsap.to(camera.position, {x:1,y:0,z:2, duration:7, ease: 'power2.out'});
renderer.setPixelRatio(window.innerWidth/window.innerHeight);
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 2;
controls.maxDistance = 10;

controls.maxPolarAngle = Math.PI / 2;
const dirLight1 = new THREE.DirectionalLight( 0xff00ff, 3 );
dirLight1.position.set( 1, 1, 1 );
scene.add( dirLight1 );

const dirLight2 = new THREE.DirectionalLight( 0x0000ff, 3 );
dirLight2.position.set( - 1, - 1, - 1 );
scene.add( dirLight2 );
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
gltfloader.load('models/fairlady.glb', function(gltf){
    car.add(gltf.scene);
    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    scene.add(car);
    loadedPage();
    animate();
    });

car.position.x -= 1.5;
car.position.y -= 1;
car.position.z -= 0.5;

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5/5, 0.4/5, 0.8/5 );
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const outputPass = new OutputPass();

composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );

const geometry = new THREE.BoxGeometry( 100, 1, 100 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );
cube.position.y -= 1;

function animate() {
    setTimeout( function() { requestAnimationFrame( animate ); }, 1000 / 60 );
    //renderer.render(scene, camera);
    //const delta = clock.getDelta();
    //mixer.update(delta);
    composer.render();
    controls.update();
}
//animate();


function loadedPage(){
    setTimeout(function(){
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 2000);
}