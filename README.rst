sfjm
====

Development tool for supporting single-file JavaScript modules across use cases

Usage
-----

Write your modules using an AMD-compatible "define()" closure. That function
can be conditionally imported and scoped from the "sfjm" package, like so:

  if (typeof(define) != "function") { var define = require("sfjm").define.bind(exports); }
  define(function(require, exports, module) {
    ... // insert your usual AMD module content here
  });
