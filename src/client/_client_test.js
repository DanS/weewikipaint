// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global describe, it, expect, dump, $, wwp, afterEach Raphael*/

(function() {
  "use strict";

  describe("Drawing area", function() {

    var drawingDiv;

    afterEach(function() {
      drawingDiv.remove();
    });

    it("should be initialized with Raphael", function() {
      drawingDiv = $('<div></div>');
      $(document.body).append(drawingDiv);

      // initialize it (production code)
      wwp.initializeDrawingArea(drawingDiv[0]);

      // verify it was initialized correctly
      var tagName = $(drawingDiv).children()[0].tagName.toLowerCase();
      if (Raphael.type === 'svg'){
        expect(tagName).to.equal("svg");
      }
      else if(Raphael.type === 'vml'){
        expect(tagName).to.equal("div");
      } //else {
        //expect().fail("Browser does not support Raphael");
      //}
    });

    it("should have the same dimensions as its enclosing div", function() {
      drawingDiv = $("<div style='height: 200px; width: 400px'>hi</div>");
      $(document.body).append(drawingDiv);

        var paper = wwp.initializeDrawingArea(drawingDiv[0]);
      expect(paper.width).to.equal(400);
      expect(paper.height).to.equal(200);
    });

  });
}());
