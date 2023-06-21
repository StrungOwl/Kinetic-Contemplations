//"Kinetic Contemplations"
//By Sydney Parks
//Music by Travis Hubbard and Sydney Parks

//Description -
//The idea for this project emerged after learning that snowflakes are made of hexagonal patterns.
//The individuality of each snowflake reminded me of generative NFTs, prompting me to animate simple shapes in a way that emulates the natural flow of the world, and elicit an experience for the viewer that is contemplative, peaceful, and unexpected.
//Using the buttons on the bottom right, the collector may control their experience by adding sound, color, or pausing motion. I am hoping that this piece can be a daily reminder to meditate, sit still, and be entranced by the simplicity within our intricate world.

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

//Make a boolean for shapes
let shapeEnabled = false;

function preload() {
  chalkyFilter = loadImage("Chalky_loRes.png");

  playButton = loadImage("play.png");
  pauseButton = loadImage("pause.png");
  musicButton = loadImage("sound.png");
  musicOffButton = loadImage("noSound.png");
  colorButton = loadImage("paint3.png");
  cancelButton = loadImage("x.png");

  //SOUND
  soundFormats("mp3");
  soundFile = loadSound("Soundscape V3.mp3");
}

function randomNumberGenerator(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setup() {
  // createCanvas(1080, 1080);
  createCanvas(window.innerWidth, window.innerHeight);

  colorMode(HSB);

  //randomSeed(409); //208, 303!, 310, 312!

  randomNumber = randomNumberGenerator(0, 100);
  console.log(randomNumber);

  chalkyFilter.resize(width, height);

  //VARIABLE THAT ARE RANDOM

  rotationSpeed = 0.006; //keep at constant no matter what screen it's on
  //If numShapes is greater than a certain # then slow it down
  if (numShapes >= 6) {
    rotationSpeed = 0.004;
  }
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
  if (soundEnabled) {
    soundFile.loop();
  } else {
    soundFile.pause();
  }
}

function draw() {
  //BACKGROUND -------------------------------------------
  rectMode(CENTER);
  noStroke();
  fill(h1, s1, b1, 0.05);
  rect(width / 2, height / 2, width, height);

  if (!pauseMovement) {
    // Code that should only run when not paused

    //RANDOM FRAME
    if (randomNumber <= 25) {
      //FRAME -------------------------------------------
      frame();
    }

    //DRAW THE SHAPES AND MAKE THEM ROTATE-----------------------

    for (let i = 0; i < numShapes; i += 0.3) {
      //change to 2 and +=0.3
      let size = radius + i * space; // Compute the size based on the iteration

      push();
      shapeSize = noise(xoff) * size;
      circleSize = noise(xoff * 3) * width * 0.1;
      translate(width / 2, height / 2);
      rotate(rotationAngle * i);
      drawShape3(i, i, shapeSize); //shadow
      drawShape(i, i, shapeSize);
      pop();
    }

    if (randomNumber >= 50) {
      //RANDOM FRAME
      if (randomNumber >= 75) {
        //FRAME -------------------------------------------
        frame();
      }

      //DRAW THE SHAPES2 AND MAKE THEM ROTATE-----------------------

      for (let i = 0; i < numShapes; i += 0.3) {
        //change to 2 and +=0.3
        let size = radius + i * space; // Compute the size based on the iteration

        push();
        shapeSize = noise(xoff) * size;
        circleSize = noise(xoff * 3) * width * 0.1;
        translate(width / 2, height / 2);
        rotate(-rotationAngle * i);
        drawShape2(i, i, shapeSize);
        pop();
      }
    }

    //ANIMATE -------------------------------------------------

    xoff += 0.003; //random between 0.01, 0.003

    //Update the rotation
    rotationAngle += rotationSpeed;

    //if the shape number increases then the speed of c increases
    if (numShapes >= 6) {
      c += 1;
      c = c % 360;
    } else {
      c += 0.05;
      c = c % 360;
    }

    //CREATE A FILTER ------------------------------------------

    // Blend the image onto your sketch
    blend(chalkyFilter, 0, 0, width, height, 0, 0, width, height, LIGHTEST); //LIGHTEST, DODGE
  }

  //BUTTON -------------------------------
  drawButton();
  drawButton2();
  drawButton3();
  
}

//CREATE THE SHAPES --------------------------------------

function drawShape(x, y) {
  push();
  translate(x, y);

  beginShape();
  for (let i = 0; i < sideNum; i++) {
    //change both of the numbers to change # of sides
    let angle = (i * TWO_PI) / sideNum;
    let hx = cos(angle) * shapeSize;
    let hy = sin(angle) * shapeSize;

    //CREATE CHANGE IN BRIGHTNESS AND COLOR-----------------------
    //map distnace of shapes from cente
    let distance = dist(hx, hy, width / 2, height / 2);
    // Calculate the brightness based on the distance
    let brightness = map(distance, 0, width / 2, 0, 100);
    let colorValue = (c + hx + hy) % 360; // Adjust the color value to create variation

    stroke(h, s, b, a); //stroke color
    strokeWeight(strokeW);

    //ENABLE COLOR WITH BUTTON
    if (colorEnabled) {
      fill(colorValue, 80, brightness, 0.05);
    } else {
      noFill();
    }

    vertex(hx, hy);
    //curveVertex(hx, hy);

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
    let distance2 = dist(hx2, hy2, width / 2, height / 2);
    // Calculate the brightness based on the distance
    let brightness2 = map(distance2, 0, width / 2, 0, 100);
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
  translate(x2 - width * 0.003, y2 - width * 0.003); //offset
  noFill();

  beginShape();

  for (let i = 0; i < sideNum; i++) {
    //change both of the numbers to change # of sides
    let angle = (i * TWO_PI) / sideNum;
    let hx2 = cos(angle) * shapeSize;
    let hy2 = sin(angle) * shapeSize;

    //CREATE CHANGE IN BRIGHTNESS AND COLOR-----------------------
    //map distnace of shapes from cente
    let distance2 = dist(hx2, hy2, width / 2, height / 2);
    // Calculate the brightness based on the distance
    let brightness2 = map(distance2, 0, width / 2, 0, 100);
    let colorValue2 = (c + hx2 + hy2) % 360; // Adjust the color value to create variation

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

//CREATE A BUTTON FOR COLOR-------------------------------------------
function drawButton() {
  push();
  let buttonSize = 50;
  let buttonX = width - buttonSize - 10;
  let buttonY = height - buttonSize - 10;

  // Draw the button shape
  fill(10);
  stroke(100, 0.5);
  ellipse(buttonX, buttonY, buttonSize, buttonSize);

  // Draw the text on the button
  imageMode(CENTER);
  image(colorEnabled ? cancelButton : colorButton, buttonX, buttonY);
  //text(colorEnabled ? "off" : "on", buttonX, buttonY);
  pop();
}

//SECOND BUTTON FOR MUSIC----------------------------
function drawButton2() {
  push();
  let buttonSize2 = 50;
  let buttonX2 = width - buttonSize2 - 70;
  let buttonY2 = height - buttonSize2 - 10;

  // Draw the button shape
  fill(10);
  stroke(100, 0.5);
  ellipse(buttonX2, buttonY2, buttonSize2, buttonSize2);

  // Draw the text on the button
  imageMode(CENTER);
  image(soundEnabled ? musicOffButton : musicButton, buttonX2, buttonY2);
  pop();
}

//THIRD BUTTON FOR PAUSING ANIMATION----------------------------
function drawButton3() {
  push();
  let buttonSize3 = 50;
  let buttonX3 = width - buttonSize3 - 130;
  let buttonY3 = height - buttonSize3 - 10;

  // Draw the button shape
  fill(10);
  stroke(100, 0.5);
  ellipse(buttonX3, buttonY3, buttonSize3, buttonSize3);

  // Draw the text on the button
  // Draw the text on the button
  imageMode(CENTER);
  image(pauseMovement ? playButton : pauseButton, buttonX3, buttonY3);
  pop();
}

function mousePressed() {
  // Check if the mouse is within the button area
  let buttonSize = 50;
  let buttonX = width - buttonSize - 35;
  let buttonY = height - buttonSize - 35;
  if (
    mouseX > buttonX &&
    mouseX < buttonX + buttonSize &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonSize
  ) {
    // Toggle the color state
    colorEnabled = !colorEnabled;
  }

  //SOUND ------------------------------------------

  // Check if the mouse is within the button area
  let buttonSize2 = 50;
  let buttonX2 = width - buttonSize2 - 100;
  let buttonY2 = height - buttonSize2 - 40;
  if (
    mouseX > buttonX2 &&
    mouseX < buttonX2 + buttonSize2 &&
    mouseY > buttonY2 &&
    mouseY < buttonY2 + buttonSize2
  ) {
    if (soundEnabled) {
      soundFile.pause(); // Pause the sound file
    } else {
      soundFile.loop(); // Resume playing the sound file
    }

    soundEnabled = !soundEnabled; // Toggle the play state
  }

  //MOVEMENT ------------------------------------------
  // Check if the mouse is within the button area
  let buttonSize3 = 50;
  let buttonX3 = width - buttonSize3 - 160;
  let buttonY3 = height - buttonSize3 - 40;
  if (
    mouseX > buttonX3 &&
    mouseX < buttonX3 + buttonSize3 &&
    mouseY > buttonY3 &&
    mouseY < buttonY3 + buttonSize3
  ) {
    if (pauseMovement) {
      loop(); // Resume the draw loop
      pauseMovement = false;
    } else {
      noLoop(); // Pause the draw loop
      pauseMovement = true;
    }
  }

  return false; //This debugs errors when touching on devices
}
