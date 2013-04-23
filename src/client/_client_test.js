// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global describe, it, expect, dump, jQuery, $, wwp, afterEach beforeEach Raphael*/

(function() {
  "use strict";

  describe("Drawing area", function() {

    var drawingArea;
    var paper;

    beforeEach(function(){
      drawingArea = $("<div style='height: 200px; width: 400px'>hi</div>");
      $(document.body).append(drawingArea);
      paper = wwp.initializeDrawingArea(drawingArea[0]);
    });

    afterEach(function() {
      drawingArea.remove();
    });

    it("should have the same dimensions as its enclosing div", function() {
      expect(paper.width).to.equal(400);
      expect(paper.height).to.equal(200);
    });

    it("should draw a line", function(){
      wwp.drawLine(20, 30, 30, 300);
      var elements = drawingElements(paper);
      expect(elements.length).to.equal(1);
      expect(pathFor(elements[0])).to.equal("M20,30L30,300");
    });
    
    it("responds to the mouse", function(){
      //click inside drawing area
      //verify that a line was drawn

      var eventData = new jQuery.Event();
      eventData.pageX = 20;
      eventData.pageY = 30;
      eventData.type = 'click';
      
      drawingArea.trigger(eventData);

      var elements = drawingElements(paper);
      expect(elements.length).to.equal(1);
      expect(pathFor(elements[0])).to.equal("M0,0L20,30");
    });

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
