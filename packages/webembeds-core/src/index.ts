import WebembedHandler from "./modules/WebembedHandler";

type WebEmbedInitOptions = {
  host: string | null,
};

async function init(incomingURL: string, options?: WebEmbedInitOptions) {
  const handler = new WebembedHandler(incomingURL, options || {});

  return handler.generateResponse();
}

export type {
  WebEmbedInitOptions,
};

export default init;
