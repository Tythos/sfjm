/*
*/

if (typeof(define) != "function") { var define = require("sfjm").define.bind(exports); }
define(function(require, exports, module) {
    exports.square = function(a) { return a * a; };

    exports.cube = function(a) { return a * a * a; };

    Object.assign(exports, {
        "__uni__": "com.github.tythos.sfjm.test",
        "__semver__": "1.0.0",
        "__author__": "code@tythos.net",
        "__verify__": [
            function(assert) { assert(exports.square(1) == 1); },
            function(assert) { assert(exports.cube(2) == 8); },
            function(assert) { assert(exports.cube(3) == 9); }
        ]
    });
});
