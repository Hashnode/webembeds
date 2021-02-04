import Platform, { OEmbedResponseType } from "../../modules/Platform";

export default class Twitch extends Platform {
  // eslint-disable-next-line no-useless-constructor

  run = async (): Promise<OEmbedResponseType> => {
    const { host = null } = this.options;

    let parentURL = "localhost";

    if (host) {
      parentURL = host.indexOf("localhost") !== -1 ? "localhost" : host;
    }

    try {
      const url = new URL(this.embedURL);
      let href = `https://player.twitch.tv/?autoplay=false&parent=${parentURL}`;
      // Supports
      // Channel Ex, https://www.twitch.tv/lck
      // Video Ex: https://www.twitch.tv/videos/668650517
      // Clips Ex: https://www.twitch.tv/loltyler1/clip/CooperativeSpikyScorpionOptimizePrime

      if (url.pathname.indexOf("/videos") === 0) {
        href += (`&video=${url.pathname.substring(url.pathname.indexOf("/videos") + 7).replace(/\//g, "")}`);
      } else if (url.pathname.includes("/clip")) {
        const clipId = url.pathname.substring(url.pathname.indexOf("/clip") + 5).replace(/\//g, "");
        url.hostname = "clips.twitch.tv";
        url.pathname = "embed";
        url.searchParams.set("clip", clipId);
        url.searchParams.set("parent", parentURL);
        url.searchParams.set("autoplay", "false");
        href = url.toString();
      } else {
        const channelName = new URL(this.embedURL).pathname.replace(/\//g, "");
        href += `&channel=${channelName}`;
      }

      return {
        version: 0.1,
        type: "rich",
        title: "Twitch",
        html: `<iframe src="${href}" frameborder="0" allowfullscreen="true" 
        scrolling="no" height="378" width="620" allow="encrypted-media"></iframe>`,
      };
    } catch (error) {
      return null;
    }
  }
}
