import { NextApiRequest, NextApiResponse } from "next";
import UrlParse from "url-parse";

const webembed = require("@webembeds/core");

type EmbedRequest = {
  url?: string
}

type CustomResponse = {
  data: {},
  error?: boolean | true,
  message?: string | "",
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
  const { url = "" }: EmbedRequest = req.query;
  
  const embedURL = decodeURIComponent(url);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Twitch needs a parent url where the embed is being used.
  const host = req.headers.host;

  const embedResponse = await webembed.default(embedURL, { 
    host: host,
  });
  res.json({ data: embedResponse });
}
