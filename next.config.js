const withPlugins = require("next-compose-plugins");

const withTM = require("next-transpile-modules")(["style9"]);
const withStyle9 = require("style9/next");

module.exports = withPlugins([
  [withStyle9()(withTM())],
  [
    // your other plugins here, or next config
    {
      typescript: {
        // @todo needed to be able to build, having TS errors on boxShadow
        ignoreBuildErrors: true,
      },
    },
  ],
]);
