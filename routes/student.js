const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');

const app = express.Router();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'butterFree12',
    database: 'abaash',
});

app.get('/', (req, res) => {
    res.redirect('./login.html');
});

app.get('/login', (req, res) => {
    res.redirect('./login.html');
});

app.post('/login.html', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

module.exports = app;
