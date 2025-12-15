import React from "react";
import "./Login.css";

const Login = () => {
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
            <label>
              Email
              <input type="email" name="email" placeholder="vous@example.com" />
            </label>

            <label>
              Mot de passe
              <input type="password" name="password" placeholder="••••••••" />
            </label>

            <div className="login__row">
              <label className="checkbox">
                <input type="checkbox" /> <span>Se souvenir de moi</span>
              </label>
              <a className="link" href="#forgot">
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit" className="btn-primary">
              Se connecter
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
            <a className="link" href="#signup">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
