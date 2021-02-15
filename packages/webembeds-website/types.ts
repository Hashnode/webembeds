type EmbedRequest = {
  url?: string
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
