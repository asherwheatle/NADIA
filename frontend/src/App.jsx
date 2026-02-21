import { useState } from "react";
import Header from "./components/Header";
import Record from "./pages/Record";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="app-container">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Record />
    </div>
  );
}