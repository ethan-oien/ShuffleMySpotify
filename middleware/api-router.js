const express = require('express');
const { get_playlist_tracks, add_tracks_to_playlist,
    set_playlist_name } = require('../services/api-service');

const router = express.Router();

const unauthenticated_status = 401;
const playlist_id = '1CP2M6yS49QQ8MdRL5dyix';

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

router.get('/tracks', async (req, res, next) => {
    get_playlist_tracks(req.access_token, playlist_id)
    .then((tracks) => {
        res.json(tracks);
    })
    .catch((err) => {
        console.log(err);

        res.sendStatus(500);
    });
});

module.exports = router;