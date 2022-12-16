/**
 * @author <code@tythos.net>
 */

/**
 * Multiplies a number by itself, and returns the result.
 * @param {Number} a : A number to square
 * @returns {Number} : The input, squared
 */
function square(a) {
    return a * a;
}

/**
 * Multiplies a number by itself, then again, and returns the result.
 * @param {Number} a : A number to cube
 * @returns {Number} : The input, cubed
 */
function cube(a) {
    return a * a * a;
}

/**
 * Stores a value, to which some things can be done.
 */
class AnAwesomeNumber {
    constructor(value) {
        this.value = value;
    }

    /**
     * Prints a message with the square and cube of the value to the
     * console as a log message.
     */
    doStuff() {
        console.log(`The square of my value is ${square(this.value)}!`);
        console.log(`The cube of my value is ${cube(this.value)}!`);
    }
}

const exports = Object.assign({
    "square": square,
    "cube": cube,
    "AnAwesomeNumber": AnAwesomeNumber
}, {
    "__main__": function() { let a = new AnAwesomeNumber(2); a.doStuff(); },
    "__url__": "https://gist.github.com/01a0ed2ab5c52b1120ed0283a585d510.git",
    "__semver__": "1.0.0",
    "__license__": "MIT",
    "__deps__": {
        "txtloader-v1.0.0.js": "https://gist.github.com/Tythos/01a0ed2ab5c52b1120ed0283a585d510",
        "spheregeo-v0.1.0.js": "https://gist.github.com/Tythos/885c2db3de71c6fb12aab159a61edf58",
        "WebThread-v1.0.0.js": "https://gist.github.com/Tythos/3cb935df81459b7cb2f8abc7cb3b4d27"
    },
    "__tests__": [
        function(assert) { assert(exports.square(1) == 1); },
        function(assert) { assert(exports.cube(2) == 8); },
        function(assert) { assert(exports.cube(3) == 9); }
    ]
});

if (process.argv.length > 1 && import.meta) {
    import("querystring").then(querystring => {
        if (`file:///${process.argv[1].replace(/\\/g, "/")}` === querystring.unescape(import.meta.url)) {
            exports.__main__();
        }
    });
}

export default exports;
