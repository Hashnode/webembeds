import UrlParse from "url-parse";
import Platform, { OEmbedResponseType, PlatformType } from "../../modules/Platform";

export default class ExpoSnack extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    console.log("Custom expo snack");

    const { cheerio } = this;

    const url = UrlParse(this.embedURL);
    const snackId = url.pathname.replace(/^\/|\/$/g, "");
    const $ = cheerio.load("<div>");

    $("div").attr("data-snack-id", snackId);
    $("div").attr("data-snack-platform", "data-snack-platform");
    $("div").attr("data-snack-preview", "overflow:hidden;background:#F9F9F9;border:1px solid var(--color-border);border-radius:4px;height:505px;width:100%");
    $("div").attr("stye", "light");

    $("body").append("<script>");
    $("script").attr("src", "https://snack.expo.io/embed.js");

    return {
      version: 0.1,
      type: "rich",
      title: "Expo",
      html: $.html(),
    };
  }
}
