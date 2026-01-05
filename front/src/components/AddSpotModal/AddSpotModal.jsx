import React, { useState, useEffect } from 'react';
import './AddSpotModal.css';

const AddSpotModal = ({ isOpen, onClose, initialLat = null, initialLng = null, onSpotCreated }) => {
  const [step, setStep] = useState('select'); // 'select' ou 'form'
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    category: 'café',
    location: '',
    lat: initialLat || '',
    lng: initialLng || '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setError('');
      setSuccess(false);
      setFormData({
        nom: '',
        description: '',
        category: 'café',
        location: '',
        lat: initialLat || '',
        lng: initialLng || '',
      });
    }
  }, [isOpen, initialLat, initialLng]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Écouter les clics sur la map quand on est en mode selection
  useEffect(() => {
    if (!isOpen || step !== 'select') return;

    const handleMapClick = (e) => {
      const { lat, lng } = e.detail;
      setFormData(prev => ({
        ...prev,
        lat: lat.toFixed(4),
        lng: lng.toFixed(4),
      }));
      setStep('form');
    };

    window.addEventListener('mapPointSelected', handleMapClick);
    return () => window.removeEventListener('mapPointSelected', handleMapClick);
  }, [isOpen, step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Tu dois être connecté pour ajouter un spot');
        setIsLoading(false);
        return;
      }

      if (!formData.nom || !formData.location || !formData.lat || !formData.lng) {
        setError('Tous les champs sont requis');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nom: formData.nom,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Notifier le parent que le spot a été créé
        if (onSpotCreated) {
          onSpotCreated(data.spot || data);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Erreur lors de la création du spot');
      }
    } catch (err) {
      setError('Impossible de créer le spot. Vérifiez que le serveur est actif.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        {step === 'select' ? (
          <>
            <h2>Ajouter un spot</h2>
            <div className="selection-mode">
              <p className="instruction">👇 Clique sur la map pour sélectionner un point</p>
              <div className="info-box">
                <p>Les coordonnées GPS seront automatiquement remplies</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2>Détails du spot</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">✓ Spot créé avec succès!</div>}

            <form onSubmit={handleSubmit} className="add-spot-form">
              <div className="form-group">
                <label>Nom du spot *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="ex: Café Medina"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre spot..."
                  rows="3"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="café">☕ Café</option>
                  <option value="restaurant">🍽️ Restaurant</option>
                  <option value="pâtisserie">🧁 Pâtisserie</option>
                  <option value="bar">🍸 Bar</option>
                  <option value="pizzeria">🍕 Pizzeria</option>
                  <option value="glacier">🍦 Glacier</option>
                </select>
              </div>

              <div className="form-group">
                <label>Localisation (ville) *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="ex: Fès"
                  disabled={isLoading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitude *</label>
                  <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    placeholder="34.0626"
                    step="0.0001"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Longitude *</label>
                  <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    placeholder="-5.0063"
                    step="0.0001"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="back-button"
                  onClick={() => setStep('select')}
                  disabled={isLoading}
                >
                  ← Retour
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Création en cours...' : 'Ajouter le spot'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddSpotModal;
