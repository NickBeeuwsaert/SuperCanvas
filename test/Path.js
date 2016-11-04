let { SuperCanvas, Path } = require('../');
let assert = require('assert');


describe('Path', function(){

    it("Should be able to construct paths", function(){
        var p = new Path();

        p.moveTo(0, 0)
         .lineTo(100, 10)
         .bezierCurveTo(10, 0, 0, 10, 10, 10)
         .quadraticCurveTo(100,100, 0, 0)
         .smoothBezierCurveTo(10, 0, 10, 10)
         .smoothQuadraticCurveTo(50, 50)
         .closePath();

        assert.equal(
            p.toString(),
            "M0,0L100,10C10,0,0,10,10,10Q100,100,0,0S10,0,10,10T50,50Z"
        );
    });

    describe('#parsePath', function(){
        it("Should parse a SVG path", function() {
            assert.deepEqual(
                Array.from(new Path("M10, 10 100,100")),
                [
                    ["M", 10, 10],
                    ["L", 100, 100]
                ]
            );
        });

        it("Should handle subsequent move to as lines", function() {
            assert.deepEqual(
                Array.from(new Path("m10, 10 100,100")),
                [
                    ["M", 10, 10],
                    ["L", 110, 110]
                ]
            );
        });
    });

    describe('#getExtents', function(){
        it("Should work with simple paths", function() {
            assert.deepEqual(
                Path.getExtents("m10, 10 100,100"),
                {
                    left: 10,
                    right: 110,
                    top: 10,
                    bottom: 110
                }
            );
        });

        it("Quadratic Paths", function() {

            assert.deepEqual(
                Path.getExtents("M0, 0 Q10,12 20,0"),
                {
                    left: 0,
                    right: 20,
                    top: 0,
                    bottom: 6
                }
            );
        });

        it("Cubic Paths", function() {


            assert.deepEqual(
                Path.getExtents("M0,0 C10,12 20,12 30, 0"),
                {
                    left: 0,
                    right: 30,
                    top: 0,
                    bottom: 9
                }
            );
        });

        it("Convoluted Paths", function() {
            var p = [
                ["M", 627.126, 863.319],
                ["l", 0, -113.121],
                ["l", 196.076, -14.6903],
                ["l", -28.2026, 178.962],
                ["l", -124.756, 10.4294],
                ["l", 160.028, -100.409],
                ["l", 106.853, 10.498],
                ["l", -2.30311, -154.82],
                ["l", -177.831, 122.246],
                ["c", 0, 0, -84.5575, 248.581, 90.6054, 113.218],
                ["c", 175.163, -135.364, 263.335, -126.804, 147.309, -166.6],
                ["c", -116.025, -39.7962, -149.646, -40.975, -111.814, -99.8304],
                ["c", 37.8323, -58.8551, 142.581, -48.647, 38.3266, -58.7365],
                ["c", -104.254, -10.0894, -294.292, 272.855, -294.292, 272.855],
                ["l", 0.00139755, -0.000399194],
                ["Z"]
            ];
            var extents = Path.getExtents(p);
            //console.log(Path.each(p).map(function(e){return e.join(' ');}).join(' '));
            assert.deepEqual(
                {
                    left  : extents.left.toFixed(2),
                    right : extents.right.toFixed(2),
                    top   : extents.top.toFixed(2),
                    bottom: extents.bottom.toFixed(2),
                },
                {
                    bottom: "955.98",
                    left: "627.13",
                    right: "1047.43",
                    top: "590.20"
                }
            );
        });
    });

    describe('#map', function(){
        var noOp = function(segment){
            return segment;
        };

        it("Should make paths absolute", function(){
            assert.deepEqual(
                Path.map([
                    ["m", 10, 15],
                    ["l", 20, 25]
                ], noOp),
                [
                    ["M", 10, 15],
                    ["L", 30, 40]
                ]
            );
        });
        it("Should remove shorthand properties", function(){
            //assert.deepEqual(undefined, []);
            assert.deepEqual(
                Path.map([
                    ["M", 10, 15],
                    ["v", 15]
                ], noOp),
                [
                    ["M", 10, 15],
                    ["L", 10, 30]
                ]
            );

            assert.deepEqual(
                Path.map([
                    ["M", 10, 15],
                    ["h", 15]
                ], noOp),
                [
                    ["M", 10, 15],
                    ["L", 25, 15]
                ]
            );

            assert.deepEqual(
                Path.map([//M0,0Q150, 0 150, 150T50,50
                    ["M", 0, 0],
                    ["Q", 150, 0, 150, 150],
                    ["T", 50, 50]
                ], noOp),
                [
                    ["M", 0, 0],
                    ["Q", 150, 0, 150, 150],
                    ["Q", 150, 300, 50, 50]
                ]
            );

            assert.deepEqual(
                Path.map([//M0,0C100,0 0,100 100,100S0,0 50,50
                    ["M", 0, 0],
                    ["C", 100, 0, 0, 100, 100,100],
                    ["S", 0, 0, 50, 50]
                ], noOp),
                [//M0,0C100,0 0,100 100,100C200,100 0,0 50,50
                    ["M", 0, 0],
                    ["C", 100, 0, 0, 100, 100,100],
                    ["C", 200, 100, 0, 0, 50, 50]
                ]
            );
        });
    });

    // describe("#divideCubicBezierCurve", function(){
    //     it("Should divide cubic bezier curves correctly", function(){
    //         assert.deepEqual(
    //             [
    //                 Path.divideCubicBezierCurve(0, 1024, 0, 1024, 0.5),
    //                 Path.divideCubicBezierCurve(0, 0, 1024, 1024, 0.5)
    //             ],
    //             [
    //                 [[0, 512, 512, 512], [512, 512, 512, 1024]],
    //                 [[0, 0, 256, 512], [512, 768, 1024, 1024]]
    //             ]
    //         );
    //     });
    // });


    // describe("#divideQuadraticBezierCurve", function(){
    //     it("Should divide cubic bezier curves correctly", function(){
    //         assert.deepEqual(
    //             [
    //                 Path.divideQuadraticBezierCurve(0, 1024, 1024, 0.5),
    //                 Path.divideQuadraticBezierCurve(0, 0, 1024, 0.5)
    //             ],
    //             [
    //                 [[0, 512, 768 ], [768, 1024, 1024]],
    //                 [[ 0, 0, 256 ], [ 256, 512, 1024 ]]
    //             ]
    //         );
    //     });
    // });
});