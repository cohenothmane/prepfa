import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ open = true, onToggle = () => {} }) => {
  if (!open) {
    return (
      <button
        className="sidebar-open-handle"
        aria-label="Ouvrir la barre latérale"
        onClick={() => onToggle(true)}
      >
        ☰
      </button>
    );
  }

  return (
    <aside className={"sidebar"}>
      <button
        className="sidebar-toggle"
        aria-label="Fermer la barre latérale"
        onClick={() => onToggle(false)}
      >
        ⬅
      </button>

      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="icon">🏠</span>
          <span className="label">Accueil</span>
        </NavLink>

        <NavLink to="/inscription" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="icon">✍️</span>
          <span className="label">Inscription</span>
        </NavLink>

        <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="icon">🔒</span>
          <span className="label">Connexion</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <small>© PrepFA</small>
      </div>
    </aside>
  );
};

export default Sidebar;
