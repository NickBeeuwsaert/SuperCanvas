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
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//Operates on a 3x3 matrix
	/**
	 * [ a c e ]
	 * [ b d f ]
	 * [ 0 0 1 ]
	 */
	var _Math = Math;
	var cos = _Math.cos;
	var sin = _Math.sin;
	var tan = _Math.tan;

	var Matrix = exports.Matrix = function () {
	    function Matrix() {
	        var a = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	        var b = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	        var c = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	        var d = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
	        var e = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
	        var f = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

	        _classCallCheck(this, Matrix);

	        this.a = a;
	        this.b = b;
	        this.c = c;
	        this.d = d;
	        this.e = e;
	        this.f = f;
	    }

	    _createClass(Matrix, [{
	        key: "multiply",
	        value: function multiply(A, B, C, D, E, F) {
	            var _a = this.a * A + this.c * B;
	            var _b = this.b * A + this.d * B;

	            var _c = this.a * C + this.c * D;
	            var _d = this.b * C + this.d * D;

	            var _e = this.a * E + this.c * F + this.e;
	            var _f = this.b * E + this.d * F + this.f;

	            this.a = _a;
	            this.b = _b;
	            this.c = _c;

	            this.d = _d;
	            this.e = _e;
	            this.f = _f;

	            return this;
	        }
	    }, {
	        key: "rotate",
	        value: function rotate(angle) {
	            var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	            var y = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	            var c = cos(angle),
	                s = sin(angle);
	            this.translate(x, y);

	            this.multiply(c, s, -s, c, 0, 0);

	            this.translate(-x, -y);

	            return this;
	        }
	    }, {
	        key: "skewX",
	        value: function skewX(a) {
	            return this.multiply(1, 0, tan(a), 1, 0, 0);
	        }
	    }, {
	        key: "skewY",
	        value: function skewY(a) {
	            return this.multiply(1, tan(a), 0, 1, 0, 0);
	        }
	    }, {
	        key: "translate",
	        value: function translate(x) {
	            var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	            return this.multiply(1, 0, 0, 1, x, y);
	        }
	    }, {
	        key: "scale",
	        value: function scale(x) {
	            var y = arguments.length <= 1 || arguments[1] === undefined ? x : arguments[1];

	            return this.multiply(x, 0, 0, y, 0, 0);
	        }
	    }, {
	        key: "transformPoint",
	        value: function transformPoint(x, y) {
	            return {
	                x: this.a * x + this.c * y + this.e,
	                y: this.b * x + this.d * y + this.f
	            };
	        }
	    }, {
	        key: "asArray",
	        value: function asArray() {
	            return [this.a, this.b, this.c, this.d, this.e, this.f];
	        }
	    }]);

	    return Matrix;
	}();

	;

/***/ }
/******/ ])
});
;