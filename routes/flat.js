const express = require('express');
const store = require('store');
const database = require('../database');

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    let flat;

    try {
        flat = await database.getUnique(`SELECT * FROM flat WHERE flatID='${id}'`);
    } catch (err) {
        res.render('flat/profile', { currentUser: store.get('user'), flat: null });
        return;
    }

    res.render('flat/profile', { currentUser: store.get('user'), flat });
});

module.exports = app;
