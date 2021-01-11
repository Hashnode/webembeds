const handleOEmbed = require("./modules/oEmbedHandler.ts").default;
const { parseURL } = require("./utils/url.ts");

type Options = {
  oEmbed?: Boolean | false,
}

function init(incomingURL: string, opts: Options = {}): void {
  const { oEmbed, ...remainingOpts } = opts;

  const parsedURL = parseURL(incomingURL);

  if (oEmbed) {
    return handleOEmbed(incomingURL, {
      queryParams: parsedURL.queryParams,
      ...remainingOpts,
    });
  }

  return parsedURL;
}

module.exports = init;
