// Keymapping ting av Doug McInnes
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}

/**	
 * requestAnim shim layer av Paul Irish
 * https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
**/
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

var lastCalledTime,
	fps,
	avarageFps = 0,
	sumFps = 0,
	last10 = [],
	fpsSpan = document.getElementById("fpsMeter");

function fpsMeter() { //stjålet fra stackoverflow

	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = Math.floor(1/delta);
	last10.push(fps);
	
	if(last10.length >= 10){ //denne loopen lagde jeg
		for(var i = 0; i < last10.length; i++){
			sumFps += last10[i];
			avarageFps = Math.floor(sumFps/10);
			fpsSpan.innerHTML = avarageFps+" fps";
		}
		last10.splice(0, last10.length);
		sumFps = 0;
	}
};