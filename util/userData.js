const store = require('store')
const database = require('./database')

const obj = {}

obj.id = (session) => session.user? session.user : null
obj.mode = (session) => session.mode? session.mode : null
obj.missing = (session) => !obj.mode(session) || !obj.id(session)

obj.name = async(session) => {
    if (obj.missing(session)) return null

    const mode = obj.mode(session)
    const id = obj.id(session)
    
    try{
        const record = await database.getUnique(
            mode==='student'?
            `SELECT name FROM student WHERE studentID=${id}` :
            `SELECT name FROM owner WHERE username='${id}'`
            )
        
        return record.name
    } catch(err)
    {
        console.log(err)
        return null
    }
}

obj.gender = async(session) => {
    if (obj.missing(session)) return null

    const mode = obj.mode(session)
    const id = obj.id(session)
    
    try{
        if(mode==='student')
        {
            const record = await database.getUnique(`SELECT gender FROM student WHERE studentID=${id}`)
            return record.gender
        }

        return null
    } catch(err)
    {
        console.log(err)
        return null
    }
}

obj.allInfo = async(session) => {
    return {id: obj.id(session), mode: obj.mode(session), name: await obj.name(session), gender: await obj.gender(session)}
}

module.exports = obj