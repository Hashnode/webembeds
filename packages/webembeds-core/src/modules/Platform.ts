const UrlParse = require("url-parse");
const cheerio = require("cheerio");
const { makeRequest } = require("../utils/requestHandler.ts");

class Platform {
  url: string;

  provider: {};

  embedURL: string;

  response: { html?: {} | null } = { html: null };

  metaTags: [] | null = [];

  queryParams: {} = {};

  cheerio: any;

  constructor({ provider, targetURL }: { provider: any, targetURL: any, }, embedURL: string) {
    this.url = targetURL;
    this.embedURL = embedURL;
    this.provider = provider;
    const url = new UrlParse(this.embedURL);
    this.queryParams = url.query;
    this.cheerio = cheerio;
  }

  makeRequest = async () => {
    const response = await makeRequest(`${this.url}?url=${this.embedURL}&format=json`);
    this.response = response.data;
  }

  // Generate a common fallback here by scraping for the common metadata from the platform
  generateFallback = async () => (1);

  generateOutput = async () => {
    await this.makeRequest();
    return this.response;
  }
}

module.exports = Platform;

export {};
