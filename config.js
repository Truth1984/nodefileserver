var paths = require("path");

module.exports = {
  root: paths.join(__dirname, "/"),
  port: 8082,
  ignore: ["node_modules", ".*"],
};
