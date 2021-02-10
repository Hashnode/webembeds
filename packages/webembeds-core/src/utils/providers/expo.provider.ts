import UrlParse from "url-parse";
import Platform, { OEmbedResponseType, PlatformType } from "../../modules/Platform";

export default class ExpoSnack extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    const { cheerio } = this;

    const url = UrlParse(this.embedURL, true);
    const snackId = url.pathname.replace(/^\/|\/$/g, "");

    const { theme = "light" } = this.queryParams;

    const html = `<div data-snack-id="${snackId}" data-snack-platform="web" data-snack-preview="true" data-snack-theme="${theme}" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.08);border-radius:4px;height:505px;width:100%"></div><script async src="https://snack.expo.io/embed.js"></script><script>if(typeof ExpoSnack !== "undefined"){ ExpoSnack.initialize(); }</script>`

    return {
      version: 0.1,
      type: "rich",
      title: "Expo",
      html,
    };
  }
}
