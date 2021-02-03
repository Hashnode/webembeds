import Platform, { OEmbedResponseType, PlatformType } from "../../modules/Platform";

export default class Loom extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    const loomId = this.embedURL.replace("https://www.loom.com/share/", "");
    return {
      version: 0.1,
      type: "rich",
      title: "Loom",
      html: `<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/${loomId}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>`,
    };
  }
}
