const shuffle_methods = [
    {
        name: "Track",
        description: "by track name",
        func: track
    },
    {
        name: "Artist",
        description: "by main artist name",
        func: artist
    },
    {
        name: "Album",
        description: "by album name",
        func: album
    },
    {
        name: "Genre",
        description: "by main artist's main genre name",
        func: genre
    },
    {
        name: "Track Number",
        description: "by track number on album",
        func: track_number
    },
    {
        name: "Disc Number",
        description: "by disc number on album",
        func: disc_number
    },
    {
        name: "Album Type",
        description: "by album type (single, compilation, etc)",
        func: album_type
    },
    {
        name: "Album Tracks",
        description: "by total tracks on album",
        func: album_tracks
    },
    {
        name: "Release Date",
        description: "by release date of album",
        func: release_date
    },
    {
        name: "Duration",
        description: "by track duration",
        func: duration
    },
    {
        name: "Popularity",
        description: "by track popularity",
        func: popularity
    },
    {
        name: "Artist Popularity",
        description: "by main artist popularity",
        func: artist_popularity
    },
    {
        name: "Track Locality",
        description: "by whether or not track is local",
        func: is_local
    },
    {
        name: "Spotify ID",
        description: "by track ID on Spotify",
        func: id 
    }
]

function track(collat) {
    return (a,b) => {
        const new_a = a.name;
        const new_b = b.name;

        return collat.compare(new_a, new_b);
    }
}

function artist(collat) {
    return (a,b) => {
        const new_a = a.artists[0].name;
        const new_b = b.artists[0].name;

        return collat.compare(new_a, new_b);
    }
}

function album(collat) {
    return (a,b) => {
        const new_a = a.album.name;
        const new_b = b.album.name;

        return collat.compare(new_a, new_b);
    }
}

function genre(collat) {
    return (a,b) => {
        const new_a = a.artists[0].genres[0];
        const new_b = b.artists[0].genres[0];

        return collat.compare(new_a, new_b);
    }
}

function track_number() {
    return (a,b) => {
        const new_a = a.track_number;
        const new_b = b.track_number;

        return new_a - new_b;
    }
}

function disc_number() {
    return (a,b) => {
        const new_a = a.disc_number;
        const new_b = b.disc_number;

        return new_a - new_b;
    }
}

function album_type(collat) {
    return (a,b) => {
        const new_a = a.album.album_type;
        const new_b = b.album.album_type;

        return collat.compare(new_a, new_b);
    }
}

function album_tracks(collat) {
    return (a,b) => {
        const new_a = a.album.total_tracks;
        const new_b = b.album.total_tracks;

        return collat.compare(new_a, new_b);
    }
}

function release_date() {
    return (a,b) => {
        const new_a = a.album.release_date;
        const new_b = b.album.release_date;

        const parsed_a = new Date().parse(new_a + 'Z');
        const parsed_b = new Date().parse(new_b + 'Z');

        if(parsed_a < parsed_b) return -1;
        if(parsed_a > parsed_b) return 1;
        return 0;
    }
}

function duration() {
    return (a,b) => {
        const new_a = a.duration_ms;
        const new_b = b.duration_ms;

        return new_a - new_b;
    }
}

function popularity() {
    return (a,b) => {
        const new_a = a.popularity;
        const new_b = b.popularity;

        return new_a - new_b;
    }
}

function artist_popularity() {
    return (a,b) => {
        const new_a = a.artists[0].popularity;
        const new_b = b.artists[0].popularity;

        return new_a - new_b;
    }
}

function is_local(collat) {
    return (a,b) => {
        const new_a = a.is_local;
        const new_b = b.is_local;

        if(new_a && !new_b) return -1;
        if(!new_a && new_b) return 1;
        return 0;
    }
}

function id(collat) {
    return (a,b) => {
        const new_a = a.id;
        const new_b = b.id;

        return collat.compare(new_a, new_b);
    }
}

module.exports = shuffle_methods;