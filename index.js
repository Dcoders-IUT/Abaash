const express = require('express')
const session = require('express-session')
const store = require('store')
const userData = require('./util/userData')
const database = require('./util/database')
const misc = require('./util/misc')
const hash = require('./util/hash')
// const mlr = require('./util/mlr')

const app = express()
const port = 3001

app.use(session({
    secret: 'MemoriesAreMadeOfBliss!',
    saveUninitialized: true,
    resave: true
}))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.set('views', './views')
app.set('view engine', 'ejs')

// console.log(mlr.test().predict([3, 4]))

async function allFlats() {
    try {
        return await database.get('SELECT * FROM flat WHERE rent > 0')
    } catch (err) {
        console.log(err)
        return {}
    }
}
async function searchFlats(address, minLevel, maxLevel, gender, lift, generator, area, rent) {
    const addressQuery = address === '' ? 'true' : `LOWER(address) LIKE CONCAT('%', LOWER('${address}'),'%')`
    const levelQuery = `level >= ${minLevel} AND level <= ${maxLevel}`
    const genderQuery = `gender = ${gender} OR gender = 2`
    const liftQuery = `lift >= ${lift ? 1 : 0}`
    const generatorQuery = `generator >= ${generator ? 1 : 0}`
    const areaQuery = `area >= ${area}`
    const rentQuery = rent>0? `rent <= ${rent}`: 'true'

    try {
        return await database.get(
            `SELECT * FROM flat
            WHERE (${addressQuery}) AND (${levelQuery}) AND
            (${genderQuery}) AND (${liftQuery}) AND (${generatorQuery})
            AND (${areaQuery}) AND (rent > 0) AND (${rentQuery})`
        )
    } catch (err) {
        console.log(err);
        return {}
    }
}

async function openHomeEJS(req, res) {
    console.log(req.session);

    res.render('home', {
        misc,
        user: await userData.allInfo(req.session),
        flatList: misc.shuffle(await allFlats()),
    })
}

app.route('/')
    .get(async (req, res) => openHomeEJS(req, res))
    .post(async (req, res) => openHomeEJS(req, res))

app.get('/logout', (req, res) => {
    store.remove('user')
    store.remove('mode')

    req.session.destroy();
    res.redirect('/')
})

app.get('/test1', (req, res) => {
    store.set('user', 'ork')
    store.set('mode', 'owner')

    let session=req.session;
    session.user='ork'
    session.mode='owner'
    res.redirect('./')
})

app.get('/test2', (req, res) => {
    store.set('user', '190041129')
    store.set('mode', 'student')

    let session=req.session;
    session.user='190041129'
    session.mode='student'
    res.redirect('./')
})

app.get('/profile', (req, res) => {
    if (userData.missing(req.session)) res.redirect('./')
    
    else {
        const userID = userData.id(req.session)
        const mode = userData.mode(req.session)

        res.redirect(`${mode}/profile/${userID}`)
    }
})

app.post('/search', async (req, res) => {
    const temp = req.body

    const { address } = temp
    const minLevel = Number(temp.minLevel)
    const maxLevel = Number(temp.maxLevel)
    const gender = Number(temp.gender)
    const lift = temp.lift === 'on'
    const generator = temp.lift === 'on'
    const area = Number(temp.area)
    const rent = Number(temp.rent)

    res.render('searchResults', {
        misc,
        user: await userData.allInfo(req.session),
        flatList: await searchFlats(
            address,
            minLevel,
            maxLevel,
            gender,
            lift,
            generator,
            area,
            rent,
        )
    })
})

const studentRouter = require('./routes/student')
const ownerRouter = require('./routes/owner')
const flatRouter = require('./routes/flat')

app.use('/student', studentRouter)
app.use('/owner', ownerRouter)
app.use('/flat', flatRouter)

app.listen(port)
