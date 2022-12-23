const express = require('express')
const session = require('express-session')
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
        cb(null, 'public/student/img')
    },
    filename(req, file, cb) {
        cb(null, userData.id(req.session) + Date.now() + path.extname(file.originalname))
    },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

app.use(session({
    secret: 'MemoriesAreMadeOfBliss!',
    saveUninitialized: true,
    resave: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function getUser(id, pass) {
    const wrongpass = 'WRONG PASSWORD!'

    try {
        const record = await database.getUnique(
            `SELECT studentID, password, passwordLastChanged FROM student WHERE studentID=${id} OR email='${id}' OR phone=${id}`,
        )
        const { studentID } = record

        const plc = record.passwordLastChanged
        const password = hash.create(`${pass + plc}Home Is Where The Start Is!`)
        if (password !== record.password) throw new Error(wrongpass)

        return studentID
    } catch (err) {
        console.log(err)
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
        let session=req.session

        try {
            id = await getUser(id, pass)
            store.set('user', id)
            store.set('mode', req.body.mode)

            session.user=id
            session.mode=req.body.mode

            // sessionStorage.setItem('user', id)
            // sessionStorage.setItem('mode', req.body.mode)
        } catch (err) {
            console.log(err)
            res.send(err.message)
            return
        }

        res.redirect('../')
    })
    .get((req, res) => res.redirect('./login.html'))

app.route('/register')
    .post(async (req, res) => {
        const temp = req.body
        const session = req.session

        const { name } = temp
        const gender = Number(temp.gender)
        const id = Number(temp.studentID)
        const plc = hash.salt()
        const pass = hash.create(`${temp.pass + plc}Home Is Where The Start Is!`)
        const phone = Number(temp.phone)
        const { email } = temp
        const nid = Number(temp.nid)
        const { blg } = temp

        await database.exec(
            `INSERT INTO student(name, gender, studentID, password, passwordLastChanged, phone, email, nid, bloodgroup) VALUES ('${name}',
            ${gender},
            ${id},
            '${pass}',
            '${plc}',
            ${phone},
            '${email}',
            ${nid},
            '${blg}')`
            )

        store.set('user', id)
        store.set('mode', req.body.mode)

        session.user=id
        session.mode=req.body.mode

        // sessionStorage.setItem('user', id)
        // sessionStorage.setItem('mode', req.body.mode)

        res.redirect('../')
    })
    .get((req, res) => res.redirect('./login'))

app.get('/profile', (req, res) => {
    const userID = userData.id(req.session)
    res.redirect(`profile/${userID}`)
})

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params

    try {
        const profile = await database.getUnique(`SELECT * FROM student WHERE studentID=${id}`)
        res.render('student/profile', { misc, user: await userData.allInfo(req.session), profile })
    } catch (err) {
        console.log(err)
        res.redirect('/')
        return
    }
})

app.route('/edit/:id')
    .get(async (req, res) => {
        const { id } = req.params
        const userID = userData.id(req.session)
        const mode = userData.mode(req.session)
        let profile

        if (mode !== 'student') {
            res.redirect('../../')
            return
        }

        try {
            profile = await database.getUnique(`SELECT * FROM student WHERE studentID=${id}`)
        } catch (err) {
            console.log(err)
            res.redirect('../../')
            return
        }

        if (Number(userID) !== Number(profile.studentID)) {
            res.redirect('../../')
            return
        }

        res.render('student/edit', { misc, user: await userData.allInfo(req.session), profile })
    })
    .post(upload.single('photo'), async (req, res) => {
        const temp = req.body
        const userID = userData.id(req.session)
        const mode = userData.mode(req.session)

        if (mode !== 'student') {
            res.redirect('../../')
            return
        }

        const profileID = Number(temp.profileID)
        const { name } = temp
        const { studentID } = temp
        const phone = Number(temp.phone)
        const { email } = temp
        const nid = Number(0)
        const { pass } = temp
    
        const photo = req.file? `'${req.file.filename}'`: 'NULL'

        if (Number(userID) !== Number(profileID)) {
            res.redirect('../../')
            return
        }

        try {
            await getUser(userID, pass)
            
            let oldPhoto = await database.getUnique(`SELECT photo FROM student WHERE studentID=${userID}`)
            oldPhoto = oldPhoto.photo
            if(oldPhoto) fs.unlinkSync(`public/student/img/${oldPhoto}`)
            
            await database.exec(
                `UPDATE student
                SET name='${name}', studentID=${studentID}, phone=${phone}, email='${email}', nid=${nid},
                photo=${photo}
                WHERE studentID=${userID}`
            )

            res.redirect('../profile')
        } catch (err) {
            console.log(err)
            res.redirect('../../')
            return
        }
    }) 

app.route('/password/:id')
.get(async (req, res) => {
    const { id } = req.params
    const userID = userData.id(req.session)
    const mode = userData.mode(req.session)

    if (mode !== 'student') {
        res.redirect('../../')
        return
    }

    let profile
    try {
        profile = await database.getUnique(`SELECT * FROM student WHERE studentID=${id}`)
    } catch (err) {
        console.log(err)
        res.redirect('../../')
        return
    }

    if (Number(userID) !== Number(profile.studentID)) {
        res.redirect('../../')
        return
    }

    res.render('password', { misc, user: await userData.allInfo(req.session), profile })
})
.post(async (req, res) => {
    const temp = req.body
    const userID = userData.id(req.session)
    const mode = userData.mode(req.session)

    if (mode !== 'student') {
        res.redirect('../../')
        return
    }

    const { pass } = temp
    const { profileID } = temp
    const plc = hash.salt()
    const pass2 = hash.create(`${temp.pass2 + plc}Home Is Where The Start Is!`)
    const pass3 = hash.create(`${temp.pass3 + plc}Home Is Where The Start Is!`)
    
    if (Number(userID) !== Number(profileID) || pass2 !== pass3) {
        res.redirect('../../')
        return
    }

    try {
        await getUser(userID, pass)
        
        await database.exec(
            `UPDATE student
            SET password='${pass2}', passwordLastChanged='${plc}'
            WHERE studentID=${userID}`
        )

        res.redirect('../profile')
    } catch (err) {
        console.log(err)
        res.redirect('/')
        return
    }
})

app.route('/delete/:id')
.get(async (req, res) => {
    const { id } = req.params
    const userID = userData.id(req.session)
    const mode = userData.mode(req.session)

    if (mode !== 'student') {
        res.redirect('../../')
        return
    }

    let profile
    try {
        profile = await database.getUnique(`SELECT * FROM student WHERE studentID=${id}`)
    } catch (err) {
        console.log(err);
        res.redirect('../../')
        return
    }

    if (Number(userID) !== Number(profile.studentID)) {
        res.redirect('../../')
        return
    }

    res.render('delete', { misc, user: await userData.allInfo(req.session), profile })
})
.post(async (req, res) => {
    const temp = req.body
    const userID = userData.id(req.session)
    const mode = userData.mode(req.session)

    if (mode !== 'student') {
        res.redirect('../../')
        return
    }

    const { pass } = temp
    const { profileID } = temp
    
    if (Number(userID) !== Number(profileID)) {
        res.redirect('../../')
        return
    }

    try {
        await getUser(userID, pass)
        
        await database.exec(
            `DELETE FROM student
            WHERE studentID=${userID}`
        )

        res.redirect('/logout/')
    } catch (err) {
        console.log(err)
        res.redirect('/')
        return
    }
})

app.get('/requests', async (req, res) => {
    const userID = userData.id(req.session)
    console.log(req.session)

    try {
        const requestRecords = await database.get(
            `SELECT * FROM flatrequest WHERE studentID=${userID}`,
        )

        res.render('showRequests', {
            misc,
            user: await userData.allInfo(req.session),
            flatRequestList: await flatRequestList(requestRecords)
        })
    } catch (err) {
        console.log(err)
        res.redirect('../../')
    }
})

module.exports = app
