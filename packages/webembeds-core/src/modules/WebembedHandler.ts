/* eslint-disable camelcase */
import oembed from "oembed";
import tryEach from "async/tryEach";
import Platform from "./Platform";
import oEmbedProviders from "../utils/providers/oembed.providers";
import { getMetaData } from "../utils/requestHandler";
import { wrapFallbackHTML, wrapHTML } from "../utils/html.utils";

import type {
  OEmbedResponseType,
  ProviderDetails,
} from "../types";

export default class WebembedHandler {
  // The main embed URL
  embedURL: string;

  finalResponse: {} = {};

  queryParams: {
    forceFallback: boolean,
  } = {
    forceFallback: false,
  };

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

  /**
   * @desc Goes through providers list and tries to find respective provider for incoming embedURL
   * @returns {object} providerDetails.provider the respective provider object from list
   * @returns {targetURL} providerDetails.targetURL the final url where the request
   *  must be made with embedURL, if no targetURL found, it will be the embedURL itself.
   */
  detectProvider = () => {
    let destinationProvider: { endpoints: any, provider_name: string } | null = null;
    let targetURL = null; // The endpoint that the embedURL should be queried upon

    let found = false;
    oEmbedProviders.some((provider: { endpoints: any[], provider_name: string }) => {
      provider.endpoints.some((endpoint) => {
        if (!endpoint.schemes || endpoint.schemes.length === 0) {
          // If there are no schemes Ex. https://www.beautiful.ai/
          // Consider the url to be the targetURL

          if (this.embedURL.match(endpoint.url.replace(/\*/g, ".*").replace(/\//g, "\/").replace(/\//g, "\\/"))) {
            targetURL = endpoint.url;
            destinationProvider = provider;
            return true;
          }
          return false;
        }

        found = endpoint.schemes.some((scheme: string) => {
          // eslint-disable-next-line no-useless-escape
          if (this.embedURL.match(scheme.replace(/\*/g, ".*").replace(/\//g, "\/").replace(/\//g, "\\/"))) {
            targetURL = endpoint.url;
            destinationProvider = provider;
            return true;
          }
          return false;
        });
        return found;
      });
      return found;
    });
    return {
      provider: destinationProvider,
      targetURL: targetURL || this.embedURL,
    };
  }

  generateOEmbed = (callback: any) => {
    const { embedURL, queryParams } = this;
    const { provider } = this.providerDetails;

    if (!provider || (provider && provider.custom)) {
      callback(true);
      return;
    }

    const { noCustomWrap = false } = provider;

    oembed.fetch(embedURL, { format: "json", ...queryParams }, (error: any, result: OEmbedResponseType): any => {
      if (error) {
        callback(true);
        return;
      }
      const final = result;

      if (final && final.html && !noCustomWrap) {
        final.html = wrapHTML(final);
      }

      callback(null, final);
    });
  }

  // eslint-disable-next-line no-async-promise-executor
  generateManually = async () => {
    const { provider, targetURL } = this.providerDetails;
    const { embedURL, queryParams } = this;

    if (!provider || !targetURL) {
      throw new Error();
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
    return finalResponse;
  }

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
  // eslint-disable-next-line max-len
  generateOutput = async (): Promise<OEmbedResponseType | null> => new Promise((resolve, reject) => {
    if (this.queryParams.forceFallback) {
      tryEach([this.generateFallback],
        (error: any, results: any): void => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        });
    }

    tryEach([this.generateManually, this.generateFallback],
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
