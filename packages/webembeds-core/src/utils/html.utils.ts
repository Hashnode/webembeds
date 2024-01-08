/* eslint-disable no-useless-escape */
/* eslint-disable no-tabs */
import urlMetadata from "url-metadata";
import cheerio from "cheerio";
import type { CustomAtrributes, OEmbedResponseType } from "../types";
import { fetchGraphQL } from "./graphql";

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

async function uploadImageByUrl(url: string) {
  let properURL: URL;
  try {
    properURL = new URL(url);
    if (properURL.hostname.includes("hashnode.com") || properURL.hostname.includes("images.unsplash.com")) {
      return url;
    }
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }

  const { data, errors } = await fetchGraphQL({
    query: `
      mutation UploadImageByURL($input: UploadImageInput!) {
        uploadImageByURL(input: $input) {
          imageURL
        }
      }
    `,
    variables: {
      input: {
        url: properURL.toString(),
      },
    },
  });

  if (!data || !data.uploadImageByURL?.imageURL || !!errors) {
    console.error("Unexpected response uploading image", { data, errors });
    throw new Error("Error uploading image");
  }

  return data.uploadImageByURL.imageURL;
}

export const wrapFallbackHTML = async (data: urlMetadata.Result) => {
  let mainURL;
  let isGitHubLink = false;

  const desc = data["og:description"] || data.description;
  let coverImage: any = data["og:image"] || data.image;

  if (isProd) {
    // Download the image and upload to our CDN
    coverImage = (await uploadImageByUrl(coverImage)) || coverImage;
  }

  try {
    mainURL = new URL(data["og:url"] || data.url).hostname;
  } catch (error) {
    mainURL = "/";
  }

  const description = `${desc.substring(0, 150)}${
    desc.length > 150 ? "..." : ""
  }`;

  if (mainURL.includes("github.com")) {
    isGitHubLink = true;
  }

  return `
      <style>
        .webembed-fallback-card *,.webembed-fallback-card ::after,.webembed-fallback-card ::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}.webembed-fallback-card{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal}.webembed-fallback-card h1,.webembed-fallback-card h2,.webembed-fallback-card h3,.webembed-fallback-card h4,.webembed-fallback-card h5,.webembed-fallback-card h6{font-size:inherit;font-weight:inherit}.webembed-fallback-card blockquote,.webembed-fallback-card dd,.webembed-fallback-card dl,.webembed-fallback-card figure,.webembed-fallback-card h1,.webembed-fallback-card h2,.webembed-fallback-card h3,.webembed-fallback-card h4,.webembed-fallback-card h5,.webembed-fallback-card h6,.webembed-fallback-card hr,.webembed-fallback-card p{margin:0}.webembed-fallback-card a{color:inherit;text-decoration:none}.webembed-fallback-card button{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}.webembed-fallback-card button{text-transform:none}.webembed-fallback-card [type=button],.webembed-fallback-card button{-webkit-appearance:button;background-color:transparent;background-image:none}.webembed-fallback-card [role=button],.webembed-fallback-card button{cursor:pointer}.webembed-fallback-card audio,.webembed-fallback-card canvas,.webembed-fallback-card embed,.webembed-fallback-card iframe,.webembed-fallback-card img,.webembed-fallback-card object,.webembed-fallback-card svg,.webembed-fallback-card video{display:block;vertical-align:middle}.webembed-fallback-card img,.webembed-fallback-card video{max-width:100%;height:auto}.webembed-fallback-card *,.webembed-fallback-card ::after,.webembed-fallback-card ::before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}.webembed-fallback-card ::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}.webembed-fallback-card .tw-we-line-clamp-1	{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;}.webembed-fallback-card .tw-we-line-clamp-2	{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;}.webembed-fallback-card .tw-we-line-clamp-3	{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;}.webembed-fallback-card.tw-we-container{width:100%}@media (min-width:640px){.webembed-fallback-card.tw-we-container{max-width:640px}}@media (min-width:768px){.webembed-fallback-card.tw-we-container{max-width:768px}}@media (min-width:1024px){.webembed-fallback-card.tw-we-container{max-width:1024px}}@media (min-width:1280px){.webembed-fallback-card.tw-we-container{max-width:1280px}}@media (min-width:1536px){.webembed-fallback-card.tw-we-container{max-width:1536px}}.webembed-fallback-card .tw-we-col-span-12{grid-column:span 12/span 12}.webembed-fallback-card.tw-we-mx-auto{margin-left:auto;margin-right:auto}.webembed-fallback-card .tw-we-mb-1{margin-bottom:.25rem}.webembed-fallback-card .tw-we-mb-2{margin-bottom:.5rem}.webembed-fallback-card .tw-we-mb-4{margin-bottom:1rem}.webembed-fallback-card .tw-we-mr-0{margin-right:0}.webembed-fallback-card .tw-we-block{display:block}.webembed-fallback-card .tw-we-flex{display:flex}.webembed-fallback-card .tw-we-grid{display:grid}.webembed-fallback-card .tw-we-gap-4{gap:1rem}.webembed-fallback-card .tw-we-h-52{height:13rem}.webembed-fallback-card .tw-we-h-4{height:1rem}.webembed-fallback-card .tw-we-w-full{width:100%}.webembed-fallback-card .tw-we-w-4{width:1rem}.webembed-fallback-card .tw-we-grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.webembed-fallback-card .tw-we-flex-row{flex-direction:row}.webembed-fallback-card .tw-we-flex-col{flex-direction:column}.webembed-fallback-card .tw-we-items-start{align-items:flex-start}.webembed-fallback-card .tw-we-items-center{align-items:center}.webembed-fallback-card .tw-we-items-stretch{align-items:stretch}.webembed-fallback-card .tw-we-justify-between{justify-content:space-between}.webembed-fallback-card .tw-we-overflow-hidden{overflow:hidden}.webembed-fallback-card .tw-we-rounded-xl{border-radius:.75rem}.webembed-fallback-card .tw-we-border{border-width:1px}.webembed-fallback-card .tw-we-border-slate-200{--tw-border-opacity:1;border-color:rgb(226 232 240 / var(--tw-border-opacity))}.webembed-fallback-card .tw-we-bg-cover{background-size:cover}.webembed-fallback-card .tw-we-bg-center{background-position:center}.webembed-fallback-card .tw-we-bg-left{background-position:left}.webembed-fallback-card .tw-we-fill-current{fill:currentColor}.webembed-fallback-card .tw-we-py-10,.webembed-fallback-card.tw-we-py-10{padding-top:2.5rem;padding-bottom:2.5rem;}.webembed-fallback-card .tw-we-py-10{padding-top:4rem;padding-bottom:4rem;}.webembed-fallback-card .tw-we-p-4{padding:1rem;}.webembed-fallback-card .tw-we-py-5{padding-top:1.25rem;padding-bottom:1.25rem}.webembed-fallback-card .tw-we-px-4{padding-left:1rem;padding-right:1rem}.webembed-fallback-card .tw-we-bg-white{background:white}.webembed-fallback-card .tw-we-text-base{font-size:1rem;line-height:1.5rem}.webembed-fallback-card .tw-we-text-lg{font-size:1.125rem;line-height:1.75rem}.webembed-fallback-card .tw-we-font-semibold{font-weight:600}.webembed-fallback-card .tw-we-text-slate-800{--tw-text-opacity:1;color:rgb(30 41 59 / var(--tw-text-opacity))}.webembed-fallback-card .tw-we-text-slate-600{--tw-text-opacity:1;color:rgb(71 85 105 / var(--tw-text-opacity))}.webembed-fallback-card .tw-we-transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms}.webembed-fallback-card .hover-tw-we-border-slate-300:hover{--tw-border-opacity:1;border-color:rgb(203 213 225 / var(--tw-border-opacity))}.webembed-fallback-card .tw-we-group:hover .group-hover:tw-we-text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235 / var(--tw-text-opacity))}.webembed-fallback-card .tw-we-group:hover .group-hover:tw-we-underline{text-decoration-line:underline}@media (min-width:768px){.webembed-fallback-card .md-tw-we-flex-row{flex-direction:row}.webembed-fallback-card .md-tw-we-line-clamp-2	{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;}.webembed-fallback-card .md-tw-we-mr-4{margin-right:1rem}.webembed-fallback-card .md-tw-we-col-span-4{grid-column:span 4/span 4}.webembed-fallback-card .md-tw-we-col-span-8{grid-column:span 8/span 8}}.webembed-fallback-card .fallback-embed-image-container{height:211px;}@media (min-width:640px){.webembed-fallback-card .fallback-embed-image-container{width:100%;height:240px;}}@media (min-width:768px){.webembed-fallback-card .fallback-embed-image-container{min-width:295px;width:295px;height:199px;}}
      </style>

      <div class="webembed-fallback-card tw-we-container tw-we-mx-auto tw-we-py-10">
        <a
          target="_blank"
          rel="noopener"
          href=${data["og:url"] || data.url}
          class="tw-we-w-full tw-we-group hover-tw-we-border-slate-300 tw-we-bg-white tw-we-text-slate-800 tw-we-p-4 tw-we-flex tw-we-gap-4 tw-we-flex-col md-tw-we-flex-row tw-we-border tw-we-border-slate-200 tw-we-rounded-xl tw-we-overflow-hidden"
        >
          <div
            class="fallback-embed-image-container ${isGitHubLink ? "tw-we-bg-left" : "tw-we-bg-center"} tw-we-bg-cover tw-we-border tw-we-border-slate-200 tw-we-h-52 tw-we-rounded-xl tw-we-overflow-hidden"
            style="background-image: url('${coverImage}?w=1600&h=840&fit=crop&crop=entropy&auto=format,enhance&q=60')"
          ></div>
          <div
            class="tw-we-py-1 tw-we-flex tw-we-flex-col tw-we-items-start tw-we-items-stretch tw-we-justify-between"
          >
            <div>
              <p class="tw-we-text-lg tw-we-font-semibold tw-we-mb-4 tw-we-line-clamp-3">
              ${data["og:title"] || data.title}
              </p>
              <p class="tw-we-text-slate-600 tw-we-text-base tw-we-mb-4 tw-we-line-clamp-1 md-tw-we-line-clamp-2">
              ${description}
              </p>
            </div>
            <div class="tw-we-flex tw-we-flex-row tw-we-items-center tw-we-w-full">
              <p
                class="tw-we-text-slate-600 tw-we-text-base group-hover:tw-we-text-blue-600 group-hover:tw-we-underline tw-we-transition tw-we-duraton-100"
              >
              ${mainURL !== "/" ? mainURL : ""}
              </p>
            </div>
          </div>
        </a>
      </div>
	`;
};
