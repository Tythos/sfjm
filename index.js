/*
*/

module.exports.define = function(closure) {
	let module = { "exports": {} };
	Object.assign(module.exports, closure(require, module.exports, module));
	Object.assign(this, module.exports);
};

module.exports.build = function(target) {
	let uglifyJs = require("uglify-js");
	let fs = require("fs");
	let path = require("path");
	let tgt = path.resolve(target);
	let src = fs.readFileSync(tgt, "utf8");
	let mod = require(tgt);
	let min = uglifyJs.minify(src).code;
	let out = `${mod.__uni__}-v${mod.__semver__}.min.js`;
	fs.writeFileSync("./" + out, min);
	console.log(`Successfully built '${out}'`);
};

module.exports.main = function(argv) {
	if (argv.length < 3) {
		console.error("Command-line invocation requires action");
	}
	switch (argv[2]) {
		case "build":
			module.exports.build.apply(null, argv.slice(3, argv.length));
			break;
		default:
			console.error(`Unsupported command-line action '${argv[2]}'`);
	}
};

Object.assign(module.exports, {
	"__uni__": "com.github.tythos.sfjm",
	"__semver__": "1.1.2",
	"__author__": "code@tythos.net"
});

if (require.main == module) { module.exports.main(process.argv); }

