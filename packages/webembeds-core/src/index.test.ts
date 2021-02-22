const webembed = require("../build/bundle");

const links = [
  ["spotify", "https://open.spotify.com/track/3G8o2zm7LaF6eeVuvLlrkJ?si=Sx1sCnhDT6GXqSLIwSLOeQ"],
  ["gist", "https://gist.github.com/theevilhead/7ac2fbc3cda897ebd87dbe9aeac130d6"],
  ["canva", "https://www.canva.com/design/DAET1m0_11c/jFBlYrKc8CQCb2boU9KC-A/view"],
  ["codepen", "https://codepen.io/bsehovac/pen/EMyWVv"],
  ["youtube", "https://www.youtube.com/watch?v=32I0Qso4sDg"],
  ["twitter", "https://twitter.com/hashnode/status/1352525138659430400"],
  ["glitch", "https://glitch.com/edit/#!/remote-hands"],
  ["expo", "https://snack.expo.io/@girishhashnode/unnamed-snack"],
  ["twitch", "https://www.twitch.tv/fresh"],
  ["giphy", "https://giphy.com/gifs/cbsnews-inauguration-2021-XEMbxm9vl9JIIMcE7M"],
  ["metascraper", "https://metascraper.js.org/"],
  ["runkit", "https://runkit.com/runkit/welcome"],
  ["repl", "https://repl.it/@GirishPatil4/AdvancedRespectfulGigahertz"],
  ["soundcloud", "https://soundcloud.com/hit-jatt/jatt-disde-arjan-dhillon"],
  ["anchor", "https://anchor.fm/startapodcast/episodes/Whats-your-podcast-about-e17krq/a-a2q3ft"],
  ["loom", "https://www.loom.com/share/0281766fa2d04bb788eaf19e65135184"],
  ["vimeo", "https://vimeo.com/336812660"],
  ["fallback", "https://hashnode.com"],
];

test.concurrent.each(Object.values(links))("Testing %s embed", async (input, output) => {
  try {
    const result = await webembed.default(input);
    expect(result).toBe(output);
  } catch (error) {
    console.log("final", JSON.stringify(error));
  }
});

export {};
