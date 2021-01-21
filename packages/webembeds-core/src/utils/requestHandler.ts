const axios = require("axios");

type RequestResponseType = {
  hasError?: boolean | true,
  message?: string | "",
  data?: {}
}

exports.makeRequest = async (url: string, options: {}): Promise<RequestResponseType> => {
  try {
    const response = await axios.get(url, options);
    return { hasError: false, data: response?.data };
  } catch (error) {
    console.log("Request error", !!error);
    return { message: "Error making request to endpoint", data: {} };
  }
};
