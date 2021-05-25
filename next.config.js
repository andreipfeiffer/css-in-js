const withLinaria = require("./next-linaria");
const DEV = process.env.NODE_ENV !== "production";

module.exports = withLinaria({
  linaria: {
    evaluate: true,
    displayName: DEV,
  },
});
