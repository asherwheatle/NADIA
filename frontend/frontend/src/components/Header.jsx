import { useEffect } from "react";

export default function Header({ darkMode, setDarkMode }) {
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <header className="header">
      <h1 className="logo">Breathe</h1>

      <button
        className="btn btn-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
}