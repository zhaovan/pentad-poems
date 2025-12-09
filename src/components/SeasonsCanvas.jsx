// SeasonsCanvas.jsx
import { Canvas } from "@react-three/fiber";
import SeasonsShader from "./SeasonsShader";
import CloudOverlayShader from "./CloudOverlayShader";
import TreeShadowOverlayShader from "./TreeShadowOverlayShader";

export default function SeasonsCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 50 }}
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
        mixBlendMode: "multiply",
      }}
    >
      <TreeShadowOverlayShader />
    </Canvas>
  );
}
