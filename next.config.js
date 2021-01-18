const withPlugins = require("next-compose-plugins");

const withTreat = require("next-treat")(/* Extra TreatPlugin options */);
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins([
  [withBundleAnalyzer],
  [withTreat],
  // your other plugins here
]);
