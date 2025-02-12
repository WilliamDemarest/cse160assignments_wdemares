// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE = vert;

// Fragment shader program
var FSHADER_SOURCE = frag;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_ColorWeight;
const fps_display = document.getElementById("fps");


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

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_ColorWeight = gl.getUniformLocation(gl.program, 'u_ColorWeight');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_ColorWeight');
    return false;
  }

}

function initTextures() {

  // Get the storage location of u_Sampler
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToGLSL(image, u_Sampler0, gl.TEXTURE0); };
  // Tell the browser to load an image
  image.src = '../resources/sky.jpg';

  return true;
}

function sendTextureToGLSL(image, sampler, texture_slot) {
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
  gl.uniform1i(sampler, 0);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedType = POINT;
let g_selecteColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_globalAngle = [-20, 0, -10];
let g_lastMouse = [200, 300];
let g_headAngle = 20;
let g_tailAngle = [0, 0, 0];
let g_time = 0;
let g_animation = true;
let g_animationSpeed = 100;
const g_keyStates = new Array(100).fill(false);
let g_camera;
// Set up actions for HTML UI elements
function addActionsForHtmlUi(){
  document.getElementById('start').onclick = function() {g_animation = true; start_animation(); };
  document.getElementById('stop').onclick = function() {g_animation = false; };

  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle[0] = parseInt(this.value); renderScene();} )
  document.getElementById('speed').addEventListener('mousemove', function() {g_animationSpeed = -1*parseInt(this.value);} )

  document.getElementById('headAngle').addEventListener('mousemove', function() {g_headAngle = parseInt(this.value); renderScene();} );
  document.getElementById('tailAngle1').addEventListener('mousemove', function() {g_tailAngle[0] = parseInt(this.value); renderScene();} );
  document.getElementById('tailAngle2').addEventListener('mousemove', function() {g_tailAngle[1] = parseInt(this.value); renderScene();} );
  document.getElementById('tailAngle3').addEventListener('mousemove', function() {g_tailAngle[2] = parseInt(this.value); renderScene();} );

  // document.getElementById('webgl').addEventListener('ondrag', function() {g_selectedSize = this.value; } );
  document.getElementById('webgl').addEventListener('mousedown', click );
  document.getElementById('webgl').addEventListener('mousemove', track );
}


// -------------------------------------- main()
function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUi();
  initTextures(gl,0);

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev);} };
  document.onkeydown = keydown;
  document.onkeyup = keyup;

  g_camera = new Camera(canvas);
  g_camera.eye.elements = [0, 0, 3];
  g_camera.at.elements = [0, 0, -100];
  g_camera.up.elements = [0, 1, 0];
  g_camera.updateLook();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  start_animation();
  renderScene();
}

var g_shapesList = [];

function track(ev) {
  if(ev.buttons == 0){
    g_lastMouse = [ev.clientX, ev.clientY];
    //console.log(g_lastMouse);
  }
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
    g_camera.panLeft();
  } 
  if (g_keyStates[69]) {
    g_camera.panRight();
  }
}

function click(ev) {
  if (g_animation == true && ev.shiftKey && g_headAnimation == false) {
    g_headAnimation = true;
    g_headAnimationStart = performance.now();
  }
  // Extract the event click and return it in WebGL coordinates
  // const [x, y] = convertCoordinatesEventToGl(ev);
  const x = g_lastMouse[0] - ev.clientX; // x coordinate of a mouse pointer
  const y = g_lastMouse[1] - ev.clientY; // y coordinate of a mouse pointer

  g_globalAngle[0] += x;
  g_globalAngle[1] -= y;
  g_lastMouse = [ev.clientX, ev.clientY];
  // console.log(x + ", " + g_lastMouse[0] + " - " + ev.clientX);
  // console.log(g_globalAngle + ", " + y);

  renderScene();
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
  move();
  renderScene();
  if (g_animation) {
    requestAnimationFrame(tick);
  }
}

// Draw every shape that is supposed to be in the canvas
function renderScene(){
  const now = performance.now();

  /*if (g_animation){
    for (let i = 0; i < 3; i += 1){
      g_tailAngle[i] = 10*Math.sin((g_time/g_animationSpeed) - (i*45));
    }
  }

  let headOffset = 0;
  if (g_headAnimation) {
    headOffset = (-1/(g_animationSpeed*10))*((g_time - g_headAnimationStart)**2) + (g_time - g_headAnimationStart);
    headOffset = headOffset / (7*g_animationSpeed);
    //console.log(headOffset);
  }*/

  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements); 

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements); 

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const globalRotMat = new Matrix4().rotate(g_globalAngle[0], 0, 1, 0);
  globalRotMat.rotate(g_globalAngle[1], 0, 0, 1);
  globalRotMat.rotate(g_globalAngle[2], 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  const sky = new Cube();
  //sky.matrix.rotate(45, 1, 0, 0)
  sky.render();

  //drawCube(new Matrix4(), [1, 0, 0, 1]);

  const frame = performance.now() - now;
  fps_display.textContent = "fps: " + 1000/frame;
}
