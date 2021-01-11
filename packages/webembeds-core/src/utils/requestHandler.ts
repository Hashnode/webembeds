const axios = require("axios");

type RequestResponseType = {
  hasError?: boolean | true,
  message?: string | "",
  data?: {}
}

class RequestHandler {
  url: string

  options: {}

  response?: any

  error?: any

  events = []

  constructor(url: string, opts: any) {
    this.url = url;
    this.options = opts;
  }

  makeRequest = async (): Promise<RequestResponseType> => {
    try {
      const response = await axios.get(this.url, this.options);
      this.response = response;
      return { hasError: false, data: this.response?.data };
    } catch (error) {
      console.log(error);
      this.error = error;
      return { message: "Error making request to endpoint", data: {} };
    }
  }
}

module.exports = RequestHandler;
