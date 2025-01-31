class Ring{
    constructor(){
      this.type = 'ring';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.segments = 10;
      this.thickness = 0.5;
    }
  
    render() {
      const xy = this.position;
      const rgba = this.color.slice();
      const size = this.size;
  
      // Pass the position of a point to a_Position variable
      // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      // Pass the size of a point to u_Size variable
      
      const d = this.size/200.0;
      const d_inner = d * (1-this.thickness);

      let colormul;
      let angleStep = 360 / this.segments;
      for(var angle = 0; angle < 360; angle = angle + angleStep){
        const centerPt = [xy[0], xy[1]];
        const angle1 = angle;
        const angle2 = angle+angleStep;
        let vec1 = [Math.cos(angle1*Math.PI/180)*d_inner, Math.sin(angle1*Math.PI/180)*d_inner];
        let vec2 = [Math.cos(angle2*Math.PI/180)*d_inner, Math.sin(angle2*Math.PI/180)*d_inner];
        const pt1_inner = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        const pt2_inner = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

        vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
        vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
        const pt1_outer = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        const pt2_outer = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
  
        /*colormul = 0.09 * ((180 - angle) / Math.abs(180 - angle));

        if (colormul) {
            rgba[0] = (((rgba[0]*100) + (colormul*100)) % 100)/100;
            //console.log(colormul);
        }
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        */
        drawTriangle([pt1_inner[0], pt1_inner[1], pt1_outer[0], pt1_outer[1], pt2_inner[0], pt2_inner[1]]);
        drawTriangle([pt2_inner[0], pt2_inner[1], pt1_outer[0], pt1_outer[1], pt2_outer[0], pt2_outer[1]]);
      }
  
    }
  }