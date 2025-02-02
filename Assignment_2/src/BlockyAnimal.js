// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE = vert;

// Fragment shader program
var FSHADER_SOURCE = frag;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

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
let g_animation = false;
let g_headAnimation = false;
let g_headAnimationStart = 0;
let g_animationSpeed = 100;
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

function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUi();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev);} };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  renderScene();
}

var g_shapesList = [];

function track(ev) {
  if(ev.buttons == 0){
    g_lastMouse = [ev.clientX, ev.clientY];
    //console.log(g_lastMouse);
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
  if (g_headAnimation == true && (g_time - g_headAnimationStart) > (10*g_animationSpeed)) {
    g_headAnimation = false;
  }
  renderScene();
  if (g_animation) {
    requestAnimationFrame(tick);
  }
}

// Draw every shape that is supposed to be in the canvas
function renderScene(){
  const now = performance.now();

  if (g_animation){
    for (let i = 0; i < 3; i += 1){
      g_tailAngle[i] = 10*Math.sin((g_time/g_animationSpeed) - (i*45));
    }
  }

  let headOffset = 0;
  if (g_headAnimation) {
    headOffset = (-1/(g_animationSpeed*10))*((g_time - g_headAnimationStart)**2) + (g_time - g_headAnimationStart);
    headOffset = headOffset / (7*g_animationSpeed);
    //console.log(headOffset);
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const globalRotMat = new Matrix4().rotate(g_globalAngle[0], 0, 1, 0);
  globalRotMat.rotate(g_globalAngle[1], 0, 0, 1);
  globalRotMat.rotate(g_globalAngle[2], 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  const colorAnimal = [.7, 0.7, 0.8, 1.0];
  const scaleAnimal = 0.5;

  const body2 = new Cube(); // base body
  body2.color = colorAnimal;
  body2.matrix.translate(-0.2, -0.255, -0.025, 1);
  body2.matrix.scale(0.7*scaleAnimal, 0.6*scaleAnimal, 0.6*scaleAnimal, 1);
  body2.render();

  const body1 = new Cube();
  body1.matrix.concat(body2.matrix);
  body1.color = colorAnimal;
  body1.matrix.translate(1.0, 0.0, 0.1, 1);
  body1.matrix.rotate(g_tailAngle[0], 0, 0, 1);
  body1.matrix.scale(0.6, 0.8, 0.8, 1);
  body1.render();

  const tailBody = new Cube();
  tailBody.matrix.concat(body1.matrix);
  tailBody.color = colorAnimal;
  tailBody.matrix.translate(1.0, 0.0, 0.1, 1);
  tailBody.matrix.rotate(g_tailAngle[1], 0, 0, 1);
  tailBody.matrix.scale(0.6, 0.5, 0.8, 1);
  tailBody.render();

  const tailLeft = new Trapezoid(); // tail
  tailLeft.matrix.concat(tailBody.matrix);
  tailLeft.color = [0.6, 0.6, 0.7, 1.0];
  tailLeft.offsetTop = 1.2;
  tailLeft.offsetBottom = 0.5;
  tailLeft.matrix.translate(0.9, 0.25, 0.4, 1);
  tailLeft.matrix.rotate(80, 0, 1, 0);
  tailLeft.matrix.rotate(90-g_tailAngle[2], 1, 0, 0);
  tailLeft.matrix.scale(0.8, 1.5, 0.25, 1);
  tailLeft.render();

  const rightLeft = new Trapezoid(); 
  rightLeft.matrix.concat(tailBody.matrix);
  rightLeft.color = [0.6, 0.6, 0.7, 1.0];
  rightLeft.offsetTop = -1.2;
  rightLeft.offsetBottom = -0.5;
  rightLeft.matrix.translate(0.9, 0.25, 0.6, 1);
  rightLeft.matrix.rotate(100, 0, 1, 0);
  rightLeft.matrix.rotate(90-g_tailAngle[2], 1, 0, 0);
  rightLeft.matrix.scale(0.8, 1.5, 0.25, 1);
  rightLeft.render();

  const body3 = new Cube(); // forward from here
  body3.matrix.concat(body2.matrix);
  body3.color = colorAnimal;
  body3.matrix.translate(-0.6+headOffset, 0.0, 0.1, 1);
  body3.matrix.scale(0.7, 0.8, 0.8, 1);
  body3.render();

  const leftFin = new Trapezoid();
  leftFin.matrix.concat(body3.matrix);
  leftFin.color = [0.6, 0.6, 0.7, 1.0];
  leftFin.offsetTop = -1.2;
  leftFin.offsetBottom = -0.5;
  leftFin.matrix.translate(0.1, 0.15, 0.0, 1);
  leftFin.matrix.rotate(90, 1, 0, 0);
  leftFin.matrix.rotate(180-g_tailAngle[2], 0, 0, 1);
  leftFin.matrix.scale(0.6, 0.8, 0.15, 1);
  leftFin.render()

  const rightFin = new Trapezoid();
  rightFin.matrix.concat(body3.matrix);
  rightFin.color = [0.6, 0.6, 0.7, 1.0];
  rightFin.offsetTop = 1.2;
  rightFin.offsetBottom = 0.5;
  rightFin.matrix.translate(0.1, 0.15, 1, 1);
  rightFin.matrix.rotate(90, 1, 0, 0);
  rightFin.matrix.rotate(g_tailAngle[2], 0, 0, 1);
  rightFin.matrix.scale(0.6, 0.8, 0.15, 1);
  rightFin.render()

  const head = new Cube();
  head.matrix.concat(body3.matrix);
  head.color = colorAnimal;
  head.matrix.translate(0.2+headOffset, 0.6-(0.5*headOffset), 0.2, 1);
  head.matrix.rotate(-1*g_headAngle, 0, 0, 1);
  head.matrix.scale(-0.7, 0.6, 0.6, 1);
  head.render();

  const leftEye = new Cube();
  leftEye.color = [0.1, 0.1, 0.0, 1];
  leftEye.matrix.concat(head.matrix);
  leftEye.matrix.translate(1.1, 0.5, 0.1, 1);
  leftEye.matrix.scale(-0.5*scaleAnimal, 0.5*scaleAnimal, 0.5*scaleAnimal, 1);
  leftEye.render();

  const rightEye = new Cube();
  rightEye.color = [0.1, 0.1, 0.0, 1];
  rightEye.matrix.concat(head.matrix);
  rightEye.matrix.translate(1.1, 0.5, 0.7, 1);
  rightEye.matrix.scale(-0.5*scaleAnimal, 0.5*scaleAnimal, 0.5*scaleAnimal, 1);
  rightEye.render();

  const nose = new Cube();
  nose.color = [0.6, 0.6, 0.7, 1];
  nose.matrix.concat(head.matrix);
  nose.matrix.translate(1.0, 0.1, 0.25, 1);
  nose.matrix.scale(0.15, 0.3, 0.5, 1);
  nose.render();

  drawCube(new Matrix4(), [1, 0, 0, 1]);

  const frame = performance.now() - now;
  fps_display.textContent = "fps: " + 10000/frame;
}
