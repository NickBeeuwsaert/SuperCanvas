//Operates on a 3x3 matrix
/**
 * [ a c e ]
 * [ b d f ]
 * [ 0 0 1 ]
 */
let {cos, sin, tan} = Math;

export class Matrix {
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    multiply(A, B, C, D, E, F) {
        let _a = this.a * A + this.c * B;
        let _b = this.b * A + this.d * B;

        let _c = this.a * C + this.c * D;
        let _d = this.b * C + this.d * D;

        let _e = this.a * E + this.c * F + this.e;
        let _f = this.b * E + this.d * F + this.f;

        this.a = _a;
        this.b = _b;
        this.c = _c;

        this.d = _d;
        this.e = _e;
        this.f = _f;

        return this;
    }

    rotate(angle, x=0, y=0) {
        let c = cos(angle), s = sin(angle);
        this.translate(x, y);

        this.multiply(c, s, -s,  c, 0, 0);

        this.translate(-x, -y);

        return this;
    }


    skewX(a) {
        return this.multiply(1, 0, tan(a), 1, 0, 0);
    };

    skewY(a) {
        return this.multiply(1, tan(a), 0, 1, 0, 0);
    };

    translate(x, y=0) {
        return this.multiply(1, 0, 0, 1, x, y);
    };

    scale(x, y=x) {
        return this.multiply(x, 0, 0, y, 0, 0);
    };

    transformPoint(x, y) {
        return {
            x: this.a*x + this.c*y + this.e,
            y: this.b*x + this.d*y + this.f
        };
    };

    asArray() {
        return [this.a, this.b, this.c, this.d, this.e, this.f];
    };
};
