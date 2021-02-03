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
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Twitch needs a parent url where the embed is being used.
  const host = req.headers.host;

  const _url = new UrlParse(embedURL, true);
  const urlOnly = `${_url.protocol}//${_url.host}${_url.pathname}`;
  const queryParams = _url.query;

  const embedResponse = await webembed.default(urlOnly, { 
    host: host,
    queryParams: queryParams,
  });
  res.json({ data: embedResponse });
}
