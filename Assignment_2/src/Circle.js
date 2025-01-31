class Circle{
  constructor(){
    this.type = 'circle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.segments = 10;
  }

  render() {
    const xy = this.position;
    const rgba = this.color;
    // Pass the position of a point to a_Position variable
    // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size of a point to u_Size variable
    
    const d = this.size/200.0;
    let angleStep = 360 / this.segments;
    for(var angle = 0; angle < 360; angle = angle + angleStep){
      const centerPt = [xy[0], xy[1]];
      const angle1 = angle;
      const angle2 = angle+angleStep;
      const vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
      const vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
      const pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
      const pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

      drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
    }

  }
}