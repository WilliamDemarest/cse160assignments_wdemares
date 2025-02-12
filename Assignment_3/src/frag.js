const frag = `
precision mediump float;
varying vec2 v_UV;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform float u_ColorWeight;
void main() {
    
    //gl_FragColor = u_FragColor;
    //gl_FragColor = mix(vec4(v_UV, 1.0, 1.0), u_FragColor, 0.5);
    vec4 color = mix(u_FragColor, texture2D(u_Sampler0, v_UV), u_ColorWeight);
    gl_FragColor = color;
}
`
