(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Matrix"] = factory();
	else
		root["Matrix"] = factory();
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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;//Operates on a 3x3 matrix
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    /**
	     * [ a c e ]
	     * [ b d f ]
	     * [ 0 0 1 ]
	     */
	    var a = 0, c = 2, e = 4,
	        b = 1, d = 3, f = 5;
	    var Matrix = function(A, B, C, D, E, F) {
	        var defaultArgs = [1, 0, 0, 1, 0, 0];
	        var args = [].slice.call(arguments).concat(defaultArgs.slice(arguments.length));
	        this[a] = args[a];
	        this[b] = args[b];
	        this[c] = args[c];

	        this[d] = args[d];
	        this[e] = args[e];
	        this[f] = args[f];

	        this.length = 6;
	    };

	    Matrix.prototype.matrix = function(A, B, C,
	                                       D, E, F) {
	        //[ a*A + c*B + e*0   a*C + c*D + e*0   a*E + c*F + e ]
	        //[ b*A + d*B + f*0   b*C + d*D + f*0   b*E + d*F + f ]
	        //[        0                 0                 1      ]

	        var _a = this[a] * A + this[c] * B;
	        var _b = this[b] * A + this[d] * B;

	        var _c = this[a] * C + this[c] * D;
	        var _d = this[b] * C + this[d] * D;

	        var _e = this[a] * E + this[c] * F + this[e];
	        var _f = this[b] * E + this[d] * F + this[f];

	        this[a] = _a;
	        this[b] = _b;
	        this[c] = _c;

	        this[d] = _d;
	        this[e] = _e;
	        this[f] = _f;

	        return this;
	    };

	    Matrix.prototype.rotate = function(a, x, y) {
	        if(arguments.length >= 2) this.translate(x, y);
	        var c = Math.cos(a);
	        var s = Math.sin(a);
	        this.matrix(c, s, -s,  c, 0, 0);
	        if(arguments.length >= 2) this.translate(-x, -y);
	        return this;
	    };

	    Matrix.prototype.skewX = function(a){
	        return this.matrix(1, 0, Math.tan(a), 1, 0, 0);
	    };
	    Matrix.prototype.skewY = function(a){
	        return this.matrix(1, Math.tan(a), 0, 1, 0, 0);
	    };
	    Matrix.prototype.translate = function(x, y){
	        return this.matrix(1, 0, 0, 1, x, y||0);
	    };
	    Matrix.prototype.scale = function(x, y){
	        return this.matrix(x, 0, 0, y||x, 0, 0);
	    };

	    Matrix.prototype.transformPoint = function(x, y) {
	        return {
	            x: this[a]*x + this[c]*y + this[e],
	            y: this[b]*x + this[d]*y + this[f]
	        };
	    };

	    Matrix.from = (function(){
	        var Constructor = function(){};
	        Constructor.prototype = Matrix.prototype;

	        return function from(arrayLike) {
	            var mat = new Constructor();
	            Matrix.apply(mat, arrayLike);
	            return mat;
	        };
	    })();

	    return Matrix;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])
});
;