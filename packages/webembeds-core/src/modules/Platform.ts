import cheerio from "cheerio";
import queryString from "querystring";
import { makeRequest } from "../utils/requestHandler";
import { wrapHTML } from "../utils/html.utils";

import type {
  OembedRequestQueryParamsType,
  OEmbedResponseType,
  PlatformType,
  WebEmbedInitOptions,
  RequestResponseType,
} from "../types";

class Platform {
  provider: {
    custom? : boolean,
    customClass?: any,
    discover: boolean,
    noCustomWrap?: boolean,
  } | null;

  embedURL: string;

  targetURL: string | undefined;

  response: RequestResponseType = null;

  queryParams: OembedRequestQueryParamsType;

  cheerio: any;

  options: WebEmbedInitOptions;

  constructor({
    provider, targetURL, embedURL, queryParams, options,
  }: PlatformType) {
    this.provider = provider;
    this.targetURL = targetURL;
    this.embedURL = embedURL;
    this.queryParams = queryParams;
    this.cheerio = cheerio;

    this.options = {
      host: options.host || null,
      queryParams: options.queryParams,
      webembedWrap: options.webembedWrap || false,
    };
  }

  async run(): Promise<OEmbedResponseType | null> {
    const qs = queryString.stringify({
      ...this.queryParams,
      url: this.embedURL,
    });

    const response = await makeRequest(`${this.targetURL}?${qs}`);
    this.response = response;

    if (response && response.data) {
      let { html } = response.data;

      if (this.provider && !this.provider.noCustomWrap) {
        html = wrapHTML(response.data, this.queryParams);
      }

      return {
        version: 0.1,
        type: "rich",
        title: "WebEmbed",
        html,
      };
    }

    return null;
  }
}

export default Platform;
