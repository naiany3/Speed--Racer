var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var car,car2;
var carimg,car2img;
var track;
var cars = [];
var allPlayers;
var fuelImage,powerCoinImage;
var obstacle1Image,obstacle2Image;
var fuels,powerCoin,obstacles;
var lifeImage,blastImage;

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  carimg = loadImage("./assets/car1.png");
  car2img = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  fuelImage = loadImage("./assets/fuel.png");
  powerCoinImage = loadImage("./assets/goldCoin.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImage = loadImage("./assets/life.png");
  blastImage = loadImage("./assets/blast.png");

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  bgImg = backgroundImage;
}

function draw() {
  background(bgImg);
  if(playerCount === 2){
    game.update(1)
  }
  if(gameState === 1){
    game.play()

  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}