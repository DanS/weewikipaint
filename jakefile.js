/*global desc, task, jake, fail, complete, directory */

(function(){
  "use strict";
  var NODE_VERSION = "v0.8.6";
  var SUPPORTED_BROWSERS = ["Firefox 19.0 (Mac)", "Chrome 27.0 (Mac)"];
  var GENERATED_DIR = 'generated';
  var TEMP_TESTFILE_DIR = GENERATED_DIR + '/test';
  var lint = require("./build/lint/lint_runner.js");
  var nodeUnit = require("nodeunit").reporters['default'];

  directory(TEMP_TESTFILE_DIR);
  console.log("_________________________________________________\n\n\n");

  var red, green, reset;
  red   = '\u001b[31m';
  green  = '\u001b[32m';
  reset = '\u001b[0m';

  desc("Delete all generated files");
  task("clean", [], function(){
    jake.rmRf(GENERATED_DIR);
  });

  desc("build and test");
  task("default", ["lint", "test"]);

  desc("Lint everything");
  task("lint", ["lintNode", "lintClient"]);


  task("lintNode", ["nodeVersion"], function(){
    var passed = lint.validateFileList(nodeFiles(), nodeLintOptions(), {});
    if (!passed)  fail(red + "Lint failed" + reset);
  });

  task("lintClient", function(){
    var passed = lint.validateFileList(clientFiles(), browserLintOptions, {});
    if (!passed)  fail(red + "Lint failed" + reset);
  });

  desc("integrate");
  task("integrate", ["default"], function(){
    console.log("integration logic goes here");
  });

  desc("Test everything");
  task("test", ["testNode", "testClient"]);

  desc("Test server code");
  task("testNode", ["nodeVersion", TEMP_TESTFILE_DIR], function(){
    nodeUnit.run(nodeTestFiles(), null, function(failures){
      if(failures){
        fail(red + "Tests failed" + reset);
      }else{
        console.log(green + "Tests Passed" + reset);
      }
      complete();
    });
  }, { async: true });

  desc("Test client code");
  task("testClient", function(){
    sh("node node_modules/.bin/testacular run", "Client tests failed", function(output){
      SUPPORTED_BROWSERS.forEach(function(browser){
        assertBrowserIsTested(browser, output);
      });
    });
  }, {async: true});

  function assertBrowserIsTested(browserName, output){
    var searchString = browserName + ": Executed";
    var found = output.indexOf(searchString) !== -1;
    if(!found){
      fail(red + browserName + " was not tested!" + reset);
    }
  }

  desc("Deploy to Heroku");
  task("deploy", ["default"], function(){
    console.log("1. Make sure git status is clean.");
    console.log("2. 'git push heroku master'");
    console.log("3. 'jake releasetest'");
  });

  desc("Integrate");
  task("integrate", ["default"], function(){
    console.log("1. Make sure git status is clean.");
    console.log("2. Build on integration box");
    console.log("   a. walk over to integration box.");
    console.log("   b. 'git pull'");
    console.log("   c. 'jake'");
    console.log("   d. If jake fails, stop! Try again after fixing the issue");
    console.log("3. 'git checkout integration'");
    console.log("4. 'git merge master --no-ff, --log'");
    console.log("5. 'git checkout master'");
  });

  //	desc("Ensure correct version of Node is present. Use 'strict=true' to require exact match");
  task("nodeVersion", [], function() {
    function failWithQualifier(qualifier) {
      fail(red + "Incorrect node version. Expected " + qualifier +
           " [" + expectedString + "], but was [" + actualString + "]." + reset);
    }

    var expectedString = NODE_VERSION;
    var actualString = process.version;
    var expected = parseNodeVersion("expected Node version", expectedString);
    var actual = parseNodeVersion("Node version", actualString);

    if (process.env.strict) {
      if (actual[0] !== expected[0] || actual[1] !== expected[1] || actual[2] !== expected[2]) {
        failWithQualifier("exactly");
      }
    }
    else {
      if (actual[0] < expected[0]) failWithQualifier("at least");
      if (actual[0] === expected[0] && actual[1] < expected[1]) failWithQualifier("at least");
      if (actual[0] === expected[0] && actual[1] === expected[1] && actual[2] < expected[2]) failWithQualifier("at least");
    }
  });

  function parseNodeVersion(description, versionString) {
    var versionMatcher = /^v(\d+)\.(\d+)\.(\d+)$/;    // v[major].[minor].[bugfix]
    var versionInfo = versionString.match(versionMatcher);
    if (versionInfo === null) fail(red + "Could not parse " + description + " (was '" + versionString + "')" + reset);
    var major = parseInt(versionInfo[1], 10);
    var minor = parseInt(versionInfo[2], 10);
    var bugfix = parseInt(versionInfo[3], 10);
    return [major, minor, bugfix];
  }

  function sh(command, errorMessage, callback) {
    console.log("> " + command);

    var stdout = "";
    var process = jake.createExec(command, {printStdout:true, printStderr: true});
    process.on("stdout", function(chunk) {
      stdout += chunk;
    });
    process.on("error", function(){
      fail(red + errorMessage + reset);
    });
    process.on("cmdEnd", function() {
      callback(stdout);
    });
    process.run();
  }

  function globalLintOptions() {
    return {
      bitwise:true,
      curly:false,
      eqeqeq:true,
      forin:true,
      immed:true,
      latedef:true,
      newcap:true,
      noarg:true,
      noempty:true,
      nonew:true,
      regexp:true,
      undef:true,
      strict:true,
      trailing:true
    };
  }

  function nodeFiles() {
    var javascriptFiles = new jake.FileList();
    javascriptFiles.include("**/*.js");
    javascriptFiles.exclude("node_modules");
    javascriptFiles.exclude("testacular.conf.js");
    javascriptFiles.exclude("src/client/**");
    return javascriptFiles.toArray();
  }

  function nodeTestFiles() {
    var testFiles = new jake.FileList();
    testFiles.include("**/_*_test.js");
    testFiles.exclude("node_modules");
    testFiles.exclude("src/client/**");
    return testFiles.toArray();
  }

  function clientFiles(){
    var javascriptFiles = new jake.FileList();
    javascriptFiles.include("src/client/**/*.js");
    return javascriptFiles.toArray();
  }

  function nodeLintOptions() {
    var options = globalLintOptions();
    options.node = true;
    return options;
  }

  function browserLintOptions() {
    var options = globalLintOptions();
    options.browser = true;
    return options;
  }

}());
