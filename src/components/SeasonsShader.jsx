import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SeasonsShader({ season }) {
  const mesh = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeason: { value: season },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    }),
    []
  );

  useFrame(() => {
    uniforms.uTime.value += 0.01;
    uniforms.uSeason.value = season; // dynamic update WORKS now
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
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

uniform float uSeason;
uniform float uTime;
varying vec2 vUv;

// ----------------- NOISE -----------------
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f*f*(3.0 - 2.0*f);

  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

// ----------------- GRAIN -----------------
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}



float grain(vec2 uv, float time) {
    return rand(uv * 800.0 + time * 25.0);
}


// ----------------- Pastelize -----------------
vec3 pastelize(vec3 color) {
    // reduce saturation
    float sat = 0.35;   // lower = more pastel

    // push toward white
    vec3 white = vec3(1.0);
    color = mix(color, white, 0.35); // 0.2–0.5 is good pastel range

    // simple saturation control
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, sat);

    // soft brightness lift
    color += 0.05;

    return clamp(color, 0.0, 1.0);
}

// ----------------- MAIN -----------------
void main() {
  vec2 uv = vUv;

  float s = uSeason / 365.0;

  // Seasonal color wheel
  vec3 base = vec3(
    0.5 + 0.5 * sin(6.2831 * s + 0.0),
    0.5 + 0.5 * sin(6.2831 * s + 2.0),
    0.5 + 0.5 * sin(6.2831 * s + 4.0)
  );

  float n = noise(uv * 3.0 + uTime * 0.2);
  float seasonStrength = 0.3 + 0.7 * sin(3.1415 * s);

  vec3 color = base + seasonStrength * (n - 0.5);

  // ----- GRAIN -----
  float g = grain(uv, uTime);
  float grainAmount = 0.08;  // tweak this

  color += (g - 0.5) * grainAmount;

  color = pastelize(color);



  gl_FragColor = vec4(color, 1.0);
}

`;
