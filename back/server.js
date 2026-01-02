const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database later)
const users = [];
const spots = [];

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Token requis' });
    }

    // Extract token from 'Bearer <token>' format
    const parts = authHeader.split(' ');
    const token = parts.length === 2 ? parts[1] : authHeader;
    
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ error: 'Token invalide ou manquant' });
    }

    // Find user by token (simple approach)
    const user = users.find(u => u.token === token);
    
    if (!user) {
        console.log('Token validation failed. Token:', token);
        console.log('Available tokens:', users.map(u => u.token));
        return res.status(401).json({ error: 'Token invalide - Veuillez vous reconnecter' });
    }

    req.userId = user.id;
    next();
};

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
    const { nom, email, password } = req.body;

    // Validation
    if (!nom || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit avoir au moins 6 caractères' });
    }

    // Check if user already exists
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Create user (in production, hash password with bcrypt)
    const user = { id: Date.now(), nom, email, password };
    users.push(user);

    res.status(201).json({ 
        message: 'Inscription réussie',
        user: { id: user.id, nom: user.nom, email: user.email }
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Create token and store it on user object
    const token = `auth_${user.id}_${Date.now()}`;
    user.token = token;

    res.json({ 
        message: 'Connexion réussie',
        token,
        user: { id: user.id, nom: user.nom, email: user.email }
    });
});

// Spots endpoints
app.get('/api/spots', verifyToken, (req, res) => {
    const userSpots = spots.filter(s => s.userId === req.userId);
    res.json({ spots: userSpots });
});

app.post('/api/spots', verifyToken, (req, res) => {
    const { name, description, lat, lng } = req.body;

    // Validation
    if (!name || lat === undefined || lng === undefined) {
        return res.status(400).json({ error: 'Nom et coordonnées requis' });
    }

    // Create spot
    const spot = {
        id: Date.now(),
        userId: req.userId,
        name,
        description: description || '',
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        createdAt: new Date()
    };

    spots.push(spot);

    res.status(201).json({ 
        message: 'Spot créé avec succès',
        spot 
    });
});

app.delete('/api/spots/:id', verifyToken, (req, res) => {
    const spotId = parseInt(req.params.id);
    const spotIndex = spots.findIndex(s => s.id === spotId && s.userId === req.userId);

    if (spotIndex === -1) {
        return res.status(404).json({ error: 'Spot non trouvé' });
    }

    spots.splice(spotIndex, 1);
    res.json({ message: 'Spot supprimé' });
});

app.get('/', (req, res) => {
    res.send('API prepfa running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Backend ready for authentication and spots')
});