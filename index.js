const express = require('express')
const store = require('store')
const database = require('./backend/util/database')
const misc = require('./backend/util/misc')
const path = require("path")
const app = express()
const port = 3001

app.use(express.static('frontend'))
app.set('views', path.join(__dirname, './backend/views'))
app.set('view engine', 'ejs')

async function allFlats() {
    try {
        return await database.get('SELECT flatID, name, address, gender, level FROM flat')
    } catch (err) {
        return {}
    }
}

function openEJS(page, res) {
    const currentUser = store.get('user')
    const mode = store.get('mode')

    res.render(page, { currentUser, mode })
}

async function openHomeEJS(res) {
    const currentUser = store.get('user')
    const mode = store.get('mode')

    if (!store.get('mode') || !store.get('user')) {
        res.render('home', {
            currentUser,
            mode,
            flatList: misc.shuffle(await allFlats()),
        })
        return
    }
    let currentUserData

    try {
        currentUserData = await database.getUnique(
            `SELECT name FROM ${mode} WHERE ${mode === 'student' ? 'studentID' : 'username'
            }='${currentUser}'`,
        )
    } catch (err) {
        res.render('home', {
            currentUser,
            mode,
            nameOfCurrentUser: null,
            flatList: misc.shuffle(await allFlats()),
        })
        return
    }
    res.render('home', {
        currentUser,
        mode,
        nameOfCurrentUser: currentUserData.name,
        flatList: misc.shuffle(await allFlats()),
    })
}

app.route('/')
    .get(async (req, res) => openHomeEJS(res))
    .post(async (req, res) => openHomeEJS(res))

app.get('/map', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./')
    else openEJS('map', res)
})

app.get('/notifications', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./')
    else openEJS('notifications', res)
})

app.get('/sos', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./')
    else openEJS('sos', res)
})

app.get('/logout', (req, res) => {
    store.remove('user')
    store.remove('mode')
    res.redirect('./')
})

app.get('/profile', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./')
    else {
        const currentUser = store.get('user')
        const mode = store.get('mode')

        res.redirect(`${mode}/profile/${currentUser}`)
    }
})

const studentRouter = require('./backend/routes/student')
const ownerRouter = require('./backend/routes/owner')
const flatRouter = require('./backend/routes/flat')

app.use('/student', studentRouter)
app.use('/owner', ownerRouter)
app.use('/flat', flatRouter)

app.listen(port)
