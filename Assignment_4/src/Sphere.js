let sin = Math.sin;
let cos = Math.cos;

class Sphere{
  constructor(){
    this.type = 'sphere';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.colorWeights = [1, 0, 0, 0, 0];
    //this.size = 5.0;
    this.segments = 10;
    this.matrix = new Matrix4();

    this.vertexBuffer = null;

    //this.verticies = null;
    this.verticies_normals = null;

  }

  init_verticies_normals(){
    this.verticies_normals = new Array();
    //console.log(this.verticies.length);

    let d = Math.PI/10;
    let dd = Math.PI/10;
    //let k = 0;
    for (let t = 0; t < Math.PI; t += d) {
      for (let r = 0; r < (2*Math.PI); r += d) {
        const p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];

        const p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];
        const p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];
        const p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];

        // this.verticies_normals = this.verticies_normals.concat(p1);
        // this.verticies_normals = this.verticies_normals.concat([0,0]);
        // this.verticies_normals = this.verticies_normals.concat(p1);

        // this.verticies_normals = this.verticies_normals.concat(p2);
        // this.verticies_normals = this.verticies_normals.concat([0,0]);
        // this.verticies_normals = this.verticies_normals.concat(p2);

        // this.verticies_normals = this.verticies_normals.concat(p4);
        // this.verticies_normals = this.verticies_normals.concat([0,0]);
        // this.verticies_normals = this.verticies_normals.concat(p4);


        // this.verticies_normals = this.verticies_normals.concat(p1);
        // this.verticies_normals = this.verticies_normals.concat([0,0]);
        // this.verticies_normals = this.verticies_normals.concat(p1);

        // this.verticies_normals = this.verticies_normals.concat(p4);
        // this.verticies_normals = this.verticies_normals.concat([0,0]);
        // this.verticies_normals = this.verticies_normals.concat(p4);

        // this.verticies_normals = this.verticies_normals.concat(p3);
        // this.verticies_normals = this.verticies_normals.concat([0,0]);
        // this.verticies_normals = this.verticies_normals.concat(p3);
        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p1[i]);}
        this.verticies_normals.push(0); this.verticies_normals.push(0);
        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p1[i]);}

        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p2[i]);}
        this.verticies_normals.push(0); this.verticies_normals.push(0);
        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p2[i]);}

        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p4[i]);}
        this.verticies_normals.push(0); this.verticies_normals.push(0);
        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p4[i]);}


        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p1[i]);}
        this.verticies_normals.push(0); this.verticies_normals.push(0);
        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p1[i]);}

        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p4[i]);}
        this.verticies_normals.push(0); this.verticies_normals.push(0);
        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p4[i]);}

        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p3[i]);}
        this.verticies_normals.push(0); this.verticies_normals.push(0);
        for (let i = 0; i < 3; i += 1) {this.verticies_normals.push(p3[i]);}
      }
    }
  }

  fastRenderNormals() {
    if (this.verticies_normals == null) {
      this.init_verticies_normals();
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

    //console.log(this.verticies_normals);
    drawAllTriangle3DUVNormal(this.verticies_normals);
  }

}
