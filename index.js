const express = require('express');
const store = require('store');

const app = express();
const port = 3001;

app.use(express.static('public'));
app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const userID = store.get('user');
    const mode = store.get('mode');

    res.render('home', { userID, mode });
});

app.post('/', (req, res) => {
    const userID = store.get('user');
    const mode = store.get('mode');

    res.render('home', { userID, mode });
});

app.get('/logout', (req, res) => {
    store.remove('user');
    store.remove('mode');
    res.redirect('./');
});

app.get('/map', (req, res) => {
    const userID = store.get('user');
    const mode = store.get('mode');

    res.render('map', { userID, mode });
});

app.get('/notifications', (req, res) => {
    const userID = store.get('user');
    const mode = store.get('mode');

    res.render('notifications', { userID, mode });
});

app.get('/sos', (req, res) => {
    const userID = store.get('user');
    const mode = store.get('mode');

    res.render('sos', { userID, mode });
});

const studentRouter = require('./routes/student');
const ownerRouter = require('./routes/owner');

app.use('/student', studentRouter);
app.use('/owner', ownerRouter);

app.listen(port);
