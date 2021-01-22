const UrlParse = require("url-parse");
const Platform = require("../../modules/Platform.ts");

class ExpoSnack extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(a: any, b: any) {
    super(a, b);
  }

  run = () => {
    console.log("Custom expo snack");

    const { cheerio } = this;
    const { theme = "light" } = this.queryParams;

    const url = UrlParse(this.embedURL);
    const snackId = url.pathname.replace(/^\/|\/$/g, "");
    const $ = cheerio.load("<div>");

    $("div").attr("data-snack-id", snackId);
    $("div").attr("data-snack-platform", "data-snack-platform");
    $("div").attr("data-snack-preview", "overflow:hidden;background:#F9F9F9;border:1px solid var(--color-border);border-radius:4px;height:505px;width:100%");
    $("div").attr("stye", theme);

    $("body").append("<script>");
    $("script").attr("src", "https://snack.expo.io/embed.js");
    return $.html();
  }
}

module.exports = ExpoSnack;
export {};
