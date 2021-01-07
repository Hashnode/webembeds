/* eslint-disable camelcase */
type OEmbedResponseType = {
  type: "photo" | "video" | "link" | "rich",
  version: "0.1",
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

const oEmbedHandler = (url: string, opts: object): OEmbedResponseType => {
  const ver = "0.1";

  return {
    type: "video",
    version: ver,
  };
};

module.exports = oEmbedHandler;
