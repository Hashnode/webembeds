const cheerio = require("cheerio");

// interface MetaTagType {
//   name: string,
//   property: string,
//   type: "meta"
// }

const nodeToObject = (allNodes: [any]) => {
  const allTags = [];

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
    allTags.push(temp);

    i += 1;
    if (allNodes[i]) {
      currentNode = allNodes[i];
    } else {
      i = -1;
    }
  } while (i >= 0);

  return allTags;
};

exports.nodeToObject = nodeToObject;

// eslint-disable-next-line no-unused-vars
const extractMetaTags = ($: any) => {
  const metaTags = $.html($("meta")).toArray();
  return nodeToObject(metaTags);
};

exports.extractMetaTags = extractMetaTags;

// eslint-disable-next-line no-unused-vars
const extractLinkTags = ($: any) => {
  const linkTags = $($.html($("link"))).toArray();
  return nodeToObject(linkTags);
};

// exports.extractOEmbedContent = (metaTags: []): {
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
  height?: number,
  width?: number,
  className?: string
}

exports.wrapHTML = (htmlContent: string, customAtrributes?: CustomAtrributes) => {
  const $ = cheerio.load(htmlContent);
  let iframe = $("iframe");

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
    $("iframe").wrap("<div class=\"webembed-wrapper\" style=\"position: relative;overflow: hidden; padding-top: 56.25%;\"></div>");
  }

  // const iframeContent = $("iframe").html();

  // if (!iframeExists) {
  //   $("iframe").attr("srcdoc", iframeContent);
  // }

  return $.html();
};
