import { NextApiRequest, NextApiResponse } from "next";

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
  // res.setHeader("Content-Type", "text/html");
  const embedResponse = await webembed.default(embedURL);
  res.json({ data: embedResponse });
}
