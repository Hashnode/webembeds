import { NextApiRequest, NextApiResponse } from "next";

const webembed = require("@webembeds/core");

type EmbedRequest = {
  url?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const { url = "" }: EmbedRequest = req.query;
  const embedURL = decodeURIComponent(url);
  res.setHeader("Content-Type", "text/html");
  const embedResponse = await webembed(embedURL);

  if (embedResponse.output.html) {
    return res.send(embedResponse.output.html);
  }

  if (embedResponse.output.url) {
    return res.send(`<iframe src="${embedResponse.output.url}"/>`);
  }

  if (embedResponse.output) {
    return res.send(embedResponse.output);
  }

  res.send("Nothing");
}
