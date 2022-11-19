const mariadb = require('mariadb')

const connection = mariadb.createPool({
    host: 'localhost',
    user: 'user1',
    password: 'password1',
    database: 'abaash',
})

async function exec(command) {
    console.log(command)

    await connection.query(command)
}

async function get(command) {
    console.log(command)

    const queryResult = await connection.query(command)
    const recordList = []

    queryResult.forEach((record) => {
        recordList.push(record)
    })

    return recordList
}

async function getUnique(command) {
    console.log(command)
    
    const queryResult = await connection.query(command)

    if (queryResult.length > 1) throw new Error('Not Unique')
    if (queryResult.length === 0) throw new Error('Not Found')

    return queryResult[0]
}

module.exports = Object.freeze({ exec, get, getUnique })
