import axios from "axios";
import { info as FastImage } from "fastimage";
import urlMetaData, { Result } from "url-metadata";
import type { RequestResponseType } from "../types";

export const makeRequest = async (url: string): Promise<RequestResponseType> => {
  try {
    const response = await axios.get(url, {
      params: {
        format: "json",
      },
      headers: {
        // eslint-disable-next-line max-len
        // "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36",
        // Connection: "keep-alive",
        // Accept: "*/*",
        // "accept-encoding": "gzip, deflate, br",
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};

// eslint-disable-next-line max-len
export const getMetaData = (url: string): Promise<Result> => new Promise((resolve, reject) => {
  urlMetaData(url).then(
    (metadata: urlMetaData.Result) => { // success handler
      console.log("fall", metadata);
      // if (!metadata["og:image:width"] || !metadata["og:image:height"]) {
      // FastImage(metadata["og:image"], (error: any, imageData: any): any => {
      //   if (error) {
      //     console.log(error);
      //     return resolve(metadata);
      //   }
      //   const newMetaData = metadata;
      //   if (imageData) {
      //     newMetaData["og:image:width"] = imageData.width;
      //     newMetaData["og:image:height"] = imageData.height;
      //   }
      //   return resolve(newMetaData);
      // });
      // }
      resolve(metadata);
    },
    (error) => { // failure handler
      console.log(error);
      reject(error);
    },
  );
});
