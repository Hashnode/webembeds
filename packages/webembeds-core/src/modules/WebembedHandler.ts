import oembed from "oembed";
import tryEach from "async/tryEach";
import Platform from "./Platform";
import oEmbedProviders from "../utils/providers/oembed.providers";
import { getMetaData } from "../utils/requestHandler";
import { wrapFallbackHTML } from "../utils/html.utils";

import type {
  OEmbedResponseType,
  ProviderDetails,
} from "../types";

export default class WebembedHandler {
  // The main embed URL
  embedURL: string

  finalResponse: {} = {};

  queryParams: {} = {};

  platform: any = {};

  matchedPlatform: {} | null = null;

  providerDetails: ProviderDetails;

  options: any;

  constructor(incomingURL: string, options: any) {
    const { queryParams = {} } = options;
    this.embedURL = incomingURL;
    this.options = options;
    this.queryParams = queryParams;
    this.providerDetails = this.detectProvider();
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
              // TODO: Pattern match here
              targetURL = endpoint.url;
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
      targetURL: targetURL || this.embedURL,
    };
  }

  generateOEmbed = (callback: any) => {
    const { embedURL, queryParams } = this;
    const { provider } = this.providerDetails;

    if (provider && provider.custom) {
      callback(true);
      return;
    }

    oembed.fetch(embedURL, { format: "json", ...queryParams }, (error: any, result: OEmbedResponseType): any => {
      if (error) {
        callback(true);
        return;
      }
      callback(null, result);
    });
  }

  // eslint-disable-next-line no-async-promise-executor
  generateManually = async () => new Promise(async (resolve, reject) => {
    const { provider, targetURL } = this.providerDetails;
    const { embedURL, queryParams } = this;

    if (!provider || !targetURL) {
      return reject();
    }

    // This should fetch an oembed response
    if (provider && provider.custom && provider.customClass) {
      const CustomClass = provider.customClass;
      this.platform = new CustomClass({
        provider, targetURL, embedURL, queryParams, options: this.options,
      });
    } else {
      this.platform = new Platform({
        provider, targetURL, embedURL, queryParams, options: this.options,
      });
    }

    const finalResponse = await this.platform.run();
    return resolve(finalResponse);
  })

  // Generate a common fallback here by scraping for the common metadata from the platform
  // Use this.platform to generate fallback as it already has a response object
  generateFallback = async () => {
    try {
      const data = await getMetaData(this.embedURL);
      const html = await wrapFallbackHTML(data);
      return { ...data, html };
    } catch (error) {
      return null;
    }
  };

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
    tryEach([this.generateOEmbed, this.generateManually, this.generateFallback],
      (error: any, results: any): void => {
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
}
