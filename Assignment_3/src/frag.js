const frag = `
precision mediump float;
varying vec2 v_UV;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform float u_ColorWeight0;
uniform sampler2D u_Sampler1;
uniform float u_ColorWeight1;
void main() {
    
    //gl_FragColor = u_FragColor;
    //gl_FragColor = mix(vec4(v_UV, 1.0, 1.0), u_FragColor, 0.5);
    vec4 sky = texture2D(u_Sampler1, v_UV);
    vec4 armor = texture2D(u_Sampler0, v_UV);
    vec4 color1 = mix(armor, sky, u_ColorWeight1);
    vec4 color0 = mix(u_FragColor, color1, u_ColorWeight0);
    gl_FragColor = color0;
}
`
