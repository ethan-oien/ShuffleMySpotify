import axios from 'axios';

const api_endpoint = '/api';
const auth_endpoint = '/auth';

async function handle_error(error, callback) {
    if(error.response.status === 401) {
        await axios.get(`${auth_endpoint}/refresh`)
        .then(() => {
            callback();
        })
        .catch((err) => {
            console.error(err);
        });
    } else {
        console.error(error);
    }
}

export async function get_current_user_id()
{
    const response = await axios.get(`${api_endpoint}/me`)
    .catch((err) => {
        handle_error(err, get_current_user_id);
    });

    return response.data;
}

export async function get_current_users_playlists()
{
    const response = await axios.get(`${api_endpoint}/me/playlists`)
    .catch((err) => {
        handle_error(err, get_current_users_playlists);
    });

    return response.data;
}

export async function get_shuffle_methods()
{
    const response = await axios.get(`${api_endpoint}/methods`)
    .catch((err) => {
        handle_error(err, get_current_users_playlists);
    });

    return response.data;
}