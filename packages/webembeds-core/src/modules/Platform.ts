import cheerio from "cheerio";
import { makeRequest, RequestResponseType } from "../utils/requestHandler";
import { wrapHTML } from "../utils/html.utils";

/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
type OEmbedResponseType = {
  type: "photo" | "video" | "link" | "rich",
  version: 0.1,
  title: string,
  author_name?: string,
  author_url?: string,
  provider_name?: string,
  provider_url?: string,
  cache_age?: number,
  thumbnail_url?: string,
  // The width of the optional thumbnail.
  // If this parameter is present, thumbnail_url and thumbnail_height must also be present.
  thumbnail_width?: string,
  // The height of the optional thumbnail.
  // If this parameter is present, thumbnail_url and thumbnail_width must also be present.
  thumbnail_height?: string,
  html?: string,
} | null;

type PlatformType = {
  provider: {},
  targetURL?: string,
  embedURL: string,
  queryParams: {},
};

export type {
  OEmbedResponseType,
  PlatformType,
};

class Platform {
  provider: {};

  embedURL: string;

  targetURL: string | undefined;

  response: RequestResponseType = null;

  queryParams: {};

  cheerio: any;

  constructor({
    provider, targetURL, embedURL, queryParams,
  }: PlatformType) {
    this.provider = provider;
    this.targetURL = targetURL;
    this.embedURL = embedURL;
    this.queryParams = queryParams;
    this.cheerio = cheerio;
  }

  run = async (): Promise<OEmbedResponseType> => {
    const response = await makeRequest(`${this.targetURL || this.embedURL}?url=${encodeURIComponent(this.embedURL)}`);
    this.response = response;
    if (response && response.data) {
      const html = wrapHTML(response.data.html);
      return {
        version: 0.1,
        type: "rich",
        title: "Twitch",
        html,
      };
    }
    return null;
  }
}

export default Platform;
