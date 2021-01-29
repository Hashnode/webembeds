import WebembedHandler from "./modules/WebembedHandler";

// type Options = {
//   oEmbed?: Boolean | false,
// }

async function init(incomingURL: string) {
  const handler = new WebembedHandler(incomingURL);

  return handler.generateResponse();
}

export default init;
