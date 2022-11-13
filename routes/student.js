const express = require('express');
const store = require('store');
const database = require('../util/database');
const hash = require('../util/hash');
const misc = require('../util/misc');
const multer = require('multer');
const path = require('path');

const app = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/student/img');
    },
    filename: function (req, file, cb) {
        cb(null, store.get('user') + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

async function getUser(id, pass) {
    const wrongpass = 'WRONG PASSWORD!';

    try {
        const record = await database.getUnique(
            `SELECT studentID, password, passwordLastChanged FROM student WHERE studentID='${id}' OR email='${id}' OR phone='${id}'`
        );
        const { studentID } = record;

        const plc = record.passwordLastChanged;
        const password = hash.create(`${pass + plc}Home Is Where The Start Is!`);
        if (password !== record.password) throw new Error(wrongpass);

        return studentID;
    } catch (err) {
        if (err.message === wrongpass) throw err;
        throw new Error('USER NOT FOUND!');
    }
}

app.get('/', (req, res) => {
    res.redirect('./login');
});

app.route('/login')
    .post(async (req, res) => {
        let { id } = req.body;
        const pass = req.body.password;

        try {
            id = await getUser(id, pass);
            store.set('user', id);
            store.set('mode', req.body.mode);
        } catch (err) {
            res.send(err.message);
            return;
        }

        res.redirect('../');
    })
    .get((req, res) => res.redirect('./login.html'));

app.route('/register')
    .post(async (req, res) => {
        const temp = req.body;

        const { name } = temp;
        const gender = Number(temp.gender);
        const id = Number(temp.studentID);
        const plc = hash.salt();
        const pass = hash.create(`${temp.pass + plc}Home Is Where The Start Is!`);
        const phone = Number(temp.phone);
        const { email } = temp;
        const nid = Number(temp.nid);
        const { blg } = temp;

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
            `SELECT * FROM student WHERE studentID=${id}`
        );
    } catch (err) {
        console.log(err);
        res.render('student/profile', { currentUser: store.get('user'), profileUser: null });
        return;
    }

    try {
        flat = await database.getUnique(
            `SELECT flatID, name FROM flat WHERE flatID=${profileUserData.flatID}`
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
        photo: profileUserData.photo,
        flat,
    });
});

app.route('/edit/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        const currentUser = store.get('user');
        const mode = store.get('mode');
        let profileUserData;

        if (mode !== 'student') {
            res.redirect('../../');
            return;
        }

        try {
            profileUserData = await database.getUnique(
                `SELECT * FROM student WHERE studentID='${id}'`
            );
        } catch (err) {
            res.redirect('../../');
            return;
        }

        if (currentUser !== profileUserData.studentID) {
            res.redirect('../../');
            return;
        }

        res.render('student/edit', { misc, currentUser, profileUserData });
    })
    .post(upload.single('photo'), async (req, res) => {
        const temp = req.body;
        const currentUser = store.get('user');
        const mode = store.get('mode');

        if (mode !== 'student') {
            res.redirect('../../');
            return;
        }

        const profileID = Number(temp.profileID);
        const { name } = temp;
        const { studentID } = temp;
        const phone = Number(temp.phone);
        const { email } = temp;
        const nid = Number(temp.nid);
        const gender = Number(temp.gender);
        const { blg } = temp;
        const { pass } = temp;
        const photo = temp.photo? req.file.filename: null;

        if (currentUser !== profileID) {
            res.redirect('../../');
            return;
        }

        try {
            await getUser(currentUser, pass);
        } catch (err) {
            res.redirect('../../');
            return;
        }

        await database.exec(
            `UPDATE student
            SET name='${name}', studentID=${studentID}, phone=${phone}, email='${email}', nid=${nid}, gender=${gender}, bloodgroup='${blg}', photo=${photo}
            WHERE studentID=${currentUser}`
        );

        res.redirect('../profile');
    });

module.exports = app;
