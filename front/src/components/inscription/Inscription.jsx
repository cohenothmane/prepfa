import React from 'react'
import './Inscription.css'
const Inscription = () => {
  return (
    <div>

    <h1>Inscription</h1>

    <form>
        <input type="text" placeholder="Nom" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Mot de passe" />
        <button type="submit">Inscription</button>
    </form>
    </div>
  )
}

export default Inscription
