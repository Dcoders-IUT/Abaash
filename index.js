const express = require('express');

const app = express();
const port = 3001;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { uid: null });
    // res.redirect('student/');
});

const studentRouter = require('./routes/student');
const ownerRouter = require('./routes/owner');

app.use('/student', studentRouter);
app.use('/owner', ownerRouter);

app.listen(port);
