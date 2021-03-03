import Platform from "../../modules/Platform";
import type { OEmbedResponseType, PlatformType } from "../../types";
import { wrapHTML } from "../html.utils";

export default class GithubGist extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    const response = {
      version: 0.1,
      type: "rich",
      title: "Github Gist",
      html: "",
    };

    // if (this.options.webembedWrap) {
    //   response.html = `<iframe scrolling="no" src="http://localhost:3001/api/html?url=${this.embedURL}"></iframe>`;
    //   response.html = wrapHTML(response);
    //   return response;
    // }

    return {
      ...response,
      html: `<script type="text/javascript" src="${this.embedURL}.js"></script>`,
    };
  }
}
