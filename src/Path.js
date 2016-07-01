import {zip, unzip} from "./functools";
const {pow, cos, sin} = Math;
const lerp = (s, e, t) => s + (e - s) * t;

function makeAbsolute(segment, x, y) {
    let command = segment.shift();

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
}

function removeShorthand(segment, lastSegment, x, y) {
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
}

export class Path {
    static pathLengths = {
        'L': 2,
        'M': 2,
        'C': 6,
        'S': 4,
        'Q': 4,
        'T': 2,
        'A': 7,
        'V': 1,
        'H': 1,
    };

    constructor(d) {
        this.length = 0;
    
        //Skip parsing if d is falsey
        if(!d) return;
        Path.each(d, function(segment) {
            this.push(segment);
        }, this);
    }

    push(segment) {
        this[this.length++] = segment;
    }

    moveTo(x, y) {
        this.push(["M", x, y]);
        return this;
    }

    lineTo(x, y) {
        this.push(["L", x, y]);
        return this;
    }

    bezierCurveTo(cp0x, cp0y, cp1x, cp1y, x, y) {
        this.push(["C", cp0x, cp0y, cp1x, cp1y, x, y]);
        return this;
    }

    smoothBezierCurveTo(cp1x, cp1y, x, y) {
        this.push(["S", cp1x, cp1y, x, y]);
        return this;
    }

    quadraticCurveTo(cp0x, cp0y, x, y) {
        this.push(["Q", cp0x, cp0y, x, y]);
        return this;
    }

    smoothQuadraticCurveTo(x, y) {
        this.push(["T", x, y]);
        return this;
    }

    closePath() {
        this.push(["Z"]);
        return this;
    }

    getExtents() {
        return Path.getExtents(this);
    }

    toString() {
        var path = [];
        for(let i = 0; i < this.length; i++) {
            path.push(this[i][0] + this[i].slice(1).join(','));
        }
        return path.join('');
        /*return this.map(function(segment) {
            var command = segment.shift();
            return command + segment.join(',');
        }).join('');*/
    }

    map(fn, thisArg=null) {
        return Path.map(this, fn, thisArg);
    }

    static parsePath(d) {
        d = d.replace(/([mlhvcqtzsa])/ig, " $1 ");
        let splitPath = d.match(/([mlhvcqtzsa][^mlhvcqtzsa]*)/ig),
            pathArr = [], path = [], i = 0, j = 0;

        for(i = 0; i !== splitPath.length; i++){
            let command = splitPath[i].match(/([\-]?(0|[1-9]\d*)(\.\d*)?([eE][+\-]?\d+)?|[mlhvcqtzsa]+)/ig);
            pathArr.push(command);
        }

        for(i = 0; i < pathArr.length; i++) {
            let segment = pathArr[i],
                command = segment.shift(), l;

            segment = segment.map(parseFloat);

            if(command.toUpperCase() === 'Z') {
                path.push(['Z']);
                continue;
            }

            l = Path.pathLengths[command.toUpperCase()];

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
    }

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
    static commandIsRelative(command) {
        return command[0].toLowerCase() === command;
    }

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
    static breakApartPath() {}

    static getExtents(path) {
        if (typeof path === 'string') path = Path.parsePath(path);

        let v = [], //vertical
            h = []; // horizontal

        Path.each(path, function(segment, x, y) {
            let command = segment.shift(),
                extents;

            switch(command) {
                case 'M':
                    h.push(segment[0]);
                    v.push(segment[1]);
                break;
                case 'L':
                    h.push(segment[0]);
                    v.push(segment[1]);
                break;
                case 'Q':
                    h.push(...Path.quadraticBezierExtents(x, segment[0], segment[2]));
                    v.push(...Path.quadraticBezierExtents(y, segment[1], segment[3]));
                break;
                case 'C':
                    h.push(...Path.cubicBezierExtents(x, segment[0], segment[2], segment[4]));
                    v.push(...Path.cubicBezierExtents(y, segment[1], segment[3], segment[5]));
                break;
            }
        });

        return {
            'top': Math.min(...v),
            'bottom': Math.max(...v),

            'left': Math.min(...h),
            'right': Math.max(...h)
        };
    }


    static each(path, fn=segment=>segment, thisArg=null) {
        if (typeof path === "string") {
            path = Path.parsePath(path);
        }

        let x, y;
        let i, j, lastSegment;

        // This assumes the first command is a move to
        lastSegment = path[0].slice(0);
        lastSegment[0] = lastSegment[0].toUpperCase();
        x = lastSegment[lastSegment.length - 2];
        y = lastSegment[lastSegment.length - 1];
        
        fn.call(thisArg, lastSegment, x, y);

        let subPathStart = [x, y];


        for(i = 1; i < path.length; i++) {
            var segment = path[i].slice(0);
            //Remove relative commands...
            segment = makeAbsolute(segment, x, y);

            //Remove shorthand...
            segment = removeShorthand(segment, lastSegment, x, y);

            fn.call(thisArg, segment.slice(0), x, y);

            switch(segment[0]) {
                case 'Z':
                    [x, y] = subPathStart;
                break;
                case 'M':
                    subPathStart = segment.slice(-2);
                default:
                    [x, y] = segment.slice(-2);
                break;
            }

            lastSegment = segment;
        }
    }

    static map(path, fn, thisArg) {
        let results = [];
        Path.each(path, function() {
            results.push(fn.apply(this, arguments));
        }, thisArg);
        return results;
    }


    static cubicBezierCurve(P0, P1, P2, P3, t) {
        return Math.pow(1-t, 3) * P0 +
                3 * Math.pow(1-t, 2) * t * P1 +
                3 * (1-t) * t * t * P2 +
                t * t * t * P3;
    }

    static quadraticBezierCurve(P0, P1, P2, t) {
        return Math.pow(1-t, 2) * P0 + 2 * (1-t) * t * P1 + t * t * P2;
    }

    static cubicBezierCurveDerivative(P0, P1, P2, P3, t) {
        return 3 * Math.pow(t, 2) * (P3 - 3 * P2 + 3 * P1 - P0) + 
               6 * t * (P2 - 2 * P1 + P0 ) + 
               3 * (P1 - P0);
    }

    static quadraticBezierCurveDerivative(P0, P1, P2, t) {
        return -2 * P0 * (1-t) + 2 * P1 * (1-2 * t) + 2 * t * P2;
    }

    static cubicBezierCurveZeroes(P0, P1, P2, P3) {
        let a = 3*(P3-3*P2+3*P1-P0),
            b = 6*(P2-2*P1+P0),
            c = 3*(P1-P0);

        if(Math.abs(a) < Number.EPSILON) {
            //If a is zero, the equation becomes:
            // 0 = bx + c
            // -c = bx
            // -c / b = x
            return [-c / b, -c / b];
        }

        return [
            (-b + Math.sqrt(Math.pow(b,2) - 4*a*c))/(2*a),
            (-b - Math.sqrt(Math.pow(b,2) - 4*a*c))/(2*a)
        ];
    }

    static quadraticBezierCurveZeroes(P0, P1, P2) {
        return (P0 - P1) / (P0 - 2*P1 + P2);
    }

    static cubicBezierExtents = function cubicBezierExtents(P0, P1, P2, P3) {
        let points = [P0, P3],
            t = Path.cubicBezierCurveZeroes(P0, P1, P2, P3);

        if(0 < t[0] && t[0] < 1)
            points.push(Path.cubicBezierCurve(P0, P1, P2, P3, t[0]));
        if(0 < t[1] && t[1] < 1)
            points.push(Path.cubicBezierCurve(P0, P1, P2, P3, t[1]));

        return [Math.min(...points), Math.max(...points)];
    }

    static quadraticBezierExtents(P0, P1, P2) {
        let points = [P0, P2],
            t = Path.quadraticBezierCurveZeroes(P0, P1, P2);

        if(0 < t && t < 1)
            points.push(Path.quadraticBezierCurve(P0, P1, P2, t));

        return [Math.min(...points), Math.max(...points)];
    }

    static divideCubicBezierCurve(P0, P1, P2, P3, t) {
        let P10 = lerp(P0, P1, t),
            P11 = lerp(P1, P2, t),
            P12 = lerp(P2, P3, t);

        let P20 = lerp(P10, P11, t),
            P21 = lerp(P11, P12, t);

        let P30 = lerp(P20, P21, t);

        return [
            [P0, P10, P20, P30],
            [P30, P21, P12, P3]
        ];
    }

    static divideQuadraticBezierCurve(P0, P1, P2, t) {
        let P10 = lerp(P0, P1, t),
            P11 = lerp(P1, P2, t);

        let P20 = lerp(P10, P11, t);

        return [
            [P0, P10, P20],
            [P20, P11, P2]
        ];
    }

    static convertQuadraticCurveToCubic(P0, P1, P2) {
        return [P0, lerp(P0, P1, 2/3.), lerp(P1, P2, 1/3.), P2];
    }
}



//These functions are used in the ellipitcal arc function
const norm = (l, r) => l + Math.pow(r, 2);

function getAngle(u, v) {
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
Path.ellipticalArcInfo = function ellipticalArcInfo(rx, ry, theta, fA, fS, x0, y0, x1, y1) {
    //Convert theta to radians so we can use it
    theta *= Math.PI / 180;
    theta %= Math.PI*2;

    let mx = (x0 - x1) / 2,
        my = (y0 - y1) / 2,
        Mx = (x0 + x1) / 2,
        My = (y0 + y1) / 2;

    let x0p =  Math.cos(theta) * mx + Math.sin(theta)*my,
        y0p = -Math.sin(theta) * mx + Math.cos(theta)*my;

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    let D = Math.pow(x0p,2) / Math.pow(rx,2) + 
            Math.pow(y0p,2) / Math.pow(ry,2);
    if (D > 1) {
        rx *= Math.sqrt(D);
        ry *= Math.sqrt(D);
    }

    let c = Math.sqrt(
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

    let cxp = c,
        cyp = c;

    cxp *= (rx * y0p) / ry;
    cyp *= -(ry * x0p) / rx;

    let cx = Math.cos(theta)*cxp - Math.sin(theta)*cyp;
    let cy = Math.sin(theta)*cxp + Math.cos(theta)*cyp;
    cx += Mx;
    cy += My;

    let theta1 = getAngle([1, 0], [(x0p-cxp)/rx,(y0p-cyp)/ry]);
    let Dtheta = getAngle([
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

    let theta2 = Dtheta + theta1;

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


