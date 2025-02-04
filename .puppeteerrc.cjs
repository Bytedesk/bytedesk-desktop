/**
 * https://pptr.dev/guides/configuration
 * @type {import("puppeteer").Configuration}
 */
const { join } = require("path");
// 
module.exports = {
  // Download Chrome (default `skipDownload: false`).
  // chrome: {
  //   skipDownload: false,
  // },
  // Download Firefox (default `skipDownload: true`).
  //   firefox: {
  //     skipDownload: false,
  //   },
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
