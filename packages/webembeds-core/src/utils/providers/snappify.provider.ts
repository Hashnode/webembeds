import Platform from "../../modules/Platform";
import type { OEmbedResponseType, PlatformType } from "../../types";
import { makeRequest } from "../requestHandler";

export default class Snappify extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType | null> => {
    const response = await makeRequest(`${this.targetURL}?url=${encodeURIComponent(this.embedURL)}`);
    const data = response ? response.data : null;

    if (!data || !data.width || !data.height) {
      return null;
    }

    const host = "https://snappify.com/";
    let path = this.embedURL.split(host)[1];
    path = path.replace("view", "embed");

    const aspectRatioPercentage = (1 / (data.width / data.height)) * 100;

    const wrapperDivStyle = `position:relative;overflow:hidden;margin-left:auto;margin-right:auto;border-radius:10px;width:100%;max-width:${data.width}px`;
    const aspectRatioDivStyle = `width:100%;padding-bottom:${aspectRatioPercentage}%`;
    const iframeStyle = "position:absolute;left:0;top:0;width:100%";

    return {
      version: 0.1,
      type: "rich",
      title: "snappify",
      html: `<div style="${wrapperDivStyle}"><div style="${aspectRatioDivStyle}"></div><iframe width="${data.width}" height="${data.height}" title="${data.title}" src="${host + path}?responsive" allow="clipboard-write" style="${iframeStyle}" frameborder="0"></iframe></div>`,
    };
  };
}
