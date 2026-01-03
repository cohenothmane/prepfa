import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ open = true, onToggle = () => {}, onSearch = () => {}, onAddSpot = () => {}, onFilterChange = () => {} }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [radius, setRadius] = useState(5);
  const [radiusEnabled, setRadiusEnabled] = useState(true);
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

        <div className="sidebar-filters">
          <label className="filter-row">
            <span className="filter-label">Catégorie</span>
            <select
              value={category}
              onChange={(e) => {
                const val = e.target.value;
                setCategory(val);
                onFilterChange({ category: val, radius });
              }}
              className="filter-select"
              aria-label="Filtrer par catégorie"
            >
              <optgroup label="🍔 Alimentation & boissons">
                <option value="Restaurants">🍽️ Restaurants</option>
                <option value="Bar">🍺 Bars</option>
                <option value="Cafes">☕ Cafés</option>
                <option value="VenteAEmporter">🥡 Vente à emporter</option>
                <option value="Livraison">🚚 Livraison</option>
              </optgroup>

              <optgroup label="📍 A faire / A voir">
                <option value="Parc">🌳 Parcs</option>
                <option value="SalleDeSport">🏋️ Salle de sport</option>
                <option value="Art">🎨 Art</option>
                <option value="Attractions">🎡 Attractions</option>
                <option value="VieNocturne">🌙 Vie nocturne</option>
                <option value="Concerts">🎵 Concerts</option>
                <option value="Cinemas">🎬 Cinémas</option>
                <option value="Musees">🏛️ Musées</option>
                <option value="Bibliotheques">📚 Bibliothèques</option>
              </optgroup>

              <optgroup label="🛍️ Shopping">
                <option value="Supermarche">🛒 Supermarché</option>
                <option value="Beaute">💅 Beauté</option>
                <option value="ConcessAuto">🚗 Concess. auto</option>
                <option value="MaisonJardin">🏡 Maison et jardin</option>
                <option value="Vetements">👕 Vêtements</option>
                <option value="CentresCommerciaux">🏬 Centres commerciaux</option>
                <option value="Electronique">🔌 Électronique</option>
                <option value="ArticlesSport">🏀 Articles de sport</option>
              </optgroup>

              <optgroup label="🔧 Services">
                <option value="Hotels">🏨 Hôtels</option>
                <option value="DAB">🏧 DAB</option>
                <option value="SalonsBeaute">✂️ Salons de beauté</option>
                <option value="LocationVoiture">🚙 Location voiture</option>
                <option value="LavageAuto">🧽 Lavage auto</option>
                <option value="Pressing">🧺 Pressing</option>
                <option value="BornesRecharge">🔌 Bornes de recharge</option>
                <option value="Carburant">⛽ Carburant</option>
                <option value="Hopitaux">🏥 Hôpitaux et cliniques</option>
                <option value="BibliothequesService">📚 Bibliothèques</option>
                <option value="EnvoiCourrier">📮 Envoi de courrier</option>
                <option value="Parking">🅿️ Parking</option>
                <option value="Pharmacies">💊 Pharmacies</option>
              </optgroup>
            </select>
          </label>

          <label className="filter-row">
            <span className="filter-label">Rayon</span>
            <div className="radius-controls">
              <label className="radius-toggle">
                <input
                  type="checkbox"
                  checked={radiusEnabled}
                  onChange={(e) => {
                    const enabled = Boolean(e.target.checked);
                    setRadiusEnabled(enabled);
                    onFilterChange({ category, radius, radiusEnabled: enabled });
                  }}
                  aria-label="Activer le rayon"
                />
                <span>{radiusEnabled ? "Activé" : "Désactivé"}</span>
              </label>

              <input
                type="range"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => {
                  const r = Number(e.target.value);
                  setRadius(r);
                  onFilterChange({ category, radius: r, radiusEnabled });
                }}
                className="range-input"
                aria-label="Rayon de recherche en kilomètres"
                disabled={!radiusEnabled}
              />

              <span className="radius-value">{radius} km</span>
            </div>
          </label>
        </div>

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
