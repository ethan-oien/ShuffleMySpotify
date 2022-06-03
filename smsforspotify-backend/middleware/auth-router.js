const express = require('express');
const { construct_url, load_tokens, refresh_tokens } = require('../services/auth-service');

const router = express.Router();

router.get('/login', (req, res, next) => {
    construct_url()
    .then((url) => {
        res.header('Access-Control-Allow-Origin', 'https://localhost:3000');
        res.redirect(url);
    })
    .catch((err) => {
        console.error(err);
        res.sendStatus(500);
    });
});

router.get('/callback', (req, res, next) => {
    const code = req.query['code'];
    const state = req.query['state'];

    if(code && state) {
        load_tokens(code, state)
        .then((data) => {
            const { access_token, expires_in_s, refresh_token } = data;
            const ms_in_s = 1000;
            const refresh_token_max_age_ms = process.env.REFRESH_TOKEN_MAX_AGE_MS;

            res.cookie('access_token', access_token,
                {
                    httpOnly: true,
                    maxAge: expires_in_s * ms_in_s
                }
            );
            res.cookie('refresh_token', refresh_token,
                {
                    httpOnly: true,
                    maxAge: refresh_token_max_age_ms
                }
            );

            res.redirect('http://localhost:3000/');
        })
        .catch((err) => {
            console.error(err.data);
            res.sendStatus(err.status);
        });
    } else {
        res.sendStatus(400);
    }
});

router.get('/refresh', (req, res, next) => {
    const existing_refresh_token = req.cookies.refresh_token;

    if(existing_refresh_token) {
        refresh_tokens(existing_refresh_token)
        .then((data) => {
            const { access_token, expires_in_s, refresh_token } = data;
            const ms_in_s = 1000;
            const refresh_token_max_age_ms = process.env.REFRESH_TOKEN_MAX_AGE_MS;

            res.cookie('access_token', access_token,
                {
                    httpOnly: true,
                    maxAge: expires_in_s * ms_in_s
                }
            );

            if(refresh_token) {
                res.cookie('refresh_token', refresh_token,
                    {
                        httpOnly: true,
                        maxAge: refresh_token_max_age_ms
                    }
                );
            }

            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err.data);
            res.sendStatus(err.status);
        });
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;