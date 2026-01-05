import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Recherche from '../recherche/recherche';
import Map from '../map/Map';
import './SearchPage.css';

const SearchPage = ({ isMarkingMode = false }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [allSpots, setAllSpots] = useState([]);

  const handleResultsChange = (results) => {
    setFilteredSpots(results);
  };

  // Charger tous les spots depuis l'API au démarrage
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/spots');
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setAllSpots(data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des spots:', err);
      }
    };

    fetchSpots();
  }, []);

  // Écouter quand un nouveau spot est créé
  useEffect(() => {
    const handleSpotCreated = async (e) => {
      // Recharger les spots après en avoir créé un
      try {
        const response = await fetch('http://localhost:4000/api/spots');
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setAllSpots(data);
        }
      } catch (err) {
        console.error('Erreur lors du rechargement des spots:', err);
      }
    };

    window.addEventListener('spotCreated', handleSpotCreated);
    return () => window.removeEventListener('spotCreated', handleSpotCreated);
  }, []);

  return (
    <div className="search-page">
      <div className="search-page-container">
        <aside className="search-sidebar">
          <Recherche query={query} onResultsChange={handleResultsChange} />
        </aside>
        <div className="search-map">
          <Map filteredSpots={filteredSpots} isMarkingMode={isMarkingMode} allSpots={allSpots} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
