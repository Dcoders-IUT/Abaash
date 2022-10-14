const mariadb = require('mariadb');

// const database = {};

const conn = mariadb.createConnection({
    host: 'localhost',
    user: 'user1',
    password: 'password1',
    database: 'abaash',
});

async function exec(command) {
    await conn.then((db) => db.query(command));
}

async function get(command) {
    await conn;
    .then((db) => db.query(command));
}

const get = (command) => {
    conn.then((db) => {
        db.query(command);
    });
};
module.exports = { exec, get };
