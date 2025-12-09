// Linear interpolation between two numbers
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Interpolate two hex colors
function lerpColor(hex1, hex2, t) {
  const c1 = {
    r: parseInt(hex1.slice(1, 3), 16),
    g: parseInt(hex1.slice(3, 5), 16),
    b: parseInt(hex1.slice(5, 7), 16),
  };
  const c2 = {
    r: parseInt(hex2.slice(1, 3), 16),
    g: parseInt(hex2.slice(3, 5), 16),
    b: parseInt(hex2.slice(5, 7), 16),
  };

  const r = Math.round(lerp(c1.r, c2.r, t)).toString(16).padStart(2, "0");
  const g = Math.round(lerp(c1.g, c2.g, t)).toString(16).padStart(2, "0");
  const b = Math.round(lerp(c1.b, c2.b, t)).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}

function getSeasonBlendedColors(dayOfYear) {
  const palettes = {
    autumn: { one: "#c2a442", two: "#6b4226", three: "#403020" },
    winter: { one: "#dfe6e9", two: "#636e72", three: "#2d3436" },
    spring: { one: "#55efc4", two: "#00b894", three: "#0984e3" },
    summer: { one: "#ffeaa7", two: "#fdcb6e", three: "#bb7462ff" },
  };

  // Define rough season breakpoints (in days)
  const seasonOrder = ["spring", "summer", "autumn", "winter"];
  const seasonLength = 365 / 4; // ~91.25 days per season

  // Determine which season we're in

  dayOfYear = dayOfYear % 365;
  if (dayOfYear < 0) dayOfYear += 365;
  const index = Math.floor(dayOfYear / seasonLength);
  const nextIndex = (index + 1) % 4;

  const currentSeason = seasonOrder[index];
  const nextSeason = seasonOrder[nextIndex];

  // Position between seasons (0 → 1)
  const seasonStart = index * seasonLength;
  const t = (dayOfYear - seasonStart) / seasonLength;

  // Blend each color key
  return {
    one: lerpColor(palettes[currentSeason].one, palettes[nextSeason].one, t),
    two: lerpColor(palettes[currentSeason].two, palettes[nextSeason].two, t),
    three: lerpColor(
      palettes[currentSeason].three,
      palettes[nextSeason].three,
      t
    ),
  };
}

export default function SeasonsBackground({ day }) {
  const blended = getSeasonBlendedColors(day);

  return (
    <div
      className="seasons-background"
      style={{
        "--color-1": `${blended.one}`,
        "--color-2": `${blended.two}`,
        "--color-3": `${blended.three}`,
      }}
    ></div>
  );
}
