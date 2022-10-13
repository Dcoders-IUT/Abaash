const express = require('express');
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

app.post('/register', (req, res) => {
    const temp = req.body;

    const { name } = temp;
    const { username } = temp;
    const plc = util.plc();
    const pass = util.hash(`${temp.pass + plc}Home Is Where The Start Is!`);
    const phone = Number(temp.phone);
    const { email } = temp;
    const nid = Number(temp.nid);

    // database.exec(
    //     `INSERT INTO owner VALUES ('${name}',
    //     '${username}',
    //     '${pass}',
    //     '${plc}',
    //     ${phone},
    //     '${email}',
    //     ${nid})`
    // );

    res.redirect(307, '../');
});

app.post('/login', (req, res) => {
    // const user = req.body.username;
    // const pass = req.body.password;

    // database.exec(`INSERT INTO comb VALUES (${user}, ${pass})`);

    res.redirect(307, '../');
});

module.exports = app;
