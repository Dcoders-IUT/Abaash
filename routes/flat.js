const express = require('express');
const store = require('store');
const database = require('../database');

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    let flat;
    let ownername;

    try {
        flat = await database.getUnique(`SELECT * FROM flat WHERE flatID='${id}'`);
        ownername = await database.getUnique(
            `SELECT name FROM owner WHERE username='${flat.owner}'`
        );
    } catch (err) {
        res.render('flat/profile', { currentUser: store.get('user'), flat: null });
        return;
    }

    res.render('flat/profile', { currentUser: store.get('user'), flat, ownername: ownername.name });
});

module.exports = app;
