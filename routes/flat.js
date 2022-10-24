const express = require('express');
const store = require('store');
const crypto = require('crypto');
const database = require('../util/database');

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function newFlatID() {
    const base = 1000000;
    const divisor = 1000000;
    let offset;
    let row;

    while (true) {
        offset = crypto.randomInt(divisor);
        row = await database.getUnique(
            `SELECT COUNT(*) AS count FROM flat WHERE flatID=${base + offset}`,
        );
        if (row.count < 1) break;
    }

    return base + offset;
}

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

    res.render('flat/profile', { currentUser: store.get('user'), flat, owner: ownername });
});

app.route('/register')
    .get(async (req, res) => {
        const currentUser = store.get('user');
        const mode = store.get('mode');
        let owner;

        if (mode !== 'owner') {
            res.redirect('../');
            return;
        }

        try {
            owner = await database.getUnique(
                `SELECT username, name FROM owner WHERE username='${currentUser}'`,
            );
        } catch (err) {
            res.redirect('../');
            return;
        }

        res.render('flat/register', { owner });
    })
    .post(async (req, res) => {
        const temp = req.body;
        let flatID;

        try {
            flatID = await newFlatID();
        } catch (err) {
            res.redirect('../');
            return;
        }

        const { name } = temp;
        const { address } = temp;
        const { owner } = temp;
        const gender = temp.gender === 'Male' ? 1 : 0;
        const level = Number(temp.level);
        const x = Number(temp.x);
        const y = Number(temp.y);
        const lift = temp.lift === 'on' ? 1 : 0;
        const generator = temp.lift === 'on' ? 1 : 0;

        await database.exec(
            `INSERT INTO flat VALUES (${flatID}, '${name}', '${address}', ${gender}, ${x}, ${y}, ${level}, '${owner}', ${lift}, ${generator})`
        );

        res.redirect(`profile/${flatID}`);
    });

module.exports = app;
