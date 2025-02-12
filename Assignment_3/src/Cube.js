class Cube{
  constructor(){
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.colorWeight = 0.5;
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

    // Pass the position of a point to a_Position variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_ColorWeight, 1.0 - this.colorWeight);
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    

      gl.uniform4f(u_FragColor, rgba[0]*this.lightC, rgba[1]*this.lightC, rgba[2]*this.lightC, rgba[3]);
      drawTriangle3DUV( [0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]); // back
      drawTriangle3DUV( [0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

      drawTriangle3DUV( [0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]); // bottom
      drawTriangle3DUV( [0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1]); 


      gl.uniform4f(u_FragColor, rgba[0]*this.lightB, rgba[1]*this.lightB, rgba[2]*this.lightB, rgba[3]);
      drawTriangle3DUV( [0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0]); // left side
      drawTriangle3DUV( [0,0,0, 0,1,0, 0,1,1], [0,0, 0,1, 1,1]);

      drawTriangle3DUV( [1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]); //right side
      drawTriangle3DUV( [1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1]);

      gl.uniform4f(u_FragColor, rgba[0]*this.lightA, rgba[1]*this.lightA, rgba[2]*this.lightA, rgba[3]);
      drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]); // front
      drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]); 

      drawTriangle3DUV( [0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]); // top
      drawTriangle3DUV( [0,1,0, 0,1,1, 1,1,1,], [0,0, 0,1, 1,1]);

  }
}


function drawCube(M, rgba) {


  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
  gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

  drawTriangle3D( [0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0]); // back
  drawTriangle3D( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);

  drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,1.0, 1.0,0.0,0.0]); // bottom
  drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0,]); 


  drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0]); // left side
  drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0]);

  drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,1.0, 1.0,0.0,1.0]); //right side
  drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0]);

  drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]); // front
  drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]); 

  drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]); // top
  drawTriangle3D( [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0,]);

}
