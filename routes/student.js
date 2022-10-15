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
                `SELECT studentID, password, plc FROM student WHERE studentID='${id}' OR email='${id}' OR phone='${id}'`,
            );
            id = record.studentID;

            const { plc } = record;
            pass = util.hash(`${pass + plc}Home Is Where The Start Is!`);
            if (pass === record.password) {
                store.set('user', id);
                store.set('mode', req.body.mode);
            } else {
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
        const gender = temp.gender === 'Male' ? 1 : 0;
        const id = Number(temp.studentID);
        const plc = util.plc();
        const pass = util.hash(`${temp.pass + plc}Home Is Where The Start Is!`);
        const phone = Number(temp.phone);
        const { email } = temp;
        const nid = Number(temp.nid);
        const blg = temp.blg === "I don't know" ? ' ' : temp.blg;

        await database.exec(
            `INSERT INTO student VALUES ('${name}',
        ${gender},
        ${id},
        '${pass}',
        '${plc}',
        ${phone},
        '${email}',
        ${nid},
        '${blg}',
        null)`
        );

        store.set('user', id);
        store.set('mode', req.body.mode);

        res.redirect('../');
    })
    .get((req, res) => res.redirect('./login'));

module.exports = app;
