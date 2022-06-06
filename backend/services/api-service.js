const axios = require('axios').default;
const { api_base_uri, spotify_item_limit } = require('../spotify_variables.json');

const spotify_bad_token_status = 401;
const spotify_bad_oath_request_status = 403;
const spotify_rate_limit_exceeded_status = 429;

function construct_headers(access_token) {
    return {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    }
}

async function check_error(error, callback) {
    const retry_after = process.env.DEFAULT_RETRY_TIME_MS;

    const retry = async (retry_timeout, callback) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(callback());
            }, retry_timeout);
        });
    }

    if(error.response) {
        switch(error.response.status) {
            case spotify_bad_token_status:
                console.log("Bad token. Reauthenticate the user!");
                throw error;
            case spotify_bad_oath_request_status:
                console.error("Bad OAuth request! Are your environment variables set correctly?");
                throw error;
            case spotify_rate_limit_exceeded_status:
                retry_after = error.response.headers['Retry-After'] + 1;
                const ms_in_s = 1000;
                retry_after = retry_after * ms_in_s;
                console.log(`Rate limit reached, retrying in ${retry_after} seconds...`);
                return retry(retry_after, callback);
            default:
                console.error(`An unknown error was found in Spotify API response! (Code: ${error.response.status})`);
                return retry(retry_after, callback);
                //throw error;
        }
    } else if(error.request) {
        console.log(`Unable to send request, retrying in ${retry_after} seconds...`)
        return retry(retry_after, callback)
    } else {
        console.error("An unknown error has occurred!");
        throw error.message;
    }
}

async function get_current_user_id(access_token) {
    const uri = "/me";

    const do_iteration = async (url, tries=0) => {
        const max_tries = process.env.MAX_TRIES;

        if(tries > max_tries) {
            return null;
        }

        let response;
        try {
            response = await axios.get(url, construct_headers(access_token));
        } catch(error) {
            return check_error(error, () => do_iteration(url, tries+1));
        }
    
        return response.data.id;
    }

    return do_iteration(`${api_base_uri}/v1${uri}`);
}

async function get_current_users_playlists(access_token) {
    const uri = "/me/playlists";
    let ret = [];

    const do_iteration = async (url, tries=0) => {
        const max_tries = process.env.MAX_TRIES;

        if(tries > max_tries) {
            return null;
        }

        let response;
        try {
            response = await axios.get(url, construct_headers(access_token));
        } catch(error) {
            return check_error(error, () => do_iteration(url, tries+1));
        }

        response.data.items.forEach(element => {
            ret.push(element);
        });

        const next = response.data.next;
        
        if(next) return do_iteration(next);
    
        return ret;
    }

    return do_iteration(`${api_base_uri}/v1${uri}`);
}

async function get_playlist_items(access_token, playlist_id) {
    const uri = `/playlists/${playlist_id}/tracks`;
    let ret = [];

    const do_iteration = async (url, tries=0) => {
        const max_tries = process.env.MAX_TRIES;

        if(tries > max_tries) {
            return null;
        }

        let response;
        try {
            response = await axios.get(url, construct_headers(access_token));
        } catch(error) {
            return check_error(error, () => do_iteration(url, tries+1));
        }

        response.data.items.forEach(element => {
            ret.push(element);
        });

        const next = response.data.next;
        
        if(next) return do_iteration(next);
    
        return ret;
    }

    return do_iteration(`${api_base_uri}/v1${uri}`);
}

async function create_playlist(access_token, playlist_name) {
    const user_id = await get_current_user_id(access_token)
    .catch((err) => {
        console.error(err);
    });

    const uri = `/users/${user_id}/playlists`;
    let ret;

    const do_iteration = async (url, tries=0) => {
        const max_tries = process.env.MAX_TRIES;

        if(tries > max_tries) {
            return null;
        }

        let response;
        try {
            response = await axios.post(url, {
                "name": playlist_name,
                "public": false,
            }, construct_headers(access_token));
        } catch(error) {
            return check_error(error, () => do_iteration(url, tries+1));
        }

        ret = response.data.id;
    
        return ret;
    }

    return do_iteration(`${api_base_uri}/v1${uri}`);
}

async function add_items_to_playlist(access_token, playlist_id, uris) {
    const uri = `/playlists/${playlist_id}/tracks`;

    const do_iteration = async (url, tries=0) => {
        const max_tries = process.env.MAX_TRIES;

        if(tries > max_tries) {
            return null;
        }

        try {
            await axios.post(url, {
                "uris": JSON.stringify(uris),
            }, construct_headers(access_token));
        } catch(error) {
            return check_error(error, () => do_iteration(url, tries+1));
        }
    }

    return do_iteration(`${api_base_uri}/v1${uri}`);
}

module.exports = {
    get_current_user_id,
    get_current_users_playlists,
    get_playlist_items,
    create_playlist,
    add_items_to_playlist,
}