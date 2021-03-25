/* eslint-disable no-tabs */
import request from "request";
import urlMetadata from "url-metadata";
import cheerio from "cheerio";
import fetch from "node-fetch";
import type { CustomAtrributes, OEmbedResponseType } from "../types";

const isProd = process.env.NODE_ENV === "production";

// interface MetaTagType {
//   name: string,
//   property: string,
//   type: "meta"
// }

const nodeToObject = (allNodes: [any]) => {
  const allTags: any = [];
  let i = 0;

  do {
    let currentNode = allNodes[i];
    const temp = {} as any;
    Object.keys(currentNode.attribs).forEach((key) => {
      temp[key] = currentNode.attribs[key];
    });
    temp.type = currentNode.type;
    temp.name = currentNode.name;
    temp.namespace = currentNode.namespace;

    if (temp) {
      allTags.push(temp);
    }

    i += 1;
    if (allNodes[i]) {
      currentNode = allNodes[i];
    } else {
      i = -1;
    }
  } while (i >= 0);

  return allTags;
};

// eslint-disable-next-line no-unused-vars
export const extractMetaTags = ($: any) => {
  const metaTags = $.html($("meta")).toArray();
  return nodeToObject(metaTags);
};

// eslint-disable-next-line no-unused-vars
export const extractLinkTags = ($: any) => {
  const linkTags = $($.html($("link"))).toArray();
  return nodeToObject(linkTags);
};

// export const extractOEmbedContent = (metaTags: []): {
//   oEmbed: {}, custom: {}
// } => {
//   const filteredMetaTags = metaTags.filter((tag: MetaTagType) => {
//     if (tag && tag.property && tag.property.match(/[og:].*/)) {
//       return tag;
//     }
//     return false;
//   });

//   const reformedTags: any = {};
//   filteredMetaTags.forEach((tag: MetaTagType) => {
//     const { property, ...remaining } = tag;
//     reformedTags[property.replace("og:", "")] = remaining;
//   });

//   console.log(reformedTags);

//   return {
//     oEmbed: {},
//     custom: {},
//   };
// };

export const wrapHTML = (oembedResponse: OEmbedResponseType,
  customAtrributes: CustomAtrributes = {}) => {
  const { html = "" } = oembedResponse;

  const $ = cheerio.load(html, { xmlMode: true });
  const iframe = $("iframe");

  const iframeExists = iframe.length > 0;

  const { width = "100%", height = "100%" } = customAtrributes;

  const fHeight = Number(oembedResponse.height) > 0 ? Number(oembedResponse.height) : 360;
  const fWidth = Number(oembedResponse.width) > 0 ? Number(oembedResponse.width) : 640;
  const paddingTop = fHeight / fWidth;

  if (iframeExists) {
    iframe.attr("width", String(width));
    iframe.attr("height", String(height));

    iframe.attr("style", "position: absolute; top: 0; left: 0; border: 0;");
    iframe.attr("class", "webembed-iframe");

    $("iframe").wrap(
      `<div class="webembed-wrapper" style="position: relative;overflow: hidden; padding-top: ${paddingTop * 100}%;"></div>`,
    );
  }

  return $.html();
};

/**
 * Promise based request
 * @param {*} url
 */
function doRequest(url) {
  return new Promise((resolve, reject) => {
    request.get(
      { url, encoding: "binary" },
      (error: any, imageResponse: { headers: { [x: string]: any } }, imageBody: string) => {
        if (error) {
          return reject(error);
        }
        const imageType = imageResponse.headers["content-type"];
        const base64 = new Buffer(imageBody, "binary").toString("base64");
        const dataURI = `data:${imageType};base64,${base64}`;
        const payload = {
          data: dataURI,
          isDev: process.env.NODE_ENV === "development",
        };
        const hnURL = "https://uploads.hashnode.com/api/upload";
        const cdnURL = "https://cdn.hashnode.com/";
        fetch(hnURL, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Cloudmate-Authorization": process.env.cloudmateKey || "",
            Accept: "*/*",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.Key) {
              console.log("No cloudmate key");
              return;
            }
            const imageUrl = cdnURL + data.Key;
            resolve(imageUrl);
          });
      },
    );
  });
}

export const wrapFallbackHTML = async (data: urlMetadata.Result) => {
  let mainURL;

  const desc = data["og:description"] || data.description;
  let coverImage: any = data["og:image"] || data.image;

  if (isProd) {
    // Download the image and upload to our CDN
    coverImage = (await doRequest(coverImage)) || coverImage;
  }

  try {
    mainURL = new URL(data["og:url"] || data.url).hostname;
  } catch (error) {
    mainURL = "/";
  }

  const description = `${desc.substring(0, 150)}${
    desc.length > 150 ? "..." : ""
  }`;

  return `<html lang="en">
		<head>
		<style>
    body,
    html {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif
    }

    * {
      margin: 0;
      padding: 0
    }

    .link-card {
      width: 100%;
      background: #eee;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-direction: row;
      flex-direction: row;
      border-radius: 4px;
      border: 1px solid #ddd;
      overflow: hidden;
      text-decoration: none!important;
      align-items: center;
    }

    .link-card .link-content {
      padding: 12px;
      width: calc(100% - 300px)
    }

    .link-card .link-content .big-text {
      display: block;
      font-size: 22px;
      font-weight: 600;
      color: #212121;
      margin-bottom: 8px
    }

    .link-card .link-content .small-desc {
      font-size: 16px;
      color: #454545;
      display: block;
      margin-bottom: 8px
    }

    .link-card .link-content .small-desc.host-name {
      color: #999
    }

    .link-card .link-image {
      display: block;
      width: 300px;
      height: 230px;
      background-color: #fefefe;
      background-size: cover;
      background-position: center center
    }

    @media (max-width:768px) {
      .link-card {
        -ms-flex-wrap: wrap;
        flex-wrap: wrap
      }
      .link-card .link-image {
        width: 100%!important;
        display: block;
      }
      .link-card .link-image img{
        margin-top: 0!important;
        margin-bottom: 0!important;
      }
      .link-card .link-content {
        width: 100%!important;
      }
    }

    @media (max-width:425px) {
      .link-card .link-image {
        width: 100%;
      }
    }
		</style>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
			<title>${data["og:title"] || data.title}</title>
		</head>
		<body>
			<a href="${data["og:url"] || data.url}" target="_blank" class="link-card">
        <div class="link-image" style="background-image: url('${coverImage}?w=1600&h=840&fit=crop&crop=entropy&auto=format,enhance&q=60')">
          <!-- <img src="${coverImage}?w=1600&h=840&fit=crop&crop=entropy&auto=format,enhance&q=60" /> -->
        </div>
				<div class="link-content">
					<span class="big-text">${data["og:title"] || data.title}</span>
					<span class="small-desc">${description}</span>
					<span class="small-desc host-name">${mainURL !== "/" ? mainURL : ""}</span>
				</div>
			</a>
		</body>
	</html>
	`;
};
