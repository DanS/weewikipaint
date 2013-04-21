// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global describe, it, expect, dump, $, wwp, afterEach Raphael*/

(function() {
  "use strict";

  describe("Drawing area", function() {

    var drawingDiv;

    afterEach(function() {
      drawingDiv.remove();
    });

    it("should be initialized with Raphael", function() {
      drawingDiv = $('<div></div>');
      $(document.body).append(drawingDiv);

      // initialize it (production code)
      wwp.initializeDrawingArea(drawingDiv[0]);

      // verify it was initialized correctly
      var tagName = $(drawingDiv).children()[0].tagName.toLowerCase();
      if (Raphael.type === 'SVG'){
        expect(tagName).to.equal("svg");
      }
      else if(Raphael.type === 'VML'){
        expect(tagName).to.equal("div");
      } else {
        throw new Error("Raphael doesn't support this browser");
      }
    });

    it("should have the same dimensions as its enclosing div", function() {
      drawingDiv = $("<div style='height: 200px; width: 400px'>hi</div>");
      $(document.body).append(drawingDiv);

      var paper = wwp.initializeDrawingArea(drawingDiv[0]);
      expect(paper.width).to.equal(400);
      expect(paper.height).to.equal(200);
    });


    it("should draw a line", function(){
      drawingDiv = $("<div style='height: 200px; width: 400px'>hi</div>");
      $(document.body).append(drawingDiv);
      var paper = wwp.initializeDrawingArea(drawingDiv[0]);

      wwp.drawLine(20, 30, 30, 300);

      var elements = [];
      paper.forEach(function(element){
        elements.push(element);
      });
      expect(elements.length).to.equal(1);
      var element = elements[0];
      var path = pathFor(element);
      expect(path).to.equal("M20,30L30,300");
    });

    function pathFor(element) {
      var path;
      if(Raphael.vml){
        var VLM_MAGIC_NUMBER = 21600;
        path = element.node.path.value;
        var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
        var ie8 = path.match(ie8PathRegex);
        var startX = ie8[1] / VLM_MAGIC_NUMBER;
        var startY = ie8[2] / VLM_MAGIC_NUMBER;
        var endX = ie8[3] / VLM_MAGIC_NUMBER;
        var endY = ie8[4] / VLM_MAGIC_NUMBER;
        return 'M' + startX + ',' + startY + 'L' + endX + ',' + endY;
      }
      path = element.node.attributes.d.value;
      if(path.indexOf(",") !== -1){
        return path;
      }else{
        var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
        var ie9 = path.match(ie9PathRegex);
        return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
      }
      return path;
    }
  });
}());
