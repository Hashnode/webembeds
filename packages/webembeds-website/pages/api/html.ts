import { NextApiRequest, NextApiResponse } from "next";
import webembed from "@webembeds/core";

import type { EmbedRequest } from "../../types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const { url = "" }: EmbedRequest = req.query;
  const embedURL = decodeURIComponent(url);
  const embedResponse = await webembed(embedURL);
  
  res.setHeader("Content-Type", "text/html; charset='utf-8'");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (embedResponse.output) {
    if (embedResponse.output.html) {
      return res.send(embedResponse.output.html);
    }
  
    if (embedResponse.output.provider_url) {
      return res.send(`<iframe src="${embedResponse.output.provider_url}"/>`);
    }
  }
  
  res.send("Not available");
}
