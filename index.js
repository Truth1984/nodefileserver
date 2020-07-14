var express = require("express");
var config = require("./config");
var readdir = require("./readdir");
var app = express();

// convert to array
if (!Array.isArray(config.root)) config.root = [config.root];
if (!Array.isArray(config.ignore)) config.ignore = [config.ignore];
// replace home path
for (let i in config.root) config.root[i] = config.root[i].replace("~", process.env.HOME);
// static serve
for (let i of config.root) app.use(express.static(i));
// sorted dir
config._sortedDir = config.root.sort((a, b) => b.length - a.length);

app.all("/", (req, res, next) => {
  Promise.all(config.root.map((path) => readdir(path, config.ignore)))
    .then((collection) => {
      let data = collection.flat().filter((i) => i != null);
      if (config.relativeDir)
        data = data.map((item) =>
          item.replace(
            config._sortedDir.find((i) => item.indexOf(i) > -1),
            ""
          )
        );
      for (let i of config.filter) data = data.filter((item) => new RegExp(i).test(item));
      if (config.sort) data = data.sort();
      res.send(data);
    })
    .then(() => next());
});

app.listen(config.port);

console.log(`using http port ${config.port}`);
