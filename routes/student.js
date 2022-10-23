const express = require('express');
const store = require('store');
const database = require('../util/database');
const hash = require('../util/hash');

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('./login');
});

app.route('/login')
    .post(async (req, res) => {
        let { id } = req.body;
        let pass = req.body.password;

        try {
            const record = await database.getUnique(
                `SELECT studentID, password, passwordLastChanged FROM student WHERE studentID='${id}' OR email='${id}' OR phone='${id}'`
            );
            id = record.studentID;

            const plc = record.passwordLastChanged;
            pass = hash.hash(`${pass + plc}Home Is Where The Start Is!`);
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
        const gender = temp.gender === 'Male' ? 1 : 0;
        const id = Number(temp.studentID);
        const plc = hash.salt();
        const pass = hash.hash(`${temp.pass + plc}Home Is Where The Start Is!`);
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
        null)`,
        );

        store.set('user', id);
        store.set('mode', req.body.mode);

        res.redirect('../');
    })
    .get((req, res) => res.redirect('./login'));

app.get('/profile', (req, res) => {
    const currentUser = store.get('user');
    res.redirect(`profile/${currentUser}`);
});

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    let profileUserData;
    let flat;

    try {
        profileUserData = await database.getUnique(
            `SELECT name, gender, bloodgroup, flatID FROM student WHERE studentID='${id}'`,
        );
    } catch (err) {
        res.render('student/profile', { currentUser: store.get('user'), profileUser: null });
        return;
    }

    try {
        flat = await database.getUnique(
            `SELECT flatID, name FROM flat WHERE flatID=${profileUserData.flatID}`,
        );
    } catch (err) {
        flat = null;
    }

    res.render('student/profile', {
        currentUser: store.get('user'),
        profileUser: id,
        name: profileUserData.name,
        gender: profileUserData.gender,
        bloodgroup: profileUserData.bloodgroup,
        flat,
    });
});

module.exports = app;
