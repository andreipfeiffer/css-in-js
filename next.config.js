const withPlugins = require("next-compose-plugins");

const withTM = require("next-transpile-modules")(["style9"]);
const withStyle9 = require("style9/next");

module.exports = withPlugins([[withStyle9()(withTM())]]);
