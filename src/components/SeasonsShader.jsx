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
      <planeGeometry args={[2, 2, 1, 1]} />
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

  // Project to fullscreen clip space
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;
const fragment = /* glsl */ `
precision highp float;

uniform float uSeason;
uniform float uTime;
varying vec2 vUv;

// ----------------- BASIC NOISE -----------------
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

// Fractal Brownian Motion
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;

  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
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
    float sat = 0.45;
    vec3 white = vec3(1.0);
    color = mix(color, white, 0.25);

    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, sat);

    color = pow(color, vec3(0.95));
    return clamp(color, 0.0, 1.0);
}

// ----------------- Seasonal Palettes -----------------
vec3 seasonalColor(float t) {
    vec3 winter = vec3(0.62, 0.74, 1.00);
    vec3 spring = vec3(0.78, 0.95, 0.72);
    vec3 summer = vec3(1.00, 0.90, 0.55);
    vec3 autumn = vec3(1.00, 0.70, 0.55);

    float segment = t * 4.0;
    float phase = fract(segment);
    int idx = int(floor(segment));

    if (idx == 0)      return mix(winter, spring, phase);
    else if (idx == 1) return mix(spring, summer, phase);
    else if (idx == 2) return mix(summer, autumn, phase);
    else               return mix(autumn, winter, phase);
}


// ----------------- CLOUD SHADOWS -----------------
// ----------------- BIG OBVIOUS CLOUD SHADOW -----------------
float cloudShadow(vec2 uv, float time) {
    // Move across screen left → right
    vec2 p = uv;
    p.x += time * 0.05;

    // Make shadow HUGE
    p *= 0.5;

    // Soft circular shadow
    float d = length(p - vec2(0.8, 0.5)); // center offset so it moves across
    float shadow = smoothstep(0.6, 0.3, d); // inner = dark, outer = soft

    return shadow;
}


// ----------------- MAIN -----------------
void main() {
  vec2 uv = vUv;
  float s = uSeason / 365.0;

  vec3 base = seasonalColor(s);

  float n = noise(uv * 3.0 + uTime * 0.2);
  float seasonStrength = 0.12;
  vec3 color = base + seasonStrength * (n - 0.5);

  // ---- CLOUD SHADOWS ----
  float cs = cloudShadow(uv, uTime);

  // Darken color where clouds pass overhead
  // Increase 0.25 for stronger shadows
  color *= mix(1.0, 0.75, cs);

  // Grain
  float g = grain(uv, uTime);
  color += (g - 0.5) * 0.06;

  color = pastelize(color);

  gl_FragColor = vec4(color, 1.0);
}
`;
