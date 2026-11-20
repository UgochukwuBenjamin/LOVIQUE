import { Link } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        LOVIQUE
        <Heart size={17} fill="currentColor" />
      </Link>

      {/* Desktop links */}
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

        <a href="#about" className="nav-link">
          About
        </a>

        <a href="#discover" className="nav-link">
          Discover
        </a>
      </div>

      {/* Desktop buttons */}
      <div className="navbar-actions">
        <Link to="/login" className="navbar-login">
          Login
        </Link>

        <Link to="/signup" className="navbar-signup">
          Sign Up
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>

          <a href="#discover" onClick={() => setMenuOpen(false)}>
            Discover
          </a>

          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>

          <Link to="/signup" onClick={() => setMenuOpen(false)}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;