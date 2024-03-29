import sanitizeHtml from "sanitize-html";

import Platform from "../../modules/Platform";
import type { OEmbedResponseType, PlatformType } from "../../types";

export default class Opensea extends Platform {
  // eslint-disable-next-line no-useless-constructor
  constructor(args: PlatformType) {
    super(args);
  }

  run = async (): Promise<OEmbedResponseType> => {
    const url = new URL(this.embedURL);
    url.searchParams.set("embed", "true");

    let html = "";

    if (url.pathname.includes("/assets")) {
      const pathnameChunks = url.pathname.split("/");

      const hasNetwork = pathnameChunks.length === 5;
      const network = hasNetwork ? pathnameChunks[2] : "mainnet";
      const contractAddress = hasNetwork ? pathnameChunks[3] : pathnameChunks[2];
      const tokenId = hasNetwork ? pathnameChunks[4] : pathnameChunks[3];

      html = `<nft-card
        contractAddress="${sanitizeHtml(contractAddress)}"
        tokenId="${sanitizeHtml(tokenId)}"
        network="${sanitizeHtml(network)}"
      >
      </nft-card>
      <script src="https://unpkg.com/embeddable-nfts/dist/nft-card.min.js"></script>`;
    } else {
      html = `<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="${url.toString()}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid #d1d1d1"></iframe></div>`;
    }

    return {
      version: 0.1,
      type: "rich",
      title: "Opensea",
      html,
    };
  };
}
