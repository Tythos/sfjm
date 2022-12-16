/**
 * @author <code@tythos.net>
 */

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const assert = require("assert");

const USERNAME = process.env.USERNAME;

const INDEX = `
/**
 * @author "${USERNAME}"
 */

if (typeof(define) === "undefined") { define = (definer) => { return definer(require, exports, module); }; }
define(function(require, exports, module) {
    return Object.assign(exports, {
        "__url__": "",
        "__semver__": "v0.1.0",
        "__license__": "",
        "__deps__": {},
        "__tests__": []
    });
});
`.trim();

const GITIGNORE = `
out/
.gitignore
*-error.log
`.trim();

const CWD  = process.cwd(); // this is the path to the target package, not SFJM

const MODFILE = `${CWD}/index.js`; // this is the path to the PACKAGE's index.js, not SFJM

const SFJMPATH = module.path; // this is the path to SFJM (this file's folder)

const ACTIONS = {
    "--help": () => {
        let help = fs.readFileSync(SFJMPATH + "/HELP.rst", "utf8");
        console.log(help);
    }, "init": () => {
        const gitignorePath = `${CWD}/.gitignore`;
        fs.writeFileSync(MODFILE, INDEX);
        fs.writeFileSync(gitignorePath, GITIGNORE, () => {});
        child_process.execSync("git init .");
        child_process.execSync("git add -A");
        child_process.execSync(`git commit -m "Initial content commit"`);
        child_process.execSync(`git tag v0.1.0`);
    }, "add": (repoURL, relPath=null) => {
        child_process.exec(`git submodule add ${repoURL} ${relPath ? relPath : ""}`);
    }, "install": () => {
        const module = require(MODFILE);
        Object.keys(module.__deps__).forEach(function(url) {
            let smp = module.__deps__[url];
            if (!fs.existsSync(smp)) {
                child_process.execSync(`git submodule add ${url} ${smp}`);
            }
        });
        child_process.exec(`git submodule init`, () => {
            child_process.exec(`git submodule update`);
        });
    }, "define": () => {
        const module = require(MODFILE);
        const parts = CWD.split(path.sep);
        const name = parts[parts.length-1];
        let tags = {};
        Object.keys(module.__deps__).forEach(function(url) {
            let smp = module.__deps__[url];
            child_process.exec(`git describe --tags --abbrev=0`, {
                "cwd": CWD + path.sep + smp
            }, (error, stdout, stderr) => {
                tags[url] = stdout.trim();
                if (Object.keys(tags).length === Object.keys(module.__deps__).length) {
                    console.log(JSON.stringify({
                        "name": name,
                        "author": USERNAME,
                        "description": `${name}, a single-file JavaScript module`,
                        "version": module.__semver__,
                        "main": "index.js",
                        "license": module.__license__,
                        "repository": module.__url__,
                        "dependencies": tags,
                        "scripts": {
                            "doc": "jsdoc index.js",
                            "test": `node -e "const module = require('./index.js'); module.__tests__.forEach(test => test(assert));"`
                        }
                    }, null, 4));
                }
            });
        });
    }, "test": () => {
        const module = require(MODFILE);
        module.__tests__.forEach((test, i) => {
            try {
                test(assert);
                console.log(`Test #${i+1}: PASSED`);
            } catch (err) {
                assert(err instanceof assert.AssertionError);
                console.log(`Test #${i+1}: FAILED`);
            }
        });
    }, "bump": (level="patch") => {
        // makes the appropriate increment to semver, then writes the new value to index.js and commits with the appropriate tag
        const module = require(MODFILE);
        let parts = module.__semver__.replace(/^v/, "").split(/\./g).map(v => parseInt(v));
        let rep = new RegExp(`['"\`]v${parts[0]}.${parts[1]}.${parts[2]}['"\`]`);
        switch (level.toLowerCase()) {
            case "major":
                parts[0] += 1;
                parts[1] = 0;
                parts[2] = 0;
                break;
            case "minor":
                parts[1] += 1;
                parts[2] = 0;
                break;
            case "patch":
                parts[2] += 1;
                break;
            default:
                console.error(`Unsupported bump increment '${level}`);
        }
        let js = fs.readFileSync(MODFILE, "utf8");
        let semver = `"v${parts[0]}.${parts[1]}.${parts[2]}"`;
        js = js.replace(rep, semver);
        fs.writeFileSync(MODFILE, js);
        child_process.execSync(`git add -A`);
        child_process.execSync(`git commit -m "bumping to semver ${semver}"`);
        child_process.execSync(`git tag ${semver}`);
    }, "doc": () => {
        child_process.execSync("jsdoc index.js");
    }
};

function main(argv) {
    const action = argv[2];
    if (ACTIONS.hasOwnProperty(action)) {
        ACTIONS[action](...argv.slice(3));
    } else {
        console.error(`Unsupported action '${action}'`);
    }
}

if (module.id === ".") {
    main(process.argv);
}
