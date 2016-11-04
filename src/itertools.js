export function zip() {
    // Remove any arguments that aren't array like
    let args = [],
        len = arguments.length,
        result = [], length;
    while(len--) {
        if('length' in arguments[len]) {
            args[len] = arguments[len];
        }
    }
    if(!args.length) return result;

    // get the shortest length
    length = args.reduce((m, {length}) => Math.min(length, m));

    var arrayAt = i => arr => arr[i];

    for(var i = 0; i < length; i++) {
        result.push(args.map(arrayAt(i)));
    }
    return result;
}

export const unzip = a => zip(...a);