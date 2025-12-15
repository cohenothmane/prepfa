# 🌍 MapSpot – Réseau Social Géolocalisé

MapSpot est une plateforme sociale basée sur une carte interactive permettant aux utilisateurs de **découvrir, partager et commenter des lieux intéressants** liés au sport, aux loisirs et aux activités en plein air.

L’objectif est de créer une **communauté collaborative** où chacun peut signaler des spots utiles ou originaux (karting, skateboard, football, vélo, golf, etc.), en les localisant sur une carte, en ajoutant des photos et en partageant son expérience.

---

## 🎯 Objectifs du projet

* Faciliter la **découverte de lieux sportifs ou de loisirs** proches de soi
* Mettre en avant des **zones peu connues** mais intéressantes
* Créer un **réseau social interactif autour d’une carte**
* Permettre aux utilisateurs de **donner leur avis** via commentaires et likes

**Exemple concret (Maroc 🇲🇦)** :

> Trouver des parkings ou terrains improvisés pour jouer au football, les partager avec la communauté et savoir s’ils sont réellement praticables grâce aux avis des autres utilisateurs.

---

## 🗺️ Fonctionnalités principales

### 👤 Utilisateurs

* Inscription / Connexion
* Profil utilisateur (photo, bio, activités préférées)

### 📍 Lieux (Spots)

* Ajout d’un spot sur la carte
* Localisation via Google Maps
* Ajout de photos
* Description du lieu (type de sport, niveau, accessibilité)
* Catégorisation (Football, Vélo, Skate, Karting, Golf, etc.)

### 💬 Interaction sociale

* Commentaires sur les spots
* Likes / avis
* Signalement de lieux obsolètes ou incorrects

### 🗺️ Carte interactive

* Affichage des spots sur une map
* Filtres par type d’activité
* Recherche par zone ou sport

---

## 🛠️ Technologies utilisées

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript (Vanilla)**
* **Google Maps API**

### Backend

* **Node.js**
* **Express.js**

### Base de données

* **MongoDB** (NoSQL)

### Autres outils

* JWT (authentification)
* Multer (upload d’images)
* Cloud Storage (optionnel pour les images)

---

## 📂 Structure du projet (exemple)

```bash
MapSpot/
│── client/
│   ├── index.html
│   ├── styles/
│   └── scripts/
│
│── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── app.js
│
│── .env
│── package.json
│── README.md
```

---

## 🚀 Installation & Lancement

### Prérequis

* Node.js
* MongoDB
* Clé API Google Maps

### Installation

```bash
# Cloner le projet
git clone https://github.com/username/mapspot.git

# Installer les dépendances backend
cd server
npm install

# Lancer le serveur
npm run dev
```

Configurer le fichier `.env` :

```env
PORT=5000
MONGO_URI=your_mongodb_connection
GOOGLE_MAPS_API_KEY=your_api_key
JWT_SECRET=your_secret
```

---

## 🔒 Sécurité & Permissions

* Authentification sécurisée (JWT)
* Accès restreint pour la création/modification de spots
* Validation des données côté backend

---

## 📈 Évolutions possibles

* Application mobile (React Native)
* Système de notation avancé
* Messagerie entre utilisateurs
* Notifications en temps réel
* Mode hors-ligne pour la carte

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Crée une branche (`feature/nouvelle-fonctionnalite`)
3. Commit tes changements
4. Push la branche
5. Ouvre une Pull Request

---

## 📄 Licence

Ce projet est sous licence **MIT**.

---

## ✨ Auteur

Projet développé par **[Ton Nom]**

> Un réseau social pour découvrir le monde… un spot à la fois 🌍⚽🛹🚴
