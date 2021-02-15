import WebembedHandler from "./modules/WebembedHandler";
import type { WebEmbedInitOptions } from "./types";

function init(incomingURL: string, options?: WebEmbedInitOptions) {
  try {
    // eslint-disable-next-line no-new
    new URL(incomingURL);
  } catch (error) {
    console.log("Invalid url", error);
    return {
      output: null,
      error: true,
    };
  }

  const handler = new WebembedHandler(incomingURL, options || {});

  return handler.generateResponse();
}

export default init;
