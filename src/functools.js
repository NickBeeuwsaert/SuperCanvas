export function zip(...args) {
    // Remove any arguments that aren't array like
    var args = args.filter(a => "length" in a);
    // Get the shortest length
    var length = Math.min(...args.map(a => a.length));
    var result = [];
    var arrayAt = i => arr => arr[i];

    for(var i = 0; i < length; i++) {
        result.push(args.map(arrayAt(i)));
    }
    return result;
}

export const unzip = a => zip(...a);