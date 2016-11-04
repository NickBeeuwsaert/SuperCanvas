import Path from "./Path";
import Matrix from "./Matrix";
export { Path, Matrix };

export default class SuperCanvas {
    constructor(canvas) {
        if(!canvas) throw new Error("Missing required argument");
        // Handle receiving a context
        if(canvas.canvas) canvas = canvas.canvas;

        if(!canvas.getContext) throw new Error("Can't get context");

        this.context = canvas.getContext("2d");
        this.canvas = canvas;
    }

    set fillStyle(fill) { this.context.fillStyle = fill; }
    get fillStyle() { return this.context.fillStyle; }

    set strokeStyle(stroke) { this.context.strokeStyle = stroke; }
    get strokeStyle() { return this.context.strokeStyle; }

    set lineWidth(width) { this.context.lineWidth = width; }
    get lineWidth() { return this.context.lineWidth; }

    set lineCap(capStyle) { this.context.lineCap = capStyle; }
    get lineCap() { return this.context.lineCap; }
    

    drawPath(d, transform=null) {
        this.beginPath();
        Path.each(d, function(segment) {
            let command = segment.shift();

            switch(command) {
                case 'M':
                    this.moveTo(...segment);
                break;
                case 'L':
                    this.lineTo(...segment);
                break;
                case 'C':
                    this.bezierCurveTo(...segment);
                break;
                case 'Q':
                    this.quadraticCurveTo(...segment);
                break;
                case 'Z':
                    this.closePath();
                break;
            }
        }.bind(this));
    }

    // Drawing
    beginPath() { this.context.beginPath(); }
    closePath() { this.context.closePath(); }

    lineTo(x, y) { this.context.lineTo(x, y); }
    moveTo(x, y) { this.context.moveTo(x, y); }
    quadraticCurveTo(cp0x, cp0y, x, y) { this.context.quadraticCurveTo(cp0x, cp0y, x, y); }
    bezierCurveTo(cp0x, cp0y, cp1x, cp1y, x, y) { this.context.bezierCurveTo(cp0x, cp0y, cp1x, cp1y, x, y); }

    // Transformations
    save() { this.context.save(); }
    rotate(angle) { this.context.rotate(angle); }
    scale(x, y) { this.context.scale(x, y); }
    translate(x, y) { this.context.translate(x, y); }
    restore() { this.context.restore(); }

    // Painting
    fill() { this.context.fill(); }
    stroke() { this.context.stroke(); }
}


