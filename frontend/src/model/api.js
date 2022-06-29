import axios from 'axios';

const api_endpoint = '/api';
const auth_endpoint = '/auth';

async function handle_error(error, callback) {
    if(error.response.status === 401) {
        await refresh();
        return callback();
    } else {
        console.error(error);
    }
}

export async function refresh()
{
    const response = await axios.get(`${auth_endpoint}/refresh`);
    return response.data;
}

export async function get_current_user_id()
{
    try {
        const response = await axios.get(`${api_endpoint}/me`);
        return response.data;
    } catch(err) {
        return handle_error(err, get_current_user_id);
    }
}

export async function get_current_users_playlists()
{
    try {
        const response = await axios.get(`${api_endpoint}/me/playlists`);
        return response.data;
    } catch(err) {
        return handle_error(err, get_current_users_playlists);
    };
}

export async function get_shuffle_methods()
{
    try {
        const response = await axios.get(`${api_endpoint}/methods`)
        return response.data;
    } catch(err) {
        return handle_error(err, get_shuffle_methods);
    };
}

export async function organize_playlist(playlist_id, method_index)
{
    try {
        await axios.post(`${api_endpoint}/me/playlists/${playlist_id}`, {
            method_index: method_index
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch(err) {
        return handle_error(err, () => organize_playlist(playlist_id, method_index));
    };
}