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
  // res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Type", "text/html");
  const embedResponse = await webembed(embedURL, { oEmbed: true });
  res.send(embedResponse.oEmbed.html);
  // res.json({
  //   data: embedResponse,
  //   error: false,
  // });
}
