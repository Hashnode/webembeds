const oembed = require("oembed");
const webembed = require("../build/bundle");

// eslint-disable-next-line no-unused-expressions
// https://www.youtube.com/watch?v=32I0Qso4sDg&width=720&height=480
// https://www.youtube.com/oembed
// https://api.instagram.com/oembed/?url=https://www.instagram.com/p/CKQWst1A3my&hidecaption=0&maxwidth=540

// %[https://www.instagram.com/p/CJ2ja7Tl3S5] - Not supported currently

/**
Markdown samples
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
when an unknown printer took a galley of type and scrambled it to make a type specimen book.
It has survived not only five centuries, but also the leap into electronic typesetting,
remaining essentially unchanged. It was popularised in the 1960s with the release of
Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
software like Aldus PageMaker including versions of Lorem Ipsum.

%[https://codesandbox.io/s/y2lrywpk21]

%[https://codepen.io/szs/pen/JhgKC]

%[https://vimeo.com/336812660]

%[https://www.loom.com/share/0281766fa2d04bb788eaf19e65135184]

%[https://anchor.fm/startapodcast/episodes/Whats-your-podcast-about-e17krq/a-a2q3ft]

%[https://soundcloud.com/hit-jatt/jatt-disde-arjan-dhillon]

%[https://repl.it/@GirishPatil4/AdvancedRespectfulGigahertz]

%[https://runkit.com/runkit/welcome]

%[https://open.spotify.com/track/3G8o2zm7LaF6eeVuvLlrkJ?si=Sx1sCnhDT6GXqSLIwSLOeQ]

%[https://gist.github.com/theevilhead/7ac2fbc3cda897ebd87dbe9aeac130d6]

%[https://www.canva.com/design/DAET1m0_11c/jFBlYrKc8CQCb2boU9KC-A/view]

%[https://www.youtube.com/watch?v=32I0Qso4sDg]

%[https://glitch.com/edit/#!/remote-hands]

%[https://snack.expo.io/@girishhashnode/unnamed-snack]

%[https://www.twitch.tv/fresh]

%[https://twitter.com/hashnode/status/1352525138659430400]

%[https://hashnode.com]

 */

const links = {
  spotify: "https://open.spotify.com/track/3G8o2zm7LaF6eeVuvLlrkJ?si=Sx1sCnhDT6GXqSLIwSLOeQ",
  gist: "https://gist.github.com/theevilhead/7ac2fbc3cda897ebd87dbe9aeac130d6",
  canva: "https://www.canva.com/design/DAEWRhUKdvg/view",
  codepen: "https://codepen.io/bsehovac/pen/EMyWVv",
  youtube: "https://www.youtube.com/watch?v=32I0Qso4sDg",
  twitter: "https://twitter.com/hashnode/status/1352525138659430400",
  instagram: "https://www.instagram.com/p/CJ2ja7Tl3S5/",
  glitch: "https://glitch.com/edit/#!/remote-hands",
  expo: "https://snack.expo.io/@girishhashnode/unnamed-snack",
  twitch: "https://www.twitch.tv/fresh",
  giphy: "https://giphy.com/gifs/cbsnews-inauguration-2021-XEMbxm9vl9JIIMcE7M",
  metascraper: "https://metascraper.js.org/",
  runkit: "https://runkit.com/runkit/welcome",
  repl: "https://repl.it/@GirishPatil4/AdvancedRespectfulGigahertz",
  soundcloud: "https://soundcloud.com/hit-jatt/jatt-disde-arjan-dhillon",
  anchor: "https://anchor.fm/startapodcast/episodes/Whats-your-podcast-about-e17krq/a-a2q3ft",
  loom: "https://www.loom.com/share/0281766fa2d04bb788eaf19e65135184",
  vimeo: "https://vimeo.com/336812660",
  // facebook: "https://www.facebook.com/MoHFWIndia/posts/1757090964450303",
  fallback: "https://hashnode.com",
};

(async function () {
  try {
    const url = links.canva;
    const l = await webembed.default(url, {
      host: "hashnode.com",
      queryParams: {
        theme: "dark",
      },
    });
    console.log("Test Result ", l);
  } catch (error) {
    console.log("final", JSON.stringify(error));
  }
}());
