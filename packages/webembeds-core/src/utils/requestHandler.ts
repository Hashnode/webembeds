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
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36",
        Connection: "keep-alive",
        Accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
      },
    });
    return response;
  } catch (error) {
    console.log("Request error", !!error);
    return null;
  }
};
