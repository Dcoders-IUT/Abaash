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

app.route('/login')
    .post(async (req, res) => {
        let { id } = req.body;
        let pass = req.body.password;

        try {
            const record = await database.getUnique(
                `SELECT username, password, plc FROM owner WHERE username='${id}' OR email='${id}' OR phone='${id}'`
            );
            id = record.username;

            const { plc } = record;
            pass = util.hash(`${pass + plc}Home Is Where The Start Is!`);
            if (pass === record.password) {
                store.set('user', id);
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
    })
    .get((req, res) => res.redirect('./login.html'));

app.route('/register')
    .post(async (req, res) => {
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
    })
    .get((req, res) => res.redirect('./login'));

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    let profileUserData;

    try {
        profileUserData = await database.getUnique(`SELECT name FROM owner WHERE username='${id}'`);
    } catch (err) {
        res.render('owner/profile', { currentUser: store.get('user'), profileUser: null });
        return;
    }
    const flatList = await database.get(`SELECT flatID, name FROM flat WHERE owner='${id}'`);

    res.render('owner/profile', {
        currentUser: store.get('user'),
        profileUser: id,
        name: profileUserData.name,
        flatList,
    });
});

module.exports = app;
