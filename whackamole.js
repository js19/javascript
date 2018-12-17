var gameStart = false;
var firstPass = true;

var images; 
var timer;
var button;
var board;
var highScore;
var picture;

var time = 30;
var t;
var picTimer;
var picDownTimer;
var num = 0;
var startTimer;
var s;

//wait to window is finished loaded before grabbing 
//necessary elements and setting scores and getting 
//click handlers set up.
window.onload = function () {

	board = document.getElementsByClassName("board");
	button = document.getElementsByTagName("input");
	timer = document.getElementById("timer");
	images = document.getElementsByTagName("img");
	highScore = document.getElementById("highScore");

	if(localStorage.getItem("highScore") != null){
	highScore.innerText = localStorage.getItem("highScore");
	}else{
		highScore.innerText = 0;
	}
	button[0].addEventListener("click", beginGame);
	addClick();
}

//starts the game.
function beginGame(){
	gameStart = true;
	removeGameNotClick();
	button[0].removeEventListener("click", beginGame);
	timer.innerText = time;
	t = 30;
	document.getElementById("b5").src = "img/down.png";
	s = document.getElementById("score");
	button[0].addEventListener("click", quit);
    startTimer = setInterval(function(){ 
    	startCountDown(s) 
    }, 1000);
    
	s.innerText = 0;
}

//quit or cancel alert for clicking start
//after game has started.
function quit(t){
	if (confirm("Restart Game?")) {
        clearTimeout(startTimer);
		resetAll();
		gameOver(s);
		button[0].removeEventListener("click", quit);
		beginGame();
    }
    return;
}

//starts the countdown timer and spawning 
//of moles
function startCountDown(s){
	if(t == 0){
		gameStart = false;
		clearTimeout(startTimer);
		resetAll();
		gameOver(s);
		button[0].removeEventListener("click", quit);
		button[0].addEventListener("click", beginGame);
		addClick();
	}else{
		
		picTimer = setInterval(function(){ 
    		setImage();
    		clearTimeout(picTimer);
    	}, 20);
    	resetAll();

		picDownTimer = setInterval(function(){
    		clearTimeout(picDownTimer);
   	 	}, 1550);
   	 	removeClick();
		timer.innerText -= 1; 
		t--;
	}
}

//sets all the images back to the down image
function resetAll(){
	
	for(var x in images){
		images[x].src = "img/down.png";
	}

}

//removes the function to add a point to the score
//from click on up position
function removeClick(){
	for(var i = 0; i < images.length; i++){
		images[i].removeEventListener("click", score);
	}
}

//adds a click event to a function that alerts the player
//they need to start a game before clicking on holes.
function addClick(){
	for(var i = 0; i < images.length; i++){
		images[i].addEventListener("click", gameNotStarted);
	}
}

//remove the addClick function from the holes once the game has
//started
function removeGameNotClick(){
	for(var i = 0; i < images.length; i++){
		images[i].removeEventListener("click", gameNotStarted);
	}
}

//grabs the score element and adds plus 1 to it everytime
//there is a successful click.
function score(){
	if(gameStart){
		var s = document.getElementById("score");
		s.innerText++;
		removeClick();
		resetAll();
	}
}

//Grab a random spawn point to spawn the mole
// and add a click event to the mole.
function setImage(){

	num = Math.floor(Math.random() * 10);
	
	switch(num){
		case 1:
			document.getElementById("b1").src = "img/up.png";
			images[0].addEventListener("click", score);
        break;
        case 2:	
			document.getElementById("b2").src = "img/up.png";
			images[1].addEventListener("click", score);
        break;
        case 3:
			document.getElementById("b3").src = "img/up.png";
			images[2].addEventListener("click", score);
        break;
        case 4:
			document.getElementById("b4").src = "img/up.png";
			images[3].addEventListener("click", score);
        break;
        case 5:
			document.getElementById("b5").src = "img/up.png";
			images[4].addEventListener("click", score);
        break;
        case 6:
			document.getElementById("b6").src = "img/up.png";
			images[5].addEventListener("click", score);
        break;
        case 7:
			document.getElementById("b7").src = "img/up.png";
			images[6].addEventListener("click", score);
        break;
        case 8:
			document.getElementById("b8").src = "img/up.png";
			images[7].addEventListener("click", score);
        break;
        case 9:
			document.getElementById("b9").src = "img/up.png";
			images[8].addEventListener("click", score);
        break;

    }
}

//swaps the scores if score > high score and stores 
//high score in local storage.
function gameOver(s){
	timer.innerText = "Game Over!";
	if(parseInt(s.innerText) > parseInt(highScore.innerText)){
		highScore.innerText = s.innerText;
		localStorage.setItem("highScore", highScore.innerText);

	}

}

//function to trigger the alert for clicking a 
//hole before game has started.
function gameNotStarted(){
	alert("Press 'Start Game' to play!");
}
