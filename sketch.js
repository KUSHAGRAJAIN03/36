
//Create variables here
var dog,dogimg,happyDog,database,FoodS,foodStock,feed,addFood,fedTime,lastFed,foodObj;
var addFramecount,readState,vaccine,vaccineIMG,bedroom,garden,washroom,currenttime;

function preload()
{
  //load images here
  dogimg = loadImage("dogImg.png");
  happyDog = loadImage("Lazy.png");
  vaccineImg = loadImage("dogVaccination.png")
  bedroom=loadImage("edRoom.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
}

function setup() 
{
  database=firebase.database();
	createCanvas(1000,500);
  dog=createSprite(800,250);
  dog.addImage(dogimg);
 
  dog.scale=0.3;
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  var input=createInput("Name Pet :");
  input.position(1050,150);
  var button=createButton("play");
  button.position(1200,150);
  var message=createElement('h2');
  button.mousePressed(function()
   {
         input.hide();
         button.hide();
         var name=input.value();
         var feed = createButton("Feed "+name);
         feed.position(700,95);
         feed.mousePressed(feedDog);
       // feed.mousePressed(goToDog);
         var addFood=createButton("Add Food");
         addFood.position(800,95);
         addFood.mousePressed(addFoods);
         message.html("Meet your new pet " +name);
         message.position(1050,135);
         vaccine=createSprite(140,380);
         vaccine.addImage(vaccineImg) ;
         vaccine.scale=0.3;
   }
  )
  foodObj=new Food(20);
  readState.database.ref('gameState')
  readState.on("value",function(data)
  {
    gameState=data.val();
  })
}


function draw() {
  background(46,139,87);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("last feed :"+lastFed%12+" PM",350,30);
  }else if (lastFed===0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : ",+lastFed+" AM",350,30);
  }
  foodObj.display();

  drawSprites();
  //add styles here
  fill("white");
  text("Food remaining:"+FoodS,600,50);

  if (foodObj.foodStock>=0 && World.frameCount<addFramecount+10)
  {
    console.log("foodStock");
    image(foodObj.image,700,250,50,50);
  }

  if (gameState!=Hungry){
    feed.hide();
    addFood.hide();
    dog.remove();
    vaccine.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogimg);
    vaccine.addImage(vaccineImg);
  }

  currenttime=hour();
  if (currenttime==(lastFed=+1))
  {
    update("playing");
    foodObj.garden();
  }
  else if (currenttime==(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if (currenttime==(lastFed+3))
  {
    update("bathing");
    foodObj.washroom();
  }
  else
  {
    update("Hungry");
    foodObj.display();
  }

}

function readStock(data)
{
 FoodS=data.val();
 //foodObj.updateFoodStock(foodS);
}

function writeStock(x)
{

  if (x<=0)
  {
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

function feedDog()
{
  
  dog.addImage(happyDog);
  addFramecount=World.frameCount;
 // foodObj.velocityX=5;
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
  
}

function addFoods()
{
  
  FoodS++;
  database.ref('/').update({
    Food:FoodS
  })
  foodObj.updateFoodStock(FoodS);
} 

function update(state)
{
  database.ref('/').update({
    gameState:state
  })
}