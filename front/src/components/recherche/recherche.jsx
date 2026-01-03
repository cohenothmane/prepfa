import React, { useState, useMemo, useEffect } from 'react';
import './recherche.css';
import { allSpots } from '../map/Map';

const Recherche = ({ query = '', onResultsChange = () => {} }) => {

  const [searchInput, setSearchInput] = useState(query || '');

  // Mettre à jour la recherche quand le paramètre query change
  useEffect(() => {
    setSearchInput(query || '');
  }, [query]);

  // Filtrer les résultats en temps réel (pas de champ `name` stocké)
  const filteredResults = useMemo(() => {
    if (!searchInput.trim()) return allSpots;

    const lowerQuery = searchInput.toLowerCase();
    return allSpots.filter(spot =>
      spot.category.toLowerCase().includes(lowerQuery) ||
      spot.location.toLowerCase().includes(lowerQuery)
    );
  }, [searchInput, allSpots]);

  // Notifier le parent des résultats filtrés
  useEffect(() => {
    onResultsChange(filteredResults);
  }, [filteredResults, onResultsChange]);

  const handleResultClick = (spot) => {
    // Déclencher un événement pour que la map se centre sur ce spot
    window.dispatchEvent(new CustomEvent('centerMap', { detail: { lat: spot.lat, lng: spot.lng, spot } }));
  };

  return (
    <div className="recherche-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher (ex: café, restaurant...)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input-box"
        />
      </div>

      <div className="results-section">
        {filteredResults.length > 0 ? (
          <div className="results-list">
            <p className="results-count">
              {filteredResults.length} résultat{filteredResults.length !== 1 ? 's' : ''} trouvé{filteredResults.length !== 1 ? 's' : ''}
            </p>
            {filteredResults.map(spot => (
              <div key={spot.id} className="result-item" onClick={() => handleResultClick(spot)}>
                <h3>{spot.category}</h3>
                <p className="result-category">{spot.category}</p>
                <p className="result-location">📍 {spot.location}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>Aucun résultat ne correspond à "{searchInput}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recherche;
