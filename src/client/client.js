// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function() {
  "use strict";

  var paper;

  wwp.initializeDrawingArea = function(drawingAreaElement) {
    var startX = null;
    var startY = null;
    var isDragging = false;

    paper = new Raphael(drawingAreaElement);

    $(document).mousedown(function(event){
      isDragging = true;
    });

    $(document).mouseup(function(event){
      isDragging = false;
    });

    var drawingArea = $(drawingAreaElement);
    drawingArea.mousemove(function(event){
      var pageOffset = drawingArea.offset();
      var endX = event.pageX - pageOffset.left;
      var endY = event.pageY - pageOffset.top;
      
      if(startX !== null && isDragging) wwp.drawLine(startX, startY, endX,  endY);
      startX = endX;
      startY = endY;
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
  
  wwp.drawLine = function(startX, startY,endX, endY){
    paper.path("M" + startX + "," + startY + "L" +  endX + "," + endY);
  };

}());
