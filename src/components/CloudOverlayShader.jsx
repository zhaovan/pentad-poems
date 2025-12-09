import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CloudOverlayShader() {
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

// ——— Simple FBM Noise ———
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
    float v = 0.;
    float a = 0.5;
    for(int i=0;i<5;i++){
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

// ——— Cloud Shadow Layer ———
void main(){
    vec2 uv = vUv;

    // drift + scale
    vec2 p = uv * 2.5;
    p.x += uTime * 0.05;
    p.y += sin(uTime * 0.1) * 0.1;

    // big cloud base
    float cloud = fbm(p);

    // sharpen clouds slightly
    float mask = smoothstep(0.55, 0.35, cloud);

    // darkness multiplier (multiply blending)
    float shadow = mix(1.0, 0.7, mask);

    // semi-transparent, only darkening
    gl_FragColor = vec4(vec3(shadow), 1.0);
}
`;
