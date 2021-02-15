import Platform from "../../modules/Platform";
import type { OEmbedResponseType, PlatformType } from "../../types";

export default class Instagram extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    console.log("Custom Instagram pull");

    // const id = this.embedURL.replace("https://www.instagram.com/p/", "").trim().replace(/\//g, "");
    return {
      version: 0.1,
      type: "rich",
      title: "Instagram",
      html: "<h1>Not supported yet</h1>",
    };
  }
}
