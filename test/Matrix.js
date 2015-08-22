var assert = require("assert");
describe('Matrix', function() {
    var Matrix = require("../").Matrix;

    describe("#Matrix", function(){
        it("Should default to a identity matrix", function() {
            assert.deepEqual(
                new Matrix(),
                {0: 1, 1: 0, 2: 0, 3: 1, 4: 0, 5: 0, length: 6}
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
/*
describe('Matrix', function(){
    var Matrix = require("../").Matrix;

    describe("#identityMatrix", function() {
        it("should return a 3x3 identityMatrix", function() {
            assert.deepEqual(Matrix.identityMatrix(),
                [1, 0, 0,
                 0, 1, 0,
                 0, 0, 1]);
        });
    });

    describe("#multiplyVector", function() {
        it("return the two points given if given a identityMatrix", function() {
            assert.deepEqual(
                Matrix.multiplyVector(Matrix.identityMatrix(), 1, 2),
                [1, 2]
            );
        });
        it("scale points properly", function() {
            assert.deepEqual(
                Matrix.multiplyVector([
                    2,   0, 0,
                    0, 0.5, 0,
                    0,   0, 1
                ], 1, 2),
                [2, 1]
            );
        });


        it("rotate Points", function() {
            var identity = Matrix.identityMatrix();
            var x = 0, y = 100;
            var approx = function(n){
                //Round to 2 decimal places
                return parseInt(n.toFixed(2), 10);
            };
            var points = [
                [0, 100], // Pointing straight up
                [-100, 0], // Pointing to the left (-x)
                [0, -100], // pointing down
                [100, 0] // pointing right
            ];
            for(var i = 0; i < 4; i++) {
                var rotationMatrix = Matrix.rotate(identity, i * Math.PI/2);
                assert.deepEqual(Matrix.multiplyVector(rotationMatrix, x, y).map(approx), points[i]);
            }
        });


        it("translate Points", function() {
            var identity = Matrix.identityMatrix();
            var x = 0, y = 0;
            var translations = [
                [0, 100],
                [100, 0],
                [100, 100],
                [0, 0]
            ];
            for(var i = 0; i < 4; i++) {
                var tx = translations[i][0],
                    ty = translations[i][1];
                var translationMatrix = Matrix.translate(identity, tx, ty);
                assert.deepEqual(Matrix.multiplyVector(translationMatrix, x, y), [x+tx, y+ty]);
            }
        });
    });
});*/