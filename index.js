#!/usr/bin/env node

/* Defines both package behaviors and command-line interface for management of
   single-file JavaScript modules.
*/

var SEMVER = "1.2.2";

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
	var result = uglifyJs.minify(src);
	if (result.error) {
		result.error.filename = tgt;
		console.error("Failed to build " + target, result.error);
		return;
	}
	var min = result.code;
	var out = mod.__uni__ + "-v" + mod.__semver__ + ".min.js";
	fs.writeFileSync(path.resolve("./" + out), min);
	console.log("Successfully built " + out);
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

module.exports.deploy = function(target="./index.js") {
	/* 
	*/
	var path = require("path");
	var child_process = require("child_process");
	var fs = require("fs");
	var tgt = path.resolve(target);
	var mod = require(tgt);
	var cwd = path.dirname(tgt);

	// git add, commit, tag, push
	var msg = "auto-commit for v" + mod.__semver__;
	[
		"git add -A",
		"git commit -m \"" + msg + "\"",
		"git tag v" + mod.__semver__,
		"git push",
		"git push --tags"
	].forEach(function(cmd) { child_process.execSync(cmd, { "cwd": cwd })});

	// node publish (including temporary package.json)
	var package = {};
	package["name"] = mod.__uni__;
	package["version"] = mod.__semver__;
	package["dependencies"] = { "sfjm": "^" + SEMVER };
	var packPath = cwd + "/package.json";
	fs.writeFileSync(packPath, JSON.stringify(package));
	child_process.execSync("npm publish", { "cwd": cwd });
	//fs.unlink(cwd + "/package.json");
};

module.exports.help = function() {
	/* Prints documentation for individual command-line actions
	*/
	console.log("Command-line actions for SFJM:");
	console.log("\tbuild\tUglifies/mangles target SFJM file to a UNI+SemVer file");
	console.log("\ttest\tRuns the unit tests defined under a SFJM file's __verify__ property");
	console.log("\tdeploy\tIncrements SemVer, commits/pushes Git, and publishes NPM package");
	console.log("\thelp\tPrints this set of documentation for command-line actions");
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
	"__semver__": SEMVER,
	"__author__": "code@tythos.net",
	"__verify__": []
});

if (require.main == module) { module.exports.main(process.argv); }
