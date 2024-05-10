import * as THREE from 'three';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js'
//import { TTFLoader } from 'three/addons/loaders/TTFLoader.js'
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const canvas = document.getElementById("webgl");
const camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl'),
});
renderer.setPixelRatio(canvas.width/canvas.height);
renderer.setSize(canvas.width, canvas.height, false);
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