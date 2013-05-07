// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global dump, Raphael, wwp:true, $ Event */

wwp = {};

(function () {
  "use strict";

  var paper;

  wwp.initializeDrawingArea = function (drawingAreaElement) {

    paper = new Raphael(drawingAreaElement);
    handleDragEvents(drawingAreaElement);
    //drawingAreaElement.onSelectstart = function(){
      //return false;
    //};
    return paper;
  };

  function handleDragEvents(drawingAreaElement) {
    var drawingArea = $(drawingAreaElement);
    var start = null;

    drawingArea.mousedown(function(event) {
      event.preventDefault();
      var offset = relativeOffset(drawingArea, event.pageX, event.pageY);
      start = offset;
    });
    
    drawingArea.on("selectstart", function(event){
      //this event handler is needed so IE8 doesn't select text when dragging out of drawing area
      event.preventDefault();
    });

    drawingArea.mousemove(function(event) {
      if (start === null) return;

      var end = relativeOffset(drawingArea, event.pageX, event.pageY);
      drawLine(start.x, start.y, end.x, end.y);
      start = end;
    });

    drawingArea.mouseleave(function () {
      start = null;
    });

    drawingArea.mouseup(function () {
      start = null;
    });
  }

  function drawLine(startX, startY, endX, endY) {
    paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
  }

  function relativeOffset(element, pageX, pageY) {
    var pageOffset = element.offset();

    return {
      x: pageX - pageOffset.left,
      y: pageY - pageOffset.top
    };
  }

}());
