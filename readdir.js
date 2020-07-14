var fs = require("fs");
var paths = require("path");
var minimatch = require("minimatch");
var config = require("./config");

let patternMatcher = (pattern) => {
  return (path, stats) => {
    var minimatcher = new minimatch.Minimatch(pattern, { matchBase: true });
    return (!minimatcher.negate || stats.isFile()) && minimatcher.match(path);
  };
};

let toMatcherFunction = (ignoreEntry) => {
  if (typeof ignoreEntry == "function") return ignoreEntry;
  return patternMatcher(ignoreEntry);
};

let readdir = (path, ignores = [], callback) => {
  if (typeof ignores == "function") {
    callback = ignores;
    ignores = [];
  }

  if (!callback) {
    return new Promise((resolve, reject) =>
      readdir(path, ignores, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      })
    );
  }

  ignores = ignores.map(toMatcherFunction);

  var list = [];

  fs.readdir(path, function (error1, files) {
    if (error1) {
      config.ignore.push(error1.path);
      console.log(error1);
      return callback(null, null);
    }

    var pending = files.length;
    if (!pending) return callback(null, list);

    files.forEach((file) => {
      var filePath = paths.join(path, file);
      fs.stat(filePath, (error1, stats) => {
        if (error1) return callback(error1);

        if (ignores.some((matcher) => matcher(filePath, stats))) {
          pending -= 1;
          if (!pending) return callback(null, list);
          return null;
        }

        if (stats.isDirectory()) {
          readdir(filePath, ignores, (error2, res) => {
            if (error2) return callback(error2);
            list = list.concat(res);
            pending -= 1;
            if (!pending) return callback(null, list);
          });
        } else {
          list.push(filePath);
          pending -= 1;
          if (!pending) return callback(null, list);
        }
      });
    });
  });
};

module.exports = readdir;
