import { useState } from "react";
import Header from "./components/Header";
import Record from "./pages/Record";
import HistoryPanel from "./components/HistoryPanel";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const addToHistory = (result) => {
    setHistory((prev) => [result, ...prev]);
  };

  return (
    <div className="app-container">
    <Header darkMode={darkMode} setDarkMode={setDarkMode} />

    {/* Toggle button */}
    <button 
      className="history-toggle-btn"
      onClick={() => setHistoryOpen(!historyOpen)}
    >
      History
    </button>

    {/* Floating collapsible panel */}
    <div className={`history-floating ${historyOpen ? "open" : ""}`}>
      <HistoryPanel history={history} setHistory={setHistory} />
    </div>

    <Record onNewResult={addToHistory} history={history} />
    </div>
  );
}