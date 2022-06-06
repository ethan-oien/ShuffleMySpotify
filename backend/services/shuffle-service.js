const shuffle_methods = require('./shuffle-methods');

function custom_compare(collat, method_indexes, cur_index=0) {
    return (a, b) => {
        if(cur_index === method_indexes.length) return 0;
        
        let index = method_indexes[cur_index];
        let reverse = 1;
        if(index < 0) {
            reverse = -1;
            index *= -1;
        }

        const ret = shuffle_methods[index].func(collat)(a,b) * reverse;

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

async function organize(tracks, method_indexes, locale=undefined) {
    const ret = [...tracks];

    const collat = new Intl.Collator(locale);
    const compare = custom_compare(collat, method_indexes);

    if(!compare) throw 'No methods passed!';

    ret.sort(compare);

    return ret;
}

module.exports = {
    get_shuffle_methods,
    organize
}