/*global $ dump wwp:true Raphael */

wwp = {};

(function(){
  "use strict";

  var raphael = Raphael;

  wwp.initializeDrawingArea = function(drawingAreaId){
    var paper = raphael(drawingAreaId);
  };

}());
