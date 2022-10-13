const mariadb = require('mariadb');

// const database = {};

// async
const exec = (command) => {
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

const newplc = () => {
    const temp = new Date();
    const str = `${temp.getUTCFullYear()}-${temp.getUTCMonth()}-${temp.getUTCDate()}T${temp.getUTCHours()}:${temp.getUTCMinutes()}:${temp.getUTCSeconds()}.${temp.getUTCMilliseconds()}`;

    return str;
};

module.exports = { exec, newplc };
