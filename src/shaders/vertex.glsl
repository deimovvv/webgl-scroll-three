uniform float time;
varying float pulse;

varying vec2 vUv;
varying vec3 vNormal;
float PI = 3.1415;


void main() {
    vUv = (uv - vec2(0.5))*0.9 + vec2(0.5);
    vNormal = normal;
   
   vec3 pos = position;
    pos.y += sin(PI*uv.x)*0.01;
    pos.z += sin(PI*uv.x)*0.03;


   
   pos.y += sin(time*0.3)*0.02;
   vUv.y -= sin(time*0.3)*0.02;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0 );
}