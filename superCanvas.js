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
superCanvas = function(el){
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
superCanvas.parsePath = function(d){
	d = d.replace(/([a-z])/ig, " $1 ");
	var splitPath = d.match(/([a-z][^a-z]*)/ig),
	pathArr = [], i = 0;
	for(i = 0; i!==splitPath.length; i++){
	    command = splitPath[i].match(/[\-0-9]?([^ ,\-]+)/ig);
	    //console.log(command);
	    pathArr.push(command);
	}
	return pathArr.slice();
};
superCanvas.fillTextU = function(text, x, y, maxWidth){
this.save();
this.translate(x, y);
this.scale(1,-1);
this.fillText(text, 0,0, maxWidth);
this.restore();
};
superCanvas.pathCommands = {
        'M': 'move2',
        'L': 'line2',
        'H': 'horizontalLine2',
        'V': 'verticalLine2',
        'C': 'bezierCurve2',
        'Q': 'quadraticCurve2',
        'T': 'smoothQuadraticCurve2',
        'Z': 'closePath',
        'z': 'closePath'};
superCanvas.line2 = function(x, y){ // haha! its a pun! 
	this.lineTo(x, y);
    return [x, y];
};
superCanvas.move2 = function(x, y){
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
                                 this.quadraticCurve2(newX, newY, x, y);
};
superCanvas.horizontalLine2 = function(x){
	this.line2(this.cX[this.cX.length-1], this.cY[this.cY.length-1]);
	return [x,this.cY[this.cY.length-1]];
};
superCanvas.verticalLine2 = function(y){
	this.line2(this.cX[this.cX.length-1], this.cY[this.cY.length-1]);
	return [this.cX[this.cX.length-1], y];
};
superCanvas.pathLengths = 
       {'L': 2,
        'M': 2,
        'C': 6,
        'S': 4,
        'Q': 4,
        'T': 2};
superCanvas.drawPath = function(dArr){
	this.cX = [];
	this.cY = [];
	this.currentPath = [];
	this.lastCommand = '';
	var d = dArr.slice(0),
    centerX=0, centerY=0, i;
	for(i = 0; i!==d.length; i++){
        var c = d[i].slice(0);
		this.currentPath.push(c.slice());
		command = c.shift();
        console.log(command);
		//while(this.pathLengths[command.toUpperCase()] <= c.length){
            //var cee = c.splice(0,this.pathLengths[command.toUpperCase()]);
            //console.log(cee);
            var C = this[superCanvas.pathCommands[command]].apply(this, c);
            this.cX.push(C[0]);
            this.cY.push(C[1]);
		    this.lastCommand = command;
            centerX += parseFloat(this.cX[this.cX.length-1]);
            centerY += parseFloat(this.cY[this.cY.length-1]);
        //}
	}
    return [centerX/this.cX.length, centerY/this.cY.length];
};
superCanvas.normalizePath = function(pathD){
    var path = [],
    lx = 0, ly = 0, i;
    var P = [];
    for(i = 0; i<pathD.length; i++){
        var newCommand = pathD[i].slice();
        nc = newCommand.shift();
        console.log(nc);
        while(this.pathLengths[nc.toUpperCase()] <= newCommand.length){
            encee = newCommand.splice(0, this.pathLengths[nc.toUpperCase()]);
            encee.unshift(nc);
            P.push(encee);
        }
    }
    pathD = P;
    for(i = 0; i<pathD.length; i++){
        command = pathD[i].slice();
        var newCommand = command;
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
                case 'm':
                case 'q':
                case 's':
                case 'c':
                case 't':
                    var I = 0;
                    newCommand[0] = newCommand[0].toUpperCase();
                    var LC = [lx,ly];
                    for(I = 2; I < newCommand.length; I+=2){
                        newCommand[I-1] = LC[0] + parseFloat(newCommand[I-1]) ;
                        newCommand[I]   = LC[1] +parseFloat(newCommand[I]);
                    }
                break;
        }
        //console.log(newCommand[0]);
        /*if(newCommand[0] === newCommand[0].toLowerCase()){
            newCommand[0] = newCommand[0].toUpperCase();
            var e = newCommand.length - 1;
            for(I = 1; I<e; I+=2){
                newCommand[I+1] = parseFloat(newCommand[I+1])+ly;
                newCommand[I] = parseFloat(newCommand[I]) + lx;
            }
                
        }*/
        if(newCommand[0].toLowerCase() !== 'z'){
            lx = parseFloat(newCommand[newCommand.length-2]);
            ly = parseFloat(newCommand[newCommand.length-1]);
        }else{
            lx =0;
            ly =0;
        }
        //console.log(newCommand.toString());
        path.push(newCommand);
    }
    return path;
};
