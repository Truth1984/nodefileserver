var express = require("express");
var config = require("./config");
var readdir = require("recursive-readdir");
var app = express();

app.use(express.static(config.root));

app.all("/", (req, res, next) => {
  readdir(config.root, config.ignore)
    .then((data) => {
      if (config.relativeDir) data = data.map((item) => item.replace(config.root, ""));
      for (let i of config.filter) data = data.filter((item) => new RegExp(i).test(item));
      if (config.sort) data = data.sort();
      res.send(data);
    })
    .then(() => next());
});

app.listen(config.port);

console.log(`using http port ${config.port}`);
