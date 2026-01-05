import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Notifier les autres composants du changement d'auth
        window.dispatchEvent(new Event('authChange'));
        navigate('/home');
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Impossible de se connecter. Vérifiez que le serveur est actif.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login">
      <div className="login__wrapper">
        <div className="login__intro">
          <p className="eyebrow">prepfa</p>
          <h1>Reprenez le contrôle de vos révisions.</h1>
          <p className="muted">
            Un espace sécurisé, des sessions guidées et un suivi précis pour
            rester focus sur vos objectifs.
          </p>
          <div className="badges">
            <span>⚡ Sessions intelligentes</span>
            <span>🔒 Données chiffrées</span>
            <span>📈 Statistiques en temps réel</span>
          </div>
        </div>

        <div className="login__card">
          <div className="login__card-header">
            <h2>Connexion</h2>
            <p className="muted">Heureux de vous revoir.</p>
          </div>

          <form className="login__form">
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <label>
              Email
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@example.com" 
              />
            </label>

            <label>
              Mot de passe
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
              />
            </label>

            <div className="login__row">
              <label className="checkbox">
                <input type="checkbox" /> <span>Se souvenir de moi</span>
              </label>
              <a className="link" href="#forgot">
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit" onClick={handleLogin} disabled={isLoading} className="btn-primary">
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            <div className="login__divider">
              <span>ou</span>
            </div>

            <div className="login__social">
              <button type="button">Google</button>
              <button type="button">Microsoft</button>
            </div>
          </form>

          <p className="login__footer">
            Nouveau sur prepfa ?{" "}
            <Link className="link" to="/inscription">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
