/*
*/

if (typeof(define) != "function") { var define = require("./index.js").define.bind(arguments[0]); } // local build
//if (typeof(define) != "function") { var define = require("sfjm").define.bind(exports); } // standard clause
define(function(require, exports, module) {
    exports.square = function(a) { return a * a; };

    exports.cube = function(a) { return a * a * a; };

    exports.test1 = function(assert) {
        assert(exports.square(1) == 1);
    };

    exports.test2 = function(assert) {
        assert(exports.cube(2) == 8);
    };

    exports.testBad = function(assert) {
        assert(exports.cube(2) == 3);
    }

    Object.assign(exports, {
        "__uni__": "com.github.tythos.sfjm.test",
        "__semver__": "1.0.0",
        "__author__": "code@tythos.net",
        "__verify__": [
            exports.test1,
            exports.test2,
            exports.testBad
        ]
    });
});
