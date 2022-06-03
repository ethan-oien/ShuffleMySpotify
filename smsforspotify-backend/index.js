require('dotenv').config();
const express = require('express');
const cookie_parser = require('cookie-parser');
const auth = require('./middleware/auth-router');
const api = require('./middleware/api-router');

const app = express();

const port = process.env.PORT;

app.use((req, res, next) => {
    console.log(`${req.method}: ${req.path}`);
    next();
});

app.use(cookie_parser());
app.use('/auth', auth);
app.use('/api', api);

app.get('/', (req, res) => {
    res.send(`API listening on port ${port}...`);
});

app.listen(port, () => {
    console.log(`API listening on port ${port}...`);
})