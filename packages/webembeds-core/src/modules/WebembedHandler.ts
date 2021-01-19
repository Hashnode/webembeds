const PlatformHandler = require("./PlatformHandler.ts");

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

  constructor(incomingURL: string, { oEmbed = true }: { oEmbed: boolean }) {
    this.embedURL = incomingURL;
    this.excludeOEmbed = oEmbed;
  }

  run = async () => {
    const platformHandler = new PlatformHandler(this.embedURL, {
      excludeOEmbed: this.excludeOEmbed,
    });

    // ex. youtube, twitter, etc.
    this.platform = platformHandler.detectPlatform();

    if (!this.platform) {
      // eslint-disable-next-line no-console
      console.log("---- Platform not supported ----");
      return;
    }

    await this.platform.makeRequest();
  }

  generateResponse = (): { oEmbed?: OEmbedResponseType, error?: boolean } => {
    if (this.platform) {
      return {
        oEmbed: this.platform.generateOEmbed(),
        error: false,
      };
    }
    return { error: true };
  }
};

export {};
