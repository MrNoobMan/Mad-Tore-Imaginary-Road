
function levelFunk(){
	
	var thislevel = game.currentLvl; //kjører nivå utifra hvilke nivå det er
	
	if(thislevel === 2){
		this.lvls = new lvl2();
	}else if(thislevel === 3){
		this.lvls = new lvl3();
	}else if(thislevel === 4){
		this.lvls = new lvl4();
	}else if(thislevel === 5){
		this.lvls = new lvl5();
	}else if(thislevel === 6){
		this.lvls = new bossLvl();
		initated = true;
	}else{
		this.lvls = new lvl1(); // kjører level en etter at alle levla er ferdig
	}
	
};

function lvl1(){
	
	this.enemyPool = new Pool(9); //lager pool med fiender
	this.enemyPool.init("enemy");
		this.spawn = function(){ //spawner fiendene
					var height = imageRepository.enemy.height;
					var width = imageRepository.enemy.width;
					var x = game.mainCanvas.width + width;
					var y = game.mainCanvas.height/2 + height/2;
					var plusOrMinus = Math.random() < 0.5 ? -1 : 1; //ignorer, hadde nok planer til å bruke den en elleranna gang
					var spacer = y;
					for (var i = 1; i <= 9; i++) {
						this.enemyPool.get(x, y, 3);
						x += width + 25;
						if (i % 3 == 0) { // spawn i bølger på 3 og 3
							x += spacer;
							y = Math.floor(Math.random() * ((game.mainCanvas.height - height*2) - height + 1)) + height;
						}
					}
		}
};

function lvl2(){
	this.enemyPool = new Pool(12);
	this.enemyPool.init("enemy");
		this.spawn = function(){
					var height = imageRepository.enemy.height;
					var width = imageRepository.enemy.width;
					var x = game.mainCanvas.width + width;
					var y = game.mainCanvas.height/2 + height/2;
					var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
					var spacer = y;
					for (var i = 1; i <= 12; i++) {
						this.enemyPool.get(x, y, 4);
						x += width + 25;
						if (i % 4 == 0) {
							x += spacer;
							y = Math.floor(Math.random() * ((game.mainCanvas.height - height*2) - height + 1)) + height;
						}
					}
		}
};

function lvl3(){
	this.enemyPool = new Pool(10);
	this.enemyPool.init("enemy");
		this.spawn = function (){
					var height = imageRepository.enemy.height;
					var width = imageRepository.enemy.width;
					var x = game.mainCanvas.width + width;
					var y = game.mainCanvas.height/2 + height/2;
					var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
					var spacer = y;
					for (var i = 1; i <= 10; i++) {
						this.enemyPool.get(x, y, 5);
						x += width + 25;
						if (i % 5 == 0) { // spawner over hverandre og slikt
							x = game.mainCanvas.width + width;
							y = height + 25; 
						}
					}
		}
};

function lvl4(){
	this.enemyPool = new Pool(9);
	this.enemyPool.init("enemy");
		this.spawn = function (){
					var height = imageRepository.enemy.height;
					var width = imageRepository.enemy.width;
					var x = game.mainCanvas.width + width;
					var y = game.mainCanvas.height/2 + height/2;
					var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
					var spacer = y;
					for (var i = 1; i <= 9; i++) {
						this.enemyPool.get(x, y, 5);
						x += width + 25;
						if (i % 3 == 0) {
							x = game.mainCanvas.width + width;
							y -= height + 25;
						}
					}
		}
};

function lvl5(){		//gadd ikke lage mer enn 5 levels
	this.enemyPool = new Pool(12);
	this.enemyPool.init("enemy");
		this.spawn = function (){
					var height = imageRepository.enemy.height;
					var width = imageRepository.enemy.width;
					var x = game.mainCanvas.width + width;
					var y = game.mainCanvas.height/2 + height/2;
					var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
					var spacer = y;
					for (var i = 1; i <= 12; i++) {
						this.enemyPool.get(x, y, 5);
						x += width + 25;
						if (i % 4 == 0) { 
							x = game.mainCanvas.width + width;
							y -= height + 25;
						}
					}
		}
};

function bossLvl(){
	
	this.lordEugen = new Boss();
		this.spawn = function(){
			imageRepository.background.src = "pics/bossBg.jpg";
			var height = imageRepository.boss.height;
			var width = imageRepository.boss.width;
			var x = game.mainCanvas.width;
			var y = game.mainCanvas.height/2 - width/2;
			game.bgAudio.pause();
			game.bossMusic.play();
			
			this.lordEugen.init(x, y, 5, width, height);
		};
	
}