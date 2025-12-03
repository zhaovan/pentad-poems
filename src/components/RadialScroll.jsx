import { useEffect, useRef, useState } from "react";
import poem from "../Poem";
import {
  useScroll,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import SeasonsShader from "./SeasonsShader";
import SeasonsCanvas from "./SeasonsCanvas";

export default function Radial() {
  const { scrollY } = useScroll();
  const [currentDate, setCurrentDate] = useState("");
  const [season, setSeason] = useState(0);

  const poemWithDates = poem.map((line, i) => {
    const start = new Date(2025, 1, 4); // Feb 4, 2024 (month is 0-indexed)
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    return {
      line,
      date: date.toISOString().split("T")[0], // "2024-02-04"
    };
  });

  const activeIndex = useMotionValue(0);

  useMotionValueEvent(activeIndex, "change", (index) => {
    const { line, date } =
      poemWithDates[Math.floor(index) % poemWithDates.length];
    setCurrentDate({ line, date });
  });

  // Update active index on scroll
  const ANGLE_ROTATION = 20;
  const angleStep = (360 / poem.length) * ANGLE_ROTATION;
  const degreesPerItem = angleStep; // i * angleStep is how you're placing items

  useMotionValueEvent(scrollY, "change", (latest) => {
    // This is your wheel rotation in degrees
    const rotationDeg = latest / 20;

    // Convert rotation → index
    const index = Math.round(
      (((rotationDeg / degreesPerItem) % poem.length) + poem.length) %
        poem.length
    );

    activeIndex.set(index);
    setSeason(index);
  });

  const radius = 600;

  const VISIBLE_RANGE = 4; // how many lines appear around the active index

  const transformedScrollY = useTransform(
    scrollY,
    (value) => (value * -1) / 20
  );

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(currentDate?.date ? new Date(currentDate.date) : new Date());

  const month = formattedDate.split(" ")[0];
  const day = formattedDate.split(" ")[1];

  const containerRef = useRef(null);

  const [dayWidth, setDayWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      console.log(rect);
      setDayWidth(rect.width);
    }
  });

  return (
    <div>
      {/* Need to offset */}
      <SeasonsCanvas season={season - 30} />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: 20,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          pointerEvents: "none", // optional
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Month */}
        <div
          style={{
            fontSize: "4rem",
            fontFamily: "serif",
            mixBlendMode: "screen",
            lineHeight: 1,
            color: "green",
            position: "relative",
            top: "40px",
          }}
        >
          {month}
        </div>

        {/* Day */}
        <div
          className="clarendon"
          ref={containerRef}
          style={{
            fontSize: "20rem",
            letterSpacing: "-0.05em",
            color: "red",
            opacity: 0.7,
            lineHeight: 0.65,
            mixBlendMode: "screen",
            width: "400px",
            textAlign: "center",
          }}
        >
          {day}
        </div>
      </div>

      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: "50%",
          rotate: transformedScrollY, // whole wheel rotates with scroll
        }}
      >
        {poem.map((text, i) => {
          const angle = i * angleStep;
          const opacity = useTransform(activeIndex, (current) => {
            const raw = Math.abs(current - i);
            const wrapped = poem.length - raw;
            const diff = Math.min(raw, wrapped); // 👈 circular distance!

            return diff <= VISIBLE_RANGE ? 1 : 0;
          });

          return (
            <motion.div
              key={i}
              style={{
                "--index": i,
                opacity,
                position: "fixed",
                top: "50%",
                color: "black",
                transform: `
                  rotate(${angle}deg)
                  translate(${radius}px)
                  
                `,
                transformOrigin: "top left",
                width: "max-content",
              }}
              className="text-xs uppercase tracking-wide whitespace-nowrap"
            >
              {text} {i}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
