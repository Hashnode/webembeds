import { makeRequest } from "../requestHandler";
import Platform from "../../modules/Platform";
import type { OEmbedResponseType, PlatformType } from "../../types";
import { wrapHTML } from "../html.utils";

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

    const { url } = data;

    if (!url) {
      return null;
    }

    const cleanURL = url.replace("/giphy.gif", "");
    const extractedID = cleanURL.substr(cleanURL.lastIndexOf("/") + 1);

    const html = `<iframe loading="lazy" src="https://giphy.com/embed/${extractedID}" frameBorder="0" allowFullScreen></iframe>`;

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
