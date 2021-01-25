// Keep track of our socket connection
// Start a socket connection to the server
var socket = io();

var currentClientData = {};
var chatHistory = [];

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
});

// Callback function for when msg enters 'chat message' event
socket.on('chat message', function(msg) {
    chatHistory.push(msg);
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    console.log(chatHistory);
    //window.scrollTo(0, document.body.scrollHeight);
});

// Callback function for when data enters 'mouse' event
socket.on('mouse', function(data) {
    console.log("Got: " + data.x + " " + data.y);

    // What a user draws is shown to others as blue circles
    fill(data.rgb);
    noStroke();
    ellipse(data.x, data.y, 80, 80);
});

function setup() {
    var canvasWidth = 800;
    var canvasHeight = 600;

    // initialize user data,
    // e.g. user color
    var init_r = round(random(255));
    var init_g = round(random(255));
    var init_b = round(random(255));
    var init_rgb = [init_r, init_g, init_b];
    currentClientData.selectedColor = init_rgb;
    currentClientData.choiceColor = init_rgb;
    currentClientData.eraseColor = [0,0,0];
    currentClientData.erase = false;
    socket.emit('currentClientData', currentClientData);

    var myCanvas = createCanvas(canvasWidth, canvasHeight);
    myCanvas.parent('canvasDiv');
    background(0);
}

function draw() {
    // nothing
}

function mouseDragged() {
    var rgb = currentClientData.selectedColor;
    // User draws white circles
    fill(rgb);
    noStroke();
    ellipse(mouseX, mouseY, 80, 80);
    // Send the mouse coordinates for socket to receive
    sendMouse(mouseX, mouseY, rgb);
}

// Function for sending the mouse cooridnates to 'mouse' event
function sendMouse(xpos, ypos, rgb) {
    // We are sending!
    console.log("sendMouse: " + xpos + " " + ypos);

    // A simple wrapper for the mouse coordinates
    var data = {
        x: xpos,
        y: ypos,
        rgb: rgb
    };

    // Send the data to 'mouse' channel.
    // the data is handled at the server,
    // which is then emitted back to other users.
    socket.emit('mouse', data);
}

function keyPressed() {
    elementInFocus = document.activeElement.id;
    console.log(elementInFocus);
    if (elementInFocus == "canvasDiv"){
      // Toggle Drawing mode and Erase Mode
      if (keyCode === UP_ARROW) {
          currentClientData.erase = !currentClientData.erase;
          if (currentClientData.erase){
              currentClientData.selectedColor = currentClientData.eraseColor;
          }
          else {
              currentClientData.selectedColor = currentClientData.choiceColor;
          }
          // There's no real reason to send this data to server,
          // but for now let's just watch.
          socket.emit('currentClientData', currentClientData);
      }
    }
  // return false; // prevents other elements from interacting with key press
}