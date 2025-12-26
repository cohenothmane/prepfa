import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Inscription.css'

const Inscription = () => {
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide'
    if (!formData.password) newErrors.password = 'Le mot de passe est requis'
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 caractères'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length) return setErrors(newErrors)

    setIsLoading(true)
    try {
      console.debug('Inscription submit', formData)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: formData.nom, email: formData.email, password: formData.password })
      })
      console.debug('Register response status:', response.status)
      let respBody = null
      try { respBody = await response.json(); console.debug('Register response body:', respBody) } catch (err) { /* no json */ }

      if (response.ok) {
        setSuccess(true)
        setFormData({ nom: '', email: '', password: '', confirmPassword: '' })
        setErrors({})
        setTimeout(() => navigate('/'), 1000)
      } else {
        const message = (respBody && (respBody.message || respBody.error)) || 'Inscription échouée'
        console.warn('Register failed:', message)
        setErrors({ submit: message })
      }
    } catch (error) {
      console.error('Register fetch error:', error)
      setErrors({ submit: 'Une erreur réseau est survenue. Vérifiez le serveur.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="inscription-container">
      <div className="inscription-card modern">
        <div className="inscription-left">
          <div className="decor">
            <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <rect width="84" height="84" rx="20" fill="url(#g1)" />
            </svg>
          </div>
          <h2>Bienvenue sur PrepFA</h2>
          <p className="muted">Créez votre compte pour découvrir des lieux et partager avec la communauté.</p>
          <ul className="features">
            <li>⚡ Sessions et cartes interactives</li>
            <li>🔒 Compte sécurisé</li>
            <li>📍 Partagez des spots facilement</li>
          </ul>
        </div>

        <div className="inscription-right">
          <div className="form-header">
            <h1>Créer un compte</h1>
            <p className="muted">Rejoignez-nous en quelques clics</p>
          </div>

          {success && <div className="success-message">✓ Inscription réussie! Vérifiez votre email.</div>}
          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <form onSubmit={handleSubmit} className="inscription-form">
            <div className="row">
              <div className="form-group half">
                <label htmlFor="nom">Nom</label>
                <input id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Jean Dupont" className={errors.nom ? 'input-error' : ''} disabled={isLoading} />
                {errors.nom && <span className="error-text">{errors.nom}</span>}
              </div>

              <div className="form-group half">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="vous@email.com" className={errors.email ? 'input-error' : ''} disabled={isLoading} />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 caractères" className={errors.password ? 'input-error' : ''} disabled={isLoading} />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmez le mot de passe" className={errors.confirmPassword ? 'input-error' : ''} disabled={isLoading} />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="submit-button gradient" disabled={isLoading}>{isLoading ? 'Inscription en cours...' : "S'inscrire"}</button>

            <div className="small-note">En vous inscrivant, vous acceptez nos <a href="#">Conditions</a>.</div>
          </form>

          <div className="inscription-footer">
            <p>Vous avez déjà un compte? <Link to="/login">Connectez-vous</Link></p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Inscription
