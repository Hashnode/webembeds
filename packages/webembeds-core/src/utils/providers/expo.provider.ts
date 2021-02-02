import UrlParse from "url-parse";
import Platform, { OEmbedResponseType, PlatformType, OembedRequestQueryParamsType } from "../../modules/Platform";

export default class ExpoSnack extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    const { cheerio } = this;
    const { theme = null }: any = this.queryParams;

    const url = UrlParse(this.embedURL);
    const snackId = url.pathname.replace(/^\/|\/$/g, "");
    const $ = cheerio.load("<div>");

    $("div").attr("data-snack-id", snackId);
    $("div").attr("data-snack-platform", "web");
    $("div").attr("data-snack-preview", "true");
    $("div").attr("style", "overflow:hidden;background:#F9F9F9;border:1px solid var(--color-border);border-radius:4px;height:505px;width:100%");
    $("div").attr("data-snack-theme", theme || "light");

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
