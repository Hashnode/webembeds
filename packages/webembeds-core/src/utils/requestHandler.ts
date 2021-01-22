const axios = require("axios");

// type RequestResponseType = {
//   hasError?: boolean | true,
//   message?: string | "",
//   data?: {}
// }

type RequestResponseType = {} | null;

exports.makeRequest = async (url: string, options: { format: "json" | "xml" }): Promise<RequestResponseType> => {
  try {
    const response = await axios.get(url, {
      params: {
        format: "json",
      },
    });
    return response;
  } catch (error) {
    console.log("Request error", !!error);
    return null;
  }
};
