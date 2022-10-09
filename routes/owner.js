const express = require('express');

const app = express.Router();

app.get('/', (req, res) => {
    res.render('/../views/owner/login');
    // res.send('Student Login');
});

app.get('/login', (req, res) => {
    res.render('/../views/owner/login');
    // res.send('Student Login');
});

module.exports = app;
