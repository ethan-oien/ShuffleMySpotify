const express = require('express');
const { get_current_user_id, get_current_users_playlists, get_playlist_items,
    create_playlist, add_items_to_playlist } = require('../services/api-service');
const { get_shuffle_methods, organize } = require('../services/shuffle-service');

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

router.get('/methods', (req, res, next) => {
    const methods = get_shuffle_methods();
    
    res.json(methods);
})

router.get('/me', async (req, res, next) => {
    get_current_user_id(req.access_token)
    .then((data) => {
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

router.post('/me/playlists/:playlist_id', async (req, res, next) => {
    const { playlist_id } = req.params;
    const { method_index, locale } = req.body;

    if(!playlist_id) return res.sendStatus('400');

    const playlist_tracks = await get_playlist_items(req.access_token, req.body.playlist_id)
    .catch((err) => {
        console.error(err);
    });

    const sorted_tracks = await organize(playlist_tracks, method_index, locale);
    const playlist_track_uris = sorted_tracks.map((track) => 'spotify:track:' + track.id);

    const playlist_name = 'hello';
    const new_playlist_id = await create_playlist(access_token, playlist_name)
    .catch((err) => {
        console.error(err);
    });

    await add_items_to_playlist(access_token, new_playlist_id, playlist_track_uris)
    .catch((err) => {
        console.error(err);
    });
});

module.exports = router;