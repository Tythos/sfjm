/*
*/

Object.assign(module.exports, {
	"define": function(closure) {
		let module = { "exports": {} };
		Object.assign(module.exports, closure(require, module.exports, module));
		Object.assign(this, module.exports);
		console.log(module.exports);
	},
	"build": function() {
		
	},
	"__uni__": "com.github.tythos.sfjm",
	"__semver__": "1.0.0",
	"__author__": "code@tythos.net"
});

