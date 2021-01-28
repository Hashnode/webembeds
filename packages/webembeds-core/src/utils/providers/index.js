const GithubGist = require("./gist.provider.ts");
const ExpoSnack = require("./expo.provider.ts");
const Giphy = require("./giphy.provider.ts");
const Instagram = require("./instagram.provider.ts");
const Twitch = require("./twitch.provider.ts");
const Glitch = require("./glitch.provider.ts");

// Remember, if you are changing export name here, don't forget to take a look at
// oembed.providers.js
module.exports = {
  GithubGist,
  ExpoSnack,
  Giphy,
  Instagram,
  Twitch,
  Glitch,
};
