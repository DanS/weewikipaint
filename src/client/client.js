// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function () {
  "use strict";

  var paper;

  wwp.initializeDrawingArea = function (drawingAreaElement) {

    paper = new Raphael(drawingAreaElement);
    handleDragsEvents(drawingAreaElement);
    return paper;
  };

  function handleDragsEvents( drawingAreaElement) {
    var drawingArea = $(drawingAreaElement);
    var start = null;

    $(document).mousedown(function (event) {
      start = relativeOffset(drawingArea, event.pageX, event.pageY);

      var pageOffset = drawingArea.offset();
    });

    drawingArea.mousemove(function (event) {
      var end = relativeOffset(drawingArea, event.pageX, event.pageY);

      if (start === null) return;
      drawLine(start.x, start.y, end.x, end.y);
      start = end;
    });

    $(document).mouseup(function () {
      start = null;
    });
  }

  function drawLine (startX, startY, endX, endY) {
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
