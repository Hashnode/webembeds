const WebembedHandler = require("./modules/WebembedHandler.ts");

type Options = {
  oEmbed?: Boolean | false,
}

async function init(incomingURL: string, opts: Options = {}) {
  const handler = new WebembedHandler(incomingURL, opts);

  await handler.run();

  return handler.generateResponse();
}

module.exports = init;
