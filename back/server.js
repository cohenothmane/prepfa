const express = require('express');
const app = express();
const port = process.env.PORT ||  4000;

app.get('/', (req, res) => {
    res.send('Hello Louay');
});

app.get('/badaoui', (req, res) => {
    res.send('Hello badaoui');
});

app.get('/othman', (req, res) => {
    res.send('Hello othman');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Louay tu es pret a travailler avec mon serveurrrrr ')
});