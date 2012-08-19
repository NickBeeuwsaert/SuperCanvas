/*
A collection of HTML5 canvas utilities
Copyright (C) 2011 Nick Beeuwsaert
This file is part of SuperCanvas.

SuperCanvas is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

SuperCanvas is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with SuperCanvas.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @description wooo!
 * @class Construct a new superCanvas Instance
 * @constructor
 * @param el reference to the canvas element to use for the context
 */
var superCanvas = function(el){
    var obj, e;
    obj = el.getContext("2d");
    for(e in superCanvas){
        if(superCanvas.hasOwnProperty(e)){
            obj[e] = superCanvas[e];
        }
    }
    obj.external = el;
    return obj;
};
/**
 * @description parses the SVG path for use
 * @static
 * @param {String}d the path to process
 * @returns {Array[]} A 2D array of SVG commands
 */
superCanvas.parsePath = function(d){
	d = d.replace(/([mlhvcqtzsa])/ig, " $1 ");
	var splitPath = d.match(/([mlhvcqtzsa][^mlhvcqtzsa]*)/ig),
	pathArr = [], i = 0;
	for(i = 0; i!==splitPath.length; i++){
	    //command = splitPath[i].match(/[\-0-9e]?([^ ,]+)/ig);
	    command = splitPath[i].match(/([\-]?(0|[1-9]\d*)(\.\d*)?([eE][+\-]?\d+)?|[mlhvcqtzsa]+)/ig);
	    //command = splitPath[i].match(/([\-0-9e])?([^ ,\-](e[\-])?)+/ig);
	    //console.log(splitPath[i]);
	    pathArr.push(command);
	}
	return superCanvas.normalizePath(pathArr.slice());
};
/**
 * @description just fills text in upside down, really only useful if you are trying to debug SVG font glyphs
 * @param text the string to fill
 * @param x the x coordinate for the text
 * @param y the y coordinate for the text
 * @param maxWidth the maximum width for the text
 * @memberOf superCanvas#
 */
superCanvas.fillTextU = function(text, x, y, maxWidth){
this.save();
this.translate(x, y);
this.scale(1,-1);
this.fillText(text, 0,0, maxWidth);
this.restore();
};
/**
 * @description maps different SVG path commands to superCanva commands
*/
superCanvas.pathCommands = {
        'M': 'move2',
        'L': 'line2',
        'H': 'horizontalLine2',
        'V': 'verticalLine2',
        'C': 'bezierCurve2',
        'Q': 'quadraticCurve2',
        'T': 'smoothQuadraticCurve2',
        'S': 'smoothCubicCurve2',
        'A': 'eArc',
        'Z': 'closePath2',
        'z': 'closePath2'};
superCanvas.closePath2 = function(){
	this.closePath();
    return [this.cX[this.cX.length-1],this.cY[this.cY.length-1]];
	//return [parseFloat(lastCommand[lastCommand.length-2]),parseFloat(lastCommand[lastCommand.length-1])];
};
superCanvas.line2 = function(x, y){ // haha! its a pun! 
	this.lineTo(x, y);
    return [x, y];
};
superCanvas.move2 = function(x, y){
    //this.beginPath();
	this.moveTo(x, y);
    return [x, y];
};
superCanvas.bezierCurve2 = function(cp1x, cp1y, cp2x, cp2y, x,y){
	this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    return [x, y];
};
superCanvas.quadraticCurve2 = function(cp1x, cp1y, x,y){
	this.pCpx = cp1x;
	this.pCpy = cp1y;
	this.quadraticCurveTo(cp1x, cp1y, x, y);
    return [x,y];
};
// stupid smooth curves
superCanvas.smoothQuadraticCurve2 = function(x,y){
                                 
                                 var lastCommand = this.currentPath[this.currentPath.length-2];
                                 //console.log(lastCommand);
                                 var lastCPx = parseFloat(x),
                                     lastCPy = parseFloat(y),
                                     lastX = parseFloat(lastCommand[lastCommand.length-2]),
                                     lastY = parseFloat(lastCommand[lastCommand.length-1]), newX, newY;
                                 newX = newY = 0;
                                 if(lastCommand[0] === 'Q'){
                                         lastCPx = parseFloat(lastCommand[1]);
                                         lastCPy = parseFloat(lastCommand[2]);
                                         

                                 }else 
                                 if(lastCommand[0] === 'T'){
                                         lastCPx = this.lastCPx;
                                         lastCPy = this.lastCPy;
                                 }else{
                                        lastCPx = parseFloat(lastCommand[lastCommand.length-2]);
                                        lastCPy = parseFloat(lastCommand[lastCommand.length-1]);
                                }
                                 newX = lastX + (lastX - lastCPx);// + (lastCPx * Math.cos(Math.PI)) - (lastCPy * Math.sin(Math.PI));
                                 newY = lastY + (lastY - lastCPy);// + (lastCPx * Math.sin(Math.PI)) - (lastCPy * Math.cos(Math.PI));
                                 this.lastCPx = newX;
                                 this.lastCPy = newY;
                                 //newCommand = ['Q', newX, newY, command[1], command[2]];
                                 return this.quadraticCurve2(newX, newY, x, y);
};
superCanvas.smoothCubicCurve2 = function(cpX, cpY, x,y){

                                 var lastCommand = this.currentPath[this.currentPath.length-2];
                                 //console.log(lastCommand);
                                 var lastCPx = parseFloat(x),
                                     lastCPy = parseFloat(y),
                                     lastX = parseFloat(lastCommand[lastCommand.length-2]),
                                     lastY = parseFloat(lastCommand[lastCommand.length-1]), newX, newY;
                                 newX = newY = 0;
                                 if(lastCommand[0] === 'C'){
                                         lastCPx = parseFloat(lastCommand[3]);
                                         lastCPy = parseFloat(lastCommand[4]);
                                         

                                 }else 
                                 if(lastCommand[0] === 'S'){
                                         lastCPx = this.lastCPx;
                                         lastCPy = this.lastCPy;
                                 }else{
                                        lastCPx = cpX;//parseFloat(lastCommand[lastCommand.length-2]);
                                        lastCPy = cpY;//parseFloat(lastCommand[lastCommand.length-1]);
                                }
                                 newX = lastX + (lastX - lastCPx);// + (lastCPx * Math.cos(Math.PI)) - (lastCPy * Math.sin(Math.PI));
                                 newY = lastY + (lastY - lastCPy);// + (lastCPx * Math.sin(Math.PI)) - (lastCPy * Math.cos(Math.PI));
                                 this.lastCPx = cpX;
                                 this.lastCPy = cpY;
                                 return this.bezierCurve2(newX, newY,cpX, cpY, x, y);
};
superCanvas.horizontalLine2 = function(x){
	this.line2(this.cX[this.cX.length-1], this.cY[this.cY.length-1]);
	return [x,this.cY[this.cY.length-1]];
};
superCanvas.verticalLine2 = function(y){
	this.line2(this.cX[this.cX.length-1], this.cY[this.cY.length-1]);
	return [this.cX[this.cX.length-1], y];
};
superCanvas.eArc = function( rx, ry, theta, fA, fS, x2,y2){
    if(rx == 0 || ry == 0) {return this.line2(x2,y2);}
    var x1 = parseFloat(this.cX[this.cX.length-1]);
    var y1 = parseFloat(this.cY[this.cY.length-1]);
    rx = parseFloat(rx);
    ry = parseFloat(ry);
    theta = parseFloat(theta);
    fA = parseFloat(fA);
    fS = parseFloat(fS);
    x2 = parseFloat(x2);
    y2 = parseFloat(y2);

    theta *= (Math.PI/180); // SVG spec says that the angle passed should be in degrees, so convert from that
    theta %= Math.PI*2;
    var mx = (x1-x2)/2;
    var my = (y1-y2)/2;
    var Mx = (x1+x2)/2;
    var My = (y1+y2)/2;
    x1p = Math.cos(theta) * mx + Math.sin(theta)*my;
    y1p =-Math.sin(theta) * mx + Math.cos(theta)*my;

    rx = Math.abs(rx);
    ry = Math.abs(ry);
    D = Math.pow(x1p,2)/ Math.pow(rx,2) + Math.pow(y1p,2)/Math.pow(ry,2);
    //if D is greater than one, the radii won't fit the ellipse that starts at the specified points with the specified angle
    if (D > 1){
        rx = Math.sqrt(D)*rx;
        ry = Math.sqrt(D)*ry;
    }
    var c = Math.sqrt(Math.abs((Math.pow(rx,2)*Math.pow(ry, 2) - Math.pow(rx,2)*Math.pow(y1p,2) - Math.pow(ry,2)*Math.pow(x1p,2))/
              (Math.pow(rx,2)*Math.pow(y1p,2) + Math.pow(ry,2)*Math.pow(x1p,2))));
    
    if(fS == fA){
        c= -c;
    }
    cxp = c;
    cyp = c;

    cxp *= (rx*y1p)/ry;
    cyp *= -((ry*x1p)/rx);
    
    
    var cx = Math.cos(theta)*cxp - Math.sin(theta)*cyp;
    var cy = Math.sin(theta)*cxp + Math.cos(theta)*cyp;
    cx += Mx;
    cy += My;


    // begin calculating theta1 and Dtheta...
    // theta1 is the starting angle,
    // and dTheta is difference betwix the end and the start
    function norm(v){
        var norm = 0;
        for(var i = 0; i < v.length;i++){
            norm += Math.pow(Math.abs(v[i]), 2);
        }
        return Math.sqrt(norm);
    }
    function getAngle(u, v){
        var sign = u[0] * v[1] - u[1]*v[0] < 0 ? -1: 1;
        var toBe = u[0]*v[0] + u[1]*v[1];
        var orNot= norm(u)*norm(v);
        var r = toBe/orNot;
        //correct for floating point errors
        // stuff like 1.000000009 and all that
        if(r < -1){
            r = -1;
        }else if(r > 1){
            r = 1;
        }
        var res = Math.acos(r);
        return sign * res;
    }
    var theta1 = getAngle([1, 0], [(x1p-cxp)/rx,(y1p-cyp)/ry]);
    var Dtheta = getAngle([(x1p-cxp)/rx,(y1p-cyp)/ry],[(-x1p-cxp)/rx,(-y1p-cyp)/ry] )%(Math.PI*2);
    if(fS == 0 && Dtheta > 0){
        Dtheta -= Math.PI*2;
    }else if(fS == 1 && Dtheta < 0){
        Dtheta += Math.PI*2;
    }
    var theta2 = Dtheta + theta1;

    var x = x1;
    var y = y2;
    for(var i = 0; i < Math.abs(Dtheta); i+=Math.PI/180){

        var I = theta1+(Dtheta<0?-1:1)*i;
        x = cx + (Math.cos(I)*rx*Math.cos(theta) - Math.sin(I)*ry*Math.sin(theta));
        y = cy + (Math.cos(I)*rx*Math.sin(theta) + Math.sin(I)*ry*Math.cos(theta));
        this.lineTo(x, y);
    }
    this.lineTo(x2,y2);
    return [x2, y2];
};
/**
 * @description skews the canvas on the X axis
 * @param radians the amount of radians to skew the X axis on
 * @memberOf superCanvas#
 */
superCanvas.skewX = function(radians){
    this.transform(1,0,Math.tan(radians), 1, 0, 0);
};
/**
 * @description skews the canvas on the Y axis
 * @param radians the amount of radians to skew the Y axis on
 * @memberOf superCanvas#
 */
superCanvas.skewY = function(radians){
    this.transform(1,Math.tan(radians), 0, 1, 0, 0);
};
/**
 * @description skews the canvas on the X and Y axis
 * @param radiansX how many radians to skew on the X axis
 * @param radiansY how many radians to skew on the Y axis
 * @memberOf superCanvas#
 */
superCanvas.skew = function(radiansX, radiansY){
    this.transform(1,Math.tan(radiansY), Math.tan(radiansX), 1, 0, 0);

};
/**
 * @description a matrix class
 * @class Matrices! Weeee!
 * @param [a] m11, defaults to 1
 * @param [b] m21, defaults to 0
 * @param [c] m12, defaults to 0
 * @param [d] m22, defaults to 1
 * @param [e] m13, defaults to 0
 * @param [f] m23, defaults to 0
 */
superCanvas.Matrix = function(a,b,c,d,e,f){
    var t = {};


    /**
     * @description multiplies the matrix by the given areguments 
     * @memberOf superCanvas.Matrix
     * @param a m11
     * @param b m21
     * @param c m12
     * @param d m22
     * @param e m13
     * @param f m23
     * @returns this instance of the superCanvas.Matrix
     */
    transform = function(a,b,c,d,e,f){
        var m = superCanvas.Matrix(a,b,c,d,e,f);
        var m11, m21, m12, m22, m13,m23;
        m11 = t.m11 * m.m11 + t.m12 * m.m21 + t.m13 * m.m31;
        m21 = t.m21 * m.m11 + t.m22 * m.m21 + t.m23 * m.m31;
        
        m12 = t.m11 * m.m12 + t.m12 * m.m22 + t.m13 * m.m32;
        m22 = t.m21 * m.m12 + t.m22 * m.m22 + t.m23 * m.m32;
        
        m13 = t.m11 * m.m13 + t.m12 * m.m23 + t.m13 * m.m33;
        m23 = t.m21 * m.m13 + t.m22 * m.m23 + t.m23 * m.m33;
        
        t.m11 = m11;
        t.m21 = m21;
        
        t.m12 = m12;
        t.m22 = m22;
        
        t.m13 = m13;
        t.m23 = m23;
        return t;
        
    };
    /**
     * @description rotates the matrix by theta degrees
     * @memberOf superCanvas.Matrix
     * @param theta radians to rotate the matrix
     * @param [cx] the X axis of the rotation center
     * @param [cx] the Y axis of the rotation center
     * @returns this instance of the superCanvas.Matrix
     */
    rotate = function(theta, cx, cy){
        var a = Math.cos(theta);
        var b = Math.sin(theta);
        var c = -Math.sin(theta);
        var d = Math.cos(theta);
        var e = 0, f = 0;
        if(cx && cy){
            t.translate(cx,cy);
        }
        t.transform(a,b,c,d,e,f);
        if(cx && cy){
            t.translate(-cx,-cy);
        }
        return t;
    };
    /**
     * @description skews the matrix on the X axis
     * @memberOf superCanvas.Matrix
     * @param x amount to skew the matrix
     * @returns this instance of the superCanvas.Matrix
     */
    skewX = function(x){
        t.transform(1,0,Math.tan(x),1,0,0);
        return t;
    };
    /**
     * @description skews the matrix on the Y axis
     * @memberOf superCanvas.Matrix
     * @param y amount to skew
     * @returns this instance of the superCanvas.Matrix
     */
    skewY = function(y){
        t.transform(1,Math.tan(y),0,1,0,0);
        return t;
    };
    /** 
     * @description skews in both axis
     * @memberOf superCanvas.Matrix
     * @param x amount to skew on the X axis
     * @param y amount to skew on the Y axis
     * @returns this instance of the superCanvas.Matrix
     */
    skew = function(x, y){
        t.transform(1,Math.tan(y),Math.tan(x),1,0,0);
        return t;
    };
    /**
     * @description translates the matrix
     * @memberOf superCanvas.Matrix
     * @param x amount to translate in the X axis
     * @param y amount to translate in the Y axis
     * @returns this instance of the superCanvas.Matrix
     */
    translate = function(x, y){
        t.transform(1,0,0,1,x,y);
        //t.m13 += x;
        //t.m23 += y;
        return t;
    };
    /**
     * @description sets the transformation matrix to the values specified by a,b,c,d,e and f
     * @memberOf superCanvas.Matrix
     * @param a m11
     * @param b m21
     * @param c m12
     * @param d m22
     * @param e m13
     * @param f m23
     * @returns this instance of the superCanvas.Matrix
     */
    setTransform = function(a,b,c,d,e,f){
        t.m11 = a;
        t.m21 = b;
        

        t.m12 = c;
        t.m22 = d;

        t.m13 = e;
        t.m23 = f;

        t.m31 = 0;
        t.m32 = 0;
        t.m33 = 1;
        return t;
    };
    /**
     * @description creates a string representation of the matrix
     * @memberOf superCanvas.Matrix
     */
    toString = function(){
        return [[t.m11, t.m12, t.m13],
                [t.m21, t.m22, t.m23],
                [t.m31, t.m32, t.m33]].join('\n');
    };
    /**
     * @description sets the transformation matrix to 1,0,0,1,0,0
     * @memberOf superCanvas.Matrix
     * @returns this instance of the superCanvas.Matrix
     */
    resetTransform = function(){
        t.setTransform(1,0,0,1,0,0);
        return t;
    };
    /**
     * @description scales the matrix
     * @memberOf superCanvas.Matrix
     * @param x amount to scale the X axis
     * @param y amount to scale the Y axis
     * @returns this instance of the superCanvas.Matrix
     */
    scale = function(x, y){
        //t.transform(x,0,0,y,0,0);
        t.m11 *= x;
        t.m22 *= y;
        return t;
    };
    /**
     * @memberOf superCanvas.Matrix
     * @description multiplies the matrix by the coordinates provided
     * @param x the x coordinate
     * @param y the y coordinate
     */
    bake = function(x, y){
        // [ a c e ]   [x]
        // [ b d f ] * [y]
        // [ 0 0 1 ]   [1]
        var X = x * t.m11 + y * t.m12 + 1 * t.m13;
        var Y = x * t.m21 + y * t.m22 + 1 * t.m23;
        return [X,Y];
    };
    t.rotate = rotate;
    t.bake = bake;
    t.scale = scale;
    t.resetTransform = resetTransform;
    t.toString = toString;
    t.setTransform = setTransform;
    t.translate = translate;
    t.skew = skew;
    t.skewX = skewX;
    t.skewY = skewY;
    t.transform = transform
    t.setTransform(a||1,b||0,c||0,d||1,e||0,f||0);
    return t;
};
/**
 * @description bakes the matrix into the path
 * @param {superCanvas.Matrix} matrix the matrix to use
 * @param {String|Array} path path to bake into
 * @returns {Array} the new path, with the matrix applied
 */
superCanvas.bakeMatrixIntoPath = function(matrix, path){
    var newPath = [];
    if(typeof(path) == "string"){
        path = superCanvas.parsePath(path);
    }
    for(var i = 0; i < path.length; i++){
        var cmd = [path[i][0]];
        if(cmd[0] == 'A'){
            // I *think* that some transform should be applied the the arcs x and y radius, but I don't know how to do that
            coords = matrix.bake(path[i][path[i].length-2], path[i][path[i].length-1]);
            cmd = cmd.concat(path[i].slice(1,-2), coords);

        }else{
            for(var I = 0; I<path[i].length/2-1;I++){
                cmd = cmd.concat(matrix.bake(path[i][I*2+1], path[i][I*2+2]));
            }
        }
        newPath.push(cmd);
    }
    //console.log(newPath);
    return newPath;
};
/**
 * @description gets all subpaths in the SVG path
 * @param {String|Array} path the path to split
 * @returns {Array} array of arrays with the paths
 */
superCanvas.splitSubPaths = function(path){
        if(typeof(path) == "string"){
            path = superCanvas.parsePath(path);
        }
        var lPathStart = 0;
        var subPaths = [];
        var i;
        for(i = 0; i < path.length; i++){
            if(path[i][0].toLowerCase() == 'z'){
                subPaths.push(path.slice(lPathStart, i));
                lPathStart = i;
            }
        }
        //console.log(lPathStart, i);
        if(lPathStart != i-1){
                subPaths.push(path.slice(lPathStart, i));
        }
        return subPaths;
}
/**
 * @description reverses the SVG path provided
 * @param {String|Array} thePath the path to reverse
 * @returns {Array} the newly reversed path
 */
superCanvas.reversePath = function(thePath){
        if(typeof(thePath) == "string"){
            thePath = superCanvas.parsePath(thePath);
        }
        var newPath = [];
        var i;
        subPaths = superCanvas.splitSubPaths(thePath);
        //console.log(subPaths);
        for(i = 0; i < subPaths.length; i++){
            var path = subPaths[i];
            //console.log(path);
            if(path[path.length-1][0].toLowerCase() == 'z'){
                path.pop();
            }
            lastCmd = path[path.length-1];//path.slice(-1)[0];
            coords = lastCmd.slice(-2);
            newPath.push([].concat('M', coords[0], coords[1]));
            for(var I = path.length-2; I >= 0; I--){
                var previousCmd = path[I+1];
                var thisCmd = path[I];
                var newcmd = [];
                endCoords = thisCmd.slice(-2);
                /*if(previousCmd[0] == 'L'){
                    newcmd.push('L', endCoords[0], endCoords[1]);
                }else if(previousCmd[0] == 'Q'){
                    controlPoints = previousCmd.slice(1,3);
                    console.log(controlPoints);
                    newcmd.push('Q', controlPoints[0], controlPoints[1], endCoords[0], endCoords[1]);
                }*/
                if(previousCmd[0] == 'C'){
                    var cp1 = previousCmd.slice(1, 3);
                    var cp2 = previousCmd.slice(3,5);
                    newcmd = ['C'].concat(cp2, cp1);
                }else{
                    newcmd = previousCmd.slice(0,-2);
                }
                newcmd.push(endCoords[0], endCoords[1]);
                newPath.push(newcmd);
            }
        }
        return newPath;
    };
superCanvas.pathLengths = 
       {'L': 2,
        'M': 2,
        'C': 6,
        'S': 4,
        'Q': 4,
        'T': 2,
        'A': 7};
superCanvas.defaultMatrix = superCanvas.Matrix();
/**
 * @description draws a path created with superCanvas.parsePath
 * @param dArr the path to draw. Can be either a SVG path or a array created with SuperCanvas.parsePath
 * @param {superCanvas.Matrix} [matrix] the matrix to apply to the path
 * @memberOf superCanvas#
*/
superCanvas.drawPath = function(dArr, matrix){
	if(typeof(dArr) === "string"){
		dArr = superCanvas.parsePath(dArr);
	}
    matrix = matrix || superCanvas.defaultMatrix;
    //dArr = superCanvas.bakeMatrixIntoPath(matrix, path);
    //console.log(matrix+"");
	this.cX = [];
	this.cY = [];
	this.currentPath = [];
	this.lastCommand = '';
	var d = dArr.slice(0),
    centerX=0, centerY=0, i;
	for(i = 0; i!==d.length; i++){
        var c = superCanvas.bakeMatrixIntoPath(matrix, [d[i].slice(0)])[0];
		this.currentPath.push(c.slice());
		command = c.shift();
		//while(this.pathLengths[command.toUpperCase()] <= c.length){
            //var cee = c.splice(0,this.pathLengths[command.toUpperCase()]);
            //console.log(cee);
            try  {
            var C = this[superCanvas.pathCommands[command]].apply(this, c);
             this.cX.push(C[0]);
             this.cY.push(C[1]);
	    }catch(e){
		console.error(command);
		console.error(this[superCanvas.pathCommands[command]]);
		throw command;
	    }
		    this.lastCommand = command;
            centerX += parseFloat(this.cX[this.cX.length-1]);
            centerY += parseFloat(this.cY[this.cY.length-1]);
        //}
	}
    return [centerX/this.cX.length, centerY/this.cY.length];
};
/**
 * @decaprecated
 * @description normalized a path (remove Horizontal and Vertical commands, uncompacts commands, and makes everything absolute)
 * @param pathD the path data to normalize
 */
superCanvas.normalizePath = function(pathD){
    if(pathD.normalized){
	console.log("this path has already been normalized!");
	return;
    }else{
	pathD.normalized = true;
	
    }
    var path = [],
    lx = 0, ly = 0, i;
    var P = [];
    /*  for(i = 0; i<pathD.length; i++){
        var newCommand = pathD[i].slice();
        nc = newCommand.shift();
        //console.log(nc);
        while(superCanvas.pathLengths[nc.toUpperCase()] <= newCommand.length){
            encee = newCommand.splice(0, superCanvas.pathLengths[nc.toUpperCase()]);
            encee.unshift(nc);
            P.push(encee);
        }
    }
    pathD = P;*/
    for(i = 0; i < pathD.length; i++){
        var command = pathD[i].slice();
        var commandName = command.shift();
        var uncompactedCommands = [];
        if(superCanvas.pathLengths[commandName.toUpperCase()] < command.length){
            //console.log("an atrocity has occurred: '%s': [%s]", commandName, command.toString());
            while(command.length >= superCanvas.pathLengths[commandName.toUpperCase()]){
                var coords = command.splice(0,superCanvas.pathLengths[commandName.toUpperCase()]);
               coords.unshift(commandName);
		        if(commandName.toUpperCase()=='M'){ commandName = commandName.toUpperCase()==commandName?'L':'l';}
                [].push.call(uncompactedCommands, coords);
}
            //console.log(uncompactedCommands);
            [].push.apply(P, uncompactedCommands);
        }else{
            P.push(pathD[i]);
        }
        
    }
    beginning = true;
    pathD = P;
    var iX = 0;
    var iY = 0;
    for(i = 0; i<pathD.length; i++){
        command = pathD[i].slice();
        var newCommand = command;
	for(var index = 1; index < pathD[i].length; index++){
		newCommand[index] = parseFloat(newCommand[index]);
	}
        switch(command[0]){
                case 'H':
                case 'h':
                                 newCommand = ['L', (command[0]==='H'?0:lx)+parseFloat(command[1]), ly];
                break;
                case 'V':
                case 'v':
                                 newCommand = ['L', lx, (command[0]==='V'?0:ly) + parseFloat(command[1])];
                break;
                case 'l':
                case 'a':
                case 'm':
                case 'q':
                case 's':
                case 'c':
                case 't':
                    var I = 0;
                    newCommand[0] = newCommand[0].toUpperCase();
                    var LC = [lx,ly];
                    if(newCommand[0] == 'A'){
                        newCommand[newCommand.length -1] = LC[1] + parseFloat(newCommand[newCommand.length -1]);
                        newCommand[newCommand.length -2] = LC[0] + parseFloat(newCommand[newCommand.length -2]);
                    }else{
                        for(I = 2; I < newCommand.length; I+=2){
                           newCommand[I-1] = LC[0] + parseFloat(newCommand[I-1]) ;
                           newCommand[I]   = LC[1] + parseFloat(newCommand[I]);
                        }
                    }
                break;
        }
        /*if(newCommand[0] === newCommand[0].toLowerCase()){
            newCommand[0] = newCommand[0].toUpperCase();
            var e = newCommand.length - 1;
            for(I = 1; I<e; I+=2){
                newCommand[I+1] = parseFloat(newCommand[I+1])+ly;
                newCommand[I] = parseFloat(newCommand[I]) + lx;
            }
                
        }*/
        //if(beginning){
        //    iX = lx;
        //    iY = ly;
        //}
        if(newCommand[0].toLowerCase() !== 'z'){
            lx = parseFloat(newCommand[newCommand.length-2]);
            ly = parseFloat(newCommand[newCommand.length-1]);
            //beginning= false;
            if(beginning){
                iX = lx;//iX;//pathD[0][pathD[0].length-2]; //parseFloat(newCommand[newCommand.length-2]);
                iY = ly;//iY;//pathD[0][pathD[0].length-1]; //parseFloat(newCommand[newCommand.length-1]);
                beginning = false;
            }
        }else{
            beginning = true;
            lx = iX;
            ly = iY;
            //lx = 29.22557,ly = 1020.9375;
        }
        //console.log(newCommand.toString());
        path.push(newCommand);
    }
    return path;
};
/**
 * @description resize a Image, Canvas or Video Element without blurring (at time of writng, chrome can't do this with CSS)
 * @function
 * @param imageElement the Image, Canvas or Video Element to be scaled
 * @param w the new width for the element
 * @param h the new height for the element
*/
superCanvas.resizeImage = function(imageElement, w, h){
    image=document.createElement("canvas");
    image.width = imageElement.width;
    image.height = imageElement.height;
    ctx = image.getContext("2d");
    ctx.drawImage(imageElement, 0,0,imageElement.width,imageElement.height);
    imgData = ctx.getImageData(0,0,image.width,image.height);
    image.width = w;
    image.height= h;
    ctx.scale((w/imageElement.width),(h/imageElement.height));
    var leewayX = imageElement.width/w;
    var leewayY = imageElement.height/h;
    for(var x = 0; x<imgData.width; x++){
        for(var y = 0; y<imgData.height; y++){
            var p = (x + y*imgData.width)*4;
            var P = [].slice.call(imgData.data,p, p+4);
            ctx.fillStyle="rgba("+P.join(',')+")";
            ctx.fillRect(x,y,1+leewayX,1+leewayY);
        }
    }
    return image;
};
if(!(typeof window === "object" && this === window)){
	module.exports = {'superCanvas': superCanvas};
}
