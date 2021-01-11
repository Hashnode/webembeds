const cheerio = require("cheerio");
const RequestHandler = require("../utils/requestHandler.ts");
const PlatformHandler = require("./PlatformHandler.ts");

/* eslint-disable camelcase */
type OEmbedResponseType = {
  type: "photo" | "video" | "link" | "rich",
  version: 0.1,
  title: string,
  author_name?: string,
  author_url?: string,
  provider_name?: string,
  provider_url?: string,
  cache_age?: number,
  thumbnail_url?: string,
  // The width of the optional thumbnail.
  // If this parameter is present, thumbnail_url and thumbnail_height must also be present.
  thumbnail_width?: string,
  // The height of the optional thumbnail.
  // If this parameter is present, thumbnail_url and thumbnail_width must also be present.
  thumbnail_height?: string,
};

const processData = (url: string, data: any) => {
  const $ = cheerio.load(data);

  const platformHandler = new PlatformHandler(url, { htmlNode: $ });

  return platformHandler.generate();
};

const oEmbedHandler = async (url: string, opts: object = {}): Promise<OEmbedResponseType> => {
  const request = new RequestHandler(url, opts);

  const response = await request.makeRequest();

  if (!response.hasError) {
    const data = await processData(url, response.data);
    return data;
  }

  return {
    type: "video",
    title: "",
    version: 0.1,
  };
};

export default oEmbedHandler;
