var paths = require("path");
var fs = require("fs");
let ow = {};
if (fs.existsSync("./overwrite.js")) ow = require("./overwrite.js");

module.exports = Object.assign(
  {
    root: [paths.join(__dirname, "/")],
    port: 8085,
    ignore: ["node_modules", ".*"],
    filter: [],
    relativeDir: true,
    sort: true,
  },
  ow
);
