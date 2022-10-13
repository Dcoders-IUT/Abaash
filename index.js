const express = require('express');

const app = express();
const port = 3001;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { uid: null, mode: null });
});

app.post('/', (req, res) => {
    if (req.body.mode === 'owner') {
        res.render('index', { uid: req.body.username, mode: req.body.mode });
    } else if (req.body.mode === 'student') {
        res.render('index', { uid: req.body.studentID, mode: req.body.mode });
    }
});

app.get('/map', (req, res) => {
    res.render('map', {});
});

app.get('/notifications', (req, res) => {
    res.render('notifications', {});
});

app.get('/sos', (req, res) => {
    res.render('sos', {});
});

const studentRouter = require('./routes/student');
const ownerRouter = require('./routes/owner');

app.use('/student', studentRouter);
app.use('/owner', ownerRouter);

app.listen(port);
