import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function TreeShadowOverlayShader() {
  const mesh = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(() => {
    uniforms.uTime.value += 0.01;
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0.01]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  );
}

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;

uniform float uTime;
varying vec2 vUv;

// ----- Noise -----
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i+vec2(1,0));
    float c = hash(i+vec2(0,1));
    float d = hash(i+vec2(1,1));
    vec2 u = f*f*(3.-2.*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
}

float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++){
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

// ----- Tree shadows -----
float treeShadow(vec2 uv, float time) {
    vec2 p = uv * 3.0;

    // Wind sway
    float sx = sin(time * 0.4) * 0.05;
    float sy = cos(time * 0.3) * 0.03;
    p += vec2(sx, sy);

    // Leaf clusters
    float leaf = fbm(p);

    // Branch influence (stretched)
    vec2 bp = p;
    bp.x *= 0.4;
    float branch = fbm(bp + time * 0.15);

    float combined = leaf * 0.7 + branch * 0.3;

    // soft shadow mask
    return smoothstep(0.55, 0.35, combined);
}

void main() {
    float mask = treeShadow(vUv, uTime);

    // only darken, never colorize
    // 1.0 = no shadow, 0.7 = modest shadow
    float shadowFactor = mix(1.0, 0.7, mask);

    gl_FragColor = vec4(vec3(shadowFactor), 1.0);
}

`;
