const shuffle_methods = [
    {
        name: "Track",
        description: "by track",
        func: track
    },
    {
        name: "Artist",
        description: "by artist",
        func: artist
    },
    {
        name: "Album",
        description: "by album",
        func: album
    }
]

function create_collator(locale=null) {
    let comp;
    if(locale) {
        comp = new Intl.Collator(locale);
    } else {
        comp = new Intl.Collator();
    }
    return comp;
}

function track(locale=null) {
    const comp = create_collator(locale);

    return (a,b) => {
        const new_a = a.name;
        const new_b = b.name;

        return comp.compare(new_a, new_b);
    }
}

function artist(locale=null) {
    const comp = create_collator(locale);

    return (a,b) => {
        const new_a = a.artists[0].name;
        const new_b = b.artists[0].name;

        return comp.compare(new_a, new_b);
    }
}

function album(locale=null) {
    const comp = create_collator(locale);

    return (a,b) => {
        const new_a = a.album.name;
        const new_b = b.album.name;

        return comp.compare(new_a, new_b);
    }
}


function get_shuffle_methods() {
    return shuffle_methods.map((method) => {
        return {
            name: method.name,
            description: method.description
        };
    })
}

async function organize(tracks, method_index, locale=null) {
    const ret = [...tracks];

    ret.sort(shuffle_methods[method_index].func(locale));

    return ret;
}

module.exports = {
    get_shuffle_methods,
    organize
}