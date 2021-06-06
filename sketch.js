var dog, dogImg, dogBark;
var happyDogImg, bg;
var database;
var foodS, foodStock;
var foodI, foodImg;
var feedB, addB;
var fedTime, lastFed;
var gameState, gameStateRef;
var bedroomImg, washRoomImg, gardenImg;


function preload()
{
   dogImg = loadImage("Dog.png");
   happyDogImg = loadImage("happydog.png");
   
   bedroomImg = loadImage("Bed Room.png");
   washroomImg = loadImage("Wash Room.png");
   gardenImg = loadImage("Garden.png");
   dogBark = loadSound("dogWoof.mp3");
   foodImg = loadImage("Food Stock.png");
   foodStockImg = loadImage("Food Stock.png");
   milkImg = loadImage("Milk.png");
   livingImg = loadImage("Living Room.png");
   
}

function setup(){
database = firebase.database();
 createCanvas(800,600);

gameStateRef = database.ref('gameState');
gameStateRef.on("value", function(data){
  gameState = data.val();
})

fedTime = database.ref('FeedTime');
fedTime.on("value", function (data){
  lastFed = data.val();
})

foodI = new Food();
foodI.getFoodStock();

dog  = createSprite(650, 450, 50, 50);
dog.scale = 0.3;
dog.addImage(dogImg);

milk = createSprite(30, 550, 40, 40);
milk.addImage(milkImg);
milk.scale = 0.07;

foodBowl = createSprite(500, 500, 50, 50);
foodBowl.addImage(foodStockImg);
foodBowl.scale = 0.2;

feedB = createButton('FEED YOUR DOG');
feedB.position(550, 100);
feedB.mousePressed(feedDog);

addB = createButton('ADD FOOD');
addB.position(720, 100);
addB.mousePressed(addFood);

livingB = createButton('GO TO LIVING ROOM');
livingB.position(680, 150);
if(livingB.mousePressed(function(){
  gameState = 0;
  update(0);
}));

sleepB = createButton('I AM SLEEPY!');
sleepB.position(850, 100);
if(sleepB.mousePressed(function(){
  gameState = 1;
  update(1);
}));

bathB = createButton('I WANT TO TAKE A BATH');
bathB.position(450, 150);
if(bathB.mousePressed(function(){
  gameState = 2;
  update(2);
}));



playB = createButton('PLAY IN THE PARK');
playB.position(900, 150);
if(playB.mousePressed(function(){
  gameState = 3;
  update(3);
}));

}






function draw() {  
background("green");

if(gameState === 0){
  foodI.living();
  update(0);
  dog.visible = false;
  foodBowl.visible = false;
}

if(gameState === 1){
  foodI.bedroom();
  update(1);
  dog.visible = false;
  foodBowl.visible = false;
}
if(gameState === 2){
  foodI.washroom();
  update(2);
  dog.visible = false;
  foodBowl.visible = false;
}

if(gameState === 3){
  foodI.garden();
  update(3);
  dog.visible = false;
  foodBowl.visible = false;
}

  drawSprites();
  
  fill("black");
  textSize(25);
  if(lastFed>= 12){
    text("Last Feed:"+ lastFed%12 + "PM", 20, 30);
  }else if(lastFed === 0){
    text("Last Feed: 12 AM", 100, 100);
  }else {
    text("Last Feed:" + lastFed + "AM", 20, 30);
  }

 
fill("black");
textSize(20);
text("Food Remaining:" + foodS, 60, 580);

 


}

function readStock(data){
  foodS = data.val();
  foodI.updateFoodStock(foodS);
  foodI.deductFoodStock();
  
}




function feedDog(){
   dogBark.play();
   foodI.deductFoodStock();
   foodI.updateFoodStock(foodS);
   database.ref('/').update({
     Food: foodS,
     FeedTime: hour()
})
database.ref('gameState').update({
  'gameState': gameState
})
   
   }   


function addFood(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })

  database.ref('gameState').update({
    'gameState': gameState
  })
}

function update(state){
  database.ref('gameState').update({
    'gameState': state
  })
}
