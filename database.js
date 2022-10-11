const mariadb = require('mariadb');

const database = {};

// async
database.exec = function (command) {
    // let db;
    // try {
    //     db = await mariadb.createConnection({
    //         host: 'localhost',
    //         user: 'user1',
    //         password: 'password1',
    //         database: 'abaash',
    //     });

    //     db.query(command);
    // } catch (err) {
    //     console.log(`SQL Connection Error!\n${err}`);
    // } finally {
    //     if (db) db.close();
    // }

    mariadb
        .createConnection({
            host: 'localhost',
            user: 'user1',
            password: 'password1',
            database: 'abaash',
        })
        .then((db) => {
            db.query(command);
        });
};

module.exports = database;
