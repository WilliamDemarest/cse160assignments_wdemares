// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE = vert;

// Fragment shader program
var FSHADER_SOURCE = frag;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_dayShade;
let u_Sampler = new Array(5);
let u_ColorWeight = new Array(5);
let u_lightPos;
let u_enableLight;
let u_cameraPosition;
const fps_display = document.getElementById("fps");
const blocks_display = document.getElementById("blocks");


function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.CULL_FACE);
  //gl.cullFace(gl.BACK);

}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }


  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }


  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_dayShade = gl.getUniformLocation(gl.program, 'u_dayShade');
  if (!u_dayShade) {
    console.log('Failed to get the storage location of u_dayShade');
    return false;
  }

  u_enableLight = gl.getUniformLocation(gl.program, 'u_enableLight');
  if (!u_enableLight) {
    console.log('Failed to get the storage location of u_enableLight');
    return false;
  }

  u_cameraPosition = gl.getUniformLocation(gl.program, 'u_cameraPosition');
  if (!u_cameraPosition) {
    console.log('Failed to get the storage location of u_cameraPosition');
    return false;
  }


  u_Sampler[0] = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler[0]) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_ColorWeight[0] = gl.getUniformLocation(gl.program, 'u_ColorWeight0');
  if (!u_ColorWeight[0]) {
    console.log('Failed to get the storage location of u_ColorWeight0');
    return false;
  }

  u_Sampler[1] = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler[1]) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_ColorWeight[1] = gl.getUniformLocation(gl.program, 'u_ColorWeight1');
  if (!u_ColorWeight[1]) {
    console.log('Failed to get the storage location of u_ColorWeight1');
    return false;
  }

  u_Sampler[2] = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler[2]) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_ColorWeight[2] = gl.getUniformLocation(gl.program, 'u_ColorWeight2');
  if (!u_ColorWeight[2]) {
    console.log('Failed to get the storage location of u_ColorWeight2');
    return false;
  }

  u_Sampler[3] = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler[3]) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  u_ColorWeight[3] = gl.getUniformLocation(gl.program, 'u_ColorWeight3');
  if (!u_ColorWeight[3]) {
    console.log('Failed to get the storage location of u_ColorWeight3');
    return false;
  }

  u_Sampler[4] = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler[4]) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
  }

  u_ColorWeight[4] = gl.getUniformLocation(gl.program, 'u_ColorWeight4');
  if (!u_ColorWeight[4]) {
    console.log('Failed to get the storage location of u_ColorWeight4');
    return false;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return false;
  }

}

function initTextures() {

  // Get the storage location of u_Sampler
  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image1.onload = function(){ sendTextureToGLSL(image1, u_Sampler[0], gl.TEXTURE0, 0); };
  // Tell the browser to load an image
  image1.src = '../resources/BadLightArmor.png';


  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image2.onload = function(){ sendTextureToGLSL(image2, u_Sampler[1], gl.TEXTURE1, 1); };
  // Tell the browser to load an image
  image2.src = '../resources/SillySkyDay.png';

  var image3 = new Image();  // Create the image object
  if (!image3) {
    console.log('Failed to create the image3 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image3.onload = function(){ sendTextureToGLSL(image3, u_Sampler[2], gl.TEXTURE2, 2); };
  // Tell the browser to load an image
  image3.src = '../resources/grass2.png';

  var image4 = new Image();  // Create the image object
  if (!image4) {
    console.log('Failed to create the image4 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image4.onload = function(){ sendTextureToGLSL(image4, u_Sampler[3], gl.TEXTURE3, 3); };
  // Tell the browser to load an image
  image4.src = '../resources/grass.png';


  var image5 = new Image();  // Create the image object
  if (!image5) {
    console.log('Failed to create the image5 object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image5.onload = function(){ sendTextureToGLSL(image5, u_Sampler[4], gl.TEXTURE4, 4); };
  // Tell the browser to load an image
  image5.src = '../resources/nightSky.png';

  return true;
}

function sendTextureToGLSL(image, sampler, texture_slot, slot) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit
  gl.activeTexture(texture_slot);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(sampler, slot);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedType = POINT;
let g_selecteColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_globalAngle = [0, 0, 0];
let g_lastMouse = [0, 0];
let g_headAngle = 20;
let g_tailAngle = [0, 0, 0];
let g_time = 0;
let g_daytime = 499;
let g_animation = true;
let g_animationSpeed = 100;
const g_keyStates = new Array(500).fill(false);
let g_camera;
const g_water_color = [0.15, 0.15, 0.8, 1];
let g_day_shades = new Array(720);
let g_world = "meadow";
let g_beam = new Array(100);
let g_enable_beam = false;
let g_lightPos = [0, 18, 0];
let g_time_direction = false;
let g_enableLight = 2;
// Set up actions for HTML UI elements
function addActionsForHtmlUi(){
  document.getElementById('start').onclick = function() {g_animation = true; start_animation(); };
  document.getElementById('stop').onclick = function() {g_animation = false; };

  //document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle[0] = parseInt(this.value); renderScene();} )
  document.getElementById('time').addEventListener('mousemove', function() {g_daytime = parseInt(this.value);} )

  document.getElementById('meadow').onclick = function() {g_world = "meadow";}
  document.getElementById('maze').onclick = function() {g_world = "maze";}

  document.getElementById('lighting').onclick = function() {g_enableLight = 2;}
  document.getElementById('no_lighting').onclick = function() {g_enableLight = 0;}
  document.getElementById('show_normals').onclick = function() {g_enableLight = 1;}

  
  // document.getElementById('webgl').addEventListener('ondrag', function() {g_selectedSize = this.value; } );
  //document.getElementById('webgl').addEventListener('mousedown', click );
  document.getElementById('webgl').addEventListener('mousemove', track );
  document.getElementById('webgl').onmouseout = function() {g_lastMouse = [0, 0];};
}


// -------------------------------------- main()
function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUi();
  initTextures(gl,0);

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = (event) => click(event);
  //canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev);} };
  document.onkeydown = keydown;
  document.onkeyup = keyup;

  g_camera = new Camera(canvas);
  g_camera.eye.elements = [0, 7, 3];
  g_camera.at.elements = [0, 7, -100];
  g_camera.up.elements = [0, 1, 0];
  g_camera.updateLook();

  populate_times();

  for (let i = 0; i < 100; i += 1){
    g_beam[i] = new Vector3();
  }


  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  start_animation();
  renderScene();
}

var g_shapesList = [];

// function track(ev) {
//   if(ev.buttons == 0){
//     g_lastMouse = [ev.clientX, ev.clientY];
//     //console.log(g_lastMouse);
//   }
// }

function track(ev) {
  //const x = g_lastMouse[0] - ev.clientX; // x coordinate of a mouse pointer
  let x = 0;
  let y = 0;
  if (ev.clientX < 600 && ev.clientY < 660 && ev.clientX > 5 && ev.clientY > 69) {
    if (ev.clientX < 280 || ev.clientX > 320) {
      x = (ev.clientX - 300) / 3000;
    }

    if (ev.clientY < 349 || ev.clientY > 389) {
      y = (ev.clientY - 369) / 3000;
    }
  }

  g_lastMouse = [x, y];
}

function keydown(ev){
  g_keyStates[ev.keyCode] = true;
}
function keyup(ev){
  g_keyStates[ev.keyCode] = false;
}

function move(){
  if (g_keyStates[87]) {
    g_camera.moveForward();
  } 
  if (g_keyStates[83]) {
    g_camera.moveBackwards();
  } 
  if (g_keyStates[65]) {
    g_camera.moveLeft();
  } 
  if (g_keyStates[68]) {
    g_camera.moveRight();
  } 
  if (g_keyStates[81]) {
    g_camera.rotateClock(-1);
  } 
  if (g_keyStates[69]) {
    g_camera.rotateClock(1);
  }
}

function click(ev) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Extract the event click and return it in WebGL coordinates
  // const [x, y] = convertCoordinatesEventToGl(ev);
  // const x = g_lastMouse[0] - ev.clientX; // x coordinate of a mouse pointer
  // const y = g_lastMouse[1] - ev.clientY; // y coordinate of a mouse pointer

  // g_globalAngle[0] += x;
  // g_globalAngle[1] -= y;
  // g_lastMouse = [ev.clientX, ev.clientY];
  // console.log(x + ", " + g_lastMouse[0] + " - " + ev.clientX);
  // console.log(g_globalAngle + ", " + y);

  const f = new Vector3();
  f.set(g_camera.at);
  f.sub(g_camera.eye);
  f.normalize();

  const start = new Vector3(); // TODO: Start lower?
  start.set(g_camera.eye);
  const check = new Vector3();
  const point = new Vector3();
  for (let i = 1; i < 100; i += 1) {
    point.set(f);
    point.mul(i*0.1);
    check.set(point);
    check.add(start);

    check.elements[0] = Math.floor(check.elements[0]);
    //check.elements[1] = Math.floor(check.elements[0]);
    check.elements[2] = Math.floor(check.elements[2]);
    if (g_enable_beam) {
      g_beam[i].set(check);
    }
    if (g_world == "meadow") {
      if (map0_array[check.elements[0]+16][check.elements[2]+16][0] + 2 >= check.elements[1]) {
        let change = 0;
        if (!ev.shiftKey && map0_color.length - 1 > map0_array[check.elements[0]+16][check.elements[2]+16][0]) {
          change = 1;
        } else if (ev.shiftKey) {
          change = -1;
        }
        map0_array[check.elements[0]+16][check.elements[2]+16][0] += change;
        i = 100;
        //console.log("here");
      }
    } else if (g_world = "maze") {
      if (map1_array[check.elements[0]+16][check.elements[2]+16][0] + 2 >= check.elements[1]) {
        let change = 0;
        if (!ev.shiftKey && map1_color.length - 1 > map1_array[check.elements[0]+16][check.elements[2]+16][0]) {
          change = 1;
        } else if (ev.shiftKey) {
          change = -1;
        }
        map1_array[check.elements[0]+16][check.elements[2]+16][0] += change;
        i = 100;
        //console.log("here");
      }
    }
  }

  //console.log(g_beam);
  //renderScene();
}

// Extract the event click and return it in WebGL coordinates
/*function convertCoordinatesEventToGl(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
}*/

function start_animation(){
  tick();
}

function tick(){
  g_time = performance.now();
  if (g_time_direction) {
    g_daytime += 0.5;
  } else {
    g_daytime -= 0.5;
  }
  if (g_daytime >= 499) {
    g_time_direction = false;
    g_daytime = 499;
  } else if (g_daytime <= 1) {
    g_time_direction = true;
    g_daytime = 1;
  }

  g_camera.panLeft(g_lastMouse[0]);
  g_camera.panUp(g_lastMouse[1]);
  move();
  renderScene();
  if (g_animation) {
    requestAnimationFrame(tick);
  }
}

// Draw every shape that is supposed to be in the canvas
function renderScene(){
  const now = performance.now();
  let blocks = 0;

  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements); 

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements); 

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const globalRotMat = new Matrix4().rotate(g_globalAngle[0], 0, 1, 0);
  //globalRotMat.rotate(g_globalAngle[1], 0, 0, 1);
  //globalRotMat.rotate(g_globalAngle[2], 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.uniform3f(u_dayShade, 1, 1, 1);
  gl.uniform1f(u_enableLight, g_enableLight);
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_cameraPosition, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

  const day_int = parseInt(g_daytime);

  const sky = new Cube();
  sky.colorWeights[0] = 0;
  sky.colorWeights[3] = 1;
  sky.colorWeights[2] = g_day_shades[day_int];
  sky.matrix.translate(25, 50, 25);
  sky.matrix.scale(-50, -50, -50);
  sky.fastRenderNormals();

  //console.log(g_day_shades[g_daytime]);

  // if (g_day_shades[g_daytime] < 0.15) {
  //   gl.uniform3f(u_dayShade, 0.15, 0.15, 0.15);
  // } else {
  //   gl.uniform3f(u_dayShade, g_day_shades[g_daytime+50], g_day_shades[g_daytime+30], g_day_shades[g_daytime]);
  // }
  gl.uniform3f(u_dayShade, g_day_shades[day_int+50], g_day_shades[day_int+30], g_day_shades[day_int]);

  if (g_world == "meadow") {
    const body = new Cube();
    for (let x = 0; x < 32; x += 1) {
      for (let z = 0; z < 32; z += 1) {
        for (let y = map0_array[x][z][1]; y <= map0_array[x][z][0]; y += 1) {
          body.color[0] = map0_color[y][0];
          body.color[1] = map0_color[y][1];
          body.color[2] = map0_color[y][2];
          
          body.matrix.setTranslate(x-16, y+1, z-16);
          if (y == 5) {
            body.colorWeights[0] = 0;
            body.colorWeights[4] = map0_array[x][z][2];
          } else if (y > 5 && y < 8) {
            body.colorWeights[0] = (y-5)*0.1;
            body.colorWeights[4] = 0;
          } else if (y < 4) {
            body.color[2] = body.color[2]*0.6 + 0.4;
            body.colorWeights[0] = 1;
          } else {
            body.colorWeights[0] = 1;
          }
          body.fastRenderNormals();
          blocks += 1;
        }
      }
    }

    const ground = new Cube();
    ground.colorWeights[0] = 1.0;
    ground.color = g_water_color;
    ground.color[3] = 0.5;
    ground.matrix.translate(-16, 5.01, -16);
    ground.matrix.scale(32, 0.1, 32);
    ground.fastRenderNormals();

  } else if (g_world == "maze") {
    const body = new Cube();
    for (let x = 0; x < 32; x += 1) {
      for (let z = 0; z < 32; z += 1) {
        for (let y = map1_array[x][z][1]; y <= map1_array[x][z][0]; y += 1) {
          if (y > 0) {
            body.color[0] = map1_color[y][0];
            body.color[1] = map1_color[y][1];
            body.color[2] = map1_color[y][2];
            
            body.matrix.setTranslate(x-16, y+1, z-16);
            body.colorWeights[0] = 0;
            body.colorWeights[4] = map1_array[x][z][2];
            body.fastRenderNormals();
            blocks += 1;
          }
        }
      }
    }

    const ground = new Cube();
    ground.colorWeights[0] = 1.0;
    ground.color = map1_color[0];
    ground.matrix.translate(-16, 1, -16);
    ground.matrix.scale(32, 1, 32);
    ground.fastRenderNormals();
  }

  if (g_enable_beam) {
    const cube = new Cube();
    for (let i = 0; i < 100; i += 1) {
      cube.matrix.setTranslate(g_beam[i].elements[0], g_beam[i].elements[1], g_beam[i].elements[2]);
      cube.matrix.scale(0.1, 0.1, 0.1);
      cube.fastRender();
      //blocks += 1;
      //console.log(blocks);
    }
  }

  g_lightPos[0] = Math.cos((g_daytime+250) / (500 / Math.PI))*24;
  g_lightPos[1] = Math.sin((g_daytime+250) / (500 / Math.PI))*-24;
  const sun = new Sphere();
  sun.color = [1,1,0,1];
  sun.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  sun.matrix.scale(-1,-1,-1);
  sun.fastRenderNormals();

  const sphere = new Sphere();
  sphere.color = [1,0,0,1];
  sphere.matrix.translate(0, 8, 0);
  sphere.fastRenderNormals();

  // const cube2 = new Cube();
  // cube2.matrix.translate(0, 8, 0);
  // cube2.matrix.scale(0.5, 0.5, 0.5);
  // cube2.fastRenderNormals();

  const frame = performance.now() - now;
  fps_display.textContent = "fps: " + 1000/frame;
  blocks_display.textContent = "Total terrain blocks: " + blocks;
}

function sigmoid(x) {
  return (Math.E ** x) / (1 + (Math.E ** x));
}

function populate_times() {
  for (let i = 0; i < 720; i += 1) {
    g_day_shades[i] = (sigmoid((i / 25)-10));
  }
}

