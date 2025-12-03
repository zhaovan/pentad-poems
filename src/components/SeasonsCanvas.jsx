// SeasonsCanvas.jsx
import { Canvas } from "@react-three/fiber";
import SeasonsShader from "./SeasonsShader";

export default function SeasonsCanvas({ season = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 50 }}
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <SeasonsShader season={season} />
    </Canvas>
  );
}
