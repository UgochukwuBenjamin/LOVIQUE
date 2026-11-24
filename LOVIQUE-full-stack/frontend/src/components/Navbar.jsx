
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        <span className="logo-text">LOVIQUE</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className="active">Home</Link>
        <a href="#about">About</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#features">Features</a>
      </div>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/signup" className="signup-btn">
          Get Started
        </Link>
      </div>

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#testimonials" onClick={closeMenu}>Testimonials</a>
          <a href="#features" onClick={closeMenu}>Features</a>
          <Link to="/login" onClick={closeMenu}>Login</Link>
          <Link to="/signup" onClick={closeMenu}>Get Started</Link>
        </div>
      )}

    </nav>
  );
}

export default Navbar;
