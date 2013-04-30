// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function() {
  "use strict";

  var paper;


  wwp.initializeDrawingArea = function(drawingAreaElement) {
    var start = null;
    var isDragging = false;

    paper = new Raphael(drawingAreaElement);

    $(document).mousedown(function(event){
      isDragging = true;
      start = relativeOffset(drawingArea, event.pageX, event.pageY);

      var pageOffset = drawingArea.offset();
    });

    $(document).mouseup(function(event){
      isDragging = false;
    });

    var drawingArea = $(drawingAreaElement);
    drawingArea.mousemove(function(event){
      var end = relativeOffset(drawingArea, event.pageX, event.pageY);

      if(start !== null && isDragging) wwp.drawLine(start.x, start.y, end.x,  end.y);
      start = end;
    });

    //var prevX = null;
    //var prevY = null;
    //var jqArea = $(drawingAreaElement);
    //var isDragging = false;

    
    //jqArea.mousedown(function(event){
      //isDragging = true;
    //});

    //jqArea.mouseup(function(event){
      //isDragging = false;
    //});

    //jqArea.mousemove(function(event){
      //var divPageX = $(jqArea).offset().left;
      //var divPageY = $(jqArea).offset().top;
      //var relativeX = event.pageX - divPageX;
      //var relativeY = event.pageY - divPageY;
      //if(prevX !== null && isDragging) wwp.drawLine(prevX, prevY, relativeX, relativeY);
      //prevX = relativeX;
      //prevY = relativeY;
    //});
    return paper;
  };

  function relativeOffset(element, absoluteX, absoluteY){
    var pageOffset = element.offset();

    return {
      x: absoluteX - pageOffset.left,
      y: absoluteY - pageOffset.top
    };
  }
  
  wwp.drawLine = function(startX, startY,endX, endY){
    paper.path("M" + startX + "," + startY + "L" +  endX + "," + endY);
  };

}());
