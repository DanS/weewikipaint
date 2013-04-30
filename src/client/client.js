// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function () {
  "use strict";

  var paper;

  wwp.initializeDrawingArea = function (drawingAreaElement) {
    var start = null;

    paper = new Raphael(drawingAreaElement);

    $(document).mousedown(function (event) {
      start = relativeOffset(drawingArea, event.pageX, event.pageY);

      var pageOffset = drawingArea.offset();
    });

    $(document).mouseup(function (event) {
      start = null;
    });

    var drawingArea = $(drawingAreaElement);
    drawingArea.mousemove(function (event) {
      var end = relativeOffset(drawingArea, event.pageX, event.pageY);

      if (start === null) return;
      wwp.drawLine(start.x, start.y, end.x, end.y);
      start = end;
    });

    return paper;
  };

  function relativeOffset(element, absoluteX, absoluteY) {
    var pageOffset = element.offset();

    return {
      x: absoluteX - pageOffset.left,
      y: absoluteY - pageOffset.top
    };
  }

  wwp.drawLine = function (startX, startY, endX, endY) {
    paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
  };

}());
