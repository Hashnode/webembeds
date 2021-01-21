const oEmbedProviders = require("../utils/providers/oembed.providers.js");
const Platform = require("./Platform.ts");

/**
 * Request structure
 * {
 *  url: string,
 *  oEmbed: boolean: true // false: Response omits oEmbed field
 *  custom: false // Response omits custom field
 * }
 * Final response structure
 * {
 *  oEmbed: {},
 *  custom: {}
 * }
 */

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
};

module.exports = class WebembedHandler {
  // The main embed URL
  embedURL: string

  // Excludes oEmbed field from response when set to false
  excludeOEmbed: boolean | true;

  finalResponse: {} = {};

  platform: any = {};

  platformDetails: {} | null = null;

  matchedPlatform: {} | null = null;

  constructor(incomingURL: string, { oEmbed = true }: { oEmbed: boolean }) {
    this.embedURL = incomingURL;
    this.excludeOEmbed = oEmbed;
  }

  detectPlatform = () => {
    let destinationProvider: { endpoints: any; } | null = null;
    let targetURL = null;
    let found = false;

    oEmbedProviders.forEach((provider: { endpoints: any[]; }) => {
      provider.endpoints.forEach((endpoint) => {
        if (endpoint.schemes && endpoint.schemes.length > 0) {
          endpoint.schemes.forEach((scheme: string) => {
            // eslint-disable-next-line no-useless-escape
            console.log(this.embedURL.match(scheme.replace(/\*/g, ".*").replace(/\//g, "\/").replace(/\//g, "\\/")));
            if (this.embedURL.match(scheme.replace(/\*/g, ".*").replace(/\//g, "\/").replace(/\//g, "\\/"))) {
              console.log(RegExp.$1, RegExp.$2);
              destinationProvider = provider;
              targetURL = endpoint.url;
              found = true;
            }
          });
        } else if (endpoint.url.match(this.embedURL)) {
          // If there are no schemes Ex. https://www.beautiful.ai/
          // Consider the url to be the targetURL
          destinationProvider = provider;
          targetURL = endpoint.url;
          found = true;
        }
      });
    });

    // If not among ones we support, return null
    if (!found) {
      return null;
    }

    return {
      provider: destinationProvider,
      targetURL,
    };
  }

  run = async () => {
    // ex. youtube, twitter, etc.
    const platformDetails = this.detectPlatform();
    console.log(platformDetails);
    // If not supported
    if (!platformDetails) {
      this.platform = new Platform(null, this.embedURL);
    } else {
      const { provider = {}, targetURL }: { provider: {
        custom? : boolean,
        customClass?: any,
      } | null, targetURL: null } = platformDetails;

      // If custom, create a new instance of customClass which extends Platform behind the scenes
      if (provider && provider.custom) {
        const CustomClass = provider.customClass;
        this.platform = new CustomClass({ provider, targetURL }, this.embedURL);
      } else {
        // Else instantiate Platform and proceed
        this.platform = new Platform({ provider, targetURL }, this.embedURL);
      }
    }

    this.platformDetails = platformDetails;
  }

  generateResponse = async (): Promise<{ output?: OEmbedResponseType | null, error?: boolean }> => {
    const output = await this.platform.generateOutput();
    if (output) {
      return {
        output,
        error: false,
      };
    }
    return { output: null, error: true };
  }
};

export {};
