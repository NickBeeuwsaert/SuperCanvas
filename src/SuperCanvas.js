define(['./Path.js', './Matrix.js'], function(Path, Matrix) {
    var SuperCanvas = function(canvas) {
        if(!canvas) {
            throw new Error("Need an argument");
        }

        if(canvas.canvas) { //We got a context instance
            canvas = canvas.canvas;
        }

        if(!canvas.getContext) {
            throw new Error("Can't get canvas context");
        }

        this.context = canvas.getContext('2d');
        this.canvas  = canvas;
    };

    SuperCanvas.fn = {
        setFill: function(fill) {
            this.context.fillStyle = fill;
        },
        setStroke: function(stroke) {
            this.context.strokeStyle = stroke;
        },
        setLineWidth: function(width) {
            this.context.lineWidth = width;
        },
        drawPath: function(d, transform) {
            //var ctx = this.context;
            var t = this;
            t.beginPath();
            SuperCanvas.Path.each(d, function(segment) {
                var command = segment.shift();
                switch(command) {
                    case "M":
                        t.moveTo.apply(t, segment);
                    break;
                    case "L":
                        t.lineTo.apply(t, segment);
                    break;
                    case "C":
                        t.bezierCurveTo.apply(t, segment);
                    break;
                    case "Q":
                        t.quadraticCurveTo.apply(t, segment);
                    break;
                    case "Z":
                        t.closePath();
                    break;
                }
            }, this);
        },
    };

    //Autocreate functions
    [
        'beginPath',
        'closePath',
        'lineTo',
        'moveTo',
        'bezierCurveTo',
        'quadraticCurveTo',
        'translate',
        'rotate',
        'scale',
        'save',
        'restore',
        'fillText',
        'stroke',
        'fill'
    ].forEach(function(cmd) {
        SuperCanvas.fn[cmd] = function() {
            //this.lastCommand = [].slice.call(arguments);
            this.context[cmd].apply(this.context, arguments);
            return this;
        };
    });


    SuperCanvas.prototype = SuperCanvas.fn;

    SuperCanvas.Path = Path;
    SuperCanvas.Matrix = Matrix;

    return SuperCanvas;
});
