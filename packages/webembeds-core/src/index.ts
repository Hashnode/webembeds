const WebembedHandler = require("./modules/WebembedHandler.ts");
// const handleOEmbed = require("./modules/oEmbedHandler.ts").default;
// const { parseURL } = require("./utils/url.ts");

type Options = {
  oEmbed?: Boolean | false,
}

async function init(incomingURL: string, opts: Options = {}) {
  // const { oEmbed, ...remainingOpts } = opts;
  const handler = new WebembedHandler(incomingURL, opts);

  await handler.run();

  return handler.generateResponse();

  // if (oEmbed) {
  //   return handleOEmbed(incomingURL, {
  //     queryParams: parsedURL.queryParams,
  //     ...remainingOpts,
  //   });
  // }
}

module.exports = init;
