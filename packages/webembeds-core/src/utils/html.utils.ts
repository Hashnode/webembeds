/* eslint-disable no-tabs */
import request from "request";
import urlMetadata from "url-metadata";
import cheerio from "cheerio";
import fetch from "node-fetch";

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

type CustomAtrributes = {
	height?: number;
	width?: number;
	className?: string;
};

export const wrapHTML = (htmlContent: string, customAtrributes?: CustomAtrributes) => {
  const $ = cheerio.load(htmlContent);
  const iframe = $("iframe");

  const iframeExists = iframe.length > 0;

  // const { width, height } = attribs;

  // const aspectRatio = Number(width) / Number(height);

  // Custom attributes support
  // const { attribs } = $(iframe)[0];
  // const finalAttributesIframe = {
  //   ...attribs,
  //   ...customAttributes,
  //   height: null,
  //   width: null,
  // };
  // iframe.attr(finalAttributesIframe);

  // if (!iframeExists) {
  //   iframe = $.root().wrapInner("<iframe></iframe>");
  //   iframe = $("iframe");
  // }

  // return "";
  // // eslint-disable-next-line quotes

  if (iframeExists) {
    iframe.attr("width", "100%");
    iframe.attr("height", "100%");
    iframe.attr("style", "position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;");
    iframe.attr("class", "webembed-iframe");
    $("iframe").wrap(
      "<div class=\"webembed-wrapper\" style=\"position: relative;overflow: hidden; padding-top: 56.25%;\"></div>",
    );
  }

  // const iframeContent = $("iframe").html();

  // if (!iframeExists) {
  //   $("iframe").attr("srcdoc", iframeContent);
  // }

  return $.html();
};

/**
 * Promise based request
 * @param {*} url
 */
function doRequest(url) {
  return new Promise((resolve, reject) => {
    request.get({ url, encoding: "binary" }, (
      error: any,
      imageResponse: { headers: { [x: string]: any; }; },
      imageBody: string,
    ) => {
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
    });
  });
}

export const wrapFallbackHTML = async (data: urlMetadata.Result) => {
	const coverImage = (await doRequest(data["og:image"])) || data["og:image"]; // Download the image and upload to our CDN
	let mainURL;

	try {
		mainURL = new URL(data["og:url"]).hostname;
	} catch (error) {
		mainURL = "/";
	}

	const description = `${data["og:description"].substring(0, 150)}${data["og:description"].length > 150 ? "..." : ""}`;

	return `<html lang="en">
		<head>
		<style>
		body,html{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif}*{margin:0;padding:0}.link-card{width:100%;background:#eee;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;border-radius:4px;border:1px solid #ddd;overflow:hidden;text-decoration:none}.link-card .link-content{padding:12px;width:calc(100% - 300px)}.link-card .link-content .big-text{display:block;font-size:22px;font-weight:600;color:#212121;margin-bottom:8px}.link-card .link-content .small-desc{font-size:16px;color:#454545;display:block;margin-bottom:8px}.link-card .link-content .small-desc.host-name{color:#999}.link-card .link-image{display:block;width:300px;height:158px;background-color:#fefefe;background-size:cover;background-position:center center}@media (max-width:768px){.link-card{-ms-flex-wrap:wrap;flex-wrap:wrap}.link-card .link-image{width:100%;height:250px}.link-card .link-content{width:100%}}@media (max-width:425px){.link-card .link-image{width:100%;height:255px}}
		</style>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
			<title>${data["og:title"]}</title>
		</head>
		<body>
			<a href="${data["og:url"]}" target="_blank" class="link-card">
				<div
					class="link-image"
					style="background-image: url('${coverImage}?w=1600&h=840&fit=crop&crop=entropy&auto=format,enhance&q=60');
						background-size: cover;"
				></div>
				<div class="link-content">
					<span class="big-text">${data["og:title"]}</span>
					<span class="small-desc">${description}</span>
					<span class="small-desc host-name">${mainURL}</span>
				</div>
			</a>
		</body>
	</html>
	`
};
