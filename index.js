const express = require('express');
const store = require('store');

const app = express();
const port = 3001;

app.use(express.static('public'));
app.set('view engine', 'ejs');

function openEJS(page, res) {
    const currentUser = store.get('user');
    const mode = store.get('mode');

    res.render(page, { currentUser, mode });
}

app.route('/')
    .get((req, res) => {
        if (!store.get('mode') || !store.get('user')) openEJS('home', res);
        const currentUser = store.get('user');
        const mode = store.get('mode');

        res.render('home', { currentUser, mode });
    })
    .post((req, res) => openEJS('home', res));

app.get('/map', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./');
    openEJS('map', res);
});

app.get('/notifications', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./');
    openEJS('notifications', res);
});

app.get('/sos', (req, res) => {
    if (!store.get('mode') || !store.get('user')) res.redirect('./');
    openEJS('sos', res);
});

app.get('/logout', (req, res) => {
    store.remove('user');
    store.remove('mode');
    res.redirect('./');
});

const studentRouter = require('./routes/student');
const ownerRouter = require('./routes/owner');
const flatRouter = require('./routes/flat');

app.use('/student', studentRouter);
app.use('/owner', ownerRouter);
app.use('/flat', flatRouter);

app.listen(port);
