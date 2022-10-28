const express = require('express');
const store = require('store');
const crypto = require('crypto');
const database = require('../util/database');
const misc = require('../util/misc');

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
    const currentUser = store.get('user');
    const mode = store.get('mode');
    let flat;
    let owner;

    try {
        flat = await database.getUnique(`SELECT * FROM flat WHERE flatID='${id}'`);
        owner = await database.getUnique(`SELECT name FROM owner WHERE username='${flat.owner}'`);
    } catch (err) {
        res.render('flat/profile', { currentUser: store.get('user'), flat: null });
        return;
    }

    if (mode === 'student') {
        try {
            const student = await database.getUnique(
                `SELECT * FROM student WHERE studentID=${currentUser}`,
            );

            res.render('flat/profile', {
                currentUser,
                mode,
                flat,
                owner,
                student,
            });
        } catch (err) {
            res.render('flat/profile', {
                currentUser,
                mode,
                flat,
                owner,
            });
        }

        return;
    }

    res.render('flat/profile', {
        currentUser,
        mode,
        flat,
        owner,
    });
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

        res.render('flat/register', { misc, currentUser, owner });
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
        const gender = Number(temp.gender);
        const level = Number(temp.level);
        const x = Number(temp.x);
        const y = Number(temp.y);
        const lift = temp.lift === 'on';
        const generator = temp.generator === 'on';

        await database.exec(
            `INSERT INTO flat VALUES (${flatID}, '${name}', '${address}', ${gender}, ${x}, ${y}, ${level}, '${owner}', ${lift}, ${generator})`
        );

        res.redirect(`profile/${flatID}`);
    });

app.route('/edit/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        const currentUser = store.get('user');
        const mode = store.get('mode');
        let flat;
        let owner;

        if (mode !== 'owner') {
            res.redirect('../../');
            return;
        }

        try {
            flat = await database.getUnique(`SELECT * FROM flat WHERE flatID='${id}'`);
            owner = await database.getUnique(
                `SELECT name FROM owner WHERE username='${flat.owner}'`
            );
        } catch (err) {
            res.redirect('../../');
            return;
        }

        res.render('flat/edit', {
            misc,
            currentUser,
            flat,
            owner,
        });
    })
    .post(async (req, res) => {
        const temp = req.body;

        const { flatID } = temp;
        const { name } = temp;
        const { address } = temp;
        const gender = Number(temp.gender);
        const level = Number(temp.level);
        const x = Number(temp.x);
        const y = Number(temp.y);
        const lift = temp.lift === 'on';
        const generator = temp.generator === 'on';

        await database.exec(
            `UPDATE flat
            SET name='${name}', address='${address}', gender=${gender}, x=${x}, y=${y}, level=${level}, lift=${lift}, generator=${generator}
            WHERE flatID=${flatID}`,
        );

        res.redirect(`../profile/${flatID}`);
    });

module.exports = app;