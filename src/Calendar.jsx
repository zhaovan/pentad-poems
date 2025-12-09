import { useState } from "react";
import "./Calendar.css";
import RadialScroll from "./components/RadialScroll.jsx";
import { AnimatePresence, motion } from "motion/react";
import AllLines from "./components/AllLines.jsx";
import { TOTAL_SCROLL_HEIGHT } from "./constants.js";
import { CircleIcon, NotebookIcon, SunIcon } from "@phosphor-icons/react";
import Circle from "./components/Circle.jsx";

function Calendar() {
  // radial or all-lines or cicle
  const [mode, setMode] = useState("radial");

  function switchModes() {
    if (mode === "radial") {
      setMode("all-lines");
    } else if (mode === "all-lines") {
      setMode("circle");
    } else {
      setMode("radial");
    }
  }

  function renderIcon() {
    if (mode === "radial") {
      return <NotebookIcon />;
    } else if (mode === "all-lines") {
      return <CircleIcon />;
    } else {
      return <SunIcon />;
    }
  }

  return (
    <div>
      <AnimatePresence>
        <button
          onClick={() => switchModes()}
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            backgroundColor: "var(--background-primary)",
            zIndex: 100,
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "0.25rem",
          }}
        >
          {renderIcon()}
        </button>
        <AnimatePresence>
          {}
          {mode === "all-lines" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AllLines />
            </motion.div>
          )}
          {mode === "radial" && (
            <motion.div
              style={{ height: `${TOTAL_SCROLL_HEIGHT}px` }}
              key="radial-scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <RadialScroll />
            </motion.div>
          )}

          {mode === "circle" && (
            <motion.div
              key="circle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Circle />
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}

export default Calendar;
