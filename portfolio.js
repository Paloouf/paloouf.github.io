import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GroundedSkybox } from './GroundedSkybox.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let composer, clock, skybox;
let debug = false;
const params = {
    threshold: 0,
    strength: 0.05,
    height: 25,
    radius: 300,
    exposure: 0.5
};

//Initial setup
let ttfloader = new TTFLoader();
let fontloader = new FontLoader();
clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true, precision: 'highp'});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.innerWidth/window.innerHeight);
document.body.appendChild( renderer.domElement );

let assetCount = 0;
let totalAsset =5;


//GroundedSkybox
const hdrLoader = new RGBELoader();
const envMap =  hdrLoader.load( 'neonbrig_resize.hdr', function(){checkProgress()} );
envMap.mapping = THREE.EquirectangularReflectionMapping;
skybox = new GroundedSkybox( envMap, params.height, params.radius );
skybox.position.y = params.height - 0.01;
scene.add( skybox );
scene.environment = envMap;


//Camera setup animation
if (debug == false){
    camera.position.set(-100, 50, -150);
    gsap.to(camera.position, {x:1,y:19,z:60, duration:6, ease: 'power2.out'});
}
else{
    camera.position.set(1, 19,60);
}




//Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2 - 0.1;


//Lights
const ambientLight = new THREE.AmbientLight(0x808080);
const pointLight = new THREE.PointLight(0xffffff);
const dirLight1 = new THREE.DirectionalLight(0x00ff00, 0.5);
const dirLight2 = new THREE.DirectionalLight(0x00ff00, 0.5);
const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight1.position.set(40,40,20);
dirLight2.position.set(40,40,-20);
dirLight3.position.set(40,40,-100);
dirLight4.position.set(40,40,100);
pointLight.position.set(0,40,0);
scene.add(  dirLight1, dirLight2, dirLight3, dirLight4);//ambientLight,pointLight,

//Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//Asset loading
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let resumeBoxDisplayed = false;
const gltfloader = new GLTFLoader();
const car = new THREE.Group();
const car2 = new THREE.Group();
const car3 = new THREE.Group();

const aboutMeGrp = new THREE.Group();
const skillsGrp = new THREE.Group();
const projectsGrp = new THREE.Group();
let aboutMe, skills, projects;
let aboutHitbox;
let skillHitbox;
let projHitbox;
function textLoaders(){
    ttfloader.load('./fonts/torchzilla.ttf', (json) =>{
        const torchzilla = fontloader.parse(json);
        const geo = new TextGeometry('About Me', {
            font: torchzilla,
            size: 5,
            height: 2,
        });
        const geo2 = new TextGeometry('My Skills', {
            font: torchzilla,
            size: 5,
            height: 2,
        });
        const geo3 = new TextGeometry('My Projects', {
            font: torchzilla,
            size: 5,
            height: 2,
        });
        const textMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff});
        aboutMe = new THREE.Mesh(geo, textMaterial);
        skills = new THREE.Mesh(geo2, textMaterial);
        projects = new THREE.Mesh(geo3, textMaterial);
        aboutMeGrp.name = 'aboutMe';
        skillsGrp.name = 'skills';
        projectsGrp.name = 'projects';
        skills.geometry.center();
        projects.geometry.center();
        aboutMe.geometry.center();
        aboutMe.position.set(0, 20, -10);
        skills.position.set(-40, 20, 0);
        projects.position.set(40, 20, 0);
        aboutHitbox = createHitbox(aboutMe);
        skillHitbox = createHitbox(skills);
        projHitbox = createHitbox(projects);
        skillsGrp.add(skills);
        projectsGrp.add(projects);
        aboutMeGrp.add(aboutMe);
        checkProgress();
        scene.add(aboutMeGrp, skillsGrp, projectsGrp);
    })
}
textLoaders();

function updateTextRotation() {
    if (aboutMe) {
        aboutMe.lookAt(camera.position);
    }
    if (skills){
        skills.lookAt(camera.position);
    }
    if (projects){
        projects.lookAt(camera.position);
    }
}



function createHitbox(object) {
    // Compute the bounding box of the object
    const box = new THREE.Box3().setFromObject(object);

    // Calculate the size of the box
    const size = new THREE.Vector3();
    box.getSize(size);

    // Create an invisible mesh using the box dimensions
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshBasicMaterial({ visible: false });
    const mesh = new THREE.Mesh(geometry, material);

    // Position the mesh at the center of the bounding box
    const center = box.getCenter(new THREE.Vector3());
    mesh.position.copy(center);

    scene.add(mesh);

    return mesh;
}

let carHitbox, car2Hitbox, car3Hitbox;
function carLoaders(){
    gltfloader.load('models/ferrari.glb', function(gltf){
        car.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        gltf.name = 'car';
        scene.add(car);
        carHitbox = createHitbox(car);
        carHitbox.name = 'car';
        checkProgress();
        });
    gltfloader.load('models/gt2.glb', function(gltf){
        car2.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        gltf.name = 'car2';
        scene.add(car2);
        car2Hitbox = createHitbox(car2);
        car2Hitbox.name = 'car2';
        checkProgress();
    });
    gltfloader.load('models/golf.glb', function(gltf){
        car3.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        gltf.name = 'car3';
        scene.add(car3);
        car3Hitbox = createHitbox(car3);
        car3Hitbox.name = 'car3';
        checkProgress();
    });
    car.position.set(0, 0, -20);
    car.name = 'car';
    car2.name = 'car2';
    car3.name = 'car3';
    car.scale.set(10,10,10);
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

//console.log(car, car2, car3);
function zoomInOnCar(object) {
    [car, car2, car3, skills, projects, aboutMe].forEach((c) => {
        if (c.name !== object.name) {
            c.visible = false;
        }
    });
    // Calculate the bounding box center
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());

    // Animate the camera to zoom in on the car
    gsap.to(camera.position, {
        duration: 1,
        x: center.x + 30 * Math.cos(0),
        y: center.y + 10, 
        z: center.z + 30 * Math.sin(0), 
        onUpdate: function () {
            camera.lookAt(center);
        },
        onComplete: function () {
            rotateAroundCar(center);
        }
    });

    // Show the text box with resume information
    if (object.name == 'car' || object.name == 'aboutMe')
        showResumeBox('resumeBox');
    if (object.name == 'car2' || object.name == 'skills')
        showResumeBox('skills');
    if (object.name == 'car3' || object.name == 'projects')
        showResumeBox('projects');
}

let rotating = false;

function rotateAroundCar(center) {
    rotating = true;

    // Define the radius of the rotation
    const radius = 30;

    // Define the initial angle
    let angle = 0;

    // Define the duration and interval for the rotation
    const duration = 10; // Duration in seconds
    const interval = 16; // Interval in milliseconds (corresponds to ~60 frames per second)

    // Define the update function
    function updateRotation() {
        // Calculate the new camera position based on the angle
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + 10; // Adjust as needed
        const z = center.z + radius * Math.sin(angle);

        // Update the camera position
        camera.position.set(x, y, z);

        // Update the camera's lookAt target
        camera.lookAt(center);

        // Increment the angle for the next frame
        angle += (2 * Math.PI * interval / 10000) / duration;

        // Schedule the next update if the rotation is ongoing
        if (rotating) {
            requestAnimationFrame(updateRotation);
        }
    }

    // Start the rotation
    updateRotation();
}

function stopRotation() {
    rotating = false;
    gsap.killTweensOf(camera.position);
    gsap.to(camera.position, {x:1,y:19,z:60, duration:1, ease: 'power2.out'});
}


function showResumeBox(position) {
    const resumeBox = document.getElementById(position);
    resumeBox.style.display = 'block';
    resumeBox.style.left = `${window.innerWidth / 2}px`;
    resumeBox.style.top = `${window.innerHeight / 2}px`;
    resumeBoxDisplayed = true;
    window.removeEventListener('mousedown', onMouseClick, true);
}

// Hide the resume box when clicking anywhere else
window.addEventListener('mousedown', (event) => {
    const resumeBox = document.getElementById('resumeBox');
    const skillBox = document.getElementById('skills');
    const projectBox = document.getElementById('projects');
    if ((!resumeBox.contains(event.target) && !skillBox.contains(event.target) && !projectBox.contains(event.target)) && rotating) {
        resumeBox.style.display = 'none';
        skillBox.style.display = 'none';
        projectBox.style.display = 'none';
        [car, car2, car3, skills, aboutMe, projects].forEach((c) => c.visible = true); // Show all models
        stopRotation();
        resumeBoxDisplayed = false;
        window.addEventListener('mousedown', onMouseClick, true);
    }
}, true);


function onMouseClick(event) {
    if (resumeBoxDisplayed) return;
    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with car hitboxes
    const intersects = raycaster.intersectObjects([carHitbox, car2Hitbox, car3Hitbox], true);

    if (intersects.length > 0) {
        const intersectedHitbox = intersects[0].object;
        const carModel = intersectedHitbox;
        zoomInOnCar(carModel);
    }
}

window.addEventListener('mousedown', onMouseClick, true);

//Composer setup
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

//Most important function
function animate() {
    requestAnimationFrame( animate );
    updateTextRotation();
    composer.render();
    controls.update();
}

//Parallax effect on aboutMe images
let currentImage;
document.querySelectorAll('.parallax').forEach(image => {
    image.addEventListener('mouseenter', (e) => {
        currentImage = e.currentTarget;
        image.addEventListener('mousemove', handleParallax);
    });

    image.addEventListener('mouseleave', (e) => {
        image.removeEventListener('mousemove', handleParallax);
        image.style.transform = 'rotateY(0deg) rotateX(0deg)'; // Reset transform
    });
});



let timeout;
function handleParallax(e) {
    if (timeout) {
        cancelAnimationFrame(timeout);
    }
    timeout = requestAnimationFrame(() => {
        if (!currentImage) {
        console.error('Image is null');
        return; // Safety check to prevent null error
        }
        const rect = currentImage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateY = x * 30;
        const rotateX = y * -30; 

        currentImage.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
}

//EasterEgg
document.querySelectorAll('.flip-container').forEach(container => {
container.addEventListener('click', () => {
    container.classList.toggle('flipped');
});
});

//LoadingChecks
function checkProgress(){
    assetCount++;
    if (assetCount >= totalAsset)
        loadingComplete();
}

function loadingComplete(){
    //console.log('assets loaded');
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    animate();
}