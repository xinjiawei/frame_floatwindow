<!--//公共脚本文件 main.js
function addEvent(obj, evtType, func, cap) {
	cap = cap || false;
	if (obj.addEventListener) {
		obj.addEventListener(evtType, func, cap);
		return true;
	} else if (obj.attachEvent) {
		if (cap) {
			obj.setCapture();
			return true;
		} else {
			return obj.attachEvent("on" + evtType, func);
		}
	} else {
		return false;
	}
}
function removeEvent(obj, evtType, func, cap) {
	cap = cap || false;
	if (obj.removeEventListener) {
		obj.removeEventListener(evtType, func, cap);
		return true;
	} else if (obj.detachEvent) {
		if (cap) {
			obj.releaseCapture();
			return true;
		} else {
			return obj.detachEvent("on" + evtType, func);
		}
	} else {
		return false;
	}
}
function getPageScroll() {
	var xScroll, yScroll;
	if (self.pageXOffset) {
		xScroll = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollLeft) {
		xScroll = document.documentElement.scrollLeft;
	} else if (document.body) {
		xScroll = document.body.scrollLeft;
	}
	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop) {
		yScroll = document.documentElement.scrollTop;
	} else if (document.body) {
		yScroll = document.body.scrollTop;
	}
	arrayPageScroll = new Array(xScroll, yScroll);
	return arrayPageScroll;
}


// 获取页面的高度、宽度
function GetPageSize() {
    var xScroll, yScroll;
    if (window.innerHeight && window.scrollMaxY) {
        xScroll = window.innerWidth + window.scrollMaxX;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else {
        if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac    
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari    
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }
    }

    var windowWidth, windowHeight;
    if (self.innerHeight) { // all except Explorer    
        if (document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            windowWidth = self.innerWidth;
        }
        windowHeight = self.innerHeight;
    } else {
        if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else {
            if (document.body) { // other Explorers    
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }
        }
    }       

    // for small pages with total height less then height of the viewport    
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }    

    // for small pages with total width less then width of the viewport    
    if (xScroll < windowWidth) {
        pageWidth = xScroll;
    } else {
        pageWidth = windowWidth;
    }
    arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
    return arrayPageSize;
}



//广告脚本文件 AdMove.js
/*
例子   加<div></div>  是为了判断飘窗内容为空时隐藏飘窗
<div id="Div2">
	<div></div>
	***** content ******
	</div>
</div>
var ad=new AdMove("Div2");
ad.Run();
*/
////////////////////////////////////////////////////////
var AdMoveConfig = new Object();
AdMoveConfig.IsInitialized = false;
AdMoveConfig.AdCount = 0;
AdMoveConfig.ScrollX = 0;
AdMoveConfig.ScrollY = 0;
AdMoveConfig.MoveWidth = 0;
AdMoveConfig.MoveHeight = 0;
AdMoveConfig.Resize = function () {
	var winsize = GetPageSize();
	AdMoveConfig.MoveWidth = winsize[2];
	AdMoveConfig.MoveHeight = winsize[3];
	AdMoveConfig.Scroll();
}
AdMoveConfig.Scroll = function () {
	var winscroll = getPageScroll();
	AdMoveConfig.ScrollX = winscroll[0];
	AdMoveConfig.ScrollY = winscroll[1];
}
addEvent(window, "resize", AdMoveConfig.Resize);
addEvent(window, "scroll", AdMoveConfig.Scroll);
function AdMove(id, addCloseButton) {
	if (!AdMoveConfig.IsInitialized) {
		AdMoveConfig.Resize();
		AdMoveConfig.IsInitialized = true;
	}
	AdMoveConfig.AdCount++;
	var obj = document.getElementById(id);
	obj.style.position = "absolute";
	obj.style.zIndex = "999";
	var W = AdMoveConfig.MoveWidth - obj.offsetWidth;
	var H = AdMoveConfig.MoveHeight - obj.offsetHeight;
	var x = W * Math.random(), y = H * Math.random();
	var rad = (Math.random() + 1) * Math.PI / 6;
	var kx = Math.sin(rad), ky = Math.cos(rad);
	var dirx = (Math.random() < 0.5 ? 1 : -1), diry = (Math.random() < 0.5 ? 1 : -1);
	var step = 1;
	var interval;
	if (addCloseButton) {
		var closebtn = document.createElement("span");
		closebtn.className='close_btn';
		closebtn.innerHTML="关闭窗口";
		obj.appendChild(closebtn);

		closebtn.onclick = function () {
			obj.style.display = "none";
			clearInterval(interval);
			closebtn.onclick = null;
			obj.onmouseover = null;
			obj.onmouseout = null;
			obj.MoveHandler = null;
			AdMoveConfig.AdCount--;
			if (AdMoveConfig.AdCount <= 0) {
				removeEvent(window, "resize", AdMoveConfig.Resize);
				removeEvent(window, "scroll", AdMoveConfig.Scroll);
				AdMoveConfig.Resize = null;
				AdMoveConfig.Scroll = null;
				AdMoveConfig = null;
			}
		}
		/*判断飘窗内容是否为空，为空就隐藏*/
		function removeHTMLTag(str) {
				//str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
				str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
				str = str.replace(/[\r\n]/g,""); //去除多余空行
				str=str.replace(/ /ig,'');//去掉&nbsp;
				return str;
		}
		var oDiv=obj.getElementsByTagName('div')[0];
		if(removeHTMLTag(oDiv.innerHTML) ==""){
			obj.style.display = "none";
		}
		
	}
	obj.MoveHandler = function () {
		obj.style.left = (x + AdMoveConfig.ScrollX) + "px";
		obj.style.top = (y + AdMoveConfig.ScrollY) + "px";
		rad = (Math.random() + 1) * Math.PI / 6;
		W = AdMoveConfig.MoveWidth - obj.offsetWidth;
		H = AdMoveConfig.MoveHeight - obj.offsetHeight;
		x = x + step * kx * dirx;
		if (x < 0) { dirx = 1; x = 0; kx = Math.sin(rad); ky = Math.cos(rad); }
		if (x > W) { dirx = -1; x = W; kx = Math.sin(rad); ky = Math.cos(rad); }
		y = y + step * ky * diry;
		if (y < 0) { diry = 1; y = 0; kx = Math.sin(rad); ky = Math.cos(rad); }
		if (y > H) { diry = -1; y = H; kx = Math.sin(rad); ky = Math.cos(rad); }
	}
	this.SetLocation = function (vx, vy) { x = vx; y = vy; }
	this.SetDirection = function (vx, vy) { dirx = vx; diry = vy; }
	this.Run = function () {
		var delay = 10;
		interval = setInterval(obj.MoveHandler, delay);
		obj.onmouseover = function () { clearInterval(interval); }
		obj.onmouseout = function () { interval = setInterval(obj.MoveHandler, delay); }
	}
}
//-->