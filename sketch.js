//fix the randomness!!!!!

// "Kinetic Contemplations"
// By Sydney Parks
// Music by Travis Hubbard and Sydney Parks

// Description -
// "Kinetic Contemplations" is a mesmerizing NFT project created by Sydney Parks. Inspired by the discovery that snowflakes are formed by intricate hexagonal patterns, this project aims to capture the essence of that individuality. The artist has animated simple shapes in a manner that mimics the natural flow of the world, offering viewers a contemplative, peaceful, and unexpected experience.

// Through interactive controls located in the bottom right corner, collectors have the power to shape their own experience with the artwork. They can add sound, infuse color, or pause the motion to create a personalized encounter. The intention behind this piece is to serve as a daily reminder to meditate, find stillness, and become enchanted by the simplicity found within our intricately designed world.

// "Kinetic Contemplations" invites viewers to embrace the beauty and tranquility of nature's patterns, transcending the boundaries of the digital realm. With its captivating visuals and immersive interactivity, this NFT project encourages moments of reflection and serenity in an ever-moving world.

// serial communication between a microcontroller with a switch on pin 2
// arduino code can be found here : https://gist.github.com/shfitz/7fd206b7db4e0e6416a443d61c8c988e

let serial; // variable for the serial object
let latestData = "waiting for data"; // variable to hold the data

let rotationAngle = 0; //angle of rotation
let rotationSpeed = 0; //speed of rotation

let radius; //scales the amount the sin/cos moves, space in middle
let shapeSize; //Changes shape size
let numShapes; //number of shapes in the forLoop
let circleSize;
let c = 0; //color
let h; //randomize hue
let s; //randomize saturation
let b; //randomize brightness;
let a; //alpha value of stroke
let strokeW; //stroke weight

let xoff = 0; //speed of noise movement
let space; //space between each shape

let sideNum; //number of sides on the shape

//CREATE FRAME
let frameOff; //frame offset from side of canvas
let frameColor;
let frameSize;

let randomNumber; //allows me to randomize the for loops being drawn

//ADD SOUND
let soundFile;

//IMAGES ---------------------
let chalkyFilter;
//Icons
let playButton, musicButton, paintButton;
let pauseButton, musicOffbutton, cancelButton;

//Buttons
let colorEnabled = false;
let soundEnabled = false;
let pauseMovement = false;
let restartPressed = false;
let stopModeOn = false;
let timerOn = false;
let showMain = true;
let counter = 0; //counter for saved images
let displayTime = 4000; //time to display saved image
let globeScale; 
let offset; //draw shape 3
let halfHeight, halfWidth;

//Make a boolean for shapes
let shapeEnabled = false;

function preload() {
  chalkyFilter = loadImage("chalky.png");

  playButton = loadImage("play.png");
  pauseButton = loadImage("pause.png");
  musicButton = loadImage("sound.png");
  musicOffButton = loadImage("noSound.png");
  colorButton = loadImage("paint3.png");
  cancelButton = loadImage("x.png");

  //SOUND
  soundFormats("mp3");
  soundFile = loadSound("Sydney Kinetic Soundscape.mp3");
}

function randomNumberGenerator(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// when data is received in the serial buffer

function gotData() {
  let currentString = serial.readLine(); // store the data in a variable
  trim(currentString); // get rid of whitespace
  if (!currentString) return; // if there's nothing in there, ignore it
  console.log(currentString); // print it out
  latestData = currentString; // save it to the global variable
}

function setup() {
  //createCanvas(1080, 1080);
  createCanvas(window.innerWidth, window.innerHeight);
  globeScale = min(width, height); 
  // serial constructor
  serial = new p5.SerialPort();
  // get a list of all connected serial devices
  serial.list();
  serial.open("COM4");
  serial.on("data", gotData);

  //randomSeed(seedInfo); //Need this for metaversis

  colorMode(HSB);

  halfWidth = width / 2;
  halfHeight = height / 2;
  offset = width * 0.003; 
  randomNumber = randomNumberGenerator(0, 100);
  // console.log(randomNumber);
  ranCircSize = random(globeScale * 0.1, globeScale*0.3); 

  chalkyFilter.resize(width, height);

  //VARIABLE THAT ARE RANDOM
  rotationSpeed = random(0.004, 0.01);
 // rotationSpeed = 0.006; //keep at constant no matter what screen it's on
  //If numShapes is greater than a certain # then slow it down
  // if (numShapes >= 6) {
  //   rotationSpeed = 0.004;
  // }
  //rotationSpeed = width * 0.000004; //Keep rotation speed constant

  radius = random(width * 0.02, width * 0.3);
  space = random(width * 0.01, width * 0.4);
  strokeW = random(width * 0.0001, width * 0.005);
  sideNum = random(1, 9); //def 1 to

  h = random(0, 360); // hue of stroke
  s = random(0, 100); //saturation of stroke
  b = random(0, 100); //Brightness of stroke
  a = 100;

  h1 = random(0, 360); // hue of background
  s1 = random(0, 100); //saturation of background
  b1 = random(85, 100); //Brightness of background

  //FRAME
  frameOff = random(0, 30); //frame from side of canvas
  frameColor = color(random(0, 360), random(0, 100), random(0, 100));
  frameSize = random(width * 0.02, width * 0.03);
  numShapes = random(1, 7); //lower number so computer doesn't shut down

  //SOUND -----------------------------

  //ENABLE SOUND WITH BUTTON
//   if (soundEnabled) {
//     soundFile.loop();
//     latestData = "0";
//   } else {
//     soundFile.pause();
//     latestData = "0";
//   }
}

//MAKE RANDOM BE ONLY IN SETUP FUNCTION!

function draw() {
  console.log(latestData);

 if (showMain) {
    //BACKGROUND -------------------------------------------
    rectMode(CENTER);
    noStroke();
    fill(h1, s1, b1, 0.05);
    rect(width / 2, height / 2, width, globeScale);

    //RANDOM FRAME
    if (randomNumber <= 50 || randomNumber >= 75) {
      frame();
    }

    //DRAW THE SHAPES AND MAKE THEM ROTATE-----------------------
    for (let i = 0; i < numShapes; i += 0.3) {
      let size = radius + i * space; // Compute the size based on the iteration

      push();
      shapeSize = noise(xoff) * size;
      circleSize = noise(xoff * 3) * (randomNumber >= 50 ? width * 0.1 : ranCircSize);
      translate(width / 2, height / 2);
      rotate((randomNumber >= 50 ? -1 : 1) * rotationAngle * i);

      if (randomNumber <= 50) {
        drawShape3(i, i, shapeSize); //shadow
        drawShape(i, i, shapeSize);
      } else {
        drawShape2(i, i, shapeSize);
      }

      pop();
    }

    if (!pauseMovement) {
      //ANIMATE -------------------------------------------------
      xoff += 0.003; //random between 0.01, 0.003
      rotationAngle += rotationSpeed;

      if (numShapes >= 6) {
        c += 1;
        c = c % 360;
      } else {
        c += 0.05;
        c = c % 360;
      }

      //CREATE A FILTER ------------------------------------------
      blend(chalkyFilter, 0, 0, width, height, 0, 0, width, height, LIGHTEST); //LIGHTEST, DODGE
    }
  }

    //STOP MODE------------------------------
    if (stopModeOn && !timerOn) {

        //capture canvas as image 
        savedImage = get();
        saveCanvas("creativeHand" + counter, "png");
        counter ++; //increment for next save
         // Load the saved image into the savedImage variable
         displaySavedImage(); 
         latestData = "0";
         stopModeOn = false; 
  
      }

  //BUTTON -------------------------------
//   drawButton();
//   drawButton2();
//   drawButton3();

if (latestData == "1") {
    colorEnabled = !colorEnabled;
  } else if (latestData == "2") {
    pauseMovement = !pauseMovement;
  } else if (latestData == "3") {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundFile.loop();
      latestData = "0";
    } else {
      soundFile.pause();
      latestData = "0";
      soundEnabled = false;
    }
  } else if (latestData == "4") {
    restartPressed = !restartPressed;
    if (restartPressed) {
      setup();
      latestData = "0";
      restartPressed = false;
    }
  } else if (latestData == "5") {
    stopModeOn = !stopModeOn;
  }


}

function keyPressed() {
  if (key == "a" || key == "A") {
    colorEnabled = !colorEnabled;
  } else if (key == "s" || key == "S") {
    pauseMovement = !pauseMovement;
  } else if (key == "f" || key == "F") {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundFile.loop();
      latestData = "0";
    } else {
      soundFile.pause();
      latestData = "0";
      soundEnabled = false;
    }
  } else if (key == "d" || key == "D") {
    restartPressed = !restartPressed;
    if (restartPressed) {
      setup();
      latestData = "0";
      restartPressed = false;
    }
  } else if (key == "x" || key == "X") {
    stopModeOn = !stopModeOn;
  }
}

function displaySavedImage() {

   showMain = false; 
   
    imageMode(CENTER);
    image(savedImage, width/2, height/2, width/1.5, height/1.5);
  
    timerOn = true;
    //pauseMovement = true;
    timer = setTimeout(() => {
      timerOn = false;
      showMain = true;
    }, displayTime);
    
  }
  

//CREATE THE SHAPES --------------------------------------

function drawShape(x, y) {
  push();
  translate(x, y);

  beginShape();
  for (let i = 0; i < sideNum - 1; i++) {
    //change both of the numbers to change # of sides
    let angle = (i * TWO_PI) / sideNum;
    let hx = cos(angle) * shapeSize;
    let hy = sin(angle) * shapeSize;

    //CREATE CHANGE IN BRIGHTNESS AND COLOR-----------------------
    //map distnace of shapes from cente
    let distance = dist(hx, hy, halfWidth, halfHeight);
    // Calculate the brightness based on the distance
    let brightness = map(distance, 0, halfWidth, 0, 100);
    let colorValue = (c + hx + hy) % 360; // Adjust the color value to create variation

    stroke(h, s, b, a); //stroke color
    strokeWeight(strokeW);

    //ENABLE COLOR WITH BUTTON
    if (colorEnabled) {
      fill(colorValue, 80, brightness, 0.05);
      latestData = "0";
    } else {
      noFill();
      latestData = "0";
    }

    vertex(hx, hy);

    circle(hx, hy, circleSize); //Make circleSize hx for fun
  }
  endShape(CLOSE);

  pop();
}

//Draw a second shape, just change color and maybe stroke
function drawShape2(x2, y2) {
  push();
  translate(x2, y2);

  beginShape();
  for (let i = 0; i < sideNum; i++) {
    //change both of the numbers to change # of sides
    let angle = (i * TWO_PI) / sideNum;
    let hx2 = cos(angle) * shapeSize;
    let hy2 = sin(angle) * shapeSize;

    //CREATE CHANGE IN BRIGHTNESS AND COLOR-----------------------
    //map distnace of shapes from cente
    let distance2 = dist(hx2, hy2, halfWidth, halfHeight);
    // Calculate the brightness based on the distance
    let brightness2 = map(distance2, 0, halfWidth, 0, 100);
    let colorValue2 = (c + hx2 + hy2) % 360; // Adjust the color value to create variation

    stroke(h / 2, s / 2, b / 2, a); //stroke color divide all by 2 again
    strokeWeight(strokeW / 2); //divide by 2 again

    //ENABLE COLOR WITH BUTTON
    if (colorEnabled) {
      fill(colorValue2, 80, brightness2, 0.05);
    } else {
      noFill();
    }

    vertex(hx2, hy2);
    //curveVertex(hx2, hy2);

    circle(hx2, hy2, circleSize); //Make circleSize hx for fun
  }
  endShape(CLOSE);

  pop();
}

//Draw a shape that acts like a shadow
function drawShape3(x2, y2) {
  push();
  translate(x2 - offset, y2 - offset); //offset
  noFill();

  beginShape();

  for (let i = 0; i < sideNum; i++) {
    //change both of the numbers to change # of sides
    let angle = (i * TWO_PI) / sideNum;
    let hx2 = cos(angle) * shapeSize;
    let hy2 = sin(angle) * shapeSize;

    stroke(h, s, b / 3, a / 4); //stroke color divide all by 2 again
    strokeWeight(strokeW); //divide by 2 again

    vertex(hx2, hy2);
    //curveVertex(hx2, hy2);

    circle(hx2, hy2, circleSize); //Make circleSize hx for fun
  }
  endShape(CLOSE);

  pop();
}

function frame() {
  // Draw a frame
  push();
  // translate(width/2, height/2);
  stroke(frameColor); // Set the stroke color
  strokeWeight(frameSize); // Set the stroke weight
  noFill(); // Do not fill the frame
  rect(
    width / 2,
    height / 2,
    width - frameSize - frameOff,
    height - frameSize - frameOff
  );
  pop();
}


