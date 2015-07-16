var Path = {};

Path.pathLengths = {
    'L': 2,
    'M': 2,
    'C': 6,
    'S': 4,
    'Q': 4,
    'T': 2,
    'A': 7,
    'V': 1,
    'H': 1
};

Path.parsePath = function(d){
    d = d.replace(/([mlhvcqtzsa])/ig, " $1 ");
    var splitPath = d.match(/([mlhvcqtzsa][^mlhvcqtzsa]*)/ig),
        pathArr = [], i = 0, j = 0;
    for(i = 0; i !== splitPath.length; i++){
        command = splitPath[i].match(/([\-]?(0|[1-9]\d*)(\.\d*)?([eE][+\-]?\d+)?|[mlhvcqtzsa]+)/ig);
        pathArr.push(command);
    }
    //return pathArr;
    var path = [];
    for(i = 0; i < pathArr.length; i++) {
        var segment = pathArr[i];
        var command = segment.shift();
        segment = segment.map(parseFloat);

        var l = Path.pathLengths[command.toUpperCase()];

        for (j = 0; j < segment.length; j += l) {
            var s = segment.slice(j, j+l);
            s.unshift(command);
            path.push(s);

            if(command.toUpperCase() == 'M') {
                command = command=='M'?'L':'l';
            }
        }
    }

    return path;
};

/**
 * Checks to see if a command is relative or absolute
 * Abusing some JS here so you can either pass in just the command
 * or a command set
 * e.g.
 *   ["M", 0, 0][0] => "M"
 *   "M"[0]         => "M"
 *
 * @param command the command to check
 * @return Boolean
 */
Path.commandIsRelative = function(command) {
    return command[0].toLowerCase() === command;
};

/**
 * Breaks apart subpaths
 * "M10,10 10,50 50,50zM100,100 0,0 100,0"
 * Should result in:
 * [
 *     [
 *         ["M", 10, 10],
 *         ["L", 10, 50],
 *         ["L", 50, 50],
 *         ["z"]
 *     ],
 *     [
 *         ["M", 100, 100],
 *         ["L", 0, 0],
 *         ["L", 100, 0]
 *     ]
 * ]
 * 
 * Up for debate: Whether or not this format should
 * Be the default for ParsePath
 * It's a lot harder to write paths like this by hand...
 */
Path.breakApartPath = function() {
};

Path.getExtents = function(path) {
    if (typeof path === "string") {
        path = Path.parsePath(path);
    }

    var v = [], //vertical
        h = []; // horizontal

    Path.each(path, function(segment, x, y) {
        var command = segment.shift();
        var extents;
        switch(command) {
            case "M":
                h.push(segment[0]);
                v.push(segment[1]);
            break;
            case "L":
                h.push(segment[0]);
                v.push(segment[1]);
            break;
            case "Q":
                extents = Path.quadraticBezierExtents(x, segment[0], segment[2]);
                Array.prototype.push.apply(h, extents);

                extents = Path.quadraticBezierExtents(y, segment[1], segment[3]);
                Array.prototype.push.apply(v, extents);
            break;
            case "C":
                extents = Path.cubicBezierExtents(x, segment[0], segment[2], segment[4]);
                Array.prototype.push.apply(h, extents);

                extents = Path.cubicBezierExtents(y, segment[1], segment[3], segment[5]);
                Array.prototype.push.apply(v, extents);
            break;
        }
    });

    return {
        "top": Math.min.apply(null, v),
        "bottom": Math.max.apply(null, v),

        "left": Math.min.apply(null, h),
        "right": Math.max.apply(null, h)
    };
};

/**
 * just used for building up an array
 */
Path.normalizeCallback = function(segment) {
    return segment;
};

Path.makeAbsolute = function(segment, x, y) {
    var command = segment.shift();
    if(Path.commandIsRelative(command)) {
        switch(command) {
            case 'h':
            case 'v':
                segment[0] += command=='h'?x:y;
            break;
            case 'a':
                segment[segment.length-2] += x;
                segment[segment.length-1] += y;
            break;
            default:
                segment = segment.map(function(e, i) {
                return e + (i%2===0?x:y);
            });
            break;
        }
        command = command.toUpperCase();
    }
    segment.unshift(command);
    return segment;
};

Path.removeShorthand = function(segment, lastSegment, x, y) {
    var command = segment.shift();
    if (['H', 'V', 'T', 'S'].indexOf(command) !== -1) {
        switch(command) {
            case 'H':
                command = 'L';
                segment.push(y);
            break;
            case 'V':
                command = 'L';
                segment.unshift(x);
            break;
            case 'T': // Quadratic Shorthand
            case 'S': // Cubic Shorthand
                var cpx = x,
                    cpy = y;
                if(['Q', 'C'].indexOf(lastSegment[0]) !== -1) {
                    cpx = lastSegment[lastSegment.length-4];
                    cpy = lastSegment[lastSegment.length-3];
                }
                segment.unshift(x - cpx + x, y - cpy + y);
                command = command=='T'?'Q':'C';
            break;
        }
    }
    segment.unshift(command);
    return segment;
};

Path.each = function(path, fn, thisArg) {
    if (typeof path === "string") {
        path = Path.parsePath(path);
    }
    fn = fn || Path.normalizeCallback;
    var result = [];

    var x, y;
    var i, j, lastSegment;

    // This assumes the first command is a move to
    lastSegment = path[0].slice(0);
    lastSegment[0] = lastSegment[0].toUpperCase();
    x = lastSegment[lastSegment.length - 2];
    y = lastSegment[lastSegment.length - 1];
    
    result.push(fn.call(thisArg, lastSegment, x, y) || segment);

    for(i = 1; i < path.length; i++) {
        var segment = path[i].slice(0);
        //Remove relative commands...
        segment = Path.makeAbsolute(segment, x, y);

        //Remove shorthand...
        segment = Path.removeShorthand(segment, lastSegment, x, y);

        result.push(fn.call(thisArg, segment, x, y));

        if(segment[0] == 'Z') {
            x = y = 0;
        }else{
            x = segment[segment.length - 2];
            y = segment[segment.length - 1];
        }

        lastSegment = segment;
    }
    return result;
};

Path.cubicBezierCurve = function(P0, P1, P2, P3, t) {
    return Math.pow(1-t, 3) * P0 +
            3 * Math.pow(1-t, 2) * t * P1 +
            3 * (1-t) * t * t * P2 +
            t * t * t * P3;
};

Path.cubicBezierCurveDerivative = function(P0, P1, P2, P3, t) {
    return 3 * Math.pow(t, 2) * (P3 - 3 * P2 + 3 * P1 - P0) + 
           6 * t * (P2 - 2 * P1 + P0 ) + 
           3 * (P1 - P0);
};

Path.cubicBezierCurveZeroes = function(P0, P1, P2, P3) {
    var a = 3*(P3-3*P2+3*P1-P0);
    var b = 6*(P2-2*P1+P0);
    var c = 3*(P1-P0);

    if(a === 0) {
        //If a is zero, the equation becomes:
        // 0 = bx + c
        // -c = bx
        // -c / b = x
        return [-c / b, -c / b];
    }

    var t0 = (-b + Math.sqrt(Math.pow(b,2) - 4*a*c))/(2*a);
    var t1 = (-b - Math.sqrt(Math.pow(b,2) - 4*a*c))/(2*a);
    return [t0, t1];
};
Path.cubicBezierExtents = function(P0, P1, P2, P3) {
    var points = [P0, P3];

    var t = Path.cubicBezierCurveZeroes(P0, P1, P2, P3);

    if(0 < t[0] && t[0] < 1)
        points.push(Path.cubicBezierCurve(P0, P1, P2, P3, t[0]));
    if(0 < t[1] && t[1] < 1)
        points.push(Path.cubicBezierCurve(P0, P1, P2, P3, t[1]));

    return [Math.min.apply(null, points), Math.max.apply(null, points)];
};

Path.quadraticBezierCurve = function(P0, P1, P2, t) {
    return Math.pow(1-t, 2) * P0 + 2 * (1-t) * t * P1 + t * t * P2;
};

Path.quadraticBezierCurveDerivative = function(P0, P1, P2, t) {
    return -2 * P0 * (1-t) + 2 * P1 * (1-2 * t) + 2 * t * P2;
};

Path.quadraticBezierCurveZeroes = function(P0, P1, P2) {
    return (P0 - P1) / (P0 - 2*P1 + P2);
};

Path.quadraticBezierExtents = function(P0, P1, P2) {
    var points = [P0, P2];
    var t = Path.quadraticBezierCurveZeroes(P0, P1, P2);
    if(0 < t && t < 1)
        points.push(Path.quadraticBezierCurve(P0, P1, P2, t));
    return [Math.min.apply(null, points), Math.max.apply(null, points)];
};

//These functions are used in the ellipitcal arc function
var norm = function(l, r) {
    return l + Math.pow(r, 2);
};
var getAngle = function(u, v) {
    var sign  = u[0] * v[1] - u[1]*v[0] < 0 ? -1: 1;
    var toBe  = u[0]*v[0] + u[1]*v[1];
    var orNot = Math.sqrt(u.reduce(norm))*Math.sqrt(v.reduce(norm));

    var r = toBe / orNot;

    //correct for floating point errors
    // stuff like 1.000000009 and all that
    r = Math.max(0, Math.min(1, r));

    return sign * Math.acos(r);
};

/**
 * Implemented according to: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
 */
Path.ellipticalArcInfo = function(rx, ry, theta, fA, fS, x0, y0, x1, y1) {
    //Convert theta to radians so we can use it
    theta *= Math.PI / 180;
    theta %= Math.PI*2;

    var mx = (x0 - x1) / 2,
        my = (y0 - y1) / 2,
        Mx = (x0 + x1) / 2,
        My = (y0 + y1) / 2;

    var x0p =  Math.cos(theta) * mx + Math.sin(theta)*my,
        y0p = -Math.sin(theta) * mx + Math.cos(theta)*my;

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    var D = Math.pow(x0p,2) / Math.pow(rx,2) + 
            Math.pow(y0p,2) / Math.pow(ry,2);
    if (D > 1) {
        rx *= Math.sqrt(D);
        ry *= Math.sqrt(D);
    }

    var c = Math.sqrt(
        Math.abs((
            Math.pow(rx,2)*Math.pow(ry, 2) - 
            Math.pow(rx,2)*Math.pow(y0p,2) - 
            Math.pow(ry,2)*Math.pow(x0p,2)
        )/(
            Math.pow(rx,2)*Math.pow(y0p,2) + 
            Math.pow(ry,2)*Math.pow(x0p,2)
        )
    ));

    if(fS == fA) {
        c = -c;
    }

    var cxp = c,
        cyp = c;

    cxp *= (rx * y0p) / ry;
    cyp *= -(ry * x0p) / rx;

    var cx = Math.cos(theta)*cxp - Math.sin(theta)*cyp;
    var cy = Math.sin(theta)*cxp + Math.cos(theta)*cyp;
    cx += Mx;
    cy += My;

    var theta1 = getAngle([1, 0], [(x0p-cxp)/rx,(y0p-cyp)/ry]);
    var Dtheta = getAngle([
        (x0p-cxp)/rx,
        (y0p-cyp)/ry
    ],
    [
        (-x0p-cxp)/rx,
        (-y0p-cyp)/ry
    ])%(Math.PI*2);

    if (fS === 0 && Dtheta > 0) {
        Dtheta -= Math.PI*2;
    } else if(fS == 1 && Dtheta < 0) {
        Dtheta += Math.PI*2;
    }

    var theta2 = Dtheta + theta1;

    //This should be a object,
    // but I expect this will be used with ES6, where you can do
    // var [s, e, rx, ry, l,r,w,h] = getEllipticalInfo(...)
    return [
        theta1, // start angle
        Dtheta, // stop angel
        rx, ry, // corrected radii
        NaN, NaN, NaN, NaN // bounding box (Not implemented)
    ];

};

SuperCanvas.Path = Path;
