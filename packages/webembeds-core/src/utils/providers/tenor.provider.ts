import Platform from "../../modules/Platform";
import type {
  OEmbedResponseType,
  PlatformType,
} from "../../types";
import { wrapHTML } from "../html.utils";

export default class Tenor extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType | null> => {
    const splits = this.embedURL.split("/");
    const lastPart = splits[splits.length - 1];
    const extractedID = lastPart.substring(
      lastPart.lastIndexOf("-") + 1,
    );

    const html = `<iframe loading="lazy" src="https://tenor.com/embed/${extractedID}" frameBorder="0" allowFullScreen></iframe>`;

    const temp = {
      version: 0.1,
      type: "rich",
      title: "Tenor",
      html,
    };

    const wrappedHTML = wrapHTML(temp);

    return {
      ...temp,
      html: wrappedHTML,
    };
  };
}
