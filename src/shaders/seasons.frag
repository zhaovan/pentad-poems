precision mediump float;

uniform float u_dayOfYear;

void main() {
    gl_FragColor = vec4(fract(u_dayOfYear / 365.0), 0.0, 0.0, 1.0);
}