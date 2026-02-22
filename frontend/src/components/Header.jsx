import { useEffect } from "react";

export default function Header({ darkMode, setDarkMode }) {
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <>
      <button
        className="btn btn-toggle interactive fade-in"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <header className="header fade-in">
        <h1 className="logo">NADIA</h1>
        <h3 className="tagline">Your AI-Powered Audio Doctor</h3>
      </header>
    </>
  );
}