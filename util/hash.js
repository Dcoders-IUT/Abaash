const crypto = require('crypto')

const salt = () => {
    const temp = new Date()
    const str = `${temp.getUTCFullYear()}-${temp.getUTCMonth()+1}-${temp.getUTCDate()}T${temp.getUTCHours()}:${temp.getUTCMinutes()}:${temp.getUTCSeconds()}.${temp.getUTCMilliseconds()}`

    return str
}

const create = (str) => crypto.createHash('sha256').update(str).digest('hex')

module.exports = { create, salt }
