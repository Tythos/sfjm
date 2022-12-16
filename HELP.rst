Invokes specific SFJM actions against a specific package path.

SFJM [action] [...options] [package path?]

Supported actions are as follows:

  --help    Prints this help file from the SFJM project's "HELP.rst"

  init      Creates a SFJM package in the given path

  add [repository URL] [relative path]
            Adds a submodule dependency cloned from the given URL. By default,
            the relative path to which it is cloned will be the final
            seperator-delimited segment of the repository path. This can be
            customized by specifying the "relative path" option.

  install   Looks up the dependencies of the top-level package and installs
            them by recursively cloning each level of dependency as a submodule.

  define    Reports the "package.json"-format transcription of the package
            metadata from the module exports and other related information.

  test      Runs all tests defined in the package metadata ("__tests__") Array
            export

  bump [level]
            Increments the semantic version of the package. Supported "level"
            arguments include "major", "minor", and "patch". (Defaults to
            "patch" if no option is given.) This udpates the tag, after
            creating a new commit, of the underlying git repository, including
            an automatically-generated commit message.

  doc       Runs JSDoc against the index.js file in the repository. Output will
            be, by default, written to the co-located "out/" folder.

If no package path is given, defaults to the current working directory.
