const crypto = require('crypto')

const salt = () => {
    const temp = new Date()
    const str = `${temp.getUTCFullYear()}-${temp.getUTCMonth()}-${temp.getUTCDate()}T${temp.getUTCHours()}:${temp.getUTCMinutes()}:${temp.getUTCSeconds()}.${temp.getUTCMilliseconds()}`

    return str
}

const hash = (str) => crypto.createHash('sha256').update(str).digest('hex')

module.exports = { hash, salt }
