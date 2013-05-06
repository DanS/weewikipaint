// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function () {
  "use strict";

  var paper;

  wwp.initializeDrawingArea = function (drawingAreaElement) {

    paper = new Raphael(drawingAreaElement);
    handleDragEvents(drawingAreaElement);
    return paper;
  };

  function handleDragEvents(drawingAreaElement) {
    var drawingArea = $(drawingAreaElement);
    var start = null;

		drawingArea.mousedown(function(event) {
			var offset = relativeOffset(drawingArea, event.pageX, event.pageY);
      start = offset;
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
