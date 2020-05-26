var express = require("express");
var config = require("./config");
var readdir = require("recursive-readdir");
var app = express();

app.use(express.static(config.root));

app.all("/", (req, res, next) => {
  readdir(config.root, config.ignore)
    .then((data) => res.send(data.map((item) => item.replace(config.root, ""))))
    .then(() => next());
});

app.listen(config.port);

console.log(`using http port ${config.port}`);
