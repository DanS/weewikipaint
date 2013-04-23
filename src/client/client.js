// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function() {
  "use strict";

  var paper;

  wwp.initializeDrawingArea = function(drawingAreaElement) {
    paper = new Raphael(drawingAreaElement);
    
    $(drawingAreaElement).click(function(event){
      wwp.drawLine(0,0, event.pageX, event.pageY);
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
