define(function(){
    var zip = function() {
        // Remove any arguments that aren't array like
            var args = [].filter.call(arguments, function(a){
            return "length" in a;
        });
        // Get the shortest length
        var length = Math.min.apply(
            null,
            args.map(function(a){
                return a.length;
            })
        );
        var result = [];
        var arrayAt = function(i) {
            return function(arr) {
                return arr[i];
            };
        };
        for(var i = 0; i < length; i++) {
            result.push(args.map(arrayAt(i)));
        }
        return result;
    };
    return {
        'zip': zip,
        'unzip': function unzip(a){
            return zip.apply(null, a);
        }
    };
});