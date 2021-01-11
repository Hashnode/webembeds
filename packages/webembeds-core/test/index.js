const webembed = require("../build/bundle");

// eslint-disable-next-line no-unused-expressions
(async function () {
  const l = await webembed("https://www.youtube.com/watch?v=32I0Qso4sDg", { oEmbed: true });
  console.log(l);
})();
