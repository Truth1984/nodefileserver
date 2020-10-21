var express = require("express");
var config = require("./config");
var readdir = require("./readdir");
var app = express();
var fs = require("fs");
var paths = require("path");

// convert to array
if (!Array.isArray(config.root)) config.root = [config.root];
if (!Array.isArray(config.ignore)) config.ignore = [config.ignore];
// replace home path
for (let i in config.root) config.root[i] = config.root[i].replace("~", process.env.HOME);
// static serve
for (let i of config.root) app.use(express.static(i));
// sorted dir
config._sortedRootDir = config.root.sort((a, b) => b.length - a.length);

app.all("/stat/:path", (req, res, next) => {
  let path = req.params.path;
  for (let i of config.root) {
    let fullpath = paths.join(i, path);
    if (fs.existsSync(fullpath)) {
      res.json(fs.statSync(fullpath));
      return next();
    }
  }
  res.json({ error: "file does not exist" });
  return next();
});

app.all("/", (req, res, next) => {
  Promise.all(config.root.map((path) => readdir(path, config.ignore)))
    .then((collection) => {
      let data = collection.flat().filter((i) => i != null);
      if (config.relativeDir)
        data = data.map((item) =>
          item.replace(
            config._sortedRootDir.find((i) => item.indexOf(i) > -1),
            ""
          )
        );
      if (config.filter.length > 0) data = data.filter((item) => config.filter.some((i) => new RegExp(i).test(item)));
      if (config.sort) data = data.sort();
      res.send(data);
    })
    .then(() => next());
});

app.listen(config.port);

console.log(`using http port ${config.port}`);
