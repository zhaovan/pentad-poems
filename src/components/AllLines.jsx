import { useEffect, useRef } from "react";
import poem from "../Poem";
import { motion, useScroll } from "motion/react";

// Attach dates to poems
const poemWithDates = poem.map((line, i) => {
  const start = new Date(2025, 1, 4);
  const date = new Date(start);
  date.setDate(start.getDate() + i);

  return {
    ...line,
    date: date.toISOString().split("T")[0],
  };
});

export default function AllLines() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Pre-compute triple content
  const content = [...poemWithDates, ...poemWithDates, ...poemWithDates];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Start in the middle block
    const blockHeight = container.scrollHeight / 3;
    container.scrollTop = blockHeight;

    const unsub = scrollYProgress.on("change", () => {
      const { scrollTop, scrollHeight } = container;
      const blockHeight = scrollHeight / 3;

      // If user scrolls above the middle block → wrap down
      if (scrollTop < blockHeight * 0.5) {
        container.scrollTop = scrollTop + blockHeight;
      }

      // If user scrolls past the middle block → wrap up
      if (scrollTop > blockHeight * 1.5) {
        container.scrollTop = scrollTop - blockHeight;
      }
    });

    return () => unsub();
  }, []);

  return (
    <motion.div
      ref={scrollRef}
      style={{
        height: "100vh",
        width: "100vw",
        overflowY: "scroll",
        position: "fixed",
        padding: "2rem",
        backgroundColor: "var(--background-primary)",
      }}
    >
      {content.map((line, index) => {
        const [_, month, day] = line.date.split("-");
        return (
          <div
            key={index + "ch" + line.chinese + "month"}
            className="sans"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{`${month}/${day}`}</span>
            <p style={{ fontSize: "1.25rem" }}>{line.english}</p>
            <p className="chinese" style={{ fontSize: "1rem" }}>
              {line.chinese}
            </p>
          </div>
        );
      })}
    </motion.div>
  );
}
