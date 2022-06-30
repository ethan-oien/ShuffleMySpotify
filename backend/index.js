require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser');
const auth = require('./middleware/auth-router');
const api = require('./middleware/api-router');
const path = require('path');

const app = express();

const port = process.env.PORT;

app.use((req, res, next) => {
    console.log(`${req.method}: ${req.path}`);
    next();
});

app.use(cookie_parser());
app.use(body_parser.json());
app.use('/auth', auth);
app.use('/api', api);

app.use(express.static(path.join(__dirname, './build')));

app.listen(port, () => {
    console.log(`API listening on port ${port}...`);
})