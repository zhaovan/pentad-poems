import { useState } from "react";
import "./Calendar.css";
import RadialScroll from "./components/RadialScroll.jsx";
import { AnimatePresence, motion } from "motion/react";
import AllLines from "./components/AllLines.jsx";
import { TOTAL_SCROLL_HEIGHT } from "./constants.js";
import {
  CircleIcon,
  NotebookIcon,
  QuestionIcon,
  SunIcon,
} from "@phosphor-icons/react";
import Circle from "./components/Circle.jsx";
import IntermediaryScreen from "./IntermediaryScreen.jsx";

function Calendar() {
  // radial or all-lines or cicle
  const [mode, setMode] = useState("radial");
  const [openExplanation, setOpenExplanation] = useState(false);

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
      <div
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 100,
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={() => switchModes()}
          style={{
            backgroundColor: "var(--background-primary)",

            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "0.25rem",
          }}
        >
          {renderIcon()}
        </button>
        <div style={{ position: "relative" }}>
          <motion.div
            layoutId="explanation-panel"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "0.25rem",
              backgroundColor: "var(--background-primary)",
              pointerEvents: "none",
              opacity: 0, // invisible, but still animatable
            }}
          />

          <button
            onClick={() => setOpenExplanation(!openExplanation)}
            style={{
              backgroundColor: "var(--background-primary)",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "0.25rem",
              position: "relative",
              zIndex: 2,
            }}
          >
            <QuestionIcon />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {openExplanation && (
          <motion.div
            layoutId="explanation-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              layout: { duration: 0.4, type: "tween", ease: "easeOut" },
              opacity: { duration: 0.4 },
            }}
            style={{
              position: "fixed",
              top: "25%",
              left: "25%",
              width: "50%",
              height: "50%",
              backgroundColor: "var(--background-primary)",
              zIndex: 200,
              borderRadius: "0.25rem",
              padding: "2rem",
            }}
          >
            <IntermediaryScreen />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
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
            style={{
              height: `${TOTAL_SCROLL_HEIGHT}px`,
              backgroundColor: "#290000ff",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Circle />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Calendar;
