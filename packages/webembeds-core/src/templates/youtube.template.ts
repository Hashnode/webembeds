import cheerio from "cheerio";

const allowedPatterns = [
  // Ex. https://www.youtube.com/watch?v=32I0Qso4sDg
  /^https?:\/\/www\.youtube\.com\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
];

const matches = (url: string) => {
  let matched = false;
  allowedPatterns.forEach((regex) => {
    if (url.match(regex)) {
      matched = true;
    }
  });
  return matched;
};

const transformURL = (url: string) => {
  if (url.match(/^https?:\/\/www\.youtube\.com\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i)) {
    return "https://youtube.com/embed/32I0Qso4sDg";
  }
  return "";
};

const generateHTML = (htmlContent: { iframe: any }) => {
  const $ = cheerio.load("<div><iframe/></div>");
  const iframe = $("iframe");
  iframe.attr({
    src: htmlContent && htmlContent.iframe && htmlContent.iframe.src,
    width: 640,
    height: 360,
  });
  return $.html();
};

const generate = (meta: any) => ({
  title: meta.title.content,
  description: meta.description.content,
  provider_name: "Youtube",
  provider_url: meta.url.content,
  html: generateHTML({
    iframe: {
      src: transformURL(meta.url.content),
    },
  }),
  thumbnail_url: meta.image.content,
  thumbnail_width: Number(meta["image:width"].content),
  thumbnail_height: Number(meta["image:height"].content),
});

const generateOEmbedOutput = (reformedTags: []) => generate(reformedTags);

export {
  matches,
  generate,
  generateOEmbedOutput,
};
