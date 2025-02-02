class Cube{
  constructor(){
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
    this.lightA = 1.0;
    this.lightB = 0.9;
    this.lightC = 0.7;

    this.vertexBuffer = null;
  }

  render() {
    //const xy = this.position;
    const rgba = this.color;

    if (this.vertexBuffer === null) {
      this.vertexBuffer = gl.createBuffer();
      if (!this.vertexBuffer) {
        console.log('Failed to create the buffer object');
      }
    }

    // Pass the position of a point to a_Position variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    

      gl.uniform4f(u_FragColor, rgba[0]*this.lightC, rgba[1]*this.lightC, rgba[2]*this.lightC, rgba[3]);
      drawTriangle3D( [0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0], this.vertexBuffer); // back
      drawTriangle3D( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0], this.vertexBuffer);

      drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,1.0, 1.0,0.0,0.0], this.vertexBuffer); // bottom
      drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0,], this.vertexBuffer); 


      gl.uniform4f(u_FragColor, rgba[0]*this.lightB, rgba[1]*this.lightB, rgba[2]*this.lightB, rgba[3]);
      drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0], this.vertexBuffer); // left side
      drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0], this.vertexBuffer);

      drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,1.0, 1.0,0.0,1.0], this.vertexBuffer); //right side
      drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0], this.vertexBuffer);

      gl.uniform4f(u_FragColor, rgba[0]*this.lightA, rgba[1]*this.lightA, rgba[2]*this.lightA, rgba[3]);
      drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], this.vertexBuffer); // front
      drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], this.vertexBuffer); 

      drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0], this.vertexBuffer); // top
      drawTriangle3D( [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0,], this.vertexBuffer);

  }
}


function drawCube(M, rgba) {

  vertexBuffer = gl.createBuffer();
  if (vertexBuffer) {
    console.log('Failed to create the buffer object');
  }

  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
  gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

  drawTriangle3D( [0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0], vertexBuffer); // back
  drawTriangle3D( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0], vertexBuffer);

  drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,1.0, 1.0,0.0,0.0], vertexBuffer); // bottom
  drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0,], vertexBuffer); 


  drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0], vertexBuffer); // left side
  drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0], vertexBuffer);

  drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,1.0, 1.0,0.0,1.0], vertexBuffer); //right side
  drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0], vertexBuffer);

  drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], vertexBuffer); // front
  drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], vertexBuffer); 

  drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0], vertexBuffer); // top
  drawTriangle3D( [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0,], vertexBuffer);

}
