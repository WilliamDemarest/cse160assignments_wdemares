const frag = `
precision mediump float;
varying vec2 v_UV;
uniform vec4 u_FragColor;
uniform vec3 u_dayShade;
uniform sampler2D u_Sampler0;
uniform float u_ColorWeight0;
uniform sampler2D u_Sampler1;
uniform float u_ColorWeight1;
uniform sampler2D u_Sampler2;
uniform float u_ColorWeight2;
uniform sampler2D u_Sampler3;
uniform float u_ColorWeight3;
uniform sampler2D u_Sampler4;
uniform float u_ColorWeight4;
void main() {
    
    //gl_FragColor = u_FragColor;
    //gl_FragColor = mix(vec4(v_UV, 1.0, 1.0), u_FragColor, 0.5);
    vec4 sky = texture2D(u_Sampler1, v_UV);
    vec4 armor = texture2D(u_Sampler0, v_UV);
    vec4 grass2 = texture2D(u_Sampler2, v_UV);
    vec4 grass = texture2D(u_Sampler3, v_UV);
    vec4 night = texture2D(u_Sampler4, v_UV);

    vec4 color4 = mix(grass2, grass, u_ColorWeight4);
    vec4 color3 = mix(night, color4, u_ColorWeight3);
    vec4 color2 = mix(sky, color3, u_ColorWeight2);
    vec4 color1 = mix(armor, color2, u_ColorWeight1);
    vec4 color0 = mix(u_FragColor, color1, u_ColorWeight0);
    vec4 shaded_color = vec4(
        color0[0]*u_dayShade[0],
        color0[1]*u_dayShade[1],
        color0[2]*u_dayShade[2],
        color0[3]);
    gl_FragColor = shaded_color;
}
`
