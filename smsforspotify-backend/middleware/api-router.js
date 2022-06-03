const express = require('express');
const { get_current_user_id, get_current_users_playlists } = require('../services/api-service');

const router = express.Router();

const unauthenticated_status = 401;

//check access token first and foremost
router.get('/*', (req, res, next) => {
    const access_token = req.cookies.access_token;

    if(access_token) {
        req.access_token = access_token;
        
        next();
    } else {
        res.sendStatus(unauthenticated_status);
    }
});

router.get('/me', async (req, res, next) => {
    get_current_user_id(req.access_token)
    .then((data) => {
        console.log(data);
        res.json(data);
    })
    .catch((err) => {
        console.log(err);

        res.sendStatus(500);
    });
});

router.get('/me/playlists', async (req, res, next) => {
    get_current_users_playlists(req.access_token)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);

        res.sendStatus(500);
    });
});

module.exports = router;