(function(){
  "use strict";

  var server = require("./server.js");
  server.start("home.html", "404.html", 8080);
  console.log("Server started");
}());
