//Operates on a 3x3 matrix
SuperCanvas.Matrix = (function(){
    var Matrix = function() {
    };

    var a = 0,
        b = 1,
        c = 2,
        d = 3,
        e = 4,
        f = 5,
        g = 6,
        h = 7,
        i = 8;

    /**
        a b c 
      [ d e f ]
        g h i 

    M_1 * M_2 = M_1a * M_2a + M_1b * M_2d + M
    */
    Matrix.identityMatrix = function(){
        return [1, 0, 0,
                0, 1, 0,
                0, 0, 1];
    };
    Matrix.rotate = function(matrixLike, angle) {
        return Matrix.multiply(matrixLike, [
            +Math.cos(angle), -Math.sin(angle), 0,
            +Math.sin(angle), +Math.cos(angle), 0,
                           0,                0, 1
        ]);
    };
    Matrix.translate = function(matrixLike, x, y) {
        return Matrix.multiply(matrixLike, [
            1, 0, x,
            0, 1, y,
            0, 0, 1
        ]);
    };
    Matrix.scale = function(matrixLike, sx, sy) {
        return Matrix.multiply(matrixLike, [
            sx,  0, 0,
             0, sy, 0,
             0,  0, 1
        ]);
    };
    Matrix.skewX = function(matrixLike, skew) {
        return Matrix.multiply(matrixLike, [
            1, Math.tan(skew), 0,
            0,              1, 0,
            0,              0, 1
        ]);
    };
    Matrix.skewY = function(matrixLike, skew) {
        return Matrix.multiply(matrixLike, [
            1,              0, 0,
            Math.tan(skew), 1, 0,
            0,              0, 1
        ]);
    };
    Matrix.skewY = function(matrixLike, x, y) {
        return Matrix.multiply(matrixLike, [
            1,              Math.tan(x), 0,
            Math.tan(y),              1, 0,
            0,                        0, 1
        ]);
    };

    Matrix.multiply = function(matrixLike, rhs) {
        return [
            matrixLike[a] * rhs[a] + matrixLike[b] * rhs[d] + matrixLike[c] * rhs[g], // a
            matrixLike[a] * rhs[b] + matrixLike[b] * rhs[e] + matrixLike[c] * rhs[h], // b
            matrixLike[a] * rhs[c] + matrixLike[b] * rhs[f] + matrixLike[c] * rhs[i], // c
            
            matrixLike[d] * rhs[a] + matrixLike[e] * rhs[d] + matrixLike[f] * rhs[g], // d
            matrixLike[d] * rhs[b] + matrixLike[e] * rhs[e] + matrixLike[f] * rhs[h], // e
            matrixLike[d] * rhs[c] + matrixLike[e] * rhs[f] + matrixLike[f] * rhs[i], // f

            matrixLike[g] * rhs[a] + matrixLike[h] * rhs[d] + matrixLike[i] * rhs[g], // g
            matrixLike[g] * rhs[b] + matrixLike[h] * rhs[e] + matrixLike[i] * rhs[h], // h
            matrixLike[g] * rhs[c] + matrixLike[h] * rhs[f] + matrixLike[i] * rhs[i], // i
        ];
    };

    // TODO: name this better
    Matrix.multiplyVector = function(matrixLike, x, y) {
        // v = <x, y, 1>
        return [
            x * matrixLike[a] + y * matrixLike[b] + 1 * matrixLike[c],
            x * matrixLike[d] + y * matrixLike[e] + 1 * matrixLike[f],
            // x * matrixLike[g] + y * matrixLike[h] + 1 * matrixLike[i]
        ];
    };

    return Matrix;
})();