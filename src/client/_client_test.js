// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global describe, it, expect, dump, wwp, $ */

(function () {
  "use strict";

  describe("Drawing area", function () {

    it("should be initialized in predefined div", function () {
      var div = document.createElement("div");
      div.setAttribute("id", "wwp-drawingArea");
      document.body.appendChild(div);
      
      wwp.initializeDrawingArea('wwp-drawingArea');
      
      var tagName = $(div).children()[0].tagName;
      if(tagName === "svg"){
        expect(tagName).to.equal("svg");
      }else{
        expect(tagName).to.equal("DIV");
      }
    });

  });
}());
