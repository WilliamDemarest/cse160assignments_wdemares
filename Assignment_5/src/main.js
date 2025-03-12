import * as THREE from 'three';
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
//import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import Planet from './planet.js'
import Body from './body.js'
import Ship from './ship.js'

// guide: https://threejs.org/docs/index.html#manual/en/introduction/Installation
// sidewinder: https://sketchfab.com/3d-models/sidewinder-mk-i-dca8327b5cab4697b4b7075208cfdb34#download




const scene = new THREE.Scene();
const canvas = document.getElementById("canvas1");
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const ship = new Ship(scene);

// const sky_loader = new THREE.CubeTextureLoader();

// const textureCube = sky_loader.load(new Array(6).fill('sky1.png'));
// scene.background = textureCube;
var skyGeo = new THREE.SphereGeometry(500, 25, 25);
var loader  = new THREE.TextureLoader(),
        texture = loader.load( "./real_sky4.png" );
        var material = new THREE.MeshPhongMaterial({ 
          map: texture,
  });

var sky = new THREE.Mesh(skyGeo, material);
  sky.material.side = THREE.BackSide;
  scene.add(sky);

//const camera = new THREE.PerspectiveCamera( 75, 700 / 700, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.setSize( 700, 700 );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const g_keyStates = new Array(200).fill(false);

document.onkeydown = keydown;
document.onkeyup = keyup;

canvas.addEventListener("click", async () => {
  await canvas.requestPointerLock();
});

canvas.addEventListener("mousemove", rotate);

const per_display = document.getElementById("per_display");
const ap_display = document.getElementById("ap_display");
const alt_display = document.getElementById("alt_display");

const help_display = document.getElementById("help");

const help_text_show = "Press 'h' to hide controls. Click page for mouse control. Accelerate: 'w', Roll: 'q' 'e', Increase/decrease time speed: '<' '>', Throttle +/-: 'shift' 'ctrl <br> Toggle free move: 'p'";
const help_text_hide = "Press 'h' to show key controlls";
let show_controls = false;
//document.addEventListener("scroll", (ev) => {console.log(ev);});

//document.getElementById('warp').addEventListener('mousemove', function() {g_warp = parseInt(this.value);} )



// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
// camera.position.z = 5;
class Tool {
  constructor(){
    this.speed = 1;
    this.throttle = 10;
    this.arrow_size = 1;
  }
}
let g_tool = new Tool();


function rotate(event) {
  if (!document.pointerLockElement) {
    return;
  }
  ship.rotate(event.movementX * -0.003, event.movementY * 0.003)
  // camera.rotateY(event.movementX * -0.003);
  // camera.rotateX(event.movementY * -0.003);
}

function keydown(ev){
  g_keyStates[ev.keyCode] = true;
  console.log(ev.keyCode);
  if (ev.keyCode == 190) {
    g_tool.speed += 1;
  } else if (ev.keyCode == 188 && g_tool.speed > 0) {
    g_tool.speed -= 1;
  } else if (ev.keyCode == 72) {
    if (show_controls) {
      help_display.innerHTML = help_text_hide;
      show_controls = false;
    } else {
      help_display.innerHTML = help_text_show;
      show_controls = true;
    }
  } else if (ev.keyCode == 16) {
    if (g_tool.throttle < 20) {
      g_tool.throttle += 1;
    }
  } else if (ev.keyCode == 17) {
    if (g_tool.throttle > 1) {
      g_tool.throttle -= 1;
    }
  } else if (ev.keyCode == 80) {
    if (ship.inertia) {
      ship.inertia = false;
    } else {
      ship.check_parent();
      const d = ship.parent.position.distanceTo(ship.position);
      ship.orbit(ship.parent, d);
      ship.inertia = true;
      
    }
  }
}
function keyup(ev){
  g_keyStates[ev.keyCode] = false;
}

// function move() {
//   const speed = -0.1;
//   if (g_keyStates[87]) { "W"
//     camera.translateZ(speed);
//   } 
//   if (g_keyStates[83]) { "S"
//     camera.translateZ(speed * -1);
//   } 
//   if (g_keyStates[65]) { "A"
//     camera.translateX(speed );
//   } 
//   if (g_keyStates[68]) { "D"
//     camera.translateX(speed * -1);
//   } 
//   if (g_keyStates[81]) {
//     camera.rotateZ(speed * -0.25);
//   } 
//   if (g_keyStates[69]) {
//     camera.rotateZ(speed * 0.25);
//   }
// }

const gui = new GUI();
gui.add(g_tool, 'speed', 0, 100, 1).listen();
gui.add(g_tool, 'throttle', 1, 20, 1).listen();
gui.add(g_tool, 'arrow_size', 0, 10, 1);


camera.position.z = 60;

const sun = new Planet(scene, 2, 0xffff99, false, false);
sun.mass = 100000000;
sun.influ = 500;
sun.sphere.castShadow = false;
sun.sphere.receiveShadow = false;

const blue_planet = new Planet(scene, 1, 0x00aaaa);
blue_planet.mass = 1000000;
blue_planet.influ = 10;
blue_planet.orbit(sun, 37);

const pale_moon = new Planet(scene, 0.2, 0xaaffff);
pale_moon.mass = 1000;
pale_moon.influ = 2;
pale_moon.orbit_pos = -Math.PI / 4;
pale_moon.orbit(blue_planet, 7);

const venus = new Planet(scene, 1, 0xff8800, true, './venus_radar.jpg');
venus.mass = 1000000;
venus.influ = 10;
venus.orbit(sun, 15);

const big_planet = new Planet(scene, 1.5, 0xff88ee);
big_planet.mass = 10000000;
big_planet.orbit(sun, 57);
big_planet.influ = 10;
big_planet.add_rings(scene, 2.5, 3, 0.05, 40, 0xaabfbb);
//console.log(venus.tan_velocity);

//const body1 = new Body(scene, 1, 0xff0000);
//body1.orbit(sun, 15);
//body1.velocity[2] += 0.001;

// const Geo = new THREE.SphereGeometry( 0.3, 32, 16); 
// const Mat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// const sphere = new THREE.Mesh( Geo, Mat );
// sphere.position.set( 0, 0, 0 );
// scene.add(sphere);
// console.log(sphere);



const light = new THREE.PointLight( 0xFFFFFF, 8000);
light.position.set( 0, 0, 0 );
light.castShadow = true;
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
light.distance = 499;
light.shadow.normalBias = 0.01;
light.shadow.bias = -0.0001
light.shadow.radius = 5;
light.decay = 2;
//light.shadow.bias = 0.0001;
scene.add( light );

const ambient = new THREE.AmbientLight( 0xffffff, 0.02 ); // soft white light
scene.add( ambient );

//const helper = new THREE.PointLightHelper( light );
//scene.add( helper );


function animate() {
  if(!ship.mesh && scene.getObjectByName("ship")){
    ship.mesh = scene.getObjectByName("ship");
    ship.mesh.scale.set(0.01, 0.01, 0.01);
    //ship.mesh.receiveShadow = true;
    ship.attatch_camera(camera);
    ship.init_details(scene);
    ship.orbit(blue_planet, 2);
    help_display.innerHTML = help_text_hide;

    //console.log(ship.mesh);
  } else if (!ship.mesh) {
    help_display.innerHTML = "Please wait while the ship model is loaded..."
  }
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
    //camera.rotateY(0.1);
  sun.system_tick(g_tool.speed);
  //body1.fall(g_tool.speed);

  ship.move(g_keyStates);
  ship.ap_and_per()
  ship.fall(g_tool.speed)
  ship.throttle = g_tool.throttle;
  ship.arrow_size = g_tool.arrow_size;
  per_display.innerHTML = (ship.per).toFixed(2);
  ap_display.innerHTML = (ship.apo).toFixed(2);
  alt_display.innerHTML = (ship.alt).toFixed(2);
	renderer.render( scene, camera );

}

