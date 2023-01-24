/* eslint-disable no-useless-escape */
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
          isDev: process.env.NODE_ENV !== "production",
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
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
			<title>${data["og:title"] || data.title}</title>
      <style>
        *,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,::after,::before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}::-webkit-backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}.tw-container{width:100%}@media (min-width:640px){.tw-container{max-width:640px}}@media (min-width:768px){.tw-container{max-width:768px}}@media (min-width:1024px){.tw-container{max-width:1024px}}@media (min-width:1280px){.tw-container{max-width:1280px}}@media (min-width:1536px){.tw-container{max-width:1536px}}.tw-col-span-12{grid-column:span 12/span 12}.tw-mx-auto{margin-left:auto;margin-right:auto}.tw-mb-1{margin-bottom:.25rem}.tw-mb-2{margin-bottom:.5rem}.tw-mr-2{margin-right:.5rem}.tw-block{display:block}.tw-flex{display:flex}.tw-grid{display:grid}.tw-h-56{height:14rem}.tw-h-4{height:1rem}.tw-w-full{width:100%}.tw-w-4{width:1rem}.tw-grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.tw-flex-row{flex-direction:row}.tw-flex-col{flex-direction:column}.tw-items-start{align-items:flex-start}.tw-items-center{align-items:center}.tw-items-stretch{align-items:stretch}.tw-justify-between{justify-content:space-between}.tw-overflow-hidden{overflow:hidden}.tw-rounded{border-radius:.25rem}.tw-border{border-width:1px}.tw-border-r{border-right-width:1px}.tw-border-slate-200{--tw-border-opacity:1;border-color:rgb(226 232 240 / var(--tw-border-opacity))}.tw-bg-slate-50{--tw-bg-opacity:1;background-color:rgb(248 250 252 / var(--tw-bg-opacity))}.tw-bg-cover{background-size:cover}.tw-bg-center{background-position:center}.tw-fill-current{fill:currentColor}.tw-py-10{padding-top:2.5rem;padding-bottom:2.5rem}.tw-px-5{padding-left:1.25rem;padding-right:1.25rem}.tw-py-4{padding-top:1rem;padding-bottom:1rem}.tw-text-2xl{font-size:1.5rem;line-height:2rem}.tw-text-lg{font-size:1.125rem;line-height:1.75rem}.tw-font-bold{font-weight:700}.tw-text-slate-900{--tw-text-opacity:1;color:rgb(15 23 42 / var(--tw-text-opacity))}.tw-text-slate-500{--tw-text-opacity:1;color:rgb(100 116 139 / var(--tw-text-opacity))}.tw-shadow-md{--tw-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1),0 2px 4px -2px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.tw-transition{transition-property:color,background-color,border-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-text-decoration-color,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-text-decoration-color,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms}.hover\:tw-border-slate-900:hover{--tw-border-opacity:1;border-color:rgb(15 23 42 / var(--tw-border-opacity))}.tw-group:hover .group-hover\:tw-text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235 / var(--tw-text-opacity))}.tw-group:hover .group-hover\:tw-underline{-webkit-text-decoration-line:underline;text-decoration-line:underline}@media (min-width:768px){.md\:tw-col-span-4{grid-column:span 4/span 4}.md\:tw-col-span-8{grid-column:span 8/span 8}}
      </style>
		</head>
		<body>
      <div class="tw-container tw-mx-auto tw-py-10">
        <a
          href="#"
          class="tw-w-full tw-group hover:tw-border-slate-900 tw-text-slate-900 tw-grid tw-border tw-border-slate-200 tw-grid-cols-12 tw-bg-slate-50 tw-shadow-md tw-rounded tw-overflow-hidden"
        >
          <div
            class="tw-col-span-12 md:tw-col-span-4 tw-border-r tw-bg-center tw-border-slate-200 tw-bg-cover tw-h-56"
            style="
              background-image: url('https://images.unsplash.com/photo-1639322537231-2f206e06af84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80');
            "
          ></div>
          <div
            class="tw-col-span-12 md:tw-col-span-8 tw-px-5 tw-py-4 tw-flex tw-flex-col tw-items-start tw-items-stretch tw-justify-between"
          >
            <div>
              <p class="tw-text-2xl tw-font-bold tw-mb-1">
              ${data["og:title"] || data.title}
              </p>
              <p class="tw-text-lg tw-text-slate-500 tw-mb-2">
              ${description}
              </p>
            </div>
            <div class="tw-flex tw-flex-row tw-items-center tw-w-full">
              <span
                class="tw-text-slate-500 tw-block tw-mr-2 group-hover:tw-text-blue-600 tw-transition tw-duraton-100"
              >
                <svg viewBox="0 0 512 512" class="tw-w-4 tw-h-4 tw-fill-current">
                  <path
                    d="M336 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h121.4L212.7 276.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L480 54.6V176c0 8.8 7.2 16 16 16s16-7.2 16-16V16c0-8.8-7.2-16-16-16H336zM64 64C28.7 64 0 92.7 0 128v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V304c0-8.8-7.2-16-16-16s-16 7.2-16 16v144c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h144c8.8 0 16-7.2 16-16s-7.2-16-16-16H64z"
                  />
                </svg>
              </span>
              <p
                class="tw-text-lg tw-text-slate-500 group-hover:tw-text-blue-600 group-hover:tw-underline tw-transition tw-duraton-100"
              >
              ${mainURL !== "/" ? mainURL : ""}
              </p>
            </div>
          </div>
        </a>
      </div>
		</body>
	</html>
	`;
};
