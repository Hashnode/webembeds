const oembed = require("oembed");
const webembed = require("../build/bundle");

// // eslint-disable-next-line no-unused-expressions
// https://www.youtube.com/watch?v=32I0Qso4sDg&width=720&height=480
// const l = await webembed("https://twitter.com/tapasadhikary/status/1343081386173874177");

const links = {
  spotify: "https://open.spotify.com/track/3G8o2zm7LaF6eeVuvLlrkJ?si=Sx1sCnhDT6GXqSLIwSLOeQ",
  gist: "https://gist.github.com/theevilhead/7ac2fbc3cda897ebd87dbe9aeac130d6",
  canva: "https://www.canva.com/design/DAET1m0_11c",
  codepen: "https://codepen.io/bsehovac/pen/EMyWVv",
  youtube: "https://www.youtube.com/watch?v=32I0Qso4sDg",
  twitter: "https://twitter.com/hashnode/status/1352525138659430400",
  instagram: "https://www.instagram.com/p/CJ2ja7Tl3S5/",
  glitch: "https://glitch.com/edit/#!/remote-hands",
  expo: "https://snack.expo.io/@girishhashnode/unnamed-snack",
  twitch: "https://www.twitch.tv/fresh",
  giphy: "https://giphy.com/gifs/cbsnews-inauguration-2021-XEMbxm9vl9JIIMcE7M",
  // glitch: "https://glitch.com/edit/#!/remote-hands?path=README.md%3A1%3A0",
  metascraper: "https://metascraper.js.org/",
};

(async function () {
  try {
    const url = links.twitter;
    const l = await webembed.default(url);
    console.log("Test Result ", l);
  } catch (error) {
    console.log("final", JSON.stringify(error));
  }
}());

// oembed.fetch(
//   links.twitter,
// 	{ maxwidth: 1920, format: "json" },
// 	function (error, result) {
// 		if (error) console.error(error);
// 		else console.log('oEmbed result', result);
// 	}
// );

//* *** */ https://api.instagram.com/oembed/?url=https://www.instagram.com/p/CKQWst1A3my&hidecaption=0&maxwidth=540
