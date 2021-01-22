const WebembedHandler = require("./modules/WebembedHandler.ts");

type Options = {
  oEmbed?: Boolean | false,
}

async function init(incomingURL: string, opts: Options = {}) {
  const handler = new WebembedHandler(incomingURL, opts);

  return handler.generateResponse();
}

module.exports = init;
