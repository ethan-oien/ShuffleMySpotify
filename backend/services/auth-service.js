//Uses Spotify Authentication Code Flow with PCKE Extension

const axios = require('axios').default;
const { scopes, authorization_endpoint, token_endpoint } = require('../spotify_variables.json');

const global_state = generate_state();
const global_verifier = generate_code_verifier();

async function refresh_tokens(refresh_token)
{
    return new Promise(async (resolve, reject) => {
        const client_id = process.env.CLIENT_ID;

        const data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': client_id
        }
        const urlEncodedData = new URLSearchParams(data).toString();
    
        axios.post(token_endpoint, urlEncodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async (res) => {
            const access_token = res.data.access_token;
            const expires_in_s = res.data.expires_in;
            const refresh_token = res.data.refresh_token;

            const ret = {
                'access_token': access_token,
                'expires_in_s': expires_in_s
            }

            if(refresh_token) ret['refresh_token'] = refresh_token;

            resolve(ret);
        }).catch((err) => {
            reject(translate_axios_error(err));
        });
    });
}

async function load_tokens(code, state)
{
    const conflict_status = 409;

    return new Promise(async (resolve, reject) => {
        const ver = await global_verifier;
        const sta = await global_state;
        if(sta !== state) {
            const err = {
                'data': 'The state of the server did not match the request.',
                'status': conflict_status
            };

            return reject(err);
        }

        const client_id = process.env.CLIENT_ID;
        const redirect_uri = process.env.REDIRECT_URL;

        const data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': client_id,
            'code_verifier': ver
        }
        const urlEncodedData = new URLSearchParams(data).toString();

        axios.post(token_endpoint, urlEncodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async (res) => {
            const access_token = res.data.access_token;
            const expires_in_s = res.data.expires_in;
            const refresh_token = res.data.refresh_token;

            const ret = {
                'access_token': access_token,
                'expires_in_s': expires_in_s,
                'refresh_token': refresh_token
            }

            resolve(ret);
        }).catch((err) => {
            reject(translate_axios_error(err));
        });
    });
}

function translate_axios_error(error)
{
    const ret = {};

    if(error.response) {
        ret.data = error.response.data;
        ret.status = error.response.status;
    } else if(error.request) {
        ret.data = error.request;
        ret.status = 500;
    } else {
        ret.data = 'An unknown error has occurred.';
        ret.status = 500;
    }

    return ret;
}

async function construct_url()
{
    const sta = await global_state;
    const ver = await global_verifier;
    const cha = await generate_code_challenge(ver);

    const scope = scopes;
    const show_dialog = null;

    const client_id = process.env.CLIENT_ID;
    const redirect_uri = process.env.REDIRECT_URL;

    const data = {
        'client_id': client_id,
        'response_type': 'code',
        'redirect_uri': redirect_uri,
        'state': sta,
        'code_challenge_method': 'S256',
        'code_challenge': cha
    }

    if(scope != null) data['scope'] = scope;
    if(show_dialog != null) data['show_dialog'] = show_dialog;

    const encodedData = new URLSearchParams(data).toString();

    const url = authorization_endpoint + '?' + encodedData;
    
    return url;
}

async function generate_state()
{
    const { randomBytes } = await import('crypto');

    const randomBytesAsync = (n) => {
        return new Promise((resolve, reject) => {
            randomBytes(n, (err, buf) => {
                if(err) reject(err);
                resolve(buf);
            });
        });
    }

    let state;
    const state_length = 8;

    state = (await randomBytesAsync(state_length)).toString('hex');

    return state;
}

async function generate_code_verifier()
{
    const { randomInt } = await import('crypto');

    const possible_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-~';
    const verifier_len = 32;
    const verifier_buf = [];

    for(let _=0;_<verifier_len;_++) {
        verifier_buf.push(possible_chars[randomInt(possible_chars.length)]);
    }

    return base64url_encode(verifier_buf.join(''));
}

async function generate_code_challenge(code_verifier)
{
    const { createHash } = await import('crypto');

    const s256hash = createHash('sha256');
    s256hash.update(code_verifier);
    const cha = s256hash.digest();

    return base64url_encode(cha);
}

function base64url_encode(str) {
    const b64 = Buffer.from(str).toString('base64');
    const b64url = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return b64url;
}

module.exports = {
    refresh_tokens,
    load_tokens,
    construct_url
}