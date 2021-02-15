import { NextApiRequest, NextApiResponse } from "next";
import webembed from "@webembeds/core";

import type { EmbedRequest, CustomResponse } from "../../types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
  const { url = "", ...restOfTheQueryParams }: EmbedRequest = req.query;
  
  const embedURL = decodeURIComponent(url);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  res.setHeader("Cache-Control", "s-maxage=2592000");

  // Twitch needs a parent url where the embed is being used.
  const host = req.headers.referer;
  
  const embedResponse = await webembed(embedURL, { 
    host,
    queryParams: {
      ...restOfTheQueryParams,
    }
  });
  res.json({ data: embedResponse });
}
