const express = require('express')
const store = require('store')
const crypto = require('crypto')
const multer = require('multer')
const path = require('path')
const database = require('../util/database')
const misc = require('../util/misc')
const hash = require('../util/hash')

const app = express.Router()
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/img/flat')
    },
    filename(req, file, cb) {
        cb(null, store.get('user') + Date.now() + path.extname(file.originalname))
    },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function newFlatID() {
    const base = 1000000
    const divisor = 1000000
    let offset
    let row

    do {
        offset = crypto.randomInt(divisor)
        row = await database.getUnique(
            `SELECT COUNT(*) AS count FROM flat WHERE flatID=${base + offset}`
        )
    } while (row.count > 0)

    return base + offset
}

app.post('/profile/request', async (req, res) => {
    const { studentID } = req.body
    const { flatID } = req.body

    await database.exec(
        `INSERT INTO flatrequest(studentID, flatID, date) VALUES (${studentID}, ${flatID}, '${hash.salt()}')`,
    )

    res.redirect(`../profile/${flatID}`)
})

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params
    const currentUser = store.get('user')
    const mode = store.get('mode')
    let flat
    let owner
    let rooms

    try {
        flat = await database.getUnique(`SELECT * FROM flat WHERE flatID='${id}'`)
        rooms = await database.getUnique(`SELECT * FROM room WHERE flatID='${id}'`)
        owner = await database.getUnique(`SELECT name FROM owner WHERE username='${flat.owner}'`)
    } catch (err) {
        console.log(err)
        res.render('flat/profile', {
            currentUser: store.get('user'),
            flat: null,
            rooms: null,
        })
        return
    }

    if (mode === 'student') {
        try {
            const student = await database.getUnique(
                `SELECT * FROM student WHERE studentID=${currentUser}`,
            )

            res.render('flat/profile', {
                currentUser,
                mode,
                flat,
                rooms,
                owner,
                student,
            })
        } catch (err) {
            res.render('flat/profile', {
                currentUser,
                mode,
                flat,
                rooms,
                owner,
            })
        }

        return
    }

    res.render('flat/profile', {
        currentUser,
        mode,
        flat,
        rooms,
        owner,
    })
})

app.route('/register')
    .get(async (req, res) => {
        const currentUser = store.get('user')
        const mode = store.get('mode')
        let owner

        if (mode !== 'owner') {
            res.redirect('../')
            return
        }

        try {
            owner = await database.getUnique(
                `SELECT username, name FROM owner WHERE username='${currentUser}'`,
            )
        } catch (err) {
            res.redirect('../')
            return
        }

        res.render('flat/register', { misc, currentUser, owner })
    })
    .post(async (req, res) => {
        const temp = req.body
        let flatID

        try {
            flatID = await newFlatID()
        } catch (err) {
            res.redirect('../')
            return
        }

        const { name } = temp
        const { address } = temp
        const { description } = temp
        const { owner } = temp
        const gender = Number(temp.gender)
        const level = Number(temp.level)
        const area = Number(temp.area)
        const x = Number(temp.x)
        const y = Number(temp.y)
        const lift = temp.lift === 'on'
        const generator = temp.generator === 'on'
        const { rent } = temp

        const bed = Number(temp.bed)
        const din = Number(temp.din)
        const liv = Number(temp.liv)
        const kit = Number(temp.kit)
        const bath = Number(temp.bath)
        const balk = Number(temp.balk)
        const xtra = Number(temp.xtra)

        await database.exec(
            `INSERT INTO flat(flatID, name, address, description, owner, gender, x, y, level, area, lift, generator, rent) VALUES (${flatID}, '${name}', '${address}', '${description}', '${owner}', ${gender}, ${x}, ${y}, ${level}, ${area}, ${lift}, ${generator}, ${rent})`,
        )

        await database.exec(
            `INSERT INTO room(flatID, bed, din, liv, kit, bath, balk, xtra) VALUES (${flatID}, ${bed}, ${din}, ${liv}, ${kit}, ${bath}, ${balk}, ${xtra})`,
        )

        res.redirect(`profile/${flatID}`)
    })

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    const currentUser = store.get('user')
    const mode = store.get('mode')
    let flat
    let rooms
    let owner

    if (mode !== 'owner') {
        res.redirect('../../')
        return
    }

    try {
        flat = await database.getUnique(`SELECT * FROM flat WHERE flatID=${id}`)
        rooms = await database.getUnique(`SELECT * FROM room WHERE flatID='${id}'`)
        owner = await database.getUnique(`SELECT name FROM owner WHERE username='${flat.owner}'`)
    } catch (err) {
        res.redirect('../../')
        return
    }

    res.render('flat/edit', {
        misc,
        currentUser,
        flat,
        rooms,
        owner,
    })
})

app.post('/edit/:id', upload.single('photo'), async (req, res) => {
    const temp = req.body
    const flatID = req.params.id

    const { name } = temp
    const { address } = temp
    const { description } = temp
    const gender = Number(temp.gender)
    const level = Number(temp.level)
    const area = Number(temp.area)
    const lift = temp.lift === 'on'
    const generator = temp.generator === 'on'
    const { rent } = temp
    const photo = req.file.filename
    console.log(photo)

    const bed = Number(temp.bed)
    const din = Number(temp.din)
    const liv = Number(temp.liv)
    const kit = Number(temp.kit)
    const bath = Number(temp.bath)
    const balk = Number(temp.balk)
    const xtra = Number(temp.xtra)

    await database.exec(
        `UPDATE flat
        SET name='${name}', address='${address}', description='${description}', gender=${gender}, area=${area}, level=${level}, lift=${lift}, generator=${generator}, rent=${rent}, photo='${photo}'
        WHERE flatID=${flatID}`,
    )

    await database.exec(
        `UPDATE room
        SET bed=${bed}, din=${din}, liv=${liv}, kit=${kit}, bath=${bath}, balk=${balk}, xtra=${xtra}
        WHERE flatID=${flatID}`,
    )

    res.redirect(`../profile/${flatID}`)
})

module.exports = app
