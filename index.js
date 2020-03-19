#!/usr/bin/env node

/* Defines both package behaviors and command-line interface for management of
   single-file JavaScript modules.
*/

module.exports.define = function(closure) {
	var module = { "exports": {} };
	Object.assign(module.exports, closure(require, module.exports, module));
	Object.assign(this, module.exports);
};

module.exports.build = function(target="./index.js") {
	var uglifyJs = require("uglify-js");
	var fs = require("fs");
	var path = require("path");
	var tgt = path.resolve(target);
	var src = fs.readFileSync(tgt, "utf8");
	var mod = require(tgt);
	var min = uglifyJs.minify(src).code;
	var out = mod.__uni__ + "-v" + mod.__semver__ + ".min.js";
	fs.writeFileSync(path.resolve("./" + out), min);
	console.log("Successfully built " + out);
};

module.exports.help = function() {
	/* Prints documentation for individual command-line actions
	*/
	console.log("Command-line actions for SFJM:");
	console.log("\tbuild\tUglifies/mangles target SFJM file to a UNI+SemVer file");
	console.log("\ttest\tRuns the unit tests defined under a SFJM file's __verify__ property");
	console.log("\tdeploy\tIncrements SemVer, commits/pushes Git, and publishes NPM package");
	console.log("\t  --major\tSpecifies major version SemVer increment for deployment");
	console.log("\t  --minor\tSpecifies minor version SemVer increment for deployment");
	console.log("\t  --patch\tSpecifies patch version SemVer increment for deployment");
	console.log("\thelp\tPrints this set of documentation for command-line actions");
};

module.exports.test = function(target="./index.js") {
	/* Loads target module (built artifact, by default), and runs unit tests
	   listed under __verify__ property. Node tap is used, but test interface
	   within module functions themselves merely requires any "assert()"
	   function (console.assert, node assert, tap.assert).
	*/
	var path = require("path");
	var tap = require("tap");
	var tgt = path.resolve(target);
	var mod = require(tgt);
	if (Object.keys(mod).indexOf("__verify__") < 0) {
		console.error("No tests listed for given module");
		return;
	}
	mod.__verify__.forEach(function(test, ndx) {
		test(tap.assert);
	});
};

module.exports.deploy = function() {
	/* 
	*/
	console.error("Not yet implemented");
};

module.exports.main = function(argv) {
	switch (argv[2]) {
		case "build":
			module.exports.build.apply(null, argv.slice(3, argv.length));
			break;
		case "test":
			module.exports.test.apply(null, argv.slice(3, argv.length));
			break;
		case "deploy":
			module.exports.deploy.apply(null, argv.slice(3, argv.length));
			break;
		case "help":
		case "--help":
		case "/?":
			module.exports.help();
			break;
		default:
			console.error("Unsupported command-line action; use '--help' flag for details");
	}
};

Object.assign(module.exports, {
	"__uni__": "com.github.tythos.sfjm",
	"__semver__": "1.2.1",
	"__author__": "code@tythos.net",
	"__verify__": []
});

if (require.main == module) { module.exports.main(process.argv); }
