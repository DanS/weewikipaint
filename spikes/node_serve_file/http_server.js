"use strict";

var http = require("http");
var server = http.createServer();
var fs = require("fs");

server.on("request", function(request, response){
  console.log("Received request");

  fs.readFile('file.html', function(err, data){
    if(err) throw err;
    response.end(data);
  });

  var body = "<html><head><title>Node HTTP Spike</title></head>" +
    "<body><p>Thisis a spike of Node's HTTP server.</p></body></html>";

  response.end(body);
});

server.listen(8080);

console.log("Server started");
