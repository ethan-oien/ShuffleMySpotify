require('dotenv').config();
const express = require('express');
const auth = require('./middleware/auth-router');

const app = express();

const port = process.env.PORT;

app.use('/auth', auth);

app.get('/', (req, res) => {
    res.send(`API listening on port ${port}...`);
});

app.listen(port, () => {
    console.log(`API listening on port ${port}...`);
})