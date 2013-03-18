(function(){
  "use strict";

  var server = require("./server.js");
  var http = require("http");
  var fs = require('fs');
  var testDir = "generated/test";
  var assert = require('assert');
  var TEST_FILE = testDir + "/test.html";

  exports.tearDown = function(done){
    if(fs.existsSync(TEST_FILE)){
      fs.unlinkSync(TEST_FILE);
      assert.ok(!fs.existsSync(TEST_FILE), "could not delete test file [" + TEST_FILE + ']');
    }
    done();
  };

  exports.test_serverHomePageFromFile = function(test){
    var testData = "This is served from a file";
    fs.writeFileSync(TEST_FILE, testData);
    httpGet("http://localhost:8080", function(response, responseData){
      test.equals(200, response.statusCode, "status code");
      test.equals(testData, responseData, "response text");
      test.done();
    });
  };

  function httpGet(url, callback ){
    server.start(TEST_FILE, 8080);
    var request = http.get(url);
    request.on("response", function(response){
      var receivedData = "";
      response.setEncoding("utf8");

      response.on("data", function(chunk){
        receivedData += chunk;
      });
      response.on("end", function(){
        server.stop(callback(response, receivedData));
      });
    });
  }

  exports.test_serverReturns404ForEverythingExceptHomePage = function(test){
    httpGet("http://localhost:8080/bargle", function(response, responseData){
      test.equals(404, response.statusCode, "status code");
      test.done();
    });
  };

  exports.test_serverHomePageWhenAskedForIndex = function(test){
    var testData = "This is served from a file";
    fs.writeFileSync(TEST_FILE, testData);
    httpGet("http://localhost:8080/index", function(response, responseData){
      test.equals(200, response.statusCode, "status code");
      test.done();
    });
  };

  exports.test_serverRequiresFileToServe = function(test){
    test.throws(function(){
      server.start();
    });
    test.done();
  };

  exports.test_serverRequiresPortNumber = function(test){
    test.throws(function(){
      server.start(TEST_FILE);
    });
    test.done();
  };

  exports.test_serverRunsCallbackWhenStopCompletes = function(test){
    server.start(TEST_FILE, 8080);
    server.stop(function(){
      test.done();
    });
  };

  exports.test_stopCalledWhenServerisntRunningThrowsException = function(test){
    test.throws(function(){
      server.stop();
    });
    test.done();
  };
})();
