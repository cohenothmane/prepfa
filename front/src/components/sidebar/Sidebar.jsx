import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ open = true, onToggle = () => {}, onSearch = () => {}, onAddSpot = () => {} }) => {
  const [query, setQuery] = useState("");
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
        <form
          className="sidebar-search"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) onSearch(query.trim());
          }}
        >
          <input
            type="search"
            placeholder="Rechercher un spot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            aria-label="Recherche de spots"
          />
          <button type="submit" className="search-button" aria-label="Lancer la recherche">
            🔍
          </button>
        </form>

        <div className="sidebar-add-spot">
          <button
            type="button"
            className="add-spot-button"
            onClick={() => onAddSpot()}
            aria-label="Ajouter un spot"
          >
            ➕ Ajouter un spot
          </button>
        </div>

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
