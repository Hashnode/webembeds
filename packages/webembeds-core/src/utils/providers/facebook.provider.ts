import { makeRequest } from "../requestHandler";
import Platform from "../../modules/Platform";
import type { OEmbedResponseType, PlatformType } from "../../types";

const { FB_APP_TOKEN } = process.env;

export default class Facebook extends Platform {
  hasError: boolean = false;

  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
    if (!FB_APP_TOKEN) {
      this.hasError = true;
    }
  }

  run = async (): Promise<OEmbedResponseType | null> => {
    if (this.hasError) {
      return null;
    }

    const response = await makeRequest(`${this.targetURL}?url=${encodeURIComponent(this.embedURL)}&access_token=${FB_APP_TOKEN}`);
    const data = response ? response.data : null;

    if (!data) {
      return null;
    }

    return data;
  }
}

export {};
