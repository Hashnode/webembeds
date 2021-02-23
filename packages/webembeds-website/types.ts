type EmbedRequest = {
  url?: string,
  customHost?: string,
}

type CustomResponse = {
  data: {},
  error?: boolean | true,
  message?: string | "",
}

export type {
  EmbedRequest,
  CustomResponse,
};
