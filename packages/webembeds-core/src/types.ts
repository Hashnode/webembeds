type OembedRequestQueryParamsType = { [key: string]: string | number };

/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
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
  html?: string,
  width?: number,
  height?: number,
};

type WebEmbedInitOptions = {
  host?: string | null,
  queryParams: {},
};

type Provider = {
  custom? : boolean,
  customClass?: any,
  discover: boolean,
  noCustomWrap: boolean,
}

type PlatformType = {
  provider: Provider | null,
  targetURL?: string,
  embedURL: string,
  options: WebEmbedInitOptions,
  queryParams: {},
};

type EmbedErrorType = {
  type: "request-error",
  html?: string | null,
  message: string,
  code?: number,
};

type ProviderDetails = {
  provider: Provider | null,
  targetURL: string,
};

type RequestResponseType = {
  data: OEmbedResponseType
} | null;

type APIResponse = {
  error?: boolean | true,
  data?: {} | null,
  message?: null
};

type CustomAtrributes = {
  height?: number | string;
  width?: number | string;
  className?: string;
};

export type {
  OEmbedResponseType,
  PlatformType,
  OembedRequestQueryParamsType,
  EmbedErrorType,
  ProviderDetails,
  WebEmbedInitOptions,
  RequestResponseType,
  APIResponse,
  CustomAtrributes,
  Provider,
};
