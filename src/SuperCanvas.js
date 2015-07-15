(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['Path', 'Matrix'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('Path'), require('Matrix'));
    } else {
        root.SuperCanvas = factory(root.Path, root.Matrix);
    }

})(this, function(Path, Matrix){
    var SuperCanvas = function(canvas) {
        if(canvas && canvas.getContext) {
            this.context = canvas.getContext('2d');
        } else {

        }
    };
    SuperCanvas.fn = {
        smoothBezierCurveTo: function(cp0x, cp0y, x, y) {
            return this;
        },
        smoothQuadraticCurveTo: function(x, y) {
            return this;
        },
        drawPath: function(d) {
            var ctx = this.context;
            ctx.beginPath();
            SuperCanvas.Path.each(d, function(segment) {
                var command = segment.shift();
                switch(command) {
                    case "M":
                        ctx.moveTo.apply(ctx, segment);
                    break;
                    case "L":
                        ctx.lineTo.apply(ctx, segment);
                    break;
                    case "C":
                        ctx.bezierCurveTo.apply(ctx, segment);
                    break;
                    case "Q":
                        ctx.quadraticCurveTo.apply(ctx, segment);
                    break;
                    case "Z":
                        ctx.closePath();
                    break;
                }
            }, this);
        },
    };

    //Autocreate functions
    [
        'lineTo', 'moveTo',
        'bezierCurveTo', 'quadraticCurveTo'
    ].forEach(function(cmd) {
        SuperCanvas.fn[cmd] = function() {
            this.lastCommand = [].slice.call(arguments);
            this.context[cmd].apply(this.context, arguments);
            return this;
        };
    });


    SuperCanvas.prototype = SuperCanvas.fn;

    var Path = function(d, transform) {   
    };

    Path.fn = {

    };
    Path.prototype = Path.fn;

    SuperCanvas.Path = Path;

    return SuperCanvas;
});