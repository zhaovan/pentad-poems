import { useScroll } from "motion/react";
import poem from "../Poem";
import { useMotionValueEvent } from "motion/react";
import { use, useState } from "react";

export default function Circle() {
  const RADIUS = 400;
  const angle = 360 / poem.length;
  const { scrollYProgress } = useScroll();

  const [angleMultiplier, setAngleMultiplier] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAngleMultiplier(v * 360 * 50);

    if (v === 0) {
      window.scrollTo({ top: document.body.scrollHeight });
    } else if (v === 1) {
      window.scrollTo({ top: 0 });
    }
  });

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
      }}
    >
      {poem.map((line, index) => {
        const theta = angle * index;

        return (
          <p
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              whiteSpace: "nowrap",
              color: "#d0d0d0ff",
              fontSize: "0.5rem",
              transformOrigin: "0 0",
              transform: `
                rotate(${
                  theta + angleMultiplier
                }deg)          /* rotate around circle center */
                translate(${RADIUS}px, 0)    /* push outward */
                rotate(${
                  -theta - angleMultiplier
                }deg)         /* undo rotation → upright */
              `,
            }}
          >
            {line.english}
          </p>
        );
      })}
    </div>
  );
}
