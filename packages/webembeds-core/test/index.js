const webembed = require("../build/bundle");

// eslint-disable-next-line no-unused-expressions
(async function () {
  // https://www.youtube.com/watch?v=32I0Qso4sDg&width=720&height=480
  const l = await webembed("https://twitter.com/tapasadhikary/status/1343081386173874177", { oEmbed: true });
  console.log(l);
}());
