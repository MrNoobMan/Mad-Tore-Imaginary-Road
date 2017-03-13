
function startItAll(){ //start hele greia etter onclick event i htmlen
	startScreen.style.display = "none";
	levelBox.style.display = "block";
	scoreBox.style.display = "block";
	window.init();
};

var game = new Game(); //definerer Game funksjonen som en global variablel som kan kalles etter behov

var	lvlDiv = document.getElementById("currentLVL"),
	levelBox = document.getElementById("level"),
	scoreBox = document.getElementById("score"),
	scoreDiv = document.getElementById("currentScore"),
	restartDiv = document.getElementById("gameOver"),
	loadingBar = document.getElementById("loadBar"),
	startScreen = document.getElementById("startScreen"),
	pasteHere = document.getElementById("pasteHere"),
	doItAgain = document.getElementById("doItAgain");

function init() { //starter init funksjonen til game
		game.init();
};

var imageRepository = new function() { //Prototype for all bilder
	
	this.background = new Image();
	this.madTore = new Image();
	this.bullet = new Image();
	this.enemy = new Image();
	this.bossBullet = new Image();
	this.boss = new Image();
	this.bossBg = new Image();
	this.bossBar = new Image();

	var numImages = 8,
		numLoaded = 0;
		
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			loadingBar.style.display = "none";
			startScreen.style.display = "block";	
		}
	}

/* Her loader jeg alle bilder før spille tstarter
	vil nok bruke det til å lage loadbar seinere så det blir mer å loade
*/
	this.background.onload = function() {
		imageLoaded();
	}
	this.madTore.onload = function() {
		imageLoaded();
	}
	this.bullet.onload = function() {
		imageLoaded();
	}
	this.enemy.onload = function(){
		imageLoaded();
	}
	this.bossBullet.onload = function(){
		imageLoaded();
	}
	this.boss.onload = function(){
		imageLoaded();
	}
	this.bossBar.onload = function(){
		imageLoaded();
	}
	this.bossBg.onload = function(){
		imageLoaded();
	}
	
	this.background.src = "pics/bg.jpg";
	this.madTore.src = "pics/toreCar.png";
	this.bullet.src = "pics/harambe.png";
	this.enemy.src = "pics/sqrtI.png";
	this.bossBullet.src = "pics/bossBullet.png";
	this.boss.src = "pics/lordEugen.png"
	this.bossBar.src = "pics/bossHp.jpg"
	this.bossBg.src = "pics/bossBg.jpg"
	
};

//prototype med verdier som alle bilder vil arve ellerno.
//er usikker på hvordan prototype funker
function Drawable() {
	this.init = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.isCollidableWith = "";
	this.isColliding = false;
	this.type = "";
	
	this.draw = function() {
	};
	this.move = function() {
	};
	
	//kollisjonsgreier så kollisjonsverdiene kan bruker
	this.isCollidableWith = function(object){
		return (this.isCollidableWith === object.type);
	};
	
};

//backgrunnsveien som kjører og går
function Background() {
	this.speed = 10;
	
	this.draw = function() {
		
		this.x -= this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);
		
		this.context.drawImage(imageRepository.background, this.x + this.canvasWidth, this.y);

		if (this.x <= -this.canvasWidth)
			this.x = 0;
	};
};
Background.prototype = new Drawable(); //<- background arver greiene til drawable

//kule funksjonen
function Bullet(object) {
	
	this.alive = false; //<- definerer om kula brukes eller ei
	var self = object;
	
	this.spawn = function(x, y, speed) {
		this.x = x;		
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	this.draw = function() {
		
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.x += this.speed;
				
		if(this.isColliding){
			return true;
		}
		else if (self === "bullet" && this.x > this.canvasWidth) {
			return true;
		}else if(self === "bossBullet" && this.x < -this.width){
			return true;
		}else{
			if(self === "bullet"){
			this.context.drawImage(imageRepository.bullet, this.x, this.y);
			}else if(self === "bossBullet"){
			this.context.drawImage(imageRepository.bossBullet, this.x, this.y);
			}
			return false;
		}
		
	};
	
	//må ha en clear funksjon så variable ikke blir søpla til av gamle verdier når det er flere kuler
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.isColliding = false;
	};
}
Bullet.prototype = new Drawable();

/*definerer alle "objekter" i canvaset ved å lage en array som holder på alle objekter
maxSize defninerer hvor mange objekter som vil lages til en hver tid
så sjekker den om hvert objekt er i bruk eller ei
*/
function Pool(maxSize) {
	var size = maxSize,
		pool = [];
	
	this.getPool = function(){
		var obj = [];
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				obj.push(pool[i]);
			}
		}
		return obj;
	};
	
	this.init = function(object) {
	
	if(object == "bullet"){ //her kan jeg legge til flere "object" for f. eks. andre fiender ol.
		for (var i = 0; i < size; i++) {
			var bullet = new Bullet("bullet");
			bullet.init(0,0, imageRepository.bullet.width, imageRepository.bullet.height);
			bullet.isCollidableWith = "enemy";
			bullet.type = "bullet";
			pool[i] = bullet;
		}
	}else if(object == "enemy") {
			for (var i = 0; i < size; i++) {
				var enemy = new enemyAndreas();
				enemy.init(0,0, imageRepository.enemy.width, imageRepository.enemy.height);
				pool[i] = enemy;
			}
	}else if(object == "bossBullet"){
		for(var i = 0; i < size; i++){
			var bullet = new Bullet("bossBullet");
			bullet.init(0,0, imageRepository.bossBullet.width, imageRepository.bossBullet.height);
			bullet.type = "enemy";
			pool[i] = bullet;
		}
	}
	
	};
	
	this.get = function(x, y, speed) {
	
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	};
	
	this.getDouble = function(x1, y1, speed1, x2, y2, speed2){
		
		if(!pool[size - 1].alive && !pool[size - 2].alive) {
			this.get(x1, y1, speed1);
			this.get(x2, y2, speed2);
		}
		
	};
		
	this.animate = function() { //kjører draw funksjonen til objektet som kjører for så å cleare det
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else break;
		}
	};
}

/*	samme som over, prøvde litt forjsellige løsninger for lyd men det beste så ut til å lage et Pool her også
*	som holder på alle lydelementer som brukes flere ganger samtidig.
*	prøvde å tukle med Audio.cloneNode(), men det ga DOM errorer og var bullshit
*/	
function soundPool(maxSize){
	var size = maxSize,
		pool = [],
		currentSound = 0;
		
	this.pool = pool;
	
	this.init = function(object){
		if(object == "shootSound"){
			for(var i = 0; i < size; i++){
				shootSound = new Audio("music/bullet.mp3");
				shootSound.volume = .20;
				shootSound.load();
				pool[i] = shootSound;
			}
		}else if(object == "explosion"){
			for(var i = 0; i < size; i++){
				var explosion = new Audio("music/explosion.mp3");
				explosion.volume = .50;
				explosion.load();
				pool[i] = explosion;
			}
		}else if(object == "lazor"){
			for(var i = 0; i < size; i++){
				var laser = new Audio("music/lazor.mp3");
				laser.volume = .50;
				laser.load();
				pool[i] = laser;
			}
		}
	};
	
	this.get = function(){
		if(pool[currentSound].currentTime == 0 || pool[currentSound].ended){
			pool[currentSound].play();
		}
		currentSound = (currentSound + 1) % size;
	}
	
};

//spiller funksjonen. Kan modernifiseres til å tillate multiplayer via et eget playerPool
function toreCarFunk() {
	this.speed = 5;
		
	var fireRate = 15;
	var counter = 0;

	this.isCollidableWith = "enemy";
	this.type = "playerType";
	
	this.init = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.alive = true;
		this.isColliding = false;
		this.bulletPool = new Pool(30); //lager et pool for kulene som skytes
		this.bulletPool.init("bullet");
	}
	
	this.draw = function() {
		this.context.drawImage(imageRepository.madTore, this.x, this.y);
	};
	
	this.move = function() {	
		if(this.alive){		
		counter++;
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {
			
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
			if (KEY_STATUS.left) { //beveglse
				this.x -= this.speed
				if (this.x <= 0){this.x = 0;}
			} if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width){this.x = this.canvasWidth - this.width;}
			} if (KEY_STATUS.up) {
				this.y -= this.speed*2
				if (this.y <= 100){this.y = 100;}
			} if (KEY_STATUS.down) {
				this.y += this.speed*2
				if (this.y >= this.canvasHeight - this.height- 100){this.y = this.canvasHeight - this.height - 100;}
			}
						
		}
		
		if(!this.isColliding){ //tegner spilleren hvis den ikke er kollidert
			this.draw();
		}
				
		if (KEY_STATUS.space && counter >= fireRate && !this.isColliding) {	
			this.fire();
			counter = 0;
		}
		
		if(this.isColliding){
			this.alive = false;
			this.context.clearRect(this.x, this.y, this.width, this.height);
		}
		}
	};
	
	this.fire = function() { //pang pang! kaller get til bulletPool som skyter kula
		this.bulletPool.get(this.x+this.width-imageRepository.bullet.width/2, this.y+imageRepository.bullet.height/2, 16);
		game.shootSound.get(); // spiller av skytelyd
	};
	
}

toreCarFunk.prototype = new Drawable();

//funskjon for fiende enheter nesten det samme som i de forrige funksjonene, bortsett fra automatisert "ai"
function enemyAndreas() {
	
	this.alive = false;
	this.isCollidableWith = "bullet";
	this.type = "enemy";
	
	this.spawn = function(x, y, speed, width, height){
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = true;
		this.leftEdge = 0;
		this.rightEdge = this.canvasWidth;
	}
	
	this.draw = function(){ //ai, flytter seg frem og tilbake
		
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.x += this.speedX;
		this.y += this.speedY;
		
		if(this.x <= this.leftEdge){
			this.speedX = this.speed;
		}else if(this.x >= this.rightEdge - this.width){
				this.speedX = -this.speed;
		};
		
		if(!this.isColliding){
			this.context.drawImage(imageRepository.enemy, this.x, this.y);
			return false;
		}else{
			game.score++; // score opp når objektet dør
			game.explosionSound.get();
			return true;
		}
	};
		
	this.clear = function() { // clear igjen for å ikke forsøple poolet
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = false;
		this.isColliding = false;
	};
	
};
enemyAndreas.prototype = new Drawable();

function bossHealth(){ //hp baren til bossen
	
	this.init = function(x, y){
		this.alive = true;
		this.x = x;
		this.y = y;
		this.width = imageRepository.bossBar.width;
		this.height = imageRepository.bossBar.height;
	};
	
	this.draw = function(x, y){
		this.context.clearRect(this.x, this.y, this.width, this.height);
		
		this.x = x;
		this.y = y;
		
		this.context.drawImage(imageRepository.bossBar, 0,0, this.width*game.levels.lvls.lordEugen.barPartition, this.height, this.x, this.y, this.width*game.levels.lvls.lordEugen.barPartition, this.height);
	};
	
}

bossHealth.prototype = new Drawable();

function bossShitTalk(){ //bossen sine fraser
		
	this.init = function(x, y, width, height){
		this.alive = true;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.context.font = "30px Impact";
		this.whichText = ["ER DETTE GREIT?!", "REN PLANKEJKØRING!!!", "BEGYNNER DET Å DEMRE?!", "GI ALDRI 110%", " "];
		this.returnText = "";
		this.textToPaste;
		this.lastCall = Date.now();
		this.currentChar = 0;
		this.typing = false;
	};
	
	this.draw = function(x, y){
			this.context.clearRect(this.x, this.y-40, this.width*2, 70);
		
			this.x = x;
			this.y = y;
			
			this.context.fillText(this.textToFill(), this.x, this.y);
	};
	
	this.textToFill = function(){
	
		this.deltaTalk = Date.now();
		this.randomTimer = Math.floor(Math.random()*(3000 - 1000 + 1) +  1000);
		
		if(!this.typing){
			this.rndNum = Math.floor( Math.random()*this.whichText.length);
			this.textToPaste = this.whichText[this.rndNum];
			this.typing = true;
		}
		
		if(this.typing && this.deltaTalk - this.lastCall >= 50 && this.currentChar < this.textToPaste.length){
			
			this.returnText = this.returnText.concat(this.textToPaste.charAt(this.currentChar));
			
			this.currentChar++;
			this.lastCall = Date.now();
		}else if(this.deltaTalk - this.lastCall >= this.randomTimer && this.currentChar >= this.textToPaste.length){
			this.currentChar = 0;
			this.returnText = "";
			this.typing = false;
		}
	
		return this.returnText;
	};
	
};

bossShitTalk.prototype = new Drawable();

function Boss(){ //slutt bossen
	this.isCollidableWith = "none";
	this.type = "boss";
	
	var shootChance = .02,
		chance = 0;
		
	this.init = function(x, y, speed, width, height){
		this.alive = true;
		this.healthBar = 50;
		this.bossBulletPool = new Pool(15);
		this.bossBulletPool.init("bossBullet");
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = true;
		this.leftEdge = 0;
		this.rightEdge = this.canvasWidth;
		this.bottomEdge = this.canvasHeight;
		this.startFight = false;
		this.barPartition = 1;
		this.pasteing = true;
		this.bosshealtbar = new bossHealth();
		this.bosshealtbar.init(this.x + this.width*1/5, this.y + this.height + 24);
		this.shitTalk = new bossShitTalk();
		this.shitTalk.init(this.x-this.width, this.y, this.width, this.height);
	}
	
	this.draw = function(){ //bossens ai
		
		this.context.clearRect(this.x, this.y, this.width, this.height);
		
		this.x += this.speedX;
		this.y += this.speedY;
				
		if(this.x >= this.rightEdge - this.width*3/2){
				this.speedX = -this.speed/20;
		}else{
			if(!this.startFight){
				this.speedX = 0;
				this.speedY = -this.speed/2;
				this.startFight = true;
			}
		}
		
		if(this.startFight){
			this.isCollidableWith = "bullet";
			this.type = "enemy";
			
			if(this.y > this.bottomEdge - this.height/2){
				this.speedY = -this.speed/2;
			}else if(this.y < 0){
				this.speedY = this.speed/2;
			}
			if(this.alive){
			chance = Math.floor(Math.random()*100);
			
				if (chance/100 < shootChance) {
					this.fire();
				}
				
				this.shitTalk.draw(this.x-this.width*3/2, this.y);
				this.bosshealtbar.draw(this.x + this.width*1/5, this.y + this.height + 24);
			}
		};
		
		if(this.healthBar > 0){ //hp barren til bossen
			
		if(this.isColliding){
			this.healthBar--;
			this.barPartition -= 1/50;
			this.isColliding = false;
		}
					
		this.context.drawImage(imageRepository.boss, this.x, this.y);
		
		return false;
		}else if(this.alive){ //hvis bossen dør
		this.context.clearRect(0, 0, this.canvasHeight, this.canvasWidth);
		game.score = "R";
		game.victory();
		this.alive = false;
		this.startFight = false;
		return true;
		}
		
	}
	
	this.fire = function() {
		game.laserSound.get();
		this.bossBulletPool.getDouble(this.x, this.y+50, -10, this.x+imageRepository.bossBullet.width/2, this.y+60, -10);
	};
		
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = false;
		this.isColliding = false;
	}; 
	
};

Boss.prototype = new Drawable();

var paste = "YAY! YOU DEFEATED THE EVIL IMAGINARY NUMBERS!", //ignorer, dårlig kode
	typePasta = "",
	currentChar = 0,
	timeOutVar;
	
function plankeKjoring(){ //ignorer
	
	if(currentChar < paste.length){
		typePasta = typePasta.concat(paste.charAt(currentChar));
		
		timeOutVar = setTimeout(plankeKjoring, 50);
		
	};
	
	pasteHere.innerHTML = typePasta;
	currentChar++;
	
	if(typePasta.length == paste.length){
		doItAgain.style.display = "block";
		clearTimeout(timeOutVar);
	}
	
}

function Game() { //all context og slikt. skjører ingenting hvis canvas ikke er støttet
	
	this.init = function() { //oppstart for spillet, definerer all default verdier
		
		this.bgCanvas = document.getElementById('bgCanvas');
		this.toreCarCanvas = document.getElementById('playerCanvas');
		this.mainCanvas = document.getElementById('mainCanvas');
		
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.toreCarContext = this.toreCarCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');
		
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			
			toreCarFunk.prototype.context = this.toreCarContext;
			toreCarFunk.prototype.canvasWidth = this.toreCarCanvas.width;
			toreCarFunk.prototype.canvasHeight = this.toreCarCanvas.height;
			
			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasWidth = this.mainCanvas.width;
			Bullet.prototype.canvasHeight = this.mainCanvas.height;
			
			enemyAndreas.prototype.context = this.mainContext;
			enemyAndreas.prototype.canvasWidth = this.mainCanvas.width;
			enemyAndreas.prototype.canvasHeight = this.mainCanvas.height;
			
			Boss.prototype.context = this.mainContext;
			Boss.prototype.canvasWidth = this.mainCanvas.width;
			Boss.prototype.canvasHeight = this. mainCanvas.height;
			
			bossHealth.prototype.context = this.mainContext;
			bossHealth.prototype.canvasWidth = this.mainCanvas.width;
			bossHealth.prototype.canvasHeight = this. mainCanvas.height;
			
			bossShitTalk.prototype.context = this.mainContext;
			bossShitTalk.prototype.canvasWidth = this.mainCanvas.width;
			bossShitTalk.prototype.canvasHeight = this. mainCanvas.height;
			
			this.shootSound = new soundPool(15);
			this.shootSound.init("shootSound");
			this.explosionSound = new soundPool(15);
			this.explosionSound.init("explosion");
			this.laserSound = new soundPool(15);
			this.laserSound.init("lazor");
			this.bgAudio = new Audio("music/chapterDoof.mp3");
			this.bgAudio.loop = true;
			this.bgAudio.volume = .30;
			this.bgAudio.load();
			this.sadViolin = new Audio("music/sadViolin.mp3");
			this.sadViolin.loop = true;
			this.sadViolin.volume = .70;
			this.sadViolin.load();
			this.celebrate = new Audio("music/celebrate.mp3");
			this.celebrate.loop = false;
			this.celebrate.volume = 1.00;
			this.celebrate.load();
			this.bossMusic = new Audio("music/bossMusic.mp3");
			this.bossMusic.loop = true;
			this.bossMusic.volume = .50;
			this.bossMusic.load
			
			this.won = false;
			
			this.loadSound = window.setInterval(function(){loadAudio()}, 100); 	// loader opp bakgrunnsmusikken,
																				//loader den for å ungå errors
			//her starter den faktiske tegningen av objektene
			this.background = new Background();
			this.background.init(0,0);
			
			this.toreCarFunk = new toreCarFunk(); // lag spiller
			
			this.toreCarStartX = this.toreCarCanvas.width/2 - imageRepository.madTore.width/2;
			this.toreCarStartY = this.toreCarCanvas.height/2 - imageRepository.madTore.height/2;
			this.toreCarFunk.init(this.toreCarStartX, this.toreCarStartY, imageRepository.madTore.width, imageRepository.madTore.height);
						
			this.levels = new levelFunk();  // start levelet
			this.levels.lvls.spawn();		//sjekk ut imaginaryLvls.js
			
			this.score = 0;
			this.currentLvl = 1;
		
			this.geteveryThing = new getEveryThing({ //jeg hater arrayer
				x		: 0,
				y		: 0,
				width	: this.mainCanvas.width,
				height	: this.mainCanvas.height
				});
					
			return true; //kjører hvis alt funka
		}else{
			return false;
		}
	};
	
	this.restart = function(){ // restart funksjon som resetter alle verdier når den blir kallt
		this.sadViolin.pause();
		this.celebrate.pause();
		this.won = false;
		this.sadViolin.currentTime = 0;
		this.bossMusic.currentTime = 0;
		this.celebrate.currentTime = 0;
		restartDiv.style.display = "none";
		doItAgain.style.display = "none";
		this.currentLvl = 1;
		lvlDiv.innerHTML = this.currentLvl;
		this.score = 0;
		this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
		this.toreCarContext.clearRect(0, 0, this.toreCarCanvas.width, this.toreCarCanvas.height);
		this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
		this.geteveryThing.clear();
		this.background.init(0,0);
		this.toreCarFunk.init(this.toreCarStartX, this.toreCarStartY, imageRepository.madTore.width, imageRepository.madTore.height);
		this.levels = new levelFunk();
		this.levels.lvls.enemyPool.init("enemy");
		this.levels.lvls.spawn();
		this.bgAudio.currentTime = 0;
		imageRepository.background.src = "pics/bg.jpg";
		pasteHere.innerHTML = "";
		typePasta = "";
		currentChar = 0;
		this.start();
	};
	
	this.victory = function(){ //hurrah!
		this.bgAudio.pause();
		this.bossMusic.pause();
		this.celebrate.play();
		this.won = true;
		plankeKjoring();
	};
	
	this.start = function() { //når den har initialize alt starter den animation loopen
		this.toreCarFunk.draw();
		this.bgAudio.play();
		animate();
	}
};

function loadAudio(){ //starter spillet når all de store audio filene ser lasta helt inn
	if(game.bgAudio.readyState === 4 && game.sadViolin.readyState === 4
		&& game.celebrate.readyState === 4 && game.bossMusic.readyState === 4){
		window.clearInterval(game.loadSound);
		game.start();
	};
}

function getEveryThing(){ //tar alle objekter på skermen og setter dem i arrayer og bullshit
	
	var objects = []
		
	this.clear = function(){

		objects = [];
		
	};
	
	this.getAllObjects = function(obj){
		
			if(obj instanceof Array){
				for(var i = 0, leng = obj.length; i < leng; i++){
					this.getAllObjects(obj[i]);
				}
				return;
			}
			
			if(typeof obj !== "undefined"){ //den siste dataen i arryet var undefined for en eller anna grunn, så jeg måtte få den til å ikke telle det siste elementet
				objects.push(obj);
			}	
		
			return objects;

		}
		
	this.getOnlyEnemies = function(obj){ //ubrukt legacy code, sikkert nyttig til noe
		if(obj instanceof Array){
				for(var i = 0, leng = obj.length; i < leng; i++){
					this.getAllObjects(obj[i]);
				}
				return;
			}
			
			if(typeof obj !== "undefined" && obj.type === "enemy"){ 
				objects.push(obj);
			}
		
		return objects;
	};
			
};

function detectCollision(returnedObjects) {//tar dataene fra getEveryThing og bruker det til kollisjonsdeteksjon
// kollisjons algorytme fra:
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
	var objects = returnedObjects,
		obj = returnedObjects;
	
	for( var x = 0, leng = objects.length; x < leng; x++){ //tar et objekt...
						
		for(var y = 0, len = obj.length; y < len; y++){
			
		if(!objects[x].isColliding && !obj[y].isColliding){	
			if (objects[x].isCollidableWith === obj[y].type){ //og skjekker om det kan kollidere med de andre på skjermen
					if(
						objects[x].x < obj[y].x + obj[y].width && //og ser om de faktisk kolliderer.
						objects[x].x + objects[x].width > obj[y].x &&
						objects[x].y < obj[y].y + obj[y].height &&
						objects[x].height + objects[x].y > obj[y].y
					){					
					objects[x].isColliding = true; //dreper objektene når de kolliderer.
					obj[y].isColliding = true;
				}
			}
		}
		}
	}
};

function animate() { //hodev animasjons loop som får til til å skje
	
	scoreDiv.innerHTML = game.score; //oppdater scorre
	
	game.geteveryThing.clear(); // klarerer arrayet med alle objekter, så det ikke forsøples med gamle verdier
	
		game.geteveryThing.getAllObjects(game.toreCarFunk);	// <-- skru av for godmode
		game.geteveryThing.getAllObjects(game.toreCarFunk.bulletPool.getPool());
		
	if(game.currentLvl !== 6){
		game.geteveryThing.getAllObjects(game.levels.lvls.enemyPool.getPool());
	}else if(game.currentLvl === 6){
		game.geteveryThing.getAllObjects(game.levels.lvls.lordEugen);
		game.geteveryThing.getAllObjects(game.levels.lvls.lordEugen.bossBulletPool.getPool());
	};
	detectCollision(game.geteveryThing.getAllObjects()); //setter objektene inn i kollisjonsdeteksjons tingnen

	if(!game.toreCarFunk.isColliding || game.won){ // kjør spillet hvis spilleren lever
		game.background.draw();
	
		game.toreCarFunk.move();
		
		if(game.currentLvl !== 6){
		game.levels.lvls.enemyPool.animate();
		if(game.levels.lvls.enemyPool.getPool().length === 0){ //når alle fiender i et level er drept, kjør neste level
			
			game.currentLvl++;
			if(game.currentLvl !== 6){
				lvlDiv.innerHTML = game.currentLvl;
				game.levels = new levelFunk();
				game.levels.lvls.spawn();
			}else if(game.currentLvl === 6){
				lvlDiv.innerHTML = "BOSS!";
				game.levels = new levelFunk();
				game.levels.lvls.spawn();
			}
			
		}
		}else{
			game.levels.lvls.lordEugen.draw();
			game.levels.lvls.lordEugen.bossBulletPool.animate();
		}
	
		game.toreCarFunk.bulletPool.animate(); 
		
	if(!game.won){			
		requestAnimFrame(animate);
	}
	}else{ //game over
		game.toreCarFunk.context.clearRect(game.toreCarFunk.x, game.toreCarFunk.y, game.toreCarFunk.width, game.toreCarFunk.height);
		game.bgAudio.pause();
		game.bossMusic.pause();
		game.score = "i"; // imaginært!
		game.explosionSound.get();
		game.sadViolin.play();
		fpsSpan.innerHTML = "RIP Tore ;-;7";
		scoreDiv.innerHTML = game.score;
		restartDiv.style.display = "inline";
	}
	
	fpsMeter();
	
};