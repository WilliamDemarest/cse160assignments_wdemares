const frag = `
precision mediump float;
varying vec2 v_UV;
varying vec3 v_Normal;
varying vec4 v_VertPos;
uniform vec4 u_FragColor;
uniform vec3 u_dayShade;
uniform vec3 u_lightPos;
uniform vec3 u_cameraPosition;
uniform float u_enableLight;
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
    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r = length(lightVector);
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    vec3 R = reflect(-L, N);
    vec3 E = normalize(u_cameraPosition-vec3(v_VertPos));
    
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

    if (u_enableLight > 1.1) {
        vec3 light_color = vec3(
            u_dayShade[0]*nDotL,
            u_dayShade[1]*nDotL,
            u_dayShade[2]*nDotL);

        vec3 diffuse_color = vec3(
            color0[0]*light_color[0],
            color0[1]*light_color[1],
            color0[2]*light_color[2]);

        vec3 ambient_color = vec3(
            color0[0]*0.3,
            color0[1]*0.3,
            color0[2]*0.3);

        float specular = pow(max(dot(E,R), 0.0), 10.0);

        vec3 specular_color = vec3(
            specular*light_color[0],
            specular*light_color[1],
            specular*light_color[2]);
        gl_FragColor = vec4(specular + ambient_color + diffuse_color, color0[3]);
    } else if (u_enableLight > 0.1) {
        gl_FragColor = vec4(v_Normal, 1.0);
    } else {
        gl_FragColor = color0;
    }

}
`
