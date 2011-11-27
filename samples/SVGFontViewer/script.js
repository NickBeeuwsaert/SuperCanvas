/*
Example program to demonstrate SuperCanvas
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
//This needs some MAJOR refactoring, and recoding. vim may be my favourite editor, but that doesn't mean I am proficient at it :/
// Also this needs to be run through jslint
// I am abit scared though, crockford might hunt me down
(function(){
	var fontsList = document.getElementById("fonts"),
	glyphsList= document.getElementById("glyphs"),
	svg_url= document.getElementById("svg_url"),
	content = document.getElementById("content"),
	canvas = document.getElementById("glyphView"),
	zoom = document.getElementById("zoom"),
	ctx = superCanvas(canvas),
    queries= {},
    activeSVG,
    currentGlyphData,
	fetch = function(url, callback,proxy){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function(evt){
			if(xhr.readyState === 4){
				if(xhr.status === 200){
					callback(xhr);
				}else{
					console.log("Error!", xhr.statusText);
				}
			}
		};
		xhr.send();
	},
    // It is worth noting, I didn't write this function.
    //  That is the reason it is so neat and awesome! 
    text2XML = function(xml){
        var x;
        if(window.DOMParser){
            x=new window.DOMParser().parseFromString(xml,'text/xml');
        }else{
            x=new window.ActiveXObject('Microsoft.XMLDOM');
            x.async='false';x.loadXML(xml);
        }
        return x;
    }, 
	draw = function(){
		canvas.width = document.querySelector(".content").clientWidth;
		canvas.height = document.querySelector(".content").clientHeight;
        //console.log(this.currentGlyphData);
        if(this.activeSVG && this.currentGlyphData){
            var fontFace = this.activeSVG.querySelector("defs font-face[font-family='"+this.currentGlyphData.fontName+"']");
            var font, glyph;
            if(fontFace){
                font = fontFace.parentElement;
                glyph = font.querySelector("glyph[unicode=\""+this.currentGlyphData.glyphName.replace('"', '\\"')+"\"]");
            }
        if(glyph){
        ctx.strokeStyle="rgb(0,0,0, 0.2)";
        ctx.lineWidth = 0.5;
		ctx.save();
        ctx.translate(canvas.scrollX, canvas.scrollY);
		ctx.scale(1, -1);
        var scale = zoom.value / 100;
        ctx.scale(scale, scale);
		//ctx.translate(0,(-canvas.descent)-200);
		ctx.translate(0,-canvas.height);
        ctx.beginPath();
        //console.log(fontFace.getAttribute("ascent"));

        ctx.moveTo((-canvas.scrollX)/scale, fontFace.getAttribute("ascent"));
        ctx.lineTo((canvas.width + -canvas.scrollX)/scale, fontFace.getAttribute("ascent"));

        ctx.moveTo((-canvas.scrollX)/scale, fontFace.getAttribute("descent"));
        ctx.lineTo((canvas.width + -canvas.scrollX)/scale, fontFace.getAttribute("descent"));
        var z = canvas.height + (canvas.scrollY/scale);
        ctx.moveTo(0, z - (canvas.height/scale));//-(canvas.scrollY/scale));
        ctx.lineTo(0, z);

        ctx.moveTo((-canvas.scrollX)/scale, 0);
        ctx.lineTo((canvas.width + -canvas.scrollX)/scale, 0);

        ctx.font = "12pt sans-serif";
        ctx.fillTextU("Baseline", 0, 0);
        ctx.fillTextU("Ascent", 0, fontFace.getAttribute("ascent"));
        ctx.fillTextU("Descent", 0, fontFace.getAttribute("descent"));
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle="#f00";
        ctx.lineWidth = 1;
		ctx.beginPath();
        var unNormalizedPath = ctx.parsePath(glyph.getAttribute('d'));
        var pathData = ctx.normalizePath(unNormalizedPath);
        //console.log(d);
		//console.log(pathData);
		var center = ctx.drawPath(pathData.slice(0));
        var aCX = ((center[0] + canvas.scrollX) - canvas.width/2);
        var aCY = ((center[1] + -canvas.scrollY) - canvas.height/2);
        var d = Math.sqrt(Math.pow(aCX, 2) + Math.pow(aCY,2));
        ctx.fill();
        if(queries.debug){
            ctx.stroke();
        }
		ctx.closePath();
        var radius = canvas.width>canvas.height?canvas.height/2:canvas.width/2;
        if(radius+200 < d){
            ctx.beginPath();
            ctx.save();
            ctx.setTransform(1,0,0,1,0,0);
            var rad = Math.atan2(aCY, aCX);
            var X = (canvas.width / 2) + radius * Math.cos(rad);
            var Y = (canvas.height / 2) + radius * Math.sin(rad);
            //X = Math.max(X, canvas.width);
            //ctx.arc((-canvas.scrollX) + canvas.width / 2,canvas.scrollY + canvas.height/2, radius, 0, Math.atan2(aCY, aCX), false);
            //ctx.rect(X,i Y, 10, 10);
            ctx.scale(1,-1);
            ctx.translate(0,-canvas.height);
            ctx.translate(X, Y);
            ctx.rotate(rad + Math.PI/2);
            ctx.scale(2,2);
            //ctx.translate(0,-canvas.height);
            ctx.moveTo(0,0);
            ctx.lineTo(3,10);
            ctx.lineTo(0,7);
            ctx.lineTo(-3, 10);
            ctx.lineTo(0,0);
            ctx.stroke();
            ctx.restore();
            ctx.closePath();
        } 
        if(queries.debug === true){
        pathData.forEach(function(e, i){
            ctx.save();
            var X = e[e.length-2],
                Y = e[e.length-1];
            ctx.translate(X, Y);
            ctx.scale(1, -1);
            ctx.beginPath();
            ctx.fillStyle="red";
            ctx.rect(-3,-3, 6, 6);
            if(ctx.isPointInPath(canvas.currentX, canvas.currentY)){
            ctx.fill();
            ctx.fillStyle="black";
            ctx.globalCompositeOperation = 'xor';
            ctx.font = "12pt sans-serif";
            ctx.fillText(e.toString(), 0, 0);
            ctx.strokeText(e.toString(), 0, 0);
            //ctx.fillText(unNormalizedPath[i].toString(), 10, 12);
            //ctx.strokeText(unNormalizedPath[i].toString(), 10, 12);
            ctx.globalCompositeOperation = 'source-over';
            }
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        });
        }
		ctx.restore();
        }
        }
        setTimeout((function(T){
            return function(){draw.call(T);};
        }(this)), 1000 / 24);
	},
	zoomHandle = function(){
		//content.style.zoom = this.value+"%"
	},
    clearSelect = function(which){
			while(which.firstChild){
				which.removeChild(which.firstChild);
            }
    },
    loadFonts = function(){
        var defs = this.activeSVG.querySelector("defs"),
            i = 0,
		fonts = [].slice.call(defs.querySelectorAll("font"));
		for(i = 0,val=0; i!== fonts.length; i++, val = fonts[i]){
            val = fonts[i];
			var fontFace = val.querySelector("font-face"),I = 0,
			glyphs = [].slice.call(val.querySelectorAll("glyph")),
			fontID = val.getAttribute("id"),
			fontAscent = fontFace.getAttribute("ascent"),
			fontDescent = fontFace.getAttribute("descent"),
			fontName = fontFace.getAttribute("font-family"),
			option = document.createElement("option");
            option.docFrag = document.createDocumentFragment();
			option.innerHTML = fontName;
			option.setAttribute("svg-id", fontID);
			option.setAttribute("ascent", fontAscent);
			option.setAttribute("descent", fontDescent);
			for(I = 0; I!==glyphs.length; I++){
				var gOption = document.createElement("option"),
                    g = glyphs[I],
                    glyphName = g.getAttribute('glyph-name'),
                    unicode = g.getAttribute('unicode');
				gOption.innerHTML = glyphName +' (' + g.getAttribute('unicode') + ')';
				var d =  g.getAttribute('d');
			    var horz= g.getAttribute('horiz-adv-x');
			    var ascent= g.getAttribute('ascent');
			    var descent= g.getAttribute('descent');
                if(queries.fontName ===fontName && unicode === queries.unicode){
                    console.log("sd");
				    canvas.descent = g.getAttribute("descent");
				    canvas.ascent = g.getAttribute("ascent");
                   this.currentGlyphData = {'fontName': fontName, 'glyphName': unicode};
                }
                var T = this;
				gOption.addEventListener('click', function(e){
                    T.currentGlyphData = {'fontName': fontName, 'glyphName': unicode};
                        //showGlyph(horz, d);
                        //currentGlyph = glyphName;
                    }, false);
				option.docFrag.appendChild(gOption);
			}	
			option.addEventListener("click", function(ev){
				//ctx.restore();
				//ctx.save();
				//ictx.scale(1,0);// this.getAttribute("descent"));
				clearSelect(glyphsList);
				canvas.descent = this.getAttribute("descent");
				canvas.ascent = this.getAttribute("ascent");
                glyphsList.appendChild(this.docFrag);
			}, false);

			fontsList.appendChild(option);
		} 
    },
    activateFont = function(){
    },
	loadSVG = function(){
        var T = this;
        clearSelect(fontsList);
	if(svg_url.value.substr(0,7) !== "http://"){
	fetch(svg_url.value, function(x){
            this.activeSVG = x.responseXML;
			loadFonts();
	},true);
	}else{
        jsonp.net(svg_url.value, function(response){
            T.activeSVG = text2XML(response.body);
            loadFonts.call(T);
        });
	}
	};
	zoom.addEventListener("change", zoomHandle, false);
	zoom.addEventListener("mouseup", zoomHandle, false);
	svg_url.addEventListener("keyup", function(e){
			if(e.keyCode === 13){
				loadSVG();
            }
	}, false);
    var URL = document.location.toString(), i = 0;
    query = URL.substring(URL.indexOf('?')+1, URL.length).split('&');
    for(i = 0; i!==query.length; i++){
        sp = query[i].split('=');
        queries[decodeURIComponent(sp[0])]=decodeURIComponent(sp[1]);
        console.log(sp);
    }
    if(queries.url===undefined){
        queries.url = "fonts/arial.svg";
    }
    svg_url.value = queries.url;
    zoom.value = queries.zoom || 100;
	draw();
    loadSVG();
    canvas.addEventListener("mousemove", function(ev){
        var x = ev.clientX - this.offsetLeft,
            y = ev.clientY - this.offsetTop;
        this.currentX = x;
        this.currentY = y;
        this.relX = x - (this.prevX || 0);
        this.relY = y - (this.prevY || 0);
        this.prevX = x;
        this.prevY = y;
        if(this.clicking && this.keyCode === '17'){
            this.scrollX = (this.scrollX || 0) + this.relX;
            this.scrollY = (this.scrollY || 0) + this.relY;
        }
        //console.log(this.relX, this.relY);
    }, false);
    canvas.addEventListener("mousedown", function(ev){
        this.clicking = true;
    }, false);
    canvas.addEventListener("mouseup", function(ev){
        this.clicking = false;
    }, false);
    canvas.addEventListener("mousewheel", function(ev){
        if(this.keyCode === '16'){
            zoom.value = parseInt(zoom.value,10) + ev.wheelDelta/10;
        }
    }, false);
    document.addEventListener("mousewheel", function(ev){
    }, false);
    document.addEventListener("keydown", function(ev){
        canvas.keyCode = ev.keyCode;
        if(ev.keyCode === 17){
            canvas.style.cursor = "move";
        }
    }, false);
    document.addEventListener("keyup", function(ev){
        canvas.keyCode = null;
            canvas.style.cursor = "default";
    }, false);
    canvas.addEventListener("selectstart",function(e){e.preventDefault(); return false; }, false);
}());
