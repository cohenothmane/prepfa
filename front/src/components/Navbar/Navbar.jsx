import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Accueil", href: "/home" },
  { label: "Carte", href: "/map" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar__container">
        <a className="navbar__brand" href="/home">
          <span className="navbar__logo-dot" />
          prepfa
        </a>

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

        <nav className={`navbar__links ${isOpen ? "is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              {link.label}
            </a>
          ))}
          <button className="navbar__cta" onClick={() => navigate("/login")}>
            Se connecter
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
