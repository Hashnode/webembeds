import Platform, { OEmbedResponseType, PlatformType } from "../../modules/Platform";

export default class GithubGist extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    console.log("Custom gist pull");
    const { cheerio } = this;
    const $ = cheerio.load("<script>");
    $("script").attr("src", `${this.embedURL}.js`);

    return {
      version: 0.1,
      type: "rich",
      title: "Github Gist",
      html: $.html(),
    };
  }
}
