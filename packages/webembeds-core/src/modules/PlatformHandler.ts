const oEmbedProviders = require("../utils/providers/oembed.providers.js");
const Platform = require("./Platform.ts");

class PlatformHandler {
  embedURL: string;

  excludeOEmbed: boolean | true;

  matchedPlatform: {} | null = null;

  providerDetails = {};

  queryParams: any = {};

  constructor(embedURL: string, opts: {
    excludeOEmbed: boolean | true,
    queryParams?: {}
  }) {
    this.embedURL = embedURL;
    this.excludeOEmbed = opts.excludeOEmbed;
    this.queryParams = opts.queryParams;
  }

  detectPlatform = () => {
    let destinationPlatform: { endpoints: any; } | null = null;
    let targetURL = null;
    let oEmbedAvailable = false;
    let found = false;

    oEmbedProviders.forEach((platform: { endpoints: any[]; }) => {
      platform.endpoints.forEach((endpoint) => {
        if (endpoint.schemes && endpoint.schemes.length > 0) {
          endpoint.schemes.forEach((scheme: string) => {
            // eslint-disable-next-line no-useless-escape
            if (this.embedURL.match(scheme.replace(/\*/g, ".*").replace(/\//g, "\/").replace(/\//g, "\\/"))) {
              destinationPlatform = platform;
              targetURL = endpoint.url;
              oEmbedAvailable = true;
              found = true;
            }
          });
        } else if (endpoint.url.match(this.embedURL)) {
          // If there are no schemes Ex. https://www.beautiful.ai/
          // Consider the url to be the targetURL
          destinationPlatform = platform;
          targetURL = endpoint.url;
          oEmbedAvailable = true;
          found = true;
        }
      });
    });

    this.matchedPlatform = found ? {
      platformDetails: destinationPlatform,
      targetURL,
      oEmbedAvailable,
    } : null;

    return found ? new Platform(this.matchedPlatform, this.embedURL) : null;
  }
}

module.exports = PlatformHandler;
