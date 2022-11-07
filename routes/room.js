const express = require('express');
const store = require('store');
const crypto = require('crypto');
const database = require('../util/database');
const misc = require('../util/misc');

const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function newRoomID(type) {
    const base = type * 10000000;
    const divisor = 10000000;
    let offset;
    let row;

    do {
        offset = crypto.randomInt(divisor);
        row = await database.getUnique(
            `SELECT COUNT(*) AS count FROM room WHERE roomID=${base + offset}`,
        );
    } while (row.count > 0);

    return base + offset;
}

async function getRoom(roomID) {
    let record;
    let roomType;
    let roomTable;
    let room;

    try {
        record = await database.getUnique(`SELECT type FROM room WHERE roomID=${roomID}`);
        roomType = record.type;
        roomTable = misc.roomTableName(roomType);

        if (roomTable !== null) {
            room = await database.getUnique(
                `SELECT * FROM room NATURAL JOIN ${roomTable} WHERE roomID=${roomID}`,
            );
        } else {
            room = await database.getUnique(`SELECT * FROM room WHERE roomID=${roomID}`);
        }

        // console.log(room);
    } catch (err) {
        console.log('HERE!');
        console.log(err);
        return null;
    }

    return room;
}

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const currentUser = store.get('user');
    const mode = store.get('mode');
    let room;
    let flat;

    try {
        room = await getRoom(id);

        flat = await database.getUnique(
            `SELECT flatID, name, owner FROM flat WHERE flatID=${room.flatID}`,
        );
    } catch (err) {
        console.log(err);
        res.render('room/profile', {
            // res.send({
            currentUser: store.get('user'),
            room: null,
            flat: null,
            misc,
        });
        return;
    }

    res.render('room/profile', {
        // res.send({
        currentUser,
        mode,
        room,
        flat,
        misc,
    });
});

app.route('/register/:flatID')
    .get(async (req, res) => {
        const { flatID } = req.params;
        const currentUser = store.get('user');
        const mode = store.get('mode');
        let flat;
        let row;
        let roomcount;

        if (mode !== 'owner') {
            console.log('MODE ERROR!');
            res.redirect('../../');
            return;
        }

        try {
            flat = await database.getUnique(`SELECT * FROM flat WHERE flatID=${flatID}`);
            row = await database.getUnique(
                `SELECT COUNT(*) AS count FROM room WHERE flatID=${flatID}`,
            );
        } catch (err) {
            console.log(err);
            res.redirect('../../');
            return;
        }

        if (currentUser !== flat.owner) {
            console.log('USER NOT FOUND');
            res.redirect('../../');
            return;
        }

        res.render('room/register', {
            misc,
            currentUser,
            flat,
            roomcount: Number(row.count),
        });
    })
    .post(async (req, res) => {
        const { flatID } = req.params;
        const temp = req.body;
        let roomID;

        const { name } = temp;
        const type = Number(temp.type);
        const area = Number(temp.area);
        const flooring = Number(temp.flooring);

        try {
            roomID = await newRoomID(type);

            await database.exec(
                `INSERT INTO room VALUES (${roomID}, '${name}', '${type}', ${area}, ${flooring}, ${flatID})`
            );
        } catch (err) {
            console.log(err);
            res.redirect('../../');
            return;
        }

        res.redirect(`../profile/${roomID}`);
    });

app.route('/edit/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        const currentUser = store.get('user');
        const mode = store.get('mode');
        let room;
        let flat;

        if (mode !== 'owner') {
            res.redirect('../../');
            return;
        }

        try {
            room = await database.getUnique(`SELECT * FROM room WHERE roomID='${id}'`);
            flat = await database.getUnique(`SELECT * FROM flat WHERE flatID=${room.flatID}`);
        } catch (err) {
            console.log(err);
            res.redirect('../../');
            return;
        }

        res.render('room/edit', {
            misc,
            currentUser,
            room,
            flat,
        });
    })
    .post(async (req, res) => {
        const roomID = req.params.id;
        const temp = req.body;

        const { name } = temp;
        const area = Number(temp.area);
        const flooring = Number(temp.flooring);

        await database.exec(
            `UPDATE room
        SET name='${name}', area=${area}, flooring=${flooring}
        WHERE roomID=${roomID}`, 
        );

        res.redirect(`../profile/${roomID}`);
    });

module.exports = app;
