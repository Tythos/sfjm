/*
*/

if (typeof(define) != "function") { var define = require("./index.js").define.bind(arguments[0]); }
define(function(require, exports, module) {
    exports.square = function(a) { return a * a; };

    exports.cube = function(a) { return a * a * a; };

    Object.assign(exports, {
        "__uni__": "com.github.tythos.sfjm.test",
        "__semver__": "1.0.0",
        "__author__": "code@tythos.net"
    });
});
