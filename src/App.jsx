import { useEffect } from "react";
import "./App.css";
import RadialScroll from "./components/RadialScroll.jsx";
import { motion, useScroll } from "motion/react";
import SeasonsShader from "./components/SeasonsShader.jsx";

function App() {
  const date = new Date();

  const scroll = useScroll();

  useEffect(() => {
    const unsub = scroll.scrollYProgress.on("change", (v) => {
      if (v === 1) {
        const target = 0;
        window.scrollTo({ top: target });
      }
      if (v === 0) {
        const target = document.body.scrollHeight;

        window.scrollTo({ top: target });
      }
    });

    return () => unsub();
  }, []);

  return (
    <motion.div style={{ height: "144948px" }}>
      <RadialScroll />
    </motion.div>
  );
}

export default App;
