import axios from 'axios';

export async function get_current_user_id()
{
    const response = await axios.get('/api/me')
    .catch((err) => {
        console.error(err);
        throw err;
    });

    return response.data;
}

export async function get_current_users_playlists()
{
    const response = await axios.get('/api/me/playlists')
    .catch((err) => {
        console.error(err);
        throw err;
    });

    return response.data;
}