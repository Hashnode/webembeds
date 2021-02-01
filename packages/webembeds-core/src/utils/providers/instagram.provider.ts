import Platform, { OEmbedResponseType, PlatformType } from "../../modules/Platform";

export default class Instagram extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    console.log("Custom Instagram pull");
    const id = this.embedURL.replace("https://www.instagram.com/p/", "").trim().replace(/\//g, "");
    return {
      version: 0.1,
      type: "rich",
      title: "Instagram",
      html: `<iframe width="100%" height="100%" src="https://www.instagram.com/p/${id}/embed/" />`,
    };
  }
}
