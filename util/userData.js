const store = require('store')
const database = require('./database')

const obj = {}

obj.id = () => store.get('user')? store.get('user') : null
obj.mode = () => store.get('mode')? store.get('mode') : null
obj.missing = () => !obj.mode() || !obj.id()

obj.nameOfUser = async() => {
    if (obj.missing()) return null

    const mode = obj.mode()
    const id = obj.id()
    
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

obj.allInfo = async() => {
    return {id: obj.id(), mode: obj.mode(), name: await obj.nameOfUser()}
}

module.exports = obj
