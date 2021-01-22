const UrlParse = require("url-parse");
const oembed = require("oembed");
const async = require("async");
const { AsyncFunction } = require("async");
const Platform = require("./Platform.ts");
const oEmbedProviders = require("../utils/providers/oembed.providers.js");
const { makeRequest } = require("../utils/requestHandler.ts");

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
};

type EmbedErrorType = {
  type: "request-error",
  html?: string | null,
  message: string,
  code?: number,
};

module.exports = class WebembedHandler {
  // The main embed URL
  embedURL: string

  finalResponse: {} = {};

  queryParams: {} = {};

  platform: any = {};

  matchedPlatform: {} | null = null;

  constructor(incomingURL: string) {
    this.embedURL = incomingURL;

    const url = new UrlParse(this.embedURL);
    this.queryParams = url.query;
  }

  detectProvider = () => {
    let destinationProvider: { endpoints: any; } | null = null;
    let targetURL = null; // The endpoint that the embedURL should be queried upon

    oEmbedProviders.forEach((provider: { endpoints: any[]; }) => {
      provider.endpoints.forEach((endpoint) => {
        if (endpoint.schemes && endpoint.schemes.length > 0) {
          endpoint.schemes.forEach((scheme: string) => {
            // eslint-disable-next-line no-useless-escape
            if (this.embedURL.match(scheme.replace(/\*/g, ".*").replace(/\//g, "\/").replace(/\//g, "\\/"))) {
              if (endpoint.url.indexOf("*") > -1) {
                targetURL = endpoint.url;
              } else {
                targetURL = endpoint.url;
              }

              destinationProvider = provider;
            }
          });
        } else if (endpoint.url.match(this.embedURL)) {
          // If there are no schemes Ex. https://www.beautiful.ai/
          // Consider the url to be the targetURL
          destinationProvider = provider;
          targetURL = endpoint.url;
        }
      });
    });

    return {
      provider: destinationProvider,
      targetURL,
    };
  }

  generateOEmbed = (callback: typeof AsyncFunction) => {
    console.log("Running generateOEmbed");
    const { embedURL, queryParams } = this;
    // eslint-disable-next-line consistent-return
    oembed.fetch(embedURL, { format: "json", ...queryParams }, (error: any, result: OEmbedResponseType): any => {
      if (error) {
        return callback(error, null);
      }
      callback(null, result);
    });
  }

  // eslint-disable-next-line consistent-return
  generateManually = async (callback: typeof AsyncFunction) => {
    console.log("Running generateManually");

    const providerDetails = this.detectProvider();
    const { provider = {}, targetURL }: { provider: {
      custom? : boolean,
      customClass?: any,
    } | null, targetURL: null } = providerDetails;
    const { embedURL, queryParams } = this;

    if (!provider || !targetURL) {
      return callback(true, null);
    }
    // This should fetch an oembed response
    if (provider && targetURL) {
      if (provider && provider.custom) {
        const CustomClass = provider.customClass;
        this.platform = new CustomClass({
          provider, targetURL, embedURL, queryParams,
        });
      } else {
        this.platform = new Platform({
          provider, targetURL, embedURL, queryParams,
        });
      }
      const finalResponse = await this.platform.run();
      callback(null, finalResponse);
    }
  }

  // Generate a common fallback here by scraping for the common metadata from the platform
  // Use this.platform to generate fallback as it already has a response object
  generateFallback = async (callback: typeof AsyncFunction) => (1);

  /**
  * First try with oembed()
    If error is thrown
      - Try with our providers list
        1. detect platform
        2. make a request
        3. generate response if successful request is made
        If request breaks or some error is returned
      - Try with fallback response
        - Try generating fallback cover with the response details
      If this fails too, return a fatal error
   */
  generateOutput = async (): Promise<OEmbedResponseType> => new Promise((resolve, reject) => {
    async.tryEach([this.generateOEmbed, this.generateManually, this.generateFallback],
      (error: any, results: any): void => {
        // console.log(error, results);
        if (error) {
          reject(error);
        }
        resolve(results);
      });
  })

  generateResponse = async (): Promise<{ output?: OEmbedResponseType | null, error?: boolean }> => {
    const output = await this.generateOutput();

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
