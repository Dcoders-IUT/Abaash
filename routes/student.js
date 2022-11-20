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
        cb(null, 'public/student/img')
    },
    filename(req, file, cb) {
        cb(null, userData.id() + Date.now() + path.extname(file.originalname))
    },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

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
            `SELECT * FROM flat WHERE flatID='${records[i].flatID}'`,
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

        res.redirect('../')
    })
    .get((req, res) => res.redirect('./login.html'))

app.route('/register')
    .post(async (req, res) => {
        const temp = req.body

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
            `INSERT INTO student(name, gender, id, pass, plc, phone, email, nid, blg) VALUES ('${name}',
        ${gender},
        ${id},
        '${pass}',
        '${plc}',
        ${phone},
        '${email}',
        ${nid},
        '${blg}'`
        )

        store.set('user', id)
        store.set('mode', req.body.mode)

        res.redirect('../')
    })
    .get((req, res) => res.redirect('./login'))

app.get('/profile', (req, res) => {
    const userID = userData.id()
    res.redirect(`profile/${userID}`)
})

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params
    let profileUserData

    try {
        profileUserData = await database.getUnique(`SELECT * FROM student WHERE studentID=${id}`)
    } catch (err) {
        console.log(err)
        res.render('student/profile', { misc, user: await userData.allInfo(), profileUser: null })
        return
    }

    res.render('student/profile', {
        misc,
        user: await userData.allInfo(),
        profileUser: id,
        name: profileUserData.name,
        gender: profileUserData.gender,
        bloodgroup: profileUserData.bloodgroup,
        photo: profileUserData.photo,
    })
})

app.route('/edit/:id')
    .get(async (req, res) => {
        const { id } = req.params
        const userID = userData.id()
        const mode = userData.mode()
        let profileUserData

        if (mode !== 'student') {
            res.redirect('../../')
            return
        }

        try {
            profileUserData = await database.getUnique(
                `SELECT * FROM student WHERE studentID=${id}`,
            )
        } catch (err) {
            res.redirect('../../')
            return
        }

        if (userID !== profileUserData.studentID) {
            res.redirect('../../')
            return
        }

        res.render('student/edit', { misc, user: await userData.allInfo(), profileUserData })
    })
    .post(upload.single('photo'), async (req, res) => {
        const temp = req.body
        const userID = userData.id()
        const mode = userData.mode()

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
        const gender = Number(temp.gender)
        const { blg } = temp
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
                gender=${gender}, bloodgroup='${blg}', photo=${photo}
                WHERE studentID=${userID}`
            )

            res.redirect('../profile')
        } catch (err) {
            console.log(err)
            res.redirect('../../')
            return
        }
    })

app.get('/requests', async (req, res) => {
    const userID = userData.id()

    try {
        const requestRecords = await database.get(
            `SELECT * FROM flatrequest WHERE studentID=${userID}`,
        )

        res.render('showRequests', {
            misc,
            user: await userData.allInfo(),
            flatRequestList: await flatRequestList(requestRecords)
        })
    } catch (err) {
        res.redirect('../../')
    }
})

module.exports = app
