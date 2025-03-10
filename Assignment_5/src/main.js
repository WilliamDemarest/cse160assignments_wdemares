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
        texture = loader.load( "./src/real_sky4.png" );
        var material = new THREE.MeshPhongMaterial({ 
          map: texture,
  });

var sky = new THREE.Mesh(skyGeo, material);
  sky.material.side = THREE.BackSide;
  scene.add(sky);

//const camera = new THREE.PerspectiveCamera( 75, 700 / 700, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
renderer.setSize( window.innerWidth, window.innerHeight );
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
//document.addEventListener("scroll", (ev) => {console.log(ev);});

//document.getElementById('warp').addEventListener('mousemove', function() {g_warp = parseInt(this.value);} )



// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
// camera.position.z = 5;
class Time {
  constructor(){
    this.speed = 1;
  }
}
let g_time = new Time();


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
  if (ev.keyCode == 190) {
    g_time.speed += 1;
  } else if (ev.keyCode == 188 && g_time.speed > 0) {
    g_time.speed -= 1;
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
gui.add(g_time, 'speed', 0, 100, 1).listen();


camera.position.z = 60;

const sun = new Planet(scene, 2, 0xffff99, false, false);
sun.mass = 100000000;
sun.influ = 500;

const blue_planet = new Planet(scene, 1, 0x00aaaa);
blue_planet.mass = 1000000;
blue_planet.influ = 10;
blue_planet.orbit(sun, 37);

const pale_moon = new Planet(scene, 0.2, 0xaaffff);
pale_moon.mass = 1000;
pale_moon.influ = 2;
pale_moon.orbit(blue_planet, 7);

const venus = new Planet(scene, 1, 0xff8800, true, './src/venus_radar.jpg');
venus.mass = 1000000;
venus.influ = 7;
venus.orbit(sun, 15);

const big_planet = new Planet(scene, 1.5, 0xff88ee);
big_planet.mass = 10000000;
big_planet.orbit(sun, 57);
big_planet.influ = 10;
big_planet.add_rings(scene, 2, 2.5, 0.05, 20, 0xaabfbb);
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
scene.add( light );

const ambient = new THREE.AmbientLight( 0xffffff, 0.02 ); // soft white light
scene.add( ambient );

//const helper = new THREE.PointLightHelper( light );
//scene.add( helper );


function animate() {
  if(!ship.mesh && scene.getObjectByName("ship")){
    ship.mesh = scene.getObjectByName("ship");
    ship.mesh.scale.set(0.01, 0.01, 0.01);
    ship.attatch_camera(camera);
    ship.init_details(scene);
    ship.orbit(blue_planet, 2);

    //console.log(ship.mesh);
  }
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
    //camera.rotateY(0.1);
  sun.system_tick(g_time.speed);
  //body1.fall(g_time.speed);

  ship.move(g_keyStates);
  ship.fall(g_time.speed)
	renderer.render( scene, camera );

}

