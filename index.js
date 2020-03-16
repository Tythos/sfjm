/*
*/

Object.assign(module.exports, {
	"define": function(closure) {
		let module = { "exports": {} };
		Object.assign(module.exports, closure(require, module, module.exports));
		Object.assign(this, module.exports);
	},
	"__uni__": "com.github.tythos.sfjsm",
	"__semver__": "1.0.0",
	"__author__": "code@tythos.net"
});

