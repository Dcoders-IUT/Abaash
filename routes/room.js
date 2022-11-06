const express = require('express');
const store = require('store');
const crypto = require('crypto');
const database = require('../util/database');
const misc = require('../util/misc');
const hash = require('../util/hash');

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function newRoomID(type) {
    const base = type * 10000000;
    const divisor = 10000000;
    let offset;
    let row;

    while (true) {
        offset = crypto.randomInt(divisor);
        row = await database.getUnique(
            `SELECT COUNT(*) AS count FROM room WHERE roomID=${base + offset}`
        );
        if (row.count < 1) break;
    }

    return base + offset;
}

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const currentUser = store.get('user');
    const mode = store.get('mode');
    let room;
    let flat;
    let ownerRecord;
    let owner;

    try {
        room = await database.getUnique(`SELECT * FROM room WHERE roomID='${id}'`);
        flat = await database.get(`SELECT flatID, name FROM flat WHERE roomID=${id}`);
        ownerRecord = await database.getUnique(
            `SELECT * FROM owner WHERE username='${flat.owner}'`
        );
        owner = ownerRecord.username;
    } catch (err) {
        console.log(err);
        res.render('room/profile', {
            currentUser: store.get('user'),
            room: null,
            flat: null,
            owner: null,
        });
        return;
    }

    if (mode === 'student') {
        try {
            const student = await database.getUnique(s
                `SELECT * FROM student WHERE studentID=${currentUser}`
            );

            res.render('room/profile', {
                currentUser,
                mode,
                room,
                flat,
                owner,
                student,
            });
        } catch (err) {
            res.render('room/profile', {
                currentUser,
                mode,
                room,
                flat,
                owner,
            });
        }

        return;
    }

    res.render('room/profile', {
        currentUser,
        mode,
        room,
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
                `SELECT username, name FROM owner WHERE username='${currentUser}'`
            );
        } catch (err) {
            res.redirect('../');
            return;
        }

        res.render('room/register', { misc, currentUser, owner });
    })
    .post(async (req, res) => {
        const temp = req.body;
        let roomID;

        try {
            roomID = await newroomID();
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
            `INSERT INTO room VALUES (${roomID}, '${name}', '${address}', ${gender}, ${x}, ${y}, ${level}, '${owner}', ${lift}, ${generator})`,
        );

        res.redirect(`profile/${roomID}`);
    });

app.route('/edit/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        const currentUser = store.get('user');
        const mode = store.get('mode');
        let room;
        let owner;

        if (mode !== 'owner') {
            res.redirect('../../');
            return;
        }

        try {
            room = await database.getUnique(`SELECT * FROM room WHERE roomID='${id}'`);
            owner = await database.getUnique(
                `SELECT name FROM owner WHERE username='${room.owner}'`,
            );
        } catch (err) {
            res.redirect('../../');
            return;
        }

        res.render('room/edit', {
            misc,
            currentUser,
            room,
            owner,
        });
    })
    .post(async (req, res) => {
        const temp = req.body;

        const { roomID } = temp;
        const { name } = temp;
        const { address } = temp;
        const gender = Number(temp.gender);
        const level = Number(temp.level);
        const x = Number(temp.x);
        const y = Number(temp.y);
        const lift = temp.lift === 'on';
        const generator = temp.generator === 'on';

        await database.exec(
            `UPDATE room
            SET name='${name}', address='${address}', gender=${gender}, x=${x}, y=${y}, level=${level}, lift=${lift}, generator=${generator}
            WHERE roomID=${roomID}`
        );

        res.redirect(`../profile/${roomID}`);
    });

module.exports = app;
