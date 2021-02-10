import { NextApiRequest, NextApiResponse } from "next";
import webembed from "@webembeds/core";

type EmbedRequest = {
  url?: string
}

type CustomResponse = {
  data: {},
  error?: boolean | true,
  message?: string | "",
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
  const { url = "", ...restOfTheQueryParams }: EmbedRequest = req.query;
  
  const embedURL = decodeURIComponent(url);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  res.setHeader("Cache-Control", "s-maxage=2592000");

  // Twitch needs a parent url where the embed is being used.
  const host = req.headers.host;

  const embedResponse = await webembed(embedURL, { 
    host,
    queryParams: {
      ...restOfTheQueryParams,
    }
  });
  res.json({ data: embedResponse });
}
