import { useEffect } from "react";
import logoImg from "../assets/NADIA.png";

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
        <div className="logo-row">
          <img src={logoImg} alt="NADIA Logo" className="logo-img" />
          <h1 className="logo">NADIA</h1>
        </div>

        <h3 className="tagline">Your AI-Powered Audio Doctor</h3>
      </header>
    </>
  );
}