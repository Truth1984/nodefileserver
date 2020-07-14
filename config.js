var paths = require("path");

module.exports = {
  root: [paths.join(__dirname, "/"), "~/Documents/dockers"],
  port: 8085,
  ignore: ["node_modules", ".*"],
  filter: [],
  relativeDir: true,
  sort: true,
};
