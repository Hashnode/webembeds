import { makeRequest } from "../requestHandler";
import Platform, { OEmbedResponseType, PlatformType } from "../../modules/Platform";

export default class Giphy extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    const response = await makeRequest(`${this.targetURL}?url=${encodeURIComponent(this.embedURL)}`);
    const data = response ? response.data : null;

    if (!data) {
      return null;
    }

    const url = this.embedURL;
    const href = this.embedURL;
    let extractedID;

    const index = url.lastIndexOf("-");
    if (index !== -1) {
      extractedID = url.substring(index + 1);
    } else {
      extractedID = url.substring(url.lastIndexOf("/") + 1);
    }

    const html = `<iframe loading="lazy" src="https://giphy.com/embed/${extractedID}" width="${data.width || 480}" height="${data.height || 480}" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="${href}">via GIPHY</a></p>`;

    return {
      version: 0.1,
      type: "rich",
      title: "Giphy",
      html,
    };
  }
}
