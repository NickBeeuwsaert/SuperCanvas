var assert = require("assert");
import {SuperCanvas, Matrix} from "../";

describe('Matrix', function() {

    describe("#Matrix", function(){
        it("Should default to a identity matrix", function() {
            assert.deepEqual(
                new Matrix().asArray(),
                [1, 0, 0, 1, 0, 0]
            );
        });
    });

    describe("#translate", function() {
        var mat = new Matrix();

        it("Should translate in the X direction", function() {
            mat.translate(10, 0);
            assert.deepEqual(
                mat.transformPoint(10, 10),
                {x: 20, y: 10}
            );
        });
        it("Should translate in the Y direction", function() {
            mat.translate(0, 10);
            assert.deepEqual(
                mat.transformPoint(10, 10),
                {x: 20, y: 20}
            );
        });
        it("Should assume y = 0 when y is undefined", function() {
            mat.translate(10);
            assert.deepEqual(
                mat.transformPoint(10, 10),
                {x: 30, y: 20}
            );
        });
    });

    describe("#scale", function() {
        it("Should scale in both directions", function() {
            var mat = new Matrix();
            mat.scale(2, 3);
            assert.deepEqual(
                mat.transformPoint(10, 20),
                {x: 20, y: 60}
            );
        });

        it("Should assume y = x when y is unspecified", function() {
            var mat = new Matrix();
            mat.scale(2);
            assert.deepEqual(
                mat.transformPoint(10, 20),
                {x: 20, y: 40}
            );
        });
    });

    var approxAssert = function(a, b, cmp) {
        for (var key in a) {
            if(!a.hasOwnProperty(key)) continue;
            if(!cmp(a[key], b[key])) {
                assert.fail(a, b);
            }
        }
    };
    var approxEqual = function(a, b) {
        return a.toFixed(2) == b.toFixed(2);
    }

    describe("#rotate", function() {
        var QUARTER_TURN = Math.PI / 2;
        var EIGHTH_TURN = QUARTER_TURN / 4;
        it("Should rotate", function() {
            var mat = new Matrix();
            mat.rotate(QUARTER_TURN);
            approxAssert(
                mat.transformPoint(0, 20),
                {x: -20, y: 0},
                approxEqual
            );
        });
        it("Should rotate around a point", function() {
            var mat = new Matrix();
            //Half turn
            mat.rotate(Math.PI, 15, 0);
            approxAssert(
                mat.transformPoint(20, 0),
                {x: 10, y: 0},
                approxEqual
            );
        });
    });

    describe("#skewX", function(){
        it("Should skew on the X axis", function() {
            var mat = new Matrix();
            mat.skewX(Math.PI/4);
            approxAssert(
                mat.transformPoint(20, 10),
                {x: 30, y: 10},
                approxEqual);
        });
    });
    describe("#skewY", function() {
        it("Should skew on the Y axis", function() {
            var mat = new Matrix();
            mat.skewY(Math.PI/4);
            approxAssert(
                mat.transformPoint(10, 20),
                {x: 10, y: 30},
                approxEqual);
        });
    });
});