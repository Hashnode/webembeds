const UrlParse = require("url-parse");

const { makeRequest } = require("../utils/requestHandler.ts");
const { wrapHTML } = require("../utils/html.utils.ts");

class Platform {
  url: string;

  details: {};

  embedURL: string;

  oEmbedAvailable: boolean;

  response: { html?: {} | null } = { html: null };

  metaTags: [] | null = [];

  queryParams: {} = {};

  constructor(matchedPlatform: {
      platformDetails: any,
      targetURL: any,
      oEmbedAvailable: any,
    }, embedURL: string) {
    const { platformDetails, targetURL, oEmbedAvailable } = matchedPlatform;

    this.url = targetURL;
    this.embedURL = embedURL;
    this.details = platformDetails;
    this.oEmbedAvailable = oEmbedAvailable;
    const url = new UrlParse(this.embedURL);
    this.queryParams = url.query;
  }

  makeRequest = async () => {
    console.log(`${this.url}?url=${encodeURIComponent(this.embedURL)}`);
    const response = await makeRequest(`${this.url}?url=${this.embedURL}`);
    this.response = response.data;
  }

  generateOEmbed = () => {
    const updatedHTML = wrapHTML(this.response.html, {
      targetURL: this.url,
      embedURL: this.embedURL,
      queryParams: this.queryParams,
    });
    this.response.html = updatedHTML;
    return this.response;
  };
}

module.exports = Platform;

export {};
