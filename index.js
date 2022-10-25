const express = require('express');
const store = require('store');
const database = require('./util/database');
const misc = require('./util/misc');

const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'ejs');

async function allFlats() {
    try {
        return await database.get('SELECT flatID, name, address, gender, level FROM flat');
    } catch (err) {
        return {};
    }
}

async function searchFlats(address, minLevel, maxLevel, gender, lift, generator) {
    const addressQuery =
        address === '' ? 'true' : `LOWER(address) LIKE CONCAT('%', LOWER('${address}'),'%')`;
    const levelQuery = `level >= ${minLevel} AND level <= ${maxLevel}`;
    const genderQuery = `gender = ${gender} OR gender = 2`;
    const liftQuery = `lift >= ${lift}`;
    const generatorQuery = `generator >= ${generator}`;

    console.log(`SELECT flatID, name, address, gender, level FROM flat
    WHERE (${addressQuery}) AND (${levelQuery}) AND (${genderQuery}) AND (${liftQuery}) AND (${generatorQuery})`);

    try {
        return await database.get(
            `SELECT flatID, name, address, gender, level FROM flat
            WHERE (${addressQuery}) AND (${levelQuery}) AND (${genderQuery}) AND (${liftQuery}) AND (${generatorQuery})`,
        );
    } catch (err) {
        return {};
    }
}

function openEJS(page, res) {
    const currentUser = store.get('user');
    const mode = store.get('mode');

    res.render(page, { currentUser, mode });
}

async function openHomeEJS(res) {
    const currentUser = store.get('user');
    const mode = store.get('mode');

    if (!store.get('mode') || !store.get('user')) {
        res.render('home', {
            misc,
            currentUser,
            mode,
            flatList: misc.shuffle(await allFlats()),
        });
        return;
    }
    let currentUserData;

    try {
        currentUserData = await database.getUnique(
            `SELECT name FROM ${mode} WHERE ${
                mode === 'student' ? 'studentID' : 'username'
            }='${currentUser}'`
        );
    } catch (err) {
        res.render('home', {
            misc,
            currentUser,
            mode,
            nameOfCurrentUser: null,
            flatList: misc.shuffle(await allFlats()),
        });
        return;
    }
    res.render('home', {
        misc,
        currentUser,
        mode,
        nameOfCurrentUser: currentUserData.name,
        flatList: misc.shuffle(await allFlats()),
    });
}

app.route('/')
    .get(async (req, res) => openHomeEJS(res))
    .post(async (req, res) => openHomeEJS(res));

app.get('/map', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./');
    else openEJS('map', res);
});

app.get('/notifications', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./');
    else openEJS('notifications', res);
});

app.get('/sos', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./');
    else openEJS('sos', res);
});

app.get('/logout', (req, res) => {
    store.remove('user');
    store.remove('mode');
    res.redirect('./');
});

app.get('/profile', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./');
    else {
        const currentUser = store.get('user');
        const mode = store.get('mode');

        res.redirect(`${mode}/profile/${currentUser}`);
    }
});

app.post('/search', async (req, res) => {
    const temp = req.body;

    const { address } = temp;
    const minLevel = Number(temp.minLevel);
    const maxLevel = Number(temp.maxLevel);
    const gender = Number(temp.gender);
    const lift = temp.lift === 'on';
    const generator = temp.lift === 'on';

    res.render('searchResults', {
        misc,
        flatList: await searchFlats(address, minLevel, maxLevel, gender, lift, generator),
    });
});

const studentRouter = require('./routes/student');
const ownerRouter = require('./routes/owner');
const flatRouter = require('./routes/flat');

app.use('/student', studentRouter);
app.use('/owner', ownerRouter);
app.use('/flat', flatRouter);

app.listen(port);
