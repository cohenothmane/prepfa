import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // À remplacer plus tard par ton vrai système d’auth
  const isAuthenticated = false;

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Brand / Logo */}
        <Link
          to="/map"
          className="navbar__brand"
          onClick={() => setIsOpen(false)}
        >
          <span className="navbar__logo-dot" />
          MapSpot
        </Link>

        {/* Toggle mobile */}
        <button
          className="navbar__toggle"
          aria-label="Basculer la navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Navigation */}
        <nav className={`navbar__links ${isOpen ? "is-open" : ""}`}>
          <Link to="/map" onClick={() => setIsOpen(false)}>
            Carte
          </Link>

          <Link to="/favorites" onClick={() => setIsOpen(false)}>
            Favoris
          </Link>

          <Link to="/trending" onClick={() => setIsOpen(false)}>
            Tendances
          </Link>

          {isAuthenticated ? (
            <Link to="/profile" onClick={() => setIsOpen(false)}>
              Mon compte
            </Link>
          ) : (
            <button
              className="navbar__cta"
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Se connecter
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
