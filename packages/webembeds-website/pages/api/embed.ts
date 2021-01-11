import { NextApiRequest, NextApiResponse } from "next";
// import webembed from "@webembeds/core";

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
  console.log("url", embedURL);
  res.setHeader("Content-Type", "application/json");
  const embedResponse = await webembed(embedURL, { oEmbed: true });
  res.json({
    data: JSON.stringify(embedResponse),
    error: false,
  });
}
