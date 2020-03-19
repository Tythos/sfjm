# sfjm

Development tool for supporting single-file JavaScript modules across use cases

## Writing A Module

Write your modules using an AMD-compatible "define()" closure. That function
can be conditionally imported and scoped from the "sfjm" package, like so:

~~~~
if (typeof(define) != "function") { var define = require("sfjm").define.bind(exports); }
define(function(require, exports, module) {
  ... // insert your usual AMD module content here
});
~~~~

## Describing A Module

You should attach meta-properties to the conclusion of your module definition.
At minimum, this should include values for the following keys, assigned to your
*module.exports* Object:

* \_\_uni\_\_, a string representing a universal namespace identifier
  (period-delimited namespace hierarchy, starting from TLD down to a unique
  identifier for your module).

* \_\_semver\_\_, a string representing a Semantic Versioning number for your
  current module version. This includes three decimal-delimited integers for
  major, minor, and patch revision numbers.

* \_\_author\_\_, a string indicating the email address to which inquiries should
  be made by users and developers.

## Building A Module

You can invoke the main SFJM script with a "build" action to target a specific
single-file JavaScript module for minification with UglifyJS. This includes
both compression and mangling, by default, and will name the output artifact
based on the UNI and SemVer meta-properties of the module.

## Testing A Module

Single-file JavaScript modules can have a "\_\_verify\_\_" property. This
should be an Array of functions that accept and invoke an "assert()" function
for their specific tests. SFJM will use the Node Tap framework to run these
tests when "sfjm test" is invoked, but they can also be run with
"console.assert()" and Node's build-in "assert()" for verification.

## Deploying A Module

Coming soon!
