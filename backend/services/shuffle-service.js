const shuffle_methods = require('./shuffle-methods');

function custom_compare(collat, method_indexes, cur_index=0) {
    return (a, b) => {
        if(cur_index === method_indexes.length) return 0;
        
        let method = method_indexes[cur_index].method;
        let reverse = 1;
        if(method_indexes[cur_index].reversed) reverse = -1;

        const ret = shuffle_methods[method].func(collat)(a,b) * reverse;

        if(ret === 0) {
            return custom_compare(collat, method_indexes, cur_index+1)(a,b);
        }

        return ret;
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

async function organize(tracks, method_indexes, locales=undefined) {
    const ret = [...tracks];

    collat = new Intl.Collator(locales);

    const compare = custom_compare(collat, method_indexes);

    if(!compare) throw 'No methods passed!';

    ret.sort(compare);

    return ret;
}

async function shuffle(tracks) {
    //Fisher–Yates shuffle
    const ret = [...tracks];

    let m = ret.length, i, tmp;
    
    while (m) {
        i = Math.floor(Math.random() * m);
        m--;
    
        tmp = ret[m];
        ret[m] = ret[i];
        ret[i] = tmp;
    }
    
    return ret;
}

module.exports = {
    get_shuffle_methods,
    organize,
    shuffle
}