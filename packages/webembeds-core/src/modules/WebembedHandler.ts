import UrlParse from "url-parse";
import oembed from "oembed";
import Platform, { OEmbedResponseType } from "./Platform";
import oEmbedProviders from "../utils/providers/oembed.providers";
import { getMetaData } from "../utils/requestHandler";
import { wrapFallbackHTML } from "../utils/html.utils";
import tryEach from "async/tryEach";

/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
type EmbedErrorType = {
  type: "request-error",
  html?: string | null,
  message: string,
  code?: number,
};

export default class WebembedHandler {
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
      targetURL: targetURL || this.embedURL,
    };
  }

  generateOEmbed = (callback: any) => {
    console.log("Running generateOEmbed");
    const { embedURL } = this;
    oembed.fetch(embedURL, { format: "json" }, (error: any, result: OEmbedResponseType): any => {
      if (error) {
        console.log("Running generateOEmbed", !!error);
      }
      callback(true);
    });
  }

  generateManually = async (callback: any) => {
    const providerDetails = this.detectProvider();

    const { provider = {}, targetURL }: { provider: {
      custom? : boolean,
      customClass?: any,
    } | null, targetURL: string } = providerDetails;
    const { embedURL, queryParams } = this;

    if (!provider || !targetURL) {
      return null;
    }
    // This should fetch an oembed response
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
    // callback(null, finalResponse);
    return finalResponse;
  }

  // Generate a common fallback here by scraping for the common metadata from the platform
  // Use this.platform to generate fallback as it already has a response object
  generateFallback = async (callback: any) => {
    console.log("Running Fallback wqeqwe ");
    try {
      const data = await getMetaData(this.embedURL);
      const html = wrapFallbackHTML(data);
      return { ...data, html };
    } catch (error) {
      console.log("12312321", error)
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
    tryEach([this.generateOEmbed, this.generateManually],
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
};
