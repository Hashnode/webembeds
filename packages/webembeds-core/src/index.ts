/* eslint-disable import/no-unresolved */
const handleOEmbed = require("./modules/oEmbedHandler");
const { parseURL } = require("./utils/url");

type Options = {
  oEmbed?: Boolean,
}

function init(incomingURL: string, opts: Options) {
  const { oEmbed, ...remainingOpts } = opts;

  const parsedURL = parseURL(incomingURL);

  if (oEmbed) {
    return handleOEmbed(parsedURL.embedURL, { 
      queryParams: parsedURL.queryParams,
      ...remainingOpts,
    });
  }

  return parsedURL;
}

module.exports = init;
