import { useEffect, useLayoutEffect, useRef, useState } from "react";
import poem from "../Poem";
import {
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  motion,
} from "motion/react";
import SeasonsCanvas from "./SeasonsCanvas";
import SeasonsBackground from "./SeasonsBackground";
import { TOTAL_SCROLL_HEIGHT } from "../constants";

// Update active index on scroll
const ANGLE_ROTATION = 20;
const ANGLE_STEP = (360 / poem.length) * ANGLE_ROTATION;
const DEGREES_PER_ITEM = ANGLE_STEP; // i * ANGLE_STEP is how you're placing items

const PHEASANT_NO_CRY = [306, 345];
const CICADA_CRY = [141, 271];
const MOCKINGBIRD_CRY = [126, 133];

const RIVER_SOUND = [1, 242];
const THUNDER_ACTIVE = [50, 232];

const monthsInChinese = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

const poemWithDates = poem.map((line, i) => {
  const start = new Date(2025, 1, 4); // Feb 4, 2024 (month is 0-indexed)
  const date = new Date(start);
  date.setDate(start.getDate() + i);

  return {
    ...line,
    date: date.toISOString().split("T")[0], // "2024-02-04"
  };
});

export default function Radial() {
  let RADIUS = 600;

  let VISIBLE_RANGE = 4; // how many lines appear around the active index
  const { scrollY, scrollYProgress } = useScroll();
  const [currentDate, setCurrentDate] = useState("");
  const [season, setSeason] = useState(0);

  const riverAudio = useRef(null);

  const cicadaAudio = useRef(null);
  const mockingbirdAudio = useRef(null);
  const pheasantAudio = useRef(null);
  const thunderAudio = useRef(null);

  // Audio state is set for side effects only; not used in render

  const activeIndex = useMotionValue(0);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
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
  }, [scrollYProgress]);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const todaysDate = new Date();
    const startingDate = new Date(2025, 1, 3); // Feb 4, 2025
    const msPerDay = 1000 * 60 * 60 * 24;
    // Calculate days since reference, wrap in 0-364
    const dayDiff = Math.floor((todaysDate - startingDate) / msPerDay);
    const dayOfCycle = ((dayDiff % 365) + 365) % 365; // always positive
    const scrollPosition = TOTAL_SCROLL_HEIGHT * (dayOfCycle / 365);

    // Wait two frames so DOM fully settles
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollPosition, behavior: "instant" });

        // allow one more frame for scroll position to stabilize
        requestAnimationFrame(() => {
          setReady(true);
        });
      });
    });
  }, []);

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(currentDate?.date ? new Date(currentDate.date) : new Date());

  const month = formattedDate.split(" ")[0];
  const monthIndex = new Date(
    currentDate?.date ? new Date(currentDate.date) : new Date(),
  ).getMonth();
  const monthInChinese = monthsInChinese[monthIndex];
  const day = formattedDate.split(" ")[1];

  useEffect(() => {
    // Initialize all audio objects
    riverAudio.current = new Audio("/river.ogg");
    riverAudio.current.loop = true;
    riverAudio.current.volume = 0.05;

    cicadaAudio.current = new Audio("/cicadas.mp3");
    cicadaAudio.current.volume = 0.1;
    cicadaAudio.current.loop = true;

    mockingbirdAudio.current = new Audio("/mockingbird.mp3");
    mockingbirdAudio.current.volume = 0.1;
    mockingbirdAudio.current.loop = true;

    pheasantAudio.current = new Audio("/pheasant.mp3");
    pheasantAudio.current.volume = 0.5;
    pheasantAudio.current.loop = true;

    thunderAudio.current = new Audio("/thunder.mp3");
    thunderAudio.current.volume = 0.05;
    thunderAudio.current.loop = true;

    // ---- CLEANUP WHEN COMPONENT UNMOUNTS ----
    return () => {
      const audios = [
        riverAudio,
        cicadaAudio,
        mockingbirdAudio,
        pheasantAudio,
        thunderAudio,
      ];

      for (const ref of audios) {
        if (ref.current) {
          // Stop audio immediately
          ref.current.pause();

          // Reset playback to beginning so it’s never stuck partially played
          ref.current.currentTime = 0;

          // Drop the reference so GC can clean it
          ref.current = null;
        }
      }
    };
  }, []);

  useMotionValueEvent(activeIndex, "change", (index) => {
    const { line, date } =
      poemWithDates[Math.floor(index) % poemWithDates.length];
    setCurrentDate({ line, date });

    if (riverAudio.current) {
      if (RIVER_SOUND[0] <= index && index <= RIVER_SOUND[1]) {
        riverAudio.current.play();
      } else {
        riverAudio.current.pause();
      }
    }

    if (thunderAudio.current) {
      if (THUNDER_ACTIVE[0] <= index && index <= THUNDER_ACTIVE[1]) {
        thunderAudio.current.play();
      } else {
        thunderAudio.current.pause();
      }
    }

    if (
      cicadaAudio.current &&
      mockingbirdAudio.current &&
      pheasantAudio.current
    ) {
      if (CICADA_CRY[0] <= index && index <= CICADA_CRY[1]) {
        cicadaAudio.current.play();
      } else {
        cicadaAudio.current.pause();
      }

      if (MOCKINGBIRD_CRY[0] <= index && index <= MOCKINGBIRD_CRY[1]) {
        mockingbirdAudio.current.play();
      } else {
        mockingbirdAudio.current.pause();
      }

      if (PHEASANT_NO_CRY[0] > index || index > PHEASANT_NO_CRY[1]) {
        if (pheasantAudio.current.paused) {
          pheasantAudio.current.play();
        }
      } else {
        pheasantAudio.current.pause();
      }
    }
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    // This is your wheel rotation in degrees
    const rotationDeg = latest / 20;

    // Convert rotation → index
    const index = Math.round(
      (((rotationDeg / DEGREES_PER_ITEM) % poem.length) + poem.length) %
        poem.length,
    );

    activeIndex.set(index);
    setSeason(index);
  });

  const transformedScrollY = useTransform(
    scrollY,
    (value) => (value * -1) / 20,
  );

  if (!ready) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "black", // or your page background
          zIndex: 9999999999,
        }}
      />
    );
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  if (width < 1200) {
    RADIUS = lerp(10, 200, width / 1000);
    VISIBLE_RANGE = 0;
  }

  return (
    <div>
      {/* Need to offset */}
      <>
        <SeasonsCanvas season={season + 34} key="canvas" />
        <SeasonsBackground day={activeIndex.get()} />
        {/* 
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            backgroundColor: "black",
            color: "white",
          }}
        >
          DEBUG PANEL
          <br />
          Active Index: {activeIndex.get().toFixed(2)}
          <br />
          Date: {currentDate.date} ({currentDate.line})
          <br />
          cicadas chirping: {isCicadaActive ? "yes" : "no"} <br />
          mockingbirds chirping: {isMockingbirdActive ? "yes" : "no"} <br />
          pheasants crying: {isPheasantActive ? "yes" : "no"} <br />
          riverActive: {isRiverActive ? "yes" : "no"} <br />
          thunderActive: {isThunderActive ? "yes" : "no"} <br />
        </div> */}

        <p
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "4rem",
            fontSize: "2rem",
            color: "var(--text-dark-green",
          }}
          className="chinese"
        >
          民国{`[    ]`}年
        </p>
        <p
          style={{
            position: "fixed",
            bottom: "6rem",
            right: "4rem",
            fontSize: "2rem",
            color: "var(--text-dark-green",
            border: "3px solid var(--text-dark-green",
            borderRadius: "50%",
            padding: "0 1rem",
          }}
          className="chinese"
        >
          {monthInChinese}
        </p>

        <div
          style={{
            position: "fixed",
            top: "50%",
            left: width > 600 ? 20 : "50%",
            zIndex: 30,
            transform:
              width > 600 ? "translateY(-50%)" : "translate(-50%, -50%)",
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
              color: "var(--text-green)",
              position: "relative",
            }}
          >
            {month}
          </div>

          {/* Day */}
          <div
            className="clarendon"
            style={{
              fontSize: "20rem",
              letterSpacing: "-0.05em",
              color: "var(--text-red)",
              opacity: 0.7,
              lineHeight: 0.65,
              top: "-40px",
              position: "relative",
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
            display: width < 600 ? "none" : "block",
            zIndex: 30,
            top: "50%",
            rotate: transformedScrollY, // whole wheel rotates with scroll
          }}
        >
          {poem.map((line, i) => {
            const current = activeIndex.get();
            const raw = Math.abs(current - i);
            const wrapped = poem.length - raw;
            const diff = Math.min(raw, wrapped); // 👈 circular distance!

            const opacity =
              diff === 0
                ? 1
                : diff <= VISIBLE_RANGE
                  ? (1 / (diff + 1)) ** 2
                  : 0;

            return (
              <motion.p
                key={i}
                style={{
                  "--index": i,
                  opacity: opacity,
                  position: "fixed",
                  top: width < 600 ? "75%" : "50%",
                  fontSize: "1.5rem",
                  color: "var(--text-dark-green)",
                  transition: "opacity 0.3s ease-out",
                  transform: `
                  rotate(${i * ANGLE_STEP}deg)
                  translate(${RADIUS}px)
              
                `,
                  transformOrigin: "top left",
                  width: "max-content",
                }}
                className="sans"
              >
                {line.english}
              </motion.p>
            );
          })}
        </motion.div>

        {poem.map((line, i) => {
          const isActive = Math.floor(activeIndex.get()) % 364 === i;

          return (
            <motion.p
              key={"duplicate" + " " + i + "ch"}
              style={{
                "--index": i,
                opacity: isActive ? 1 : 0,
                position: "fixed",
                top: "2rem",
                right: "4rem",
                color: "var(--text-dark-green)",
                writingMode: "vertical-rl",
                fontSize: "2rem",
              }}
              className="chinese"
            >
              {`[`}
              {line.chinese}
              {`]`}
            </motion.p>
          );
        })}
      </>

      {/* Mobile display */}
      {poem.map((line, i) => {
        const current = activeIndex.get();
        const raw = Math.abs(current - i);
        const wrapped = poem.length - raw;
        const diff = Math.min(raw, wrapped); // 👈 circular distance!

        const opacity = diff <= VISIBLE_RANGE ? 1 : 0;

        return (
          <motion.p
            key={i}
            style={{
              "--index": i,
              opacity,
              position: "fixed",
              display: width >= 600 ? "none" : "block",
              top: "65%",
              left: "50%",
              transition: "opacity 0.1s ease-out",
              transform: `translateX(-50%)`,
              width: "50vw",
              fontSize: "1.5rem",
              color: "var(--text-dark-green",
              transformOrigin: "top left",
              textAlign: "center",
            }}
            className="sans"
          >
            {line.english}
          </motion.p>
        );
      })}
    </div>
  );
}
