// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global describe, it, xit, expect, dump, jQuery, $, wwp, afterEach beforeEach Raphael*/

(function () {
  "use strict";

  var drawingArea;
  var paper;

  describe("Drawing area", function () {

    afterEach(function () {
      drawingArea.remove();
    });

    it("should have the same dimensions as its enclosing div", function () {
      drawingArea = $("<div style='height: 300px; width: 600px'>hi</div>");
      $(document.body).append(drawingArea);
      paper = wwp.initializeDrawingArea(drawingArea[0]);

      expect(paper.height).to.equal(300);
      expect(paper.width).to.equal(600);
    });

    describe("line drawing", function () {
      beforeEach(function(){
        drawingArea = $("<div style='height: 300px; width: 600px'>hi</div>");
        $(document.body).append(drawingArea);
        paper = wwp.initializeDrawingArea(drawingArea[0]);
      });

      it("does not draw line segments when mouse is not down", function () {
        mouseMove(20, 30);
        mouseMove(50, 60);

        expect(lineSegments(paper)).to.eql([]);
      });

      it("draws a line in response to mouse drag", function () {
        mouseDown(20, 30);
        mouseMove(50, 60);
        mouseUp(50, 60);

        expect(lineSegments(paper)).to.eql([
          [20, 30, 50, 60]
        ]);
      });

      it("draws multiple line segments when mouse is dragged multiple places", function () {
        mouseDown(20, 30);
        mouseMove(50, 60);
        mouseMove(40, 20);
        mouseMove(10, 15);
        mouseUp(10, 15);

        expect(lineSegments(paper)).to.eql([
          [20, 30, 50, 60],
          [50, 60, 40, 20],
          [40, 20, 10, 15]
        ]);
      });

      it("draws multiple line segments when there are multiple drags", function () {
        mouseDown(20, 30);
        mouseMove(50, 60);
        mouseUp(50, 60);

        mouseMove(40, 20);

        mouseDown(30, 25);
        mouseMove(10, 15);
        mouseUp(10, 15);

        expect(lineSegments(paper)).to.eql([
          [20, 30, 50, 60],
          [30, 25, 10, 15]
        ]);
      });

      it("does not draw line segments when mouse button is released", function () {
        mouseDown(20, 30);
        mouseUp(50, 60);

        expect(lineSegments(paper)).to.eql([]);
      });

      it("stops drawing line segments when the mouse is up", function () {
        mouseDown(20, 30);
        mouseMove(50, 60);
        mouseUp(50, 60);
        mouseMove(10, 15);

        expect(lineSegments(paper)).to.eql([
          [20, 30, 50, 60]
        ]);
      });

      it("stops drawing when mouse leaves drawing area", function () {
//      TODO this passes when it shouldn't
        mouseDown(20, 30);
        mouseMove(50, 60);
        mouseMove(700, 70);
        mouseMove(90, 40);
        mouseUp(90, 40);

        expect(lineSegments(paper)).to.eql([
          [20, 30, 50, 60]
        ]);
      });

      it("does not start drawing if drag is started outside drawing area", function () {
        mouseDown(601, 150);
        mouseMove(50, 60);
        mouseUp(50, 60);

        mouseDown(-1, 150);
        mouseMove(50, 60);
        mouseUp(50, 60);

        mouseDown(120, 301);
        mouseMove(50, 60);
        mouseUp(50, 60);

        mouseDown(-1, 301);
        mouseMove(50, 60);
        mouseUp(50, 60);

        expect(lineSegments()).to.eql([]);
      });

      it("does start drawing if drag is initiated exactly at edge of drawing area", function () {
        mouseDown(600, 300);
        mouseMove(50, 60);
        mouseUp(50, 60);

        mouseDown(0, 0);
        mouseMove(50, 60);
        mouseUp(50, 60);

        expect(lineSegments()).to.eql([
          [600, 300, 50, 60],
          [0, 0, 50, 60]
        ]);
      });
    });
  });

  function mouseDown(relativeX, relativeY) {
    sendMouseEvent('mousedown', relativeX, relativeY);
  }

  function mouseMove(relativeX, relativeY) {
    sendMouseEvent('mousemove', relativeX, relativeY);
  }

  function mouseUp(relativeX, relativeY) {
    sendMouseEvent('mouseup', relativeX, relativeY);
  }

  function sendMouseEvent(event, relativeX, relativeY) {
    var page = pageOffset(drawingArea, relativeX, relativeY);

    var topLeftOfDrawingArea = drawingArea.offset();
    var pageX = relativeX + topLeftOfDrawingArea.left;
    var pageY = relativeY + topLeftOfDrawingArea.top;

    var eventData = new jQuery.Event();
    eventData.pageX = pageX;
    eventData.pageY = pageY;
    eventData.type = event;
    drawingArea.trigger(eventData);
  }

  function pageOffset(drawingArea, relativeX, relativeY) {
    var topLeftOfDrawingArea = drawingArea.offset();
    return {
      x: relativeX + topLeftOfDrawingArea.left,
      y: relativeY + topLeftOfDrawingArea.top
    };
  }

  function lineSegments(){
    var result = [];
    paper.forEach(function (element) {
      result.push(pathFor(element));
    });
    return result;
  }

  function pathFor(element) {
    if (Raphael.vml) return vmlPathfor(element);
    else if (Raphael.svg) return svgPathfor(element);
    else throw new Error("Unknown Raphael type");
  }

  function svgPathfor(element) {
    var pathRegex;
    var path = element.node.attributes.d.value;
    if (path.indexOf(",") !== -1) {
      pathRegex = /M(\d+),(\d+)L(\d+),(\d+)/;
    } else {
      pathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
    }
    var pathComponents = path.match(pathRegex);
    return[ pathComponents[1], pathComponents[2], pathComponents[3], pathComponents[4] ];
  }

  function vmlPathfor(element) {
    var VML_MAGIC_NUMBER = 21600;
    var path = element.node.path.value;
    var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
    var ie8 = path.match(ie8PathRegex);
    var startX = ie8[1] / VML_MAGIC_NUMBER;
    var startY = ie8[2] / VML_MAGIC_NUMBER;
    var endX = ie8[3] / VML_MAGIC_NUMBER;
    var endY = ie8[4] / VML_MAGIC_NUMBER;
    return[ startX, startY, endX, endY ];
  }

}());
