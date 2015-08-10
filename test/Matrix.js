var assert = require("assert");

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
});