class Cube{
  constructor(){
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.colorWeights = [1, 0, 0, 0, 0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
    this.lightA = 1.0;
    this.lightB = 0.9;
    this.lightC = 0.7;

    this.vertexBuffer = null;

    this.cords = [
      0,0,1, 1,0,1, 1,1,1, // back
      0,0,1, 1,1,1, 0,1,1,

      0,0,0, 1,0,0, 1,0,1,  //bottom
      0,0,0, 1,0,1, 0,0,1,

      0,0,0, 0,0,1, 0,1,1,  // left side
      0,0,0, 0,1,1, 0,1,0,

      1,0,0, 1,1,1, 1,0,1,  // right side
      1,0,0, 1,1,0, 1,1,1,

      0,0,0, 1,1,0, 1,0,0, // front
      0,0,0, 0,1,0, 1,1,0,

      0,1,0, 1,1,1, 1,1,0, // top
      0,1,0, 0,1,1, 1,1,1,
    ];

    this.uv = [
      0,0, 1,0, 1,1, // back
      0,0, 1,1, 0,1,

      0,0, 1,0, 1,1, //bottom
      0,0, 1,1, 0,1,

      0,0, 1,0, 1,1,// left side
      0,0, 1,1, 0,1,

      0,0, 1,1, 1,0, // right side
      0,0, 0,1, 1,1,

      0,0, 1,1, 1,0, // front
      0,0, 0,1, 1,1,

      0,0, 1,1, 1,0, // top
      0,0, 0,1, 1,1,
    ];

    this.verticies = null;

  }

  init_verticies(){
    this.verticies = new Array();
    //console.log(this.verticies.length);

    let j = 0;
    //let k = 0;
    for (let i = 0; i < this.cords.length; i += 3) {
      this.verticies.push(this.cords[i]);
      this.verticies.push(this.cords[i+1]);
      this.verticies.push(this.cords[i+2]);

      this.verticies.push(this.uv[j]);
      this.verticies.push(this.uv[j+1]);
      j += 2;
      //console.log(k + " " + j + " " + i)
    }
  }

  render() {
    //const xy = this.position;
    const rgba = this.color;

    // Pass the position of a point to a_Position variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_ColorWeight[0], 1.0 - this.colorWeights[0]);
    gl.uniform1f(u_ColorWeight[1], 1.0 - this.colorWeights[1]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    

      //gl.uniform4f(u_FragColor, rgba[0]*this.lightC, rgba[1]*this.lightC, rgba[2]*this.lightC, rgba[3]);
      drawTriangle3DUV( [0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]); // back
      drawTriangle3DUV( [0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

      drawTriangle3DUV( [0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]); // bottom
      drawTriangle3DUV( [0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1]); 


      //gl.uniform4f(u_FragColor, rgba[0]*this.lightB, rgba[1]*this.lightB, rgba[2]*this.lightB, rgba[3]);
      drawTriangle3DUV( [0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0]); // left side
      drawTriangle3DUV( [0,0,0, 0,1,0, 0,1,1], [0,0, 0,1, 1,1]);

      drawTriangle3DUV( [1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]); //right side
      drawTriangle3DUV( [1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1]);

      //gl.uniform4f(u_FragColor, rgba[0]*this.lightA, rgba[1]*this.lightA, rgba[2]*this.lightA, rgba[3]);
      drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]); // front
      drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]); 

      drawTriangle3DUV( [0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]); // top
      drawTriangle3DUV( [0,1,0, 0,1,1, 1,1,1,], [0,0, 0,1, 1,1]);

  }

  fastRender() {
    if (this.verticies == null) {
      this.init_verticies();
    }
    const rgba = this.color;


    // Pass the position of a point to a_Position variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_ColorWeight[0], 1.0 - this.colorWeights[0]);
    gl.uniform1f(u_ColorWeight[1], 1.0 - this.colorWeights[1]);
    gl.uniform1f(u_ColorWeight[2], 1.0 - this.colorWeights[2]);
    gl.uniform1f(u_ColorWeight[3], 1.0 - this.colorWeights[3]);
    gl.uniform1f(u_ColorWeight[4], 1.0 - this.colorWeights[4]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


    //console.log(this.verticies);

    drawAllTriangle3DUV(this.verticies)
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
