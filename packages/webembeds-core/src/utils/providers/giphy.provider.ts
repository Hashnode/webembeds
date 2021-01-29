import Platform, { OEmbedResponseType, PlatformType } from "../../modules/Platform";

export default class Giphy extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    console.log("Custom Giphy pull");
    const data = await super.run();
    console.log("as", data);

    return {
      version: 0.1,
      type: "rich",
      title: "Giphy",
      html: `<iframe src="${data}" />`,
    };
  }
}
