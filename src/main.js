import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; ///////////

// the actual scene
const sc = new THREE.Scene();

// making light /////////////////////
const li = new THREE.DirectionalLight(0xfffffff, 1);
li.position.set(5,5,5).set(5,5,5);
sc.add(li);
sc.add(new THREE.AmbientLight(0x404040));

const cont = window.document.querySelector(".lp")

// making a camera 
const cam = new THREE.PerspectiveCamera(50, cont.clientWidth/cont.clientHeight, 0.1, 400);

// setting the position of the camera 
cam.position.z = 1;


// adding the camera to the scene 
sc.add(cam);

// setting the renderer 
const sp = document.querySelector(".space");
const ren = new THREE.WebGLRenderer({canvas : sp, antialias : true, alpha : true});

ren.setSize(cont.clientWidth, cont.clientHeight); // setting the size of the render in the begning
const maxpix = Math.min(window.devicePixelRatio, 2);
ren.setPixelRatio(maxpix);

// setting the orbit controls before the render takes place
const orb = new OrbitControls(cam, sp);
orb.enableDamping = true;


// window.addEventListener('resize', ()=>{
//     cam.aspect = cont.clientWidth/cont.clientHeight; // setting the aspect ratio of the camera when the window is resised
//     cam.updateProjectionMatrix();
//     ren.setSize(cont.clientWidth, cont.clientHeight); // setting the size of the render when the window is resised
// });

// creating the gltf loader ///////////////////////
const lo = new GLTFLoader();
lo.load('/male_anatomy.glb', (gltf)=>{
    const model = gltf.scene;
    sc.add(model);



    console.log("exploring the individual parts");
    model.traverse((child)=>{
        console.log("- Name : ", child.name, ", Type : ", child.type);
        
    })




}, undefined, (error)=>{
    console.log("the error", error);
});

window.addEventListener('resize', ()=>{
    cam.aspect = cont.clientWidth/cont.clientHeight; // setting the aspect ratio of the camera when the window is resised
    cam.updateProjectionMatrix();
    ren.setSize(cont.clientWidth, cont.clientHeight); // setting the size of the render when the window is resised
});

// calling the renderer again and again in a loop to make it like a video
(function adi(){
    orb.update(); // as the enableDamping is true (in line 32) we have to set the update method to sync the animation to the frame rate. without this the enableDamping wont work
    ren.render(sc, cam); // calling the renderer once
    window.requestAnimationFrame(adi);
})()