const express = require('express');
const bodyParser = require('body-parser');
const database = require('../database');

const app = express.Router();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('./login.html');
});

app.get('/login', (req, res) => {
    res.redirect('./login.html');
});

app.post('/register', (req) => {
    console.log(req.body);
});

app.post('/login.html', (req) => {
    const user = req.body.studentID;
    const pass = req.body.password;

    console.log(user);
    console.log(pass);

    database.exec(`INSERT INTO comb VALUES (${user}, ${pass})`);
});

module.exports = app;
