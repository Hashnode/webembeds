import { makeRequest } from "../requestHandler";
import Platform from "../../modules/Platform";
import type { OEmbedResponseType, PlatformType } from "../../types";
import { wrapHTML } from "../html.utils";
import Loom from "./loom.provider";

export default class Giphy extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType | null> => {
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

    const html = `<iframe loading="lazy" src="https://giphy.com/embed/${extractedID}" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="${href}">via GIPHY</a></p>`;

    const temp = {
      version: 0.1,
      type: "rich",
      title: "Giphy",
      html,
    };

    const wrappedHTML = wrapHTML(temp);

    return {
      ...temp,
      html: wrappedHTML,
    };
  }
}
