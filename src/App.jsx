import "./App.css";

function App() {
  const date = new Date();
  let formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
  return (
    <>
      <p>{formattedDate}</p>
      立春 — Start of Spring (Feb 4 – 17)
    </>
  );
}

export default App;
