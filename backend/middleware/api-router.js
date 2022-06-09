const express = require('express');
const { get_current_user_id, get_current_users_playlists, get_playlist,
    get_playlist_items, create_playlist, add_items_to_playlist } = require('../services/api-service');
const { get_shuffle_methods, shuffle, organize } = require('../services/shuffle-service');

const router = express.Router();

const unauthenticated_status = 401;

//check access token first and foremost
router.all('/*', (req, res, next) => {
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
    const { method_index } = req.body;
    const access_token = req.access_token;
    const locales = req.headers["accept-language"].split(',');

    const locales_parsed = locales.map((locale) => {
        const sc = locale.indexOf(';');

        if(sc !== -1) {
            return locale.substring(0, sc);
        } else {
            return locale;
        }
    });

    if(!playlist_id) return res.sendStatus('400');

    try {
        const playlist = await get_playlist(access_token, playlist_id);
        const playlist_items = await get_playlist_items(access_token, playlist_id);
        const playlist_tracks = playlist_items.map((item) => item.track);

        let sorted_tracks;
        if(!method_index) sorted_tracks = await shuffle(playlist_tracks);
        else sorted_tracks = await organize(playlist_tracks, method_index, locales_parsed);
        const playlist_track_uris = sorted_tracks.map((track) => 'spotify:track:' + track.id);

        const playlist_name = playlist.name + ' (SMS)';
        const new_playlist_id = await create_playlist(access_token, playlist_name);

        await add_items_to_playlist(access_token, new_playlist_id, playlist_track_uris);
    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
    
    res.sendStatus(200);
});

module.exports = router;