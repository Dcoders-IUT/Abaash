const express = require('express')
const store = require('store')
const multer = require('multer')
const path = require('path')
const database = require('../util/database')
const hash = require('../util/hash')
const misc = require('../util/misc')

const app = express.Router()
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/owner/img')
    },
    filename(req, file, cb) {
        cb(null, store.get('user') + Date.now() + path.extname(file.originalname))
    },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function getUser(id, pass) {
    const wrongpass = 'WRONG PASSWORD!'

    try {
        const record = await database.getUnique(
            `SELECT username, password, passwordLastChanged FROM owner WHERE username='${id}' OR email='${id}' OR phone='${id}'`
        )
        const { username } = record

        const plc = record.passwordLastChanged
        const password = hash.create(`${pass + plc}Home Is Where The Start Is!`)
        if (password !== record.password) throw new Error(wrongpass)

        return username
    } catch (err) {
        if (err.message === wrongpass) throw err
        throw new Error('USER NOT FOUND!')
    }
}

app.get('/', (req, res) => {
    res.redirect('./login')
})

app.route('/login')
    .post(async (req, res) => {
        let { id } = req.body
        const pass = req.body.password

        try {
            id = await getUser(id, pass)
            store.set('user', id)
            store.set('mode', req.body.mode)
        } catch (err) {
            res.send(err.message)
            return
        }

        res.redirect('../profile')
    })
    .get((req, res) => res.redirect('./login.html'))

app.route('/register')
    .post(async (req, res) => {
        const temp = req.body

        const { name } = temp
        const { username } = temp
        const plc = hash.salt()
        const pass = hash.create(`${temp.pass + plc}Home Is Where The Start Is!`)
        const phone = Number(temp.phone)
        const { email } = temp
        const nid = Number(temp.nid)

        await database.exec(
            `INSERT INTO owner VALUES ('${name}',
        '${username}',
        '${pass}',
        '${plc}',
        ${phone},
        '${email}',
        ${nid},
        null)`,
        )
        store.set('user', username)
        store.set('mode', req.body.mode)

        res.redirect('../profile')
    })
    .get((req, res) => res.redirect('./login'))

app.get('/profile', (req, res) => {
    const currentUser = store.get('user')
    res.redirect(`profile/${currentUser}`)
})

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params
    let profileUserData

    try {
        profileUserData = await database.getUnique(`SELECT * FROM owner WHERE username='${id}'`)
    } catch (err) {
        res.render('owner/profile', { currentUser: store.get('user'), profileUser: null })
        return
    }
    const flatList = await database.get(`SELECT * FROM flat WHERE owner='${id}'`)

    res.render('owner/profile', {
        misc,
        currentUser: store.get('user'),
        profileUser: id,
        name: profileUserData.name,
        username: profileUserData.username,
        photo: profileUserData.photo,
        flatList,
    })
})

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    const currentUser = store.get('user')
    const mode = store.get('mode')
    let profileUserData

    if (mode !== 'owner') {
        res.redirect('../../')
        return
    }

    try {
        profileUserData = await database.getUnique(`SELECT * FROM owner WHERE username='${id}'`)
    } catch (err) {
        res.redirect('../../')
        return
    }

    if (currentUser !== profileUserData.username) {
        res.redirect('../../')
        return
    }

    res.render('owner/edit', { currentUser, profileUserData })
})

app.post('/edit/:id', upload.single('photo'), async (req, res) => {
    const temp = req.body
    const currentUser = store.get('user')
    const mode = store.get('mode')

    if (mode !== 'owner') {
        res.redirect('../../')
        return
    }

    const { name } = temp
    const { username } = temp
    const { profileID } = temp
    const phone = Number(temp.phone)
    const { email } = temp
    const nid = Number(temp.nid)
    const { pass } = temp
    
    const photo = req.file? `'${req.file.filename}'`: 'NULL'

    if (currentUser !== profileID) {
        res.redirect('../../')
        return
    }

    try {
        await getUser(currentUser, pass)
    } catch (err) {
        res.redirect('../../')
        return
    }

    await database.exec(
        `UPDATE owner
        SET name='${name}', username='${username}', phone=${phone}, email='${email}', nid=${nid}, photo=${photo}
        WHERE username='${currentUser}'`,
    )

    res.redirect('../profile')
})

app.get('/requests', async (req, res) => {
    const currentUser = store.get('user')
    const detailedRequestList = []

    try {
        const flatRequestList = await database.get(
            `SELECT * FROM flatrequest WHERE (SELECT owner FROM flat WHERE flatrequest.flatid=flat.flatid)='${currentUser}'`,
        )

        for (let i = 0; i < flatRequestList.length; i++) {
            const studentDetails = await database.getUnique(
                `SELECT * FROM student WHERE studentID='${flatRequestList[i].studentID}'`,
            )

            const flatDetails = await database.getUnique(
                `SELECT * FROM flat WHERE flatID='${flatRequestList[i].flatID}'`,
            )

            detailedRequestList.push({
                student: studentDetails,
                flat: flatDetails,
                date: flatRequestList[i].date,
            })
        }

        res.render('owner/requests', { currentUser, flatRequestList: detailedRequestList })
    } catch (err) {
        res.redirect('../../')
    }
})

module.exports = app
