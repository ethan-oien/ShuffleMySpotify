import axios from 'axios';

async function get_track_list()
{
    const response = await axios.get('/api/tracks')
    .catch((err) => {
        console.log(err);
        throw err;
    });

    return response.data;
}

export {
    get_track_list
}