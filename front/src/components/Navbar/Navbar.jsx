import React, { useState } from "react";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Fonctionnalités", href: "#features" },
  { label: "Tarifs", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__container">
        <a className="navbar__brand" href="#accueil">
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
          <button className="navbar__cta">Se connecter</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
