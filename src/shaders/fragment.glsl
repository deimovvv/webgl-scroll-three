uniform float time;
uniform sampler2D uTexture;
uniform float distanceFromCenter;

varying float pulse;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    // gl_FragColor = vec4(0.,0.,1., 1.);

    vec4 myimage = texture(
        uTexture,
        vUv + 0.01*sin(vUv*20. + time) 
    )*distanceFromCenter;
    float bw = (myimage.r + myimage.g + myimage.b)/3.;
    vec4 another = vec4(bw,bw,bw,1.);

    gl_FragColor = vec4( vUv,0.,1.);
    gl_FragColor = myimage;
    gl_FragColor.a = clamp(distanceFromCenter, .1, 1.);

    


    
}