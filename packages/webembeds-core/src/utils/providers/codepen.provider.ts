import Platform, { OEmbedResponseType, PlatformType } from "../../modules/Platform";

export default class Giphy extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    const host = "https://codepen.io/";
    let path = this.embedURL.split(host)[1];
    path = path.replace("pen", "embed");

    return {
      version: 0.1,
      type: "rich",
      title: "Codepen",
      html: `<iframe loading="lazy" scrolling="no" src="${host + path}" class="codepen-embed" width="100%" height="480" frameborder="0" allowfullscreen="true"></iframe>`,
    };
  }
}
