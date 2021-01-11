const templates = require("../templates/index.ts");
const { extractMetaTags } = require("../utils/common.ts");

interface MetaTagType {
  name: string,
  property: string,
  type: "meta"
}

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

// eslint-disable-next-line no-unused-vars
type GenerateOEmbedOutputFuncType = (x: []) => OEmbedResponseType;

interface PlatformType {
  generateOEmbedOutput: GenerateOEmbedOutputFuncType;
  allowedPatterns: [],
  matches: any
  generate: any
}

class PlatformHandler {
  url: string;

  htmlNode: Element;

  extractors: {} | null;

  constructor(url: string, opts: { extractors: {} | null, htmlNode: Element }) {
    this.url = url;
    this.extractors = opts.extractors || null;
    this.htmlNode = opts.htmlNode;
  }

  detectPlatform = (): PlatformType | null => {
    let platform = null;
    Object.keys(templates).forEach((key: string) => {
      if (templates[key].matches(this.url)) {
        platform = templates[key];
      }
    });
    return platform;
  }

  generate = (): OEmbedResponseType | null => {
    const metaTags = extractMetaTags(this.htmlNode);

    const filteredMetaTags = metaTags.filter((tag: MetaTagType) => {
      if (tag && tag.property && tag.property.match(/[og:].*/)) {
        return tag;
      }
      return false;
    });

    const reformedTags: any = {};
    filteredMetaTags.forEach((tag: MetaTagType) => {
      const { property, ...remaining } = tag;
      reformedTags[property.replace("og:", "")] = remaining;
    });

    const platform = this.detectPlatform();

    return platform ? platform.generateOEmbedOutput(reformedTags) : null;
  }
}

module.exports = PlatformHandler;
