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
let u_Size;

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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedType = POINT;
let g_selecteColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
// Set up actions for HTML UI elements
function addActionsForHtmlUi(){
  document.getElementById('green').onclick = function() {g_selecteColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() {g_selecteColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('clearButton').onclick = function() {g_shapesList = []; renderAllShapes(); };
  document.getElementById('point').onclick = function() {g_selectedType=POINT; };
  document.getElementById('triangle').onclick = function() {g_selectedType=TRIANGLE; };
  document.getElementById('circle').onclick = function() {g_selectedType=CIRCLE; };
  

  document.getElementById('picture').onclick = drawPicture;
  document.getElementById('machineA').onclick = apples_machine;
  document.getElementById('machineB').onclick = garf_machine;

  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selecteColor[0] = (this.value)/100; } )
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selecteColor[1] = (this.value)/100; } )
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selecteColor[2] = (this.value)/100; } )

  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; } )

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
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {
  
  // Extract the event click and return it in WebGL coordinates
  const [x, y] = convertCoordinatesEventToGl(ev);

  // Store the coordinates to g_points array
  // g_points.push([x, y]);
  // g_colors.push(g_selecteColor.slice());
  // g_sizes.push(g_selectedSize);
  let point;
  if (g_selectedType == POINT){
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }

  point.position = [x, y];
  point.color = g_selecteColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();

}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGl(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y]);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var len = g_points.length;
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function drawPicture(){
  const segments = 20;
  const size = 100;
  const thickness = 0.2;
  let rings = [new Ring(), new Ring(), new Ring()];

  rings[0].position = [-0.25, 0.25];
  rings[0].color = [0.0, 0.0, 1.0, 1.0];
  rings[0].size = size;
  rings[0].thickness = thickness;
  rings[0].segments = segments;

  rings[1].position = [0.25, 0.25];
  rings[1].color = [0.5, 0.0, 1.0, 1.0];
  rings[1].size = size;
  rings[1].thickness = thickness;
  rings[1].segments = segments;

  rings[2].position = [0.0, -0.25];
  rings[2].color = [1.0, 0.0, 0.0, 1.0];
  rings[2].size = size;
  rings[2].thickness = thickness;
  rings[2].segments = segments;

  for (let i = 0; i < rings.length; i += 1){
    rings[i].render();
  }

}
