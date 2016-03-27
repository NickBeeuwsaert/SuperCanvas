(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Path"] = factory();
	else
		root["Path"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Path = undefined;

	var _functools = __webpack_require__(3);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _Math = Math;
	var pow = _Math.pow;
	var cos = _Math.cos;
	var sin = _Math.sin;

	var Path = exports.Path = function () {
	    function Path(d) {
	        _classCallCheck(this, Path);

	        this.length = 0;

	        //Skip parsing if d is falsey
	        if (!d) return;
	        Path.each(d, function (segment) {
	            this.push(segment);
	        }, this);
	    }

	    _createClass(Path, [{
	        key: "push",
	        value: function push(segment) {
	            this[this.length++] = segment;
	        }
	    }, {
	        key: "moveTo",
	        value: function moveTo(x, y) {
	            this.push(["M", x, y]);
	            return this;
	        }
	    }, {
	        key: "lineTo",
	        value: function lineTo(x, y) {
	            this.push(["L", x, y]);
	            return this;
	        }
	    }, {
	        key: "bezierCurveTo",
	        value: function bezierCurveTo(cp0x, cp0y, cp1x, cp1y, x, y) {
	            this.push(["C", cp0x, cp0y, cp1x, cp1y, x, y]);
	            return this;
	        }
	    }, {
	        key: "smoothBezierCurveTo",
	        value: function smoothBezierCurveTo(cp1x, cp1y, x, y) {
	            this.push(["S", cp1x, cp1y, x, y]);
	            return this;
	        }
	    }, {
	        key: "quadraticCurveTo",
	        value: function quadraticCurveTo(cp0x, cp0y, x, y) {
	            this.push(["Q", cp0x, cp0y, x, y]);
	            return this;
	        }
	    }, {
	        key: "smoothQuadraticCurveTo",
	        value: function smoothQuadraticCurveTo(x, y) {
	            this.push(["T", x, y]);
	            return this;
	        }
	    }, {
	        key: "closePath",
	        value: function closePath() {
	            this.push(["Z"]);
	            return this;
	        }
	    }, {
	        key: "getExtents",
	        value: function getExtents() {
	            return Path.getExtents(this);
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            var path = [];
	            for (var i = 0; i < this.length; i++) {
	                path.push(this[i][0] + this[i].slice(1).join(','));
	            }
	            return path.join('');
	            /*return this.map(function(segment) {
	                var command = segment.shift();
	                return command + segment.join(',');
	            }).join('');*/
	        }
	    }, {
	        key: "map",
	        value: function map(fn) {
	            var thisArg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	            return Path.map(this, fn, thisArg);
	        }
	    }]);

	    return Path;
	}();

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

	Path.parsePath = function parsePath(d) {
	    d = d.replace(/([mlhvcqtzsa])/ig, " $1 ");
	    var splitPath = d.match(/([mlhvcqtzsa][^mlhvcqtzsa]*)/ig),
	        pathArr = [],
	        i = 0,
	        j = 0;
	    for (i = 0; i !== splitPath.length; i++) {
	        command = splitPath[i].match(/([\-]?(0|[1-9]\d*)(\.\d*)?([eE][+\-]?\d+)?|[mlhvcqtzsa]+)/ig);
	        pathArr.push(command);
	    }
	    //return pathArr;
	    var path = [];
	    for (i = 0; i < pathArr.length; i++) {
	        var segment = pathArr[i];
	        var command = segment.shift();
	        segment = segment.map(parseFloat);

	        if (command.toUpperCase() === 'Z') {
	            path.push(['Z']);
	            continue;
	        }

	        var l = Path.pathLengths[command.toUpperCase()];

	        for (j = 0; j < segment.length; j += l) {
	            var s = segment.slice(j, j + l);
	            s.unshift(command);
	            path.push(s);

	            if (command.toUpperCase() == 'M') {
	                command = command == 'M' ? 'L' : 'l';
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
	Path.commandIsRelative = function commandIsRelative(command) {
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
	Path.breakApartPath = function breakApartPath() {};

	Path.getExtents = function getExtents(path) {
	    var _Math2, _Math3, _Math4, _Math5;

	    if (typeof path === "string") {
	        path = Path.parsePath(path);
	    }

	    var v = [],
	        //vertical
	    h = []; // horizontal

	    Path.each(path, function (segment, x, y) {
	        var command = segment.shift();
	        var extents;
	        switch (command) {
	            case "M":
	                h.push(segment[0]);
	                v.push(segment[1]);
	                break;
	            case "L":
	                h.push(segment[0]);
	                v.push(segment[1]);
	                break;
	            case "Q":
	                h.push.apply(h, _toConsumableArray(Path.quadraticBezierExtents(x, segment[0], segment[2])));
	                v.push.apply(v, _toConsumableArray(Path.quadraticBezierExtents(y, segment[1], segment[3])));
	                break;
	            case "C":
	                h.push.apply(h, _toConsumableArray(Path.cubicBezierExtents(x, segment[0], segment[2], segment[4])));
	                v.push.apply(v, _toConsumableArray(Path.cubicBezierExtents(y, segment[1], segment[3], segment[5])));
	                break;
	        }
	    });

	    return {
	        "top": (_Math2 = Math).min.apply(_Math2, v),
	        "bottom": (_Math3 = Math).max.apply(_Math3, v),

	        "left": (_Math4 = Math).min.apply(_Math4, h),
	        "right": (_Math5 = Math).max.apply(_Math5, h)
	    };
	};

	Path.makeAbsolute = function makeAbsolute(segment, x, y) {
	    var command = segment.shift();
	    if (Path.commandIsRelative(command)) {
	        switch (command) {
	            case 'h':
	            case 'v':
	                segment[0] += command == 'h' ? x : y;
	                break;
	            case 'a':
	                segment[segment.length - 2] += x;
	                segment[segment.length - 1] += y;
	                break;
	            default:
	                segment = segment.map(function (e, i) {
	                    return e + (i % 2 === 0 ? x : y);
	                });
	                break;
	        }
	        command = command.toUpperCase();
	    }
	    segment.unshift(command);
	    return segment;
	};

	Path.removeShorthand = function removeShorthand(segment, lastSegment, x, y) {
	    var command = segment.shift();
	    if (['H', 'V', 'T', 'S'].indexOf(command) !== -1) {
	        switch (command) {
	            case 'H':
	                command = 'L';
	                segment.push(y);
	                break;
	            case 'V':
	                command = 'L';
	                segment.unshift(x);
	                break;
	            case 'T': // Quadratic Shorthand
	            case 'S':
	                // Cubic Shorthand
	                var cpx = x,
	                    cpy = y;
	                if (['Q', 'C'].indexOf(lastSegment[0]) !== -1) {
	                    cpx = lastSegment[lastSegment.length - 4];
	                    cpy = lastSegment[lastSegment.length - 3];
	                }
	                segment.unshift(x - cpx + x, y - cpy + y);
	                command = command == 'T' ? 'Q' : 'C';
	                break;
	        }
	    }
	    segment.unshift(command);
	    return segment;
	};

	Path.each = function each(path) {
	    var fn = arguments.length <= 1 || arguments[1] === undefined ? function (segment) {
	        return segment;
	    } : arguments[1];
	    var thisArg = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	    if (typeof path === "string") {
	        path = Path.parsePath(path);
	    }

	    var x = undefined,
	        y = undefined;
	    var i = undefined,
	        j = undefined,
	        lastSegment = undefined;

	    // This assumes the first command is a move to
	    lastSegment = path[0].slice(0);
	    lastSegment[0] = lastSegment[0].toUpperCase();
	    x = lastSegment[lastSegment.length - 2];
	    y = lastSegment[lastSegment.length - 1];

	    fn.call(thisArg, lastSegment, x, y);

	    var subPathStart = [x, y];

	    for (i = 1; i < path.length; i++) {
	        var segment = path[i].slice(0);
	        //Remove relative commands...
	        segment = Path.makeAbsolute(segment, x, y);

	        //Remove shorthand...
	        segment = Path.removeShorthand(segment, lastSegment, x, y);

	        fn.call(thisArg, segment.slice(0), x, y);

	        switch (segment[0]) {
	            case 'Z':
	                var _subPathStart = subPathStart;

	                var _subPathStart2 = _slicedToArray(_subPathStart, 2);

	                x = _subPathStart2[0];
	                y = _subPathStart2[1];

	                break;
	            case 'M':
	                subPathStart = segment.slice(-2);
	            default:
	                var _segment$slice = segment.slice(-2);

	                var _segment$slice2 = _slicedToArray(_segment$slice, 2);

	                x = _segment$slice2[0];
	                y = _segment$slice2[1];

	                break;
	        }

	        lastSegment = segment;
	    }
	};

	Path.map = function map(path, fn, thisArg) {
	    var results = [];
	    Path.each(path, function () {
	        results.push(fn.apply(this, arguments));
	    }, thisArg);
	    return results;
	};

	Path.cubicBezierCurve = function cubicBezierCurve(P0, P1, P2, P3, t) {
	    return Math.pow(1 - t, 3) * P0 + 3 * Math.pow(1 - t, 2) * t * P1 + 3 * (1 - t) * t * t * P2 + t * t * t * P3;
	};

	Path.cubicBezierCurveDerivative = function cubicBezierCurveDerivative(P0, P1, P2, P3, t) {
	    return 3 * Math.pow(t, 2) * (P3 - 3 * P2 + 3 * P1 - P0) + 6 * t * (P2 - 2 * P1 + P0) + 3 * (P1 - P0);
	};

	Path.cubicBezierCurveZeroes = function cubicBezierCurveZeroes(P0, P1, P2, P3) {
	    var a = 3 * (P3 - 3 * P2 + 3 * P1 - P0);
	    var b = 6 * (P2 - 2 * P1 + P0);
	    var c = 3 * (P1 - P0);

	    if (Math.abs(a) < Number.EPSILON) {
	        //If a is zero, the equation becomes:
	        // 0 = bx + c
	        // -c = bx
	        // -c / b = x
	        return [-c / b, -c / b];
	    }

	    var t0 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
	    var t1 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
	    return [t0, t1];
	};
	Path.cubicBezierExtents = function cubicBezierExtents(P0, P1, P2, P3) {
	    var points = [P0, P3];

	    var t = Path.cubicBezierCurveZeroes(P0, P1, P2, P3);

	    if (0 < t[0] && t[0] < 1) points.push(Path.cubicBezierCurve(P0, P1, P2, P3, t[0]));
	    if (0 < t[1] && t[1] < 1) points.push(Path.cubicBezierCurve(P0, P1, P2, P3, t[1]));

	    return [Math.min.apply(null, points), Math.max.apply(null, points)];
	};

	Path.quadraticBezierCurve = function quadraticBezierCurve(P0, P1, P2, t) {
	    return Math.pow(1 - t, 2) * P0 + 2 * (1 - t) * t * P1 + t * t * P2;
	};

	Path.quadraticBezierCurveDerivative = function quadraticBezierCurveDerivative(P0, P1, P2, t) {
	    return -2 * P0 * (1 - t) + 2 * P1 * (1 - 2 * t) + 2 * t * P2;
	};

	Path.quadraticBezierCurveZeroes = function quadraticBezierCurveZeroes(P0, P1, P2) {
	    return (P0 - P1) / (P0 - 2 * P1 + P2);
	};

	Path.quadraticBezierExtents = function quadraticBezierExtents(P0, P1, P2) {
	    var points = [P0, P2];
	    var t = Path.quadraticBezierCurveZeroes(P0, P1, P2);
	    if (0 < t && t < 1) points.push(Path.quadraticBezierCurve(P0, P1, P2, t));
	    return [Math.min.apply(null, points), Math.max.apply(null, points)];
	};

	var lerp = function lerp(s, e, t) {
	    return s + (e - s) * t;
	};

	Path.divideCubicBezierCurve = function divideCubicBezierCurve(P0, P1, P2, P3, t) {
	    var P10 = lerp(P0, P1, t),
	        P11 = lerp(P1, P2, t),
	        P12 = lerp(P2, P3, t);

	    var P20 = lerp(P10, P11, t),
	        P21 = lerp(P11, P12, t);

	    var P30 = lerp(P20, P21, t);

	    return [[P0, P10, P20, P30], [P30, P21, P12, P3]];
	};

	Path.divideQuadraticBezierCurve = function divideQuadraticBezierCurve(P0, P1, P2, t) {
	    var P10 = lerp(P0, P1, t),
	        P11 = lerp(P1, P2, t);

	    var P20 = lerp(P10, P11, t);

	    return [[P0, P10, P20], [P20, P11, P2]];
	};

	Path.convertQuadraticCurveToCubic = function convertQuadraticCurveToCubic(P0, P1, P2) {
	    return [P0, lerp(P0, P1, 2 / 3.), lerp(P1, P2, 1 / 3.), P2];
	};

	//These functions are used in the ellipitcal arc function
	var norm = function norm(l, r) {
	    return l + Math.pow(r, 2);
	};

	function getAngle(u, v) {
	    var sign = u[0] * v[1] - u[1] * v[0] < 0 ? -1 : 1;
	    var toBe = u[0] * v[0] + u[1] * v[1];
	    var orNot = Math.sqrt(u.reduce(norm)) * Math.sqrt(v.reduce(norm));

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
	    theta %= Math.PI * 2;

	    var mx = (x0 - x1) / 2,
	        my = (y0 - y1) / 2,
	        Mx = (x0 + x1) / 2,
	        My = (y0 + y1) / 2;

	    var x0p = Math.cos(theta) * mx + Math.sin(theta) * my,
	        y0p = -Math.sin(theta) * mx + Math.cos(theta) * my;

	    rx = Math.abs(rx);
	    ry = Math.abs(ry);

	    var D = Math.pow(x0p, 2) / Math.pow(rx, 2) + Math.pow(y0p, 2) / Math.pow(ry, 2);
	    if (D > 1) {
	        rx *= Math.sqrt(D);
	        ry *= Math.sqrt(D);
	    }

	    var c = Math.sqrt(Math.abs((Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(y0p, 2) - Math.pow(ry, 2) * Math.pow(x0p, 2)) / (Math.pow(rx, 2) * Math.pow(y0p, 2) + Math.pow(ry, 2) * Math.pow(x0p, 2))));

	    if (fS == fA) {
	        c = -c;
	    }

	    var cxp = c,
	        cyp = c;

	    cxp *= rx * y0p / ry;
	    cyp *= -(ry * x0p) / rx;

	    var cx = Math.cos(theta) * cxp - Math.sin(theta) * cyp;
	    var cy = Math.sin(theta) * cxp + Math.cos(theta) * cyp;
	    cx += Mx;
	    cy += My;

	    var theta1 = getAngle([1, 0], [(x0p - cxp) / rx, (y0p - cyp) / ry]);
	    var Dtheta = getAngle([(x0p - cxp) / rx, (y0p - cyp) / ry], [(-x0p - cxp) / rx, (-y0p - cyp) / ry]) % (Math.PI * 2);

	    if (fS === 0 && Dtheta > 0) {
	        Dtheta -= Math.PI * 2;
	    } else if (fS == 1 && Dtheta < 0) {
	        Dtheta += Math.PI * 2;
	    }

	    var theta2 = Dtheta + theta1;

	    //This should be a object,
	    // but I expect this will be used with ES6, where you can do
	    // var [s, e, rx, ry, l,r,w,h] = getEllipticalInfo(...)
	    return [theta1, // start angle
	    Dtheta, // stop angel
	    rx, ry, // corrected radii
	    NaN, NaN, NaN, NaN // bounding box (Not implemented)
	    ];
	};

	function quadraticCurveToCubicCurve(x0, y0, x1, y1, x2, y2) {
	    return [x0, y0, lerp(x0, x1, 2 / 3), lerp(y0, y1, 2 / 3), lerp(x1, x2, 1 - 2 / 3), lerp(y1, y2, 1 - 2 / 3), x2, y2];
	};

	function lineToCubicCurve(x0, y0, x1, y1) {
	    var p0 = lerp(x0, x1, 0.5),
	        p1 = lerp(y0, y1, 0.5);
	    return quadraticCurveToCubicCurve(x0, y0, p0, p1, x1, y1);
	};

	// Janky, needs testing
	function splitSubpaths(path) {
	    var result = [];
	    var currentPath = [];
	    Path.each(path, function (segment, x, y) {
	        if (segment[0] === "M") {
	            if (currentPath.length) result.push(currentPath);
	            currentPath = [];
	        }
	        currentPath.push(segment);
	        if (segment[0] === "Z") {
	            if (currentPath.length) result.push(currentPath);
	            currentPath = [];
	        }
	    });
	    if (currentPath.length) result.push(currentPath);
	    return result;
	};

	// Converts each segment to a cubic bezier curve
	function convertToBeziers(path, x, y) {
	    var command = path.shift();
	    switch (command) {
	        case 'L':
	            return ['C'].concat(_toConsumableArray(lineToCubicCurve.apply(undefined, [x, y].concat(_toConsumableArray(path))).slice(2)));
	        case 'Q':
	            return ['C'].concat(_toConsumableArray(quadraticCurveToCubicCurve.apply(undefined, [x, y].concat(_toConsumableArray(path))).slice(2)));
	        // TODO: implement ellipitcal arcs
	    }
	    return [command].concat(_toConsumableArray(path));
	    //return [command].concat(path);
	};

	Path.interpolate = function interpolate(path_a, path_b, t) {
	    var _ref, _ref2;

	    var extractControlPoints = function extractControlPoints(segment) {
	        var command = segment.shift();
	        return segment;
	    };

	    // TODO: Find the lengths of path_a and path_b and subdivide one to make the control point count equal

	    var interpolatedPoints = (0, _functools.zip)((_ref = []).concat.apply(_ref, _toConsumableArray(Path.map(path_a, convertToBeziers).map(extractControlPoints))), (_ref2 = []).concat.apply(_ref2, _toConsumableArray(Path.map(path_b, convertToBeziers).map(extractControlPoints)))).map(function (_ref3) {
	        var _ref4 = _slicedToArray(_ref3, 2);

	        var cp0 = _ref4[0];
	        var cp1 = _ref4[1];
	        return lerp(cp0, cp1, t);
	    });

	    var result = [['M'].concat(_toConsumableArray(interpolatedPoints.splice(0, 2)))];

	    while (interpolatedPoints.length) {
	        result.push(['C'].concat(_toConsumableArray(interpolatedPoints.splice(0, Path.pathLengths["C"]))));
	    }

	    return result;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.zip = zip;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function zip() {
	    var _Math;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	    }

	    // Remove any arguments that aren't array like
	    var args = args.filter(function (a) {
	        return "length" in a;
	    });
	    // Get the shortest length
	    var length = (_Math = Math).min.apply(_Math, _toConsumableArray(args.map(function (a) {
	        return a.length;
	    })));
	    var result = [];
	    var arrayAt = function arrayAt(i) {
	        return function (arr) {
	            return arr[i];
	        };
	    };

	    for (var i = 0; i < length; i++) {
	        result.push(args.map(arrayAt(i)));
	    }
	    return result;
	}

	var unzip = exports.unzip = function unzip(a) {
	    return zip.apply(undefined, _toConsumableArray(a));
	};

/***/ }
/******/ ])
});
;