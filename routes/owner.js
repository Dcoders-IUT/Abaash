const express = require('express');
const store = require('store');
const database = require('../database');
const util = require('../util');

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('./login.html');
});

app.get('/login', (req, res) => {
    res.redirect('./login.html');
});

app.post('/register', async (req, res) => {
    const temp = req.body;

    const { name } = temp;
    const { username } = temp;
    const plc = util.plc();
    const pass = util.hash(`${temp.pass + plc}Home Is Where The Start Is!`);
    const phone = Number(temp.phone);
    const { email } = temp;
    const nid = Number(temp.nid);

    await database.exec(
        `INSERT INTO owner VALUES ('${name}',
        '${username}',
        '${pass}',
        '${plc}',
        ${phone},
        '${email}',
        ${nid})`,
    );

    store.set('user', username);
    store.set('mode', req.body.mode);

    res.redirect('../');
});

app.post('/login', async (req, res) => {
    const user = req.body.username;
    let pass = req.body.password;

    try {
        const record = await database.getUnique(
            `SELECT username, password, plc FROM owner WHERE username='${user}'`
        );

        const { plc } = record;
        pass = util.hash(`${pass + plc}Home Is Where The Start Is!`);
        if (pass === record.password) {
            store.set('user', user);
            store.set('mode', req.body.mode);
        } else {
            res.send('WRONG PASSWORD!');
            return;
        }
    } catch (err) {
        res.send('USER NOT FOUND!');
        return;
    }

    res.redirect('../');
});

module.exports = app;
