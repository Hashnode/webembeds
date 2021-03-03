import WebembedHandler from "./modules/WebembedHandler";
import type { WebEmbedInitOptions } from "./types";

/**
 * @param {string} incomingURL
 * @param {object} options
 */
function init(incomingURL: string, options?: WebEmbedInitOptions) {
  try {
    // eslint-disable-next-line no-new
    new URL(incomingURL);
  } catch (error) {
    return {
      output: null,
      error: true,
    };
  }

  const handler = new WebembedHandler(incomingURL, options || {});

  return handler.generateResponse();
}

export default init;
