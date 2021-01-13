module.exports = {
  typescript: {
    // we need this because Fela does not fully support TS

    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
