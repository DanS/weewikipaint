/*global $ dump wwp:true */

wwp = {};

(function(){
  "use strict";

  wwp.createElement = function(){
    var div = document.createElement("div");
    div.setAttribute("id", "tdjs");
    div.setAttribute("foo", "bar");
    div.innerHTML = "asdfasdf";
    document.body.appendChild(div);
  };

}());
