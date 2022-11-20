const express = require('express')
const store = require('store')
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const userData = require('../util/userData')
const database = require('../util/database')
const hash = require('../util/hash')
const misc = require('../util/misc')

const app = express.Router()
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/owner/img')
    },
    filename(req, file, cb) {
        cb(null, userData.id() + Date.now() + path.extname(file.originalname))
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

async function flatRequestList(records)
{
    const reqList = []

    for (let i = 0; i < records.length; i++) {
        const studentRecord = await database.getUnique(
            `SELECT * FROM student WHERE studentID=${records[i].studentID}`,
        )

        const flatRecord = await database.getUnique(
            `SELECT * FROM flat WHERE flatID=${records[i].flatID}`,
        )

        reqList.push({
            student: studentRecord,
            flat: flatRecord,
            date: records[i].date,
            message: records[i].message,
        })
    }

    return reqList;
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
            `INSERT INTO owner(name, username, pass, plc, phone, email, nid) VALUES ('${name}',
        '${username}',
        '${pass}',
        '${plc}',
        ${phone},
        '${email}',
        ${nid}`
        )
        store.set('user', username)
        store.set('mode', req.body.mode)

        res.redirect('../profile')
    })
    .get((req, res) => res.redirect('./login'))

app.get('/profile', (req, res) => {
    const userID = userData.id()
    res.redirect(`profile/${userID}`)
})

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params

    try {
        const profile = await database.getUnique(`SELECT * FROM owner WHERE username='${id}'`)
        const flatList = await database.get(`SELECT * FROM flat WHERE owner='${id}'`)

        res.render('owner/profile', {
            misc,
            user: await userData.allInfo(),
            profile,
            flatList
        })
    } catch (err) {
        res.redirect('/')
        return
    }
})

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    const userID = userData.id()
    const mode = userData.mode()

    if (mode !== 'owner') {
        res.redirect('../../')
        return
    }

    let profile
    try {
        profile = await database.getUnique(`SELECT * FROM owner WHERE username='${id}'`)
    } catch (err) {
        res.redirect('../../')
        return
    }

    if (userID !== profile.username) {
        res.redirect('../../')
        return
    }

    res.render('owner/edit', { misc, user: await userData.allInfo(), profile })
})

app.post('/edit/:id', upload.single('photo'), async (req, res) => {
    const temp = req.body
    const userID = userData.id()
    const mode = userData.mode()

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

    if (userID !== profileID) {
        res.redirect('../../')
        return
    }

    try {
        await getUser(userID, pass)
        
        let oldPhoto = await database.getUnique(`SELECT photo FROM owner WHERE username='${userID}'`)
        oldPhoto = oldPhoto.photo
        if(oldPhoto) fs.unlinkSync(`public/owner/img/${oldPhoto}`)
        
        await database.exec(
            `UPDATE owner
            SET name='${name}', username='${username}', phone=${phone}, email='${email}', nid=${nid}, photo=${photo}
            WHERE username='${userID}'`
        )

        res.redirect('../profile')
    } catch (err) {
        res.redirect('../../')
        return
    }
})

app.route('/password/:id')
    .get(async (req, res) => {
        const { id } = req.params
        const userID = userData.id()
        const mode = userData.mode()

        if (mode !== 'owner') {
            res.redirect('../../')
            return
        }

        let profile
        try {
            profile = await database.getUnique(`SELECT * FROM owner WHERE username='${id}'`)
        } catch (err) {
            res.redirect('../../')
            return
        }

        if (userID !== profile.username) {
            res.redirect('../../')
            return
        }

        res.render('owner/password', { misc, user: await userData.allInfo(), profile })
    })
    .post(async (req, res) => {
        res.redirect('/')
    })

app.route('/delete/:id')
    .get(async (req, res) => {
        const { id } = req.params
        const userID = userData.id()
        const mode = userData.mode()

        if (mode !== 'owner') {
            res.redirect('../../')
            return
        }

        let profile
        try {
            profile = await database.getUnique(`SELECT * FROM owner WHERE username='${id}'`)
        } catch (err) {
            res.redirect('../../')
            return
        }

        if (userID !== profile.username) {
            res.redirect('../../')
            return
        }

        res.render('owner/delete', { misc, user: await userData.allInfo(), profile })
    })
    .post(async (req, res) => {
        const temp = req.body
        const userID = userData.id()
        const mode = userData.mode()

        if (mode !== 'owner') {
            res.redirect('../../')
            return
        }

        const { pass } = temp
        const { profileID } = temp
        const plc = hash.salt()
        const pass2 = hash.create(`${temp.pass2 + plc}Home Is Where The Start Is!`)
        const pass3 = hash.create(`${temp.pass3 + plc}Home Is Where The Start Is!`)
        
        if (userID !== profileID || pass2 !== pass3) {
            res.redirect('../../')
            return
        }

        try {
            await getUser(userID, pass)
            
            await database.exec(
                `UPDATE owner
                SET password='${pass2}', passwordLastChanged='${plc}'
                WHERE username='${userID}'`
            )

            res.redirect('../profile')
        } catch (err) {
            res.redirect('/')
            return
        }
        
        res.redirect('/logout/')
    })

app.get('/requests', async (req, res) => {
    const userID = userData.id()

    try {
        const requestRecords = await database.get(
            `SELECT * FROM flatrequest WHERE (SELECT owner FROM flat WHERE flatrequest.flatid=flat.flatid)='${userID}'`,
        )

        res.render('owner/requests', {
            misc,
            user: await userData.allInfo(),
            flatRequestList: await flatRequestList(requestRecords)
        })
    } catch (err) {
        res.redirect('../../')
    }
})

module.exports = app
