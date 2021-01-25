// Keep track of our socket connection
// Start a socket connection to the server
var socket = io();

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

socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// Callback function for when data enters 'mouse' channel
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
    var myCanvas = createCanvas(canvasWidth, canvasHeight);
    myCanvas.parent('canvasDiv');
    background(0);
}

function draw() {
    // nothing
}

function mouseDragged() {
    scale_r = random(255);
    scale_g = random(255);
    scale_b = random(255);
    var rgb = [scale_r, scale_g, scale_b];
    // User draws white circles
    fill(rgb);
    noStroke();
    ellipse(mouseX, mouseY, 80, 80);
    // Send the mouse coordinates for socket to receive
    sendMouse(mouseX, mouseY, rgb);
}

// Function for sending the mouse cooridnates to 'mouse' channel
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