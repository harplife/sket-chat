// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// HTTP Portion
var server = require('http').createServer(handleRequest);
var path = require('path');
// Using the filesystem module
var fs = require('fs');

server.listen(8080, function() {
    console.log("listening on *:8080");
});

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;
  
  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }
  
  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}

// WebSocket portion
// WebSocket work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each user that connects
// We are given a websocket object in our function
io.on('connection', function(socket) {
    console.log("User " + socket.id + " has joined the channel.");

    // Receives data when a user sends data to 'mouse' channel
    socket.on('mouse', function(data) {
        console.log("Received: 'mouse' " + data.x + " " + data.y);
        // Broadcasts data to other users
        socket.broadcast.emit('mouse', data);
    });

    // Callback function that run when a user disconnects
    socket.on('disconnect', function() {
        console.log("User " + socket.id + " has left the channel.");
    });
});