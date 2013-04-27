// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global describe, it, expect, dump, jQuery, $, wwp, afterEach beforeEach Raphael*/

(function() {
  "use strict";

  describe("Drawing area", function() {

    var drawingArea;
    var paper;

    //beforeEach(function(){
    //});

    afterEach(function() {
      drawingArea.remove();
    });

    it("should have the same dimensions as its enclosing div", function() {
      drawingArea = $("<div style='height: 200px; width: 400px'>hi</div>");
      $(document.body).append(drawingArea);
      paper = wwp.initializeDrawingArea(drawingArea[0]);
      expect(paper.width).to.equal(400);
      expect(paper.height).to.equal(200);
    });

    it("should draw a line", function(){
      wwp.drawLine(20, 30, 30, 300);
      var elements = drawingElements(paper);
      expect(elements.length).to.equal(1);
      expect(pathFor(elements[0])).to.equal("M20,30L30,300");
    });

    it("draws line segments in response to clicks", function() {
      drawingArea = $("<div style='height: 200px; width: 400px'>hi</div>");
      $(document.body).append(drawingArea);
      paper = wwp.initializeDrawingArea(drawingArea[0]);

      clickMouse(20, 30);
      clickMouse(50, 60);
//      clickMouse(40, 20);

      expect(paperPaths(paper)).to.eql([20, 30, 50, 60]);
    });

    function paperPaths(paper){
      var elements = drawingElements(paper);
      var box = elements[0].getBBox();
      return [ box.x, box.y, box.x2, box.y2];
    }

    //it("considers border when calculating mouse target", function(){
      //drawingArea = $("<div style='height: 200px; width: 400px borderW-width: 13px'>hi</div>");
      //$(document.body).append(drawingArea);
      //paper = wwp.initializeDrawingArea(drawingArea[0]);

      //var eventData = new jQuery.Event();
      //eventData.pageX = 20;
      //eventData.pageY = 30;
      //eventData.type = 'click';

      //drawingArea.trigger(eventData);

      //var topLeftOfDrawingArea = drawingArea.offset();
      //var borderWidth = 13;
      //var expectedX = 20 - topLeftOfDrawingArea.left - borderWidth;
      //var expectedY = 30 - topLeftOfDrawingArea.top - borderWidth;

      //var elements = drawingElements(paper);
      //expect(elements.length).to.equal(1);
      //expect(pathFor(elements[0])).to.equal("M0,0L" + expectedX + ',' + expectedY);
    //});

   function clickMouse(relativeX, relativeY) {
      var topLeftOfDrawingArea = drawingArea.offset();
      var pageX = relativeX + topLeftOfDrawingArea.left;
      var pageY = relativeY + topLeftOfDrawingArea.top;

      var eventData = new jQuery.Event();
      eventData.pageX = pageX;
      eventData.pageY = pageY;
      eventData.type = 'click';
      drawingArea.trigger(eventData);
    }

    function drawingElements(paper) {
      var result = [];
      paper.forEach(function (element) {
        result.push(element);
      });
      return result;
    }

    function pathFor(element) {
      var box = element.getBBox();
      return 'M' + box.x + ',' + box.y + 'L' + box.x2 + ',' + box.y2;

      //if(Raphael.vml) return vmlPathfor(element);
      //else if(Raphael.svg) return svgPathfor(element);
      //else throw new Error("Unknown Raphael type");
    }

    //function svgPathfor(element){
      //var path = element.node.attributes.d.value;
      //if(path.indexOf(",") !== -1){
        //return path;
      //}else{
        //var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
        //var ie9 = path.match(ie9PathRegex);
        //return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
      //}
    //}

    //function vmlPathfor(element){
       //var VLM_MAGIC_NUMBER = 21600;
        //var path = element.node.path.value;
        //var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
        //var ie8 = path.match(ie8PathRegex);
        //var startX = ie8[1] / VLM_MAGIC_NUMBER;
        //var startY = ie8[2] / VLM_MAGIC_NUMBER;
        //var endX = ie8[3] / VLM_MAGIC_NUMBER;
        //var endY = ie8[4] / VLM_MAGIC_NUMBER;
        //return 'M' + startX + ',' + startY + 'L' + endX + ',' + endY;
    //}

  });
}());
