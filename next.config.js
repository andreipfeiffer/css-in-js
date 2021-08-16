const withPlugins = require("next-compose-plugins");

const { VanillaExtractPlugin } = require("@vanilla-extract/webpack-plugin");

const {
  getGlobalCssLoader,
} = require("next/dist/build/webpack/config/blocks/css/loaders");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @param {ConstructorParameters<typeof VanillaExtractPlugin>[0]} pluginOptions Custom config for vanilla-extract
 */
function withVanillaExtract(pluginOptions = {}) {
  /**
   * @param {any} nextConfig Custom config for Next.js
   */
  return (nextConfig = {}) => {
    return {
      webpack5: true,
      webpack(config, options) {
        const { dev, isServer } = options;

        config.module.rules.push({
          test: /\.css$/i,
          sideEffects: true,
          use: dev
            ? getGlobalCssLoader(
                {
                  assetPrefix: options.config.assetPrefix,
                  future: {
                    webpack5: true,
                  },
                  isClient: !isServer,
                  isServer,
                  isDevelopment: dev,
                },
                [],
                []
              )
            : [MiniCssExtractPlugin.loader, "css-loader"],
        });

        const plugins = [];

        plugins.push(new VanillaExtractPlugin(pluginOptions));

        if (!dev) {
          plugins.push(
            new MiniCssExtractPlugin({
              filename: "static/css/[contenthash].css",
              chunkFilename: "static/css/[contenthash].css",
              ignoreOrder: true,
            })
          );
        }

        config.plugins.push(...plugins);

        if (typeof nextConfig.webpack === "function") {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    };
  };
}

module.exports = withPlugins([
  [withBundleAnalyzer],
  [withVanillaExtract()],
  // your other plugins here
]);
