import * as THREE from 'three';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js'
//import { TTFLoader } from 'three/addons/loaders/TTFLoader.js'
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.set(0, -20, 5);
renderer.setPixelRatio(window.innerWidth/window.innerHeight);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
const pointlight = new THREE.PointLight(0xffffff);
const ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(pointlight);//, ambientlight
pointlight.position.set(0, 0, 10);

const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );

function animate() {
    setTimeout( function() { requestAnimationFrame( animate ); }, 1000 / 60 );
    renderer.render(scene, camera);
    controls.update();
}
animate();