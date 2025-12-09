import { useState } from "react";
import Calendar from "./Calendar";
import { AnimatePresence, motion } from "motion/react";

export default function Landing() {
  const [landingOpened, setLandingOpened] = useState(false);

  return (
    <div style={{ backgroundColor: "var(--background-primary)" }}>
      <div
        style={{
          backgroundColor: "var(--background-primary)",
          position: "fixed",
          inset: "-50%",
          opacity: 0.2,
          pointerEvents: "none",
          zIndex: 50,
          height: "200vh",
          width: "200vw",
          willChange: "transform",
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/commons/5/5c/Image_gaussian_noise_example.png?20070903131606')",

          animation: "grainMove 0.5s steps(10) infinite",
        }}
      />

      <AnimatePresence mode="wait">
        {landingOpened ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Calendar />
          </motion.div>
        ) : (
          <motion.div
            key="landing-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              justifyContent: "center",
              height: "100vh",
              color: "#4eac15",

              padding: "0 1rem",
            }}
          >
            <span
              className="text-fit landing"
              style={{
                lineHeight: 1,
                fontWeight: 600,
              }}
            >
              <span>
                <span>THE INFINITE</span>
              </span>
              <span aria-hidden="true">THE INFINITE</span>
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#e71717",
                alignItems: "center",
              }}
            >
              <p
                className="chinese"
                style={{
                  fontSize: "240px",
                  writingMode: "vertical-rl",
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                无限
              </p>

              <button
                className="sans"
                style={{
                  background: "inherit",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "2rem",
                }}
                onClick={() => setLandingOpened(true)}
              >
                Enter
              </button>

              <p
                className="chinese "
                style={{
                  fontSize: "240px",
                  writingMode: "vertical-rl",
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                黄历
              </p>
            </div>

            <span
              className="text-fit landing"
              style={{ lineHeight: 1, fontWeight: 600 }}
            >
              <span>
                <span>ALMANAC</span>
              </span>
              <span aria-hidden="true">ALMANAC</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
